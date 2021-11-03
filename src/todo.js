'use strict';

const Todo = (title, description, priority, dueDate) => {
  self = { title, description, priority, dueDate };
  return self;
};

export default Todo;