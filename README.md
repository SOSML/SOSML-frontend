# SOSML - frontend

# Installation instructions

## Prerequisites

Node.JS version 8 or higher and NPM version 5 or higher need to be installed on the system. Linux is recommended.

## Build the interpreter and frontend

After cloning the repository, first enter the `frontend` directory.
In the directory, execute `npm install` and then `npm run build`.

This will create the `build` directory containing a file `interpreter.js`.
Go back to the root directory of the repository and copy `interpreter/build/interpreter.js` to `frontend/public/interpreter.js`.

Now enter the `frontend` directory. Run `npm install` and then `npm run build`.

## Install docker

Install the latest version of docker on your system and make sure the docker daemon is running.
Run `docker pull derjesko/mosmlfallback` to dowload the docker image.

## Run the server

Switch to the `backend` folder. Run `npm install`.
Ensure that the user running the backend is in the `docker` group.
Run `node ./src/main.js`. In parallel, run `node ./src/worker.js` to start a worker.
