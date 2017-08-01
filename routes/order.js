var express = require('express'); 
var router = express.Router()
var mongoose = require('mongoose'); 

var ingredientModel = require('../models/ingredientModel');
var ingredients = mongoose.model('ingredients', ingredientModel.ingredientSchema);

var orderModel = require('../models/orderModel'); 
var orders = mongoose.model('orders', orderModel.orderSchema); 

routes = {};

var getIngredients = function(callback){ 
	//Input: callback to jump to after this function is complete 
	//Output: returns a call to the callback function with the ingredients as parameters. 
	ingredients.find({}, function(err, allIngredients){
		if (err){ 
			console.log(err); 
		}
		return callback(allIngredients); 
	}); 
}

routes.populateIngredientsGET = function(request, response){
	//Input: request, response 
	//Output: --, renders a handlebars template of ingredients and price. 
	getIngredients(function(allIngredients){ 
		response.render('order', {'ingredient' : {ingredient: allIngredients, price: 0.0}});
	})
}, 

routes.addOrderPOST = function(request, response){
	//Input: request, response objects 
	//Output: 

	//unpacking information from request object 
	console.log(request.body)
	var name = request.body.name; 
	var price = request.body.price; 
	var ingredientIds = request.body['ingredients[]']; 

	var order = new orders({name: name, price: price, ingredients: ingredientIds})
	order.save(function(err){ 
		if(err){ 
			console.log("There was a problem saving the order object", err); 
		}
		response.sendStatus(200);
	}) 
}

module.exports = routes; 