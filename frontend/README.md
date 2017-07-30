# Frontend

This folder contains the source code and configuration to build and test the web frontend.

## Prerequisites

The dependencies of this package must be installed to test or build.
```bash
npm install
```

**WARNING**: For some reason builds have been failing with errors which seem to be a problem with dependencies (and possibly NPM itself). A way to resolve this seems to be:
1. Use NPM 5 or higher (to use the `package-lock.json`)
2. If dependencies are missing, install them manually with `npm install <dependency>`

## Build

To build the interpreter and optimize for production:
```bash
npm run build
```
This will create a directory `build` containing all necessary files to deploy the project.
