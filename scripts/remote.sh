#!/bin/bash

# sudo systemctl restart networking
# sudo systemctl status networking

sshpass -p down2727 ssh -t vivi@192.168.0.149 "zsh -c 'cd /home/vivi/dev; zsh'"
