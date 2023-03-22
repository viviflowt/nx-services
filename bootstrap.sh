#!/bin/bash

rm -rf dist 2>/dev/null

sudo docker stop $(sudo docker ps -a -q) 2>/dev/null
sudo docker rm $(sudo docker ps -a -q) 2>/dev/null
sudo docker volume rm $(sudo docker volume ls -qf dangling=true) 2>/dev/null
sudo docker network rm $(sudo docker network ls -q) 2>/dev/null
wait
clear

node .docker/bootstrap.js
