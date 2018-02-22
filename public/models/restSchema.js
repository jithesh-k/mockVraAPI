var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var restSchema = new Schema({
        url:String,
        method:String,
      authorization:String,
      headers:String,
        restbody:String,
       response:String
});

var restCollection = mongoose.model('restCollection',restSchema);

module.exports = restCollection;
