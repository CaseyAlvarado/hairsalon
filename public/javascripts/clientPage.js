var $form = $("#ajax-form"); 

var clientLoaded; 
var editMode = false; 

function turnOnEditMode(){ 
	//replaces all of the spans in the profile page with input boxes so user can edit information 
	editMode = true; 

	//toggle edit/save button 
	$("#editButton").css("display", "none"); 
	$("#saveButton").css("display", "inline"); 

	//scrape information 
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
	//replaces all of the input boxes in the profile page with spans, saves updated information, and displays new information 
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
	
	//checks again 
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
		//save new information 
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

		    //reverts everything back to span with newly updated information 
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
	//toggles new visit form 

	//clears information previously existant 
	$("#date").val(""); 
	$("#time").val(""); 
	$("#price").val(""); 
	$("#notes").val(""); 

	//makes sure not to have two forms open at once for safety 
	if(editMode){ 
		alert("SAVE your changes before adding a new visit"); 
	}else{ $("#newVisitTA").css("display", "inline"); } 
	return false; 
}

function saveNewVisit(){
	//scrapes input boxes for new visit details, saves new visit in db, and rerenders visits div to include new visit 
	//scrape 
	var visitDate = $("#newVisitTA #date").val(); 
	var visitTime = $("#newVisitTA #time").val();
	var visitPrice = $("#newVisitTA #price").val();
	var visitNotes = $("#newVisitTA #notes").val(); 

	//save to mongo object 
	$.post("/old/saveNewVisitPOST", {
		clientId : clientLoaded._id, 
		visitDate: visitDate, 
		visitTime: visitTime, 
		visitPrice: visitPrice, 
		visitNotes: visitNotes
	})
	.done(function(updatedClient){ 
		$("#newVisitTA").css("display", "none");
	
		clientLoaded = updatedClient; 
		var allUpdatedVisits = updatedClient["visits"]; 
		var sortedVisits = sortByDate(allUpdatedVisits); 
		$("#accordion-visits").empty();
		//rerender visits div with all the visits (now including recently created visit )
		sortedVisits.map(function(visit){
			var dateSplit = visit.date.split("-"); 
			var rearrangedDate = dateSplit[1] + "/" + dateSplit[2] + "/" + dateSplit[0]
			var panelItem = "<div class='panel panel-default'><div class='panel-heading'><h4 class='panel-title'><div class='form-group row'><div class='col-xs-12 col-md-2 open-close-button margin-for-visit-header'> <div style='float:right;'> <button id= '" + visit._id + "' onclick='return openClosePanel(id)' class='btn btn-primary btn-block' style='white-space: normal'> Open </button></div><br></div><div class='col-xs-12 col-md-4 margin-for-visit-header'><span> Date </span> <br> <span>"+ rearrangedDate +"</span></div><div class='col-xs-12 col-md-3 margin-for-visit-header'><span> Time </span> <br> <span>" + visit.time +"</span></div><div class='col-xs-12 col-md-3 margin-for-visit-header'><span> Price </span> <br><span>" + visit.price + "</span></div></h4></div><div id='collapse" + visit._id + "' class='panel-collapse collapse' style='display: none'><div class='panel-body notes-text-size'> Notes <pre style='text-align: left;' class='notes-text-size'>" + visit.notes + "</pre></div></div></div>"
			$("#accordion-visits").append(panelItem);
		}) 
	})
	.fail(function(err){ 
		alert("Could not save visit. Please try again.")
	})

	return false; 
}

function exitNewVisitForm(){ 
	//close new visit form after they agree to leaving in an alert
	var response = confirm("Are you sure you want to exit and stop writing this visit?"); 
	if (response == true){ 
		$("#newVisitTA").css("display", "none"); 
	}
	return false; 
}

function openClosePanel(id){ 
	//if opened, closes visit buttons to hide notes. 
	//if closed, opens visit buttons to show notes. 
	var panelBodyId = "#collapse" + id; 
	var buttonId = "#" + id

	var display = $(panelBodyId).css("display"); 
	if(display == "none"){ 
		$(panelBodyId).css("display", "inline"); 
		$(buttonId).text("Close"); 
	}else{ 
		$(panelBodyId).css("display", "none");
		$(buttonId).text("Open"); 
	}
	return false; 
}