console.log("hey");

var results = [];

var queryString = function () {
  // This function is anonymous, is executed immediately and 
  // the return value is assigned to queryString!
  var query_string = {};
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
        // If first entry with this name
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = decodeURIComponent(pair[1]);
        // If second entry with this name
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
      query_string[pair[0]] = arr;
        // If third or later entry with this name
    } else {
      query_string[pair[0]].push(decodeURIComponent(pair[1]));
    }
  } 
  return query_string;
}();

function pageInit(params) {
	var body = document.getElementsByTagName('body')[0];

	if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
		body.className = "mobile-device";
	}
	else {
		body.className = "non-mobile-device";
	}

	localStorage.savedItems = localStorage.savedItems || JSON.stringify([]);

	var savedItems = JSON.parse(localStorage.savedItems);
	var header = document.createElement("div");
	header.className = "saved-items-header";
	header.innerHTML = "Saved Items: <span id='saved-items-counter'>" + savedItems.length;
	if (window.location.href.indexOf("my-saved-") == -1) {
		header.innerHTML += "<a href='my-saved-properties.html'>View Saved Items</a>";
	}
	header.innerHTML += "</span>";
	body.insertBefore(header, body.firstChild);

	console.log(localStorage);
}

//Data Loading functions

function processSearchResults(params) {
	var results = params.results;
	var htmlString = "";
	var imageSrc = null;
	var savedItems = JSON.parse(localStorage.savedItems);
	console.log(results);
	if (params.format == "search-results") {
		var saleOrLetting = (queryString["status"] == 'S') ? "Sale": "Rental";
		var resultPluralString = (results.length == 1) ? "": "s";
		htmlString += "<p id='search-results-summary'>Your search for <b>" + saleOrLetting + " Properties</b> returned <b>" + results.length + "</b> result" + resultPluralString + ".</p>";
	}
	else if (params.format == "saved-results") {
		var resultPluralString = (savedItems.length == 1) ? "Property": "Properties";
		htmlString += "<p id='search-results-summary'>You currently have <b>" + savedItems.length + " Saved " + resultPluralString + "</b>.</p>";

	}
	for (var a=0; a < results.length; a++) {
		var propertyIsSaved = savedItems.indexOf(results[a]["Reference"]) > -1;
		//imageSrc = (results[a]["Image"] == '') ? '#': results[a]["Image"];
		imageSrc = (a % 2 == 0) ? "http://www2.housescape.org.uk/opp8/images_p/OPP8000656.jpg" : "http://www2.housescape.org.uk/opp8/images_p/OPP8000658.jpg";
		htmlString += "<div class='search-result-item'>";

		if (params.format == "search-results" || params.format == "saved-results") {
			htmlString += "<span class='search-result-detail address'>" + results[a]["Address"] + " - " + results[a]["Town"] + "</span>";
			if (imageSrc != '') {
				htmlString += "<span class='img-container'><img class='search-result-detail image' src='" + imageSrc +"' /></span>";
			}
			if (results[a]["Bullet 1"] != '') {
				htmlString += "<ul class='search-result-detail bullets'>";
				htmlString += "<li>" + results[a]["Bullet 1"] + "</li>";
				if (results[a]["Bullet 2"] != '') {
					htmlString += "<li>" + results[a]["Bullet 2"] + "</li>";
				}
				if (results[a]["Bullet 3"] != '') {
					htmlString += "<li>" + results[a]["Bullet 3"] + "</li>";
				}
				if (results[a]["Bullet 4"] != '') {
					htmlString += "<li>" + results[a]["Bullet 4"] + "</li>";
				}
				if (results[a]["Bullet 5"] != '') {
					htmlString += "<li>" + results[a]["Bullet 5"] + "</li>";
				}
				if (results[a]["Bullet 6"] != '') {
					htmlString += "<li>" + results[a]["Bullet 6"] + "</li>";
				}
				htmlString += "</ul>";
			}
			else if (results[a]["Description"] != '') {
				htmlString += "<p class='description'>" + results[a]["Description"] + "</p>";
			}
			htmlString += "<span class='search-result-detail price'><label>Price: </label>&#163;" + results[a]["Price"] + " " + results[a]["Period/Offertype"] + "</span>";
			htmlString += "<span class='search-result-detail property-type'>"+results[a]["Property Type"]+"</span>";
			htmlString += "<a class='view-detail-button main-listing-button' href='property-search-result.html?reference="+results[a]["Reference"]+"'>View Detail</a>";

			if (params.format == "saved-results") {
				htmlString += "<a class='remove-saved-property-button main-listing-button' onclick='removeSavedPropertyClicked(\""+results[a]["Reference"]+"\")'>Remove from my Saved Properties</a>";
			} else if (params.format == "search-results" && !propertyIsSaved) {
				htmlString += "<a class='property-save-button property-save-button-small main-listing-button reference-"+results[a]["Reference"]+"' onclick='saveProperty(\""+results[a]["Reference"]+"\", \"search-results\")'><span class='icon'>&#43;</span>Save for later</a>";
			} else if (params.format == "search-results" && propertyIsSaved) {
				htmlString += "<a class='property-save-button property-save-button-small main-listing-button'><span class='icon'>☑</span>Property Saved</a>";
			}
		}
		else if (params.format == "search-result") {
			var propertyIsSaved = savedItems.indexOf(results[a]["Reference"]) > -1;
			var images = [
				"http://www2.housescape.org.uk/opp8/images_p/OPP8000656.jpg"
				, "http://www2.housescape.org.uk/opp8/images_p/OPP8000658.jpg"
				, "http://www2.housescape.org.uk/opp8/images_p/OPP8000656.jpg"];
			var imagesLength = (images.length <= 5) ? images.length: 5;

			htmlString += "<span class='search-result-detail address'>" + results[a]["Address"] + " - " + results[a]["Town"] + "</span>";
			if (imageSrc != '') {
				htmlString += "<span class='img-container'><img class='search-result-detail image' src='" + imageSrc +"' /></span>";

				htmlString += "<span class='alternative-img-container'>";
				for (var b = 0; b < imagesLength; b++) {
					htmlString += "<img onclick='switchMainImgViewing(this)' class='alternative-img' src='" + images[b] + "' />";
				}
				htmlString += "</span>";
			}

			htmlString += "<span class='search-result-summary'><span class='search-result-detail price'><label>Price: </label>&#163;" + results[a]["Price"] + " " + results[a]["Period/Offertype"] + "</span>";
			htmlString += "<span class='search-result-detail property-type'>"+results[a]["Property Type"]+"</span></span>";

			if (results[a]["Bullet 1"] != '') {
				htmlString += "<ul class='search-result-detail bullets'>";
				htmlString += "<li>" + results[a]["Bullet 1"] + "</li>";
				if (results[a]["Bullet 2"] != '') {
					htmlString += "<li>" + results[a]["Bullet 2"] + "</li>";
				}
				if (results[a]["Bullet 3"] != '') {
					htmlString += "<li>" + results[a]["Bullet 3"] + "</li>";
				}
				if (results[a]["Bullet 4"] != '') {
					htmlString += "<li>" + results[a]["Bullet 4"] + "</li>";
				}
				if (results[a]["Bullet 5"] != '') {
					htmlString += "<li>" + results[a]["Bullet 5"] + "</li>";
				}
				if (results[a]["Bullet 6"] != '') {
					htmlString += "<li>" + results[a]["Bullet 6"] + "</li>";
				}
				htmlString += "</ul>";
			}

			if (results[a]["Description"] != '') {
				htmlString += "<div class='description'><p>" + results[a]["Description"] + "</p></div>";
			}

			htmlString += "<span class='item-interaction-container'>";
				htmlString += "<a class='property-callback-button share-button' onclick='callbackClicked(\""+results[a]["Reference"]+"\", \""+results[a]["No of Bedrooms"]+"\", \""+results[a]["Property Type"]+"\", \""+results[a]["Address"]+"\")'><span class='icon telephone-icon'>&#9742;</span>Get a Call-back</a>";
				if (!propertyIsSaved) {
					htmlString += "<a class='property-save-button share-button' onclick='saveProperty(\""+results[a]["Reference"]+"\", \"search-result\")'><span class='icon'>&#43;</span>Save for later</a>";
				} else {
					htmlString += "<a class='property-save-button share-button'><span class='icon'>&#9745;</span>Property Saved</a>";
				}
			htmlString += "</span>";

			htmlString += "<div class='bedrooms-number'><h4>Bedrooms</h4><p>" + results[a]["No of Bedrooms"] + "</p></div>";
			htmlString += "<div class='bathrooms-number'><h4>Bathrooms</h4><p>" + results[a]["No of Bathrooms"] + "</p></div>";
			if (results[a]["No of Receptions"] != '0') {
				htmlString += "<div class='receptions-number'><h4>Receptions</h4><p>" + results[a]["No of Receptions"] + "</p></div>";
			}

			var fbShareBedroomNote = results[a]["No of Bedrooms"] + " bedroom";
			var otherShareBedroomNote = results[a]["No of Bedrooms"] + " bedroom";
			var fbShareSaleOrLettingNote = (queryString["status"] == 'S') ? "for+sale": "to+rent";
			var otherShareSaleOrLettingNote = (queryString["status"] == 'S') ? "for sale": "to rent";

			htmlString += "<span class='social-share-container'>";
			if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
    			// Take the user to a different screen here.
				htmlString += "<a class='whatsapp-share-button share-button' href='whatsapp://send?text=Check out this great "+otherShareBedroomNote+" property I found "+otherShareSaleOrLettingNote+" on openhouse.co.uk: http://www.openhouse.co.uk/property-search-result.html?Reference=DEM1' data-action='share/whatsapp/share'>Share this property on WhatsApp</a>";
			}
			htmlString += "<a class='facebook-share-button share-button' href='https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fwww.mynyte.co.uk%2Fstaging%2Fsneak-preview%2Fdilly-test%2Fproperty-search-result.html%3Freference%3DDEM1&amp;title="+fbShareBedroomNote+"+property+"+fbShareSaleOrLettingNote+"+in+Bedford+-+OpenHouseBedford.co.uk&amp;image=https://www.mynyte.co.uk/staging/sneak-preview/img/n-icon-android-inactive.png' target='_blank'>Share this property on Facebook</a>";
			htmlString += "<a class='twitter-share-button share-button' href='https://twitter.com/share?url=https%3A%2F%2Fwww.mynyte.co.uk%2Fstaging%2Fsneak-preview%2Fdilly-test%2Fproperty-search-result.html%3Freference%3DDEM1' target='_blank'>Share this property on Twitter</a>";
			htmlString += "<a class='email-share-button share-button' href='mailto:?subject="+otherShareBedroomNote+" property "+otherShareSaleOrLettingNote+" in Bedford - openhousebedford.co.uk&amp;body=Check out this great "+otherShareBedroomNote+" property I found "+otherShareSaleOrLettingNote+" on openhouse.co.uk: http://www.openhouse.co.uk/property-search-result.html?Reference=DEM1' target='_top'>Share this property in an e-mail</a>";
			htmlString += "</span>";
		}
		else if (params.format == "saved-results") {

		}

		htmlString += "</div>";
	}
	document.getElementById("search-results-container").innerHTML = htmlString;
}

