import PubSub from 'pubsub-js';
import eventTypes from './eventTypes.js';

const collectionDomManager = (() => {
  const addEventListeners = () => {
    collectionBtns.forEach(btn => 
      btn.addEventListener('click', showCollection)
    );

    addCollectionBtn.addEventListener('click', showCollectionForm);

    collectionForm.addEventListener('click', createCollection);
  };

  const showCollection = event => {
    const collectionName = event.target.getAttribute('data-collection');
    PubSub.publish(eventTypes.SHOW_TODOS, {collectionName});
  };

  const showCollectionForm = event => {
    collectionForm.classList.toggle('collection__form--hidden');
  };

  const createCollection = event => {
    event.preventDefault();
    const collectionName = collectionInput.value;

    PubSub.publish(eventTypes.NEW_COLLECTION, {name: collectionName});
  };

  const addCollection = ({collection}) => {
    const btn = document.createElement('button');
    btn.classList.add('collection__btn');

    btn.textContent = collection.name;
    btn.setAttribute('data-collection', collection.name);

    btn.addEventListener('click', showCollection);
    collectionBtnsContainer.appendChild(btn);
  };

  const collectionBtnsContainer = document.querySelector('.collection');
  const collectionBtns = [...document.querySelectorAll('.collection__btn')];
  const addCollectionBtn = document.querySelector('.collection__btn-add');
  const collectionForm = document.querySelector('.collection__form');
  const collectionInput = document.getElementById('collection-name');

  PubSub.subscribe(eventTypes.COLLECTION_CREATED, addCollection);

  addEventListeners();
})();

export default collectionDomManager;