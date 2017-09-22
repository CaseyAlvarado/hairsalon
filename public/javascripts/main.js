var $form = $("#ajax-form");

var clientsListWhole; 
var editMode = false; 

function buttonClick(){ 
	console.log("ayyyyy in here");
	alert("poop"); 
	$.get("/new/testDB", function(response){ 
		console.log("response:" + response); 
	})
}

function addNewVisitClick(){ 
	$('#newVisitTA').css('display', 'inline')
}

function onClickCloseNewVisit(){ 
	// alert("Are you sure you want to close visit details?")
	ans = confirm("Are you sure you want to close visit details?"); 
	console.log("answer is" + ans)
}

function formatDate(){ 
	console.log('IN HERE'); 
	date = new Date() 
	month = date.getMonth() + 1
	year = date.getFullYear()
	day = date.getDate()
	out =  date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
	console.log('what should this be?')
	console.log(out); 
	return year + "-" + month + "-" + day
}

function saveClient(){ 
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
	} else if (visitDate == null || visitDate == ""){ 
		alert("You need to click a date"); 
	} else{
		console.log("we are all good to save!"); 

	  	$.post("/new/saveNewClientPOST", {
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
	  		firstVisitDate: visitDate, 
	  		firstVisitTime: visitTime, 
	  		firstVisitPrice: visitPrice, 
	  		firstVisitNotes: visitNotes 
		})
	  	.done(function(newClient){ 
		    //put up message that everything is all good 
		    //perhaps back end send new html that just says good 
		    console.log('success'); 
		    debugger; 
		    loadClientPage(newClient._id); 
	  	})
	  	.error(function(err){
	  		//if error, tell her what the error is? 
		    console.log('error')
	  	})

	}
}

// LOG IN FUNCTION ////////////////////////////
function loginVerify(event){
	event.preventDefault(); 

	var name = $("#username").val();
	var password = $("#password").val();

	console.log("here in form submit")
	$.post("/login", {

	    username: name,
	    password: password, 
	})
	.done(function(data, status){  
	    $("body").html(data);
    })
    .fail(function(data, status){
    	$("#username").val("");  
    	$("#password").val(""); 
    	var errorMessage = data.responseJSON.error + " Please try again."; 
    	console.log("oh no there has been an error") 
    	$("#errorDiv").css("display", "inline-block"); 
    	$("#errorDiv p").text(errorMessage); 
    });
}

//////////////////////////////////////////////////////

function findSearchResults(event){
	event.preventDefault(); 

	$("#results-clients-list ul li").remove(); 

	var input = $("#search-bar-input").val(); 

	var filterOption  = $("#filterOption").val();

	if (input == ""){ 
		$("#results-clients-list ul li").remove(); 
	}

	var results; 

	//find either in pre-pop listed
	var results = clientsListWhole.filter(function(client){
		if(client[filterOption].includes(input)){ 
			return true; 
		} 
		else{ return false; }
	})

	if(results.length > 0){ 
		$("#results-client-whole").css("display", "block"); 
		var sortBy = $("#sortOption").val(); 
		sortAndDisplayClients(sortBy); 
	}

	// ask mongo for client if not existant 
	else if (results.length == 0 || results == null){ 
		$.get("/searchClients", {
			option: filterOption,
			text: input})
		.done(function(clients){
			console.log("clients"); 
			console.log(clients);

			if(results == null){ 
				results = clients; 
			}
			$("#results-client-whole").css("display", "block"); 

			var sortBy = $("#sortOption").val(); 
			sortAndDisplayClients(sortBy); 
		})
		.fail(function(data, status){ 
			results = null; 
			//TODO: display an error message somewhere?  
		}) 
	}

}

function populateClientsList() {
	console.log("in populate clients list"); 
	$.get("/loadAllClients")
	.done(function(allClients){ 
		clientsListWhole = allClients; 
		var sortBy = $("#sortOption").val(); 
		sortAndDisplayClients(sortBy); 
	})
	.fail(function(err){ 
		var errorMsg = "<h5> Sorry cannot load customers right now. </h5>"
		$("#results-clients-list").append(errorMsg);
	})

}

function sortAndDisplayClients(sortBy){ 
	$("#results-clients-list ul li").remove(); 
	if(sortBy == "firstnamesort"){ 
		sortClientsByFirstName(clientsListWhole).forEach(function(res){ 
			var resListItem = "<li class='list-group-item' id='" + res._id + "'  onclick='loadClientPage(id)'>" + res.firstName + " " + res.lastName + "</li>";
			$("#results-clients-list ul").append(resListItem); 
		})
	} else{
		sortClientsByLastName(clientsListWhole).forEach(function(res){ 
			var resListItem = "<li class='list-group-item' id='" + res._id + "'  onclick='loadClientPage(id)'>" + res.firstName + " " + res.lastName + "</li>";
			$("#results-clients-list ul").append(resListItem); 
		})
	}
}

