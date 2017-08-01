var express = require('express'); 
var router = express.Router()
var mongoose = require('mongoose'); 

var ingredientModel = require('../models/ingredientModel');
var ingredients = mongoose.model('ingredients', ingredientModel.ingredientSchema);

var orderModel = require('../models/orderModel'); 
var orders = mongoose.model('orders', orderModel.orderSchema); 

routes = {};

routes.populateOrdersGET = function(request, response){
	//Input: request, response 
	//Output: --, renders a handlebars template of ingredients and price. 
	orders.find({})
		.populate('ingredients')
		.exec(function(err, allOrders){ 
			if(err){ 
				console.log(err)
			}

			console.log(allOrders[0]); 
			response.render('kitchen', {'order' : allOrders})

		})
}, 

routes.updateCompletedPOST = function(request, response){ 
	//Input: request, response 
	//Output: sends back the updated object with the boolean completed equal to true. 
	debugger; 
	if (request.xhr){ 
		//finds an order and updated the completed boolean to true
		orders.findOneAndUpdate({_id : request.body.id}, {$set : {completed: request.body.completed}}, {new : true}, function(err, updatedObject){ 
			if(err){ 
				console.log(err); 
			}
			response.send(updatedObject); 
		}); 
	}
}

module.exports = routes; 