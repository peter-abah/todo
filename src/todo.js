import PubSub from 'pubsub-js';
import eventTypes from './eventTypes.js';
import helpers from './helpers.js'

let uid = -1;
const Todo = (title, description, priority, dueDate, collectionId, completed = false) => {
  const update = (msg, data) => {
    if (id !== data.id) return;

    for (let k of Object.keys(data.info)) {
      if (k === 'id' || !self.hasOwnProperty(k)) continue;
      if (k === 'date') 
        data.info[k] = helpers.convertStrToDate(data.info[k]);

      self[k] = data.info[k];
    }
    PubSub.publish(eventTypes.TODO_UPDATED, 
      {id: self.id, changed: Object.keys(data.info)}
    );
  };

  PubSub.subscribe(eventTypes.UPDATE_TODO, update);

  const id = ++uid;
  dueDate = helpers.convertStrToDate(dueDate.substring(0, 10));

  const self = { 
    title, 
    description, 
    priority, 
    dueDate,
    id,
    collectionId,
    completed,
  };

  return self;
};

export default Todo;