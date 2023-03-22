const { execSync } = require('child_process');

const commands = [
  'rm -rf ./dist',
  'rm -rf ./coverage',
  'rm -rf ./generated',
  'rm -rf ./tmp',
  'prettier-package-json ./package.json --write',
  'node scripts/code.js --imports',
  // 'node scripts/code.js --unused',
  "npx imports-sanitize -p './src'",
  'prettier --ignore-path .gitignore --write "src/**/*.ts"',
  'eslint --fix "src/**/*.ts"',
];

for (const command of commands) {
  execSync(command, { stdio: 'inherit' });
}