function searchThroughResultsReceived(params) {
	// THIS IS A FUNCTION WHICH HAS BEEN CREATED SO WE CAN SEARCH THROUGH DATA READ FROM A FILE
	var results = params.results;
	var status = null, propertyType = null, bedroomsMin = null, priceMin = null, priceMax = null, reference = null, queryStringFormed = null;

	if (params.format == "search-results") {
		status = "S";
		propertyType = "any";
		bedroomsMin = "noMin";
		priceMin = "noMin";
		priceMax = "noMax";
		queryStringFormed = queryString;
		showingSavedResults = false;

		if (queryStringFormed["status"]) {
			status = queryStringFormed["status"];
		}
		if (queryStringFormed["propertyType"]) {
			propertyType = queryStringFormed["propertyType"];
		}
		if (queryStringFormed["bedroomsMin"]) {
			bedroomsMin = queryStringFormed["bedroomsMin"];
		}
		if (queryStringFormed["priceMin"]) {
			priceMin = queryStringFormed["priceMin"];
		}
		if (queryStringFormed["priceMax"]) {
			priceMax = queryStringFormed["priceMax"];
		}
	}
	else if (params.format == "search-result") {
		reference = queryString["reference"];
	}
	else if (params.format == "saved-results") {
		referenceString = JSON.parse(localStorage.savedItems);
	}

	var filteredResults = [];

	for (var a = 0; a < results.length; a++) {
		var addResult = true;

		if (params.format == "search-results") {
			if (results[a]["Status"] != status) {
				addResult = false;
			}
			if (parseInt(results[a]["No of Bedrooms"]) < parseInt(bedroomsMin) && bedroomsMin != "noMin") {
				addResult = false;
			}
			if (parseInt(results[a]["Price"]) < parseInt(priceMin) && priceMin != "noMin") {
				addResult = false;
			}
			if (parseInt(results[a]["Price"]) > parseInt(priceMax) && priceMax != "noMax") {
				addResult = false;
			}
			if (results[a]["Property Type"] != propertyType && propertyType != "any") {
				addResult = false;
			}
		}
		else if (params.format == "search-result" && results[a]["Reference"] != reference) {
			addResult = false;
		}
		else if (params.format == "saved-results" && referenceString.indexOf(results[a]["Reference"]) == -1) {
			addResult = false;
		}

		if (addResult) {
			filteredResults.push(results[a]);
		}

		if (a == results.length - 1) {
			processSearchResults({
				"results": filteredResults
				, "format": params.format
			});
		}
	}

}

