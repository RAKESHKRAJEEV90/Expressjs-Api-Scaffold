#!/usr/bin/env node
import { program } from 'commander';
import fs from 'fs';
import path from 'path';

program
  .command('create <feature>')
  .description('Scaffold a new feature/module')
  .action((feature) => {
    const dir = path.join(process.cwd(), 'src', feature);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    fs.writeFileSync(path.join(dir, 'index.ts'), `// ${feature} module`);
    console.log(`Created feature: ${feature}`);
  });

program.parse(process.argv); 