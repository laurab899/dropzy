
// The very first function determines whether there is internet access to the app. This is really important to determine this initialy before the user starts using the app, as a lot of error could arise from not having internet access. 

var wifiSearch = setTimeout(checkConnectivity, 500); //A function timeout that checks after load whether there is internet present or not.

//Boolean variables - conditions for signup form. // Regex Validation//
var correctNames = false; var correctEmail = false; 
var correctPassword = false; var correctPhone = false;

//Boolean variables - conditions for order form. // Validation//
var itemNext = false; var  deliveryNext = false; 
var  pickupNext = false; var started = false;


//Throughout the project, various boolean values are changed in order to call various functions, change values etc. Thus, all of these boolean values are set to false on initial load.

var theDelivererCancelled = false; var theOrdererCancelled = false;
var finishedOrderInput = false; var pickupMarkerMap; var itemnameContent = false; 
var itempriceContent = false; var pickupContent = false; var dropOffContent = false; 
var locationMessage = false; var cancelDelivery = false; var iCancelledOrder = false;

var work = false; var home = false; //booleans , work and home values false by default unless the user chooses to use a saved address for their order.


//Global variables in which the users details are stored in. Having these stored globally allows easy data pulling throughout the whole application.

var myFname; var myLname; var myEmail; var myDob; var myNationality; var myProfilePic;
var myWork; var myHome; var myHomeLat; var myHomeLong; var myWorkLat; var myWorkLong;
var googleFormattedGeoAddress; var homeMarker; var workMarker; var workSave; var homeSave;
 var delivererEmail;

//Other Various Global Variables

var deliveryPriceTotal; var formattedPickuplocationfield;  var formattedDropofflocationfield;
var myOrderItemname; var orderersPhone; var itemnamefield; var delivererPhoto; var delivererPhone;
var pickuplocationfield; var markerNearby; var selectedStore; var deliverMapInfoWindow; var userLat; var myScore; 
var myOrderid; var currentMarker; var thisAddress; var thisLat; var thisLong; var userLong; var infowindowNearby;
var setDeliveryFee; var myCurrentLat; var myCurrentLong; var longcoords; var infoWindow;
var numberOfPlaces; var directionsInfo = document.getElementById('directionsinformation');


//Profile Image link is stored locally on the users device, until changed.//
var profileImg = '"' + localStorage.getItem('profileImage') + '"';
var profileImageLink;

//GlobaVariables that store various maps
var pickupMap;  var map; var routemap; var dublinCityFence;


//Interval function timer variable Containers
var refreshInterval; var cancelledInterval;	var checkIfFinishedInterval; var searchTimer; var newSearchTimer;

//Global variables for geocoding and storing pickup address when the user enters text in the addrees field.
var pickupAddress; var pickupLat; var pickupLong; var geocoderPickup;




//Variables that store the json data pulled for each orderer. These are kept on the deliverer side globally for use throughout pages, summaries etc.

var orderitemname; var orderlat; var orderlong; var orderprice; var orderpickup; var orderlocationname; var orderorderid;
var orderername; var orderorderpickuplat; var orderorderpickuplong; var orderitemdetailsvar; var ordererdelivererphone;
var ordererEmail;




function checkConnectivity() {
	// This function checks that the application has access to the internet once it is opened. This is done to prevent any potential issues arrising from lack of internet access.
	if (navigator.onLine) {
		clearInterval(wifiSearch);
	} else {
		function funcreload() {
			window.location.reload();
		}
		navigator.notification.alert("Dropzy needs internet & location services enabled to load without difficulty. Turn on internet and press okay.", funcreload, // The callback function to dismiss the alert
			"Dropzy", "Okay");
	}
}
$(document).ready(function onboardingDemonstration() {
	//Simple click function that closes the onboarding slideshow if desired.
	$('#skip-introduction').click(function() {
		$('.slider').addClass('animated slideOutDown');
		$('.slider').removeClass('animated slideInUp');
		$('.slider').fadeOut();
	});
	//The user can play the onboarding demo again whenever, from the settings page.
	$('#view-onboarding').click(function() {
		$('.slider').removeClass('animated slideOutDown');
		$('.slider').addClass('animated slideInUp');
		$('.slider').css('display', 'block');
        var video = document.getElementById('first-vid');
        video.play();
	});
});


//Following function is the signup function that interacts with our user database. See inside notes including validation, local storage etc.
$(document).ready(function validateSignup() {
	function dismissAnyAlerts() {} // universal funtion for doing nothing / dismissing alerts.
	$("#lastname-reg").blur(function() {
        //Ensures the user has entered a first and last name
		var firstnameCorrect = document.getElementById('firstname-reg');
		if (this.value != "" && firstnameCorrect.value != "") {
			correctNames = true;
		} else if (this.value == "" && firstnameCorrect.value != "") {
			correctNames = false;
			navigator.notification.alert("There is an issue with the last name you have entered, please enter accurate data.", dismissAnyAlerts, "Oops", "Okay");
		} else if (this.value != "" && firstnameCorrect.value == "") {
			correctNames = false;
			navigator.notification.alert("There is an issue with the first name you have entered, please enter accurate data.", dismissAnyAlerts, "Oops", "Okay");
		}
	});
    
    //Validation for email address
	$("#email-reg").blur(function() {
		var emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
		if (emailRegex.test(this.value) == false) {
			correctEmail = false;
            $("#email-reg").val('');
			navigator.notification.alert("There is an issue with the email address you have entered, please enter accurate data.", dismissAnyAlerts, "Oops", "Okay");
		} else if (emailRegex.test(this.value) == true) {
			correctEmail = true;
		} else if (this.value > 5) {
			correctEmail = true;
		} else if (this.value < 5) {
			correctEmail = false;
            $("#email-reg").val('');
		}
	});
    
    //Validation for phonenumber
	$("#phone-reg").blur(function() {
		if (this.length > 8) {
			correctPhone = true;
		} else if (this.length < 8) {
			correctPhone = false;
            $("#phone-reg").val('');
			navigator.notification.alert("There is an issue with the phone number you have entered, please enter accurate data.", dismissAnyAlerts, "Oops", "Okay");
		}
	});
    
    $("#confirm-password-reg").blur(function() {
        var passwordVar = document.getElementById('password-reg');
		if (this.value == passwordVar.value) {
			correctPhone = true;
		} else if (this.value != passwordVar.value) {
			correctPhone = false;
            $("#password-reg").val('');
            $("#confirm-password-reg").val('');
			navigator.notification.alert("Your passwords and confirmation do not match. Please try again.", dismissAnyAlerts, "Oops", "Okay");
		}
	});
    
    
	//Below is the ajax function that connects to our database, hosted on hostinger.com. We have hosted the various php files on our server also.
	var url = "http://dropzy.site/register-auth.php"; // The link for the user registration php file.
	$("#registerButton").click(function() {
        
        // the values entered by the user are trimmed and stored to then be sent to  and stored in database.
		var fname = $.trim($("#firstname-reg").val());
		var lname = $.trim($("#lastname-reg").val());
		var email = $.trim($("#email-reg").val());
		var password = $.trim($("#password-reg").val());
        var passwordconf = $.trim($("#confirm-password-reg").val());
		var photo = $.trim($("#dob-reg").val());
		var dob = $.trim($("#dob-reg").val());
		var phone = $.trim($("#phone-reg").val());
		if (correctEmail == true && correctNames == true) {
			
            // Saves the users name to localstorage. This way, the device will remember them, and they will not have to login everytime after opening the app.
            
			localStorage.setItem('email', email);
			document.getElementById("local-storage-email").innerHTML = localStorage.getItem("email");
			document.getElementById("idorderer").value = localStorage.getItem("email");
			$("#status").text("Creating New Account...");
			var dataString = "firstname=" + fname + "&surname=" + lname + "&email=" + email + "&password=" + password + "&photo=" + photo + "&dob=" + dob + "&phone=" + phone + "&register=";
			$.ajax({
				type: "POST",
				crossDomain: true,
				cache: false,
				url: url,
				data: dataString,
				success: function(data) {
					if (data == "success") {
						$("#status").text("Registered success");
						$('.slider').fadeIn(); //Onboarding begins automatically once account is made.
						$(".interval").show().delay(3000).fadeOut();
						setTimeout(function() {
                            
                            // Brings the user to the homepage if the registration is successful.
							$(":mobile-pagecontainer").pagecontainer("change", "#home", {
								transition: "none"
							});
						}, 3000);
					} else if (data == "exist") {
						$("#status").text("Account is already there");

						function closeThisAlert() {
							//Null function that dismisses alert.
						}
						navigator.notification.alert("Oops, an account is already registerd using this email!", dismissThisAlert, "Dropzy", "Okay");
					} else if (data == "error") {
						$("#status").text("Register Failed");
					}
				}
			});
		} else {}
	});
});


var bounce = new Bounce();
bounce.rotate({
	from: 0,
	to: 360
}).applyTo(document.querySelectorAll("#existing-account"));


//This function lets the user navigate back from the signup form to the login form. here is a good example of the implementation of the bounce.js plugin is used here.
function registerBack() {
	var bounce = new Bounce();
	bounce.translate({
		from: {
			x: 0,
			y: 400
		},
		to: {
			x: 0,
			y: 0
		},
		easing: "hardbounce",
		duration: 1200,
	}).applyTo(document.querySelectorAll("#login-form"));
	$("#register-form").css("display", "none");
	$("#existing-account").css("display", "block");
	//$("#register-form").addClass("animated slideInLeft");
	var bounce = new Bounce();
	bounce.translate({
		from: {
			x: 0,
			y: 130
		},
		to: {
			x: 0,
			y: 0
		},
		easing: "hardbounce",
		duration: 1200,
	}).applyTo(document.querySelectorAll("#existing-account"));
	var bounce2 = new Bounce();
	bounce2.translate({
		from: {
			x: 0,
			y: -100
		},
		to: {
			x: 0,
			y: 0
		},
		easing: "hardbounce",
		duration: 1200,
	}).scale({
		from: {
			x: 1,
			y: 1
		},
		to: {
			x: 0.2,
			y: 0.2
		},
		easing: "sway",
		delay: 30,
	}).applyTo(document.querySelectorAll("#login-logo"));
	$("#login-logo").css('width', '20vw');
	$("#login-logo").css('left', '50%');
	$("#login-logo").css('margin-left', '-10vw');
	$("#home-bg").css("opacity", "0.1");
}



// UI aesthetics for login
function login() {
	$("#login-account").css("display", "none");
	$("#existing-account").css("display", "block");
	$("#login-form").css("display", "block");
	var bounce = new Bounce();
	bounce.translate({
		from: {
			x: 0,
			y: 400
		},
		to: {
			x: 0,
			y: 0
		},
		easing: "hardbounce",
		duration: 1200,
	}).applyTo(document.querySelectorAll("#login-form"));
	$("#register-form").css("display", "none");
	//$("#register-form").addClass("animated slideInLeft");
	var bounce = new Bounce();
	bounce.translate({
		from: {
			x: 0,
			y: 130
		},
		to: {
			x: 0,
			y: 0
		},
		easing: "hardbounce",
		duration: 1200,
	}).applyTo(document.querySelectorAll("#register-form"));
	var bounce2 = new Bounce();
	bounce2.translate({
		from: {
			x: 0,
			y: -100
		},
		to: {
			x: 0,
			y: 0
		},
		easing: "hardbounce",
		duration: 1200,
	}).scale({
		from: {
			x: 1,
			y: 1
		},
		to: {
			x: 4,
			y: 4
		},
		easing: "sway",
		delay: 30,
	}).applyTo(document.querySelectorAll("#login-logo"));
	$("#login-logo").css('width', '20vw');
	$("#login-logo").css('left', '50%');
	$("#login-logo").css('opacity', '1');
	$("#login-logo").css('margin-left', '-10vw');
}

// UI aesthetics for signup
function signUp() {
	$("#existing-account").css("display", "none");
	$("#login-form").css("display", "none");
	$("#login-account").css("display", "block");
	var bounce20 = new Bounce();
	bounce20.translate({
		from: {
			x: 0,
			y: 200
		},
		to: {
			x: 0,
			y: 10
		},
		easing: "hardbounce",
		duration: 1200,
	}).applyTo(document.querySelectorAll("#login-account"));
	$("#home-bg").css("opacity", "0.7");
	//$("#register-form").addClass("animated slideInLeft");
	var bounce = new Bounce();
	bounce.translate({
		from: {
			x: 0,
			y: 0
		},
		to: {
			x: 0,
			y: 400
		},
		easing: "hardbounce",
		duration: 1200,
	}).applyTo(document.querySelectorAll("#login-form"));
	$("#register-form").css("display", "block");
	//$("#register-form").addClass("animated slideInLeft");
	var bounce = new Bounce();
	bounce.translate({
		from: {
			x: 0,
			y: 0
		},
		to: {
			x: 0,
			y: 130
		},
		easing: "hardbounce",
		duration: 1200,
	}).applyTo(document.querySelectorAll("#register-form"));
	var bounce2 = new Bounce();
	bounce2.translate({
		from: {
			x: 0,
			y: 0
		},
		to: {
			x: 0,
			y: -100
		},
		easing: "hardbounce",
		duration: 1200,
	}).scale({
		from: {
			x: 1,
			y: 1
		},
		to: {
			x: 0.2,
			y: 0.2
		},
		easing: "sway",
		delay: 30,
	}).applyTo(document.querySelectorAll("#login-logo"));
	$("#login-logo").css('width', '10vw');
	$("#login-logo").css('opacity', '0');
	$("#login-logo").css('left', '50%');
	$("#login-logo").css('margin-left', '-5vw');
}




//The function for submitting an order and waiting for someone to accept it.
function submitOrder() {
	var notEmpty = false;
	var pickupInputContent = false;
	var dropoffInputContent = false;
	// All regex vars are set to false until all are turned true once validated and then te order can be successfully submitted.
	var itemnamefieldCorrect = false;
	var itempriceCorrect = false;
	var pickuplocationfieldCorrect = false;
	var dropofflocationfieldCorrect = false;
	itemnamefield = document.getElementById('itemnamefield').value;
	itemprice = document.getElementById('itemprice').value;
	pickuplocationfield = document.getElementById('pickup-location-field').value;
	dropofflocationfield = document.getElementById('dropoff-location').value;
	//prevent apostrophies in address that can distrupt URL
	formattedDropoffLocationField = dropofflocationfield.replace("'", '');
	formattedPickupLocationField = pickuplocationfield.replace("'", '');
	if (itemnamefield != "" && itemprice != "" && pickuplocationfield != "" && dropofflocationfield != "") {
		notEmpty = true;
	} else if (itemnamefield == "" || itemprice == "" || pickuplocationfield == "" || dropofflocationfield == "") {
		notEmpty = false;
	}
	if (pickuplocationfield.indexOf(',') !== -1) {
		pickupInputContent = true;
	} else {
		pickupInputContent = false;
	}
	if (dropofflocationfield.indexOf(',') !== -1) {
		dropoffInputContent = true;
	} else {
		dropoffInputContent = false;
	}
	if (notEmpty == true && dropoffInputContent == true && pickupInputContent == true) {
		setTimeout(function() {
			document.getElementById('itemnamefield').value = '';
			document.getElementById('itemprice').value = '';
			document.getElementById('pickup-location-field').value = '';
			document.getElementById('dropoff-location').value = '';
		}, 500);
		event.preventDefault();
		// gather the form data
		var formName = $('#order-form').attr('name');
		var formData = $('#order-form').serialize();
		var formMethod = $('#order-form').attr('method');
		var processingScript = $('#order-form').attr('action');
		// perform the AJAX request
		var request = $.ajax({
			url: processingScript,
			method: formMethod,
			data: formData,
			dataType: "html"
		});
		// handle the responses
		request.done(function(data) {
			// update the user
			$('#response').html(data);
		})
		request.fail(function(jqXHR, textStatus) {
			console.log(textStatus);
		})
		request.always(function(data) {
			// clear the form
			$('#order-form').trigger('reset');
		});
        
        //Starts the timer that determines whether the order has been accepted or not. see function beginSearching();
		searchTimer = setInterval(beginSearching, 4000);
		$('#searching-for-deliverer').css('display', 'block');
		$("#order-form").addClass('blur');
		$(".footer-navbar").addClass('blur');
		$(".img-logo").addClass('blur');
		$("#edit-order").addClass('blur');
		$("#review-order-title").addClass('blur');
		$(".img-logo").addClass('blur');
		$("#boxx3").css('display', 'block');
		$(".footer-navbar").addClass("animated slideOutDown");
		$('#order').addClass('blur');
	} else if (notEmpty == true && dropoffInputContent == false && pickupInputContent == true) {
		function closeAlert1() {
			//Do nothing, just close alert;
		}
		navigator.notification.alert("You must be specific when entering your Delivery Address - so that the deliverer has no problems locating it. ", closeAlert1, "Delivery Address", "Okay");
		event.preventDefault();
	} else if (notEmpty == true && dropoffInputContent == true && pickupInputContent == false) {
		function closeAlert() {
			//Do nothing, just close alert;
		}
		navigator.notification.alert("You must be specific when entering the Pickup Store address - so that the deliverer has no problems locating it.", closeAlert, "Pickup Store", "Okay");
		event.preventDefault();
	}
}

//Following function cancels a search for a deliverer once the order has been submitted. it takes the order out of the pool of orders so that it cannot be accepted by deliverers.
$(document).ready(function() {
    
	$("#cancel-search").click(function() {
		var emailContainer = localStorage.getItem('email');
		var dataString = "itemname=" + itemnamefield + "&idorderer=" + emailContainer + "&delete=";
		$.ajax({
			type: "GET",
			url: "http://dropzy.site/change-order-inactive.php",
			data: dataString,
			crossDomain: true,
			cache: false,
			beforeSend: function() {
				$("#delete").val('Accepting order...');
			},
			success: function(data) {
				if (data == "success") {} else if (data == "error") {}
			}
		});
		$(".interval").css('display', 'block');
		$("#searching-for-deliverer").css('display', 'none');
		setTimeout(reshowHome, 1000);
		setTimeout(pagerefresh, 500);

		function reshowHome() {
			$(".interval").css('display', 'none');
		}

		function pagerefresh() {
			window.location.hash += "#home";
			location.reload();
		}
		clearInterval(searchTimer); //This stops the interval from searching for deliverers. This prevents the order being accepted after it has been cancelled
		$("#searching-for-deliverer").css("display", "none");
		$('.inputs').css("opacity", "1");
		$('#pickup-location-field').attr('placeholder', 'Nearest Pickup Store')
		$('#dropzy-overlay').css('visibility', 'hidden');
		$('#dropzy-overlay').css('display', 'none');
		$('#boxx3').css('display', 'none');
		$("#order-form").removeClass('blur');
		$(".footer-navbar").removeClass('blur');
		$(".footer-navbar").css('display', 'block');
		$(".footer-navbar").removeClass("animated slideOutDown");
		$(".footer-navbar").addClass('animated slideInUp');
		$(".img-logo").removeClass('blur');
		$(".img-logo").removeClass('blur');
	});
});

//Following function is the Login function that interacts with our user database. See inside notes.
$(document).ready(function() {
	var url = "http://dropzy.site/login-auth.php";
	$("#loginButton").click(function() {
		var email = $.trim($("#email").val());
		var password = $.trim($("#password").val());
		if (email != "" && password != "") {
			// Save the name to local storage. This clears existing local storage, if for some reason the user was to login using a different account id on their device.
			localStorage.setItem('email', email);
			document.getElementById("local-storage-email").innerHTML = localStorage.getItem("email");
			document.getElementById("idorderer").value = localStorage.getItem("email");
			$("#status").text("Authenticating...");
			var loginString = "email=" + email + "&password=" + password + "&login=";
			$.ajax({
				type: "POST",
				crossDomain: true,
				cache: false,
				url: url,
				data: loginString,
				success: function(data) {
					if (data == "success") {
						$("#status").text("Login Success..!");
						$.getJSON("http://dropzy.site/login-auth.php", function(result) {
							console.log(result);
							$.each(result, function(i, field) {
								var pulleduserid = field.userid;
								var name = field.fname;
							});
						});
						localStorage.loginstatus = "true";
						$(".interval").show().delay(3000).fadeOut();
						setTimeout(function() {
							$(":mobile-pagecontainer").pagecontainer("change", "#home", {
								transition: "none"
							});
						}, 1000);
					} else if (data == "error") {
						function none() {}
						navigator.notification.alert("Your password and / or username is incorrect. Try again", none, "Dropzy", "Okay");
						localStorage.loginstatus = "false";
						document.getElementById("password").value = "";
						document.getElementById("email").select();
					}
				}
			});
		} else {
			function dismissLoginAlert() {}
			navigator.notification.alert("You must enter a valid username & password.", dismissLoginAlert, "Dropzy", "Okay");
		}
	});
});


// This function Gets local storage email address on load, for future use throughout the application
$(document).ready(function() {
	document.getElementById("local-storage-email").innerHTML = localStorage.getItem("email");
});



////////////// Once an order is complete, the user can use a star rating system. Below is the code for how these score values are determined through clicks on these stars.
$(".starrating a").click(function() {
	var id = $(this).parent().attr("id");
	$("#" + id + " .vote").text($(this).data("vote"));
});


$(".starrating a").on("vmouseover", function() {
	var id = $(this).parent().attr("id");
	$("#" + id + ".starrating a").each(function(i, v) {
		$(v).removeClass("rated");
	});
	$(this).prevAll().each(function(i, v) {
		$(v).addClass("rated");
	});
	$(this).addClass("rated");
});


var score = $('#score');
$(function() {
	$('#oneStar').on('click', function() {
		score.val('1');
	});
	$('#twoStar').on('click', function() {
		score.val('2');
	});
	$('#threeStar').on('click', function() {
		score.val('3');
	});
	$('#fourStar').on('click', function() {
		score.val('4');
	});
	$('#fiveStar').on('click', function() {
		score.val('5');
	});
});



/// Jquery mobile has functions that fire on different events. I liked to keep functions within their respective pages through "pageshow "functions. This  kept a good order and it was easy to correspond functions to their correct page.

//This function is for events that are contained within the order route page - which is the page presented to the deliverer once an order is acceped.


