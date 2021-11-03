import PubSub from 'pubsub-js';
import eventTypes from './eventTypes.js';

const TodoCollection = (name) => {
  const newTodo = (title, description, priority, dueDate) {
    let todo = Todo(title, description, priority, dueDate);

    todos[todoUid++] = todo;
    PubSub.publish(eventTypes.NEW_TODO, todo);
    return todo;
  };

  const todos = {};
  let todoUid = 0;

  const self = {todos};
  return self;
}