function getResultsDataFromTextFile(params) {
	var file = params.data
	var lines = file.split('\n');
    for(var line = 0; line < lines.length; line++){
      var properties = lines[line].split('|');

      if (properties[0] !== undefined) {
      	results.push({
      		"Reference": properties[0]
      		, "Status": properties[1]
      		, "Price": properties[3]
      		, "Period/Offertype": properties[4]
      		, "Town": properties[6]
      		, "Address": properties[8]
      		, "Property Type": properties[14]
      		, "Image": properties[23]
      		, "Bullet 1": properties[20]
      		, "Bullet 2": properties[21]
      		, "Bullet 3": properties[22]
      		, "Bullet 4": properties[129]
      		, "Bullet 5": properties[130]
      		, "Description": properties[25]
      		, "Furnished": properties[16]
      		, "No of Bedrooms": properties[17]
      		, "No of Bathrooms": properties[18]
      		, "No of Receptions": properties[19]
      	});
      }

      if (line == lines.length - 1) {
      	searchThroughResultsReceived({"results": results, "format": params.format});
      }
    }
}

function readResultsFromTextFile(params)
{
	var file = params.fileName;
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;

                getResultsDataFromTextFile({"data": allText, "format": params.format});
            }
        }
    }
    rawFile.send(null);
}

