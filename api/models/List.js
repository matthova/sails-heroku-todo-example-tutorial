/**
 * List.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

const uuidV4 = require('uuid/v4');

module.exports = {
  schema: true,
  attributes: {
    id: {
      type: 'string',
      primaryKey: true,
      required: true,
      unique: true,
      uuidv4: true,
      defaultsTo: () => uuidV4(),
    },
    name: { type: 'string', required: true },
    todos: {
      collection: 'todo',
      via: 'list',
    },
    toJSON: function toJSON() {
      const obj = this.toObject();

      if (Array.isArray(obj.todos)) {
        obj.todos = obj.todos.map((todo) => {
          return todo.id;
        });
      }

      delete obj.createdAt;
      delete obj.updatedAt;

      return obj;
    },
  },
};
