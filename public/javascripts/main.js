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

	if (firstName === "" || firstName == null){ 
		alert("First name is empty or bad")
	} else if (lastName === "" || lastName == null){ 
		alert("Last name is empty or bad")
	} else if (email !== ""){ //if not empty, check if valid 
		var atIndex = email.indexOf("@"); 
		if (atIndex < 0){ 
			alert("Not a valid email"); 
		}
		var lastPeriod = email.lastIndexOf(".com");
		if (lastPeriod < atIndex){ 
			alert("Not a valid email"); 
		}
	} else if (phoneNumber !== ""){ //if not empty, check if valid 
		if (phoneNumber.match(/[a-z]/i)){ 
			alert('Your phone number has letters')
		} 
		if (phoneNumber[0] == "0"){ 
			alert('Your phone number starts with 0, which means its probably not a real number'); 
		}
		if (phoneNumber.length != 10){ 
			alert("Check the phone number again. It does not have 10 digits")
		}

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
	  		visitInfo: {date: visitDate, time: visitTime, price: visitPrice, notes: visitNotes}
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
	    	console.log("whats up?")
	    	console.log(data) 
	    	console.log(status)
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
		sortClientsByFirstName(results).forEach(function(res){ 
			var resListItem = "<li class='list-group-item' id='" + res._id + "'  onclick='loadClientPage(id)'>" + res.firstName + " " + res.lastName + "</li>";
			$("#results-clients-list ul").append(resListItem); 
		})
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
			debugger; 
			sortClientsByFirstName(results).forEach(function(res){ 
				var resItem = "<li class='list-group-item' id='" + res._id + "'  onclick='loadClientPage(id)'>" + res.firstName + " " + res.lastName + "</li>";
				$("#results-clients-list ul").append(resItem); 
			})
		})
		.fail(function(data, status){ 
			results = null; 
			//TODO: display an error message somewhere?  
		}) 
	}

}


function populateClientsList() { 
	$.get("/loadAllClients")
	.done(function(allClients){ 
		clientsListWhole = sortClientsByFirstName(allClients); 
		clientsListWhole.forEach(function(client){
			var listItem = "<li class='list-group-item' id='" + client._id + "'  onclick='loadClientPage(id)'>" + client.firstName + " " + client.lastName + "</li>";
			$("#results-clients-list ul").append(listItem);
		})
	})
	.fail(function(err){ 
		var errorMsg = "<h5> Sorry cannot load customers right now. </h5>"
		$("#results-clients-list").append(errorMsg);
	})

}

function sortClientsByFirstName(clientsArray){ 
	//http://jsfiddle.net/rLwrx6dx/
	var sorted = clientsArray.sort(function(a, b) {
    return a.lastName.localeCompare(b.lastName) ||
           a.firstName.localeCompare(b.firstName) || 0
	});
	return sorted; 
}

function sortClientsByLastName(clientsArray){ 
	var sortedln = clientsArray.sort(function(a, b) {
    return b.lastName.localeCompare(a.lastName) ||
           b.firstName.localeCompare(a.firstName) || 0
	});
	return sortedln; 
}


// function loadClientPage(id){ 
// 	console.log("clicked with this id " + id )

// 	$.get("/loadClientPageGET", {
// 		id:id
// 	})
// 	.done(function(){ 
// 		console.log("success?")
// 	})
// 	.fail(function(){ 
// 		console.log("failed?")

// 	})

// }