function createPriceOptionsForProperty() {
	var saleLettingToggler = document.getElementsByClassName('sale-letting-changer')[0];
	var saleLettingOptionSelected = saleLettingToggler.value;
	var priceSelectToChange = document.getElementsByClassName('form-price-minimum')[0].getElementsByTagName('select')[0];
	var priceSelectToChange2 = document.getElementsByClassName('form-price-maximum')[0].getElementsByTagName('select')[0];
	var salePriceOptionsMinHtml = "<option value='noMin'>Not Set</option><option value='100000'>100000</option><option value='150000'>150000</option>";
	var salePriceOptionsMaxHtml = "<option value='noMax'>Not Set</option><option value='100000'>100000</option><option value='150000'>150000</option>";
	var rentPriceOptionsMinHtml = "<option value='noMin'>Not Set</option><option value='200'>200</option><option value='300'>300</option>";
	var rentPriceOptionsMaxHtml = "<option value='noMax'>Not Set</option><option value='200'>200</option><option value='300'>300</option>";

	while (priceSelectToChange.firstChild) {
	    priceSelectToChange.removeChild(priceSelectToChange.firstChild);
	}
	priceSelectToChange.innerHTML = (saleLettingOptionSelected == 'S') ? salePriceOptionsMinHtml: rentPriceOptionsMinHtml;

	while (priceSelectToChange2.firstChild) {
	    priceSelectToChange2.removeChild(priceSelectToChange2.firstChild);
	}
	priceSelectToChange2.innerHTML = (saleLettingOptionSelected == 'S') ? salePriceOptionsMaxHtml: rentPriceOptionsMaxHtml;
}


//User Interaction Functions

function switchMainImgViewing(params) {
	console.log(params.src);
	document.getElementsByClassName('search-result-detail image')[0].src = params.src;
}

function saveProperty(ref, format) {
	var savedItems = JSON.parse(localStorage.savedItems);
	if (savedItems.indexOf(ref) == -1) {
		savedItems.push(ref);
		localStorage.savedItems = JSON.stringify(savedItems);
		document.getElementById('saved-items-counter').innerHTML = savedItems.length;
		if (format == 'search-result') {
			document.getElementsByClassName("property-save-button")[0].innerHTML = "<span class='icon'>&#9745;</span>Property Saved";
		}
		else if (format == 'search-results') {
			document.getElementsByClassName("reference-"+ref)[0].innerHTML = "<span class='icon'>&#9745;</span>Property Saved";
		}
	}
	console.log(localStorage.savedItems);
}

