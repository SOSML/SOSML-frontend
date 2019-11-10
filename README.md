# SOSML - frontend

# Installation instructions

Node.JS version 8 or higher and NPM version 5 or higher need to be installed on the system. A Unix like OS especially Linux is recommended.
Install dependencies by running `npm install` in the `frontend` folder of the project directory.

Further, build a version of `SOSML/SOSML` and place the resulting `interpreter.min.js` as
`interpreter.js` in the `frontend/public` folder. Similarly, build a version of `SOSML/SOSML-webworker`
and put the result as `webworker.js` in the `frontend/public` folder.
(Note that per default, a fairly recent version of both files is provided already.)

If you want a built for deployment version just run `npm run build` and you can then find this version in the build folder.
For developing on this repo just run `npm run start` which launches a version of the website in this repo and automatically updates if it detects changes in any project files.
