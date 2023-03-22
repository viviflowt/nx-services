const { execSync } = require('child_process');

const commands = [
  'prettier-package-json ./package.json --write',
  'node scripts/code.js --imports',
  // 'node scripts/code.js --unused',
  "npx imports-sanitize -p './apps'",
  "npx imports-sanitize -p './libs'",
];

for (const command of commands) {
  execSync(command, { stdio: 'inherit' });
}
