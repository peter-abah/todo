import PubSub from 'pubsub-js';
import eventTypes from './eventTypes.js';
import helpers from './helpers.js';
import TodoCollection from './todoCollection.js';
import storage from './storage.js'

const TodoCollections = (() => {
  const createCollection = (msg, data) => {
    const collection = TodoCollection(data.name);
    self[collection.id] =  collection;

    PubSub.publish(eventTypes.COLLECTION_CREATED, {id: collection.id, collection});
  };

  const deleteCollection = (msg, {id}) => {
    delete self[id];

    PubSub.publish(eventTypes.COLLECTION_DELETED, {id});
  };

  const init = () => {
    let collections = getLocalStorage() || defaultCollection();
    return createCollections(collections);;
  };

  const getLocalStorage = () => {
    let collections = storage.fromStorage();
    if (collections.length < 1) return;

    return collections;
  };

  const defaultCollection = () => {
    let result = [
      {
        name: 'Default',
        todos: {
          0: {
            title: 'A Todo Title',
            description: 'This is a description',
            dueDate: '2021-11-01,',
            priority: 'medium'
          },

          1: {
            title: 'Click the todo to view or edit details',
            description: 'Edit me!',
            dueDate: '',
            priority: 'low',
          },

          2: {
            title: 'Red checkbox indicates high priority',
            description: '',
            dueDate: helpers.formatDate(new Date()),
            priority: 'high',
          },

          3: {
            title: 'Green checkbox indicates medium priority',
            description: '',
            dueDate: helpers.formatDate(new Date()),
            priority: 'medium',
          },

          4: {
            title: 'Blue checkbox indicates low priority',
            description: '',
            dueDate: helpers.formatDate(new Date()),
            priority: 'low',
          },
        },
      },
    ];

    return result;
  };

  const createCollections = array => {
    let result = {};

    array.forEach(({name, todos}) => {
      let collection = TodoCollection(name);
      result[collection.id] = collection;

      PubSub.publish(eventTypes.COLLECTION_CREATED, {id: collection.id, collection});

      Object.values(todos).forEach(todo => {
        PubSub.publish(eventTypes.NEW_TODO, {id: collection.id, info: todo})
      });
    });

    return result;
  };

  PubSub.subscribe(eventTypes.NEW_COLLECTION, createCollection);
  PubSub.subscribe(eventTypes.DELETE_COLLECTION, deleteCollection);

  self = init();
  return self;
})();

export default TodoCollections;