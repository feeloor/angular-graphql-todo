const Sequelize = require('sequelize');
const { db } = require('../services/db.service');

const tableName = 'todos';

const Todo = db.define('Todo', {
  id: {
    type: Sequelize.INTEGER,
    unique: true,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING
  },
  description: {
    type: Sequelize.TEXT
  },
  completed: {
    type: Sequelize.BOOLEAN
  }
 }, { tableName });

Todo.prototype.toJSON = function() {
  return Object.assign({}, this.get());
}

module.exports = { Todo };