$(document).one("pageshow", "#order-route", function() {
    
    //This function is the function that accepts an order - from the deliverers side. It changes the orders values in the database - isactive, isinprogress from 0 to 1. When this value is changed, it removes the avaailable orders from the list of orders on the deliver page -  so that each delivery cannot be accidentally accepted twice by two users.
	$("#acceptOrder").click(function() {
       
		$('#finished').css('display', 'block');
		$('#delivery-header, #route-map').removeClass('blur');
		$('#directions-infobox').removeClass('blur');
		$('#summary-itemname,#deliverpage-iconitemname').removeClass('blur');
		$('#summary-itemprice,#deliverpage-iconitemprice').removeClass('blur');
		setTimeout(showFooter, 500);

		function showFooter() {
			$(".footer-navbar").css("display", "block");
			$(".footer-navbar").addClass("animated slideInUp");
		}
		var orderid = $("#orderid").html();
		var dataString = "orderid=" + orderid + "&delete=";
		$.ajax({
			type: "GET",
			url: "http://dropzy.site/change-order-isactive.php",
			data: dataString,
			crossDomain: true,
			cache: false,
			beforeSend: function() {
				$("#delete").val('Accepting order...');
			},
			success: function(data) {
				if (data == "success") {
                    
                   
							
					$('#open-external-map ').addClass('animated slideInRight');
					$('#open-external-map ').css("display", "block");
                    $('#directions-infobox ').addClass('animated slideInDown');
					$('#directions-infobox ').css("display", "block");
                       $('#toofrom ').addClass('animated slideInLeft');
					$('#toofrom ').css("display", "block");
               
					// Pulls out the unique user ID from the database. See explanation further below.                     
					pullID();
				} else if (data == "error") {
					alert("error");
				}
			}
		});

       //We pull out the database generated unique Order ID once the deliverer user accepts an order. We do this so that we can refer to the order easily in the database to make changes to it throughout the process - for example cancelling an order or marking it as complete. Before pulling out the ID, we used conditions pickup store and itemname to refer to the order in the database but this began to cause a lot of problems when duplicate orders were being made. To summaryise - The orderid number is the only truly unique element of any order in the database, and we utilise this throughout.
		function pullID() {
			var dataEmail = localStorage.getItem('email');
			var deliverString = "orderid=" + orderorderid + "&email=" + dataEmail + "&attatch=";
			$.ajax({
				type: "POST",
				url: "http://dropzy.site/deliver-id.php",
				data: deliverString,
				crossDomain: true,
				cache: false,
				beforeSend: function() {
					//                    alert('uploading')
				},
				success: function(data) {
					if (data == "success") {
                        
                        //Once we pull out the orderid, we can then retreive the data of the opposing user, in order to make phonecalls, see their rating and profile picture etc.
						getDelivererData();
					} else if (data == "error") {
						
					}
				}
			});
		}
		$(".left3").css("display", "block");
	});
    
    //Once the order is accepted, we set a constant interval that watches the database for any changes , in this case - it checks if the order has been cancelled by the opposing user.
	checkIfFinishedInterval = setInterval(ordererCancelled, 2000);
	$('#finished').css('display', 'none');
	$('#delivery-header, #route-map').addClass('blur');
	$('#directions-infobox').addClass('blur');
	$('#summary-itemname,#deliverpage-iconitemname').addClass('blur');
	$('#summary-itemprice,#deliverpage-iconitemprice').addClass('blur');
	$(".footer-navbar").css("display", "none");
    
    //Using link parametres is the way in which data is carried from page to page in our application.
    //We store these order values in variables in order to place their values in various divs etc.
	var orderid = decodeURI(getUrlVars()["orderid"]);
	var itemname = decodeURI(getUrlVars()["itemname"]);
	var pickup = decodeURI(getUrlVars()["pickup"]);
	var locationname = decodeURI(getUrlVars()["locationname"]);
	var price = decodeURI(getUrlVars()["price"]);
	var lat = decodeURI(getUrlVars()["lat"]);
	var long = decodeURI(getUrlVars()["long"]);
	var idorderer = decodeURI(getUrlVars()["idorderer"]);
	var orderpickuplat = decodeURI(getUrlVars()["pickuplat"]);
	var orderpickuplong = decodeURI(getUrlVars()["pickuplong"]);
	var orderitemdetails = decodeURI(getUrlVars()["itemdetails"]);
	var substringPriceParse = price.substring(2);
	var substringPrice = parseFloat(substringPriceParse); //Parse float to turn the pulled string price from the database into a number.
	var totalPrice = substringPrice + 3;//Adds the set delivery fee to the order in order to display the ammount owed.
	$("#orderid").html(orderid);
	$("#itemname").html(itemname);
	if (orderitemdetails == "No extra details specified") {
		$("#itemnamedetails").css('font-style', 'normal');
		$("#itemnamedetails").css('opacity', '0.4');
		$("#itemnamedetails").html('No extra details specified by orderer');
	} else {
		$("#itemnamedetails").html('" ' + orderitemdetails + ' "');
	}
    
    // We use substrings for addresses, as they can really vary in size. Setting a character limit prevents the UI from becoming disalligned by long strings.
	$("#pickup").html(pickup.substring(0, 49));
	$("#locationname").html(locationname.substring(0, 49));
	$("#price").html(substringPriceParse + " €");
	$("#fee").html("+&nbsp;&nbsp;3.00 €");
    
    //When price values are pulled from the Order Table, they contain a euro sign by default. Using toFixed(2) eliminates the euro sign and lets us treat the value as a plain number.
	$("#total").html(totalPrice.toFixed(2) + " €");
	deliveryPriceTotal = document.getElementById('total').innerHTML;
	$("#lat").html(lat);
	$("#long").html(long);
	$("#idorderer").html(idorderer);
    
    
	$("#update").click(function() {
		var orderid = $("#orderid").html();
		var itemname = $("#itemname").html();
		var pickup = $("#pickup").html();
		var locationname = $("#locationname").html();
		var price = $("#price").html();
		var lat = $("#lat").html();
		var long = $("#long").html;
		var idorderer = $("#idorderer").html;
		var dataString = "orderid=" + orderid + "&itemname=" + itemname + "&pickup=" + pickup + "&locationname=" + locationname + "&price=" + price + "&lat=" + lat + "&long=" + long + "&idorderer" + idorderer + "&update=";
		$.ajax({
			type: "POST",
			url: "http://dropzy.site/update.php",
			data: dataString,
			crossDomain: true,
			cache: false,
			beforeSend: function() {
				$("#update").val('Connecting...');
			},
			success: function(data) {
				if (data == "success") {
					//                        alert("Updated");
					$("#update").val("Update");
				} else if (data == "error") {
					alert("error");
				}
			}
		});
	});
    
    
    //Ths is the function that is fired once an ordered has been successfully delivered by the deliverer. It changes 
	$("#finished").click(function() {
		var finishedString = "orderid=" + orderorderid + "&finished=";
		$.ajax({
			type: "GET",
			url: "http://dropzy.site/change-inprogress.php",
			data: finishedString,
			crossDomain: true,
			cache: false,
			beforeSend: function() {
				$("#finished").val('Completing order...');
			},
			success: function(data) {
				if (data == "success") {
                    
                    
                    $('#payment-received').html("<p id='recieved-text-item'>Total Received</p>" + deliveryPriceTotal);
                    $("#payment-received").css('display', 'block');
                    //Once the delivery is finished, a modal pops up with options for exiting the delivery. 
                    //Ooptions to report their orderer if needed are available on this page, and the option to
                        //return home is made evident.
					$("#button1").click(function() {
						$(".interval").show().delay(3000).fadeOut();
						setTimeout(function() {
							window.location.hash += "#deliver-page";
							location.reload();
						}, 1000);
					});
					$("#button4").css('display', 'none');
					$("#button2").css('display', 'block');
					$("#button2").click(function() {
                        
                        //if the user selects to report the other user, their mail client is opened so they can send an email to us.
						window.location.href = 'mailto:infodropzy@gmail.com';
					});
					$("#finished").val("Order complete");
					$("#completed-order-deliverer").css('display', 'block');
					$("#toblur").addClass('blur');
                    
                    //The modal bounces into view using the bounce.js plugin.
					var bounce10 = new Bounce();
					bounce10.translate({
						from: {
							x: 0,
							y: 0
						},
						to: {
							x: 0,
							y: 100
						},
						easing: "hardbounce",
						duration: 1200,
					}).applyTo(document.querySelectorAll("#completed-order-deliverer"));
					$("#boxx2").css('display', 'block');
					$(".footer-navbar").css("opacity", "0");
					$(".deliverer-container").addClass('blur');
				} else if (data == "error") {
					alert("error");
				}
			}
		});
        
       //This ajax function adds to the count of the amount of orders this deliverer has carried out. This value it needed to find the average rating of the deliverer. // rating / score count. 
		var emailscore = localStorage.getItem('email');
		var scoreString = "emailscore=" + emailscore + "&finished=";
		$.ajax({
			type: "GET",
			url: "http://dropzy.site/change-scorecount.php",
			data: scoreString,
			crossDomain: true,
			cache: false,
			beforeSend: function() {
				$("#finished").val('Completing order...');
			},
			success: function(data) {
				if (data == "success") {
					$("#finished").val("Order complete");
				} else if (data == "error") {
					alert("error");
				}
			}
		});
	});
    
    //This function allows the deliverer to exit the delivery and return home once it is complete, or once they have cancelled.
	$("#exit-delivery-deliverer").click(function() {
		$(".interval").show().delay(2000).fadeOut();
		$(".footer-navbar").css("opacity", "1");
		setTimeout(function() {
			window.location.hash += "#deliver-page";
			location.reload();
		}, 1000);
	});

	
    
    
    //These global variables created earlier (at the top of the document) are now assigned permenant values to use for ajax functions or displaying in various divs etc. 
    
            orderitemname = itemname;
            orderlat = parseFloat(lat);
            orderlong = parseFloat(long);
            orderid = parseFloat(orderid);
            orderlocationname = locationname;
            orderpickup = pickup;
         
            // Use the variable below to get the data of the orderer
            ordererEmail = idorderer;
            //
    
            orderprice = parseFloat(price);
            orderorderid = orderid;
            orderorderpickuplat = parseFloat(orderpickuplat);
            orderorderpickuplong = parseFloat(orderpickuplong);
            orderitemdetailsvar = orderitemdetails;
    
    

	function getDelivererData() {
        
        //Pulls all the data of the orderer to use for various forms of contact.
		var url = "http://dropzy.site/pull-user.php?email=" + ordererEmail + "";
		$.getJSON(url, function(data) {
			$.each(data.userInfo, function(index, userInfo) {
				$('#call-number').html("Call " + userInfo.fname);
				$('#summary-orderer-name').html(userInfo.fname + " " + userInfo.lname);
				$('#phone-order').attr("src", userInfo.photo);
				orderersPhone = parseFloat(userInfo.phone);
			     $("#whatsapp-number").click(function() {
				$('#whatsapp-number').attr('href', 'https://api.whatsapp.com/send?phone=' + orderersPhone + '');
				});
                $('#whatsapp-number').attr('href', 'https://api.whatsapp.com/send?phone=' + userInfo.fname + " " + parseFloat(userInfo.phone) + '');
				//
				$("#sms-number").click(function() {
					window.location.href = "sms:/" + parseFloat(userInfo.phone) + "";
				});
				$("#call-number").click(function() {
					$('#call-number').attr('href', 'tel:/' + parseFloat(userInfo.phone) + '');
				});
			});       
		});
	}
    
    
    // The variables are displayed in the DOM in a clear interface on the deliverers side.
	$("#summary-orderername").html(orderorderid);
	$("#summary-itemname").html(orderitemname);
	$("#summary-itemdetails").html(orderitemdetailsvar);
	$("#summary-itemprice").html("€" + parseFloat(deliveryPriceTotal).toFixed(2) + " (inc. delivery)");
	$("#summary-dropoff").html(orderlocationname.substring(0, 39));
	$("#summary-pickup").html(orderpickup.substring(0, 39));
	$("#user-current-address").html(googleFormattedGeoAddress.substring(0, 39));
    
    
    //Routemap is the variable that contains the google map for showing the 3 point directions from the deliverers location then to the shop and then to the users location.
	routemap = new google.maps.Map(document.getElementById('route-map'), {
		center: delivererPosition,
		mapTypeControl: false,
		mapTypeControlOptions: {
			style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
			position: google.maps.ControlPosition.BOTTOM_CENTER
		},
		zoomControl: false,
		zoomControlOptions: {
			position: google.maps.ControlPosition.LEFT_TOP
		},
		scaleControl: true,
		streetViewControl: false,
		streetViewControlOptions: {
			position: google.maps.ControlPosition.LEFT_TOP
		},
		fullscreenControl: false,
		styles: [{
			"featureType": "administrative",
			"elementType": "labels.text.fill",
			"stylers": [{
				"color": "#444444"
			}]
		}, {
			"featureType": "administrative.country",
			"elementType": "labels",
			"stylers": [{
				"visibility": "off"
			}]
		}, {
			"featureType": "administrative.country",
			"elementType": "labels.text",
			"stylers": [{
				"visibility": "off"
			}]
		}, {
			"featureType": "administrative.province",
			"elementType": "labels.text",
			"stylers": [{
				"visibility": "off"
			}]
		}, {
			"featureType": "administrative.locality",
			"elementType": "labels",
			"stylers": [{
				"visibility": "off"
			}]
		}, {
			"featureType": "administrative.locality",
			"elementType": "labels.text",
			"stylers": [{
				"visibility": "simplified"
			}]
		}, {
			"featureType": "landscape",
			"elementType": "all",
			"stylers": [{
				"color": "#ffffff"
			}, {
				"lightness": "-5"
			}]
		}, {
			"featureType": "landscape",
			"elementType": "geometry.fill",
			"stylers": [{
				"saturation": "4"
			}]
		}, {
			"featureType": "poi",
			"elementType": "all",
			"stylers": [{
				"visibility": "off"
			}]
		}, {
			"featureType": "poi.park",
			"elementType": "geometry.fill",
			"stylers": [{
				"visibility": "on"
			}, {
				"color": "#67b491"
			}, {
				"saturation": "18"
			}, {
				"lightness": "58"
			}]
		}, {
			"featureType": "poi.park",
			"elementType": "labels.text.fill",
			"stylers": [{
				"color": "#13dc80"
			}, {
				"visibility": "off"
			}]
		}, {
			"featureType": "poi.sports_complex",
			"elementType": "geometry.fill",
			"stylers": [{
				"color": "#b84444"
			}, {
				"visibility": "off"
			}]
		}, {
			"featureType": "road",
			"elementType": "all",
			"stylers": [{
				"saturation": -100
			}, {
				"lightness": 45
			}]
		}, {
			"featureType": "road.highway",
			"elementType": "all",
			"stylers": [{
				"visibility": "simplified"
			}]
		}, {
			"featureType": "road.highway",
			"elementType": "labels",
			"stylers": [{
				"visibility": "off"
			}]
		}, {
			"featureType": "road.highway",
			"elementType": "labels.text",
			"stylers": [{
				"visibility": "off"
			}]
		}, {
			"featureType": "road.arterial",
			"elementType": "labels.icon",
			"stylers": [{
				"visibility": "off"
			}]
		}, {
			"featureType": "transit",
			"elementType": "all",
			"stylers": [{
				"visibility": "off"
			}]
		}, {
			"featureType": "transit",
			"elementType": "labels",
			"stylers": [{
				"visibility": "simplified"
			}]
		}, {
			"featureType": "transit",
			"elementType": "labels.text",
			"stylers": [{
				"visibility": "simplified"
			}]
		}, {
			"featureType": "water",
			"elementType": "all",
			"stylers": [{
				"color": "#73f6ff"
			}, {
				"visibility": "on"
			}, {
				"saturation": "-27"
			}, {
				"lightness": "47"
			}]
		}],
		zoom: 14
	});
	var centre = {
        
        //General dublin city centre vacinity.
		lat: 53.347447,
		lng: -6.259199
	};
    
    
    //This is a fall back function in case for some reason the user does not choose a descriptive google place as their pickup store. If it is not a google place, we cannot generate directions to it but we can display it regardless in a way that doesnt break the order process.
	if (orderpickup.length < 13) {
		var deliveryAddressMarker = new google.maps.Marker({
			map: routemap,
			position: {
				lat: orderlat,
				lng: orderlong
			},
			icon: {
				url: 'images/userlocation.png',
				anchor: new google.maps.Point(30, 42),
				scaledSize: new google.maps.Size(40, 40)
			}
		});
        
        
		infowindowNearby = new google.maps.InfoWindow();
		var serviceNearby = new google.maps.places.PlacesService(routemap);
		serviceNearby.nearbySearch({
			location: centre,
			radius: 1000,
			keyword: orderpickup
		}, callback);

        
		function callback(results, status) {
			if (status === google.maps.places.PlacesServiceStatus.OK) {
				for (var i = 0; i < results.length; i++) {
					createMarker(results[i]);
					numberOfPlaces = i + 1;
				}
				if (numberOfPlaces <= 1) {
					alert('There is ' + numberOfPlaces + " " + orderpickup + "location that is near the delivery address.");
				} else if (numberOfPlaces >= 1) {
					alert('There are ' + numberOfPlaces + " " + orderpickup + " locations that are near the delivery address.");
				} else {
					alert("There doesn't seem to be any " + orderpickup + "  locations near the delivery address. ");
				}
			}

            
			function createMarker(place) {
				var placeLoc = place.geometry.location;
				markerNearby = new google.maps.Marker({
					map: routemap,
					position: place.geometry.location,
					icon: {
						url: 'images/shoplocations.png',
						scaledSize: new google.maps.Size(24, 24)
					}
				});
				google.maps.event.addListener(markerNearby, 'click', function() {
					infowindowNearby.setContent(place.name);
					infowindowNearby.open(routemap, this);
					var directionsService = new google.maps.DirectionsService;
					var directionsDisplay = new google.maps.DirectionsRenderer({
						preserveViewport: false,
						suppressMarkers: true
					})
					directionsDisplay.setMap(routemap);
					directionsDisplay.setOptions({
						polylineOptions: {
							strokeColor: '#648cf7',
							strokeWeight: 1.9
						}
					});
                    
                    //We use the values gathered previously through geolocation services and ajax calls to map out the route.
					var start = new google.maps.LatLng(delivererLat, delivererLong);
					//var end = new google.maps.LatLng(38.334818, -181.884886);
					var end = new google.maps.LatLng(orderlat, orderlong);
                    
                    // A way point is a halfway mark - in the case of Dropzy the waypoint is the specified shop.
					var waypts = new google.maps.LatLng(place.geometry.location.lat(), place.geometry.location.lng());
					var request = {
						origin: start,
						destination: end,
						waypoints: [{
							location: waypts,
							stopover: true
						}]
					};
                    
                    //a marker for displaying the route
					var startMarker = new google.maps.Marker({
						position: start,
						map: routemap,
						draggable: false,
						icon: {
							url: 'images/userlocation2.png',
							//                  anchor: new google.maps.Point(0, 0),
							scaledSize: new google.maps.Size(35, 50)
						}
					});
                     //a marker for displaying the route
					var waypointMarker = new google.maps.Marker({
						position: waypts,
						map: routemap,
						icon: {
							url: 'images/shoplocation.png',
							//                  anchor: new google.maps.Point(0, 0),
							scaledSize: new google.maps.Size(35, 45)
						},
						draggable: false,
					});
                     //a marker for displaying the route
					var endMarker = new google.maps.Marker({
						position: end,
						map: routemap,
						draggable: false,
					});
					var bounds = new google.maps.LatLngBounds();
					bounds.extend(start);
					bounds.extend(end);
					routemap.fitBounds(bounds);
					var request = {
						origin: start,
						destination: end,
						travelMode: google.maps.TravelMode.WALKING,
						waypoints: [{
							location: waypts,
							stopover: true
						}]
					};
					var drivingRequest = {
						origin: start,
						destination: end,
						travelMode: google.maps.TravelMode.DRIVING,
						waypoints: [{
							location: waypts,
							stopover: true
						}]
					};
					directionsService.route(request, function(response, status) {
						if (status == google.maps.DirectionsStatus.OK) {
							var travelDuration = document.getElementById('travel-time');
							directionsDisplay.setDirections(response);
							for (var i = 0; i < directionsDisplay.directions.routes[0].legs[0].steps.length; i++) {
								directionsInfo.innerHTML += "<li>" + response.routes[0].legs[0].steps[i].instructions + "</li><br><br>";
							}
							travelDuration.innerHTML = directionsDisplay.directions.routes[0].legs[0].duration.text + "<p class='material-icons' style='font-size:28px; position: relative; top: -10px; left: 25px; color: black; opacity: 0.6; text-decoration: none;'>directions_walking</p>";
							directionsDisplay.setMap(routemap);
						} else {
							alert("Directions Request from " + start.toUrlValue(6) + " to " + end.toUrlValue(6) + " failed: " + status);
						}
					});
				});
			}
		}
	
    } else {
        
        //As our application cannot give sat nav like directions - the best alternative we could use is google maps. With this link the exact route - including its waypoints can be opened on the google maps app if installed or else the online browser version. It uses variable values obtained so far to make this possible. 
        
		var googleMapsLink = "https://www.google.com/maps/dir/?api=1&origin=" + delivererLat + "," + delivererLong + "&destination=" + orderlat + "," + orderlong + "&travelmode=walking&waypoints=" + orderorderpickuplat + "," + orderorderpickuplong + "";
		
        //The google maps button that opens the route.
		$("#open-external-map").click(function() {
           window.location.href = googleMapsLink;
            
        });
        
        //Directions renderer
		var directionsService = new google.maps.DirectionsService;
		var directionsDisplay = new google.maps.DirectionsRenderer({
			preserveViewport: false,
			suppressMarkers: true
		})
		directionsDisplay.setMap(routemap);
		directionsDisplay.setOptions({
			polylineOptions: {
				strokeColor: '#a399fd',
				strokeWeight: 0.9
			}
		});
		var start = new google.maps.LatLng(delivererLat, delivererLong);
		var end = new google.maps.LatLng(orderlat, orderlong);
		var waypts = new google.maps.LatLng(orderorderpickuplat, orderorderpickuplong);
		var request = {
			origin: start,
			destination: end,
			waypoints: [{
				location: waypts,
				stopover: true
			}]
		};
		var startMarker = new google.maps.Marker({
			position: start,
			map: routemap,
			draggable: false,
			icon: {
				url: 'images/userlocation2.png',
				//                  anchor: new google.maps.Point(0, 0),
				scaledSize: new google.maps.Size(35, 45)
			}
		});
		var waypointMarker = new google.maps.Marker({
			position: waypts,
			map: routemap,
			icon: {
				url: 'images/shoplocation.png',
				//                  anchor: new google.maps.Point(0, 0),
				scaledSize: new google.maps.Size(35, 45)
			},
			draggable: false,
		});
		var endMarker = new google.maps.Marker({
			position: end,
			map: routemap,
			icon: {
				url: 'images/marker-pin-01.png',
				anchor: new google.maps.Point(30, 42),
				scaledSize: new google.maps.Size(40, 40)
			},
			draggable: true,
		});
		var bounds = new google.maps.LatLngBounds();
		bounds.extend(start);
		bounds.extend(end);
		routemap.fitBounds(bounds);
		var request = {
			origin: start,
			destination: end,
			travelMode: google.maps.TravelMode.WALKING,
			waypoints: [{
				location: waypts,
				stopover: true
			}]
		};
		var drivingRequest = {
			origin: start,
			destination: end,
			travelMode: google.maps.TravelMode.DRIVING,
			waypoints: [{
				location: waypts,
				stopover: true
			}]
		};
		directionsService.route(request, function(response, status) {
			if (status == google.maps.DirectionsStatus.OK) {
				var travelDuration = document.getElementById('travel-time');
				directionsDisplay.setDirections(response);
				for (var i = 0; i < directionsDisplay.directions.routes[0].legs[0].steps.length; i++) {
					directionsInfo.innerHTML += "<li>" + response.routes[0].legs[0].steps[i].instructions + "</li><br><br>";
				}
				travelDuration.innerHTML = directionsDisplay.directions.routes[0].legs[0].duration.text + "<p class='material-icons' style='font-size:28px; position: relative; top: -10px; left: 25px; color: black; opacity: 0.6; text-decoration: none;'>directions_walking</p>";
				directionsDisplay.setMap(routemap);
			} else {
				alert("Directions Request from " + start.toUrlValue(6) + " to " + end.toUrlValue(6) + " failed: " + status);
			}
		});
	}
});


