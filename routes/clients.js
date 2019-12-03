var express = require('express');
var router = express.Router(); 
var mongoose = require('mongoose'); 
var path = require("path");

var clientModel = require("../models/clientModel");
var client = mongoose.model('clients', clientModel.clientSchema);

routes = {}

// routes.saveSomethingToDb = function(request, response) {
// 	e.log("in save something to db")
// 	var test = new client({firstName: "Caseyuyyyyyyy AYY", lastName: "Tester", phoneNumber: 57777, email: "test@test.com"}); 
// 	test.save(function(err){
// 		console.log("tried to save"); 
// 		if(err){
// 			console.log(err); 
// 		}else{ response.sendStatus(200); }
// 	})
// }

// routes.getSomethingFromDb = function(request, response){ 
// 	console.log("in get something from db"); 
// 	client.find({firstName: {$regex : ".*ase.*"}}, function(err, client){ 
// 		if(err){ 
// 			console.log(err); 
// 		}
// 		console.log(client); 
// 		console.log(client.firstName); 
// 		console.log(client.lastName);
// 	}); 

// }

routes.saveNewClientPOST = function(request, response){ 
	//Takes in values from fields and adds them to db 
	//Returns new client object 

	var obj = request.body; 
	console.log(obj); 
	console.log(obj.firstVisitDate); 
	console.log(obj.firstVisitTime); 
	console.log(obj.firstVisitPrice); 
	console.log(obj.firstVisitNotes); 

	if ((obj.firstVisitDate == "") && (obj.firstVisitTime == "") && (obj.firstVisitPrice == 0.00) && (obj.firstVisitNotes == "")){
		console.log("in where everything is empty") 
		var newClient = new client({firstName: obj.firstName, lastName: obj.lastName, phoneNumber: obj.phoneNumber, email: obj.email, address: obj.address, city: obj.city, state: obj.state, zip: obj.zip, medication: obj.medication, surgeryOrPregnancy: obj.surgeryOrPregnancy, sensitivity: obj.sensitivity, visits: []}); 
	}
	else{ 
		console.log("in where everything is not empty")
		var newClient = new client({firstName: obj.firstName, lastName: obj.lastName, phoneNumber: obj.phoneNumber, email: obj.email, address: obj.address, city: obj.city, state: obj.state, zip: obj.zip, medication: obj.medication, surgeryOrPregnancy: obj.surgeryOrPregnancy, sensitivity: obj.sensitivity, visits: [{date: obj.firstVisitDate, time: obj.firstVisitTime , price: obj.firstVisitPrice, notes: obj.firstVisitNotes}]}); 
	} 

	console.log(newClient); 
	// do this to update visits: https://stackoverflow.com/questions/15621970/pushing-object-into-array-schema-in-mongoose
	newClient.save(function(err, newClient){ 
		if(err){ 
			console.log("There has been an error"); 
			console.log(err); 
			response.status(400).send(err); 
		}
		response.status(200).send(newClient); //or send new html page that says yes done, bye. 
	})
}


routes.searchClients = function(request, response){ 
	//Queries db for client with first name that matches given string
	//returns all clients that match by either first or last name the given name string

	var regexQuery = ".*" + request.query.text + ".*";  

	var filterOption = String(request.query.option); 

	if(filterOption == "lastName"){ 
		client.find({"lastName": {$regex : regexQuery}}, function(err, clients){  
			if(err){ 
				response.status(404).send(err);
			}
			response.send(clients);
		});

	} else { //if (filterOption == "firstName")
		client.find({"firstName": {$regex : regexQuery}}, function(err, clients){  
			if(err){ 
				response.status(404).send(err);
			}
			response.send(clients);
		});

	} 
}

routes.getAllClientsGET = function(request, response){ 
	//Queries db for all clients in the db 
	//returns all clients in the db
	console.log("in load clients"); 
	client.find({}, function(err, allClients){ 
		if(err){ 
			console.log("There has been an error loading all the clients");
			console.log(err); 
			response.send(404); 
		}
		response.send(allClients); 
	})
}

routes.getOneClientGET = function(request, response){ 
	//Queries db for one client in the db 
	//returns the client in the db with the matching id 
	client.findById(request.query.id, function(err, client){ 
		if(err){ 
			console.log("there has been an error loading a client page");
			console.log(err); 
			response.send(404); 
		}
		console.log(client)
		response.send(client);  
	})
}

routes.saveNewVisitPOST = function(request, response){ 
	//Finds a client and adds a visit to the client's visit list 
	//returns whole updated client 
	 console.log(request.body)
	 client.findOneAndUpdate({_id: request.body.clientId}, {$push: { visits: {$each : [{date: request.body.visitDate, time: request.body.visitTime, price: request.body.visitPrice, notes: request.body.visitNotes}]}}}, {new: true}, 
	 	function(err, clientUpdated){
	 		if(err){ 
	 			console.log("There has been an error saving a new visit" + err); 
	 			response.status(404).send(err); 
	 		} 
	 		response.status(200).send(clientUpdated); 
	 	} 
	)
}


routes.updateOldClientInfoPOST = function(request, response){
	//Finds client by id (which will never change) and replaces whole object with new updated client 
	//returns updated client object 
	var obj = request.body;  
	client.findOneAndUpdate({_id : obj.id}, {$set : {firstName: obj.firstName, lastName: obj.lastName, phoneNumber: obj.phoneNumber, email: obj.email, address: obj.address, city: obj.city, state: obj.state, zip: obj.zip, medication: obj.medication, surgeryOrPregnancy: obj.surgeryOrPregnancy, sensitivity: obj.sensitivity}}, {new: true}, 
		function(err, clientUpdated){
			if(err){ 
	 			console.log("There has been an error updating client information" + err); 
	 			response.status(404).send(err); 
	 		} 
	 		console.log(clientUpdated)
	 		response.status(200).send(clientUpdated);  
		})
}

routes.renderSearchPageWithClientsGET = function(request, response){
	//Queries db for all the clients and then renders html page with client data
	//renders html with client data
	client.find({}, function(err, allClientsEver){ 
		if(err){ 
			console.log("There has been an error loading all the clients");
			console.log(err); 
			//otherwise render an error page
		}
		var sortedClients = sortClientsByFirstName(allClientsEver)
		response.render("search", {allClients : sortedClients}); 
	})

}


function sortClientsByFirstName(clientsArray){
	//Sorts an array of client objects by client first name 
	//returns sorted array 
	 
	//http://jsfiddle.net/rLwrx6dx/
	return clientsArray.sort(function(a, b){ 
		if(a.firstName.toLowerCase() < b.firstName.toLowerCase()){ 
			return -1; 
		}
		else if(a.firstName.toLowerCase() > b.firstName.toLowerCase()){ 
			return 1; 

		} else{ //else if first names are equal, if so, check last name
			if(a.lastName.toLowerCase() < b.lastName.toLowerCase()){ 
				return -1; 
			} else if(a.lastName.toLowerCase() > b.lastName.toLowerCase()){  
				return 1; 
			} else{  
				return 0; 
			}
		}

	}); 
}

module.exports = routes; 