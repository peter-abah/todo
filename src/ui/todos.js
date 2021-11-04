import PubSub from 'pubsub-js';
import {isToday, isTomorrow, addWeeks, isBefore} from 'date-fns';

import eventTypes from '../eventTypes.js';
import helpers from '../helpers.js';

import TodoCollections from '../todoCollections.js';

const todos = (() => {
  const addEventListeners = () => {
    dom.newTodoBtn.addEventListener('click', toggleForm);
    dom.form.addEventListener('submit', newTodo)
  };

  const toggleForm = event => {
    dom.form.classList.toggle('todo__new-form--hidden');
  };

  const newTodo = event => {
    event.preventDefault();

    const title = dom.titleInput.value;
    const description = dom.descriptionInput.value;
    const priority = dom.priorityInput.value;
    const dueDate = dom.dateInput.value;

    PubSub.publish(eventTypes.NEW_TODO, 
      {id: 0, info: {title, description, priority, dueDate}});
  };

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
    let todoElems = getTodoElems(collection, todo => todo.completed);

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

    Object.keys(collection.todos).forEach(todo =>  {
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
    newTodoBtn: document.querySelector('.todo__btn-new'),
    form: document.querySelector('.todo__new-form'),
    titleInput: document.querySelector('.todo__new-form__input-title'),
    descriptionInput: document.querySelector('.todo__new-form__input-description'),
    dateInput: document.querySelector('.todo__new-form__input-date'),
    priorityInput: document.querySelector('.todo__new-form__input-title'),
  };
  addEventListeners();

  PubSub.subscribe(eventTypes.SHOW_TODOS, showTodos);
  PubSub.subscribe(eventTypes.TODO_CREATED, showTodos);
  PubSub.subscribe(eventTypes.TODO_UPDATED, updateTodo);
  PubSub.subscribe(eventTypes.TODO_DELETED, deleteTodo);

  PubSub.publish(eventTypes.NEW_COLLECTION, {name: 'Default'});
})();

export default todos;