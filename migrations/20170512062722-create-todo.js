const async = require('async');
const dbm = global.dbm || require('db-migrate');
const type = dbm.dataType;

exports.up = (db, callback) => {
  async.series([
    (cb) => {
      db.createTable('todo', {
        id: { type: 'int', primaryKey: true, autoIncrement: true },
        description: 'string',
        createdAt: 'datetime',
        updatedAt: 'timestamp'
      }, cb);
    },
  ], callback);
};

exports.down = function(db, callback) {
  async.series([
    (cb) => {
      db.dropTable('todo', cb)
    }
  ], callback);
};
