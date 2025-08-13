#!/usr/bin/env node
import { program } from 'commander';
import fs from 'fs';
import path from 'path';

function ensureDir(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function writeFileIfNotExists(filePath: string, content: string) {
  if (fs.existsSync(filePath)) return false;
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, { encoding: 'utf8' });
  return true;
}

function toPascalCase(input: string) {
  return input
    .replace(/[-_]+/g, ' ')
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase())
    .replace(/\s+/g, '');
}

program.name('scaffold').description('Project scaffolding for routes, modules, and GraphQL resolvers');

// scaffold module <name>
program
  .command('module <name>')
  .description('Create a feature module: controller, use-case stub, repository stub, and v1 route')
  .option('-v, --version <version>', 'API version folder (e.g., v1)', 'v1')
  .option('-p, --path <basePath>', 'Base path for the route', '')
  .action((name: string, options: { version: string; path?: string }) => {
    const pascal = toPascalCase(name);

    // Controller
    const controllerPath = path.join(process.cwd(), 'src', 'controllers', `${name}Controller.ts`);
    const controllerCreated = writeFileIfNotExists(
      controllerPath,
      `import { Request, Response } from 'express';

export async function getAll${pascal}(req: Request, res: Response) { res.json([]); }
export async function get${pascal}ById(req: Request, res: Response) { res.json({ id: req.params.id }); }
export async function create${pascal}(req: Request, res: Response) { res.status(201).json(req.body); }
export async function update${pascal}(req: Request, res: Response) { res.json({ id: req.params.id, ...req.body }); }
export async function delete${pascal}(req: Request, res: Response) { res.status(204).send(); }
`
    );

    // Use-case stub
    const usecasePath = path.join(process.cwd(), 'src', 'usecases', name, 'index.ts');
    const usecaseCreated = writeFileIfNotExists(
      usecasePath,
      `export function make${pascal}UseCases() {
  return {
    list: async () => [],
    getById: async (id: string) => ({ id }),
    create: async (data: any) => data,
    update: async (id: string, data: any) => ({ id, ...data }),
    remove: async (id: string) => true,
  };
}
`
    );

    // Repository stub
    const repoPath = path.join(process.cwd(), 'src', 'repositories', name, `${pascal}Repository.ts`);
    const repoCreated = writeFileIfNotExists(
      repoPath,
      `export interface ${pascal}Entity { id: string }
export interface I${pascal}Repository {
  findById(id: string): Promise<${pascal}Entity | null>;
}
export class InMemory${pascal}Repository implements I${pascal}Repository {
  private items: ${pascal}Entity[] = [];
  async findById(id: string) { return this.items.find(i => i.id === id) || null; }
}
`
    );

    // Route
    const basePath = options.path || `/${name}`;
    const routeFilePath = path.join(process.cwd(), 'src', 'routes', options.version, `${name}.ts`);
    const routeCreated = writeFileIfNotExists(
      routeFilePath,
      `import { Router } from 'express';
import { getAll${pascal}, get${pascal}ById, create${pascal}, update${pascal}, delete${pascal} } from '../../controllers/${name}Controller';

const router = Router();
router.get('/', getAll${pascal});
router.get('/:id', get${pascal}ById);
router.post('/', create${pascal});
router.put('/:id', update${pascal});
router.delete('/:id', delete${pascal});

export default router;
`
    );

    // Mount route in version index
    const versionIndexPath = path.join(process.cwd(), 'src', 'routes', options.version, 'index.ts');
    if (fs.existsSync(versionIndexPath)) {
      const content = fs.readFileSync(versionIndexPath, 'utf8');
      const importLine = `import ${name}Routes from './${name}';`;
      const useLine = `router.use('${basePath}', ${name}Routes);`;
      let updated = content;
      if (!content.includes(importLine)) {
        updated = importLine + '\n' + updated;
      }
      if (!updated.includes(useLine)) {
        // Insert before export default router;
        updated = updated.replace(/export default router;\s*$/m, `${useLine}\n\nexport default router;`);
      }
      if (updated !== content) {
        fs.writeFileSync(versionIndexPath, updated, 'utf8');
      }
    }

    console.log('Scaffold results:');
    console.log(`- Controller: ${controllerCreated ? 'created' : 'exists'} (${path.relative(process.cwd(), controllerPath)})`);
    console.log(`- Use-cases: ${usecaseCreated ? 'created' : 'exists'} (${path.relative(process.cwd(), usecasePath)})`);
    console.log(`- Repository: ${repoCreated ? 'created' : 'exists'} (${path.relative(process.cwd(), repoPath)})`);
    console.log(`- Route: ${routeCreated ? 'created' : 'exists'} (${path.relative(process.cwd(), routeFilePath)})`);
    console.log(`- Mounted at: ${options.version}${basePath}`);
  });

