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

server.get('/api/:type', function(req, res) {
  var collection;
  switch (req.params.type){
    case 'companies':
      collection= Company;
    break;
    case 'employees':
      collection=Employee; 
    break;
    case 'tests':
      collection=Test;
    break;
    default: return;
  }
  collection.find(function(err, collectionRetreived) {
    if (err) res.send(err);
    else{
      res.json(collectionRetreived);
    }
  });
});

//Add element to the DB
server.post('/api/new/:type', function(req, res) {
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
    else{
      console.warn(addedElement);
      res.json(addedElement);
    }
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
    default: return;
  }

  collection.findByIdAndRemove(req.params.id, null, function(err, removed) {
      if (err) res.send(err);
      else{
        res.sendStatus(200);
      }
  })
});

server.post('/api/update/:type/:id', function(req, res) {
  console.warn("I got here 1");
  var collection,
      element;
  switch (req.params.type){
    case 'company':
      collection=Company;
      element= {
        name: req.body.name
      };
    break;
    case 'employee':
      collection=Employee;
      element={
        name: req.body.name,
        company: req.body.company
      };
    break;
    case 'test':
      collection=Test;
      element= {
        name: req.body.name,
        employee: req.body.employee,
        date: req.body.date,
        company: req.body.company,
        pass: req.body.pass
      };
    break;
    default: return;
  }
  console.warn(element);

  collection.update({_id:req.params.id}, element, function(err, updatedElement) {
      if (err) res.send(err);
      else{
        res.json(updatedElement);
        console.warn("I got here 3");
      }
  })
});

server.post('/api/login', function(req, res) {
    if (req.body.user=="qwerty" && req.body.pass=="12345")
      res.send(true);
    else res.send(false);
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
