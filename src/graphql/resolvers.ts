import { AuthenticationError, UserInputError } from 'apollo-server-express';
import { v4 as uuidv4 } from 'uuid';

// In-memory data store (replace with database in production)
const users: any[] = [];
const tasks: any[] = [];

export default {
  Query: {
    // Health check queries
    health: () => ({
      status: 'UP',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
    }),
    ready: () => ({
      status: 'UP',
      timestamp: new Date().toISOString(),
      services: {
        mongodb: process.env.MONGO_ENABLED === 'true' ? 'UP' : 'DISABLED',
        postgres: process.env.POSTGRES_ENABLED === 'true' ? 'UP' : 'DISABLED',
        mysql: process.env.MYSQL_ENABLED === 'true' ? 'UP' : 'DISABLED',
        sqlserver: process.env.SQLSERVER_ENABLED === 'true' ? 'UP' : 'DISABLED',
        redis: process.env.REDIS_ENABLED === 'true' ? 'UP' : 'DISABLED',
      },
    }),

    // User queries
    users: () => users,
    user: (_: any, { id }: { id: string }) => users.find(user => user.id === id),
    me: (_: any, __: any, { user }: { user: any }) => {
      if (!user) throw new AuthenticationError('Not authenticated');
      return users.find(u => u.id === user.id);
    },

    // Task queries
    tasks: () => tasks,
    task: (_: any, { id }: { id: string }) => tasks.find(task => task.id === id),
    tasksByStatus: (_: any, { status }: { status: string }) => 
      tasks.filter(task => task.status === status),
    tasksByUser: (_: any, { userId }: { userId: string }) => 
      tasks.filter(task => task.assignedToId === userId),
  },

  Mutation: {
    // User mutations
    createUser: (_: any, { input }: { input: any }) => {
      const existingUser = users.find(user => user.email === input.email);
      if (existingUser) {
        throw new UserInputError('User with this email already exists');
      }

      const newUser = {
        id: uuidv4(),
        ...input,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      users.push(newUser);
      return newUser;
    },

    updateUser: (_: any, { id, input }: { id: string, input: any }) => {
      const userIndex = users.findIndex(user => user.id === id);
      if (userIndex === -1) {
        throw new UserInputError('User not found');
      }

      const updatedUser = {
        ...users[userIndex],
        ...input,
        updatedAt: new Date().toISOString(),
      };
      users[userIndex] = updatedUser;
      return updatedUser;
    },

    deleteUser: (_: any, { id }: { id: string }) => {
      const userIndex = users.findIndex(user => user.id === id);
      if (userIndex === -1) {
        throw new UserInputError('User not found');
      }

      users.splice(userIndex, 1);
      return true;
    },

    // Task mutations
    createTask: (_: any, { input }: { input: any }) => {
      const newTask = {
        id: uuidv4(),
        ...input,
        status: input.status || 'TODO',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      tasks.push(newTask);
      return newTask;
    },

    updateTask: (_: any, { id, input }: { id: string, input: any }) => {
      const taskIndex = tasks.findIndex(task => task.id === id);
      if (taskIndex === -1) {
        throw new UserInputError('Task not found');
      }

      const updatedTask = {
        ...tasks[taskIndex],
        ...input,
        updatedAt: new Date().toISOString(),
      };
      tasks[taskIndex] = updatedTask;
      return updatedTask;
    },

    deleteTask: (_: any, { id }: { id: string }) => {
      const taskIndex = tasks.findIndex(task => task.id === id);
      if (taskIndex === -1) {
        throw new UserInputError('Task not found');
      }

      tasks.splice(taskIndex, 1);
      return true;
    },

    assignTask: (_: any, { taskId, userId }: { taskId: string, userId: string }) => {
      const taskIndex = tasks.findIndex(task => task.id === taskId);
      if (taskIndex === -1) {
        throw new UserInputError('Task not found');
      }

      const userExists = users.some(user => user.id === userId);
      if (!userExists) {
        throw new UserInputError('User not found');
      }

      const updatedTask = {
        ...tasks[taskIndex],
        assignedToId: userId,
        updatedAt: new Date().toISOString(),
      };
      tasks[taskIndex] = updatedTask;
      return updatedTask;
    },
  },

  // Field resolvers
  Task: {
    assignedTo: (task: any) => users.find(user => user.id === task.assignedToId),
  },
}; 