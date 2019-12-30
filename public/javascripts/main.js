var $form = $("#ajax-form");

var clientsListWhole; 
var clientLoaded; 
var clientsDisplayed; 

// LOG IN  ////////////////////////////
function loginVerify(event){
	//calls the backend to verify password 
	//renders a new html page on body if successful or an error message on login screen 

	event.preventDefault(); 

	var name = $("#username").val();
	var password = $("#password").val();

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

// New Client functions/////////////////////////////////////////////////////



// function formatDate(){ 
// 	console.log('IN HERE'); 
// 	date = new Date() 
// 	month = date.getMonth() + 1
// 	year = date.getFullYear()
// 	day = date.getDate()
// 	out =  date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
// 	console.log('what should this be?')
// 	console.log(out); 
// 	return year + "-" + month + "-" + day
// }

function showNewVisitFormFirstTime(){ 
	//toggles new visit form 

	//clears information previously existant 
	$("#date").val(""); 
	$("#time").val(""); 
	$("#price").val(""); 
	$("#notes").val(""); 
	$("#newVisitTA-first").css("display", "inline"); 
	$("#button-show-new-visit-form").css("display", "none"); 

	return false; 
}

function exitNewVisitFormFirstTime(){ 
	//close new visit form after they agree to leaving in an alert
	var response = confirm("Are you sure you want to exit and stop writing this visit?"); 
	if (response == true){ 
		$("#newVisitTA-first").css("display", "none"); 
		$("#button-show-new-visit-form").css("display", "inline"); 
	}
	return false; 
}

function saveClient(){ 
	//scrapes input boxes for user input, makes several checks, calls back end to save new client in the db, returns html text 
	//This function renders the html text to display client information 

	//scrape input boxes for info 
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

	var visitDate = $("#newVisitTA-first #date").val() || ""; 
	var visitTime = $("#newVisitTA-first #time").val() || "";
	var visitPrice = $("#newVisitTA-first #price").val() || "";
	var visitNotes = $("#newVisitTA-first #notes").val() || "";
	
	//series of checks 
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
		//save in db 
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

	  	.done(function(savedClient){ 
		  	clientLoaded = savedClient;
		  	$.get("/old/clientPageGET")
		  	.done(function(htmlPage){ 
		  		//render html page
		  		$("body").html(htmlPage); 
		  		//function to populate this web page 
		  		populateClientPage(); 
		  	})
		  	.fail(function(){ 

		  	})
	  	})
	  	.error(function(err){
		    console.log('error')
	  	})

	}
}


//////////////////////////////////////////////////////

function findSearchResults(event){
	//Takes text in search bar, finds out if any clients match the text, and updated search bar 
	event.preventDefault(); 

	//removes things previously there
	$("#results-clients-list ul li").remove(); 

	//gets search bar input
	var input_pre_regex = $("#search-bar-input").val();
	var input =  new RegExp(input_pre_regex, 'i') ; 

	console.log(input); 
 
	//gets if want to search by first name or last name 
	var filterOption  = $("#filterOption").val();

	var results; 

	//get list of all clients 
	$.get("/getAllClients")
	.done(function(clients){
 		//clients list whole is all clients 
		clientsListWhole = clients; 
		//clients displayed keeps trach of search results displayed 
		clientsDisplayed = clientsListWhole; 
 
 		//trying to filter all clients for the search results 
		results = clientsListWhole.filter(function(client){
			if(client[filterOption].match(input) !== null  ){
				console.log(client[filterOption]); 
				console.log("not null"); 
				return true; 
			}
			else{  
				return false; 
			}
		})
 		
 		console.log(results.length); 
 		
 		//if got results from this query, display clients 
		if(results.length > 0){ 
	 
			$("#results-client-whole").css("display", "block"); 
			clientsDisplayed = results; 
			sortAndDisplayClients(); 
		}
		//if no clients in our clients list whole, query db to make sure 
		// ask mongo for client if not existant 
		else if (results.length == 0 || results == null){ 
	 		//query db with search text 
			$.get("/searchClients", {
				option: filterOption,
				text: input})
			.done(function(clients){
				$("#results-client-whole").css("display", "block"); 
				clientsDisplayed = clients; 
				sortAndDisplayClients(); 
			})
			.fail(function(data, status){ 

				//TODO: display an error message somewhere?  
			}) 
		}
	})
	.fail(function(data, status){  
		clientsListWhole = [];  
		//TODO: display an error message somewhere?  
	}) 
 

}

