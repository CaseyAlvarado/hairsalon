var $form = $("#ajax-form");

function buttonClick(){ 
	console.log("ayyyyy in here");
	alert("poop"); 
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
	} else if (visitDate == null || visitDate == ""){ 
		alert("You need to click a date"); 
	} else{
		console.log("we are all good to save!"); 

	  	$.post("/new/saveNewClientPOST", {
	  		id: id, 
		    originalName: originalIngredientName, 
		    originalPrice: originalIngredientPrice, 
		    updatedName: updatedName,
		    updatedPrice: updatedPrice,
		    outOfStock: false
		})
	  	.done(function(data, status){ 
		    //Input: data, status 
		    //Output: manipulates handlebars templete to update listed item 
		    $('li#'+ data._id).html(data.name + "," + data.price + " <button type = 'button' class = 'editButton' value = 'EDIT'> Edit This Ingredient</button>  <button type = 'button' class = 'outOfStock' value = 'OUTOFSTOCK'> Out Of Stock</button>"); 
	  	})
	  	.error(function(err){
		    //Input: error object 
		    //Output: logs object if there is an error 
		    if(err){ 
		      console.log("There has been an error editing the ingredient", err); 
		    }
	  	})
	}
}