//The deliverer can cancel the order
$("#cancel-delivery").click(function() {
	function cancelOptions(buttonIndex) {
		if (buttonIndex === 1) {
            
            //see this function
			theDelivererCancelledOrder();
		} else if (buttonIndex === 2) {
			$("#cancel-delivery").css('display', 'none');
			$("#cancel-call").css('display', 'none');
			$("#boxx2").css('display', 'none');
			$(".footer-navbar").css('display', 'block');
		}
	}
	navigator.notification.confirm('Are you sure you want to cancel this deliverer? You cannot undo this action.', // message
		cancelOptions, // callback to invoke with index of button pressed
		'Cancel Delivery', // title
		'Cancel Delivery, Return to Delivery' // buttonLabels
	);
});

//once the deliverer cancels the order - the order has to be changed in the database using a php script. When the deliverer cancels the order he has the ability to contact the orderer providing an explanation or an alternative. or else he can simply return home
function theDelivererCancelledOrder() {
	theDelivererCancelled = true;
	cancelDelivery = true;
	theOrdererCancelled = false;
	var cancelItemname = "cancel";
	var cancelPickup = decodeURI(getUrlVars()["pickup"]);
	var cancelOrderer = decodeURI(getUrlVars()["idorderer"]);
	var cancelOrderid = decodeURI(getUrlVars()["orderid"]);
    
    // use variable values to access the unique order in the database in order to change its value to cancelled
	var dataString = "orderid=" + cancelOrderid + "&orderer=" + cancelOrderer + "&delete=";
	$.ajax({
		type: "GET",
		url: "http://dropzy.site/changedToCancelled2.php",
		data: dataString,
		crossDomain: true,
		cache: false,
		beforeSend: function() {
			$("#delete").val('Accepting order...');
		},
		success: function(data) {
			if (data == "success") {
				$("#cancel-delivery").css('display', 'none');
				$("#cancel-call").css('display', 'none');
				$("#boxx2").css('display', 'none');


				function showContactOptions() {
					function variousOptions(buttonIndex) {
						if (buttonIndex === 1) {
							window.location.href = "tel:/" + orderersPhone + '';
						} else if (buttonIndex === 2) {
							window.location.href = "sms:/" + orderersPhone + "";
						} else if (buttonIndex === 3) {
							window.location.href = "https://api.whatsapp.com/send?phone=" + orderersPhone + "";
						} else if (buttonIndex === 4) {}
					}
					navigator.notification.confirm('-', // message
						variousOptions, // callback to invoke with index of button pressed
						'Contact Options', // title
						'Call, SMS, Whatsapp, Cancel' // buttonLabels
					);
				}
				$('#smiley-deliverer').attr('src', 'images/cancel.png');
				$("#payment-received").css('display', 'none');
				$("#button3").css('display', 'block');
				$("#button4").click(function() {
					showContactOptions();
				});
				$("#button2").css('display', 'none');
				$("#button1").click(function() {
					$(".interval").show().delay(3000).fadeOut();
					setTimeout(function() {
						window.location.hash += "#deliver-page";
						location.reload();
					}, 300);
				});
				$("#button4").html('Contact Orderer')
				$("#complete-text-deliverer").html('Delivery Cancelled');
                
                //The deliverer is presented with a follow up modal, confirming that they have cancelled and supplying them with further points of action.
				$("#please-review-deliverer").html('You have just cancelled this order. Cancelling orders after accepting usually results in bad ratings and your account potentially being reported');
				$("#completed-order-deliverer").css('display', 'block');
				$("#toblur").addClass('blur');
                
                //Modal bounces into view using bounce js plugin.
				var bounce10 = new Bounce();
				bounce10.translate({
					from: {
						x: 0,
						y: 0
					},
					to: {
						x: 0,
						y: 100
					},
					easing: "hardbounce",
					duration: 1200,
				}).applyTo(document.querySelectorAll("#completed-order-deliverer"));
                
				
				$("#boxx2").css('display', 'block');
				$(".footer-navbar").css("opacity", "0");
				$(".deliverer-container").addClass('blur');
			} else if (data == "error") {}
		}
	});
}

//We have previously demonstrated that the deliverer can cancel himself - and the orderer can do the same. This function is called to determine if the orderer has cancelled their order. It is easy to determine if the order is cancelled on the deliverer side, as they physically click the cancel button themselves, but because there is no realtime way of knowing if the OPPOSING use has cancelled - ajax calls on a timer are the most efffective ways of determining changes in the database and carryng out actions after.
function ordererCancelled() {
	var idorderer = decodeURI(getUrlVars()["idorderer"]);
	var itemname = decodeURI(getUrlVars()["itemname"]);
	var pickup = decodeURI(getUrlVars()["pickup"]);
	var orderid = decodeURI(getUrlVars()["orderid"]);
	var url = "http://dropzy.site//checkIfOrdererCancelled.php?email=" + idorderer + "&itemnames=" + itemname + "&orderid=" + orderid + "&pickup=" + pickup + "";
	$.getJSON(url, function(data) {
		$.each(data.orderInfo, function(index, orderInfo) {
            
            //If the "iscancelled" value is 1 and not 0, this means it has been cancelled. 
			if (orderInfo.iscancelled == 1) {
				if (theDelivererCancelled == false && cancelDelivery == false) {
					function contact(buttonIndex) {
						if (buttonIndex === 1) {
							window.location.href = 'mailto:infodropzy@gmail.com';
						} else if (buttonIndex === 2) {
							window.location.href = 'https://api.whatsapp.com/send?phone=' + orderersPhone + '';
						} else if (buttonIndex === 3) {
							$(".interval").show().delay(2000).fadeOut();
							setTimeout(function() {
								window.location.hash += "#home";
								location.reload();
							}, 300);
						}
					}
					//           navigator.notification.confirm(
					//            'This orderer has just cancelled their order. If you would like to report this user please contact us.',  
					//            contact,              // callback to invoke with index of button pressed
					//            'Cancelled',            // title
					//            'Contact Dropzy, Contact Orderer, Ignore'         // buttonLabels
					//        );
					$('#smiley-deliverer').attr('src', 'images/cancel.png');
					$("#payment-received").css('display', 'none');
					$("#button2").css('display', 'block');
					$("#button4").css('display', 'none');
					$("#button2").click(function() {
						window.location.href = 'mailto:infodropzy@gmail.com';
					});
					$("#button1").click(function() {
						$(".interval").show().delay(3000).fadeOut();
						setTimeout(function() {
							window.location.hash += "#deliver-page";
							location.reload();
						}, 300);
					});
					$("#complete-text-deliverer").html('Delivery Cancelled');
					$("#please-review-deliverer").html('This orderer has just cancelled their order. If you would like to report this user please contact us.');
					$("#completed-order-deliverer").css('display', 'block');
					$("#toblur").addClass('blur');
					var bounce22 = new Bounce();
					bounce22.translate({
						from: {
							x: 0,
							y: 0
						},
						to: {
							x: 0,
							y: 100
						},
						easing: "hardbounce",
						duration: 1200,
					}).applyTo(document.querySelectorAll("#completed-order-deliverer"));
					$("#boxx2").css('display', 'block');
					$(".footer-navbar").css("opacity", "0");
					$(".deliverer-container").addClass('blur');
					clearInterval(checkIfFinishedInterval);
				} else if (theDelivererCancelled == true && cancelDelivery == true) {}
			} else {}
		});
	});
}



// A function that is fired when login page is the active page. This function contains other functions such as various UI animation calls, determining if there is a local storage user value. If there is a local storage user value, the application logs in using these creditentails. This prevents the user having to login each time they open and close the app.
$(document).on("pageshow", "#login", function() {
	$(".interval").show().delay(3000).fadeOut();
	$(document).on('keydown', '#dob-phone', function(e) {
		if (e.keyCode == 32) return false;
	});
	$("#phone-reg").on("click", function() {
		$('#phone-reg').val('353');
	});
	setTimeout(blurr, 500);

	function blurr() {
		$('#home-bg').addClass('blur2');
	}
	$(".footer-navbar").css('display', 'none');
	var bounce21 = new Bounce();
	bounce21.translate({
		from: {
			x: 0,
			y: 200
		},
		to: {
			x: 0,
			y: 10
		},
		easing: "hardbounce",
		duration: 1200,
	}).applyTo(document.querySelectorAll("#existing-account"));
	var rememberLocalStorage = localStorage.getItem('email');
	var empty = document.getElementById('empty');
	empty.innerHTML = rememberLocalStorage;
	//Determines whether an email address has been stored locally
	if (empty.innerHTML.length > 6) {
		//     $( ":mobile-pagecontainer" ).pagecontainer( "change", "#home", {
		//            transition: "slide"
		//        });
		$(".interval").show().delay(2000).fadeOut();
		window.location.href = "index.html#home";
	} else {
		$(":mobile-pagecontainer").pagecontainer("change", "#login", {
			transition: "none"
		});
	}
});


$(document).one("pageshow", "#home", function() {
	window.onload = ready();
    
    //When the hhome page is shown, the application uses a php script to find out their average score. This is done on the homepage as it is the most used page. This means that if the score is changed in the database, it can be calculated more often and frequently to display their correct rating to the user at all times.
	var emailscorecalc = localStorage.getItem('email');
	var calculateString = "emailscorecalc=" + emailscorecalc + "&delete=";
	$.ajax({
		type: "GET",
		url: "http://dropzy.site/calculate-rating.php",
		data: calculateString,
		crossDomain: true,
		cache: false,
		beforeSend: function() {
			$("#delete").val('Accepting order...');
		},
		success: function(data) {
			if (data == "success") {
				$("#delete").val("Order complete");
			} else if (data == "error") {
				alert("error");
			}
		}
	});
    
    //UI bounce animation, div bounces into view
	var bounce14 = new Bounce();
	bounce14.translate({
		from: {
			x: 0,
			y: 0
		},
		to: {
			x: 0,
			y: 100
		},
		easing: "sway",
		duration: 1200,
	}).applyTo(document.querySelectorAll("#order-form"));
	setTimeout(function() {
		bounce14.remove();
	}, 6000);
});

//
//The edit order can be clicked to allow the user to look back over their order and make changes.
$(document).ready(function() {
	$('#edit-order').click(function() {
		$("#new-item").on("swipeleft", function() {
			$("#new-pickup").removeClass('animated slideOutDown');
			$("#new-pickup").addClass('animated slideInRight');         
			$("#new-item").removeClass('animated slideInLeft');
			$("#new-item").addClass('animated slideOutLeft');
		});
	});
});



//When the homepage is shown, an ajax call is used to pull the users account data. once this data is pulled, it can be displayed on the settings page. 
$(document).on("pageshow", "#home", function() {
	var detailsEmail = localStorage.getItem('email');
	var url = "http://dropzy.site/pull-user.php?email=" + detailsEmail + "";
	$.getJSON(url, function(data) {
		$.each(data.userInfo, function(index, userInfo) {
			myWork = userInfo.work;
			myHome = userInfo.home;
            
            //In this user table call, we can determine if the user has previously saved a home or work location. If they haven't the quick buttons for selecting these addresses stay hidden until they then save one.
			myHomeLat = parseFloat(userInfo.homelat);
			myHomeLong = parseFloat(userInfo.homelong);
			myWorkLat = parseFloat(userInfo.worklat);
			myWorkLong = parseFloat(userInfo.worklong);
			if (myWork != "" || myHome != "") {
				$('.workhome').css("display", "block");
				$('.workhome').addClass("animated slideInDown");
			} else {
				$('.workhome').css("display", "block");
			}
		});       
	});
    
    
    
    ///////// Basic UI functions //////
	$('#whatyouneed').on("click", function() {
		$('#whatyouneed').attr('placeholder', '');
		$('.footer-navbar').css('display', 'none');
	});
	$('#whatyouneed').blur(function() {

		$('.footer-navbar').css('display', 'block');
	});
	$('#whatyouneed').blur(function() {
		$('#whatyouneed').attr('placeholder', 'What are you looking for?');
	});
	
    ////////////
    
    
	$(".footer-navbar").addClass('animated slideInUp');
	$(".footer-navbar").css('display', 'block');
	map(); //call the map function that shows the pickup store on the map once an address is entered

	function map() {
		pickupMap = new google.maps.Map(document.getElementById('pickup-map'), {
			center: new google.maps.LatLng(53.346747, -6.262423),
			styles: [{
				"featureType": "administrative",
				"elementType": "labels.text.fill",
				"stylers": [{
					"color": "#444444"
				}]
			}, {
				"featureType": "administrative.country",
				"elementType": "labels",
				"stylers": [{
					"visibility": "off"
				}]
			}, {
				"featureType": "administrative.country",
				"elementType": "labels.text",
				"stylers": [{
					"visibility": "off"
				}]
			}, {
				"featureType": "administrative.province",
				"elementType": "labels.text",
				"stylers": [{
					"visibility": "off"
				}]
			}, {
				"featureType": "administrative.locality",
				"elementType": "labels",
				"stylers": [{
					"visibility": "off"
				}]
			}, {
				"featureType": "administrative.locality",
				"elementType": "labels.text",
				"stylers": [{
					"visibility": "simplified"
				}]
			}, {
				"featureType": "landscape",
				"elementType": "all",
				"stylers": [{
					"color": "#ffffff"
				}, {
					"lightness": "-5"
				}]
			}, {
				"featureType": "landscape",
				"elementType": "geometry.fill",
				"stylers": [{
					"saturation": "4"
				}]
			}, {
				"featureType": "poi",
				"elementType": "all",
				"stylers": [{
					"visibility": "off"
				}]
			}, {
				"featureType": "poi.park",
				"elementType": "geometry.fill",
				"stylers": [{
					"visibility": "on"
				}, {
					"color": "#67b491"
				}, {
					"saturation": "18"
				}, {
					"lightness": "58"
				}]
			}, {
				"featureType": "poi.park",
				"elementType": "labels.text.fill",
				"stylers": [{
					"color": "#13dc80"
				}, {
					"visibility": "off"
				}]
			}, {
				"featureType": "poi.sports_complex",
				"elementType": "geometry.fill",
				"stylers": [{
					"color": "#b84444"
				}, {
					"visibility": "off"
				}]
			}, {
				"featureType": "road",
				"elementType": "all",
				"stylers": [{
					"saturation": -100
				}, {
					"lightness": 45
				}]
			}, {
				"featureType": "road.highway",
				"elementType": "all",
				"stylers": [{
					"visibility": "simplified"
				}]
			}, {
				"featureType": "road.highway",
				"elementType": "labels",
				"stylers": [{
					"visibility": "off"
				}]
			}, {
				"featureType": "road.highway",
				"elementType": "labels.text",
				"stylers": [{
					"visibility": "off"
				}]
			}, {
				"featureType": "road.arterial",
				"elementType": "labels.icon",
				"stylers": [{
					"visibility": "off"
				}]
			}, {
				"featureType": "transit",
				"elementType": "all",
				"stylers": [{
					"visibility": "off"
				}]
			}, {
				"featureType": "transit",
				"elementType": "labels",
				"stylers": [{
					"visibility": "simplified"
				}]
			}, {
				"featureType": "transit",
				"elementType": "labels.text",
				"stylers": [{
					"visibility": "simplified"
				}]
			}, {
				"featureType": "water",
				"elementType": "all",
				"stylers": [{
					"color": "#73f6ff"
				}, {
					"visibility": "on"
				}, {
					"saturation": "-27"
				}, {
					"lightness": "47"
				}]
			}],
			zoom: 16,
			mapTypeControl: false,
			mapTypeControlOptions: {
				style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
				position: google.maps.ControlPosition.BOTTOM_CENTER
			},
			zoomControl: false,
			zoomControlOptions: {
				position: google.maps.ControlPosition.LEFT_TOP
			},
			scaleControl: true,
			streetViewControl: false,
			streetViewControlOptions: {
				position: google.maps.ControlPosition.LEFT_TOP
			},
			fullscreenControl: false,
		});
		var autooptions = {
			types: ["establishment"],
			componentRestrictions: {
				country: 'ie'
			}
		}
		var pickupInput = document.getElementById('new-pickup-field');
		var autocomplete = new google.maps.places.Autocomplete(pickupInput, autooptions);
		google.maps.event.addListener(autocomplete, 'place_changed', function() {
			var place = autocomplete.getPlace();
			var pickupLatCoords = place.geometry.location.lat();
			var pickupLongCoords = place.geometry.location.lng();
			$('#pickup-lat').val(pickupLatCoords);
			$('#pickup-long').val(pickupLongCoords);
			$('#map2').css('opacity', '1');
			map2.panTo(place.geometry.location); //Pans to the selected pickupstore location and shows the icon.
			map2.setZoom(18);
            //Places a marker in this location
			pickupMarkerMap = new google.maps.Marker({
				icon: {
					url: 'images/shoplocation.png',
					anchor: new google.maps.Point(0, 0),
					scaledSize: new google.maps.Size(40, 52)
				},
				position: place.geometry.location,
				animation: google.maps.Animation.DROP,
				map: map2,
				title: 'Hello World!'
			});
		});
	}
    
    
	$('#new-pickup-field').blur(function() {
		$('#new-pickup-field').click(function() {
			pickupMarkerMap.setMap(null);
			$('#new-pickup-field').val('')
		});
	});
	//
	document.getElementById("local-storage-email").innerHTML = localStorage.getItem("email");
	document.getElementById("idorderer").value = localStorage.getItem("email");
	$(".footer-navbar").addClass('animated slideInUp');
	$(".footer-navbar").css('display', 'block');
	$("#image-settings").attr("src", "images/settings-icon-06.png");
});



