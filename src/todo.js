import PubSub from 'pubsub-js';
import eventTypes from './eventTypes.js';
import helpers from './helpers.js'

const Todo = (title, description, priority, dueDate, id) => {
  const update = (msg, data) => {
    if (id !== data.id) return;

    for (let k of Object.keys(data.info)) {
      if (k === 'id' || !self.hasOwnProperty(k)) continue;
      if (k === 'date') 
        data.info[k] = helpers.formatDate(data.info[k]);

      self[k] = data.info[k];
    }
    PubSub.publish(eventTypes.TODO_UPDATED, 
      {id: self.id, changed: Object.keys(data.info)}
    );
  };


  PubSub.subscribe(eventTypes.UPDATE_TODO, update);

  

  dueDate = helpers.formatDate(dueDate);
  const self = { 
    title, 
    description, 
    priority, 
    dueDate,
    id,
    completed: false,
  };

  return self;
};

export default Todo;