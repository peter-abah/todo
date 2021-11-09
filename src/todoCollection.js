import PubSub from 'pubsub-js';
import eventTypes from './eventTypes.js';
import Todo from './todo.js';

let uid = -1;
const TodoCollection = (name) => {
  const newTodo = (msg, data) => {
    if (id !== data.id) return;
    const {title, description, priority, dueDate} = data.info;

    const todo = Todo(title, description, priority, dueDate, id);

    todos[todo.id] = todo;
    PubSub.publish(eventTypes.TODO_CREATED, {todo, id: todo.id, collectionId: id});
  };

  const deleteTodo = (msg, {id}) => {
    delete todos[id];
    PubSub.publish(eventTypes.TODO_DELETED, {id});
  };

  const update = (msg, data) => {
    if (id !== data.id) return;

    self.name = data.name;
    PubSub.publish(eventTypes.COLLECTION_UPDATED, {id, self});
  };

  const todos = {};
  const id = ++uid; 

  PubSub.subscribe(eventTypes.NEW_TODO, newTodo);
  PubSub.subscribe(eventTypes.DELETE_TODO, deleteTodo);
  PubSub.subscribe(eventTypes.UPDATE_COLLECTION, update);

  const self = {name, id, todos};
  return self;
};

export default TodoCollection;