function sortClientsByFirstName(clientsArray){ 
	//http://jsfiddle.net/rLwrx6dx/
	return clientsArray.sort(function(a, b){ 
		if(a.firstName.toLowerCase() < b.firstName.toLowerCase()){ 
			return -1; 
		}
		else if(a.firstName.toLowerCase() > b.firstName.toLowerCase()){ 
			return 1; 

		} else{ //else if first names are equal, if so, check last name
			if(a.lastName.toLowerCase() < b.lastName.toLowerCase()){ 
				return -1; 
			} else if(a.lastName.toLowerCase() > b.lastName.toLowerCase()){  
				return 1; 
			} else{  
				return 0; 
			}
		}

	}); 
}


function sortClientsByLastName(clientsArray){ 
	return clientsArray.sort(function(a, b){ 
		if(a.lastName.toLowerCase() < b.lastName.toLowerCase()){ 
			return -1; 
		}
		else if(a.lastName.toLowerCase() > b.lastName.toLowerCase()){ 
			return 1; 

		} else{ //else if first names are equal, if so, check last name 
			if(a.firstName.toLowerCase() < b.firstName.toLowerCase()){  
				return -1; 
			} else if(a.firstName.toLowerCase() > b.firstName.toLowerCase()){  
				return 1; 
			} else{  
				return 0; 
			}

		}

	})
}


////clientPage.js
var clientLoaded; 
var editMode = false; 

function loadClientPage(id){ 
	debugger; 
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
		var panelItem = "<div class='panel panel-default'><div class='panel-heading'><h4 class='panel-title'><div class='form-group row'><div class='col-xs-12 col-md-2 open-close-button margin-for-visit-header'> <div style='float:right;'> <a data-toggle='collapse' href='#collapse" + index + "' class='accordion-toggle btn btn-primary btn-block' style='white-space: normal; '> </a></div><br></div><div class='col-xs-12 col-md-4 margin-for-visit-header'><span> Date </span> <br> <span>"+ rearrangedDate +"</span></div><div class='col-xs-12 col-md-3 margin-for-visit-header'><span> Time </span> <br> <span>" + visit.time +"</span></div><div class='col-xs-12 col-md-3 margin-for-visit-header'><span> Price </span> <br><span>" + visit.price + "</span></div></h4></div><div id='collapse" + index + "' class='panel-collapse collapse'><div class='panel-body notes-text-size'>" + visit.notes + "</div></div></div>"
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

		// $("#accordion-visits").empty();
	
		clientLoaded = updatedClient; 
		var allUpdatedVisits = updatedClient["visits"]; 
		var visit = allUpdatedVisits[allUpdatedVisits.length -1]
		var sortedVisits = sortByDate(allUpdatedVisits); 
		var index = "Hundred"
		// $('.collapse').collapse({toggle: false});
		// sortedVisits.map(function(visit, index){

			var dateSplit = visit.date.split("-"); 
			var rearrangedDate = dateSplit[1] + "/" + dateSplit[2] + "/" + dateSplit[0]
			var panelItem = "<div class='panel panel-default'><div class='panel-heading'><h4 class='panel-title'><div class='form-group row'><div class='col-xs-12 col-md-2 open-close-button margin-for-visit-header'> <div style='float:right;'> <a data-toggle='collapse' href='#collapse" + index + "' class='accordion-toggle btn btn-primary btn-block'> </a></div><br></div><div class='col-xs-12 col-md-4 margin-for-visit-header'><span> Date </span> <br> <span>"+ rearrangedDate +"</span></div><div class='col-xs-12 col-md-3 margin-for-visit-header'><span> Time </span> <br> <span>" + visit.time +"</span></div><div class='col-xs-12 col-md-3 margin-for-visit-header'><span> Price </span> <br><span>" + visit.price + "</span></div></h4></div><div id='collapse" + index + "' class='panel-collapse collapse'><div class='panel-body notes-text-size'>" + visit.notes + "</div></div></div>"
			$("#accordion-visits").append(panelItem);
			debugger; 
			$('.collapse').collapse({toggle: false});
		// })
		debugger; 
		// $('.collapse').collapse({toggle: false});
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