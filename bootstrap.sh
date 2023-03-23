#!/bin/bash

rm -rf dist 2>/dev/null

sudo docker stop $(sudo docker ps -a -q) 2>/dev/null
sudo docker rm $(sudo docker ps -a -q) 2>/dev/null
sudo docker volume rm $(sudo docker volume ls -qf dangling=true) 2>/dev/null
sudo docker network rm $(sudo docker network ls -q) 2>/dev/null
clear

docker system prune --force --all --volumes
clear

# Pull images
docker compose pull

# Redis
docker compose up --detach --wait redis-primary
docker compose up --detach --wait redis-replica

# Postgres
docker compose up --detach --wait postgres-primary
docker compose up --detach --wait postgres-replica

# Mailhog
docker compose up --detach --wait mailhog

# Localstack
docker compose up --detach --wait localstack

echo
docker ps --all --format "{{.Names}}\t{{.Status}}"
sleep 3
echo

docker compose logs --follow
