const eventTypes = {
  TODO_CREATED: Symbol('todo_created'),
  TODO_DELETED: Symbol('todo_deleted'),
  TODO_UPDATED: Symbol('todo_updated'),
  
  NEW_TODO: Symbol('new_todo'),
  DELETE_TODO: Symbol('delete_todo'),
  UPDATE_TODO: Symbol('update_todo'),

  NEW_COLLECTION: Symbol('new_collection'),
  COLLECTION_CREATED: Symbol('collection_created'),
  SHOW_TODOS: Symbol('show_todos'),
};

export default eventTypes;