# SOSML - frontend

# Installation instructions

## Prerequisites

Node.JS version 8 or higher and NPM version 5 or higher need to be installed on the system. GNU+Linux is recommended. 
Make sure you populated the correct and up-to-date submodules installed. If you don't have the SOSML-frontend repository cloned yet use this to also get the submodules:
```
git clone --recursive git@github.com:SOSML/SOSML-frontend.git
```
If you have the the SOSML-frontend repository but not its submodules (e.g. if you cloned without `--recursive`):
```
git submodule update --init --recursive
```

## Install/Update all NPM dependencies
To install or(non-exclusive or) update all NPM dependencies and pull all git submodules run:
```
./prepare.sh
```

## Build the interpreter and frontend

Now you should have beautiful typescript code. To make javascript out of this repo and the submodules run:
```
./build.sh
```

## Install docker

Install the latest version of docker on your system and make sure the docker daemon is running.
Run `docker pull derjesko/mosmlfallback` to dowload the docker image.

## Run the server

Switch to the `backend` folder. Run `npm install`.
Ensure that the user running the backend is in the `docker` group.
Run `node ./src/main.js`. In parallel, run `node ./src/worker.js` to start a worker.
