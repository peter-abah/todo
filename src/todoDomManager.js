import PubSub from 'pubsub-js';
import {isToday, isTommorow} from 'date-fns';
import eventTypes from './eventTypes.js';
import helpers from './helpers.js';
import TodoCollections from './todoCollections.js';

const TodoDomManager = (() => {
  const showTodos = data => {
    let collection;

    if (data.category) {
      collection = categories[data.category]();
    } else if (data.collection) {
      collection = collections[data.collection];
    } else return;

    const todosElem = createTodos(collection);
    helpers.clearElement(content);
    content.appendChild(todosElem);
    addEventListeners();
  };

  const createTodos = collection {
    const template = todosTemplate(collection);
    
    const elem = document.createElement('div');
    elem.innerHtml = template;
    return elem;
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
      isTommorow(value.dueDate));

    return {name: 'Tommorow', todos}
  }

  const next7Days = () => {
    const date = addWeeks(new Date(), 1)
    let todos = helpers.objectFilter(allTodos().todos, value => 
      isBefore(value.dueDate, date));

    return {name: 'Next 7 Days', todos};
  }

  const collections = TodoCollections;
  const categories = {
    all: allTodos,
    today: todayTodos,
    tommorow: tommorowTodos,
    next7Days: next7Days,
  }

  PubSub.subscribe(eventTypes.SHOW_TODOS, showTodos);
})();