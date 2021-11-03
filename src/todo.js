import PubSub from 'pubsub-js';
import eventTypes from './eventTypes.js'

const Todo = (title, description, priority, dueDate, id) => {
  const update = data => {
    if (id !== data.id) return;

    for (let k of Object.keys(data.info)) {
      if (k === 'id' && !self.hasOwnProperty(k)) next;
      
      self[k] = data.info[k];
    }

    PubSub.publish(eventTypes.TODO_UPDATED, {id: self.id, self});
  };

  PubSub.subscribe(eventTypes.UPDATE_TODO, update);

  self = { 
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