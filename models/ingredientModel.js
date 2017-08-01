var mongoose = require('mongoose'); 

mongoose.Promise = global.Promise;

var ingredientSchema = mongoose.Schema({ 
	name: String, 
	price: Number, 
	outOfStock: Boolean

}, {'collection': 'ingredients' }); 

module.exports = mongoose.model('ingredients',  ingredientSchema); 