//Gets users data before the homepage is shown so that it is there when the page loads
$(document).on("pagebeforeshow", "#home", function() {
	$(".footer-navbar").addClass('animated slideInUp');
	$(".footer-navbar").css('display', 'block');
	var detailsEmail = localStorage.getItem('email');
    
    // retrieve data based on the locally stored email address.
	var url = "http://dropzy.site/pull-user.php?email=" + detailsEmail + "";
	$.getJSON(url, function(data) {
		$.each(data.userInfo, function(index, userInfo) {
            
            ///Values saved to global variables to use throughout easily.
			myFname = userInfo.fname;
			myLname = userInfo.lname;
			myDob = userInfo.dob;
			myEmail = userInfo.email;
			myPhone = userInfo.phone;
			myScore = userInfo.score;
			myProfilePic = userInfo.photo;
			workSave = userInfo.work;
			homeSave = userInfo.home;
			myWorkLat = parseFloat(userInfo.worklat);
			myWorkLong = parseFloat(userInfo.worklong);
			myHomeLat = parseFloat(userInfo.homelat);
			myHomeLong = parseFloat(userInfo.homelong);
            
            var myDate = new Date();
            var hrs = myDate.getHours();

            var greet;

            if (hrs < 12) {
            greet = 'Good Morning,';
            $('#iwant').html(greet + myFname + "!");
            }
            else if (hrs >= 12 && hrs <= 17){
            greet = 'Good Afternoon,';
            $('#iwant').html(greet + myFname + "!");}
            else if (hrs >= 17 && hrs <= 24) {
            
            greet = 'Good Evening,';
            $('#iwant').html(greet + myFname + "!");

            }
			var starImage = document.getElementById('stars-image');
			var star1 = document.getElementById("settings-1-star");
            
            // retreive the users rating and display the corresponding star image
			if (myScore == 1) {
				starImage.src = "images/1star.png";
			} else {
				star1.style.display = "none";
			}
			var star2 = document.getElementById("settings-2-star");
			if (myScore == 2) {
				starImage.src = "images/2stars.png";
			} else {
				star2.style.display = "none";
			}
			var star3 = document.getElementById("settings-3-star");
			if (myScore == 3) {
				starImage.src = "images/3stars.png";
			} else {
				star3.style.display = "none";
			}
			var star4 = document.getElementById("settings-4-star");
			if (myScore == 4) {
				starImage.src = "images/4stars.png";
			} else {
				star4.style.display = "none";
			}
			var star5 = document.getElementById("settings-5-star");
			if (myScore == 5) {
				starImage.src = "images/5tars.png";
			} else {
				star5.style.display = "none";
			}
            
            //display the retreived profile picture - which is a link hosted on IMGUR. we can display this in a tag using the .src attribute.
			var userpic = document.getElementById('settings-user-pic');
			userpic.src = myProfilePic;
            
            //Simply display the values in divs on the settings page.
			$("#settings-details-username").html(myFname + " " + myLname);
			$("#settings-rating").html(myScore);
			$("#details-fname").val(myFname);
			$("#details-lname").val(myLname);
			$("#details-phone").val(myPhone);
			$("#details-email").val(myEmail);
			$("#details-dob").val(myDob);
			$("#homeaddress").val(userInfo.home);
			$("#workaddress").val(userInfo.work);
		});       
	});
    
    
    
//Change icons when the input is active. If the loction input for the order page is clicked, this means that the user has decided to enter a new address, making the work and home boolean values false - as they are not using either of these values in their order.
	$('#location-input').on("click", function() {
		$('#location-input').css('background-image', 'url(images/1x/bluelocation.png)');
		$('#location-input').css('background-size', '4.3vw');
		$('#location-input').val('');
		work = false;
		home = false;
		$('#work-btn').css('opacity', '0.4');
		$('#home-btn').css('opacity', '0.4');
	});
    
    //Clicking the "Home Address" button puts the value of their home address in the location input field. making the work boolean value false.The icon image is also changed using css funcitonality.
	$('#home-btn').on("click", function() {
		$('#location-input').css('background-image', 'url(images/homeicon.svg)');
		$('#location-input').css('background-size', '4.3vw');
		$('#deliveryAddressNext').css('opacity', '1');
		$('#work-btn').css("opacity", "0.3");
		$('#home-btn').css("opacity", "1");
		home = true;
		work = false;
		$('#location-input').val(homeSave);
	});
    
 //Another location is selected - not the work or home addresses.
	$('#another-btn').on("click", function() {
		$('#work-btn').css('opacity', '0.4');
		$('#home-btn').css('opacity', '0.4');
		$('#location-input').focus();
		$('#location-input').val("");
		$('#location-input').css('background-image', 'url(images/1x/bluelocation.png)');
		$('#location-input').css('background-size', '4.3vw');
	});
    
       //Clicking the "Work Address" button puts the value of their work address in the location input field. making the home boolean value false. The icon image is also changed using css funcitonality.
	$('#work-btn').on("click", function() {
		$('#location-input').css('background-image', 'url(images/suitcase.svg)');
		$('#location-input').css('background-size', '4.3vw');
		$('#deliveryAddressNext').css('opacity', '1');
		$('#home-btn').css("opacity", "0.3");
		$('#work-btn').css("opacity", "1");
		work = true;
		home = false;
		$('#location-input').val(workSave);           
		homeMarker.setMap(null);
	});
    
    
    // UI Functions
	$('#location-input').on("change", function() {
		$('#deliveryAddressNext').css('opacity', '1');
	});
    
	$('#itemprice-area').on("keydown", function() {
		$('#itemDetailsNext').css('opacity', '1');
	});
    
	$('#new-pickup-field').on("keydown", function() {
		$('#submit6').css('opacity', '1');
	});
    ///
    
    
    //This function is in regards to animation plugin that was awkward to implement. Jquery mobile animations no longer work with cordova so we used the animate.css stylesheet to implement page slides. This plugin assigns classes so we have to remove them manually so that the slides are in the right direction.
	$('.left1').on("click", function() {
		if (itemNext == true && deliveryNext == false && pickupNext == false && started == false) {
			$("#slide-up-location").removeClass();
			$("#new-item").removeClass();
			$("#new-pickup").removeClass();
			$("#new-pickup").css('display', 'block');
			$("#slide-up-location").css('display', 'none');
			$("#new-item").css('display', 'none');
		} else if (itemNext == false && deliveryNext == true && pickupNext == false && started == false) {
			$("#slide-up-location").removeClass();
			$("#new-item").removeClass();
			$("#new-pickup").removeClass();
			$("#new-item").css('display', 'block');
			$("#slide-up-location").css('display', 'none');
			$("#new-pickup").css('display', 'none');
		} else if (itemNext == false && deliveryNext == false && pickupNext == false && started == true) {
			$("#slide-up-location").removeClass();
			$("#new-item").removeClass();
			$("#new-pickup").removeClass();
			$("#slide-up-location").css('display', 'block');
			$("#new-pickup").css('display', 'none');
			$("#new-item").css('display', 'none');
		}
	});
    
    // UI aesthetic functions for the footer. It changes the images of the footer to show which page is active / inactive.

	$("#image-order").attr("src", "images/order-icon-active.png");
	$("#image-deliver").attr("src", "images/shoppingbag-01.png");
	$("#image-deliver").css('opacity', '0.6');
	$("#image-order").css('opacity', '1');
	$("#order-tag").css('color', '#648EF8');
	$("#deliver-tag").css('color', 'grey');
	$("#image-settings").css('opacity', '0.6');
	$("#image-settings").attr("src", "images/settings-icon-06.png");
	$("#account-tag").css('color', 'grey');

});


//Jquery mobile has a bad fade transiton by default.
$.mobile.defaultPageTransition = "none";





$(document).on("pagebeforeshow", "#deliver-page", function() {
	$("#map-deliver-info").click(function() {
        
        //Makes map view of deliver page visibile.
		$('#map-deliver-info').removeClass("animated slideInDown");
		deliverMap.setZoom(12);
		deliverMap.panTo(delivererPosition);
		deliverMapInfoWindow.close();
		$('#map-container-info').css('display', 'none');
		$('#map-deliver-info').addClass("animated slideOutUp");
	});
    
    
    // UI aesthetic functions for the footer. It changes the images of the footer to show which page is active / inactive.

	$("#image-order").css('opacity', '0.6');
	$("#image-order").attr("src", "images/order-icon-02.png");
	$("#image-deliver").attr("src", "images/shoppingbag-02.png");
	$("#image-deliver").css('opacity', '1');
	$("#order-tag").css('color', 'grey');
	$("#deliver-tag").css('color', '#648EF8');
	$("#image-settings").attr("src", "images/settings-icon-06.png");
	$("#image-settings").css('opacity', '0.6');
	$("#account-tag").css('color', 'grey');
	//             $('.right').css('background-color', '#F87B7B');
});


$(document).ready(function() {
	$("#rad3").on("click", function() {});
	$("#rad4").on("click", function() {});
});

$(document).ready(function() {
	$('#cancel-order-process').click(function() {
		$('#slide-up-location').removeClass('animated slideInUp');
		$('#slide-up-location').addClass('animated slideOutDown');
	});
});



//This function uses a php script to permenantly delete the account of the user.

 function deleteAccount() {

        function deleteAccountOptions(buttonIndex) {
            
            if(buttonIndex == 1) {
                	var deleteid = localStorage.getItem("email");
		var deleteString = "deleteid=" + deleteid + "&delete-account=";
		$.ajax({
			type: "GET",
			url: "http://dropzy.site/delete-account.php",
			data: deleteString,
			crossDomain: true,
			cache: false,
			beforeSend: function() {
				$("#delete-account").val('Connecting...');
			},
			success: function(data) {
				if (data == "success") {
					localStorage.setItem('email', "nulll");
                    $(".interval").show().delay(2000).fadeOut();
		              window.location.hash += "#login";
		              location.reload();
                    
					$("#delete-account").val("Account deleted");
				} else if (data == "error") {
					alert("error");
				}
			}
		});
        
            } else if(buttonIndex == 2) {
                
            }
            
        }
     
     //A cordova ios popup allows the user to have two chances to revert deleting their account.
       
        
        navigator.notification.confirm('Are you sure you want to permenantly delete your account? This action cannot be undone.', // message
		deleteAccountOptions, // callback to invoke with index of button pressed
		'Delete Account', // title
		'Delete my Account, Keep my Account' // buttonLabels
	);
        
           
    }
	


//This function contains functions concerning the settings page.
$(document).ready(function() {
	$("#update2").click(function() {
        
        //this function updates the details of the user in the settings page in case any of their information is wrong. 
		var detailsEmail1 = localStorage.getItem("email");
		var detailsFname1 = $("#details-fname").val();
		var detailsLname1 = $("#details-lname").val();
		var detailsPhone1 = $("#details-phone").val();
		var updateString = "detailsEmail1=" + detailsEmail1 + "&detailsFname1=" + detailsFname1 + "&detailsLname1=" + detailsLname1 + "&detailsPhone1=" + detailsPhone1 + "&update=";
		$.ajax({
			type: "POST",
			url: "http://dropzy.site/update-user-details.php",
			data: updateString,
			crossDomain: true,
			cache: false,
			beforeSend: function() {
				$("#update").val('Connecting...');
			},
			success: function(data) {
				if (data == "success") {
					function closeAlert() {}
					navigator.notification.alert("Your details have been updated. ", closeAlert, "Thank You", "Okay");
					$("#update").val("Update");
				} else if (data == "error") {
					alert("error");
				}
			}
		});
	});
    
    
   
    /////Assigns swipe functionality to the settings page to exit subpages
    
	$("#about").on("swiperight", function() {
		aboutBack();
	});
    
    
	$("#my-saved-addresses").on("swiperight", function() {
		addressesBack();
	});
	$("#my-details").on("swiperight", function() {
		detailsBack();
	});
	$("#my-orders").on("swiperight", function() {
		ordersBack();
	});
    
    //////////
    
	$('#settings-container-box').removeClass('animated slideInLeft');
	$('#settings-container-box').removeClass('animated slideOutLeft');
    
    
    
    
    //When the logout button is clicked, it removes the locally stored email address. This is so that the application doesn't log the user in automatically anymore - since they have opted to logout on their device.
	$("#logout").on("click", function() {
        
        function logoutOptions(buttonIndex) {
            
            if(buttonIndex == 1) {
                
                localStorage.setItem('email', "nulll");
		$(".interval").show().delay(3500).fadeOut();
		$(":mobile-pagecontainer").pagecontainer("change", "#login", {
			transition: "none"
		});
		setTimeout(function() {
			location.reload();
		}, 700);
                
            } else if(buttonIndex == 2) {
                
            }
        }
        
        
        navigator.notification.confirm('Are you sure you want to logout?', // message
		logoutOptions, // callback to invoke with index of button pressed
		'Logout', // title
		'Logout, Cancel' // buttonLabels
	);
	
		
	});
    
    
	var localemail = localStorage.getItem('email');
	var userString = "email=" + localemail + "&details";
	$.ajax({
		type: "POST",
		url: "http://dropzy.site/json-details.php",
		data: userString,
		crossDomain: true,
		cache: false,
		beforeSend: function() {},
		success: function(data) {
		
			var url = "http://dropzy.site/json-details.php";
			$(document).ready(function() {
				$.getJSON(url, function(result) {
					console.log(result);
					$.each(result, function(i, field) {
						var pulleduserid = field.orderid;
					});
				});
			});
		}
	});
    
	
	var previousOrdersEmail = localStorage.getItem('email');
	var url = "http://dropzy.site/pull-previous-orders.php?email=" + previousOrdersEmail + "";
	$.getJSON(url, function(data) {
		$.each(data.pastOrders, function(index, pastOrders) {
			$("#previousOrders").append("<div class='past-orders'><div class='past-itemname'>" + pastOrders.itemname.substring(0,18) + "</div><div class='past-price'>" + pastOrders.price + "</div><div class='past-orderid'>Order #" + pastOrders.orderid + "</div><div class='past-pickup'>" + pastOrders.pickup.substring(0, 50) + "..</div></div><div class='past-date'>" + pastOrders.date + "</div><img src='images/form-itemname.svg' class='ordericon'/><img src='images/shop.svg' class='past-location'/><div class='lines5'></div>");
		});       
	});
});



$(document).on("pageshow", "#settings-home", function() {
$("#image-order").css('opacity', '0.6');
	$("#image-deliver").css('opacity', '0.6');
	$("#image-order").attr("src", "images/order-icon-02.png");
	$("#image-deliver").attr("src", "images/shoppingbag-01.png");
	$("#image-deliver").css('opacity', '0.5');
	$("#deliver-tag").css('color', 'grey');
	$("#account-tag").css('color', '#648EF8');
	$("#order-tag").css('color', 'grey');
	$("#image-settings").css('opacity', '1');
	$("#deliver-tag").css('color', '#grey');
	$("#settings-tag").css('color', '#648EF8');
	$("#image-settings").attr("src", "images/settings-active.png");

});


$(document).one("pageshow", "#deliver-page", function() {
	window.onload = ready2();
    
    // bounce into view using bounce.js plugin
	var bounce20 = new Bounce();
	bounce20.translate({
		from: {
			x: 0,
			y: 0
		},
		to: {
			x: 0,
			y: 100
		},
		easing: "sway",
		duration: 1200,
	}).applyTo(document.querySelectorAll("#deliver-interface"));
	setTimeout(function() {
		bounce20.remove();
	}, 2000);
    
    
    //This function pulls and displays all the orders in the database that are ready to be accepted in a list view on the deliver page.
	var url = "http://dropzy.site/json.php";
	$.getJSON(url, function(result) {
		console.log(result);
		$.each(result, function(i, field) {
            
            // This json creates these individual list view "blocks" through a loop function. 
			var orderid = field.orderid;
			var itemname = field.itemname;
			var pickup = field.pickup;
			var locationname = field.locationname;
			var price = field.price;
			var lat = field.lat;
			var long = field.long;
			var idorderer = field.idorderer;
			var pickuplat = field.pickuplat;
			var pickuplong = field.pickuplong;
			var itemdetails = field.itemdetails;
			
            //Each block is appended to the listview div and it's values are assigned below. A unqiue link is created for each order in the href tag. Using link parametres, the selected order can be selected by the deliverer and brought to a new page , in which more details of the order can be viewed before accepting.
            
            
			$("#listview").append("<a data-role='none'class='item' style='background-color: white; border-left: 1px solid rgba(0,0,0,0.09); border-right: 1px solid rgba(0,0,0,0.00); border-bottom: 1px solid rgba(0,0,0,0.2); border-top: 1px solid rgba(0,0,0,0.2); -webkit-box-shadow: 0px 4px 5px -2px rgba(217,217,217,0.61);-moz-box-shadow: 0px 4px 5px -2px rgba(217,217,217,0.61); box-shadow: 0px 4px 5px -2px rgba(217,217,217,0.61); float: left; margin-left: -5vw; color: grey; text-decoration:none;  width: 105vw; padding: 3vw; margin-bottom: 0px;' data-transition: slide; rel='external'  href='#order-route?orderid=" + orderid + "&itemname=" + itemname + "&pickup=" + pickup + "&price=" + price + "&lat=" + lat + "&long=" + long + "&idorderer=" + idorderer + "&locationname=" + locationname + "&pickuplat=" + pickuplat + "&pickuplong=" + pickuplong + "&itemdetails=" + itemdetails + "'><p class='order-items' style='font-size: 17px; font-weight: 300; top: 100%; left: 2vw; padding-top: 2vh; opacity: 0.8; color: black;'>" + price + "</p><p id='order-price' style='float: right; right: 10vw; top: -20px; font-size: 16px; font-weight: 300; text-align: left; '>" + "</p><p class='order-locations' style='font-size: 12px; font-weight: 300; width: 60vw;text-align: left; left: 35vw; top: 1vh; opacity: 0.6;'>" + pickup.substring(0, 31) + "..</p><p class='order-locations' style='font-size: 11px; width: 60vw;text-align: left; left: 35vw; top: 3.3vh!important; opacity: 0.6;'>" + locationname.substring(0, 31) + "..</p><img src='images/tofrom.png' style='width: 1vw; opacity: 0; position: relative; left: 2vw; top: -1.5vh;'/><p class='itemname-pull'>" + itemname + "</p><img src='images/tofrom.png' class='to-from'/><div class='lines'></div> <a data-role='none' class='view-order'rel='external' href='#order-route?orderid=" + orderid + "&itemname=" + itemname + "&pickup=" + pickup + "&price=" + price + "&lat=" + lat + "&long=" + long + "&idorderer=" + idorderer + "&locationname=" + locationname + "&pickuplat=" + pickuplat + "&pickuplong=" + pickuplong + "&itemdetails=" + itemdetails + "'>View</a></a><br>");
            
            
		});
	});
});



function showRoute() {
	$("#review-request").fadeOut(300);
	$("#boxx4").fadeOut(500);
}



//The function below is the function that is fired once the orderer user submits their order. Once it is sent to the database ( see submitOrder(); function ), we can then pull out the database-generated orderid using other attributes of the order in the table. We need the unique order ID throughout the order process to determine cancellations, completions etc.  beginSeaching() is looped until someone has accpeted the order - until then it loops infinitely.
function beginSearching() {
	var orderEmail = localStorage.getItem('email');
	var url = "http://dropzy.site/pull-order-json.php?email=" + orderEmail + "&itemnames=" + itemnamefield + "&pickup=" + pickuplocationfield + "&dropoff=" + dropofflocationfield + "";
	$.getJSON(url, function(data) {
		$.each(data.orderInfo, function(index, orderInfo) {
			
            //Assign values to global variables for displaying to the orderer. 
			myOrderItemname = orderInfo.itemname;
			myOrderid = orderInfo.orderid;
			thisAddress = orderInfo.locationname;
			thisLat = orderInfo.lat;
			thisLong = orderInfo.long;
            
            //pulling out the id of the deliverer that has accepted the order and storing it in a global variable, allows us to use the variable value later on to retreive all the data of the deliverer for phone calls, texts and displaying rating etc.
			myDeliverer = orderInfo.iddeliverer;
            
            //calculate the cost owed by the orderer. - add on the fixed delivery fee to the price of the item they had previously inputted.
			var priceOfDelivery = orderInfo.price;
			var priceFloat = priceOfDelivery.substring(2);
			var floated = parseFloat(priceFloat);
            
            //Display variable values in divs, - order summary 
			$("#deliverer-itemname").html(myOrderItemname);
			$("#deliverer-itemdetails").html(' -" ' + orderInfo.itemdetails + '"');
			$("#deliverer-itemcost").html("€ " + (floated + 3) + " <div id='inctext'>(inc. Delivery Fee)</div>");
			$("#deliverer-address").html(orderInfo.locationname.substring(0, 50) + "..");
			$("#deliverer-pickup").html(orderInfo.pickup.substring(0, 40) + "..");
		});       
	});
    
    //Set a timeout to determine whether the order has been accepted or not. (this function is called everytime beginSearching loops)
	setTimeout(determine, 2000);
    
    //UI aesthetics
	$(".footer-navbar").css('opacity', '0');
	$("#order-form").addClass('blur');
	$(".footer-navbar").addClass('blur');
	$(".img-logo").addClass('blur');
	$(".img-logo").addClass('blur');
	$("#boxx").css('display', 'block');
}


//This function is called continuously until the order is accepted. The way we determine if it has been accepted is using if else statements. If the order has been accepted, the beginSearching function it will place the values of the order from the database into a div. determine() function is responsible for detecting if these divs have been assigned values or not. If the divs have been assigned values in beginSearching, the order has been accepted. 
function determine() {
	var determinePull = document.getElementById('deliverer-itemname');
    //if the div is empty, nobody has accepted yet
	if (determinePull.innerHTML == "") {
		//       // Nobody has accepted your order yet
	} else if (determinePull.innerHTML != "")
    {
		//         // Someone has accepted your order, the div is no longer empty.//
		$('#wanto').css('display', 'none');
        
        //Plays a quick sound when the order has been accepted.
		var audio = document.getElementById('success');
		audio.play();
        
        //Now that the order is accepted, we can pull the data of the deliverer - including their phone number and rating. We do this by using the deliverer ID pulled from the beginSearching() function.
		var url2 = "http://dropzy.site/pull-user.php?email=" + myDeliverer + "";
		$.getJSON(url2, function(data) {
            
            
			$.each(data.userInfo, function(index, userInfo) {
				var deliverer = userInfo.fname;
                delivererEmail = userInfo.email;
				var delivererlname = userInfo.lname;
				var photo = userInfo.photo;
				var phone = parseFloat(userInfo.phone);
				var deliverrating = userInfo.score;
				delivererPhoto = userInfo.photo;
                
              
				delivererPhone = parseFloat(userInfo.phone); // convert string from database to phone number
				var photoArea = document.getElementById('order-user-pic');// display the deliverers profile picture
                photoArea.src = photo; //display profile
				var deliveryRating = document.getElementById('deliverer-rating-stars');
                
                //display the deliverers rating
				var s1 = document.getElementById("deliv-1-star");
				if (deliverrating == 1) {
					deliveryRating.src = "images/1star.png";
				} else {
					s1.style.visibility = "hidden";
				}
				var s2 = document.getElementById("deliv-2-star");
				if (deliverrating == 2) {
					deliveryRating.src = "images/2stars.png";
				} else {
					s2.style.visibility = "hidden";
				}
				var s3 = document.getElementById("deliv-3-star");
				if (deliverrating == 3) {
					deliveryRating.src = "images/3stars.png";
				} else {
					s3.style.visibility = "hidden";
				}
				var s4 = document.getElementById("deliv-4-star");
				if (deliverrating == 4) {
					deliveryRating.src = "images/4stars.png";
				} else {
					s4.style.visibility = "hidden";
				}
				var s5 = document.getElementById("deliv-5-star");
				if (deliverrating == 5) {
					deliveryRating.src = "images/5tars.png";
				} else {
					s5.style.visibility = "hidden";
				}
				$('#deliverer-fullname').html(deliverer + " " + delivererlname); //Show the name of the deliverer 
			
				$('#deliver-call').attr('href', 'tel:/' + phone + '');//Assign phone calling cabailities call button
				$('#deliver-cancel').attr('href', 'https://api.whatsapp.com/send?phone=' + phone + '');//Assign whatsapp cabailities message button

                //when the orderer exits the delivery, they simultaneously send off their rating of their deliverer using a PHP script.
				$("#exit-delivery").click(function() {
					var scoretally = document.getElementById('score').value;
					var mydeliverer1 = userInfo.email;
					var tallyString = "mydeliverer1=" + myDeliverer + "&scoretally=" + scoretally + "&exit-delivery=";
					$.ajax({
						type: "POST",
						url: "http://dropzy.site/change-scoretally.php",
						data: tallyString,
						crossDomain: true,
						cache: false,
						beforeSend: function() {
							$("#exit-delivery").val('Connecting...');
						},
						success: function(data) {
							if (data == "success") {
							 
                                //If the rating is successful, the orderer is then brought to the homepage. and the application is refreshed.
								$("#exit-delivery").val("Update");
                                $(".interval").show().delay(1000).fadeOut();
					           setTimeout(function() {
						      window.location.hash += "#home";
						      location.reload();
					           }, 1000);
							} else if (data == "error") {
								alert("error");
							}
						}
					});
					
				});
			});       
		});
        
        //Clear the intervals that determine whether the order has been accepted. These are cleared once the order is accepted.
		clearInterval(newSearchTimer);
		clearInterval(searchTimer);
        
        
        //Bounce the searching for deliverer modal out of view, since the order has been accepted.
		var bounce6 = new Bounce();
		bounce6.translate({
			from: {
				x: 0,
				y: 0
			},
			to: {
				x: 0,
				y: -1000
			},
			easing: "hardbounce",
			duration: 1200,
		}).applyTo(document.querySelectorAll("#searching-for-deliverer"));
		$("#in-order").css('display', 'block');
		var bounce5 = new Bounce();
		bounce5.translate({
			from: {
				x: 0,
				y: -100
			},
			to: {
				x: 0,
				y: 30
			},
			easing: "hardbounce",
			duration: 1200,
		}).applyTo(document.querySelectorAll("#in-order"));
		var bounce6 = new Bounce();
		bounce6.translate({
			from: {
				x: 0,
				y: 0
			},
			to: {
				x: 0,
				y: -1000
			},
			easing: "hardbounce",
			duration: 1200,
		}).applyTo(document.querySelectorAll("#searching-for-deliverer"));
        
        //New intervals are set, that determine if the order has been cancelled by the deliverer or completed.
        
		refreshInterval = setInterval(checkIfComplete, 2000);
		cancelledInterval = setInterval(checkIfCancelled, 2000);
	}
}



