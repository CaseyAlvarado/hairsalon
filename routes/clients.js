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
			response.status(400).send(err); 
		}
		response.sendStatus(200); //or send new html page that says yes done, bye. 
	})
}

// routes.blah = function(request, response){ 
// 	//Intput: request, response object 
// 	//Output: This is an ajax function called, so sends back to client-js all of the ingredients in the database 
// 	console.log("just curious to know what this is")
// 	console.log(request.xhr)
// 	if(request.xhr){ 
// 		// addIngredient(request, response); 

// 		//then get all ingredients 
// 		// getIngredients(function(allIngredients){
// 		// 	response.send(allIngredients); 
// 		// });
// 		response.send(user); 
// 	}
// 	response.send(user);
// }
module.exports = routes; 