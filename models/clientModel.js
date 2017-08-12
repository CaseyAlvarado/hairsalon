var mongoose = require('mongoose'); 

mongoose.Promise = global.Promise;

var Schema = mongoose.Schema; 

var clientSchema = mongoose.Schema({ 
	firstName: String, 
	lastName: String, 
	phoneNumber: Number,
	email: String, 
	address: String, 
	city: String, 
	state: String, 
	zip: Number, 
	medication: Number, 
	surgeryOrPregnancy: String, 
	sensitivity: String, 
	// made the decision to include embedded storage: https://github.com/olinjs/olinjs/tree/master/lessons/03-mongo and 
	// https://docs.mongodb.com/manual/core/data-model-design/
	// if I had decided to do reference storage, would do it this way: visits: [{type: Schema.ObjectId, ref: 'visits'}]
	visits: [{date: String, 
			  time: String, 
			  price: Number, 
			  notes: String}]

}, {'collection': 'clients' }); 

module.exports = mongoose.model('clients',  clientSchema); 