//This function runs constantly throughout an order. It determines whether either user has cancelled the order. If this is the case, various functions are called to deal with each potential outcome.
function checkIfCancelled() {
	var orderEmail = localStorage.getItem('email');
			
	var url = "http://dropzy.site/pull-order-json3.php?email=" + orderEmail + "&orderid=" + myOrderid;
	$.getJSON(url, function(data) {
        
        //"iscancelled" is a column in the database. If a user cancels, it's value is turned from 0 to 1. checkIfCancelled() function is to detect if this value has changed - and decides what to do next.
		$.each(data.orderInfo, function(index, orderInfo) {
			if (orderInfo.iscancelled == 1) {
				clearInterval(cancelledInterval);
                
                //the deliverer has cancelled, not the orderer.
				if (theOrdererCancelled == false) {
                     //function called that deals with the deliverer cancelling
					ifCancelled();
                    
                    //the orderer has cancelled, not the deliverer
				} else if (theOrdererCancelled == true) {
                    
                    //function called that deals with the orderer cancelling
					iCancelled();
				}
			} else {
				//do nothing		
			}
		});
	});
}


//This function checks if the deliverer has marked the order as complete. Earlier on we pulled out the unique order id from the database and we use it here to determine if the column value "iscomplete" has been changed from 0 to 1. if this is detected, checkifComplete() determines what function to call next.
function checkIfComplete() {
	var ordererEmail = localStorage.getItem('email');
	var jsonUrl = "http://dropzy.site/ordercompleted-json.php?email=" + ordererEmail + "&orderid=" + myOrderid + "";
	$.getJSON(jsonUrl, function(data) {
		$.each(data.completeOrder, function(index, completeOrder) {
			var delivererActive = completeOrder.iddeliverer;
            
            //change the value of this empty div if the order is complete.
			$("#determine").html(delivererActive);
		});       
	});
    //'determine' is a div that is empty until the json call above places a value in it. 
	var determineIfComplete = document.getElementById('determine');
    
    //If the div 'determine' is not empty, this means that the order has been completed.
	if (determineIfComplete.innerHTML != "") {
        
        //So the delivery can now be ended.
		endDelivery();
        
         
	} else if (determineIfComplete.innerHTML == "") {
        //If the div 'determine' is still empty, this means that the order has not yet been completed. And the function will continue looping
    }
}

function endDelivery() {
    
    //endDelivery() simply clears the intervals and marks the order as complete.
	clearInterval(refreshInterval);
    
    //After delivery is called to carry out the next final steps of the order.
	afterDelivery();
}

function afterDelivery() {
    
    //this function shows a follow up div of the details of the order after it has been completed.
    //it shows the rating stars and gives the orderer the opportunity to rate their deliverer or report them.
	var delivererReviewPic = document.getElementById('review-pic');
	delivererReviewPic.src = delivererPhoto;
	var bounce9 = new Bounce();
	bounce9.translate({
		from: {
			x: 0,
			y: 0
		},
		to: {
			x: 0,
			y: -1000
		},
		easing: "hardbounce",
		duration: 1200,
	}).applyTo(document.querySelectorAll("#in-order"));
    
    // the report button opens the users mail client and composes an email to our admin email address.
	$('#button6').click(function() {
		window.location.href = 'mailto:infodropzy@gmail.com';
	});
    
	$("#completed-order").css('display', 'block');
    $("#exit-delivery").css('display','block');
    $("#exit-delivery").html('Submit Rating & Return Home');
    $("#exit-delivery2").css('display','none');
    $("#exit-delivery").click(function() {
        
        //this function simultaneously exits the delivery and sends off the rating they have just made of the orderer.
					var scoretally = document.getElementById('score').value;
					var mydeliverer1 = userInfo.email;
					var tallyString = "mydeliverer1=" +  myDeliverer + "&scoretally=" + scoretally + "&exit-delivery=";
					$.ajax({
						type: "POST",
						url: "http://dropzy.site/change-scoretally.php",
						data: tallyString,
						crossDomain: true,
						cache: false,
						beforeSend: function() {
							$("#exit-delivery").val('Connecting...');
						},
						success: function(data) {
							if (data == "success") {
							
                                
                                //only if the rating is successfull can the user exit the delivery and return home.
								$("#exit-delivery").val("Update");
                                $(".interval").show().delay(1000).fadeOut();
					           setTimeout(function() {
						      window.location.hash += "#home";
						      location.reload();
					           }, 1000);
							} else if (data == "error") {
								alert("error");
							}
						}
					});
					
				});
    
    //Bounces div out of view.
	var bounce10 = new Bounce();
	bounce10.translate({
		from: {
			x: 0,
			y: -100
		},
		to: {
			x: 0,
			y: -450
		},
		easing: "hardbounce",
		duration: 1200,
	}).applyTo(document.querySelectorAll("#completed-order"));
}


//This function is called if the ORDERER decides to cancel their order. The respective functions are called internally.
$('#deliver-message').on("click", function() {
	function cancelOptionss(buttonIndex) {
		if (buttonIndex === 1) {
            
            //see this function.
			theOrdererCancelledOrder();
		} else if (buttonIndex === 2) {}
	}
	   navigator.notification.confirm('Are you sure you want to cancel this order? This action cannot be undone.', // message
		cancelOptionss, // callback to invoke with index of button pressed
		'Cancel Order', // title
		'Cancel Order, Return To Order' // buttonLabels
	);
});

//This function changes the value of iscancelled in the database from 1 - 0, so that the deliverer can be notified.
function theOrdererCancelledOrder() {
	minimiseClose();
	theDelivererCancelled = false;
	theOrdererCancelled = true;
	var localEmail = localStorage.getItem('email');
	var dataString = "orderid=" + myOrderid + "&orderer=" + localEmail + "&delete=";
	$.ajax({
		type: "GET",
		url: "http://dropzy.site/changedToCancelled2.php",
		data: dataString,
		crossDomain: true,
		cache: false,
		beforeSend: function() {
			$("#delete").val('Accepting order...');
		},
		success: function(data) {
			if (data == "success") {
				//	                        alert('success');		
				//                        alert("Order has been accepted");		
			} else if (data == "error") {}
		}
	});
}

function minimiseClose() {
	var bounce8 = new Bounce();
	bounce8.translate({
		from: {
			x: 0,
			y: 0
		},
		to: {
			x: 0,
			y: -1000
		},
		easing: "hardbounce",
		duration: 1200,
	}).applyTo(document.querySelectorAll("#in-order"));
	$("#order-form").removeClass('blur');
	$(".footer-navbar").css('opacity', '1');
	$(".footer-navbar").removeClass('blur');
	$(".img-logo").removeClass('blur');
	$(".img-logo").removeClass('blur');
	$("#boxx").css('display', 'none');
}




//This function is called if the orderer themsselves cancels their own order after it has been accepted.
function iCancelled() {
	function showDelivererContactOptions() {
		function variousOptions(buttonIndex) {
			if (buttonIndex === 1) {
				window.location.href = "tel:/" + delivererPhone + '';
			} else if (buttonIndex === 2) {
				window.location.href = "sms:/" + delivererPhone + "";
			} else if (buttonIndex === 3) {
				window.location.href = "https://api.whatsapp.com/send?phone=" + delivererPhone + "";
			} else if (buttonIndex === 4) {}
		}
		navigator.notification.confirm('', // message
			variousOptions, // callback to invoke with index of button pressed
			'Contact Options', // title
			'Call, SMS, Whatsapp, Cancel' // buttonLabels
		);
	}
    
    
    //an confirm alert pops up to give the user the option of contacting their deliverer offering an explanation as to why they cancelled.
	$('#button6').click(function() {
		showDelivererContactOptions();
	});
	$('#exit-delivery').html('Return Home');
	$('#button6').html('Contact Deliverer');
	$('#complete-text').html('You have cancelled this order');
	$('#please-review').html('Cancelling orders once they have already been accepted may result in your account getting reported.');
	$('#exit-delivery').html('Return Home');
	$('#exit-delivery2').html('Return Home');
    
    //Brings the orderer back to the homepage and refreshes the app, so that they can make a new order etc.
	$('#exit-delivery2').click(function() {
		window.location.hash += "#home";
		location.reload();
	});
    
    //
	var delivererReviewPic = document.getElementById('review-pic');
	$('#review-pic').css('opacity', '0.5');
	$('#star-rating').css('display', 'none');
	delivererReviewPic.src = "images/cancel.png";
	//    var bounce9 = new Bounce();
	//    bounce9.translate({
	//  from: { x: 0, y: 0 },
	//  to: { x: 0, y: -800 },
	// easing: "hardbounce",
	//    duration: 1200,
	//}).applyTo(document.querySelectorAll("#in-order"));
	$("#completed-order").css('display', 'block');
	var bounce10 = new Bounce();
	bounce10.translate({
		from: {
			x: 0,
			y: -100
		},
		to: {
			x: 0,
			y: -450
		},
		easing: "hardbounce",
		duration: 1200,
	}).applyTo(document.querySelectorAll("#completed-order"));
}
$(document).ready(function() {
	$('#wanto').click(function() {
		window.location.href = 'mailto:infodropzy@gmail.com';
	});
});


//

function ifCancelled() {
	var determinePull4 = document.getElementById('deliverer-itemname');
	determinePull4.innerHTML = "";

    
    //This function puts the order back in the pool of orders if the deliverer cancels on the orderer. This is a way around the orderer being completely let down. Letting them carry over the order conveniently and submit again makes the situation of being cancelled on a bit better.
	function reSubmitOrder() {
		$('#wanto').css('display', 'block');
		var bounce6 = new Bounce();
		bounce6.translate({
			from: {
				x: 0,
				y: -1000
			},
			to: {
				x: 0,
				y: 0
			},
			easing: "hardbounce",
			duration: 1200,
		}).applyTo(document.querySelectorAll("#searching-for-deliverer"));
		$("#searching-for-deliverer").css('display', 'block');
		$('#completed-order').css('display', 'none');
        
        //This php script puts the order back in the pool. 
		var myemailvar = localStorage.getItem('email');
		var dataLine = "orderid=" + myOrderid + "&orderer=" + myemailvar + "&delete=";
		$.ajax({
			type: "GET",
			url: "http://dropzy.site/putBackInOrderPool.php",
			data: dataLine,
			crossDomain: true,
			cache: false,
			beforeSend: function() {
				$("#delete").val('Accepting order...');
			},
			success: function(data) {
				if (data == "success") {
				//Once it is successfully back in the pool, the complete order process is started again. See the beginSearching() function description again.
					newSearchTimer = setInterval(beginSearching, 4000);
					$("#searching-for-deliverer").css('display', 'block');
			                     
				} else if (data == "error") {}
			}
		});
	
	}
	$('#complete-text').html('Sorry, but your deliverer has cancelled this order.');
	$('#please-review').html('Rating poor delivery experiences helps us monitor unfit deliverers.');
	$('#exit-delivery2').css('display', 'block');
    $('#exit-delivery').css('display', 'none');
	$('#exit-delivery2').html('Submit Rating & Place Order Again');
	$('#button6').html('Abandon Order');
	var delivererReviewPic = document.getElementById('review-pic');
	$('#review-pic').css('opacity', '0.5');
	delivererReviewPic.src = "images/cancel.png";
	$('#exit-delivery2').click(function() {
        
        var scoretally = document.getElementById('score').value;
		//Changes score count of the deliverer after the orderer rates them poorly after cancelling on hem. 
		var tallyString = "mydeliverer1=" + myDeliverer + "&scoretally=" + scoretally + "&exit-delivery=";
		$.ajax({
			type: "POST",
			url: "http://dropzy.site/change-scoretally.php",
			data: tallyString,
			crossDomain: true,
			cache: false,
			beforeSend: function() {
				$("#exit-delivery").val('Connecting...');
			},
			success: function(data) {
				if (data == "success") {
//				    alert("Updated");
                    reSubmitOrder();
					$("#exit-delivery").val("Update");
				} else if (data == "error") {
					alert("error");
				}
			}
		});
		
	});
    
    //This button click simply allows the user to exit the order and return home
	$('#button6').click(function() {
		$(".interval").show().delay(2000).fadeOut();
		window.location.hash += "#home";
		location.reload();
	});
	var bounce9 = new Bounce();
	bounce9.translate({
		from: {
			x: 0,
			y: 0
		},
		to: {
			x: 0,
			y: -1000
		},
		easing: "hardbounce",
		duration: 1200,
	}).applyTo(document.querySelectorAll("#in-order"));
	$("#completed-order").css('display', 'block');
	var bounce10 = new Bounce();
	bounce10.translate({
		from: {
			x: 0,
			y: -100
		},
		to: {
			x: 0,
			y: -450
		},
		easing: "hardbounce",
		duration: 1200,
	}).applyTo(document.querySelectorAll("#completed-order"));
}




//global variables, assign data to them throughout the following functions
var userPosition;
var itemname;
var itemprice
var itemdetails;
var otherShop;
var dublin;
var posi;
var currentAddressCoords;
var userCurrentAddress;
var userSelectedAddress;
var userMarker;
var userSelectedPickup;
var mapvariable;
var getInput;
var currPosition;
var lat1;
var long1;
var currentArea;
var pickupCoords;
var pickupCoordsLat;
var pickupCoordsLong;
var inputform;
var pickupLocationInput;
var homeform;





// This example adds a search box to a map, using the Google Place Autocomplete
// feature. People can enter geographical searches. The search box will return a
// pick list containing a mix of places and predicted search terms.
// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
function initAutocomplete() {
	currentArea = new google.maps.LatLng(currPosition);
	map = new google.maps.Map(document.getElementById('map'), {
		center: currentArea,
        //custom map styles.
		styles: [{
			"featureType": "administrative",
			"elementType": "labels.text.fill",
			"stylers": [{
				"color": "#444444"
			}]
		}, {
			"featureType": "administrative.country",
			"elementType": "labels",
			"stylers": [{
				"visibility": "off"
			}]
		}, {
			"featureType": "administrative.country",
			"elementType": "labels.text",
			"stylers": [{
				"visibility": "off"
			}]
		}, {
			"featureType": "administrative.province",
			"elementType": "labels.text",
			"stylers": [{
				"visibility": "off"
			}]
		}, {
			"featureType": "administrative.locality",
			"elementType": "labels",
			"stylers": [{
				"visibility": "off"
			}]
		}, {
			"featureType": "administrative.locality",
			"elementType": "labels.text",
			"stylers": [{
				"visibility": "simplified"
			}]
		}, {
			"featureType": "landscape",
			"elementType": "all",
			"stylers": [{
				"color": "#ffffff"
			}, {
				"lightness": "-5"
			}]
		}, {
			"featureType": "landscape",
			"elementType": "geometry.fill",
			"stylers": [{
				"saturation": "4"
			}]
		}, {
			"featureType": "poi",
			"elementType": "all",
			"stylers": [{
				"visibility": "off"
			}]
		}, {
			"featureType": "poi.park",
			"elementType": "geometry.fill",
			"stylers": [{
				"visibility": "on"
			}, {
				"color": "#67b491"
			}, {
				"saturation": "18"
			}, {
				"lightness": "58"
			}]
		}, {
			"featureType": "poi.park",
			"elementType": "labels.text.fill",
			"stylers": [{
				"color": "#13dc80"
			}, {
				"visibility": "off"
			}]
		}, {
			"featureType": "poi.sports_complex",
			"elementType": "geometry.fill",
			"stylers": [{
				"color": "#b84444"
			}, {
				"visibility": "off"
			}]
		}, {
			"featureType": "road",
			"elementType": "all",
			"stylers": [{
				"saturation": -100
			}, {
				"lightness": 45
			}]
		}, {
			"featureType": "road.highway",
			"elementType": "all",
			"stylers": [{
				"visibility": "simplified"
			}]
		}, {
			"featureType": "road.highway",
			"elementType": "labels",
			"stylers": [{
				"visibility": "off"
			}]
		}, {
			"featureType": "road.highway",
			"elementType": "labels.text",
			"stylers": [{
				"visibility": "off"
			}]
		}, {
			"featureType": "road.arterial",
			"elementType": "labels.icon",
			"stylers": [{
				"visibility": "off"
			}]
		}, {
			"featureType": "transit",
			"elementType": "all",
			"stylers": [{
				"visibility": "off"
			}]
		}, {
			"featureType": "transit",
			"elementType": "labels",
			"stylers": [{
				"visibility": "simplified"
			}]
		}, {
			"featureType": "transit",
			"elementType": "labels.text",
			"stylers": [{
				"visibility": "simplified"
			}]
		}, {
			"featureType": "water",
			"elementType": "all",
			"stylers": [{
				"color": "#73f6ff"
			}, {
				"visibility": "on"
			}, {
				"saturation": "-27"
			}, {
				"lightness": "47"
			}]
		}],
		zoom: 16,
		mapTypeControl: false,
		mapTypeControlOptions: {
			style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
			position: google.maps.ControlPosition.BOTTOM_CENTER
		},
		zoomControl: false,
		zoomControlOptions: {
			position: google.maps.ControlPosition.LEFT_TOP
		},
		scaleControl: true,
		streetViewControl: false,
		streetViewControlOptions: {
			position: google.maps.ControlPosition.LEFT_TOP
		},
		fullscreenControl: false,
	});
    
    
    //This function is a workaround for stopping the map from showing up as a grey box on load.
	$(document).ready(function() {
		$(window).resize(function() {
			google.maps.event.trigger(map, 'resize');
		});
		google.maps.event.trigger(map, 'resize');
	});
    
    
	infoWindow5 = new google.maps.Marker;
     //This place searchbox is for the dropoff location serch input
    //Below is an implementation of a google places search box. The example came from the API example and is changed accordingly to meet dropzys needs. see this link for reference 
    // https://developers.google.com/maps/documentation/javascript/examples/places-searchbox
    
    
	// Create the search box and link it to the location input div element.
	var input = document.getElementById('location-input');
	var options = {
		componentRestrictions: {
			country: 'ie'
		}
	};
	var searchBox = new google.maps.places.SearchBox(input, options);
	

	map.addListener('bounds_changed', function() {
		searchBox.setBounds(map.getBounds());
	});
	var markers = [];
	// Listen for the user to select a place prediction and retrieve
	// more details on it.
	searchBox.addListener('places_changed', function() {
		var places = searchBox.getPlaces();
		if (places.length == 0) {
			return;
		}
		// Clear out the old markers.
		markers.forEach(function(marker) {
			marker.setMap(null);
		});
		markers = [];
		// For each place, get the icon, name and location.
		var bounds = new google.maps.LatLngBounds();
		places.forEach(function(place) {
			if (!place.geometry) {
				console.log("Returned place contains no geometry");
				return;
			}
			var icon = {
				url: "images/marker-pin-01.png",
				size: new google.maps.Size(41, 41),
				origin: new google.maps.Point(0, 0),
				anchor: new google.maps.Point(17, 34),
				scaledSize: new google.maps.Size(45, 45)
			};
			// Create a marker for each place.
			markers.push(new google.maps.Marker({
				map: map,
				icon: icon,
				animation: google.maps.Animation.DROP,
				title: place.name,
				position: place.geometry.location
			}));
            
            //This variable contains the selected lat long. this cn be used throughout the application as it is a global variable.
			mapvariable = place.geometry.location;
			currentAddressCoordsLat = place.geometry.location.lat();
			currentAddressCoordsLong = place.geometry.location.lng();
			if (place.geometry.viewport) {
				// Only geocodes have viewport.
				bounds.union(place.geometry.viewport);
			} else {
				bounds.extend(place.geometry.location);
			}
		});
		map.fitBounds(bounds);
	});
    
    //Call the function below after the places search function is complete
	initMap();
}


var map2;
var infowindow;
var service;




