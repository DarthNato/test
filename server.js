/*
-----------------------------------------------------------------------------------
|
| Dependencies
|
-----------------------------------------------------------------------------------
*/

global.__root = __dirname;

var express    = require('express'),
    bodyParser = require('body-parser'),
    config     = require(__root + '/config'),
    Contact       = require(__root + '/modules/mongoose').Contact,
    ObjectId   = require(__root + '/modules/mongoose').ObjectId;

/*
-----------------------------------------------------------------------------------
|
| Server setup
|
-----------------------------------------------------------------------------------
*/

var server = express();
server.use(express.static(__dirname + '/public'));
server.use(bodyParser.urlencoded({ extended: true }));
server.listen(config.port);

console.log("Listening on port " + config.port);

/*
-----------------------------------------------------------------------------------
|
| API setup
|
-----------------------------------------------------------------------------------
*/

// Get all contacts
server.get('/api/contacts', function(req, res) {
  Contact.find(function(err, contacts) {
    if (err) res.send(err);
    res.json(contacts);
  });
});

// Post new contact
server.post('/api/contacts', function(req, res) {
  var contact = new Contact({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email
  });

  contact.save(function(err) {
    if (err) res.send(err);
    res.send("Success");
  })
});

//Verify user
server.post('/api/login', function(req, res) {
  console.warn("login");
  res.json("false");
});

// Delete contact
server.delete('/api/contacts/:id', function(req, res) {

  Contact.findByIdAndRemove(req.params.id, null, function(err, removed) {
    if (err) res.send(err);
    res.sendStatus(200);
  });

})

/*
-----------------------------------------------------------------------------------
|
| Default route
|
-----------------------------------------------------------------------------------
*/

server.get('*', redirectToIndex);

function redirectToIndex(req, res) {
  res.redirect('/');
}
