var path = require("path");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var express = require("express");
var fs = require("fs"); 
var request = require("request"); 
var cheerio = require("cheerio"); 
var app = express();


var passport = require("passport"); 
var LocalStrategy = require("passport-local").Strategy; 


var mongoose = require('mongoose'); 
// var uri = "mongodb://casey:hairdesiresalon@ds139705.mlab.com:39705/clients"; 
// var db = 'mongodb://maria:2000@ds139705.mlab.com:39705/clients'
var uri = 'mongodb://Casey-hairsalonDB:Aerosmith1@ec2-34-204-182-56.compute-1.amazonaws.com:27017/hairsalonDB'
mongoose.connect(uri); 

var user = {name: "Maria", pwd: "Maria"} 

var clients = require("./routes/clients"); 

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// START SERVER ================================================================
app.listen(8000, function() {
  console.log('Server running on port:', 8000);});
//send html page
app.get('/', function(request, response){ 
  response.sendFile(__dirname + '/views/home.html')});

app.post('/login', function(request, response){
	if (request.body.username !== user.name){ 
		console.log("username does not match")
		response.status(401).send({error: "There is a problem with your USERNAME."}); 
	} else if (request.body.password !== user.pwd){ 
		console.log("password does not match")
		response.status(401).send({error: "There is a problem with your PASSWORD."});
	} else{ 
		console.log("matches")
		response.redirect("/home");  
	}
});

app.get('/home', function(request, response){ 
  response.sendfile(__dirname + '/views/home.html')}); 
 
app.get('/new', function(request, response){ 
  response.sendFile(__dirname + '/views/newClient.html')}); 
app.get('/new/testDB', clients.saveSomethingToDb); 
app.post('/new/saveNewClientPOST', clients.saveNewClientPOST); 

app.get('/old', function(request, response){ 
	response.sendFile(__dirname + '/views/search.html')
})

app.get("/getObjectsFromDB", clients.getSomethingFromDb); 

app.get("/searchClients", clients.searchClients); 

app.get("/loadAllClients", clients.loadClients); 

app.get("/old/loadClientPageGET", clients.loadOneClientPage); 

app.post("/old/saveNewVisitPOST", clients.saveNewVisitPOST); 

app.post("/old/updateOldClientInfoPOST", clients.updateOldClientInfoPOST); 

app.get('/old/clientPageGET', function(request, response){ 
  response.sendfile(__dirname + '/views/oldClient.html')}); 

