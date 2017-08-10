var mongoose = require('mongoose'); 

mongoose.Promise = global.Promise;

var visitSchema = mongoose.Schema({ 
	date: String, 
	time: String, 
	price: Number, 
}, {'collection': 'visits' }); 

module.exports = mongoose.model('visits',  visitSchema); 