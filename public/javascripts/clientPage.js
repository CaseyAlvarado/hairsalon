var $form = $("#ajax-form");

var clientLoaded = {firstName: "Case", lastName: "Alv"}

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

	var editModeString = $("<input type='first-name' class='form-control box-height-and-font' id='first-name' value='" + clientLoaded.firstName + "'>")
	$("#firstname span").remove(); 
	$("#firstname").append(editModeString);

}


function turnOffEditMode(){ 
	//save new client object and store it in mongo db 
	//revert back to span
	

}

function makeClientPage(client){ 
	var fn = client.firstName; 


	return ("<body> <nav class='navbar navbar-default'><div class='container-fluid'><div class='navbar-header'><a class='navbar-brand' href='/home'> Hair Deire Salon Database </a></div><ul class='nav navbar-nav'><li class='active'><a href='/home'> Home </a></li></ul></div></nav></body><h1> Hair Desire Salon New Client Form</h1><small class='form-text text-muted'>Don't worry. We'll never share your information with anyone else.</small><div><form id ='new-client-form-center'>")
}

