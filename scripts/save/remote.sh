#!/bin/bash

# sudo systemctl restart networking
# sudo systemctl status networking

# sshpass -p down2727 ssh -t vivi@192.168.0.149 "zsh -c 'cd /home/vivi/dev; zsh'"

# sshpass -p down2727 ssh -t vivi@192.168.0.149 "zsh -c 'cd /home/vivi/usrbin/guru; zsh'"

BASE_DIR="/home/vivi/dev"

STORAGE_DIR="$BASE_DIR/storage"
SERVICE_DIR="$BASE_DIR/service"

sshpass -p down2727 ssh -t vivi@192.168.0.149 "zsh -c 'cd /home/vivi/dev; zsh'"

sshpass -p down2727 ssh -t vivi@192.168.0.149 "zsh -c 'cd /home/vivi/local-registry; zsh'"