function removeSavedProperty(ref) {
	var savedItems = JSON.parse(localStorage.savedItems);
	if (savedItems.indexOf(ref) != -1) {
		var savedItemsIndex = savedItems.indexOf(ref);
		savedItems.splice(savedItems.indexOf(ref), 1);
		localStorage.savedItems = JSON.stringify(savedItems);
		document.getElementById('saved-items-counter').innerHTML = savedItems.length;
		var elemToDelete = document.getElementsByClassName("search-result-item")[savedItemsIndex];
		elemToDelete.parentNode.removeChild(elemToDelete);
		closeModal();
	}
	console.log(localStorage.savedItems);
}

function showPopup() {
	var doc = document.documentElement;
	var top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
	console.log(window.pageYOffset, doc.scrollTop, doc.clientTop);

	document.getElementsByTagName('body')[0].style.top = -top + "px";
	document.getElementsByTagName('body')[0].className += ' oh-modal--opened';
	document.getElementsByClassName('openhouse-popup-cover')[0].className = "openhouse-popup-cover openhouse-popup-open";
}

function removeSavedPropertyClicked(ref) {

	function createCallbackPopup() {

		var popUpHtml = "";
		popUpHtml += "<div class='openhouse-popup-cover'>";
			popUpHtml += "<div class='openhouse-popup'>";
		    
		    	popUpHtml += "<div class='openhouse-pop-inner'>";
		      		popUpHtml += "<div class='oh-popup-header'>Remove Saved Item <span class='oh-popup-close' onclick='closeModal()'>Cancel</span></div>";
		      		popUpHtml += "<div class='oh-popup-body' style='max-height: calc(496.7px);'>";
		      			popUpHtml += "<form><span>Are you sure you want to delete this item?</br></span>";
		        		popUpHtml += "<button class='start-chat' onclick='removeSavedProperty(\""+ref+"\")'>Remove Saved Item</button></form>";
		        
		      		popUpHtml += "</div>";
		      
		    	popUpHtml += "</div>";
		  	popUpHtml += "</div>";
		popUpHtml += "</div>";

		document.getElementsByTagName('body')[0].innerHTML += popUpHtml;

		showPopup();
	}

	if (document.getElementsByClassName('openhouse-popup-cover')[0] !== undefined) {
		showPopup();
	} else {
		createCallbackPopup();
	}
}

function callbackClicked(reference, bedrooms, propertyType, address) {
	function createCallbackPopup() {

		var popUpHtml = "";
		popUpHtml += "<div class='openhouse-popup-cover'>";
			popUpHtml += "<div class='openhouse-popup'>";
		    
		    	popUpHtml += "<div class='openhouse-pop-inner'>";
		      		popUpHtml += "<div class='oh-popup-header'>Please enter your Details to get a call-back about this property<span class='oh-popup-close' onclick='closeModal()'>Cancel</span></div>";
		      		popUpHtml += "<div class='oh-popup-body' style='max-height: calc(496.7px);'>";
		      			popUpHtml += "<p class='callback-summary'>Requesting a call-back for the following property: </br></br>" + bedrooms + " bedroom " + propertyType + " property. Address: " + address + ". (Reference: " + reference + ")</p>";
		        		popUpHtml += "<p id='form-name-error-note' class='modal-form-error'>Please enter a valid name.</p>";
		        		popUpHtml += "<p id='form-number-error-note' class='modal-form-error'>Please enter a valid contact number.</p>";
		        		popUpHtml += "<form action='javascript:submitCallbackRequest(\""+reference+"\", \""+bedrooms+"\", \""+propertyType+"\", \""+address+"\")'>";
		          			popUpHtml += "<input type='text' placeholder='Your Name' id='form-name'>";
		          			popUpHtml += "<input type='text' placeholder='Your Phone Number' id='form-number'>";
		          
		          			popUpHtml += "<button class='start-chat' type='submit'>Request Call-back</button>";
		        		popUpHtml += "</form>";
		        
		      		popUpHtml += "</div>";
		      
		    	popUpHtml += "</div>";
		  	popUpHtml += "</div>";
		popUpHtml += "</div>";

		document.getElementsByTagName('body')[0].innerHTML += popUpHtml;

		showPopup();
	}

	if (document.getElementsByClassName('openhouse-popup-cover')[0] !== undefined) {
		showPopup();
	} else {
		createCallbackPopup();
	}
}

