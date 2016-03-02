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
      name:String
    }),
    Company = mongoose.model('companies',CompSchema),
    EmpSchema = new mongoose.Schema({
      name:String,
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
      name:String
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

//Add element to the DB
server.post('/api/:type', function(req, res) {
  var element;
  switch (req.params.type){
    case 'company':
      element= new Company({
        name: req.body.name
      });
    break;
    case 'employee':
      element=new Employee({
        name: req.body.name,
        company: req.body.company
      });
    break;
    case 'test':
      element= new Test({
        name: req.body.name,
        employee: req.body.employee,
        date: req.body.date,
        company: req.body.company,
        pass: req.body.pass
      });
    break;
    default: return;
  }

  element.save(function(err,addedElement) {
    if (err) res.send(err);
    console.warn(addedElement);
    res.json(addedElement);
  })
});

server.delete('/api/:type/:id', function(req, res) {
  var collection;
  switch (req.params.type){
    case 'company':
      collection=Company;
    break;
    case 'employee':
      collection=Employee;
    break;
    case 'test':
      collection=Test;
    break;
  }

  collection.findByIdAndRemove(req.params.id, null, function(err, removed) {
      if (err) res.send(err);
      res.sendStatus(200);
  })
});

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
