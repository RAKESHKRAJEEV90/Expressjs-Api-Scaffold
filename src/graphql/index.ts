import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { makeExecutableSchema } from '@graphql-tools/schema';
import typeDefs from './typeDefs';
import resolvers from './resolvers';
import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import { Application } from 'express';

export async function setupGraphQL(app: Application) {
  // Enable CORS
  app.use(cors());

  // Create base schema (core types)
  let mergedTypeDefs: any[] = [typeDefs];
  let mergedResolvers: any[] = [resolvers];

  // Auto-load GraphQL modules from src/graphql/modules/* if any
  const modulesDir = path.join(__dirname, 'modules');
  if (fs.existsSync(modulesDir)) {
    const entries = fs
      .readdirSync(modulesDir)
      .filter((f) => fs.statSync(path.join(modulesDir, f)).isDirectory());
    for (const mod of entries) {
      const modIndex = path.join(modulesDir, mod, 'index.ts');
      const modIndexJs = path.join(modulesDir, mod, 'index.js');
      const target = fs.existsSync(modIndexJs) ? modIndexJs : modIndex;
      if (fs.existsSync(target)) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const loaded = require(target).default;
        if (loaded?.typeDefs) mergedTypeDefs.push(loaded.typeDefs);
        if (loaded?.resolvers) mergedResolvers.push(loaded.resolvers);
      }
    }
  }

  const schema = makeExecutableSchema({ typeDefs: mergedTypeDefs as any, resolvers: mergedResolvers as any });

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