function submitCallbackRequest(reference, bedrooms, propertyType, address) {
	var letterRegex = /^[a-zA-Z]+$/;
	var numberRegex = /^[0-9]+$/;
	var name = document.getElementById('form-name').value;
	var number = document.getElementById('form-number').value;
	var errorCount = 0;

	console.log(name, number.length);
	if (name == '' || !letterRegex.test(name)) {
		if ((' ' + document.getElementById('form-name-error-note').className + ' ').indexOf(' show ') == -1) {
			document.getElementById('form-name-error-note').className += " show";
			document.getElementById('form-name').className += " error";
		}
		errorCount += 1;
	}
	else {
		document.getElementById('form-name-error-note').classList.remove("show");
		document.getElementById('form-name').classList.remove("error");
	}
	if (number == '' || !numberRegex.test(number) || number.length > 15) {
		if ((' ' + document.getElementById('form-number-error-note').className + ' ').indexOf(' show ') == -1) {
			document.getElementById('form-number-error-note').className += " show";
			document.getElementById('form-number').className += " error";
		}
		errorCount += 1;
	}
	else {
		document.getElementById('form-number-error-note').classList.remove("show");
		document.getElementById('form-number').classList.remove("error");
	}

	if (errorCount > 0) {
		return false;
	}
	else {
		function loadXMLDoc() {
		    var xmlhttp = new XMLHttpRequest();

		    xmlhttp.onreadystatechange = function() {
		        if (xmlhttp.readyState == XMLHttpRequest.DONE ) {
		           if (xmlhttp.status == 200) {
		               //document.getElementById("myDiv").innerHTML = xmlhttp.responseText;
		               console.log(xmlhttp.responseText);
		               if (xmlhttp.responseText == '\"Success\"') {
		               		document.getElementsByClassName('oh-popup-body')[0].innerHTML = "<p class='callback-summary'>Thank you. Your callback request has been received.</p>";
		               }
		               else {
		               		document.getElementsByClassName('oh-popup-body')[0].innerHTML = "<p class='callback-summary'>ERROR: There was an error submitting your request, please try again later.</p>";
		               }

		               window.setTimeout(function () {
	               			closeModal();
	               		}, 2500);
		           }
		           else if (xmlhttp.status == 400) {
		             	console.log('There was an error 400');
		           }
		           else {
		               console.log('something else other than 200 was returned');
		           }
		        }
		    };

		    xmlhttp.open("POST", "request-callback.php?name="+name+"&number="+number+"&reference="+reference+"&bedrooms="+bedrooms+"&propertyType="+propertyType+"&address="+address, true);
		    xmlhttp.send();
		}

		loadXMLDoc();
	}

	console.log("hey");
}

function closeModal() {
	var bodyOffset = document.getElementsByTagName('body')[0].style.top.replace("px", "");
	bodyOffset = bodyOffset.replace("-", "");

	document.getElementsByTagName('body')[0].style.top = "0";
	document.getElementsByClassName('openhouse-popup-cover')[0].className = "openhouse-popup-cover";
	document.getElementsByTagName('body')[0].classList.remove('oh-modal--opened');
	window.scroll(0, bodyOffset);
}

if (window.location.href.indexOf("-search.") > 0) {
	pageInit({});
	createPriceOptionsForProperty();
	var saleLettingToggler = document.getElementsByClassName('sale-letting-changer')[0];
	if (saleLettingToggler) {
		saleLettingToggler.onchange = function () {
			createPriceOptionsForProperty();
		};
	}

	document.getElementById('list-search-submit').onclick = function (e) {
		e.preventDefault();

		var saleOrLetting = document.getElementById('sale-or-letting').value;
		var propertyType = document.getElementById('property-type').value;
		var bedroomsMin = document.getElementById('bedrooms-min').value;
		var priceMin = document.getElementById('price-min').value;
		var priceMax = document.getElementById('price-max').value;

		console.log(saleOrLetting, propertyType, bedroomsMin, priceMin, priceMax);
		window.location.href = "index.html?status=" + saleOrLetting + "&propertyType=" + propertyType + "&priceMin=" + priceMin + "&priceMax=" + priceMax + "&bedroomsMin=" + bedroomsMin;
	}
}
else if (window.location.href.indexOf("index.") > 0) {
	pageInit({});

	readResultsFromTextFile({"fileName": "data.file", "format": "search-results"});
}
else if (window.location.href.indexOf("-search-result.") > 0) {
	pageInit({});

	readResultsFromTextFile({"fileName": "data.file", "format": "search-result"});
}
else if (window.location.href.indexOf("my-saved-") > 0) {
	pageInit({});

	readResultsFromTextFile({"fileName": "data.file", "format": "saved-results"});
}