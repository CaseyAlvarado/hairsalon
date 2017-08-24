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

routes.getSomethingFromDb = function(request, response){ 
	console.log("in get something from db"); 
	client.find({firstName: {$regex : ".*ase.*"}}, function(err, client){ 
		if(err){ 
			console.log(err); 
		}

		console.log(client); 
		console.log(client.firstName); 
		console.log(client.lastName);
	}); 

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


// routes.searchClients = function(request, response){ 
// 	console.log("in search clients")
// 	console.log(request);
// 	console.log('request query')
// 	console.log(request.query); 

// 	var regexQuery = ".*" + request.query.text + ".*"; 
// 	console.log("what option " + request.query.option); 

// 	var filterOption = request.query.option; 

// 	client.find({filterOption : {$regex : regexQuery}}, function(err, client){ 
// 		if(err){ 
// 			console.log(err); 
// 		}
// 		console.log("CLIENT FOUND"); 
// 		console.log(client); 
// 	// 	console.log(client.firstName); 
// 	// 	console.log(client.lastName);
// 	}); 
// }

routes.loadClients = function(request, response){ 
	client.find({}, function(err, allClients){ 
		if(err){ 
			console.log("There has been an error loading all the clients");
			console.log(err); 
			response.send(404); 
		}

		response.send(allClients); 
	})
}
module.exports = routes; 