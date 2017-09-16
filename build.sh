#!/bin/sh

cd ./submodules/interpreter
npm run dist
cd ../webworker
npm run dist
cd ../../
cp ./submodules/interpreter/build/interpreter.min.js ./frontend/public/interpreter.js
cp ./submodules/webworker/build/webworker.js ./frontend/public/webworker.js
cd ./frontend
npm run build

