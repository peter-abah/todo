const eventTypes = {
  TODO_CREATED: 'todo_created',
  TODO_DELETED: 'todo_deleted',
  TODO_UPDATED: 'todo_updated',
  
  NEW_TODO: 'new_todo',
  DELETE_TODO: 'delete_todo',
  UPDATE_TODO: 'update_todo',

  SHOW_TODOS: 'show_todos',

  NEW_COLLECTION: 'new_collection',
  DELETE_COLLECTION: 'delete_collection',
  UPDATE_COLLECTION: 'update_collection',

  COLLECTION_CREATED: 'collection_created',
  COLLECTION_UPDATED: 'collection_updated',
  COLLECTION_DELETED: 'collection_deleted',

  STORAGE: 'storage',
  GET_STORAGE: 'get_storage',
};

export default eventTypes;