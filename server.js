
const express = require('express')
const mongoose = require('mongoose');
const app = express()

app.use(express.static(__dirname+"/public"));
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://dbuser1:dbuser1@ds247077.mlab.com:47077/jktestdb',{
  useMongoClient: true
});

const restSchema= require('./public/models/restSchema')

var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
app.use(bodyParser.json());
//
Object.compare = function (obj1, obj2) {
	//Loop through properties in object 1
	for (var p in obj1) {
		//Check property exists on both objects
		if (obj1.hasOwnProperty(p) !== obj2.hasOwnProperty(p)) return false;
 
		switch (typeof (obj1[p])) {
			//Deep compare objects
			case 'object':
				if (!Object.compare(obj1[p], obj2[p])) return false;
				break;
			//Compare function code
			case 'function':
				if (typeof (obj2[p]) == 'undefined' || (p != 'compare' && obj1[p].toString() != obj2[p].toString())) return false;
				break;
			//Compare values
			default:
				if (obj1[p] != obj2[p]) return false;
		}
	}
 
	//Check object 2 for any extra properties
	for (var p in obj2) {
		if (typeof (obj1[p]) == 'undefined') return false;
	}
	return true;
};
//

app.get('/users',function(req,res){
    console.log("I received a Get request");
    var promise = restSchema.find({});
    promise.then(successCallback, errorCallback);
    function successCallback(docs){
        console.log(docs)
         res.json(docs);
    }
    function errorCallback(error){
      res.status(err.status || 500);
      res.render('error', {
      message: err.message,
      error: err
    });
    }
  })


  app.delete('/users/:id', function (req, res) {
		var id = req.params.id;
		console.log(id);
    var promise = restSchema.remove({ _id: req.params.id }, function (err, docs) {
			if (err) { console.log("Error removing Area") }
			console.log(docs);
			res.json(docs);
		});
})


app.get('/users/:id', function (req, res) {
		var id = req.params.id;
		console.log(id);
    restSchema.findOne({ _id: req.params.id }).exec(function (err, docs) {
        if (err) { console.log("Error getting particular area") }
        console.log("Result:" + docs);
        res.json(docs);
    })
})


app.put('/users/:id', jsonParser, function (req, res) {
		
		var id = req.params.id;
		console.log(req.body);
    restSchema.findById(req.params.id, function (err, doc) {
			if (err) {
				console.log("Error getting document");
				return;
			}
			console.log("found for update" + doc);
			doc.url = req.body.url;
			doc.method = req.body.method;
			doc.authorization = req.body.authorization;
			doc.headers = req.body.headers;
			doc.restbody = req.body.restbody;
      doc.response = req.body.response;

			doc.save(function (err, docs) {
				if (err) {
					console.log(err);
				}
				else {
					res.json(docs);
				}
			})


		})

})
function compareObjects(obj1, obj2){
  var equal = true;
  for (i in obj1)
      if (!obj2.hasOwnProperty(i))
          equal = false;
  return equal;
}
//

//

app.post('/users',jsonParser,function(req,res){
   console.log(req.body);
    var rest = new restSchema(req.body);

    var promise = rest.save();

    promise.then(successCallback, errorCallback);

    function successCallback(docs){
        console.log(docs)
         res.json(docs);
        
    }
    function errorCallback(error){
      res.status(err.status || 500);
      res.render('error', {
      message: err.message,
      error: err
    });
    }
})
app.get('/statuscheck',(req,res)=>{
console.log('Checking status of request');
setTimeout(()=>{
 res.json('Success');
},5000);
});

app.get('*', function (req, res){
  	//ResourceActionRequest,CatalogItemRequest
    restSchema.find({url:req.url,method:req.method}, function (err, docs) {
      //if(req.body.@type==""){

      //}
			if (err) {
				console.log("Error getting document");
				return;
			}
			console.log("found for update" + docs);
			console.log(docs)
      if(docs.length>0){
        res.json(docs[0].response);
      }
      else{
        res.json(docs);
      }
      
		})
});


app.put('*', jsonParser, function (req, res) {	
  app.use(bodyParser.json());
 
    restSchema.find({url:req.url,method:req.method,restbody:JSON.stringify(req.body)}, function (err, docs) {
			if (err) {
				console.log("Error getting document");
				return;
			}
		console.log("found for update" + docs);
		console.log(docs)
    if(docs.length === 1)
    res.json(docs[0].response);
    else
    res.status(404).send("Sorry can't find that!")
		})

})


app.post('*', jsonParser, function (req, res) {	
  var equal=true;
  restSchema.find({url:req.url,method:req.method}, function (err, docs){
    if(err){
      return;
    }
    else{
      //if(JSON.stringify(docs[0].restbody)==JSON.stringify(req.body)){
        if(docs.length > 0){
          var foundItem=false;
          for(var i=0;i<docs.length;i++){
            if(Object.compare(req.body,JSON.parse(docs[i].restbody))){
              //res.setHeader('Content-Type', 'application/json')
              res.set({'Content-Length':"0",'Content-Type':"application/json;charset=UTF-8","Date":"Wed, 24 Jan 2018 10:02:22 GMT","ETag":"\"0\"","Location":"http://localhost:3000/statuscheck","Vary":"Accept-Encoding,User-Agent"});
              //res.writeHead(200,'{"Content-Length":"0","Content-Type":"application/json;charset=UTF-8","Date":"Wed, 24 Jan 2018 10:02:22 GMT","ETag":"\"0\"","Location":"https://D1CMPVRAAMVW1.stc.fehc/catalog-service/api/consumer/requests/66d6d522-5cf8-4384-8635-fbfbe535aeb8","Vary":"Accept-Encoding,User-Agent"}');
              //res.json(docs[i].response);
              res.send(docs[i].response);
              console.log("Found");
              console.log(docs);
              foundItem=true;
              break;
            }
          }
          if(!foundItem){
            res.status(404).send("Sorry can't find that!")
          }
          
        }
        else{
         
          res.status(404).send("Sorry can't find that!")
        }
     // }
      
    }
    
  })
   /* restSchema.find({url:req.url,method:req.method,restbody:JSON.stringify(req.body)}, function (err, docs) {
			if (err) {
				console.log("Error getting document");
				return;
			}
		console.log("found for update" + docs);
		console.log(docs)
    if(docs.length === 1)
    res.json(docs[0].response);
    else
    res.status(404).send("Sorry can't find that!")
		})
*/
})



app.delete('*', jsonParser, function (req, res) {	
  app.use(bodyParser.json());
    restSchema.find({url:req.url,method:req.method,restbody:JSON.stringify(req.body)}, function (err, docs) {
			if (err) {
				console.log("Error getting document");
				return;
			}
		console.log("found for update" + docs);
		console.log(docs)
    if(docs.length === 1)
    res.json(docs[0].response);
    else
    res.status(404).send("Sorry can't find that!")
		})

})




app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
