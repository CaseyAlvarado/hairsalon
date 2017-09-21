var $form = $("#ajax-form"); 

var clientLoaded; 
var editMode = false; 

function loadClientPage(id){ 
	console.log("clicked with this id " + id )
	$.get("/old/loadClientPageGET", {
		id:id
	})
	.done(function(clientObject, status){ 
		console.log("got client object")
		clientLoaded = clientObject; 

		$.get("/old/clientPageGET")
		.done(function(htmlPage, status){
			$("body").html(htmlPage);
			populateClientPage(); 
		})
		.fail(function(err){ 
			alert("Please restart.")
		})

	})
	.fail(function(){ 
		console.log("failed?")

	})

}

function populateClientPage(){ 
	//load info
	$("#first-name span").text(clientLoaded.firstName); 
	$("#last-name span").text(clientLoaded.lastName); 
	$("#phone-number span").text(clientLoaded.phoneNumber); 
	$("#email span").text(clientLoaded.email); 
	$("#address span").text(clientLoaded.address); 
	$("#city span").text(clientLoaded.city); 
	$("#state span").text(clientLoaded.state); 
	$("#zip span").text(clientLoaded.zip); 
	$("#medication span").text(clientLoaded.medication); 
	$("#surgery-or-pregnancy span").text(clientLoaded.surgeryOrPregnancy); 
	$("#sensitivity span").text(clientLoaded.sensitivity); 

	//then load visits 
	var allVisits = sortByDate(clientLoaded.visits); 

	allVisits.map(function(visit, index){
		var dateSplit = visit.date.split("-"); 
		var rearrangedDate = dateSplit[1] + "/" + dateSplit[2] + "/" + dateSplit[0]
		
 
		// Shouldn't need to link this to an id cause the notes are already fetched. So I could just use the index in a map function? 
		var panelItem = "<div class='panel panel-default'><div class='panel-heading'><h4 class='panel-title'><div class='form-group row'><div class='col-xs-12 col-md-2 open-close-button margin-for-visit-header'> <div style='float:right;'> <a data-toggle='collapse' href='#collapse" + index + "' class='accordion-toggle btn btn-primary btn-block'> </a></div><br></div><div class='col-xs-12 col-md-4 margin-for-visit-header'><span> Date </span> <br> <span>"+ rearrangedDate +"</span></div><div class='col-xs-12 col-md-3 margin-for-visit-header'><span> Time </span> <br> <span>" + visit.time +"</span></div><div class='col-xs-12 col-md-3 margin-for-visit-header'><span> Price </span> <br><span>" + visit.price + "</span></div></h4></div><div id='collapse" + index + "' class='panel-collapse collapse'><div class='panel-body notes-text-size'>" + visit.notes + "</div></div></div>"
		$("#accordion-visits").append(panelItem);
	})
	$('.collapse').collapse({toggle: false});
}

function turnOnEditMode(){ 
	editMode = true; 

	$("#editButton").css("display", "none"); 
	$("#saveButton").css("display", "inline"); 

	var firstNameEditModeString = $("<input class='form-control box-height-and-font' value='" + clientLoaded.firstName + "'>")
	$("#first-name span").remove(); 
	$("#first-name").append(firstNameEditModeString);

	var lastNameEditModeString = $("<input class='form-control box-height-and-font' value='" + clientLoaded.lastName + "'>")
	$("#last-name span").remove(); 
	$("#last-name").append(lastNameEditModeString);

	var phoneNumberEditModeString = $("<input class='form-control box-height-and-font' value='" + clientLoaded.phoneNumber + "'>")
	$("#phone-number span").remove(); 
	$("#phone-number").append(phoneNumberEditModeString);

	var emailEditModeString = $("<input class='form-control box-height-and-font' value='" + clientLoaded.email + "'>")
	$("#email span").remove(); 
	$("#email").append(emailEditModeString);

	var addressEditModeString = $("<input class='form-control box-height-and-font' value='" + clientLoaded.address + "'>")
	$("#address span").remove(); 
	$("#address").append(addressEditModeString);

	var cityEditModeString = $("<input class='form-control box-height-and-font' value='" + clientLoaded.city + "'>")
	$("#city span").remove(); 
	$("#city").append(cityEditModeString);

	var stateEditModeString = $("<input class='form-control box-height-and-font' value='" + clientLoaded.state + "'>")
	$("#state span").remove(); 
	$("#state").append(stateEditModeString);

	if(clientLoaded.zip){ 
		var zipEditModeString = $("<input class='form-control box-height-and-font' value='" + clientLoaded.zip + "'>")
	}else{ 
		var zipEditModeString = $("<input class='form-control box-height-and-font' value=''>")
	}
	$("#zip span").remove(); 
	$("#zip").append(zipEditModeString);

	var medicationEditModeString = $("<input class='form-control box-height-and-font' value='" + clientLoaded.medication + "'>")
	$("#medication span").remove(); 
	$("#medication").append(medicationEditModeString);

	var surgeryOrPregnancyEditModeString = $("<input class='form-control box-height-and-font' value='" + clientLoaded.surgeryOrPregnancy + "'>")
	$("#surgery-or-pregnancy span").remove(); 
	$("#surgery-or-pregnancy").append(surgeryOrPregnancyEditModeString);

	var sensitivityEditModeString = $("<input class='form-control box-height-and-font' value='" + clientLoaded.sensitivity + "'>")
	$("#sensitivity span").remove(); 
	$("#sensitivity").append(sensitivityEditModeString);
}


