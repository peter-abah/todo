import PubSub from 'pubsub-js';
import eventTypes from './eventTypes.js';

const DomManager = (() => {
  const addEventListenerToDom = () => {
    categoryBtns.forEach(btn => 
      btn.addEventListener('click', showCategory)
    );

    collectionBtns.forEach(btn => 
      btn.addEventListener('click', showCollection)
    );

    addCollectionBtn.addEventListener('click', showCollectionForm);

    collectionForm.addEventListener('click', createCollection);
  };

  const showCategory = event => {
    const category = event.target.getAttribute('data-category');
    let todos = categoryFuncs[category]();

    showTodos(todos);
  };

  const showTodos = todos => {
    const todosElem = createTodoElem(todos);
    helper.clearElement(content);
    content.appendChild(todosElem)
  };

  const showCollection = event => {
    const collectionName = event.target.getAttribute('data-collection');
    let todos = collections[collectionName];

    showTodos(todos);
  };

  const showCollectionForm = event => {
    collectionForm.classList.toggle('collection__form--hidden');
  };

  const createCollection = event => {
    event.preventDefault();
    const collectionName = collectionInput.value;

    PubSub.publish(eventTypes.NEW_COLLECTION, {name: collectionName});
  };

  const categoryBtns = [...document.querySelectorAll('.categories__btn')];

  const collectionBtns = [...document.querySelectorAll('.collection__btn')];
  const addCollectionBtn = document.querySelector('.collection__btn-add');
  const collectionForm = document.querySelector('.collection__form');
  const collectionInput = document.getElementById('collection-name');

  addEventListenerToDom();

  const categoryFuncs = {
    all: allTodos,
    today: todayTodos,
    tommorow: tommorowTodos,
    next7days: nextNDays(7);
  };

  const self = {};
  return self;
})();

export default DomManager;