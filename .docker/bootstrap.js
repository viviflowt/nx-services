const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const fg = require('fast-glob');
const Docker = require('dockerode');
const inquirer = require('inquirer');
const { log } = require('console');
const { yellow, green, red, dim } = require('colorette');
const { stdout } = require('process');

const docker = new Docker({ socketPath: '/var/run/docker.sock' });

const reset = async () => {
  const containers = await docker.listContainers({ all: true });

  if (containers.length > 0) {
    for (const container of containers) {
      const containerInfo = await docker.getContainer(container.Id).inspect();
      const containerName = containerInfo.Name.replace('/', '');
      log(`${red('✘')}`, dim(containerName));
      await docker.getContainer(container.Id).remove({ force: true });
    }
  }

  const volumes = await docker.listVolumes();

  if (volumes.Volumes.length > 0) {
    for (const volume of volumes.Volumes) {
      const volumeName = volume.Name;
      log(`${red('✘')}`, dim(volumeName));
      await docker.getVolume(volume.Name).remove();
    }
  }

  // const images = await docker.listImages({ all: true });

  // if (images.length > 0) {
  //   for (const image of images) {
  //     const imageName = image.RepoTags[0];
  //     log(`${red('✘')}`, dim(imageName));
  //     await docker.getImage(image.Id).remove({ force: true });
  //   }
  // }
};

const start = async (directory, ...services) => {
  const basePath = path.join(process.cwd(), '.docker', directory);
  if (!fs.existsSync(basePath)) {
    error('No docker-compose.yml found on the specified path');
    process.exit(1);
  }

  execSync(
    [
      'docker',
      'compose',
      'up',
      '--force-recreate',
      '--remove-orphans',
      '--detach',
      '--build',
      ...services,
    ]
      .join(' ')
      .trim(),
    { cwd: basePath, stdio: 'inherit' }
  );
};

const run = async () => {
  await reset();
  await start('redis', 'redis-primary');
  await start('redis', 'redis-replica');

  await start('postgres', 'postgres-primary');
  await start('postgres', 'postgres-replica');

  await start('mailhog', 'mailhog');
  await start('localstack', 'localstack');
};

run();
