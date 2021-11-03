'use strict';

const Todo = (title, description, priority, dueDate) => {
  self = { 
    title, 
    description, 
    priority, 
    dueDate,
    completed: false, };

  return self;
};

export default Todo;