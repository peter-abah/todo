import PubSub from 'pubsub-js';
import {isToday, isTomorrow, addWeeks, isBefore} from 'date-fns';

import eventTypes from '../eventTypes.js';
import helpers from '../helpers.js';

import TodoCollections from '../todoCollections.js';
import TodoElem from './todoElem.js';

const todos = (() => {
  const showTodos = (msg, data) => {
    let collection;

    if (data.category) {
      collection = categories[data.category]();
    } else if (Number.isInteger(data.collection)) {
      collection = collections[data.collection];
    } else return;

    const todosElem = createTodos(collection);
    helpers.clearElement(dom.content);
    dom.content.appendChild(todosElem);
  };

  const createTodos = collection => {
    let todoElems = getTodoElems(collection, todo => !todo.completed);

    let completedTodoElems = getTodoElems(collection, todo => todo.completed);

    //let header = headerTemplate(collection);

    let wrapper = document.createElement('section');

    //wrapper.appendChild(header);
    wrapper.appendChild(completedTodoElems);
    wrapper.appendChild(todoElems);
    return wrapper;
  };

  const getTodoElems = (collection, predicate) => {
    if(!predicate) predicate = () => true;
    let wrapper = document.createElement('div');

    Object.values(collection.todos).forEach(todo =>  {
      if (predicate(todo)) {
        let elem = dom[todo.id] || TodoElem(todo);
        dom[todo.id] = elem
        wrapper.appendChild(elem);
      }
    });

    return wrapper;
  };

  const allTodos = () => {
    let collection = collections.reduce((acc, val) => {
      acc.collection = Object.assign(acc.todos, val.todos);
      return acc;
    }, {name: 'All', todos: {}});

    return collection;
  };

  const todayTodos = () => {
    let todos = helpers.objectFilter(allTodos().todos, value => 
      isToday(value.dueDate));

    return {name: 'Today', todos};
  };

  const tommorowTodos = () => {
    let todos = helpers.objectFilter(allTodos().todos, value => 
      isTomorrow(value.dueDate));

    return {name: 'Tommorow', todos}
  };

  const next7Days = () => {
    const date = addWeeks(new Date(), 1)
    let todos = helpers.objectFilter(allTodos().todos, value => 
      isBefore(value.dueDate, date));

    return {name: 'Next 7 Days', todos};
  };

  const updateTodo = (msg, {id , changed}) => {
    if (!changed.includes('completed')) return;

    const todoElem = dom[id];
    todoElem.classList.toggle('todo--completed');
  };

  const deleteTodo = (msg, {id}) => {
    const todoElem = dom[id];
    todoElem.remove();
    delete dom[id];
  }

  const collections = TodoCollections;
  const categories = {
    all: allTodos,
    today: todayTodos,
    tommorow: tommorowTodos,
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