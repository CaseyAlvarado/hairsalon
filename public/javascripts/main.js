var $form = $("#ajax-form");

var clientsListWhole; 
var clientLoaded; 
var clientsDisplayed; 

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
	  	.done(function(savedClient){ 
		  	clientLoaded = savedClient; 
		  	$.get("/old/clientPageGET")
		  	.done(function(htmlPage){ 
		  		$("body").html(htmlPage); 
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
		clientsDisplayed = null; 
		sortAndDisplayClients();  
	}

	var results; 
	//GET CLIENTS LIST WHOLE HERE 
	$.get("/getAllClients")
	.done(function(clients){
 
		clientsListWhole = clients; 
		clientsDisplayed = clientsListWhole; 
			//find either in pre-pop listed
 
		results = clientsListWhole.filter(function(client){
			if(client[filterOption].includes(input)){ 
				return true; 
			} 
			else{ return false; }
		})
 
		if(results.length > 0){ 
	 
			$("#results-client-whole").css("display", "block"); 
			clientsDisplayed = results; 
			sortAndDisplayClients(); 
		}

		// ask mongo for client if not existant 
		else if (results.length == 0 || results == null){ 
	 
			$.get("/searchClients", {
				option: filterOption,
				text: input})
			.done(function(clients){
		 
				console.log("clients"); 
				console.log(clients);
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

// function populateClientsList() {
// 	console.log("in populate clients list"); 
// 	$.get("/loadAllClients")
// 	.done(function(allClients){ 
// 		clientsListWhole = allClients; 
// 		var sortBy = $("#sortOption").val(); 
// 		sortAndDisplayClients(sortBy); 
// 	})
// 	.fail(function(err){ 
// 		var errorMsg = "<h5> Sorry cannot load customers right now. </h5>"
// 		$("#results-clients-list").append(errorMsg);
// 	})

// }

function sortAndDisplayClients(){  
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
		; 
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

	} else{ //if clients displayed, use that 
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

function loadClientPage(id){ 
	console.log("clicked with this id " + id )

	$.get("/old/clientPageGET")
	.done(function(htmlPage, status){
		$("body").html(htmlPage);
		$.get("/old/loadClientPageGET", {
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

	allVisits.map(function(visit){
		var dateSplit = visit.date.split("-"); 
		var rearrangedDate = dateSplit[1] + "/" + dateSplit[2] + "/" + dateSplit[0]
		
 
		// Shouldn't need to link this to an id cause the notes are already fetched. So I could just use the index in a map function? 
		var panelItem = "<div class='panel panel-default'><div class='panel-heading'><h4 class='panel-title'><div class='form-group row'><div class='col-xs-12 col-md-2 open-close-button margin-for-visit-header'> <div style='float:right;'> <button id= '" + visit._id + "' onclick='return openClosePanel(id)' class='btn btn-primary btn-block' style='white-space: normal'> Open </button></div><br></div><div class='col-xs-12 col-md-4 margin-for-visit-header'><span> Date </span> <br> <span>"+ rearrangedDate +"</span></div><div class='col-xs-12 col-md-3 margin-for-visit-header'><span> Time </span> <br> <span>" + visit.time +"</span></div><div class='col-xs-12 col-md-3 margin-for-visit-header'><span> Price </span> <br><span>" + visit.price + "</span></div></h4></div><div id='collapse" + visit._id + "' class='panel-collapse collapse' style='display: none'><div class='panel-body notes-text-size'>" + visit.notes + "</div></div></div>"
		$("#accordion-visits").append(panelItem);
	})
	// $('.collapse').collapse({toggle: false});
}

function sortByDate(array){ 
	array.sort(function(a, b){ 
		if(a.date > b.date){ return -1; }
		else if(a.date < b.date){ return 1; }
		else { return 1; }
	})
	return array; 
}
