#!/usr/bin/env node
// eslint-disable
const f = require('lodash/fp');
const { execSync, exec } = require('child_process');
const path = require('path');
const { red, green } = require('colorette');
const Bluebird = require('bluebird');
const fs = require('fs');

const execAsync = Bluebird.promisify(exec);

const readJsonFile = (filePath) => {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};

const run = async () => {
  const { dependencies, devDependencies } = readJsonFile(
    path.join(process.cwd(), 'package.json')
  );

  const types = f.pipe(
    f.mergeAll,
    f.keys,
    f.filter(f.startsWith('@types/'))
  )([dependencies, devDependencies]);

  execSync(`yarn remove ${types.join(' ')}`, {
    shell: true,
    encoding: 'utf8',
    stdio: 'inherit',
  });

  let list = f.pipe(
    f.mergeAll,
    f.keys,
    f.filter((dep) => !types.includes(dep)),
    f.filter((dep) => types.map(f.replace('@types/', '')).includes(dep)),
    f.map((dep) => `@types/${dep}`)
  )([dependencies, devDependencies]);

  const spacing = f.pipe(f.map(f.size), f.max, f.add(2))(list);

  for (const dep of list) {
    const result = await execAsync(`npm show ${dep} --json`, {
      shell: true,
      encoding: 'utf8',
    })
      .then(JSON.parse)
      .catch(() => null);
    console.log(`${dep.padEnd(spacing)} ${result ? green('✓') : red('✗')}`);

    if (result) {
      execSync(`yarn add -D ${dep}`, {
        shell: true,
        encoding: 'utf8',
        stdio: 'inherit',
      });
    }
  }

  list = ['@types/jest', '@types/node', '@types/express', '@types/multer'];
  execSync(`yarn add -D ${list.join(' ')}`, {
    shell: true,
    encoding: 'utf8',
    stdio: 'inherit',
  });
};

run();
