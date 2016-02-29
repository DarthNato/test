/*
-----------------------------------------------------------------------------------
|
| Dependencies
|
-----------------------------------------------------------------------------------
*/

var mongoose = require('mongoose'),
    config   = require(__root + '/config');

/*
-----------------------------------------------------------------------------------
|
| Configuration
|
-----------------------------------------------------------------------------------
*/

connection = mongoose.connect('mongodb://' + config.db.host + '/' + config.db.name);

var Schema   = mongoose.Schema
    ObjectId = Schema.ObjectId;
 
var schema = new Schema({
  id       : ObjectId,
  firstname : String,
  lastname  : String,
  email     : String
});

var Contact = mongoose.model('Contact', schema);

/*
-----------------------------------------------------------------------------------
|
| Module
|
-----------------------------------------------------------------------------------
*/

module.exports = {
  connection: connection,
  Contact: Contact,
  ObjectId: ObjectId
}
