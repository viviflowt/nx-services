const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const outputDir = path.join(process.cwd(), 'generated');

const args = process.argv.slice(2);

if (!args.length) {
  console.error('No name provided');
  process.exit(1);
}

const fileName = args
  .join(' ')
  .trim()
  .replace(/[^a-z0-9]/gi, '-')
  .toLowerCase();

// camelCase
const name = args
  .join(' ')
  .trim()
  .replace(/[^a-z0-9]/gi, ' ')
  .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
    return index === 0 ? word.toLowerCase() : word.toUpperCase();
  })
  .replace(/\s+/g, '');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(path.join(outputDir, '.gitkeep'), '');
}

const baseDir = path.join(outputDir, fileName);

if (fs.existsSync(baseDir)) {
  console.error('Directory already exists');
  process.exit(1);
}

fs.mkdirSync(baseDir, { recursive: true });

fs.writeFileSync(
  path.join(baseDir, 'index.ts'),
  `export * from './${fileName}';`
);
fs.writeFileSync(
  path.join(baseDir, `${fileName}.ts`),
  `
export const ${name} = (value: any): any => {
  return {}
}
`
);
fs.writeFileSync(
  path.join(baseDir, `${fileName}.spec.ts`),
  `
import { ${name} } from './${fileName}';

describe('${name}', () => {
  
  it('shoud be defined', () => {
    expect(${name}).toBeDefined();
  });  

});
`
);

console.log(`Created ${name} in ${baseDir}`);

execSync(`yarn prettier --write ${outputDir}/**/*.ts`, {
  stdio: 'inherit',
});
