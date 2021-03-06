import PubSub from 'pubsub-js';
import eventTypes from '../eventTypes.js';
import helpers from '../helpers.js';

import todoTemplate from '../templates/todo-template.hbs';

const TodoElem = (todo) => {
  const newTodo = todo => {
    const todoHtml = todoTemplate(todo);

    const elem = document.createElement('div');
    elem.innerHTML = todoHtml;
    return elem.firstChild;
  };

  const cacheDom = () => {
    const res = {}

    res.body = self.querySelector('.todo__body');

    res.checkBox = self.querySelector('.todo__btn-check');
    res.checkIcons = [...self.querySelectorAll('.todo__btn-check__icon')];
    res.title = self.querySelector('.todo__title');
    res.deleteBtn = self.querySelector('.todo__btn-delete');
    res.date = self.querySelector('.todo__date');

    res.titleInput = self.querySelector('.todo__form__input-text');
    res.descriptionInput = self.querySelector('.todo__form__textarea');
    res.dateInput = self.querySelector('.todo__form__input-date');
    res.priorityInput = self.querySelector('.todo__form__select');

    res.formInputs = [res.titleInput, res.descriptionInput, res.dateInput, res.priorityInput];
    res.form = self.querySelector('.todo__form');

    return res
  };

  const addEventListeners = () => {
    dom.checkBox.addEventListener('click', completeTodo);
    dom.body.addEventListener('click', toggleForm);
    dom.deleteBtn.addEventListener('click', deleteTodo);
    dom.formInputs.forEach(input => 
      input.addEventListener('change', updateTodo)
    );
  };

  const completeTodo = event => {
    let status = event.currentTarget.getAttribute('data-completed');
    status = status !== 'true';

    PubSub.publish(eventTypes.UPDATE_TODO, 
      {id: todo.id, info: {completed: status}});
  };

  const toggleForm = event => {
    dom.form.classList.toggle('todo__form--hidden');
  };

  const deleteTodo = event => {
    PubSub.publish(eventTypes.DELETE_TODO, {id: todo.id});
  };

  const updateTodo = event => {
    let key = event.target.name;
    let value = event.target.value;

    if (key === 'title' && value === '') {
      event.target.value = todo.title;
      return;
    }

    PubSub.publish(eventTypes.UPDATE_TODO, {id: todo.id, info: {[key]: value}});
  };

  const updateUI = (msg, {id, changed}) => {
    if (id !== todo.id) return;

    changed.forEach(key => {
      switch (key) {
        case 'title':
          dom.title.textContent = todo[key];
          dom.titleInput.value = todo[key];
          break;
        case 'description':
          dom.descriptionInput.value = todo[key];
          break;
        case 'priority':
          dom.checkBox.className = `todo__btn-check todo__btn-check--${todo.priority}`
          dom.priorityInput.value = todo[key];
          break;
        case 'dueDate':   
          dom.dateInput.value = todo[key]; // might have a bug
          dom.date.textContent = todo[key];
          break;
        case 'completed':
          dom.checkBox.setAttribute('data-completed', todo.completed);
          dom.title.classList.toggle('todo__title--completed');
          toggleCheckBtn();
          break;
      }
    });
  };

  const toggleCheckBtn = () => {
    dom.checkIcons.forEach(icon => icon.classList.toggle('todo__btn-check__icon--hidden'))
  };

  const self = newTodo(todo);
  const dom = cacheDom();
  addEventListeners();

  PubSub.subscribe(eventTypes.TODO_UPDATED, updateUI);
  return self;
};

export default TodoElem;