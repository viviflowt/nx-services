const { NodeSSH } = require('node-ssh');
const fs = require('fs-extra');
const path = require('path');
const fg = require('fast-glob');
const os = require('os');
const { execSync } = require('child_process');
const dotenv = require('dotenv');
const { green } = require('colorette');
const { stdout } = require('process');

dotenv.config();

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const run = async () => {
  const ssh = new NodeSSH();

  const config = {
    host: process.env.SSH_HOST,
    username: process.env.SSH_USERNAME,

    privateKey: fs.readFileSync(
      path.join(os.homedir(), '.ssh', 'viviflowt'),
      'utf8'
    ),
    passphrase: process.env.SSH_PASSPHRASE,
  };

  const localRoot = path.join(process.cwd(), '.docker');
  const remoteRoot = '/home/vivi';
  const remotePath = path.join(remoteRoot, 'local-registry');

  await ssh.connect(config).catch((err) => {
    console.error(err.message);
    process.exit(1);
  });

  // hide cursor
  process.stdout.write('\x1B[?25l');

  const progressBar = (count, total) => {
    const width = 60;
    const bar = Math.floor((count / total) * width);

    return `[${'='.repeat(bar)}${' '.repeat(width - bar)}] ${count}/${total}`;
  };

  const clearLine = () => {
    process.stdout.write('\u001b[2K\u001b[0G');
  };

  const files = await fg(['.docker/**/*'], {
    gitignore: true,
    dot: true,
    onlyFiles: true,
    absolute: true,
    ignore: ['**/node_modules/**', '**/dist/**', '.git/**'],
  });

  const total = files.length;
  let count = 0;

  console.log(`transferring ${total} files...`);

  await ssh.execCommand(`mkdir -p ${remotePath} `, {
    cwd: remoteRoot,
  });

  await ssh.execCommand(`rm -rf ${remotePath}/*`, {
    cwd: remoteRoot,
  });

  const transfer = async (file) => {
    count++;
    const localFile = path.relative(localRoot, file);
    const remoteFile = path.join(remotePath, localFile);

    await ssh
      .putFile(file, remoteFile)
      .then(() => {
        clearLine();
        process.stdout.write(`\r${progressBar(count, total)}`);
      })
      .catch((err) => {
        console.log('error', err.message);
        process.exit(1);
      });

    await sleep(300);
  };

  for (const file of files) {
    await transfer(file);
  }

  stdout.write('\n\n');

  await ssh.execCommand(`chmod 775 -R ./*`, {
    cwd: remotePath,
    onStdout: (chunk) => process.stdout.write(chunk),
    onStderr: (chunk) => process.stdout.write(chunk),
    options: { pty: true },
  });

  await sleep(1000);

  await ssh.execCommand(`chmod +x bootstrap.sh && bash bootstrap.sh`, {
    cwd: remotePath,
    onStdout: (chunk) => process.stdout.write(chunk),
    onStderr: (chunk) => process.stdout.write(chunk),
    options: { pty: true },
  });

  await sleep(1000);

  ssh.dispose();

  // show cursor
  process.stdout.write('\x1B[?25h');
};

run();
