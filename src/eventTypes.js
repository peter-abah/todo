const eventTypes = {
  TODO_CREATED: Symbol('todo_created'),
  TODO_DELETED: Symbol('todo_deleted'),
  TODO_UPDATED: Symbol('todo_updated'),
  
  NEW_TODO: Symbol('new_todo'),
  DELETE_TODO: Symbol('delete_todo'),
  UPDATE_TODO: Symbol('update_todo'),

  SHOW_TODOS: Symbol('show_todos'),

  NEW_COLLECTION: Symbol('new_collection'),
  DELETE_COLLECTION: Symbol('delete_collection'),
  UPDATE_COLLECTION: Symbol('update_collection'),

  COLLECTION_CREATED: Symbol('collection_created'),
  COLLECTION_UPDATED: Symbol('collection_updated'),
  COLLECTION_DELETED: Symbol('collection_deleted'),
};

export default eventTypes;