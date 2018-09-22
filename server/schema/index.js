const { Todo } = require('../models');
const { gql } = require('apollo-server-express');

const typeDefs = gql`
input PaginationFilter {
  skip: Int
  first: Int
}

type Todo {
  id: ID!
  name: String!
  description: String
  completed: Boolean!
}

type Query {
  getTodos(pagination: PaginationFilter): [Todo]
  getTodo(id: String!): Todo
  getCompletedTodos(pagination: PaginationFilter): [Todo]
}

type Mutation {
  addTodo(name: String!, description: String!, completed: Boolean!): Todo
  updateTodo(id: ID!, name: String, description: String!, completed: Boolean): Boolean
}
`;

const resolvers = {
  Query: {
    getTodos: (_, { pagination }) => Todo.findAll({
      offset: pagination && pagination.skip ? pagination.skip : undefined,
      limit: pagination && pagination.first ? pagination.first : undefined
    }),
    getTodo: (_, { id }) => Todo.findById(id),
    getCompletedTodos: (_, { pagination }) => Todo.findAll({
      where: {
        completed: true
      },
      offset: pagination && pagination.skip ? pagination.skip : undefined,
      limit: pagination && pagination.first ? pagination.first : undefined
    })
  },
  Mutation: {
    addTodo: (_, { name, completed }) => Todo.create({
      name,
      completed
    }),
    updateTodo: (_, { id, name, description, completed }) => Todo.update({
      name,
      description,
      completed
    }, { where: { id }, returning: true })
    .then((res) => res[1] === 1)
  }
};

module.exports = { typeDefs, resolvers };
