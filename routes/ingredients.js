var express = require('express'); 
var router = express.Router(); 
var mongoose = require('mongoose'); 

var ingredientModel = require('../models/ingredientModel');
var ingredients = mongoose.model('ingredients', ingredientModel.ingredientSchema);

routes = {}; 

var home = function (request, response){
  //input: request, response 
  //output: -- instead renders welcome message 
  response.render('home', {"message": "Welcome to the burger app, yumm!"});
}

var getIngredients = function(callback){ 
	//Input: callback function to call next after this function executes 
	//Output: returns a call to the callback function with all of the ingredients found in mongoose 
	ingredients.find({}, function(err, allIngredients){
		if (err){ 
			console.log(err); 
		}
		return callback(allIngredients); 
	}); 
}

var addIngredient = function(request, response){
	//Input: request, response object
	//Output: --

	//makes a new ingredient with the ingredient schema and saves it to the database 
	var newIngredient = new ingredients({name: request.body.name, price: request.body.price, outOfStock: request.body.outOfStock}); 
	console.log(newIngredient); 
	newIngredient.save(function(err){ 
		console.log("there was a problem saving the new ingredient", err); 
	})
}

routes.getIngredientsGET = function(request, response){ 
	//Input: request, response objects 
	//Output: --, renders a handlebars template with all of the ingredients in the database
	getIngredients(function(allIngredients){; 
		response.render('ingredients',  {'is' : allIngredients}); 
	});
},

routes.addIngredientPOST = function(request, response){ 
	//Intput: request, response object 
	//Output: This is an ajax function called, so sends back to client-js all of the ingredients in the database 
	console.log("just curious to know what this is")
	console.log(request.xhr)
	if(request.xhr){ 
		addIngredient(request, response); 

		//then get all ingredients 
		getIngredients(function(allIngredients){
			response.send(allIngredients); 
		});
	}
},

routes.updateIngredientsPOST = function(request, response){ 
	//Input: request, response from an ajax call 
	//Output: response sends back updated object
	if(request.xhr){ 
		//unpacking information 
		var originalName = request.body.originalName; 
		var updatedName = request.body.updatedName; 
		var originalPrice = request.body.originalPrice;
		var updatedPrice = request.body.updatedPrice; 
		var outOfStock = request.body.outOfStock; 
		var id = request.body.id; 

		//finds a mongo db object by finding the matching id and updates the name and price.
		ingredients.findOneAndUpdate({_id: id}, {$set: {name: updatedName, price: updatedPrice}}, {new : true}, function(err, object){ 
			if (err) {
				console.log("there was been an error updating", err); 
			}
			response.send(object);  
	});
	}
}, 

routes.updateStockPOST = function(request, response){ 
	//Input: request, response in ajax function 
	//Output: response sends back updated object 

	if (request.xhr){ 
		//unpacking information 
		var id = request.body.id; 
		var outOfStock = request.body.outOfStock; 

		//finds ingredient by matching id and sets out of stock boolean to true 
		ingredients.findOneAndUpdate({_id: id}, {$set: {outOfStock: outOfStock}}, {new: true}, function(err, updatedObject){ 
			if (err){ 
				console.log(err); 
			}
			response.send(updatedObject); 
		});
	}
}

module.exports = routes;