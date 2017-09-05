var $form = $("#ajax-form");

var clientLoaded = {firstName: "Casey", lastName: "Alvarado"}
var editMode = false; 

function loadClientPage(id){ 
	console.log("clicked with this id " + id )
	debugger; 
	$.get("/loadClientPageGET", {
		id:id
	})
	.done(function(client){ 
		clientLoaded = client; 
		console.log("success?")
		var page = makeClientPage(client); 
		debugger; 
		$("body").html(page);
		// document.write('./views/newClient.html'); 

	})
	.fail(function(){ 
		console.log("failed?")

	})

}

function turnOnEditMode(){ 
	editMode = true; 
	$("#editButton").css("display", "none"); 
	$("#saveButton").css("display", "inline"); 

	var firstNameEditModeString = $("<input class='form-control box-height-and-font' id='first-name' value='" + clientLoaded.firstName + "'>")
	$("#first-name span").remove(); 
	$("#first-name").append(firstNameEditModeString);

	var lastNameEditModeString = $("<input class='form-control box-height-and-font' id='last-name' value='" + clientLoaded.lastName + "'>")
	$("#last-name span").remove(); 
	$("#last-name").append(lastNameEditModeString);
}


function turnOffEditMode(){ 
	//save new client object and store it in mongo db 
	//revert back to span
	//need to call saveclient
	updateClient(); 

	// var firstNameSaveModeString = $("<input class='form-control box-height-and-font' id='first-name' value='" + clientLoaded.firstName + "'>")
	// <span class="span-vertical-align"> Casey </span>
	// $("#first-name span").remove(); 
	// $("#first-name").append(firstNameEditModeString);

}


function updateClient(){ 
	//getting the updated information from input fields
	var firstName = $("#first-name").val().trim();
	var lastName = $("#last-name").val().trim(); 
	var phoneNumber = $("#phone-number").val(); 
	var email = $("#email").val().trim(); 
	var address = $("#address").val();
	var city = $("#city").val();
	var state = $("#state").val(); 
	var zip = $("#zip").val(); 
	var medication = $("#medication").val(); 
	var surgeryOrPregnancy = $("#surgery-or-pregnancy").val(); 
	var sensitivity = $("#sensitivity").val(); 


	var visitDate = $("#newVisitTA #date").val(); 
	var visitTime = $("#newVisitTA #time").val();
	var visitPrice = $("#newVisitTA #price").val();
	var visitNotes = $("#newVisitTA #notes").val();

	
  	$.post("/old/updateOldClientInfoPOST", {
  		id: clientLoaded._id, 
  		firstName: firstName, 
  		lastName: lastName, 
  		phoneNumber: phoneNumber, 
  		email: email, 
  		address: address, 
  		city: city, 
  		state: state, 
  		zip: zip, 
  		medication: medication, 
  		surgeryOrPregnancy: surgeryOrPregnancy, 
  		sensitivity: sensitivity, 
	})
  	.done(function(data, status){ 
	    //put up message that everything is all good 
	    //perhaps back end send new html that just says good 
	    console.log('success'); 
  	})
  	.error(function(err){
  		//if error, tell her what the error is? 
	    console.log('error')
  	})

}

function makeClientPage(client){ 
	var fn = client.firstName; 


	return ("<body> <nav class='navbar navbar-default'><div class='container-fluid'><div class='navbar-header'><a class='navbar-brand' href='/home'> Hair Deire Salon Database </a></div><ul class='nav navbar-nav'><li class='active'><a href='/home'> Home </a></li></ul></div></nav></body><h1> Hair Desire Salon New Client Form</h1><small class='form-text text-muted'>Don't worry. We'll never share your information with anyone else.</small><div><form id ='new-client-form-center'>")
}

function showNewVisitForm(){ 
	if(editMode){ 
		alert("SAVE your changes before adding a new visit"); 
	}
	$("#newVisitTA").css("display", "inline"); 
	return false; 
}

// function saveNewVisit(){ 
// 	var visitDate = $("#newVisitTA #date").val(); 
// 	var visitTime = $("#newVisitTA #time").val();
// 	var visitPrice = $("#newVisitTA #price").val();
// 	var visitNotes = $("#newVisitTA #notes").val();

// 	//save to mongo object 
// 	$.post("/old/saveNewVisitPOST", {
// 		clientId : 
// 		date: visitDate, 
// 		time: visitTime, 
// 		price: visitPrice, 
// 		notes: visitNotes
// 	})
// 	.done(function(data){ 
// 		//with the new data call a populate visits function to populate this list 

// 	})
// 	.fail(function(err){ 

// 	})

// 	return false; 
// }