#!/bin/sh

git submodule update --recursive --remote
cd ./submodules/interpreter
npm install
cd ../webworker
npm install
cd ../../frontend
npm install

