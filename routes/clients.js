var express = require('express'); 
var router = express.Router(); 
var mongoose = require('mongoose'); 

var clientModel = require("../models/clientModel");
var client = mongoose.model('clients', clientModel.clientSchema); 

routes = {}

routes.saveSomethingToDb = function(request, response) {
	console.log("in save something to db")
	var test = new client({firstName: "Caseyuyyyyyyy AYY", lastName: "Tester", phoneNumber: 57777, email: "test@test.com"}); 
	test.save(function(err){
		console.log("tried to save"); 
		if(err){
			console.log(err); 
		}else{ response.sendStatus(200); }
	})
}

routes.saveNewClientPOST = function(request, response){ 
	console.log(request.body); 
	var obj = request.body; 
	var visitInfo = request.body['visitInfo']
	var newClient = new client({firstName: obj.firstName, lastName: obj.lastName, phoneNumber: obj.phoneNumber, email: obj.email, address: obj.address, city: obj.city, state: obj.state, zip: obj.zip, medication: obj.medication, surgeryOrPregnancy: obj.surgeryOrPregnancy, sensitivity: obj.sensitivity, visits: visitInfo}); 
	// do this to update visits: https://stackoverflow.com/questions/15621970/pushing-object-into-array-schema-in-mongoose
	newClient.save(function(err){ 
		if(err){ 
			console.log("There has been an error"); 
			console.log(err); 
		}
		response.sendStatus(200); //or send new html page that says yes done, bye. 
	})
}

module.exports = routes; 