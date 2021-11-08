import PubSub from 'pubsub-js';
import {isToday, isTomorrow, addWeeks, isBefore} from 'date-fns';

import eventTypes from '../eventTypes.js';
import helpers from '../helpers.js';

import TodoCollections from '../todoCollections.js';
import TodoElem from './todoElem.js';

const todos = (() => {
  const showTodos = (msg, data) => {
    if (Number.isInteger(data.collectionId)) {
      currentCollection = collections[data.collectionId];
    } else if (data.category) {
      currentCollection = categories[data.category]();
    } else return;

    const todosElem = createTodos(currentCollection);
    helpers.clearElement(dom.content);
    dom.content.appendChild(todosElem);
  };

  const createTodos = collection => {
    let todoElems = getTodoElems(collection, 'Upcoming', todo => !todo.completed);

    let completedTodoElems = getTodoElems(collection, 'Completed', todo => todo.completed);

    let header = document.createElement('h2');
    header.textContent = collection.name;
    header.className = 'todo-section__header';

    let wrapper = document.createElement('section');
    wrapper.className = 'todo-section';
    
    wrapper.appendChild(header);
    wrapper.appendChild(todoElems);
    wrapper.appendChild(completedTodoElems);

    return wrapper;
  };

  const getTodoElems = (collection, title, predicate) => {
    if(!predicate) predicate = () => true;
    let wrapper = document.createElement('div');

    if (title) {
      const elem = document.createElement('h3');
      elem.textContent = title;
      elem.className = 'todo-category__title';
      wrapper.appendChild(elem)
    }

    Object.values(collection.todos).forEach(todo =>  {
      if (predicate(todo)) {
        let elem = dom[todo.id] || TodoElem(todo);
        dom[todo.id] = elem
        wrapper.appendChild(elem);
      }
    });

    wrapper.className = 'todo-category';
    return wrapper;
  };

  const allTodos = () => {
    let collection = Object.values(collections).reduce((acc, val) => {
      acc.collection = Object.assign(acc.todos, val.todos);
      return acc;
    }, {name: 'All', todos: {}});

    return collection;
  };

  const todayTodos = () => {
    let todos = helpers.filterObject(allTodos().todos, value => 
      isToday(value.dueDate));

    return {name: 'Today', todos};
  };

  const tommorowTodos = () => {
    let todos = helpers.filterObject(allTodos().todos, value => 
      isTomorrow(value.dueDate));

    return {name: 'Tomorrow', todos}
  };

  const next7Days = () => {
    const date = addWeeks(new Date(), 1)
    let todos = helpers.filterObject(allTodos().todos, value => 
      isBefore(value.dueDate, date));

    return {name: 'Next 7 Days', todos};
  };

  const updateTodo = (msg, {id , changed}) => {
    if (!changed.includes('completed')) return;

    PubSub.publish(eventTypes.SHOW_TODOS,
      // trys to send id or name since currentCollection can be a todcollection (has id)
      // time category (has name)
      {collectionId: currentCollection.id, category: currentCollection.name}
    );
  };

  const deleteTodo = (msg, {id}) => {
    const todoElem = dom[id];
    todoElem.remove();
    delete dom[id];
  };

  let currentCollection;
  const collections = TodoCollections;
  const categories = {
    all: allTodos,
    today: todayTodos,
    tomorrow: tommorowTodos,
    next7Days: next7Days,
  }

  const dom = {
    content: document.getElementById('content'),
  };

  PubSub.subscribe(eventTypes.SHOW_TODOS, showTodos);
  PubSub.subscribe(eventTypes.TODO_CREATED, showTodos);
  PubSub.subscribe(eventTypes.TODO_UPDATED, updateTodo);
  PubSub.subscribe(eventTypes.TODO_DELETED, deleteTodo);
})();

export default todos;