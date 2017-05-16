const async = require('async');
const dbm = global.dbm || require('db-migrate');
const type = dbm.dataType;

exports.up = (db, callback) => {
  async.series([
    (cb) => {
      db.createTable('todo', {
        id: { type: 'string', primaryKey: true },
        description: 'string',
        list: 'string',
        createdAt: 'datetime',
        updatedAt: 'timestamp'
      }, cb);
    },
    (cb) => {
      db.createTable('list', {
        id: { type: 'string', primaryKey: true },
        name: 'string',
        createdAt: 'datetime',
        updatedAt: 'timestamp',
      }, cb);
    },
  ], callback);
};

exports.down = function(db, callback) {
  async.series([
    (cb) => {
      db.dropTable('todo', cb)
    },
    (cb) => {
      db.dropTable('list', cb);
    },
  ], callback);
};
