import PubSub from 'pubsub-js';
import {isToday, isTomorrow, addWeeks, isBefore} from 'date-fns';

import eventTypes from '../eventTypes.js';
import helpers from '../helpers.js';

import TodoCollections from '../todoCollections.js';
import TodoElem from './todoElem.js';

const todos = (() => {
  const addEventListeners = () => {
    dom.newTodoBtn.addEventListener('click', toggleForm);
    dom.form.addEventListener('submit', newTodo)
  };

  const toggleForm = event => {
    populateSelect(dom.collectionSelect, collections)
    dom.form.classList.toggle('modal__form--hidden');
  };

  // clears select element and populate with option element 
  // built using values in collections
  const populateSelect = (select, collections) => {
    helpers.clearElement(select);

    Object.values(collections).forEach( ({id, name}) => {
      let option = new Option(name, id);
      select.appendChild(option);
    });

    return select;
  }

  const newTodo = event => {
    event.preventDefault();

    const title = dom.titleInput.value;
    const description = dom.descriptionInput.value;
    const priority = dom.priorityInput.value;
    const dueDate = dom.dateInput.value;
    const id = +dom.collectionSelect.value

    PubSub.publish(eventTypes.NEW_TODO, 
      {id, info: {title, description, priority, dueDate}});

    dom.form.reset();
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
    newTodoBtn: document.querySelector('.modal__btn-open'),
    form: document.querySelector('.modal__form'),
    titleInput: document.querySelector('.modal__form__input-title'),
    descriptionInput: document.querySelector('.modal__form__input-description'),
    dateInput: document.querySelector('.modal__form__input-date'),
    priorityInput: document.querySelector('.modal__form__input-priority'),
    collectionSelect: document.querySelector('.modal__form__input-collection'),
  };
  addEventListeners();

  PubSub.subscribe(eventTypes.SHOW_TODOS, showTodos);
  PubSub.subscribe(eventTypes.TODO_CREATED, showTodos);
  PubSub.subscribe(eventTypes.TODO_UPDATED, updateTodo);
  PubSub.subscribe(eventTypes.TODO_DELETED, deleteTodo);
})();

export default todos;