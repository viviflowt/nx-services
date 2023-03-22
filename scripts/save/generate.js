const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const kebabCase = (string) => {
  return string.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
};

const camelCase = (string) => {
  return string.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
};

const green = (text) => `\x1b[32m${text}\x1b[0m`;

const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('Usage: node create-source.js <name>');
  process.exit(1);
}

const name = args.join(' ').trim();

const baseDir = path.resolve(process.cwd(), 'src', kebabCase(name));

if (fs.existsSync(baseDir)) {
  console.log(`Directory ${baseDir} already exists`);
  process.exit(1);
}

fs.mkdirSync(baseDir, { recursive: true });

const sourceFilePath = path.resolve(
  baseDir,

  `${kebabCase(name)}.ts`
);
const testFilePath = path.resolve(baseDir, `${kebabCase(name)}.spec.ts`);
const barrelFilePath = path.resolve(baseDir, 'index.ts');

const sourceText = `

export const ${camelCase(name)} = (value: any): any => {
    return value;
}
`;

const testText = `
import { ${camelCase(name)} } from './${kebabCase(name)}';

describe('${camelCase(name)}', () => {

    it('should be defined', () => {
        expect(${camelCase(name)}).toBeDefined();
    });

});
`;

const barrelText = `
export * from './${kebabCase(name)}';
`;

if (!fs.existsSync(path.dirname(sourceFilePath))) {
  fs.mkdirSync(path.dirname(sourceFilePath), { recursive: true });
}

fs.writeFileSync(sourceFilePath, sourceText);
fs.writeFileSync(testFilePath, testText);
fs.writeFileSync(barrelFilePath, barrelText);

execSync(`yarn prettier --write ${baseDir}`, { stdio: 'inherit' });

console.log(green('done!'));
