var mongoose = require('mongoose'); 

mongoose.Promise = global.Promise;

var Schema = mongoose.Schema; 

var orderSchema = mongoose.Schema({ 
	name: String, 
	price: Number, 
	ingredients: [{type: Schema.ObjectId, ref: 'ingredients'}], 
	completed: Boolean

}, {'collection': 'orders' }); 

module.exports = mongoose.model('orders',  orderSchema); 