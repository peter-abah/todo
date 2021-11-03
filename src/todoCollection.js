import PubSub from 'pubsub-js';
import eventTypes from './eventTypes.js';
import Todo from './todo.js'

const TodoCollection = (name) => {
  const newTodo = data {
    const {title, description, priority, dueDate} = data.info;

    let todo = Todo(title, description, priority, dueDate);

    todos[++todoUid] = todo;
    PubSub.publish(eventTypes.TODO_CREATED, {todo, id: todoUid});
  };

  const deleteTodo = data => {
    const id = data.id;

    let todo = todos[id];
    delete todos[id];

    PubSub.publish(eventTypes.TODO_DELETED, {todo, id});
  };

  const todos = {};
  let todoUid = -1;

  PubSub.subscribe(eventTypes.NEW_TODO, newTodo);
  PubSub.subscribe(eventTypes.DELETE_TODO, deleteTodo);

  const self = {todos};
  return self;
};

export default TodoCollection;