function initMap() {
	currentArea = new google.maps.LatLng(currPosition);
	dublin = {
		lat: 53.347447,
		lng: -6.259199
	};
    // This place searchbox is for the pickup location serch input. It is carried out in the same way as the dropoff location searchbox, see functino above 
	map2 = new google.maps.Map(document.getElementById('map2'), {
		center: dublin,
		zoom: 12,
		styles: [{
			"featureType": "administrative",
			"elementType": "labels.text.fill",
			"stylers": [{
				"color": "#444444"
			}]
		}, {
			"featureType": "administrative.country",
			"elementType": "labels",
			"stylers": [{
				"visibility": "off"
			}]
		}, {
			"featureType": "administrative.country",
			"elementType": "labels.text",
			"stylers": [{
				"visibility": "off"
			}]
		}, {
			"featureType": "administrative.province",
			"elementType": "labels.text",
			"stylers": [{
				"visibility": "off"
			}]
		}, {
			"featureType": "administrative.locality",
			"elementType": "labels",
			"stylers": [{
				"visibility": "off"
			}]
		}, {
			"featureType": "administrative.locality",
			"elementType": "labels.text",
			"stylers": [{
				"visibility": "simplified"
			}]
		}, {
			"featureType": "landscape",
			"elementType": "all",
			"stylers": [{
				"color": "#ffffff"
			}, {
				"lightness": "-5"
			}]
		}, {
			"featureType": "landscape",
			"elementType": "geometry.fill",
			"stylers": [{
				"saturation": "4"
			}]
		}, {
			"featureType": "poi",
			"elementType": "all",
			"stylers": [{
				"visibility": "off"
			}]
		}, {
			"featureType": "poi.park",
			"elementType": "geometry.fill",
			"stylers": [{
				"visibility": "on"
			}, {
				"color": "#67b491"
			}, {
				"saturation": "18"
			}, {
				"lightness": "58"
			}]
		}, {
			"featureType": "poi.park",
			"elementType": "labels.text.fill",
			"stylers": [{
				"color": "#13dc80"
			}, {
				"visibility": "off"
			}]
		}, {
			"featureType": "poi.sports_complex",
			"elementType": "geometry.fill",
			"stylers": [{
				"color": "#b84444"
			}, {
				"visibility": "off"
			}]
		}, {
			"featureType": "road",
			"elementType": "all",
			"stylers": [{
				"saturation": -100
			}, {
				"lightness": 45
			}]
		}, {
			"featureType": "road.highway",
			"elementType": "all",
			"stylers": [{
				"visibility": "simplified"
			}]
		}, {
			"featureType": "road.highway",
			"elementType": "labels",
			"stylers": [{
				"visibility": "off"
			}]
		}, {
			"featureType": "road.highway",
			"elementType": "labels.text",
			"stylers": [{
				"visibility": "off"
			}]
		}, {
			"featureType": "road.arterial",
			"elementType": "labels.icon",
			"stylers": [{
				"visibility": "off"
			}]
		}, {
			"featureType": "transit",
			"elementType": "all",
			"stylers": [{
				"visibility": "off"
			}]
		}, {
			"featureType": "transit",
			"elementType": "labels",
			"stylers": [{
				"visibility": "simplified"
			}]
		}, {
			"featureType": "transit",
			"elementType": "labels.text",
			"stylers": [{
				"visibility": "simplified"
			}]
		}, {
			"featureType": "water",
			"elementType": "all",
			"stylers": [{
				"color": "#73f6ff"
			}, {
				"visibility": "on"
			}, {
				"saturation": "-27"
			}, {
				"lightness": "47"
			}]
		}],
	});
	// Create the search box and link it to the UI element.
	var input2 = document.getElementById('pickup-location-input');
	var searchBox2 = new google.maps.places.SearchBox(input2);

	map2.addListener('bounds_changed', function() {
		searchBox2.setBounds(map.getBounds());
	});
	var markers2 = [];
	// Listen for the event fired when the user selects a prediction and retrieve
	// more details for that place.
	searchBox2.addListener('places_changed', function() {
		var places = searchBox2.getPlaces();
		if (places.length == 0) {
			return;
		}
		// Clear out the old markers.
		markers2.forEach(function(marker2) {
			marker2.setMap(null);
		});
		markers2 = [];
		// For each place, get the icon, name and location.
		var bounds = new google.maps.LatLngBounds();
		places.forEach(function(place) {
			if (!place.geometry) {
				console.log("Returned place contains no geometry");
				return;
			}
			var icon2 = {
				url: place.icon2,
				size: new google.maps.Size(71, 71),
				origin: new google.maps.Point(0, 0),
				anchor: new google.maps.Point(17, 34),
				scaledSize: new google.maps.Size(25, 25)
			};
			// Create a marker for each google place.
			markers2.push(new google.maps.Marker({
				map: map2,
				icon: icon2,
				title: place.name,
				position: place.geometry.location
			}));
			posi = place.geometry.location;
			var box = document.getElementById('shopbox');
			box.innerHTML = place.name + "<img src='" + place.photos[0].getUrl({
				'maxWidth': 200,
				'maxHeight': 200
			}) + "'/>";
			if (place.geometry.viewport) {

				bounds.union(place.geometry.viewport);
			} else {
				bounds.extend(place.geometry.location);
			}
		});
		map2.fitBounds(bounds);
	});
    
    
//	var request = {
//		location: dublin,
//		radius: 3000,
//		keyword: "Spar"
//	}
    
    
	infowindow = new google.maps.InfoWindow();
	service = new google.maps.places.PlacesService(map);
	service.nearbySearch(request, callback);
}

function callback(results, status) {
	if (status === google.maps.places.PlacesServiceStatus.OK) {
		results.forEach(createMarker);
		results.forEach(printResults);
	}
}


var marker5;
var dropoffLocationLatContainer;
var dropoffLocationLongContainer;
var pickupLocationLatContainer;
var pickupLocationLongContainer;


//Simple function that shows the order again page by page so that the user can make changes to their order before sending it off.
function editOrder() {
	$('#slide-up-location').addClass('animated slideInUp');
	$('#slide-up-location').css('display', 'block');
	$('#addedFee').css('display', 'none');
	$('#new-location').removeClass('animated slideOutDown');
}




var other;


function uploadMyProfilePhoto() {
    
    $('#ajax-loader').show().delay(4000).fadeOut();
    
//this uploads the image link generated with the IMGUR api  to the database. (see the imgur api script in index.html) Once the link is in the database it can easily be placed in image tags throughout the application
	var dataEmail = localStorage.getItem('email');
	var source = document.getElementById('settings-user-pic');
	profileImageLink = source.src;
	var photoString = "photo=" + profileImageLink + "&email=" + dataEmail + "&upload=";
	$.ajax({
		type: "POST",
		url: "http://dropzy.site/photoUpload.php",
		data: photoString,
		crossDomain: true,
		cache: false,
		beforeSend: function() {
		
		},
		success: function(data) {
			if (data == "success") {
				//                        alert("Updated");
			} else if (data == "error") {
				//                        alert("error");
			}
		}
	});
}


//This function is fired once the document is ready.
function ready() {
	// ;
	// Try HTML5 geolocation.
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			userPosition = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			};
			userLat = position.coords.latitude;
			userLong = position.coords.longitude;
			$(document).ready(function() {
				dataReady();
			});

			function dataReady() {
				delivererPosition = {
					lat: userLat,
					lng: userLong
				};
				delivererLat = userLat;
				delivererLong = userLong;
				deliverMap = new google.maps.Map(document.getElementById('deliver-map'), {
					zoom: 12,
					gestureHandling: 'greedy',
					styles: [{
						"featureType": "administrative",
						"elementType": "labels.text.fill",
						"stylers": [{
							"color": "#444444"
						}]
					}, {
						"featureType": "administrative.country",
						"elementType": "labels",
						"stylers": [{
							"visibility": "off"
						}]
					}, {
						"featureType": "administrative.country",
						"elementType": "labels.text",
						"stylers": [{
							"visibility": "off"
						}]
					}, {
						"featureType": "administrative.province",
						"elementType": "labels.text",
						"stylers": [{
							"visibility": "off"
						}]
					}, {
						"featureType": "administrative.locality",
						"elementType": "labels",
						"stylers": [{
							"visibility": "off"
						}]
					}, {
						"featureType": "administrative.locality",
						"elementType": "labels.text",
						"stylers": [{
							"visibility": "simplified"
						}]
					}, {
						"featureType": "landscape",
						"elementType": "all",
						"stylers": [{
							"color": "#ffffff"
						}, {
							"lightness": "-5"
						}]
					}, {
						"featureType": "landscape",
						"elementType": "geometry.fill",
						"stylers": [{
							"saturation": "4"
						}]
					}, {
						"featureType": "poi",
						"elementType": "all",
						"stylers": [{
							"visibility": "off"
						}]
					}, {
						"featureType": "poi.park",
						"elementType": "geometry.fill",
						"stylers": [{
							"visibility": "on"
						}, {
							"color": "#67b491"
						}, {
							"saturation": "18"
						}, {
							"lightness": "58"
						}]
					}, {
						"featureType": "poi.park",
						"elementType": "labels.text.fill",
						"stylers": [{
							"color": "#13dc80"
						}, {
							"visibility": "off"
						}]
					}, {
						"featureType": "poi.sports_complex",
						"elementType": "geometry.fill",
						"stylers": [{
							"color": "#b84444"
						}, {
							"visibility": "off"
						}]
					}, {
						"featureType": "road",
						"elementType": "all",
						"stylers": [{
							"saturation": -100
						}, {
							"lightness": 45
						}]
					}, {
						"featureType": "road.highway",
						"elementType": "all",
						"stylers": [{
							"visibility": "simplified"
						}]
					}, {
						"featureType": "road.highway",
						"elementType": "labels",
						"stylers": [{
							"visibility": "off"
						}]
					}, {
						"featureType": "road.highway",
						"elementType": "labels.text",
						"stylers": [{
							"visibility": "off"
						}]
					}, {
						"featureType": "road.arterial",
						"elementType": "labels.icon",
						"stylers": [{
							"visibility": "off"
						}]
					}, {
						"featureType": "transit",
						"elementType": "all",
						"stylers": [{
							"visibility": "off"
						}]
					}, {
						"featureType": "transit",
						"elementType": "labels",
						"stylers": [{
							"visibility": "simplified"
						}]
					}, {
						"featureType": "transit",
						"elementType": "labels.text",
						"stylers": [{
							"visibility": "simplified"
						}]
					}, {
						"featureType": "water",
						"elementType": "all",
						"stylers": [{
							"color": "#73f6ff"
						}, {
							"visibility": "on"
						}, {
							"saturation": "-27"
						}, {
							"lightness": "47"
						}]
					}],
					center: delivererPosition,
					mapTypeControl: false,
					mapTypeControlOptions: {
						style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
						position: google.maps.ControlPosition.BOTTOM_CENTER
					},
					zoomControl: false,
					zoomControlOptions: {
						position: google.maps.ControlPosition.LEFT_TOP
					},
					scaleControl: true,
					streetViewControl: false,
					streetViewControlOptions: {
						position: google.maps.ControlPosition.LEFT_TOP
					},
					fullscreenControl: false,
				});
				var marker9 = new google.maps.Marker({
					icon: {
						url: 'images/userpic2.png',
						anchor: new google.maps.Point(30, 42),
						scaledSize: new google.maps.Size(40, 60)
					},
					position: delivererPosition,
					map: deliverMap,
					title: 'Hello World!'
				});
				/////// The two pulsing circles on the deliver page map. Aims to represent a "radar" for nearby orders.
				var circle = new google.maps.Circle({
					center: delivererPosition,
					radius: 300,
					strokeColor: "#8c8ce4",
					strokeOpacity: 0.5,
					strokeWeight: 3,
					fillColor: "#E16D65",
					fillOpacity: 0
				});
				circle.setMap(deliverMap);
				var circle2 = new google.maps.Circle({
					center: delivererPosition,
					radius: 600,
					strokeColor: "#7eb5f8",
					strokeOpacity: 0.3,
					strokeWeight: 3,
					fillColor: "#E16D65",
					fillOpacity: 0
				});
				circle2.setMap(deliverMap);
				var direction = 1;
				var rMin = 150,
					rMax = 2000;
				setInterval(function() {
					var radius = circle.getRadius();
					if ((radius > rMax) || (radius < rMin)) {
						direction *= -1;
					}
					circle.setRadius(radius + direction * 10);
				}, 10);
				var direction2 = 1;
				var rMin2 = 150,
					rMax2 = 1000;
				setInterval(function() {
					var radius2 = circle2.getRadius();
					if ((radius2 > rMax) || (radius2 < rMin2)) {
						direction2 *= -1;
					}
					circle2.setRadius(radius2 + direction2 * 10);
				}, 10);
				//////////////////
				//This section contains the same json call for available orders as before, except this time instead of placing the
				//results in a list view format , we create markers on the map with the orders lat/long data and show the orders in a mapview format.
				var url = "http://dropzy.site/json.php";
				deliverMapInfoWindow = new google.maps.InfoWindow({
					pixelOffset: new google.maps.Size(0, 205)
				});
				$.getJSON(url, function(result) {
					console.log(result);
					$.each(result, function(i, field) {
						var orderid3 = field.orderid;
						var itemname3 = field.itemname;
						var pickup3 = field.pickup;
						var locationname3 = field.locationname;
						var price3 = field.price;
						var lat3 = field.lat;
						var long3 = field.long;
						var idorderer3 = field.idorderer;
						var pickuplat3 = field.pickuplat;
						var pickuplong3 = field.pickuplong;
						locationname3 = locationname3.replace("'", '');
						pickup3 = pickup3.replace("'", '');
						orderMarkers = new google.maps.LatLng(field.lat, field.long);
						// Creating a marker and putting it on the map
						requestMarker = new google.maps.Marker({
							position: orderMarkers,
							animation: google.maps.Animation.DROP,
							map: deliverMap,
							icon: {
								url: 'images/marker-pin-01.png',
								anchor: new google.maps.Point(30, 42),
								scaledSize: new google.maps.Size(40, 40)
							}
						});
						(function(requestMarker, field) {
							// Attaching a click event to the current instance of the loop made marker for each order
							google.maps.event.addListener(requestMarker, "click", function(e) {
								deliverMap.setOptions({
									draggable: true,
									zoomControl: true,
									scrollwheel: false,
									disableDoubleClickZoom: true
								});
								deliverMap.setCenter(requestMarker);
								deliverMap.setZoom(18);
								setTimeout(function() {
									var arrow_div = $(".gm-style-iw").prev();
									$("div:eq(0)", arrow_div).hide();
									$("div:eq(2)", arrow_div).hide();
								}, 100);
								$('#map-container-info').css('display', 'block');
								$('#map-container-info').addClass('animated slideInUp');
								// This displays the order info to the deliverer in a rectangular box. It shows the price, pickup location, and dropoff location.
								$('#map-container-info').html("<a class='map-item' style='display: block; width: 80vw; overflow: hidden;'rel='external' href='#order-route?orderid=" + orderid3 + "&itemname=" + itemname3 + "&pickup=" + pickup3 + "&price=" + price3 + "&lat=" + lat3 + "&long=" + long3 + "&locationname=" + locationname3 + "&idorderer=" + idorderer3 + "&pickuplat=" + pickuplat3 + "&pickuplong=" + pickuplong3 + "'><p class='order-items' style='font-size: 15px; font-weight: 400; top: 100%; left: 2vw; padding-top: 2vh;'>" + itemname3 + "</p><p id='order-price' style='float: right; right: 10vw;  top: -20px; font-size: 16px; font-weight: 200; text-align: left; '>" + price3 + "</p><p class='order-locations' style='font-size: 10px; width: 50vw;text-align: left; left: 9vw; bottom: 100%; opacity: 0.7;'>" + locationname3 + "</p><img src='images/iconlocation.png' style='width: 5vw; position: relative; left: 2vw; top: -1.5vh;'/></a><br>");
								// In order to retain the data, we store the order info in an info window also, but this infowindow is hidden.
								deliverMapInfoWindow.setContent("<a class='opacity' style='display: block; width: 80vw; overflow: hidden;'rel='external' href='#order-route?orderid=" + orderid3 + "&itemname=" + itemname3 + "&pickup=" + pickup3 + "&price=" + price3 + "&lat=" + lat3 + "&long=" + long3 + "&locationname=" + locationname3 + "&idorderer=" + idorderer3 + "&pickuplat=" + pickuplat3 + "&pickuplong=" + pickuplong3 + "'><p class='order-items' style='font-size: 15px; font-weight: 400; top: 100%; left: 2vw; padding-top: 2vh;'>" + itemname3 + "</p><p id='order-price' style='float: right; right: 10vw;  top: -20px; font-size: 16px; font-weight: 200; text-align: left; '>" + price3 + "</p><p class='order-locations' style='font-size: 10px; width: 50vw;text-align: left; left: 9vw; bottom: 100%; opacity: 0.7;'>" + locationname3 + "</p><img src='images/iconlocation.png' style='width: 5vw; position: relative; left: 2vw; top: -1.5vh;'/></a><br>");
								deliverMapInfoWindow.setOptions({
									maxWidth: 400
								});
								deliverMapInfoWindow.open(deliverMap, requestMarker);
								setTimeout(function() {
									deliverMapInfoWindow.close();
								}, 500);
								$('#map-deliver-info').css("display", "block");
							});
						})(requestMarker, field);
					});
				});
			}
			var latlng = new google.maps.LatLng(userLat, userLong);
			// This is making the Geocode request
			var geocoder = new google.maps.Geocoder();
			geocoder.geocode({
				'latLng': latlng
			}, function(results, status) {
				if (status !== google.maps.GeocoderStatus.OK) {
					alert(status);
				}
				// This is checking to see if the Geoeode Status is OK before proceeding
				if (status == google.maps.GeocoderStatus.OK) {
					console.log(results[0]);
					$("#location-input").val(results[0].formatted_address);
					userCurrentAddress = (results[0].formatted_address);
					googleFormattedGeoAddress = (results[0].formatted_address);
					currentAddressCoords = (results[0].geometry.location);
					currentAddressCoordsLat = (results[0].geometry.location.lat());
					currentAddressCoordsLong = (results[0].geometry.location.lng());
					//            alert(userCurrentAddress);
				}
			});
			var link = "images/userlocation.png";
			userMarker = new google.maps.Marker({
				position: userPosition,
				map: map,
				icon: {
					url: link,
					anchor: new google.maps.Point(30, 42),
					scaledSize: new google.maps.Size(40, 40)
				}
			});
			$('#home-btn').on("click", function() {
				userMarker.setVisible(false);
				$('#work-btn').css("opacity", "0.3");
				$('#home-btn').css("opacity", "1");
				home = true;
				work = false;
				$('#location-input').val(myHome);
				var homeMapCenter = new google.maps.LatLng(myHomeLat, myHomeLong);
				map.panTo(homeMapCenter);
				homeMarker = new google.maps.Marker({
					icon: {
						url: 'images/map-icons-02.png',
						anchor: new google.maps.Point(27, 52),
						scaledSize: new google.maps.Size(40, 55)
					},
					position: homeMapCenter,
					animation: google.maps.Animation.DROP,
					map: map,
					title: 'Hello World!'
				});
				workMarker.setMap(null);
				workMarker.setMap(null);
			});
			$('#work-btn').on("click", function() {
				userMarker.setVisible(false);
				$('#home-btn').css("opacity", "0.3");
				$('#work-btn').css("opacity", "1");
				work = true;
				home = false;
				$('#location-input').val(myWork);
				var workMapCenter = new google.maps.LatLng(myWorkLat, myWorkLong);
				map.panTo(workMapCenter);
				workMarker = new google.maps.Marker({
					icon: {
						url: 'images/map-icons-01.png',
						anchor: new google.maps.Point(27, 52),
						scaledSize: new google.maps.Size(40, 55)
					},
					position: workMapCenter,
					animation: google.maps.Animation.DROP,
					map: map,
					title: 'Hello World!'
				});
				homeMarker.setMap(null);
			});
			map.setCenter(userPosition);
			var dublinCityCoords = [{
				lat: 53.318287, 
				lng: -6.229842
			}, {
				lat: 53.326610, 
				lng: -6.291542
			}, {
				lat: 53.369720,
				lng:  -6.296242
			}, {
				lat: 53.362128,
				lng:  -6.242343
			}];
			// testingCoords is for an extra geofence polygon for testing purposes as I don't live in the dublin city centre area
			//so I needed a dummy geofence around me to make sure the geofence functions worked.
//			        var testingCoords = [
//			
//			             {lat:  53.384461, lng: -6.257780},
//			            {lat:  53.395825, lng: -6.186541},
//			               {lat:  53.353939, lng: -6.174353},
//			             {lat:  53.356501, lng: -6.238383}
//			
//			
//			
//			        ];
			// Constructs dublin city polygon.
			dublinCityFence = new google.maps.Polygon({
				paths: dublinCityCoords,
				strokeColor: 'none',
				strokeOpacity: 0.0,
				strokeWeight: 1,
				fillColor: '#91abf4',
				fillOpacity: 0.1
			});
			var dublinCenter = new google.maps.LatLng(53.346097, -6.259759);
			dublinCityFence.setMap(map);
			var popUp;
			//Close popup that says that dropzy is unavailable in area
			$(".modal-button").on("click", function() {
				$('#dropzy-overlay, #dropzy-notavailable').css('display', 'none');
			});
			currentMarker = new google.maps.LatLng(parseFloat(userPosition.lat), parseFloat(userPosition.lng));
			other = new google.maps.LatLng(53.243756, -6.420172);
		}, function() {
			handleLocationError(true, infoWindow5, map.getCenter());
		});
	} else {
		// Browser doesn't support Geolocation
		handleLocationError(false, infoWindow5, map.getCenter());
	}
}

