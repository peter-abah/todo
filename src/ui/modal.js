import PubSub from 'pubsub-js';
import eventTypes from '../eventTypes.js'

const modal = (() => {
  const addEventListeners = () => {
    dom.openModalBtn.addEventListener('click', toggleModal);
    dom.modal.addEventListener('click', toggleModal);
    dom.form.addEventListener('submit', newTodo);
  };

  const toggleModal = event => {
    if (event.target !== event.currentTarget) return;

    dom.modal.classList.toggle('modal--hidden');
  };

  const addCollectionOption = (_, {id, collection}) => {
    const option = new Option(collection.name, id);
    option.id = `collection-option-${id}`;

    dom.collectionSelect.appendChild(option);
  };

  const removeCollectionOption = (id) => {
    const option = document.getElementById(`collection-option-${id}`);
    option.remove()
  };

  const newTodo = event => {
    event.preventDefault();

    const title = dom.titleInput.value;
    const description = dom.descriptionInput.value;
    const priority = dom.priorityInput.value;
    const dueDate = dom.dateInput.value;
    const id = +dom.collectionSelect.value

    PubSub.publish(eventTypes.NEW_TODO, 
      {id, info: {title, description, priority, dueDate}});

    toggleModal();
  };

  const dom = {
    modal: document.querySelector('.modal'),
    openModalBtn: document.querySelector('.modal__btn-open'),

    form: document.querySelector('.modal__form'),
    titleInput: document.querySelector('.modal__form__input-title'),
    descriptionInput: document.querySelector('.modal__form__input-description'),
    dateInput: document.querySelector('.modal__form__input-date'),
    priorityInput: document.querySelector('.modal__form__input-priority'),
    collectionSelect: document.querySelector('.modal__form__input-collection'),
  };

  addEventListeners();

  PubSub.subscribe(eventTypes.COLLECTION_CREATED, addCollectionOption);
  PubSub.subscribe(eventTypes.COLLECTION_DELETED, removeCollectionOption)
})();

export default modal;