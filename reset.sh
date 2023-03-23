#!/bin/bash

yarn typeorm schema:drop
yarn typeorm schema:sync
