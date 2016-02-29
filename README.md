![banner-image][banner]
[banner]: https://cloud.githubusercontent.com/assets/4806217/6219181/87dbe5c6-b626-11e4-90f0-a9f461a83cb8.png "Banner"

# MEAN-CRUD
A simple project to demonstrate the capabilities of the MEAN stack.

Prerequisites:
- NodeJS ([nodejs.org](http://nodejs.org/))
- MongoDB ([mongodb.org](http://www.mongodb.org/))

To configure the application to suit your setup, edit the config.js:

```javascript
// config.js
{
  port: 3000,
  db: {
    host: 'localhost',
    name: 'MEAN-CRUD'
  }
}
```

To start working, clone this repository to your local machine and execute the following commands:

```
$ npm install
$ bower install
$ node server.js
$ gulp
```

I strongly advice using Nodemon for NodeJS development purposes. 

```
$ npm install -g nodemon
```
With the application up and running you should see this:

![alt text][screen]
[screen]: https://cloud.githubusercontent.com/assets/4806217/6247959/cee2b44a-b77a-11e4-9e09-af5bf88249b9.png "Banner"

Persistently CRUD your data with the MEAN Stack. Enjoy!

