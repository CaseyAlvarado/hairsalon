var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var express = require('express');
var fs = require('fs'); 
var request = require('request'); 
var cheerio = require("cheerio"); 

var app = express();

var mongoose = require('mongoose'); 
// var uri = "mongodb://casey:hairdesiresalon@ds139705.mlab.com:39705/clients"; 
var db = 'mongodb://maria:2000@ds139705.mlab.com:39705/clients'
mongoose.connect(db); 

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
  response.sendFile(__dirname + '/views/home.html');
}, clients.saveSomethingToDb); 
// app.post('/new/saveNewClientPOST', ..............); 
