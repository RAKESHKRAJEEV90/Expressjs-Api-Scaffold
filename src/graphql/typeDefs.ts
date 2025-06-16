import { gql } from 'apollo-server-express';

export default gql`
  # Health check types
  type ServiceStatus {
    mongodb: String!
    postgres: String!
    mysql: String!
    sqlserver: String!
    redis: String!
  }

  type Health {
    status: String!
    timestamp: String!
    uptime: Float!
    environment: String!
  }

  type Ready {
    status: String!
    timestamp: String!
    services: ServiceStatus!
  }

  # User types
  type User {
    id: ID!
    email: String!
    name: String!
    role: String!
    createdAt: String!
    updatedAt: String!
  }

  input CreateUserInput {
    email: String!
    password: String!
    name: String!
    role: String
  }

  input UpdateUserInput {
    email: String
    name: String
    role: String
  }

  # Task types
  type Task {
    id: ID!
    title: String!
    description: String
    status: String!
    assignedTo: User
    createdAt: String!
    updatedAt: String!
  }

  input CreateTaskInput {
    title: String!
    description: String
    status: String
    assignedToId: ID
  }

  input UpdateTaskInput {
    title: String
    description: String
    status: String
    assignedToId: ID
  }

  # Queries
  type Query {
    # Health check queries
    health: Health!
    ready: Ready!

    # User queries
    users: [User!]!
    user(id: ID!): User
    me: User

    # Task queries
    tasks: [Task!]!
    task(id: ID!): Task
    tasksByStatus(status: String!): [Task!]!
    tasksByUser(userId: ID!): [Task!]!
  }

  # Mutations
  type Mutation {
    # User mutations
    createUser(input: CreateUserInput!): User!
    updateUser(id: ID!, input: UpdateUserInput!): User!
    deleteUser(id: ID!): Boolean!

    # Task mutations
    createTask(input: CreateTaskInput!): Task!
    updateTask(id: ID!, input: UpdateTaskInput!): Task!
    deleteTask(id: ID!): Boolean!
    assignTask(taskId: ID!, userId: ID!): Task!
  }
`; 