function ready2() {
	// ;
	// Try HTML5 geolocation.
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			userPosition = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			};
			userLat = position.coords.latitude;
			userLong = position.coords.longitude;
			$(document).ready(function() {
				dataReady();
			});

			function dataReady() {
				delivererPosition = {
					lat: userLat,
					lng: userLong
				};
				delivererLat = userLat;
				delivererLong = userLong;
				deliverMap = new google.maps.Map(document.getElementById('deliver-map'), {
					zoom: 12,
					gestureHandling: 'greedy',
					styles: [{
						"featureType": "administrative",
						"elementType": "labels.text.fill",
						"stylers": [{
							"color": "#444444"
						}]
					}, {
						"featureType": "administrative.country",
						"elementType": "labels",
						"stylers": [{
							"visibility": "off"
						}]
					}, {
						"featureType": "administrative.country",
						"elementType": "labels.text",
						"stylers": [{
							"visibility": "off"
						}]
					}, {
						"featureType": "administrative.province",
						"elementType": "labels.text",
						"stylers": [{
							"visibility": "off"
						}]
					}, {
						"featureType": "administrative.locality",
						"elementType": "labels",
						"stylers": [{
							"visibility": "off"
						}]
					}, {
						"featureType": "administrative.locality",
						"elementType": "labels.text",
						"stylers": [{
							"visibility": "simplified"
						}]
					}, {
						"featureType": "landscape",
						"elementType": "all",
						"stylers": [{
							"color": "#ffffff"
						}, {
							"lightness": "-5"
						}]
					}, {
						"featureType": "landscape",
						"elementType": "geometry.fill",
						"stylers": [{
							"saturation": "4"
						}]
					}, {
						"featureType": "poi",
						"elementType": "all",
						"stylers": [{
							"visibility": "off"
						}]
					}, {
						"featureType": "poi.park",
						"elementType": "geometry.fill",
						"stylers": [{
							"visibility": "on"
						}, {
							"color": "#67b491"
						}, {
							"saturation": "18"
						}, {
							"lightness": "58"
						}]
					}, {
						"featureType": "poi.park",
						"elementType": "labels.text.fill",
						"stylers": [{
							"color": "#13dc80"
						}, {
							"visibility": "off"
						}]
					}, {
						"featureType": "poi.sports_complex",
						"elementType": "geometry.fill",
						"stylers": [{
							"color": "#b84444"
						}, {
							"visibility": "off"
						}]
					}, {
						"featureType": "road",
						"elementType": "all",
						"stylers": [{
							"saturation": -100
						}, {
							"lightness": 45
						}]
					}, {
						"featureType": "road.highway",
						"elementType": "all",
						"stylers": [{
							"visibility": "simplified"
						}]
					}, {
						"featureType": "road.highway",
						"elementType": "labels",
						"stylers": [{
							"visibility": "off"
						}]
					}, {
						"featureType": "road.highway",
						"elementType": "labels.text",
						"stylers": [{
							"visibility": "off"
						}]
					}, {
						"featureType": "road.arterial",
						"elementType": "labels.icon",
						"stylers": [{
							"visibility": "off"
						}]
					}, {
						"featureType": "transit",
						"elementType": "all",
						"stylers": [{
							"visibility": "off"
						}]
					}, {
						"featureType": "transit",
						"elementType": "labels",
						"stylers": [{
							"visibility": "simplified"
						}]
					}, {
						"featureType": "transit",
						"elementType": "labels.text",
						"stylers": [{
							"visibility": "simplified"
						}]
					}, {
						"featureType": "water",
						"elementType": "all",
						"stylers": [{
							"color": "#73f6ff"
						}, {
							"visibility": "on"
						}, {
							"saturation": "-27"
						}, {
							"lightness": "47"
						}]
					}],
					center: delivererPosition,
					mapTypeControl: false,
					mapTypeControlOptions: {
						style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
						position: google.maps.ControlPosition.BOTTOM_CENTER
					},
					zoomControl: false,
					zoomControlOptions: {
						position: google.maps.ControlPosition.LEFT_TOP
					},
					scaleControl: true,
					streetViewControl: false,
					streetViewControlOptions: {
						position: google.maps.ControlPosition.LEFT_TOP
					},
					fullscreenControl: false,
				});
				var marker9 = new google.maps.Marker({
					icon: {
						url: 'images/locationicons-02.png',
						anchor: new google.maps.Point(30, 42),
						scaledSize: new google.maps.Size(40, 65)
					},
					position: delivererPosition,
					map: deliverMap,
					title: 'Hello World!'
				});
				var circle = new google.maps.Circle({
					center: delivererPosition,
					radius: 300,
					strokeColor: "#8c8ce4",
					strokeOpacity: 0.5,
					strokeWeight: 3,
					fillColor: "#E16D65",
					fillOpacity: 0
				});
				circle.setMap(deliverMap);
				var circle2 = new google.maps.Circle({
					center: delivererPosition,
					radius: 600,
					strokeColor: "#7eb5f8",
					strokeOpacity: 0.3,
					strokeWeight: 3,
					fillColor: "#E16D65",
					fillOpacity: 0
				});
				circle2.setMap(deliverMap);
				var direction = 1;
				var rMin = 150,
					rMax = 2000;
				setInterval(function() {
					var radius = circle.getRadius();
					if ((radius > rMax) || (radius < rMin)) {
						direction *= -1;
					}
					circle.setRadius(radius + direction * 10);
				}, 10);
				var direction2 = 1;
				var rMin2 = 150,
					rMax2 = 1000;
				setInterval(function() {
					var radius2 = circle2.getRadius();
					if ((radius2 > rMax) || (radius2 < rMin2)) {
						direction2 *= -1;
					}
					circle2.setRadius(radius2 + direction2 * 10);
				}, 10);
			
				var url = "http://dropzy.site/json.php";
				deliverMapInfoWindow = new google.maps.InfoWindow({
					pixelOffset: new google.maps.Size(0, 205)
				});
				$.getJSON(url, function(result) {
					console.log(result);
					$.each(result, function(i, field) {
						var orderid3 = field.orderid;
						var itemname3 = field.itemname;
						var pickup3 = field.pickup;
						var locationname3 = field.locationname;
						var price3 = field.price;
						var lat3 = field.lat;
						var long3 = field.long;
						var idorderer3 = field.idorderer;
						var pickuplat3 = field.pickuplat;
						var pickuplong3 = field.pickuplong;
						locationname3 = locationname3.replace("'", '');
						pickup3 = pickup3.replace("'", '');
						orderMarkers = new google.maps.LatLng(field.lat, field.long);
						// Creating a marker and putting it on the map
						requestMarker = new google.maps.Marker({
							position: orderMarkers,
							animation: google.maps.Animation.DROP,
							map: deliverMap,
							icon: {
								url: 'images/marker-pin-01.png',
								anchor: new google.maps.Point(30, 42),
								scaledSize: new google.maps.Size(40, 40)
							}
						});
						(function(requestMarker, field) {
							// Attaching a click event to the current marker
							google.maps.event.addListener(requestMarker, "click", function(e) {
								setTimeout(function() {
									var arrow_div = $(".gm-style-iw").prev();
									$("div:eq(0)", arrow_div).hide();
									$("div:eq(2)", arrow_div).hide();
								}, 100);
								$('#map-container-info').css('display', 'block');
								$('#map-container-info').addClass('animated slideInUp');
								$('#map-deliver-info').css("display", "block");
								$('#map-deliver-info').removeClass("animated slideOutUp");
								$('#map-deliver-info').addClass("animated slideInDown");
								$('#map-container-info').html("<img src='images/tofrom.png' id='tofrommap'/><a class='map-item' style='display: block; width: 80vw; overflow: hidden;'rel='external' href='#order-route?orderid=" + orderid3 + "&itemname=" + itemname3 + "&pickup=" + pickup3 + "&price=" + price3 + "&lat=" + lat3 + "&long=" + long3 + "&locationname=" + locationname3 + "&idorderer=" + idorderer3 + "&pickuplat=" + pickuplat3 + "&pickuplong=" + pickuplong3 + "'><p class='order-items2' style='font-size: 15px; font-weight: 400; top: 100%; left: 2vw; padding-top: 2vh;'>" + itemname3 + "</p><p class='order-price2' style='float: right; right: 10vw;  top: -20px; font-size: 16px; font-weight: 200; text-align: left; '>" + price3 + " </p><p class='order-locations2' style='font-size: 10px; width: 50vw;text-align: left; left: 9vw; bottom: 100%; opacity: 0.7;'>" + locationname3.substring(0, 28) + "</p><p class='mappickup'>" + pickup3.substring(0, 28) + "</p><p class='map-itemname'>" + itemname3 + "</p><div class='view-order2'>View</div><div class='line4'></div></a><br>");
								var centerMarkers = new google.maps.LatLng(lat3, long3);
								deliverMap.setOptions({
									draggable: true,
									zoomControl: true,
									scrollwheel: false,
									disableDoubleClickZoom: true
								});
								deliverMap.panTo(centerMarkers);
								deliverMap.setZoom(18);
								///MAY BE A PROBLEM
								deliverMapInfoWindow.setVisible(false);
								//    requestMarker.setAnimation(google.maps.Animation.BOUNCE);
								deliverMapInfoWindow.setContent("<a class='opacity' style='display: block; width: 80vw; overflow: hidden;'rel='external' href='#order-route?orderid=" + orderid3 + "&itemname=" + itemname3 + "&pickup=" + pickup3 + "&price=" + price3 + "&lat=" + lat3 + "&long=" + long3 + "&locationname=" + locationname3 + "&idorderer=" + idorderer3 + "&pickuplat=" + pickuplat3 + "&pickuplong=" + pickuplong3 + "'><p class='order-items' style='font-size: 15px; font-weight: 400; top: 100%; left: 2vw; padding-top: 2vh;'>" + itemname3 + "</p><p id='order-price' style='float: right; right: 10vw;  top: -20px; font-size: 16px; font-weight: 200; text-align: left; '>€" + price3 + "</p><p class='order-locations' style='font-size: 10px; width: 50vw;text-align: left; left: 9vw; bottom: 100%; opacity: 0.7;'>" + locationname3 + "</p><p class='pickup-maptext'>" + pickup3 + "</p></a><br>");
								deliverMapInfoWindow.setOptions({
									maxWidth: 400
								});
								deliverMapInfoWindow.open(deliverMap, requestMarker);
								setTimeout(function() {
									deliverMapInfoWindow.close();
								}, 100);
							});
						})(requestMarker, field);
					});
				});
			}
			var latlng = new google.maps.LatLng(userLat, userLong);
			// This is making the Geocode request
			var geocoder = new google.maps.Geocoder();
			geocoder.geocode({
				'latLng': latlng
			}, function(results, status) {
				if (status !== google.maps.GeocoderStatus.OK) {
					alert(status);
				}
				// This is checking to see if the Geoeode Status is OK before proceeding
				if (status == google.maps.GeocoderStatus.OK) {
					console.log(results[0]);
					$("#location-input").val(results[0].formatted_address);
					userCurrentAddress = (results[0].formatted_address);
					googleFormattedGeoAddress = (results[0].formatted_address);
					currentAddressCoords = (results[0].geometry.location);
					currentAddressCoordsLat = (results[0].geometry.location.lat());
					currentAddressCoordsLong = (results[0].geometry.location.lng());
					//            alert(userCurrentAddress);
				}
			});
			var link = "images/userlocation.png";
	
			$('#home-btn').on("click", function() {
				$('#work-btn').css("opacity", "0.3");
				$('#home-btn').css("opacity", "1");
				home = true;
				work = false;
				$('#location-input').val(myHome);
				var homeMapCenter = new google.maps.LatLng(myHomeLat, myHomeLong);
				map.panTo(homeMapCenter);
				homeMarker = new google.maps.Marker({
					icon: {
						url: 'images/map-icons-02.png',
						anchor: new google.maps.Point(27, 52),
						scaledSize: new google.maps.Size(40, 55)
					},
					position: homeMapCenter,
					animation: google.maps.Animation.DROP,
					map: map,
					title: 'Hello World!'
				});
				workMarker.setMap(null);
				workMarker.setMap(null);
			});
			$('#work-btn').on("click", function() {
				userMarker.setVisible(false);
				$('#home-btn').css("opacity", "0.3");
				$('#work-btn').css("opacity", "1");
				work = true;
				home = false;
				$('#location-input').val(myWork);
				var workMapCenter = new google.maps.LatLng(myWorkLat, myWorkLong);
				map.panTo(workMapCenter);
				workMarker = new google.maps.Marker({
					icon: {
						url: 'images/map-icons-01.png',
						anchor: new google.maps.Point(27, 52),
						scaledSize: new google.maps.Size(40, 55)
					},
					position: workMapCenter,
					animation: google.maps.Animation.DROP,
					map: map,
					title: 'Hello World!'
				});
				homeMarker.setMap(null);
			});
			map.setCenter(userPosition);
			var dublinCityCoords = [{
				lat: 53.335499,
				lng: -6.286695
			}, {
				lat: 53.357836,
				lng: -6.284526
			}, {
				lat: 53.355887,
				lng: -6.241259
			}, {
				lat: 53.334583,
				lng: -6.244746
			}];
			// testingCoords is for an extra geofence polygon for testing purposes as I don't live in the dublin city centre area
			//so I needed a dummy geofence around me to make sure the geofence functions worked.
			//        var testingCoords = [
			//
			//             {lat:  53.384461, lng: -6.257780},
			//            {lat:  53.395825, lng: -6.186541},
			//               {lat:  53.353939, lng: -6.174353},
			//             {lat:  53.356501, lng: -6.238383}
			//
			//
			//
			//        ];
			// Constructs dublin city polygon.
			dublinCityFence = new google.maps.Polygon({
				paths: dublinCityCoords,
				strokeColor: 'none',
				strokeOpacity: 0.0,
				strokeWeight: 1,
				fillColor: '#91abf4',
				fillOpacity: 0.1
			});
			var dublinCenter = new google.maps.LatLng(53.346097, -6.259759);
			dublinCityFence.setMap(map);
			var popUp;
			//Close popup that says that dropzy is unavailable in area
			$(".modal-button").on("click", function() {
				$('#dropzy-overlay, #dropzy-notavailable').css('display', 'none');
			});
			currentMarker = new google.maps.LatLng(parseFloat(userPosition.lat), parseFloat(userPosition.lng));
			other = new google.maps.LatLng(53.243756, -6.420172);
		}, function() {
			handleLocationError(true, infoWindow5, map.getCenter());
		});
	} else {
		// Browser doesn't support Geolocation
		handleLocationError(false, infoWindow5, map.getCenter());
	}
}


//When the user selects "Create a new order" button, the applciation determines whether they have saved an address before for their home or work by seeing if the variable containing their information from the database has been assigned a home or work value.
$(document).ready(function() {
	$("#specify-address").click(function() {
		if (myHome == "" && myWork != "") {
			$('#work-btn').css('display', 'block');
			$('#home-btn').css('display', 'none');
		} else if (myHome != "" && myWork == "") {
			$('#work-btn').css('display', 'none');
			$('#home-btn').css('display', 'block');
		} else if (myHome == "" && myWork == "") {
			$('#work-btn').css('display', 'none');
			$('#home-btn').css('display', 'none');
		} else if (myHome != "" && myWork != "") {
			$('#home-btn').css('display', 'block');
			$('#work-btn').css('display', 'block');
		}
		itemNext = false;
		deliveryNext = false;
		pickupNext = false;
		started = true;
		var thisItem = document.getElementById('whatyouneed').value;
		$("#itemname-area").val(thisItem);
		$("#map").fadeOut();
		setTimeout(startProcess, 40);
		var bounce2 = new Bounce();
		bounce2.translate({
			from: {
				x: 0,
				y: 0
			},
			to: {
				x: 0,
				y: 0
			},
			easing: "hardbounce",
			duration: 1200,
		}).scale({
			from: {
				x: 3,
				y: 3
			},
			to: {
				x: 0.2,
				y: 0.2
			},
			easing: "sway",
			delay: 30,
		}).applyTo(document.querySelectorAll("#map"));
        
        
			if (google.maps.geometry.poly.containsLocation(currentMarker, dublinCityFence)) {
//				you are inside the dublin geofence, all is good.
			} else {
				function alertDismissed() {}
				
                
                setTimeout(function() {
							navigator.notification.alert("It seems like you're outside the area Dropzy covers. While you can still place orders, unfortunately we cannot guarentee that it will be accepted", alertDismissed, "Oops", "Okay");
								}, 800);
			}
	
	
	});
    
    
    //This function is fired when the ordering process begins. It contains validation to ensure that the user enters a full and valid address (this function checks if commas are present, google addresses always have commas.)

	function startProcess() {
		var locationInput2 = document.getElementById('location-input').value;
		if (locationInput2 != "" && locationInput2.indexOf(',') !== -1) {
			$('#deliveryAddressNext').css('opacity', '1');
		} else {
			$('#deliveryAddressNext').css('opacity', '0.5');
		}
		$("#slide-up-location").css('display', 'block');
		$('#slide-up-location').removeClass('animated slideOutDown');
		$("#slide-up-location").addClass('animated slideInUp');
	}
	$('#back1').click(function() {
		back1();
	});
	$("#new-item").on("swiperight", function() {
		back1();
	});
	$('#back2').click(function() {
		back2();
	});
	$("#new-pickup").on("swiperight", function() {
		back2();
	});
    
    
    
    //Animate css plugin work around for slidein slide out transtions.

	function back1() {
		$("#slide-up-location").removeClass('animated slideInUp');
		$("#slide-up-location").removeClass('animated slideOutLeft');
		$("#slide-up-location").css('display', 'block');
		$("#slide-up-location").addClass('animated slideInLeft');
		$("#new-item").removeClass('animated slideInRight');
		$("#new-item").addClass('animated slideOutRight');
	}

	function back2() {
		$("#new-item").removeClass('animated slideOutLeft');
		$("#new-item").css('display', 'block');
		$("#new-item").addClass('animated slideInLeft');
		$("#new-pickup").removeClass('animated slideInRight');
		$("#new-pickup").addClass('animated slideOutRight');
	}
    
    
    //Validation function to ensure the user has entered correct delivery address details
    
	$('#deliveryAddressNext').on("click", function() {
		itemNext = false;
		deliveryNext = true;
		pickupNext = false;
		started = false;
		var checkIfEmpty2 = document.getElementById('location-input').value;
		if (checkIfEmpty2.indexOf(',') !== -1 && checkIfEmpty2 != "") {
			$('#slide-up-location').addClass('animated slideOutLeft');
			$('#new-item').addClass('animated slideInRight');
			$('#new-item').css('display', 'block');
			$('#new-item').removeClass('animated slideOutLeft');
			$("#new-item").removeClass('animated slideOutRight');
			//            $('#slide-up-location').css('display','none');
		} else {
			function dismissAddress() {}
			navigator.notification.alert("Addresses must be valid and precise so that your order reaches you efficiently.", dismissAddress, "Dropzy", "Okay");
		}

		selectedFormInput();
		if (work == true) {
            
            //If the user selects to deliver to their work location, the lat long data and address string are attatched to their order behind the scenes
            
			var userDeliveryLocation = document.getElementById('dropoff-location');
			var selectedLocation = document.getElementById('location-input');
			dropoffLocationLatContainer = document.getElementById('dropoff-lat');
			dropoffLocationLongContainer = document.getElementById('dropoff-long');
			dropoffLocationLatContainer.value = myWorkLat;
			dropoffLocationLongContainer.value = myWorkLong;
			//                  alert(dropoffLocationLatContainer.value);
			//                 alert(dropoffLocationLongContainer.value);
			userDeliveryLocation.value = selectedLocation.value;
			//Empty Variable assigned a definite value now once the user returns to the
			//order form screen.
			userSelectedAddress = userDeliveryLocation.value;
			$('#location').addClass('animated slideOutDown');
			setTimeout(function() {
				$("#location").css("display", "none");
			}, 300);
			setTimeout(function() {
				$("#location").removeClass("animated slideOutDown");
			}, 300);
			//saves either the selected location or current location and
			// applies it to the order
		} else if (home == true) {
            
             //If the user selects to deliver to their home location, the lat long data and address string are attatched to their order behind the scenes
			var userDeliveryLocation = document.getElementById('dropoff-location');
			var selectedLocation = document.getElementById('location-input');
			dropoffLocationLatContainer = document.getElementById('dropoff-lat');
			dropoffLocationLongContainer = document.getElementById('dropoff-long');
			dropoffLocationLatContainer.value = myHomeLat;
			dropoffLocationLongContainer.value = myHomeLong;
			//                  (dropoffLocationLatContainer.value);
			//                 alert(dropoffLocationLongContainer.value);
			userDeliveryLocation.value = selectedLocation.value;
			//Empty Variable assigned a definite value now once the user returns to the
			//order form screen.
			userSelectedAddress = userDeliveryLocation.value;
			$('#location').addClass('animated slideOutDown');
			setTimeout(function() {
				$("#location").css("display", "none");
			}, 300);
			setTimeout(function() {
				$("#location").removeClass("animated slideOutDown");
			}, 300);
			//saves either the selected location or current location and
			// applies it to the order
		} else {
			$('#location').addClass('animated slideOutDown');
			setTimeout(function() {
				$("#location").css("display", "none");
			}, 300);
			setTimeout(function() {
				$("#location").removeClass("animated slideOutDown");
			}, 300);
			//saves either the selected location or current location and
			// applies it to the order
			var userDeliveryLocation = document.getElementById('dropoff-location');
			var selectedLocation = document.getElementById('location-input');
			dropoffLocationLatContainer = document.getElementById('dropoff-lat');
			dropoffLocationLongContainer = document.getElementById('dropoff-long');
            
            //save lat long coords to order
			dropoffLocationLatContainer.value = currentAddressCoordsLat;
			dropoffLocationLongContainer.value = currentAddressCoordsLong;
			userDeliveryLocation.value = selectedLocation.value;
			//Empty Variable assigned a definite value now once the user returns to the
			//order form screen.
			userSelectedAddress = userDeliveryLocation.value;
		}
		var saveAddressContainer = document.getElementById('location-input').value;
		//prevent apostrophies
		var saveAddress = saveAddressContainer.replace("'", '');

		function onConfirm(buttonIndex) {
			if (buttonIndex === 1) {
				var emaill = localStorage.getItem('email');
				var lat = thisLat;
				var long = thisLong;
				var homeString = "home=" + saveAddress + "&email=" + emaill + "&lat=" + dropoffLocationLatContainer.value + "&long=" + dropoffLocationLongContainer.value + "&push=";
				$.ajax({
					type: "POST",
					url: "http://dropzy.site/homeupload.php",
					data: homeString,
					crossDomain: true,
					cache: false,
					beforeSend: function() {
						//                    alert('uploading');
					},
					success: function(data) {
						if (data == "success") {
							//                        alert("Updated");
						} else if (data == "error") {
							//                        alert("error");
						}
					}
				});
			} else if (buttonIndex === 2) {
				var emaill = localStorage.getItem('email');
				var lat = thisLat;
				var long = thisLong;
				var workString = "work=" + saveAddress + "&email=" + emaill + "&lat=" + dropoffLocationLatContainer.value + "&long=" + dropoffLocationLongContainer.value + "&push=";
				$.ajax({
					type: "POST",
					url: "http://dropzy.site/workupload.php",
					data: workString,
					crossDomain: true,
					cache: false,
					beforeSend: function() {
						//                    alert('uploading');
					},
					success: function(data) {
						if (data == "success") {
							//                        alert("Updated");
						} else if (data == "error") {
							//                        alert("error");
						}
					}
				});
			} else if (buttonIndex === 3) {}
		}
		if (workSave == "" || homeSave == "") {
			navigator.notification.confirm('Would you like to save the address used for future orders?', // message
				onConfirm, // callback to invoke with index of button pressed
				'Save this Address?', // title
				'Save as Home Address,Save as Work Address,Ignore' // buttonLabels
			);
		} else {}
		var formfield = document.getElementById('dropoff-location').value;
		if (formfield == "") {
			$("#dropoff-location").css("background", "url(images/homeicon.svg) no-repeat scroll 4.5vw 3.6vw");
			$("#dropoff-location").css("background-size", "4.5vw");
		} else if (formfield != "") {
			//                 
			//                    $("#dropoff-location").css("background", "url(images/homeiconn.png) no-repeat scroll 4.5vw 3.6vw");
			//                    $("#dropoff-location").css("background-size", "4.5vw");
		}
	});
	$('#itemDetailsNext').on("click", function() {
		itemNext = true;
		deliveryNext = false;
		pickupNext = false;
		start = false;
		var item5 = document.getElementById('itemname-area');
		var price5 = document.getElementById('itemprice-area');
		var details5 = document.getElementById('itemdetails-area');
		var correctInfoPrice = false;
		var correctInfoItem = false;
		var price6 = document.getElementById('itemprice-area').value;
		var priceRaw = price6.substring(2);
		var price5Value = parseFloat(priceRaw);
		if (price5Value < 40 || price5Value == 40) {
			correctInfoPrice = true;
		} else {
			function closeThisPopup() {
				$('#itemprice-area').val("");
			}
			correctInfoPrice = false;
		}
		//////Beware
		if (item5.value != "" && item5.value.length > 2) {
			correctInfoItem = true;
		} else {
			function closeThiss() {
				$('#itemname-area').val("");
			}
			correctItem = false;
		}
		if (correctInfoPrice == true && correctInfoItem == true) {
			$('#new-item').removeClass('animated slideInRight');
			$('#new-item').addClass('animated slideOutLeft');
			$("#new-pickup").removeClass('animated slideOutRight');
			$("#new-item").removeClass('animated slideInLeft');
			$('#slide-up-location').css('display', 'none');
			$('#slide-up-location').removeClass('animated slideOutLeft');
			$('#new-pickup').css('display', 'block');
			$('#new-pickup').addClass('animated slideInRight');
			
			$('#itemprice').val(price5.value);
			$('#itemnamefield').val(item5.value);
			$('#itemdetails').val(details5.value);
		} else if (correctInfoPrice == true && correctInfoItem == false) {
			function close2() {}
			navigator.notification.alert("You must be specific with the name of the product, to avoid issues with your order.", close2, "Oops", "Okay");
		} else if (correctInfoPrice == false && correctInfoItem == true) {
			function close3() {}
			navigator.notification.alert("Dropzy doesnt facillitate the delivery of items worth more than €40.00", close3, "Oops", "Okay");
		}
	});
	$('#itemdetails-area').on("click", function() {
		$('#itemdetails-area').val('');
	});
	$('#submit6').on("click", function() {
		itemNext = false;
		deliveryNext = false;
		pickupNext = true;
		started = false;
		var pickupValid = document.getElementById('new-pickup-field').value;
		if (pickupValid.indexOf(',') !== -1 && pickupValid != "") {
			finishedOrderInput = true;
			$('#slide-up-location').removeClass('animated slideInUp');
			var detailsfield = document.getElementById('itemdetails').value;
			if (detailsfield == "Is there any extra details you would like to specify?") {
				$('#itemdetails').val('No extra details specified');
			} else {}
			var pickupReview2 = document.getElementById('pickup-location-field').value;
			var pickupReview4 = document.getElementById('new-pickup-field').value;
			var formattedFields = pickupReview4.replace('&', 'and');
			var formattedPickupFields = formattedFields.replace("'", "");
			var locationReview2 = document.getElementById('dropoff-location').value;
			var locationReview4 = document.getElementById('location-input').value;
			var formattedFields2 = locationReview4.replace("'", "");
			var formattedFields3 = formattedFields2.replace("&", "and");
			
			$('#pickup-location-field').val(formattedPickupFields.substring(0,70));
			$('#dropoff-location').val(formattedFields3.substring(0,70));
			var itempricefloat = document.getElementById('itemprice').value;
			var priceRaw2 = itempricefloat;
			var priceWithoutSign2 = priceRaw2.substring(2);
			//    var price5Value2 = parseFloat(priceRaw2);
			var parsed = parseFloat(priceWithoutSign2);
		
				$('#addedFee').css('display', 'block');
				$('#finalfee').css('display', 'block');
	
			$('#new-pickup').css('display', 'none');
            $('#abandon').css('display', 'block');
			$('#new-item').css('display', 'none');
			$('#new-location').addClass('animated slideOutDown');
		} else {
			function close4() {
				$('#new-pickup-field').val('');
			}
			navigator.notification.alert("You must be specific with the pickup store and it's address. This avoids any potential directions issues for your deliverer. ", close4, "Oops", "Okay");
		}
		setTimeout(removeClasses, 1000);

		function removeClasses() {
			$("#slide-up-location").removeClass();
			$("#new-item").removeClass();
			$("#new-pickup").removeClass();
			$("#new-location").css('display', 'none');
		}
	});
});
var itemDetails;

