import PubSub from 'pubsub-js';
import eventTypes from '../eventTypes.js'

const modal = (() => {
  const addEventListeners = () => {
    dom.openModalBtn.addEventListener('click', toggleModal);
    dom.modal.addEventListener('click', closeModal);
    dom.form.addEventListener('submit', newTodo);
  };

  const toggleModal = event => {
    dom.modal.classList.toggle('modal--hidden');
  };

  const closeModal = event => {
    if (event && (event.target !== event.currentTarget)) return;
    toggleModal();
    dom.form.reset();
  }

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

    closeModal();
  };

  const dom = {
    modal: document.querySelector('.modal'),
    openModalBtn: document.querySelector('.open-modal-btn'),

    form: document.querySelector('.modal__form'),
    titleInput: document.getElementById('modal__form__input-title'),
    descriptionInput: document.getElementById('modal__form__input-description'),
    dateInput: document.getElementById('modal__form__input-date'),
    priorityInput: document.getElementById('modal__form__input-priority'),
    collectionSelect: document.getElementById('modal__form__input-collection'),
  };

  addEventListeners();

  PubSub.subscribe(eventTypes.COLLECTION_CREATED, addCollectionOption);
  PubSub.subscribe(eventTypes.COLLECTION_DELETED, removeCollectionOption)
})();

export default modal;