function sortAndDisplayClients(){  
	//display clients sorted by name (users choice)
	//
	if (clientsDisplayed == null){ //if initial, no clientsDisplayed, check out whole clients list
		if(clientsListWhole == null){ //if no clients list, populate
	 
			$.get("/getAllClients")
			.done(function(clients){
				clientsListWhole = clients; 
		 
				var sortBy = $("#sortOption").val(); 
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

				}).fail(function(err){ 

				})
		} else{ //if clients list whole and no clientsdisplayed, use clients list whole 
			var sortBy = $("#sortOption").val(); 
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

	} else{ //if clients displayed, use clients displayed  
		var sortBy = $("#sortOption").val(); 
		$("#results-clients-list ul li").remove(); 
		if(sortBy == "firstnamesort"){ 
			sortClientsByFirstName(clientsDisplayed).forEach(function(res){ 
				var resListItem = "<li class='list-group-item' id='" + res._id + "'  onclick='loadClientPage(id)'>" + res.firstName + " " + res.lastName + "</li>";
				$("#results-clients-list ul").append(resListItem); 
			})
		} else{
			sortClientsByLastName(clientsDisplayed).forEach(function(res){ 
				var resListItem = "<li class='list-group-item' id='" + res._id + "'  onclick='loadClientPage(id)'>" + res.firstName + " " + res.lastName + "</li>";
				$("#results-clients-list ul").append(resListItem); 
			})
		}
	}
}

function sortClientsByFirstName(clientsArray){ 
	//makes all letters lower case, sorts by first name first, and then sorts by last name
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
	//makes all letters lower case, sorts by first name first, and then sorts by last name
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


// Load Individual Client Page - contact with ClientPage/////////////////////////////////////

function loadClientPage(id){ 
	//query db for client object and html page to load individual client profile 
	$.get("/old/clientPageGET")
	.done(function(htmlPage, status){
		$("body").html(htmlPage);
		$.get("/old/getOneClientGET", {
			id: id
		})
		.done(function(clientObject, status){ 
			console.log("got client object")
			clientLoaded = clientObject;
			populateClientPage(); 
		})
		.fail(function(){ 
			console.log("failed?")

		})

	})
	.fail(function(err){ 
		alert("Please restart.")
	})

}

function populateClientPage(){ 
	//load info
	$("#first-name span").text(clientLoaded.firstName); 
	$("#last-name span").text(clientLoaded.lastName); 
	$("#phone-number span").text(clientLoaded.phoneNumber || "" ); 
	$("#email span").text(clientLoaded.email); 
	$("#address span").text(clientLoaded.address); 
	$("#city span").text(clientLoaded.city); 
	$("#state span").text(clientLoaded.state); 
	$("#zip span").text(clientLoaded.zip || ""); 
	$("#medication span").text(clientLoaded.medication); 
	$("#surgery-or-pregnancy span").text(clientLoaded.surgeryOrPregnancy); 
	$("#sensitivity span").text(clientLoaded.sensitivity); 

	//then load visits 
	var allVisits = sortByDate(clientLoaded.visits); 
	//map visits array to html page 
	allVisits.map(function(visit){
		var dateSplit = visit.date.split("-"); 
		var rearrangedDate = dateSplit[1] + "/" + dateSplit[2] + "/" + dateSplit[0]
		var panelItem = "<div class='panel panel-default'><div class='panel-heading'><h4 class='panel-title'><div class='form-group row'><div class='col-xs-12 col-md-2 open-close-button margin-for-visit-header'> <div style='float:right;'> <button id= '" + visit._id + "' onclick='return openClosePanel(id)' class='btn btn-primary btn-block' style='white-space: normal'> Open </button></div><br></div><div class='col-xs-12 col-md-4 margin-for-visit-header'><span> Date </span> <br> <span>"+ rearrangedDate +"</span></div><div class='col-xs-12 col-md-3 margin-for-visit-header'><span> Time </span> <br> <span>" + visit.time +"</span></div><div class='col-xs-12 col-md-3 margin-for-visit-header'><span> Price </span> <br><span>" + visit.price + "</span></div></h4></div><div id='collapse" + visit._id + "' class='panel-collapse collapse' style='display: none'><div class='panel-body notes-text-size'> Notes <pre style='text-align: left;' class='notes-text-size'>" + visit.notes + "</pre></div></div></div>"
		$("#accordion-visits").append(panelItem);
	})
}

function sortByDate(array){ 
	array.sort(function(a, b){ 
		if(a.date > b.date){ return -1; }
		else if(a.date < b.date){ return 1; }
		else { return 1; }
	})
	return array; 
}

function addNewVisitClick(){ 
	$('#newVisitTA').css('display', 'inline')
}

function onClickCloseNewVisit(){ 
	ans = confirm("Are you sure you want to close visit details?"); 
	console.log("answer is" + ans)
}



