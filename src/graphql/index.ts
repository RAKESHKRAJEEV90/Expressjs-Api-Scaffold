import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { makeExecutableSchema } from '@graphql-tools/schema';
import typeDefs from './typeDefs';
import resolvers from './resolvers';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import { Application } from 'express';

export async function setupGraphQL(app: Application) {
  // Enable CORS
  app.use(cors());

  // Create the schema
  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  // Create the Apollo Server
  const server = new ApolloServer({
    schema,
    csrfPrevention: true,
    cache: 'bounded',
  });

  // Start the server
  await server.start();

  // Apply middleware
  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req }) => {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) return {};
        
        try {
          const user = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
          return { user };
        } catch (error) {
          return {};
        }
      },
    })
  );

  console.log(`🚀 GraphQL server ready at http://localhost:${process.env.PORT || 3000}/graphql`);
} 