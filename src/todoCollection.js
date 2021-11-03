import PubSub from 'pubsub-js';
import eventTypes from './eventTypes.js';
import Todo from './todo.js'

const TodoCollection = (name) => {
  const newTodo = ({title, description, priority, dueDate}) {
    let todo = Todo(title, description, priority, dueDate);

    todos[++todoUid] = todo;
    PubSub.publish(eventTypes.TODO_CREATED, {todo, id: todoUid});
  };

  const deleteTodo = (id) => {
    let todo = todos[id];
    delete todos[id];

    PubSub.publish(eventTypes.TODO_DELETED, {todo, id});
  };

  const todos = {};
  let todoUid = -1;

  const self = {todos};
  return self;
};

export default TodoCollection;