function turnOffEditMode(){ 
	//getting the updated information from input fields
	editMode = false; 
	var firstName = $("#first-name input").val().trim();
	var lastName = $("#last-name input").val().trim(); 
	var phoneNumber = $("#phone-number input").val(); 
	var email = $("#email input").val().trim(); 
	var address = $("#address input").val();
	var city = $("#city input").val();
	var state = $("#state input").val(); 
	var zip = $("#zip input").val(); 
	var medication = $("#medication input").val(); 
	var surgeryOrPregnancy = $("#surgery-or-pregnancy input").val(); 
	var sensitivity = $("#sensitivity input").val(); 
	
	var atIndex =  email.indexOf("@");
	if (firstName === "" || firstName == null){ 
		alert("First name is empty or bad")
	} else if (lastName === "" || lastName == null){ 
		alert("Last name is empty or bad")
	} else if((email !== "") && (atIndex < 0)){ 
		alert("Not a valid email")
	} else if ((phoneNumber !== "") && (phoneNumber.match(/[a-z]/i))){ //if not empty, check if valid 
		alert('Your phone number has letters')

	} else if ((phoneNumber !== "") && (phoneNumber[0] == "0")){ 
		alert('Your phone number starts with 0, which means its probably not a real number');
	} else if((phoneNumber !== "") && (phoneNumber.length !== 10)){ 
		alert("Check the phone number again. It does not have 10 digits")
	} else{
		console.log("we are all good to save!"); 
		
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
	  	.done(function(updatedClient, status){
	  		clientLoaded = updatedClient; 
		    console.log('success'); 

		    $("#editButton").css("display", "inline"); 
			$("#saveButton").css("display", "none"); 

			var firstNameSaveString = $("<span class='span-vertical-align'>" +  updatedClient.firstName + "</span>")
			$("#first-name").empty(); 
			$("#first-name").append(firstNameSaveString);

			var lastNameSaveString = $("<span class='span-vertical-align'>" +  updatedClient.lastName + "</span>")
			$("#last-name").empty(); 
			$("#last-name").append(lastNameSaveString);

			var phoneNumberSaveString = $("<span class='span-vertical-align'>" +  updatedClient.phoneNumber + "</span>")
			$("#phone-number").empty(); 
			$("#phone-number").append(phoneNumberSaveString);

			var emailSaveString = $("<span class='span-vertical-align'>" + updatedClient.email + "</span>")
			$("#email").empty(); 
			$("#email").append(emailSaveString);

			var addressSaveString = $("<span class='span-vertical-align'>" +  updatedClient.address + "</span>")
			$("#address").empty(); 
			$("#address").append(addressSaveString);

			var citySaveString = $("<span class='span-vertical-align'>" +  updatedClient.city + "</span>")
			$("#city").empty();  
			$("#city").append(citySaveString);

			var stateSaveString = $("<span class='span-vertical-align'>" +  updatedClient.state+ "</span>")
			$("#state").empty(); 
			$("#state").append(stateSaveString);
			if(updatedClient.zip){ 
				var zipSaveString = $("<span class='span-vertical-align'>" + updatedClient.zip + "</span>")
			}
			else{ 
				var zipSaveString = $("<span class='span-vertical-align'> </span>")
			}

			$("#zip").empty(); 
			$("#zip").append(zipSaveString);

			var medicationSaveString = $("<span class='span-vertical-align'>" +  updatedClient.medication + "</span>")
			$("#medication").empty(); 
			$("#medication").append(medicationSaveString);

			var surgeryOrPregnancySaveString = $("<span class='span-vertical-align'>" +  updatedClient.surgeryOrPregnancy + "</span>")
			$("#surgery-or-pregnancy").empty(); 
			$("#surgery-or-pregnancy").append(surgeryOrPregnancySaveString);

			var sensitivitySaveString = $("<span class='span-vertical-align'>" +  updatedClient.sensitivity + "</span>")
			$("#sensitivity").empty(); 
			$("#sensitivity").append(sensitivitySaveString);

	  	})
	  	.error(function(err){
		    alert("ERROR saving changes. Please try again"); 
		    return null; 
	  	})
  	}
}


