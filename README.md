# SOSML - Frontend

A frontend for SOSML, used by sosml.org, that has different themes (with dark mode
support) and allows for saving SML code in the browser.

# Installation Instructions

## Prerequisites

Node.JS version 8 or higher and NPM version 5 or higher need to be installed on the system. GNU+Linux is recommended.
```
git clone https://github.com/SOSML/SOSML-frontend.git
```

## Install/Update all NPM dependencies
To install or(non-exclusive or) update all NPM dependencies run `npm i` in the frontend folder.

## Building and Running  frontend

The frontend can be run locally with `npm run start`, this will use a compiled version of the
webworker placed in the `frontend/public` server to actually run SML code. To obtain
optimized files suitable for production, use `npm run build` to populate tho `build`
folder. The files in the `build` folder are then suitable to be served on a static web
server. (Consult the SOSML-backend repository on how to run a non-static server that
allows for file uploading/sharing.)
