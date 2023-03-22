#!/bin/bash

# ssh-add ~/.ssh/id_ed25519

# sshpass -p $SHH_PASS ssh -t vivi@192.168.0.148 "zsh -c 'cd /home/vivi/dev; zsh'"
# ssh-copy-id vivi@192.168.0.149
# cat ~/.ssh/viviflowt.pub | ssh vivi@192.168.0.149 "mkdir -p ~/.ssh && chmod 700 ~/.ssh && cat >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys"

# ---------------------------------------------------------------------------- #

BASE_DIR="/home/vivi/dev"

REMOTE_HOME_DIR="$BASE_DIR/home"
REMOTE_STORAGE_DIR="$BASE_DIR/storage"
REMOTE_SERVICE_DIR="$BASE_DIR/service"

sudo rm -rf /mnt/remote 2>/dev/null

mkdir -p /mnt/remote

sudo mkdir -p /mnt/remote/home
sudo mkdir -p /mnt/remote/storage
sudo mkdir -p /mnt/remote/service

# sudo sshfs -o allow_other,default_permissions vivi@192.168.0.149:$REMOTE_HOME_DIR /mnt/remote/home

# sudo sshfs -o allow_other,default_permissions vivi@192.168.0.149:$REMOTE_STORAGE_DIR /mnt/remote/storage

# sudo sshfs -o allow_other,default_permissions vivi@192.168.0.149:$REMOTE_SERVICE_DIR /mnt/remote/service

# sshpass -p down2727 ssh -t vivi@192.168.0.149 "zsh -c 'cd /home/vivi/@cluster; zsh'"
