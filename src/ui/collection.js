import PubSub from 'pubsub-js';
import eventTypes from '../eventTypes.js';

const collection = (() => {
  const addEventListeners = () => {
    dom.addBtn.addEventListener('click', showCollectionForm);

    dom.form.addEventListener('submit', createCollection);
  };

  const showCollection = event => {
    const collectionId = +event.target.getAttribute('data-collection');
    PubSub.publish(eventTypes.SHOW_TODOS, {collectionId});
  };

  const showCollectionForm = event => {
    dom.form.classList.toggle('collections__form--hidden');
  };

  const createCollection = event => {
    event.preventDefault();
    const collectionName = dom.input.value;

    PubSub.publish(eventTypes.NEW_COLLECTION, {name: collectionName});
  };

  const addCollection = (msg, {collection}) => {
    const btn = document.createElement('button');
    btn.classList.add('collections__btn');

    btn.textContent = collection.name;
    btn.setAttribute('data-collection', collection.id);

    btn.addEventListener('click', showCollection);
    dom.collectionsWrapper.appendChild(btn);
  };

  const dom = {
    mainWrapper: document.querySelector('.collections'),
    collectionsWrapper: document.querySelector('.collections__wrapper'),
    addBtn: document.querySelector('.collections__btn-add'),
    form: document.querySelector('.collections__form'),
    input: document.querySelector('.collections__form__input'),
  };

  PubSub.subscribe(eventTypes.COLLECTION_CREATED, addCollection);

  // generate event to create a default collection
  PubSub.publish(eventTypes.NEW_COLLECTION, {name: 'Default'});
  addEventListeners();
})();

export default collection;