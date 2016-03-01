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
    //Contact       = require(__root + '/modules/mongoose').Contact,
    //ObjectId   = require(__root + '/modules/mongoose').ObjectId,
    mongoose    = require('mongoose');

/*
-----------------------------------------------------------------------------------
|
| Server setup
|
-----------------------------------------------------------------------------------
*/

mongoose.connect("127.0.0.1:27017/driverchecktest");
var CompSchema = new mongoose.Schema({
      _id:String
    }),
    Company = mongoose.model('companies',CompSchema),
    EmpSchema = new mongoose.Schema({
      _id:String,
      company:String
    }),
    Employee = mongoose.model('employees',EmpSchema);
    TestSchema = new mongoose.Schema({
      company:String,
      employee:String,
      name:String,
      date:Date,
      pass:Boolean
    }),
    Test = mongoose.model('tests',TestSchema),
    TestCatalogSchema  = new mongoose.Schema({
      _id:String
    }),
    TestCatalog = mongoose.model('testCatalog',TestCatalogSchema);


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

server.get('/api/companies', function(req, res) {
  //console.warn("Im trying to get the companies");
  Company.find(function(err, companies) {
    if (err) res.send(err);
    //console.warn(companies);
    res.json(companies);
  });
});

server.get('/api/employees', function(req, res) {
  //console.warn("Im trying to get the employees");
  Employee.find(function(err, employees) {
    if (err) res.send(err);
    //console.warn(employees);
    res.json(employees);
  });
});

server.get('/api/tests', function(req, res) {
  //console.warn("Im trying to get the tests");
  Test.find(function(err, tests) {
    if (err) res.send(err);
    //console.warn(tests);
    res.json(tests);
  });
});

// Post new Company on the db
server.post('/api/companies', function(req, res) {
  var company = new Company({
    _id: req.body._id
  });

  company.save(function(err) {
    if (err) res.send(err);
    res.send("Success");
  })
});

// Post new employees on the db
server.post('/api/employees', function(req, res) {

  //console.warn(req);
  var employee = new Employee({
    _id: req.body._id,
    company: req.body.company
  });

  employee.save(function(err) {
    if (err) res.send(err);
    res.send("Success");
  })
});

server.post('/api/tests', function(req, res) {

  console.warn("posting new test");
  var test = new Test({
    name: req.body.name,
    employee: req.body.employee,
    date: req.body.date,
    company: req.body.company,
    pass: req.body.pass
  });

  test.save(function(err) {
    if (err) res.send(err);
    res.send("Success");
  })
});

/*
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
*/
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
