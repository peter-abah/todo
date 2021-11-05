import PubSub from 'pubsub-js';
import eventTypes from '../eventTypes.js';

const collection = (() => {
  const addEventListeners = () => {
    collectionBtns.forEach(btn => 
      btn.addEventListener('click', showCollection)
    );

    addCollectionBtn.addEventListener('click', showCollectionForm);

    collectionForm.addEventListener('submit', createCollection);
  };

  const showCollection = event => {
    const collectionId = event.target.getAttribute('data-collection');
    PubSub.publish(eventTypes.SHOW_TODOS, {collectionId});
  };

  const showCollectionForm = event => {
    collectionForm.classList.toggle('collection__form--hidden');
  };

  const createCollection = event => {
    event.preventDefault();
    const collectionName = collectionInput.value;

    PubSub.publish(eventTypes.NEW_COLLECTION, {name: collectionName});
  };

  const addCollection = (msg, {collection}) => {
    const btn = document.createElement('button');
    btn.classList.add('collection__btn');

    btn.textContent = collection.name;
    btn.setAttribute('data-collection', collection.id);

    btn.addEventListener('click', showCollection);
    collectionBtnsContainer.appendChild(btn);
  };

  const collectionBtnsContainer = document.querySelector('.collections');
  const collectionBtns = [...document.querySelectorAll('.collection__btn')];
  const addCollectionBtn = document.querySelector('.collections__btn-add');
  const collectionForm = document.querySelector('.collections__form');
  const collectionInput = document.querySelector('.collections__form__input');

  PubSub.subscribe(eventTypes.COLLECTION_CREATED, addCollection);

  // generate event to create a default collection
  PubSub.publish(eventTypes.NEW_COLLECTION, {name: 'Default'});
  addEventListeners();
})();

export default collection;