function showNewVisitForm(){ 
	$("#date").val(""); 
	$("#time").val(""); 
	$("#price").val(""); 
	$("#notes").val(""); 

	if(editMode){ 
		alert("SAVE your changes before adding a new visit"); 
	}else{ $("#newVisitTA").css("display", "inline"); } 
	return false; 
}

function saveNewVisit(){ 
	var visitDate = $("#newVisitTA #date").val(); 
	var visitTime = $("#newVisitTA #time").val();
	var visitPrice = $("#newVisitTA #price").val();
	var visitNotes = $("#newVisitTA #notes").val();
	debugger; 

	//save to mongo object 
	$.post("/old/saveNewVisitPOST", {
		clientId : clientLoaded._id, 
		visitDate: visitDate, 
		visitTime: visitTime, 
		visitPrice: visitPrice, 
		visitNotes: visitNotes
	})
	.done(function(updatedClient){ 
		//with the new data call a populate visits function to populate this list
		$("#newVisitTA").css("display", "none");

		$("#accordion-visits").empty();
	
		
		clientLoaded = updatedClient; 
		var allUpdatedVisits = updatedClient["visits"]; 
		var sortedVisits = sortByDate(allUpdatedVisits)

		sortedVisits.map(function(visit, index){
			var dateSplit = visit.date.split("-"); 
			var rearrangedDate = dateSplit[1] + "/" + dateSplit[2] + "/" + dateSplit[0]
			var panelItem = "<div class='panel panel-default'><div class='panel-heading'><h4 class='panel-title'><div class='form-group row'><div class='col-xs-12 col-md-2 open-close-button margin-for-visit-header'> <div style='float:right;'> <a data-toggle='collapse' href='#collapse" + index + "' class='accordion-toggle btn btn-primary btn-block'> </a></div><br></div><div class='col-xs-12 col-md-4 margin-for-visit-header'><span> Date </span> <br> <span>"+ rearrangedDate +"</span></div><div class='col-xs-12 col-md-3 margin-for-visit-header'><span> Time </span> <br> <span>" + visit.time +"</span></div><div class='col-xs-12 col-md-3 margin-for-visit-header'><span> Price </span> <br><span>" + visit.price + "</span></div></h4></div><div id='collapse" + index + "' class='panel-collapse collapse'><div class='panel-body notes-text-size'>" + visit.notes + "</div></div></div>"
			$("#accordion-visits").append(panelItem);
		})
		$('.collapse').collapse({toggle: false});
	})
	.fail(function(err){ 
		alert("Could not save visit. Please try again.")
	})

	return false; 
}

function sortByDate(array){ 
	array.sort(function(a, b){ 
		if(a.date > b.date){ return -1; }
		else if(a.date < b.date){ return 1; }
		else { return 1; }
	})
	return array; 
}

function exitNewVisitForm(){ 
	
	var response = confirm("Are you sure you want to exit and stop writing this visit?"); 
	if (response == true){ 
		$("#newVisitTA").css("display", "none"); 
	}
	// return false; 
}