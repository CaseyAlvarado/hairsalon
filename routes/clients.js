var express = require('express'); 
var router = express.Router(); 
var mongoose = require('mongoose'); 

var clientModel = require("../models/clientModel");
var client = mongoose.model('clients', clientModel.clientSchema); 

routes = {}


routes.saveSomethingToDb = function(request, response) {
	console.log("in save something to db")
	var test = new client({firstName: "test", lastName: "Tester", phoneNumber: 57777, email: "test@test.com"}); 
	test.save(function(err){
		console.log("tried to save"); 
		if(err){
			console.log(err); 
		}
		// resonse.sendStatus(); 
	})
}

module.exports = routes; 