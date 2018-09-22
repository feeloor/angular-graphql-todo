import gql from 'graphql-tag';

export const GetTodos = gql`
query GetTodos {
  getTodos {
    id
    name
    description
    completed
  }
}
`;

export const AddTodo = gql`
  mutation AddTodo($name: String!, $description: String!, $completed: Boolean!) {
    addTodo(name: $name, description: $description, completed: $completed) {
      id
      name
      description
      completed
    }
  }
`;

export interface Todo {
  id: number;
  name: string;
  description: string;
  completed: boolean;
}
