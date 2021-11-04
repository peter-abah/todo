import PubSub from 'pubsub-js';
import eventTypes from './eventTypes.js';
import TodoCollection from './todoCollection.js';

const TodoCollections = (() => {
  const createCollection = ({name}) => {
    const collection = TodoCollection(name);
    collections[++uid] =  collection;

    PubSub.publish(eventTypes.COLLECTION_CREATED, {id: uid, collection});
  };

  const deleteCollection = ({id}) => {
    delete collections[id];

    PubSub.publish(eventTypes.COLLECTION_DELETED, {id});
  }

  let uid = -1;
  const collections = {};

  PubSub.subscribe(eventTypes.NEW_COLLECTION, createCollection);
  PubSub.subscribe(eventTypes.DELETE_COLLECTION, deleteCollection);

  const self = collections;
  return self;
})();

export default TodoCollections;