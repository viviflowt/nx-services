#!/bin/bash

rm -rf dist 2>/dev/null

sudo docker stop $(sudo docker ps -a -q) 2>/dev/null
sudo docker rm $(sudo docker ps -a -q) 2>/dev/null
sudo docker volume rm $(sudo docker volume ls -qf dangling=true) 2>/dev/null
sudo docker network rm $(sudo docker network ls -q) 2>/dev/null
clear

docker system prune --force --all --volumes
wait
clear

# Redis
docker compose up --detach --wait redis-primary
docker compose up --detach --wait redis-replica

# Postgres
docker compose up --detach --wait postgres-primary
docker compose up --detach --wait postgres-replica

# Mongo
# docker compose up --detach --wait mongo-primary
# docker compose up --detach --wait mongo-replica mongo-arbiter

# Mailhog
docker compose up --detach --wait mailhog

# Localstack
docker compose up --detach --wait localstack

# Logs
docker compose logs --follow
