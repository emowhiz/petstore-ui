# petstore-ui

This is the React example front end for petstore-api.

## To use
Requires petstore-api to be running.(https://github.com/emowhiz/petstore-api)
There are several simple server implementations included. They all serve static files from `public/` and handle requests to `http://localhost:8080/pet/` to fetch data. Start a server with one of the following:

### Node

```sh
npm install
node server.js
```

And visit <http://localhost:3000/>. 

## Changing the port

You can change the port number by setting the `$PORT` environment variable before invoking, e.g.,

```sh
PORT=3001 node server.js
```
