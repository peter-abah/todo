import PubSub from 'pubsub-js';
import eventTypes from './eventTypes.js';

const storage = (() => {
  const save = (value, key) => {
    value = JSON.stringify(value);
    window.localStorage.setItem(key, value);
  };

  const addTodo = (_, {todo}) => {
    save(Object.values(collections), 'collections');
  };

  const updateTodo = () => {
    save(Object.values(collections), 'collections')
  };

  const deleteTodo = (_, {id}) => {
    save(Object.values(collections), 'collections')
  };

  const addCollection = (_, {collection}) => {
    collections[collection.id] = collection;

    save(Object.values(collections), 'collections')
  };

  const updateCollection = (_, data) => {
    save(Object.values(collections), 'collections');
  };

  const deleteCollection = (_, {id}) => {
    delete collections[id];
    save(Object.values(collections), 'collections');
  };

  const fromStorage = () => {
    let collections = window.localStorage.getItem('collections');
    collections = collections ? JSON.parse(collections): [];
    return collections;
  }


  const collections = {};
  const todos = {};

  PubSub.subscribe(eventTypes.TODO_CREATED, addTodo);
  PubSub.subscribe(eventTypes.TODO_UPDATED, updateTodo);
  PubSub.subscribe(eventTypes.TODO_DELETED, deleteTodo);

  PubSub.subscribe(eventTypes.COLLECTION_CREATED, addCollection);
  PubSub.subscribe(eventTypes.COLLECTION_UPDATTED, updateCollection);
  PubSub.subscribe(eventTypes.COLLECTION_DELETED, deleteCollection);

  PubSub.subscribe(eventTypes.GET_STORAGE, fromStorage);

  return {fromStorage}
})();

export default storage;