function detailsExpand() {
	$("#itemnamefield").css("background", "url(images/icons3-02.png) no-repeat scroll 4.5vw 3.6vw");
	$("#itemnamefield").css("background-size", "4.5vw");
	$("#ico-itemname").css("top", "-52.4vh");
	$("#itemdetails").css("display", "block");
	$("#itemdetails").addClass("animated slideInDown");
	$("#itemdetails").css("opacity", "1");
}

function detailsCollapse() {
	$("#itemdetails").css("display", "none");
	$("#ico-itemname").css("top", "-44.6vh");
	var emptyItemnamefield = document.getElementById('itemnamefield').value;
	if (emptyItemnamefield == "" || emptyItemnamefield.length < 3) {
		$("#itemnamefield").css("background", "url(images/form-itemname.svg) no-repeat scroll 4.5vw 3.6vw");
		$("#itemnamefield").css("background-size", "4.5vw");
	} else {
		$("#itemnamefield").css("background", "url(images/icons3-02.png) no-repeat scroll 4.5vw 3.6vw");
		$("#itemnamefield").css("background-size", "4.5vw");
	}
}

function exitListview() {
	$("#shopbox2").css("display", "none");
}

function myOrdersLink() {
	$('#my-orders').css('display', 'block');
	$('#settings-container-box').removeClass('animated slideInLeft');
	$('#my-orders').removeClass('animated slideOutRight');
	$('#settings-container-box').addClass('animated slideOutLeft');
	$('#my-orders').addClass('animated slideInRight');
	$('#settings-details-username, #stars-image').css('display', 'none');
}

function ordersBack() {
	$('#settings-container-box').removeClass('animated slideInLeft');
	$('#settings-container-box').removeClass('animated slideOutLeft');
	$('#settings-container-box').addClass('animated slideInLeft');
	$('#my-orders').addClass('animated slideOutRight');
	//     $('#settings-container-box').removeClass('animated slideInRight');
	$('#my-orders').css('display', 'none');
	$('#settings-details-username, #stars-image').css('display', 'block');
}

function myDetailsLink() {
	$('#my-details').css('display', 'block');
	$('#settings-container-box').removeClass('animated slideInLeft');
	$('#my-details').removeClass('animated slideOutRight');
	$('#settings-container-box').addClass('animated slideOutLeft');
	$('#my-details').addClass('animated slideInRight');
	$('#settings-details-username, #stars-image').css('display', 'none');
}

function detailsBack() {
	$('#settings-container-box').removeClass('animated slideOutLeft');
	$('#settings-container-box').addClass('animated slideInLeft');
	$('#my-details').addClass('animated slideOutRight');
	//     $('#settings-container-box').removeClass('animated slideInRight');
	$('#my-details').css('display', 'none');
	$('#settings-details-username, #stars-image').css('display', 'block');
}

function myPaymentsLink() {
	$('#my-payments').css('display', 'block');
	$('#settings-container-box').removeClass('animated slideInLeft');
	$('#my-payments').removeClass('animated slideOutRight');
	$('#settings-container-box').addClass('animated slideOutLeft');
	$('#my-payments').addClass('animated slideInRight');
	$('#settings-details-username, #stars-image').css('display', 'none');
	$('#svg-payments').click(function() {
		function closeThis() {}
		navigator.notification.alert("Card payments aren't supported just yet. Check back soon!", closeThis, "Dropzy", "Okay");
	});
}

function paymentsBack() {
	$('#settings-container-box').removeClass('animated slideOutLeft');
	$('#settings-container-box').addClass('animated slideInLeft');
	$('#my-payments').addClass('animated slideOutRight');
	//     $('#settings-container-box').removeClass('animated slideInRight');
	$('#my-payments').css('display', 'none');
	$('#settings-details-username, #stars-image').css('display', 'block');
}

function myAddressLink() {
	$('#my-saved-addresses').css('display', 'block');
	$('#settings-container-box').removeClass('animated slideInLeft');
	$('#my-saved-addresses').removeClass('animated slideOutRight');
	$('#settings-container-box').addClass('animated slideOutLeft');
	$('#my-saved-addresses').addClass('animated slideInRight');
	$('#settings-details-username, #stars-image').css('display', 'none');
}

function addressesBack() {
	$('#settings-container-box').removeClass('animated slideOutLeft');
	$('#settings-container-box').addClass('animated slideInLeft');
	$('#my-saved-addresses').addClass('animated slideOutRight');
	//     $('#settings-container-box').removeClass('animated slideInRight');
	$('#my-saved-addresses').css('display', 'none');
	$('#settings-details-username, #stars-image').css('display', 'block');
}

function aboutLink() {
	$('#about').css('display', 'block');
	$('#settings-container-box').css('display', 'none');
	$('#settings-container-box').addClass('animated slideOutLeft');
	$('#about').removeClass('animated slideOutRight');
	$('#about').addClass('animated slideInRight');
	$('#settings-details-username, #stars-image').css('display', 'none');
}

function aboutBack() {
	$('#settings-container-box').css('display', 'block');
	$('#settings-container-box').removeClass('animated slideOutLeft');
	$('#settings-container-box').addClass('animated slideInLeft');
	$('#about').addClass('animated slideOutRight');
	//     $('#settings-container-box').removeClass('animated slideInRight');
	$('#about').css('display', 'none');
	$('#settings-details-username, #stars-image').css('display', 'block');
}


$('#email').focus(function() {

	$('#login-logo').css('top', '9.9vh');
});

function focusLogin() {
	$('#password').css('border', '0px solid rgba(255,255,255,0.7)');
	$('#email').css('border', '1px solid rgba(255,255,255,0.7)');
	$('#login-form').css('bottom', '33vh');
	$('#password').css('opacity', '0.3');
	$('#email').css('opacity', '1');
	$('#email').css('box-shadow', '10px 10px 53px -7px rgba(0,0,0,0.3)');
	$('#password').css('box-shadow', 'none');
	$('#email').css('background-color', 'rgba(44,58,84,0.6)');
}

function focusLogin2() {
	$('#password').css('border', '1px solid rgba(255,255,255,0.7)');
	$('#email').css('border', '0px solid rgba(255,255,255,0.7)');
	$('#password').css('box-shadow', '10px 10px 53px -7px rgba(0,0,0,0.3)');
	$('#email').css('box-shadow', 'none');
	$('#email').css('opacity', '0.3');
	$('#password').css('opacity', '1');
	$('#password').css('background-color', 'rgba(44,58,84,0.6)');
}

function selectedInput(el) {
	$(el).addClass("selectedInput");
	$('.reg-form').css("opacity", "0.5");
	$(el).css("opacity", "1");
}
$('.reg-form').focus(function() {
	$('#registerButton').css('display', 'none');
	$('#login-account').css('display', 'none');
	//    $(this).css('display','none');
});


$('.reg-form').blur(function() {
	$('#registerButton').css('display', 'block');
	$('#login-account').css('display', 'block');
});

function selectedOrderInput(el) {
	$(el).addClass("selectedOrderInput");
	$(el).addClass("shadowed");
	$('.inputs').css("opacity", "0.6");
	$(el).css("opacity", "1");
}

function selectedFormInput() {
	$('.inputs').css("opacity", "1");
}

///////////////////////////////////////// Deliver Page Map


//Global variables
var deliverMap;
var delivererPosition;
var requestMarker;
var jsonDeliveryLocationLong;
var jsonDeliveryLocationLat;
var jsonDeliveryAddress;
var jsonad;
var jsonDeliveryItem;
var userMarkerIcon;
var latdata2;
var latcoords;
var longcoords;
var mapVar;
var pos;
var iWindow;
var delivererLat;
var delivererLong;
var latParam;
var longParam;
var orderMarkers;
var backtomapBtn;



$(document).ready(function() {
	$(".ios-toggle").click(function() {
		if ($(this).is(":checked")) {
			$("#radios3").css('display', 'block');
			$('#radios3').addClass('animated slideInDown');
			$('#deliver-map').css("display", "none");
			$('#deliver-map').css("opacity", "1");
			$(".intro").css('display', 'none');
			$('#listview').css("display", "block");
			$('#listview').addClass('animated slideInLeft');
			$('#deliver-map').addClass('animated slideInRight');
            
            var listview = document.getElementById('listview');
            
            if(listview.innerHTML != "") {
                
                
                
                  $('#pulrefresh').css('display','block');
            } else {
                
                function exit() {
                    
                }
                
                	setTimeout(function() {
                        
                              navigator.notification.alert("There doesn't seem to be any available orders near you right now. Pull down to refresh the list at any time.", exit, "No Orders Nearby", "Okay");
                $('#pulrefresh').css('display','block');
				
			}, 800);
        
                 
            
            
            }
			setTimeout(slide, 500);

			function slide() {
				$('.view-order').css('opacity', '1');
				
			}
		} else {
			$('#deliver-map').css("opacity", "0.25");
			$("#radios3").css('display', 'none');
			$(".intro").css('display', 'block');
			$('#deliver-map').css("display", "none");
			$('#listview').css("display", "none");
		}
	});
});


function cancelOrderProcess() {
    
    
    function abandon(buttonIndex) {
        
        if(buttonIndex == 1 ) {
            $(".interval").show().delay(2000).fadeOut();
	window.location.hash += "#home";
	location.reload();
        } else if(buttonIndex == 2) {
            
        }
        
    }
    	navigator.notification.confirm('Are you sure you want to abandon this order? You cannot undo this action.', // message
		abandon, // callback to invoke with index of button pressed
		'Cancel Order', // title
		'Cancel Order, Continue Order' // buttonLabels
	);
    
}
function deny() {
	$(".interval").show().delay(2000).fadeOut();
	window.location.hash += "#deliver-page";
	location.reload();
}
$(document).ready(function() {
	$('#rad3').click(function() {
		$('#deliver-map').css('display', 'none');
		$('#listview').css('display', 'block');
		$('#deliver-container').css('display', 'block');
		$("#label3").css('color', 'white');
		$("#label4").css('color', '#a399fd');
		$('#radios3').css('opacity', '1');
	});
	$('#rad4').click(function() {
		$('#radios3').css('opacity', '0.8');
		$('#deliver-map').css('display', 'block');
		$('#listview').css('display', 'none');
		$("#label3").css('color', '#a399fd');
		$("#label4").css('color', 'white');
	});
});
///////////////////////////////////////////////////////////////////Order-details page map
//////////This function pulls the URL values that have been carried over from the previous page
//where the delivery request was accepted. These unqiue values are then stored and can be used throughout the delivery when needed.
////Settings functions
////Settings functions
$(document).ready(function() {
	$("#extra-options").click(function() {
		$("#cancel-delivery").css('display', 'block');
		$("#cancel-call").css('display', 'block');
		$(".in-delivery-options").css("display", "block");
		$("#call-number").addClass('animated slideInUp');
		$("#cancel-call").addClass('animated slideInUp');
		$("#cancel-delivery").addClass('animated slideInUp');
		$("#boxx2").css('display', 'block');
		$(".footer-navbar").css('display', 'none');
	});
	$("#cancel-call").click(function() {
		$(".footer-navbar").css('display', 'block');
		$("#boxx2").css('display', 'none');
		$(".in-delivery-options").css("display", "none");
	});
	$("#cancel-message").click(function() {
		$(".footer-navbar").css('display', 'block');
		$("#boxx2").css('display', 'none');
		$(".in-delivery-message-options").css("display", "none");
	});
	$("#phone-order").click(function() {
		$("#call-number").addClass('animated slideInUp');
		$(".in-delivery-message-options").css("display", "block");
		$("#boxx2").css('display', 'block');
		$(".footer-navbar").css('display', 'none');
		$("#whatsapp-number").addClass('animated slideInUp');
		$("#sms-number").addClass('animated slideInUp');
		$("#cancel-message").addClass('animated slideInUp');
	});
});
//SLIDER ONBOARDING
class Slider {
	constructor(el) {
		this.el = el
		this.container = this.el.querySelector('.slides-container')
		this.slides = this.container.querySelectorAll('.slide')
		this.parallaxes = this.container.querySelectorAll('.parallax')
		this.current = 0;
		this.currentPos
		this.mouseOffset
		this.moving = false
		this.container.style.width = this.slides.length * 100 + '%'
		this.slides[0].classList.add('current')
		let startPos, lastTouchX
		const dragStart = (e) => {
				e.stopPropagation()
				if (e.touches) lastTouchX = e.touches[0].clientX
				startPos = e.clientX || lastTouchX
				this.mouseOffset = 0
				this.currentPos = this.container.getBoundingClientRect().left;
				this.moving = true;
				requestAnimationFrame(this.move.bind(this))
			},
			dragEnd = (e) => {
				if (this.moving) {
					const moveX = e.clientX || lastTouchX
					if (moveX < startPos - 100) this.next()
					else if (moveX > startPos + 100) this.prev()
					else this.goTo(this.current)
					this.moving = false
				}
			},
			dragMove = (e) => {
				if (e.touches) lastTouchX = e.touches[0].clientX
				const moveX = e.clientX || lastTouchX
				this.mouseOffset = moveX - startPos
			}
		this.container.addEventListener('mousedown', dragStart)
		this.container.addEventListener('touchstart', dragStart)
		window.addEventListener('mouseup', dragEnd)
		this.container.addEventListener('touchend', dragEnd)
		window.addEventListener('mousemove', dragMove)
		this.container.addEventListener('touchmove', dragMove)
		window.addEventListener('keydown', (e) => {
			e = e || window.event;
			if (e.keyCode == '39') { // right arrow
				this.next()
			} else if (e.keyCode == '37') { // left arrow
				this.prev()
			}
		})
	}
	move() {
		if (this.moving) {
			this.container.style.transform = 'translate3d(' + (this.currentPos + this.mouseOffset) + 'px, 0, 0)'
			this.container.classList.add('moving')
			const slideWidth = this.slides[0].offsetWidth;
			this.slides.forEach(($_slide, i) => {
				const coef = 1 - Math.abs($_slide.getBoundingClientRect().left / slideWidth)
				$_slide.style.opacity = .5 + (coef * .5)
				$_slide.style.transform = 'scale(' + (.9 + coef * .1) + ')'
			})
			this.parallaxes.forEach(($_item, i) => {
				const coef = this.slides[i].getBoundingClientRect().left / slideWidth
				$_item.style.opacity = 1 - Math.abs(coef * 1.8)
				$_item.style.transform = 'translate3d(' + (-coef * 85) + '%, 0, 0)'
			})
			requestAnimationFrame(this.move.bind(this))
		}
	}
	goTo(i) {
		if (i >= 0 && i < this.slides.length) this.current = i
		this.container.classList.remove('moving')
		this.container.style.transform = 'translate3d(' + this.current * -100 / this.slides.length + '%, 0, 0)'
		this.slides.forEach(($_slide, i) => {
			$_slide.classList.remove('current')
			$_slide.removeAttribute('style')
		})
		this.slides[this.current].classList.add('current')
		this.slides[this.current].removeAttribute('style')
		this.parallaxes.forEach(($_item, i) => {
			$_item.removeAttribute('style')
			$_item.style.transform = 'translate3d(' + (i <= this.current ? 85 : -85) + '%, 0, 0)'
		})
		this.slides[this.current].querySelector('.parallax').removeAttribute('style')
	}
	next() {
		this.goTo(this.current + 1)
	}
	prev() {
		this.goTo(this.current - 1)
	}
}
const $sliders = document.querySelectorAll('.slider')
const sliders = []
$sliders.forEach(($slider) => {
	sliders.push(new Slider($slider))
})

function euroSign() {
	$("#itemprice").css("background", "url(images/icons3-03.png) no-repeat scroll 4.5vw 3.6vw");
	$("#itemprice").css("background-size", "4.5vw");
	$('#itemprice').attr('placeholder', '0.00');
	$('#eurosymbol').css('display', 'block');
	$("#eurosymbol").css("top", "-44.86vh");
	$('#added-info').css("display", "block");
	$('#added-info').addClass("animated bounceInRight");
}

function euroSignClose() {
	$('#itemprice').attr('placeholder', 'How much does it cost?');
	$('#added-info').css("display", "none");
	var priceContainer = document.getElementById('itemprice').value;
	if (priceContainer == "") {
		$('#eurosymbol').css('display', 'none');
	}
	var priceWithoutSign = priceContainer.substring(2);
	var parsedStringPrice = parseFloat(priceWithoutSign);
	if (parsedStringPrice > 40) {
		function closePopup() {
			$('#itemprice').val("");
		}
		navigator.notification.alert("Dropzy doesnt facillitate the delivery of items worth more than €40.00", closePopup, "Oops", "Okay");
	}
	if (priceContainer == "") {
		$('#eurosymbol').css('display', 'none');
	}
}
var bounds = new google.maps.LatLngBounds();
bounds.extend(delivererPosition.getPosition());
deliverMap.fitBounds(bounds);
bounds.extend(dublin.getPosition());
deliverMap.fitBounds(bounds);











