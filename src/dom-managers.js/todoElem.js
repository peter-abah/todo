import PubSub from 'pubsub-js';
import eventTypes from '../eventTypes.js';

const TodoElem = (todo) => {
  const cacheDom = () => {
    res = {}

    res.checkBox = self.querySelector('.todo__checkBox');
    res.title = self.querySelector('.todo__title');
    res.deleteBtn = self.querySelector('.todo__btn-delete');

    res.titleInput = self.querySelector('.todo__input-title');
    res.descriptionInput = self.querySelector('.todo__input-description');
    res.dateInput = self.querySelector('.todo__input-date');
    res.priorityInput = self.querySelector('.todo__input-priority');

    res.formInputs = [res.titleInput, res.descriptionInput, res.dateInput, res.priorityInput];
    res.form = self.querySelector('.todo__form');

    return res
  };

  const addEventListeners = () => {
    dom.checkBox.addEventListener('click', completeTodo);
    dom.title.addEventListener('click', toggleForm);
    dom.deleteBtn.addEventListener('click', deleteTodo);
    dom.formInputs.forEach(input => 
      input.addEventListener('change', updateTodo)
    );
  };

  const completeTodo = event => {
    let status = event.target.getAttribute('data-completed');
    status = status === 'true' ? true : false;

    PubSub.publish(eventTypes.UPDATE_TODO, 
      {id: todo.id, info: {completed: status}});
  };

  const toggleForm = event => {
    dom.form.classList.toggle('todo__form--hidden')
  };

  const deleteTodo = event => {
    let id = event.target.getAttribute('data-todo-id');

    PubSub.publish(eventTypes.DELETE_TODO, {id});
  };

  const updateTodo = event => {
    let key = event.target.getAttribute('data-key');
    let value = event.target.value;

    PubSub.publish(eventTypes.UPDATE_TODO, {id: todo.id, info: {key: value}});
  }

  const self = todoTemplate(todo);

  const dom = cacheDom();

  addEventListeners();
  return self;
};