var express = require('express');
var router = express.Router(); 
var mongoose = require('mongoose'); 
var path = require("path");

var clientModel = require("../models/clientModel");
var client = mongoose.model('clients', clientModel.clientSchema);

routes = {}

routes.saveSomethingToDb = function(request, response) {
	e.log("in save something to db")
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
	var obj = request.body; 
	// var visitInfo = request.body['visitInfo']
	// console.log(visitInfo); 
	var newClient = new client({firstName: obj.firstName, lastName: obj.lastName, phoneNumber: obj.phoneNumber, email: obj.email, address: obj.address, city: obj.city, state: obj.state, zip: obj.zip, medication: obj.medication, surgeryOrPregnancy: obj.surgeryOrPregnancy, sensitivity: obj.sensitivity, visits: [{date: obj.firstVisitDate, time: obj.firstVisitTime , price: obj.firstVisitPrice, notes: obj.firstVisitNotes}]}); 
	// do this to update visits: https://stackoverflow.com/questions/15621970/pushing-object-into-array-schema-in-mongoose
	newClient.save(function(err, newClient){ 
		if(err){ 
			console.log("There has been an error"); 
			console.log(err); 
			response.status(400).send(err); 
		}
		response.status(200).send(newClient); //or send new html page that says yes done, bye. 

		// response.status(200).redirect("/old/clientPageGET"); 
	})
}


routes.searchClients = function(request, response){ 

	var regexQuery = ".*" + request.query.text + ".*"; 

	var filterOption = String(request.query.option); 

	if(filterOption == "lastName"){ 
		client.find({"lastName": {$regex : regexQuery}}, function(err, clients){
			if(err){ 
				console.log(err); 
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

routes.loadOneClient = function(request, response){ 
	console.log('IN LOAD ONE CLIENT')
	console.log(request.query)
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
	//first update the mongo object 
	//https://docs.mongodb.com/manual/reference/operator/update/push/
	 // db.clients.update({"firstName": "ClientA"}, {$push: { visits :{ $each : [{"wk" : 3, "score" : 5}]}}})
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
// > db.clients.find({_id : ObjectId('59ae4fe4b9491e23b6c10423')})
// { "_id" : ObjectId("59ae4fe4b949 1e23b6c10423"), "firstName" : "ClientA", "lastName" : "ChangedLastName", "visits" : [ { "wk" : 1, "score" : 10 }, { "wk" : 2, "score" : 88 }, { "wk" : 3, "score" : 5 } ] }
	//then DO SET FOR ALL FIELDS MANUALLY CAUSE DON'T WANNA REPLACE WHOLE OBJECT SINCE DON'T WANNA REPLACE VISITS 

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

	// db.clients.update({"firstName" : "ClientA"}, {$set : {"lastName" : "ChangedLastName"}})
}

routes.renderSearchPageWithClientsGET = function(request, response){
	console.log("in all clients"); 
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