// scaffold route <name>
program
  .command('route <name>')
  .description('Create a route file and mount it into a versioned router')
  .option('-v, --version <version>', 'API version folder (e.g., v1)', 'v1')
  .option('-p, --path <basePath>', 'Base path for the route', '')
  .action((name: string, options: { version: string; path?: string }) => {
    const pascal = toPascalCase(name);
    const basePath = options.path || `/${name}`;

    const routeFilePath = path.join(process.cwd(), 'src', 'routes', options.version, `${name}.ts`);
    const created = writeFileIfNotExists(
      routeFilePath,
      `import { Router } from 'express';

const router = Router();
router.get('/', (req, res) => res.json({ message: '${name} root' }));

export default router;
`
    );

    const versionIndexPath = path.join(process.cwd(), 'src', 'routes', options.version, 'index.ts');
    if (fs.existsSync(versionIndexPath)) {
      const content = fs.readFileSync(versionIndexPath, 'utf8');
      const importLine = `import ${name}Routes from './${name}';`;
      const useLine = `router.use('${basePath}', ${name}Routes);`;
      let updated = content;
      if (!content.includes(importLine)) {
        updated = importLine + '\n' + updated;
      }
      if (!updated.includes(useLine)) {
        updated = updated.replace(/export default router;\s*$/m, `${useLine}\n\nexport default router;`);
      }
      if (updated !== content) {
        fs.writeFileSync(versionIndexPath, updated, 'utf8');
      }
    }

    console.log(`Route ${name}: ${created ? 'created' : 'exists'} (${path.relative(process.cwd(), routeFilePath)})`);
    console.log(`Mounted at: ${options.version}${basePath}`);
  });

// scaffold graphql <name>
program
  .command('graphql <name>')
  .description('Create a GraphQL module (typeDefs + resolvers) under src/graphql/modules/<name>')
  .action((name: string) => {
    const pascal = toPascalCase(name);
    const moduleDir = path.join(process.cwd(), 'src', 'graphql', 'modules', name);
    ensureDir(moduleDir);

    const indexPath = path.join(moduleDir, 'index.ts');
    const created = writeFileIfNotExists(
      indexPath,
      `import gql from 'graphql-tag';

const typeDefs = gql\`
  extend type Query {
    ${name}s: [${pascal}!]!
    ${name}(id: ID!): ${pascal}
  }

  extend type Mutation {
    create${pascal}(name: String!): ${pascal}!
    delete${pascal}(id: ID!): Boolean!
  }

  type ${pascal} {
    id: ID!
    name: String!
  }
\`;

const resolvers = {
  Query: {
    ${name}s: () => [],
    ${name}: (_: any, { id }: { id: string }) => ({ id, name: '${pascal}' }),
  },
  Mutation: {
    create${pascal}: (_: any, { name }: { name: string }) => ({ id: Date.now().toString(), name }),
    delete${pascal}: () => true,
  },
};

export default { typeDefs, resolvers };
`
    );

    console.log(`GraphQL module ${name}: ${created ? 'created' : 'exists'} (${path.relative(process.cwd(), indexPath)})`);
    console.log('Ensure GraphQL is enabled and the server will auto-load modules from src/graphql/modules.');
  });

program.parse(process.argv);