# adt-rostering

Rostering website for ADT choreographers, built with a React.js frontend, Node.js backend, with live updating via socket.io. Data stored in MongoDB.

To run locally:
```
npm install //install dependencies
npm start //connect to server
```
in another terminal tab:
```
npm run hotloader //live development on localhost:5000
```
You need to use node 16 on the hotloader because there is some incompatibility with node 17 and 16.
All pushes auto-deploy to Heroku. 
