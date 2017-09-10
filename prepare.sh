#!/bin/sh

cd ./submodules/interpreter
npm install
cd ../webworker
npm install
cd ../../frontend
npm install

