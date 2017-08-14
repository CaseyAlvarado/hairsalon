var $form = $("#ajax-form");

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
		    console.log('success')
	  	})
	  	.error(function(err){
	  		//if error, tell her what the error is? 
		    console.log('error')
	  	})

	}
}

// LOG IN FUNCTIONS ///////////////////////////////////////////////////
// $form.submit(function(event) {
//   //prevents the default template in handlebar 
//   event.preventDefault();

//   //finds the name and price from the input text boxes on top 
//   var name = $form.find("[name='username']").val();
//   var password = $form.find("[name='password']").val();

//   //sends post request from client to server, calls done callback or error callback after complete 

//   console.log("here in form submit")
//   $.post("/login", {
//     username: name,
//     password: password, 
//   })
//     .done(function(data, status){ 
//     	debugger; 
//     	console.log("whats up?")
//     	console.log(data) 
//     	console.log(status)
//     })
//     .fail(function(data, status){
//     	debugger; 
//     	console.log("oh no there has been an error") 
//     });

//     debugger; 
// });

function loginVerify(event){
	event.preventDefault(); 

	//finds the name and price from the input text boxes on top 
	var name = $("#username").val();
	var password = $("#password").val();
	debugger; 
  	// if((name !== "" || name != null) && (password !== "" && password != null)){ 
  //sends post request from client to server, calls done callback or error callback after complete 

	  console.log("here in form submit")
	  $.post("/login", {
	    username: name,
	    password: password, 
	  })
	    .done(function(data, status){ 
	    	console.log("whats up?")
	    	console.log(data) 
	    	console.log(status)
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

function goToNewClient(){ 
	$.get("/new")
}

function goToFindClient(){ 
	$.get("/findClient")
}