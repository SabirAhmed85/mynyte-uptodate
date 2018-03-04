(function(){
	//Global Reused Functions

   // DOM Ready - do your stuff
   MynyteApi = function () {
   		var disableScroll = false;
//SHOULD ACTUALLY CHECK THE DOMAIN TO SEE IF THEY ARE OUR DEV TEAM ETC
var localDevAllowed = true;
var windowOuterHeight = $(window).height();
var scripts = document.getElementsByTagName("script");
var currentScript = scripts[scripts.length - 1].src;
var current_environment = (typeof(current_mynyte_env) !== 'undefined' && localDevAllowed == true) ? current_mynyte_env: 'live';
var current_db_environment = (typeof(mynyte_db_environment) !== 'undefined' && localDevAllowed == true) ? mynyte_db_environment : current_environment;
var current_environment_page_url = null;
var current_environment_file_url = null;
var current_environment_root_prefix = (current_environment == 'localhost' && localDevAllowed == true) ? 
	(typeof(local_root_prefix) !== 'undefined') ? local_root_prefix : "localhost/": 
	"https://www.mynyte.co.uk";
var _bid = mynyte_business_id;
console.log(_bid);
current_environment_page_url = (current_environment == 'staging') ? "staging/": "";
current_environment_file_url = (current_environment == 'localhost') ? "": current_environment + "/";
current_db_environment_file_url = (current_environment == 'localhost') ? "": current_db_environment + "/";

MynyteApi.scripts = {};
MynyteApi.pageVars = {};
MynyteApi.pageVars.Globals = {
	'Mynyte': {
		'main-logo': 'https://www.mynyte.co.uk/sneak-preview/img/logo.png',
		'table-booking-frame-src': 'https://www.mynyte.co.uk/'+current_environment_page_url+'#/app/externalApi/bookTable/light/87/0'
	},
	'Myday': {
		'main-logo': 'https://www.mydayapp.co.uk/sneak-preview/img/logo.png'
	}
};

		function disableScrolling() {
    disableScroll = true;
}
function enableScrolling() {
    disableScroll = false;
}
$('body').ontouchmove = function(e){
   if(disableScroll){
     e.preventDefault();
   } 
};

function lockScroll () {
	// lock scroll position, but retain settings for later
	var scrollPosition = [
		self.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft,
		self.pageYOffset || document.documentElement.scrollTop  || document.body.scrollTop
	];
	var html = jQuery('html'); // it would make more sense to apply this to body, but IE7 won't have that
	html.data('scroll-position', scrollPosition);
	html.data('previous-overflow', html.css('overflow'));
	html.css('overflow', 'hidden');
	window.scrollTo(scrollPosition[0], scrollPosition[1]);
}

function unlockScroll() {
	var html = jQuery('html');
	var scrollPosition = html.data('scroll-position');
	html.css('overflow', html.data('previous-overflow'));
	window.scrollTo(scrollPosition[0], scrollPosition[1]);
}

$(document)
    .on('focus', 'input.popup-input', function(e) {
        $('body').addClass('fixfixed');
    })
    .on('blur', 'input.popup-input', function(e) {
        $('body').removeClass('fixfixed');
    });

	function include(filename, onload) {
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.src = filename;
    script.type = 'text/javascript';
    script.onload = script.onreadystatechange = function() {
        if (script.readyState) {
            if (script.readyState === 'complete' || script.readyState === 'loaded') {
                script.onreadystatechange = null;                                                  
                onload();
            }
        } 
        else {
            onload();          
        }
    };
    head.appendChild(script);
}

		function dataConnect (params) {
	var className = params.className;
	var action = params.action;
	var data = params.data || null;
	var existingVars = params.existingVars || null;
	var successCallback = params.successCallback || function () {};
	var errorCallback = params.errorCallback || function () {};

	var jsonpCallback = function (reponse) {};

	$.ajax({
		url: current_environment_root_prefix+"/"+current_db_environment_file_url+"sneak-preview/data/extApi/"+className+".php?action="+action,
		type: "GET",
		dataType: "jsonp",
		jsonp: "jsonp",
		jsonpCallback: action,
		context: self,
		crossDomain: true,
		data: data,
		success: function (successData) {
			successCallback({successData: successData, existingVars: existingVars});
		},
		error: function (jqxhr,status,errorData) {
			errorCallback(errorData);
		},
		complete: function (data) {

		}
	});
}

function internalDataConnect (params) {
	var className = params.className;
	var action = params.action;
	var data = params.data || null;
	var existingVars = params.existingVars || null;
	var successCallback = params.successCallback || function () {};
	var errorCallback = params.errorCallback || function () {};

	var actionPropsMap = {
		uploadImage: {
			type: "POST", cache: false, processData: false, async: false
		}
	};
	console.log(params, MynyteApi.pageVars['New Business Item Forms'][0].internalDataUrl);
	console.log(action);
	$.ajax({
		url: MynyteApi.pageVars['New Business Item Forms'][0].internalDataUrl+"/"+className+".php?action="+action,
		type: actionPropsMap[action].type,
		dataType: "json",
		context: self,
		async: actionPropsMap[action].async,
		data: data,
    	cache: actionPropsMap[action].type,
    	processData: actionPropsMap[action].processData,
    	contentType: false,
		success: function (successData) {
			successCallback({successData: successData, existingVars: existingVars});
		},
		error: function (jqxhr,status,errorData) {
			errorCallback(errorData);
		},
		complete: function (data) {

		}
	});
}

		function createPopup(params) {
	var popupHtml = "";

	params.class = (params.class) ? ' ' + params.class : '';

	if ($('.mynyte-popup-cover').length == 0) {
		var div = $("<div/>").appendTo($('body'));
		div.attr('class', 'mynyte-popup-cover');
	}

	if (params.class == " menu-item-detail") {
		popupHtml = '<div class="mynyte-popup'+params.class+'">';
			popupHtml += '<div class="mn-popup-header">';
				popupHtml += '<h4 class="menu-item-title"></h4>';
				popupHtml += '<i class="fa fa-times mn-popup-close" onclick="MynyteApi.closePopup({});"></i>';
			popupHtml += '</div>';
			popupHtml += '<div class="mn-popup-body">';
				popupHtml += '<img src="#" alt=""/>';
				popupHtml += '<p class="menu-item-description">';
			popupHtml += '</div>';
		popupHtml += '</div>';
	}

	$('.mynyte-popup-cover').append(popupHtml);
}

function openPopup(params) {
	var speed = (params.speed == 'fast') ? 1: 250;
	lockScroll();
	disableScrolling();

	//Only for IOS
	if (navigator.userAgent.match(/(iP(od|hone|ad))/)) {   
		var offset = document.body.scrollTop;
		document.body.style.top = (offset * -1) + 'px';
		document.body.classList.add('mn-modal--opened');
	}

	window.setTimeout(
		function () {$('.mynyte-popup-cover').addClass("mynyte-popup-open");
	}, speed);

	if (params.onComplete) {
		params.onComplete();
	}
}

function closePopup(params) {
	$('.mynyte-popup-cover').removeClass("mynyte-popup-open");
	// un-lock scroll position
  	unlockScroll();
    enableScrolling();

	//IOS Only
	if (navigator.userAgent.match(/(iP(od|hone|ad))/)) {   
		var offset = parseInt(document.body.style.top, 10);
			document.body.classList.remove('mn-modal--opened');
			document.body.scrollTop = (offset * -1);
		}

}

		function genericItemTypeObj (params) {
	var obj = {};
	var genericItemTypeObj = {
		'Business Entity Item': function () {
			obj = {
				'Business Entity Item': {
					class: 'BusinessEntity', action: 'getBusinessEntityItems',
					data: {
						_businessId: MynyteApi.pageVars['New Business Item Forms'][0]._businessId,
						businessEntityItemType: params.propType,
						extraFiltersString: "[['"+params.propSubLabel+"':='"+params.propSubType+"']]",
						_relatedViewModelId: 'NULL'
					}
				}
			};	
		}
	};

	genericItemTypeObj[params.element]();
	return obj;
}

function portalObj (params) {
	var obj = {};
	var portalObj = {
		'TableBooking': function () {
			obj = {
				html: "<div class='container-header'>Book a Table with us through MyNyte</div><div class='container-dummy'><iframe allowtransparency='true' style='height: calc(100%); background: '"+((params.colourScheme == 'dark') ? '#212121': '#f7f7f7')+";' src='"+MynyteApi.pageVars.Globals[params.brand]['table-booking-frame-src']+"'></iframe></div><div class='container-footer'><span class='footer-transcript-note'><b>Book Tables with ease</b>, and find out what\'s going on in town...</span><img class='mynyte-chat-logo' alt='Log into MyNyte to book tables and make your evening plans' src='"+MynyteApi.pageVars.Globals[params.brand]['main-logo']+"'/></div>",
				elem: $('.mynyte-table-booking'),
				onComplete: function () {
					$('div.mynyte-table-booking').addClass("mynyte-frame-container");
				}
			};
		}
	};

	portalObj[params.element]();
	return obj;
}

function buttonsHtmlObj (params) {
	var obj = {};
	var buttonsHtmlObj = {
		'MyNyteTableBook': function () {
			obj = {
				html: "<img src='"+params.logo+"' alt='Book a restraurant table with MyNyte'/><span>Book a table with MyNyte</span>",
				elem: $( "a.mynyte-table-book" ),
				colourScheme: 'dark',
				onclickFn: function () {
					var myWindow = window.open("https://www.mynyte.co.uk/#/app/profile/", "mynyte-table-book-window", "width=485,height=560");
				}
			};
		},
		'MyNyteEventEntryBook': function () {
			obj = {
				html: "<img src='"+params.logo+"' alt='Book event entry with MyNyte'/><span>Book event entry with MyNyte</span>",
				elem: $( "a.mynyte-event-entry-book" ),
				colourScheme: 'dark',
				onclickFn: function () {
					var myWindow = window.open("https://www.mynyte.co.uk/#/app/profile/", "mynyte-table-book-window", "width=485,height=560");
				}
			};
		}
	};

	buttonsHtmlObj[params.element]();
	return obj;
}

function feedItemHTML(params) {
	var html = "";

	var feedItemHTML = {
		'Menu Feed': function () {
			var menuItemClickableString = (params.menuItemClickable == true) ? " onclick='MynyteApi.showMenuItem(this);'": "";
			var menuItemClickableClass = (params.menuItemClickable == true) ? " menu-item-clickable": "";
			var imageURLString = (params.item.imageURL != '' && params.item.imageURL != null) ? ' data-image-url="'+params.item.imageURL+'"': '';

			html += "<div class='text-container'"+ imageURLString +">";
				html += "<span class='title"+menuItemClickableClass+"'"+menuItemClickableString+">"+params.item.name+"</span>";
				html += "<!--<span class='options'>Options</span>-->";
				html += "<span class='price'>£ "+params.item.price+"</span>";
				html += "<span class='description"+menuItemClickableClass+"'"+menuItemClickableString+">"+params.item.description+"</span>";
			html += "</div>";
		}
	};

	feedItemHTML[params.feedType]();
	return html;
}

function feedGeneralHTML(params) {
	var html = "";

	var feedGeneralHTML = {
		'Menu Feed': {
			'start': function () {
				html += "<div class='container-header'>See our Menu</div>";
				html += "<div class='container-dummy'>";
			},
			'categoryStart': function () {
				html += "<div class='listing listing-menu-item'>";
				html += "<div class='header'>"+params.categoryName+"<span class='listing-menu-item-open'>+</span></div>";
				html += "<div class='body'>";
			},
			'categoryEnd': function () {
				html += "</div></div>";
			},
			'end': function () {
				html += "</div>";
				html += "<div class='container-footer'><span class='footer-transcript-note'>"+params.menuDisplayTranscriptNote+"</span><img class='mynyte-chat-logo' alt='"+params.menuDisplayImgAlt+"' src='"+params.menuDisplayImgSrc+"'/></div>";
			}
		}
	};

	feedGeneralHTML[params.feedType][params.element]();
	return html;
}

function businessItemPropertyHtml(params) {
	var html = "", metaName = params.item.metaName, intDataUrl = params.internalDataUrl, metaValue = params.item.metaValue;

	if (params.dataType != "image") {
		html += "<div class='mynyte-label-container'><label class='mynyte-label'>" + metaName + "</label>";
		html += "<span class='mynyte-label-detail'>" + metaValue + "</span></div>";
	}
	else if (params.dataType == "image" && metaName.indexOf("Arr[]") == -1) {
		html += "<div class='mynyte-label-container'><label class='mynyte-label'>" + metaName + "</label>";
		html += "<span class='mynyte-label-detail with-image'><img src='"+intDataUrl+"/images/"+metaValue+"' alt='' /></span></div>";
	}
	else if (params.dataType == "image" && metaName.indexOf("Arr[]") > -1) {
		//ACTUALLY DO SOMETHING DIFFERENT TO CREATE A COMBINED DIV
		html += "<div class='mynyte-label-container'><label class='mynyte-label'>" + metaName + "</label>";
		html += "<span class='mynyte-label-detail with-image'><img src='"+intDataUrl+"/images/"+metaValue+"' alt='' /></span></div>";
	}

	return html;
}

function businessItemsSummaryItemHTML(params) {
	var html = "";

	var globalSetup = {
		elemType: function () {
			return (params.view == 'Dropdown Selection') ? 'li': 'div';
		},
		cssPropToDisplay: function () {
			return params.prop.replace(/ /g, "-").toLowerCase();
		}
	};

	var businessItemsSummaryItemHTML = {
		'itemStart': function () {
			var elemType = globalSetup.elemType(),
			dropdownClass = (params.view == 'Dropdown Selection') ? "": " dropdown-selection-option",
			dataPropToDisplayString = function () {
				if (params.view == 'Dropdown Selection') {
					var dataPropToDisplayString = " data-prop-to-display='";

					for (var prop in params.item) {
						if (prop != "Arrays" && prop != '_itemId') {
							dataPropToDisplayString += "<span>" + params.item[prop] + " | </span>";
						}
					}
					dataPropToDisplayString += "'";

					return dataPropToDisplayString;
				}
				else {
					return "";
				}
			};

			html += "<"+ elemType + dataPropToDisplayString() +" class='mynyte-business-items-summary-item"+dropdownClass+"' data-item-ref='"+params.item._itemId+"'>";
		},
		'nonArrayProp': function () {
			var cssPropToDisplay = globalSetup.cssPropToDisplay();

			html += "<div class='mynyte-label-container "+cssPropToDisplay+"-label-container'><label class='mynyte-label'>" + params.prop + "</label>";
			html += "<span class='mynyte-label-detail'>" + params.item[params.prop] + "</span></div>";
		},
		'arrayProp': function () {
			html += "<div class='mynyte-label-container "+params.prop+"-label-container'><label class='mynyte-label'>" + params.prop2 + "</label>";
			html += "<span class='mynyte-label-detail'><ul>";
			for (var a = 0; a < params.item[params.prop][params.prop2].length; a++) {
				html += "<li>" + params.item[params.prop][params.prop2][a] + "</li>";
			}
			html += "</ul></span></div>";
		},
		'itemSummaryPreClose': function () {
			html += "<a href='" + params.htmlElem.data('link') + params._itemId + "' class='action-button view-detail-button'>View Detail</a>";
			html += "</div>";
		},
		'dropdownSelectionPreClose': function () {
			html += "<a onclick='MynyteApi.addItemToFormFromDropdown(this);' class='action-button dropdown-option-select-button'>Select</a>";
		},
		'itemClose': function () {
			var elemType = globalSetup.elemType();

			html += "</"+elemType+">";
		}
	};

	businessItemsSummaryItemHTML[params.element]();
	return html;
}

function businessItemsSummaryGeneralHTML(params) {
	var html = "";

	var globalSetup = {
	};

	var businessItemsSummaryGeneralHTML = {
		'noItemsNote': function () {
			html += "<div>" + params.text + "</div>";
		}
	};

	businessItemsSummaryGeneralHTML[params.element]();
	return html;
}

function formFieldHTML(params) {
	var inputString = "";
	var dataType, name, isReq, maxLen, minLen, propNameCssFormat, propType, propSubType, prop = params.prop;

	var globalFieldSetup = {
		dataType: function () {dataType =  prop["Data Type"];},
		name: function () {name = prop.Name.toLowerCase().replace(/ /g, "-");},
		isReq: function () {isReq = (prop["Is Required"]) ? " required-input": "";},
		maxLen: function () {maxLen = (prop["Max Length"]) ? " data-maxLength='"+prop["Max Length"]+"'": "";},
		minLen: function () {minLen = (prop["Min Length"]) ? " data-minLength='"+prop["Min Length"]+"'": "";},
		propNameCssFormat: function () {propNameCssFormat = prop.Name.replace(/ /g, '-').toLowerCase();},
		propType: function () {propType = prop["Related Property Type"];},
		propSubType: function () {propSubType = prop["Related Property Sub-Type"];},
		isArray: function () {isArray = prop.Name.indexOf(" Arr[]") > -1;}
	};

	var createFieldHTML = {
		'Text': function () {
			inputString += "<input name = '" +name+ "' class='mynyte-form-input mynyte-form-text-input"+isReq+"' type='text' "+maxLen+""+minLen+" /></span>";
			if (maxLen != "") {
				inputString += "<span class='input-maxlength-note'>" + maxLen + " Char Max</span>";
			}
		},
		'Textarea': function () {
			inputString += "<textarea rows='3' name = '" +name+ "' class='mynyte-form-input mynyte-form-textarea-input"+isReq+"' "+maxLen+""+minLen+" ></textarea></span>";
			if (maxLen != "") {
				inputString += "<span class='input-maxlength-note'>" + maxLen + " Char Max</span>";
			}
		},
		'Number': function () {
			inputString += "<input name='"+name+"' class='mynyte-form-input mynyte-form-text-input"+isReq+"' type='number' "+maxLen+""+minLen+" /></span>";
			if (maxLen != "") {
				inputString += "<span class='input-maxlength-note'>" + maxLen + " Char Max</span>";
			}
		},
		'Fake': function () {
			inputString += "<div data-name='" + propNameCssFormat + "' class='mynyte-form-input mynyte-form-fake-input' onclick='return MynyteApi.toggleRelatedItemSelect(event, this)'><span class='selected-option-label'>Select an Option</span><button class='mynyte-form-select-toggler'><i class='fa fa-chevron-down'></i></button></div></span>";
		},
		'IMAGE': function () {
			inputString += "<span><input onchange='MynyteApi.imageUploadFileTypeCheck(this)' name = '" +name+ "' class='mynyte-form-input mynyte-form-image-input"+isReq+"' type='file' accept='image/*' "+maxLen+""+minLen+"/><span class='mynyte-image-input-images'></span></span></span>";
		},
		'DATE': function () {
			inputString += "<div data-name='" +  name + "' class='mynyte-form-input mynyte-form-fake-input"+isReq+"'><button class='mynyte-form-datepicker'></button></div></span>";
		},
		'TIME': function () {
			inputString += "<div data-name='" +  name + "' class='mynyte-form-input mynyte-form-fake-input"+isReq+"'><button class='mynyte-form-timepicker'></button></div></span>";
		}
	};

	console.log(params.prop);
	//globalFieldSetup[params.prop]();
	for (var val in globalFieldSetup) {
		globalFieldSetup[val]();
	}
	inputString += "<span class='input-container'>";
	createFieldHTML[params.fieldType]();

	if (!!isArray) {
		inputString += "<button onclick='MynyteApi.addFormInputToForm(this)' class='add-input-button mynyte-button mynyte-button-secondary mynyte-button-with-icon' type='button'><span class='mynyte-button-inner-wrapper'><i class='fa fa-plus'></i><span>Add Another</span></span></button>";
	}

	return inputString;
}

function formGeneralHTML(params) {
	var htmlString = "";
	var formGeneralHTML = {
		'formStart': function () {
			htmlString += "<form action='#' name='mynyte-business-item-add-form' onsubmit='return MynyteApi.addBusinessItem();'>";
		},
		'formFieldContainer': function () {
			var name = params.prop.Name.replace(" Arr[]", "s").replace(" Id", "").replace("_Related", ""),
				isReqLabel = (params.prop["Is Required"]) ? " (Required)": "";

			htmlString += "<div class='mynyte-form-field-container'><label class='mynyte-form-field-label'>" + name + isReqLabel + "</label>";
			htmlString += "<div class='mynyte-form-input-container'>" + params.inputString + "</div></div>";
		},
		'formComplete': function () {
			htmlString += "<div class='mynyte-form-field-container mynyte-button-container'><button type='submit'>Add Item</button></div>";
			htmlString += "</form>";
		}
	};

	formGeneralHTML[params.element]();
	return htmlString;
}


MynyteApi.scripts.businessItemPropertyHtml = businessItemPropertyHtml;
MynyteApi.scripts.formFieldHTML = formFieldHTML;
MynyteApi.scripts.formGeneralHTML = formGeneralHTML;
		
		function createFeed (params) {
			var defElem;
			var feedType = params.feedType;

			switch (params.feedType) {
				case 'menuDisplay':
					defElem = $('.mynyte-menu-display');
					params.menuDisplayImgAlt = 'Log into MyNyte to book tables and make your evening plans';
					params.menuDisplayTranscriptNote = '<b>Book Tables with ease</b>, and find out what\'s going on in town...';
					params.menuDisplayImgSrc = 'https://www.mynyte.co.uk/sneak-preview/img/logo.png';
					params.menuItemCategoryIdString = params.menuItemCategoryIdString || '0';
					params.menuItemClickable = params.menuItemClickable || false;
					break;
				case 'offersFeed':
					defElem = $('.mynyte-offers-display');
					break;
				default: 
					defElem = $('.mynyte-listings');
					break;
			}

			var elem = params.elem || defElem,
				feedTypeAction = {'offersFeed': 'getOffersFeed', 'menuDisplay': 'getMenuItems', 'listingsFeed': 'getBusinessesByBusinessType'},
				feedTypeData = {
					'listingsFeed': {
						'_profileId': params._profileId || 0,
						'businessTypesString': params.businessTypesString || 'All',
						'_townId': params._townId || 1,
						'limit': params.limit || 5
					},
					'menuDisplay': {
						'_businessId': _bid,
						'menuType': params.menuType || 'takeaway',
						'menuItemCategoryIdString': params.menuItemCategoryIdString || '0'
					}
				},
				defaultData = {'_businessId': _bid};
			
			function createListingsFeedFromResults (resultData, existingVars) {
				var successData = resultData;
				var imageSize = params.imageSize || 'small';
				var htmlToAdd = "";
				var divHeight = $('.mynyte-listings').height() - 180;
				var listingsHeader = {
					html: "<div class='mn-listings-header'><span><b>What's On &amp; About</b> in Bedford</span> <img src='https://www.mynyte.co.uk/sneak-preview/img/logo.png' /></div><span class='scrollbar'></span>"	
				};
				var listingsFooter = {
					html: "<div class='mn-listings-footer'><span>Stay up to date with <b>MyNyte</b></span> <img src='https://www.mynyte.co.uk/sneak-preview/img/logo.png' /></div>"	
				};
						
				htmlToAdd += listingsHeader.html;

				function selectListingsNavItem (item) {
					$('.mn-listings-inner-container').each(function (index) {
						$(this).removeClass('show');

						if ($(this).data('mn-listing-type') == item) {
							$(this).addClass('show');
						}
					});
					$('.mn-listings-nav-listing').each(function (index) {
						$(this).removeClass('active');

						if ($(this).data('mn-nav-label-type') == item) {
							$(this).addClass('active');
						}
					});
					$('.mynyte-listings .more-listings-note').each(function (index) {
						$(this).removeClass('show');

						if ($(this).data('mn-listing-type') == item) {
							$(this).addClass('show');
						}
					});
				}
				MynyteApi.selectListingsNavItem = function (params) {
					selectListingsNavItem(params);
				};

				function buildListingsItems () {
					function goToFeedOption (optionUrl) {
						window.open(optionUrl);
					}
					MynyteApi.goToFeedOption = function (e, optionUrl) {
						e.preventDefault();
						goToFeedOption(optionUrl);
					};
					for (var types = Object.keys(successData.items), i = 0, end = types.length; i < end; i++) {
						var thisI = types[i],
							thisType = successData.items[thisI],
							containerShowString = (i == 0) ? " show": "",
							listingTypeName = thisType[0].listingTypeName,
							seeCatButtonShowClass = (i == 0) ? " show": "",
							listingCatHref = "https://www.mynyte.co.uk/"+current_environment_page_url+"#/app/feed/nl-feedListings/",
							seeCategoryButton = {
								href: listingCatHref + "searchRestaurantsByFoodStyle//",
								text: "See more " + listingTypeName + "s on MyNyte",
								title: "See more " + listingTypeName + "s on MyNyte"
							};
							seeCategoryButton.html = "<div data-mn-listing-type='"+listingTypeName+"' class='more-listings-note"+seeCatButtonShowClass+"'><a href='"+seeCategoryButton.href+"' title='"+seeCategoryButton.title+"'>" + seeCategoryButton.text + "</a></div>";

						htmlToAdd += "<div data-mn-listing-type='" + thisI + "' class='mn-listings-inner-container trans" + containerShowString + "'>";

						for (a = 0; a < thisType.length; a++) {
							var listingWithSmallImgClass = (imageSize == "small") ? ' with-small-image': '';
							var urlEscapedName = thisType[a].name.replace(/ /g, "%20");
							var imgSrc = (thisType[a].listingTypeName == 'Event' && thisType[a].currentCoverPhotoName != 'default.jpg') ? 
								'https://www.mynyte.co.uk/'+current_environment_file_url+'sneak-preview/img/user_images/cover_photo/'+thisType[a].currentCoverPhotoName: 
								'https://www.mynyte.co.uk/'+current_environment_file_url+'sneak-preview/img/user_images/profile_photo/'+thisType[a].currentProfilePhotoName;
							var listingHref = (thisType[a].listingTypeName == 'Event' || thisType[a].listingTypeName == 'Movie' || thisType[a].listingTypeName == 'Offer') ? 
								'https://www.mynyte.co.uk/'+current_environment_page_url+'#/app/feed/nl-feedListings///nl-feedListing/'+thisType[a].relListingId+'/'+thisType[a].listingTypeName:
								'https://www.mynyte.co.uk/'+current_environment_page_url+'#/app/feed/nl-feedListings///nl-feedListing/'+thisType[a].relListingId+'/Business';
							var listingInnerPageHref = listingHref.replace("/feed/", "/");
							var feedButtonHref = listingInnerPageHref + '/' + urlEscapedName + '/nl-feedListing-photos/'+thisType[a]._listingId;
							
							listingHref = (thisType[a].listingTypeName == 'Event' || thisType[a].listingTypeName == 'Movie') ? 
								'https://www.mynyte.co.uk/'+current_environment_page_url+'#/app/feed/nl-feedListings///nl-feedListing/'+thisType[a].relListingId+'/'+thisType[a].listingTypeName:
								listingHref;
							listingInnerPageHref = listingHref.replace("/feed/", "/");

							if (thisType[a].tonightsFeedButtonOptionName == 'See A la Carte Menu') {
								feedButtonHref = listingInnerPageHref + '/see-menu/' + thisType[a].relListingId + '/' + urlEscapedName + '/2';
							}
							else if (thisType[a].tonightsFeedButtonOptionName == 'See Takeaway Menu') {
								feedButtonHref = listingInnerPageHref + '/see-menu/' + thisType[a].relListingId + '/' + urlEscapedName + '/1';
							}
							else if (thisType[a].tonightsFeedButtonOptionName == 'Book Table') {
								thisType[a].showUsersEmailAndPhoneInTableBookingResponse = (thisType[a].showUsersEmailAndPhoneInTableBookingResponse == 1) ? true: false;
								thisType[a].allowCommentInTableBooking = (thisType[a].allowCommentInTableBooking == 1) ? true: false;
								
								feedButtonHref = listingInnerPageHref + '/book-table/' + thisType[a].relListingId + '/' + urlEscapedName + '/'+thisType[a].maxTableBookingGuests+'/'+thisType[a].showUsersEmailAndPhoneInTableBookingResponse+'/'+thisType[a].allowCommentInTableBooking;
							}
							else if (thisType[a].tonightsFeedButtonOptionName == 'Book Tickets') {
								feedButtonHref = listingInnerPageHref + '/book-tickets/' + thisType[a].relListingId + '/' + urlEscapedName;
							}
							else if (thisType[a].tonightsFeedButtonOptionName == 'See Details') {
								feedButtonHref = listingHref;
							}
							else if (thisType[a].tonightsFeedButtonOptionName == 'See Trailer') {
								feedButtonHref = listingInnerPageHref + '//see-trailer/'+thisType[a].relListingId+'/'+urlEscapedName;
							}

							htmlToAdd += "<a href='"+listingHref+"' target='_blank' class='listing"+listingWithSmallImgClass+"'>";
							htmlToAdd += "<img class='main-img' src='" + imgSrc + "'></img>";
							htmlToAdd += "<div class='text-container'><span class='title'>"+thisType[a].name+"</span>";
							htmlToAdd += "<span class='description'>"+thisType[a].listingType1+"</span>";
							htmlToAdd += "</div>";

							//Tonight's Feed Button Option
							htmlToAdd += '<button onclick="MynyteApi.goToFeedOption(event, \''+feedButtonHref+'\')" class="mn-listings-option-button">';
								htmlToAdd += thisType[a].tonightsFeedButtonOptionName;
							htmlToAdd += "</button>";

							/* HIDE FOR NOW
							//social bar
							htmlToAdd += "<div class='mn-listings-social-icons'>";

								htmlToAdd += "<i class='fa fa-facebook trans'></i>";
								htmlToAdd += "<i class='fa fa-twitter trans'></i>";
								htmlToAdd += "<i class='fa fa-envelope trans'></i>";
							htmlToAdd += "</div>";
							/**/

							htmlToAdd += "</a>";

							if (a == thisType.length - 1) {
								htmlToAdd += "</div>";
								
								htmlToAdd += seeCategoryButton.html;
								
								if (i == end - 1) {
									htmlToAdd += "</div>";
									
									htmlToAdd += listingsFooter.html;
					
									elem.append(htmlToAdd).css({'display': 'block'});
								}
							}
	
						}
					}
				}

				function buildListingsNavigation () {
					var typesObj = Object.keys(successData.items);
					var typesLen = typesObj.length;
					htmlToAdd += "<div class='mn-listings-nav listings-"+typesLen+"-item-container'>";
					for (var types = typesObj, i = 0, end = typesLen; i < end; i++) {
						var thisI = types[i];
						var thisType = successData.items[thisI];
						var listingActiveString = (i == 0) ? " active": "";
						var iconClass = successData.items[thisI][0].iconClass;

						htmlToAdd += '<div onclick="MynyteApi.selectListingsNavItem(\'' + thisI + '\');" data-mn-nav-label-type="' + thisI + '" class="mn-listings-nav-listing' + listingActiveString + '">';
							htmlToAdd += "<i class='fa " + iconClass + "'></i>";
							htmlToAdd += "<span class='nav-listing-label'>" + thisI + "s</span>";
							htmlToAdd += "<span class='nav-listing-tri'></span>";
						htmlToAdd += "</div>";

						if (i == end - 1) {
							htmlToAdd += "</div><div class='listings-container' style='height: "+divHeight+"px;'>";
			
							buildListingsItems();
						}
					}
				}

				buildListingsNavigation();
			}

			function createOffersFeedFromResults(resultData, existingVars) {
				var successData = resultData;
				var divHeight = $('.mynyte-listings').height() - 34;
				var htmlToAdd = "<div class='header'>MyNyte Offers</div><span class='scrollbar'></span><div class='listings-container' style='height: "+divHeight+"px;'>";

				for (a = 0; a < successData.length; a++) {
				  var imgString = (successData[a].currentOfferCoverPhotoName == "default-offer.jpg") ? 
					"": 
					"<img class='main-img' src='https://www.mynyte.co.uk/sneak-preview/img/user_images/cover_photo/"+successData[a].currentOfferCoverPhotoName+"'></img>";
				  var listingWithImgClass = (successData[a].currentOfferCoverPhotoName == "default-offer.jpg") ? '': ' with-image';
				  successData[a].endDateTimeArr = successData[a].endDateTime.split(" ");
				  htmlToAdd += "<div class='listing with-image"+listingWithImgClass+"'>";
				  htmlToAdd += imgString;
				  htmlToAdd += "<div class='text-container'><span class='title'>"+successData[a].name+"</span>";
				  htmlToAdd += "<span class='description'>"+successData[a].description+"</span>";
				  htmlToAdd += "<span class='offer-end'>Ends: "+successData[a].endDateTimeArr[0]+"</span>";
				  htmlToAdd += "</div></div>";

				}
				htmlToAdd += "</div>";
				
				elem.append(htmlToAdd).css({'display': 'block'});
			}

			function createMenuFeedFromResults(resultData, existingVars) {
				var successData = resultData;
				var categories = {};
				if (existingVars.menuItemClickable == true) {
					createPopup({'class': 'menu-item-detail'});

					MynyteApi.showMenuItem = function (item) {
						var par = $(item).parent('.text-container'),
							title = par.find('.title').html(),
							description = par.find('.description').html(),
							imageURL =  (par.data('image-url')) ? 'https://www.mynyte.co.uk/' + current_environment_file_url + '/sneak-preview/img/user_images/catalogue_item_photo/' + par.data('image-url') : null;
						$('.mynyte-popup.menu-item-detail').find('h4').html(title);
						if (typeof(description) !== 'undefined') {
							$('.mynyte-popup.menu-item-detail').find('.mn-popup-body').find('.menu-item-description').html(description);
						}
						if (typeof(imageURL) != 'undefined' && imageURL != null) {
							var p = $('.mynyte-popup.menu-item-detail').find('.mn-popup-body').find('p.menu-item-description');
							$('.mynyte-popup.menu-item-detail').find('.mn-popup-body').find('img').attr('src', imageURL);
							$('.mynyte-popup.menu-item-detail').find('.mn-popup-body').find('img').show();
							if (!p.hasClass("with-image")) {
								$('.mynyte-popup.menu-item-detail').find('.mn-popup-body').find('p.menu-item-description').addClass("with-image");
							}
						}
						else {
							$('.mynyte-popup.menu-item-detail').find('.mn-popup-body').find('img').hide();
							$('.mynyte-popup.menu-item-detail').find('.mn-popup-body').find('p.menu-item-description').removeClass("with-image");
						}
						openPopup({'speed': 'fast'});
					};
				}

				var htmlToAdd = feedGeneralHTML({feedType: 'Menu Feed', element: 'start'});
				for (var a = 0; a < successData.length; a++) {
				  if (categories[successData[a].menuItemCategoryName] === undefined) {
					categories[successData[a].menuItemCategoryName] = [];
				  }
				  if (a == successData.length - 1) {
					for (var b = 0; b < successData.length; b++) {
						categories[successData[b].menuItemCategoryName].push({'name': successData[b].Name, 'price': successData[b].Price, 'description': successData[b].Description, 'imageURL': successData[b].imageURL});

						if (b == successData.length - 1) {

							for (var cat in categories) {
								if (categories.hasOwnProperty(cat)) {
									htmlToAdd += feedGeneralHTML({feedType: 'Menu Feed', element: 'categoryStart', categoryName: cat});
									for (var c = 0; c < categories[cat].length; c++) {
										htmlToAdd += feedItemHTML({feedType: 'Menu Feed', menuItemClickable: existingVars.menuItemClickable, item: categories[cat][c]});

										if (c == categories[cat].length - 1) {
											$('.header').on("click", function () {
												$(this).siblings('.body').addClass('open');
											});
										}
									}
									htmlToAdd += feedGeneralHTML({feedType: 'Menu Feed', element: 'categoryEnd'});
								}
							}
						}
					}
				  }
				}
				htmlToAdd += feedGeneralHTML({feedType: 'Menu Feed', element: 'end', menuDisplayTranscriptNote: existingVars.menuDisplayTranscriptNote, menuDisplayImgAlt: existingVars.menuDisplayImgAlt, menuDisplayImgSrc: existingVars.menuDisplayImgSrc});
				
				$('.mynyte-menu-display').addClass("mynyte-frame-container").append(htmlToAdd).css({'display': 'block'});
				
				$('div.mynyte-menu-display')
					.css("display", "block");
				
				$('.header').on("click", function () {
					var header = $(this),
					relBody = header.siblings('.body');

					if (relBody.hasClass('open')) {
						relBody.removeClass('open');
						header.find('.listing-menu-item-open').html("+");
					} else {
						relBody.addClass('open');
						header.find('.listing-menu-item-open').html("-");
					}
				});
			}
			
			dataConnect({
				'className': 'Profile',
				'action': feedTypeAction[feedType],
				'data': feedTypeData[feedType] || defaultData,
				'existingVars': params,
				'successCallback': function (params) {
					var successData = params.successData;
					var existingVars = params.existingVars;
					
					if (feedType == 'offersFeed') {
						successData = successData.items;
						
						createOffersFeedFromResults(successData, existingVars);
					}
					else if (feedType == 'menuDisplay') {
						successData = successData.items;
						createMenuFeedFromResults(successData, existingVars);
					}
					else if (feedType == 'listingsFeed') {
						createListingsFeedFromResults(successData, existingVars);
					}
				},
				'errorCallback': function () {
					
				}
			});
		}

		function createButton (params) {
			var onclickFn, elem;
			var type = params.type;
			var brand = params.currentBrand || 'Mynyte';
			var brandObj = MynyteApi.pageVars.Globals[brand];

			var buttonsHtmlObj = buttonsHtmlObj({element: type, logo: brandObj["main-logo"]});

			elem = params.elem || buttonsHtmlObj.elem;
			onclickFn = params.onclickFn || buttonsHtmlObj.onclickFn || null;
			colourScheme = params.colourScheme || buttonsHtmlObj.colorScheme || 'dark';
			
			elem
				.html(buttonsHtmlObj.html)
				.css("display", "block");

			if (onclickFn != null) {
				elem
				.on("click", onclickFn);
			}
		}
		
		function createPortal (params) {
			var elem, html, onComplete,
				type = params.type,
				colourScheme = params.colourScheme || 'dark',
				brand = params.brand || 'Mynyte',
				portalObj = portalObj({element: type, colourScheme: colourScheme, brand: brand});
			
			onComplete = params.onComplete || portalObj[type].onComplete || null;
			elem = params.elem || portalObj[type].elem;
			htmlText = portalObj[type].html;
			elem.html(htmlText).css("display", "block");
				
			if (onComplete != null) {
				onComplete();
			}
		}
		
		function loopObjPropsToCompileObj (params) {
			var format = params.format,
				viewType = params.viewType,
				_businessId = params._businessId,
				i = params.i,
				successData = params.successData,
				businessItems = params.businessItems,
				htmlString = params.htmlString,
				htmlElem = params.htmlElem,
				viewModelProps = params.viewModelProps || null,
				thisItem = successData.items[i],
				htmlViewModelParams = params.htmlViewModelParams,
				htmlViewModelScript = params.htmlViewModelScript,
				internalDataUrl = params.internalDataUrl;
				
			function nextItem () {
				if (i == successData.items.length - 1) {
					MynyteApi.pageVars['Page Object']["Business Items"] = businessItems;
					
					prepareBusinessItemsView({'format': format, 'viewType': viewType, 'successData': successData, 'htmlString': htmlString, 'htmlElem': htmlElem, 'htmlViewModelParams': htmlViewModelParams, 'htmlViewModelScript': htmlViewModelScript, 'internalDataUrl': internalDataUrl});
				}
				else {
					params.i += 1;
					loopObjPropsToCompileObj(params);
				}
			}
		
			if (!businessItems[thisItem._id]) {
				businessItems[thisItem._id] = {};
			}
			
			businessItems[thisItem._id]._itemId = thisItem._id;

			if (viewType != 'Dropdown Selection' || (viewType == 'Dropdown Selection' && (viewModelProps == null || viewModelProps.indexOf("_id") > 0))) {
				businessItems[thisItem._id]._id = thisItem._id;
			}
			
			if (thisItem.metaName.indexOf("Arr[]") == -1 && thisItem.metaName.indexOf("_") != 0 && (viewModelProps == null || viewModelProps.indexOf(thisItem.metaName) > - 1)) {
				businessItems[thisItem._id][thisItem.metaName] = thisItem.metaValue;
		
				nextItem();
			}
			else if (thisItem.metaName.indexOf("Arr[]") == -1 && thisItem.metaName.indexOf("_Related") == 0 && viewType == 'Dropdown Selection' && (viewModelProps == null || viewModelProps.indexOf(thisItem.metaName) > - 1)) {
				businessItems[thisItem._id][thisItem.metaName] = thisItem.metaValue;
				
				nextItem();
			}
			else if (thisItem.metaName.indexOf("Arr[]") == -1 && thisItem.metaName.indexOf("_Related") == 0 && viewType != 'Dropdown Selection') {
				var getPosition = function getPosition(string, subString, index) {
						return string.split(subString, index).join(subString).length;
					},
					thisItemId = thisItem._id,
					thisItemMetaName = thisItem.metaName,
					thisItemMetaNameFormatted = thisItem.metaName.replace(/-/g, "").replace("_", "").replace(" Id", ""),
					firstStringPos = getPosition(thisItem.metaName, "-", 1),
					lastStringPos = getPosition(thisItem.metaName, "-", 2),
					thisItemPropertyName = thisItem.metaName.substring(firstStringPos + 1, lastStringPos);
				
				dataConnect({
					existingVars: {"thisItemId": thisItemId, "thisItemMetaName": thisItemMetaName,
						"thisItemMetaNameFormatted": thisItemMetaNameFormatted},
					className: 'BusinessEntity', 
					action: 'getBusinessEntityItemsMeta', 
					data: {
						_businessId: _businessId,
						_businessEntityItemId: thisItem.metaValue
					},
					successCallback: function (success) {
						if (MynyteApi.pageVars['Business Item Summary Displays'] && MynyteApi.pageVars['Business Item Summary Displays'][0].specialProps && MynyteApi.pageVars['Business Item Summary Displays'][0].specialProps[thisItemPropertyName]) {
							var counter = 0;
							businessItems[success.existingVars.thisItemId][success.existingVars.thisItemMetaNameFormatted] = "";

							for (var z = 0; z < success.successData.items.length; z++) {
								if (MynyteApi.pageVars['Business Item Summary Displays'][0].specialProps[thisItemPropertyName].indexOf(success.successData.items[z].metaName) > -1) {
									if (counter > 0) {
										businessItems[success.existingVars.thisItemId][success.existingVars.thisItemMetaNameFormatted] += " - ";
									}
									businessItems[success.existingVars.thisItemId][success.existingVars.thisItemMetaNameFormatted] += success.successData.items[z].metaValue;
									counter += 1;
								}
							
								if (z == success.successData.items.length - 1) {
									nextItem();
								}
							}
						}
						else {
							businessItems[success.existingVars.thisItemId][success.existingVars.thisItemMetaNameFormatted] = success.successData.items[0].metaValue;
							nextItem();
						}
					},
					errorCallback: function () {

					}
				});
			}
			else if (thisItem.metaName.indexOf("Arr[]") > -1 && (viewModelProps == null || viewModelProps.indexOf(thisItem.metaName) > - 1)) {
				var metaNameFormatted = thisItem.metaName.replace(" Arr[]", "");
				businessItems[thisItem._id].Arrays = businessItems[thisItem._id].Arrays || {};
				businessItems[thisItem._id].Arrays[metaNameFormatted] = businessItems[thisItem._id].Arrays[metaNameFormatted] || [];
				businessItems[thisItem._id].Arrays[metaNameFormatted].push(thisItem.metaValue);
		
				nextItem();
			}
			else {
				nextItem();	
			}
		}
		
		function prepareBusinessItemsView (params) {
			var format = params.format,
				viewType = params.viewType,
				successData = params.successData,
				htmlString = params.htmlString,
				htmlElem = params.htmlElem,
				htmlViewModelScript = params.htmlViewModelScript,
				htmlViewModelParams = params.htmlViewModelParams,
				internalDataUrl = params.internalDataUrl,
				businessItems = $.map(MynyteApi.pageVars['Page Object']["Business Items"], function(value, index) {
		    		return [value];
				});
				
			if (successData.items != null && format == 'default') {
				for (var ind = 0; ind < businessItems.length; ind++) {
					htmlString += businessItemsSummaryItemHTML({element: 'itemStart', item: businessItems[ind], view: viewType});

					for (var prop in businessItems[ind]) {
						if (prop != "Arrays" && prop != '_itemId') {
							htmlString += businessItemsSummaryItemHTML({element: 'nonArrayProp', item: businessItems[ind], prop: prop});
						} else if (prop != '_itemId') {
							for (var prop2 in businessItems[ind][prop]) {
								htmlString += businessItemsSummaryItemHTML({element: 'arrayProp', item: businessItems[ind], prop: prop, prop2: prop2});
							}
						}
					}
					
					if (viewType == 'Item Summary') {
						htmlString += businessItemsSummaryItemHTML({element: 'itemSummaryPreClose', htmlElem: htmlElem, _itemId: businessItems[ind]._id});
					}
					else if (viewType == 'Dropdown Selection') {
						htmlString += businessItemsSummaryItemHTML({element: 'dropdownSelectionPreClose'});
					}
					
					htmlString += businessItemsSummaryItemHTML({element: 'itemClose', view: viewType});

					if (ind == businessItems.length - 1 && viewType == 'Item Summary') {
						htmlElem.append(htmlString).css({'display': 'block'});
					}
					else if (ind == businessItems.length - 1 && viewType == 'Dropdown Selection') {
						htmlElem.append(htmlString);
					}
				}
			}
			else if (successData.items != null && format == 'custom') {
				var d=document,
					s=d.createElement('script');
				s.src = htmlViewModelScript;
				s.onload = function () {
					console.log("MyNyte Local API Script loaded");

					customBusinessItemsSummaryGeneralHtml({
						items: businessItems,
						onComplete: function (html) {
							htmlElem.append(html).css({'display': 'block'});
						},
						internalDataUrl: internalDataUrl,
						extraParams: htmlViewModelParams
					});
				};
				d.head.appendChild(s);
			}
			else if (successData.items == null) {
				htmlString = businessItemsSummaryGeneralHTML({element: 'noItemsNote', text: MynyteApi.pageVars['Business Item Summary Displays'][0].noItemsNote});
				
				if (viewType == 'Item Summary') {
					htmlElem.append(htmlString).css({'display': 'block'});
				}
				else if (viewType == 'Dropdown Selection') {
					htmlElem.append(htmlString);
				}
			}
		}
		
		function toggleRelatedItemSelect(e, elem) {

			e.preventDefault();
			var propLabel = $(elem).data('name'),
				popupCover = $('body').find('.dropdown-wrapper.'+propLabel+'-dropdown-wrapper').parents('.mynyte-popup-cover');
				
			if (popupCover.hasClass('mynyte-popup-open')) {
				popupCover.removeClass('mynyte-popup-open');
			} else {
				popupCover.addClass('mynyte-popup-open');
			}
		}
		
		function addItemToFormFromDropdown (button) {
			var input, propLabel,
				li = $(button).parents('li'),
				item = li.data('item-ref'),
				propToDisplay = li.data('prop-to-display'),
				parUl = li.parents('ul.dropdown'),
				classList = parUl.attr('class').split(/\s+/);
				
			$(button).parents('.mynyte-popup-open').removeClass('mynyte-popup-open');
			$.each(classList, function(index, i) {
    			if (i.indexOf('-dropdown') > -1) {
        			//do something
					propLabel = i.substr(0, i.indexOf('-dropdown'));
					input = $('.mynyte-form-input.mynyte-form-fake-input[data-name="'+propLabel+'"]');
					
					if ($(input).data('data-selected-item-ref')) {
						$(input).data('selected-item-ref', item);
					}
					else {
						$(input).attr('data-selected-item-ref', item);
					}
					$(input).find('.selected-option-label').html(propToDisplay);
    			}
			});
		}

		include('//ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js', function() {
			$(document).ready(function() {
				//General css files
$('head').append('<link rel="stylesheet" href="'+ current_environment_root_prefix + "/" +current_environment_file_url+'css/api-style.css" type="text/css" />');
$('head').append('<link rel="stylesheet" href="'+ current_environment_root_prefix + "/" +current_environment_file_url+'css/ionicons.min.css" type="text/css" />');
$('head').append('<link rel="stylesheet" href="https://webfonts.creativecloud.com/c/69721a/1w;quicksand,2,WXp:W:n4,WXn:W:n7/l" type="text/css" />');
$('head').append('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" type="text/css" />');
				
		   		//If Offers Feed Exists in Page
		   		if ($( "a.mynyte-table-book" ).length) {
					createFeed({'elem': $('.mynyte-listings'), 'feedType': 'offersFeed' });
				}

				//If MyNyte Book Table Feed Exists in Page
				if ($( "a.mynyte-table-book" ).length) {
					createButton({ 'type': 'MyNyteTableBook' });
				}


				//If MyNyte Book Table Feed Exists in Page
				if ($( "a.mynyte-event-entry-book" ).length) {
					createButton({ 'type': 'MyNyteEventEntryBook' });
				}


				//If MyNyte Live Chat Exists in Page
				if ($( "div.mynyte-live-chat" ).length) {
					var chatStarted = false,
					imgAlt = 'Log into MyNyte to save transcripts, and get updates on the latest listings Bedford',
					imgSrc = 'https://www.mynyte.co.uk/sneak-preview/img/logo.png',
					transcriptNote = '<b>Keep a record of all chats</b>, and find out what\'s going on in town...';

					var liveChatHtml = "<div class='container-header'>Live Chat through our MyNyte Account</div>";
					liveChatHtml += "<div class='container-dummy'><button class='chat-start' onclick='MynyteApi.chatStart()'>Start a Chat</button></div>";
					liveChatHtml += "<div class='container-footer'><span class='footer-transcript-note'>"+transcriptNote+"</span><img class='mynyte-chat-logo' alt='"+imgAlt+"' src='"+imgSrc+"'/></div>";
					$('div.mynyte-live-chat')
						.html(liveChatHtml)
						.css("display", "block")
						.addClass("mynyte-frame-container");

					MynyteApi.chatStart = function () {
						var outerHeight = $('div.container-header').outerHeight() + $('div.container-footer').outerHeight() + 2,
						colourScheme = ($('div.mynyte-live-chat').hasClass("mn-dark")) ? 'dark': 'light',
						frameBg = ($('div.mynyte-live-chat').hasClass("mn-dark")) ? '#212121': '#f7f7f7',
						frameSrc = 'https://www.mynyte.co.uk/#/app/externalApi/liveChat/'+colourScheme+'/87/',
						frameStyle = 'height: calc(100% - '+outerHeight+'px); background: '+frameBg+';';

						if (!chatStarted) {
							$.get( "https://www.mynyte.co.uk/templates/more-views/external-api-templates/live-chat-popup.php", function(successData) {
							  $('body').append(successData);

							  var headerHeight = $('.mn-popup-header').outerHeight(),
							  	  footerHeight = $('.mn-popup-footer').outerHeight(),
							  	  popupOuterHeight = headerHeight + footerHeight;

							  $('.mn-popup-close').on("click", function () {
							  	closePopup({});
							  });

							  $('.mn-popup-body').css('max-height', 'calc('+(((90/100)*windowOuterHeight)-popupOuterHeight)+'px)');

							  $('.mynyte-popup .start-chat').on("click", function (e) {
								e.preventDefault();
								$('div.chat-dummy')
									.replaceWith("<iframe allowtransparency='true' style='"+frameStyle+"' src='"+frameSrc+"'></iframe>");
								
								closePopup({});
							  });

							  chatStarted = true;
							  openPopup({speed: "slow"});
							});
						} else {
							openPopup({speed: "fast"});
						}
						//$('body').append("<div class='mynyte-popup-cover'><div class='mynyte-popup'><div class='mn-popup-header'>Please enter your Details</div><input type='text'/><input type='text'/></div></div>");
						/*
						$('div.chat-dummy')
						.replaceWith("<iframe allowtransparency='true' style='"+frameStyle+"' src='"+frameSrc+"'></iframe>");
						*/
					};
				}
				
				//If MyNyte Table Booking Plugin
				if ($( "div.mynyte-table-booking" ).length) {
					createPortal({'type': TableBooking, 'onComplete': function () {$('div.mynyte-table-booking').addClass("mynyte-frame-container");}});
				}

				//If MyNyte Listings Feed
				if ($( "div.mynyte-listings" ).length) {
					createFeed({'elem': $( "div.mynyte-listings" ), 'feedType': 'listingsFeed', 'onComplete': function () {$('div.mynyte-listings').addClass("mynyte-frame-container");}});
				}

				//If MyNyte Menu Display Plugin
				/*if ($( "div.mynyte-menu-display" ).length) {
					createFeed({'feedType': 'menuDisplay','_businessId': 90,'menuType': 'takeaway', 'menuItemCategoryIdString': '1, 23'});
				}*/

				//If MyNyte Business items SUmmary
				if ($( "div.mynyte-business-items-summary").length) {
					var htmlDiv = $( "div.mynyte-business-items-summary"),
						bisd;
					
					MynyteApi.pageVars['Page Object'] = {};
					MynyteApi.pageVars['Business Item Summary Displays'] = [];

					MynyteApi.pageVars['Business Item Summary Displays'][0] = {
						'_businessId': htmlDiv.data('bid'),
						'businessEntityItemType': htmlDiv.data('item-type'),
						'businessEntityItemTypeLabel': htmlDiv.data('item-sub-type').split(",")[0],
						'businessEntityItemSubType': htmlDiv.data('item-sub-type').split(",")[1],
						'extraFiltersString': htmlDiv.data('item-extra-filters'),
						'noItemsNote': htmlDiv.data('no-items-note') || "You currently have 0 " + htmlDiv.data('item-sub-type').split(",")[1] + "s.",
                        'specialProps': htmlDiv.data('special-prop'),
						'internalDataUrl': htmlDiv.data('internal-data') || '/',
						'htmlViewModelMethod': htmlDiv.data('html-method') || 'default',
						'htmlViewModelScript': htmlDiv.data('html-script') || '',
						'htmlViewModelParams': htmlDiv.data('html-script-input') || {}
					};
					bisd = MynyteApi.pageVars['Business Item Summary Displays'][0];

					dataConnect({
						className: 'BusinessEntity', 
						action: 'getBusinessEntityItems', 
						data: {
							_businessId: bisd._businessId,
							businessEntityItemType: bisd.businessEntityItemType,
							extraFiltersString: bisd.extraFiltersString
						},
						successCallback: function (params) {
							var viewType = 'Item Summary',
								_businessId = bisd._businessId,
								i = 0,
								successData = params.successData,
								businessItems = {},
								htmlString = "";
								
							MynyteApi.pageVars['Page Object']["Business Items"] = {};

                            if (successData.items != null && (bisd.htmlViewModelMethod != 'custom' || bisd.htmlViewModelScript == '')) {
                                loopObjPropsToCompileObj({'format': 'default', 'viewType': viewType, '_businessId': _businessId, 'i': i, 'successData': successData, 'businessItems': businessItems, 'htmlString': htmlString, 'htmlElem': $( "div.mynyte-business-items-summary")});
                            }
                            else if (successData.items != null && (bisd.htmlViewModelMethod == 'custom' && bisd.htmlViewModelScript != '')) {
                            	loopObjPropsToCompileObj({'format': 'custom', 'viewType': viewType, '_businessId': _businessId, 'i': i, 'successData': successData, 'businessItems': businessItems, 'htmlString': htmlString, 'htmlElem': $( "div.mynyte-business-items-summary"), 'htmlViewModelParams': bisd.htmlViewModelParams, 'htmlViewModelScript': bisd.htmlViewModelScript, 'internalDataUrl': bisd.internalDataUrl});
                            }
                            else {
                                prepareBusinessItemsView({'format': 'custom', 'viewType': viewType, 'successData': successData, 'htmlString': htmlString, 'htmlElem': $( "div.mynyte-business-items-summary")});
                            }
						},
						errorCallback: function (errorData) {

						}
					});
				}

				//If MyNyte Business items SUmmary
				if ($("div.mynyte-business-item-detail").length) {
					var elem = $("div.mynyte-business-item-detail"),
						bidd = null;

					MynyteApi.pageVars['Page Object'] = {};
					MynyteApi.pageVars['Business Item Detail Displays'] = [];

					MynyteApi.pageVars['Business Item Detail Displays'][0] = {
						'businessEntityItemId': (window.location.href.indexOf('?_itemId') > -1) ? window.location.href.substr(window.location.href.indexOf('?_itemId=') + 9, window.location.href.length): $("div.mynyte-business-item-detail").data('item-id'),
						'businessEntityItemType': elem.data('item-type') || '/',
						'internalDataUrl': elem.data('internal-data') || '/',
						'_relatedViewModelId': elem.data('viewmodel-id'),
						'htmlViewModelMethod': elem.data('html-method') || 'default',
						'htmlViewModelScript': elem.data('html-script') || '',
						'htmlViewModelParams': elem.data('html-script-input') || {}
					};
					bidd = MynyteApi.pageVars['Business Item Detail Displays'][0];

					var getItemModel = function getItemModel () {
						dataConnect({
							className: 'BusinessEntity', 
							action: 'getBusinessEntityItemModel', 
							data: {
								_businessId: $("div.mynyte-business-item-detail").data('bid'),
								businessEntityItemType: bidd.businessEntityItemType,
								extraFiltersString: "",
								_relatedViewModelId: bidd._relatedViewModelId
							},
							successCallback: function (params) {
								getItemsMetaProps(params.successData);
							},
							errorCallback: function (errorData) {

							}
						});
					};

					var createBusinessItemView = function createBusinessItemView(params) {
						var successData = params.successData,
							model = params.existingVars,
							itemModel = {},
							finalItemModel = {},
							arrays = {},
							htmlString = "";
						MynyteApi.pageVars['Page Object'] = successData;



						function loopPropertiesToCreateItemHtml () {
							var htmlString = "";

							for (var a= 0; a < successData.items.length; a++) {
								item = successData.items[a];
								itemModel = finalItemModel[item.metaName];
								dataType = (typeof(itemModel) !== 'undefined') ? itemModel["Data Type"].toLowerCase() : 'string';

								
								if (item.metaName.indexOf("Arr[]") > -1 && arrays[item.metaName]) {
									arrays[item.metaName].push(item);
								}
								else if (item.metaName.indexOf("Arr[]") > -1) {
									arrays[item.metaName] = [item];
								}
								else {
									htmlString += businessItemPropertyHtml({item: item, dataType: dataType, internalDataUrl: bidd.internalDataUrl});
								}

								if (a == successData.items.length - 1) {
									$( "div.mynyte-business-item-detail").append(htmlString).css({'display': 'block'});
								}
							}
						}

						function loopItemModelForTypes () {
							var htmlString;

							for (var prop in itemModel) {
								finalItemModel[itemModel[prop].Name] = itemModel[prop];
							}

							if (bidd.htmlViewModelMethod != 'custom' || bidd.htmlViewModelScript == '') {
								loopPropertiesToCreateItemHtml();
							}
							else {
								var d=document,
									s=d.createElement('script');
    							s.src = bidd.htmlViewModelScript;
    							s.onload = function () {
    								console.log("MyNyte Local API Script loaded");

									customBusinessItemGeneralHtml({
										properties: successData.items,
										onComplete: function (html) {
											$( "div.mynyte-business-item-detail").append(html).css({'display': 'block'});
										},
										internalDataUrl: bidd.internalDataUrl,
										extraParams: bidd.htmlViewModelParams
									});
    							};
    							d.head.appendChild(s);
							}
						}

						function loopItemModelForIds () {
							for (var i = 0; i < model.items.length; i++) {
								var _id = model.items[i]._propertyId;
								var name = model.items[i].metaName;
								var val = model.items[i].metaValue;

								if (itemModel[_id]) {}
								else {
									itemModel[_id] = {};
								}

								itemModel[_id][name] = val;

								if (i == model.items.length - 1) {
									loopItemModelForTypes();
								}
							}
						}

						loopItemModelForIds();
					};

					var getItemsMetaProps = function getItemsMetaProps (model) {
						console.log('getItemsMetaProps result: ', model);
						dataConnect({
							className: 'BusinessEntity', 
							action: 'getBusinessEntityItemsMeta',
							existingVars: model, 
							data: {
								_businessId: $("div.mynyte-business-item-detail").data('bid'),
								_businessEntityItemId: bidd.businessEntityItemId
							},
							successCallback: function (params) {
								createBusinessItemView(params);
							},
							errorCallback: function (errorData) {

							}
						});
					};

					getItemModel();

				}

				//If MyNyte Business items SUmmary
				if ($( "div.mynyte-new-business-item").length) {
					var htmlDiv = $( "div.mynyte-new-business-item");
					MynyteApi.pageVars['Page Object'] = {};
					MynyteApi.pageVars['New Business Item Forms'] = [];

					MynyteApi.pageVars['New Business Item Forms'][0] = {
						'_businessId': htmlDiv.data('bid'),
						'businessEntityItemType': htmlDiv.data('item-type'),
						'businessEntityItemTypeLabel': htmlDiv.data('item-sub-type').split(",")[0],
						'businessEntityItemSubType': htmlDiv.data('item-sub-type').split(",")[1],
						'_relatedViewModelId': htmlDiv.data('viewmodel-id'),
						'onUploadCompleteUrl': htmlDiv.data('link'),
						'internalDataUrl': htmlDiv.data('internal-data') || '/'
					};

					var extraFiltersString = "";
					if ($( "div.mynyte-new-business-item").data('item-extra-filters').length) {
						for (var a = 0; a < $( "div.mynyte-new-business-item").data('item-extra-filters').split("||").length; a++) {
							var thisObj = $( "div.mynyte-new-business-item").data('item-extra-filters').split("||")[a];
							extraFiltersString += "[[" + thisObj + "]]";
						}
					}
					else {
						extraFiltersString = null;
					}

					dataConnect({className: 'BusinessEntity', action: 'getBusinessEntityItemModel', 
						data: {
							_businessId: MynyteApi.pageVars['New Business Item Forms'][0]._businessId,
							businessEntityItemType: MynyteApi.pageVars['New Business Item Forms'][0].businessEntityItemType,
							extraFiltersString: extraFiltersString,
							_relatedViewModelId: MynyteApi.pageVars['New Business Item Forms'][0]._relatedViewModelId
						},
						successCallback: function (params) {
							var successData = params.successData;

							/*
							STUFF THAT ONLY RELATS TO LEGAL SERVE

							function sortUserAccounts (successData, successData2) {
								var htmlString = "<ul class='mynyte-form-select mynyte-form-fake-select mynyte-fast-trans'>";
								for (var b = 0; b < successData2.length; b++) {
									htmlString += "<li data-value='" + successData2[b]["_id"] + "' onclick='MynyteApi.selectOptionSelect(\"_Related Business User Account Id\", this)'>" + successData2[b]["value"] + "</li>";

									if (b == successData2.length - 1) {
										htmlString += "</ul>";

										addUserAccountsToForm(successData, htmlString);
									}
								}
							}

							function addUserAccountsToForm (successData, businessOptionsHtml) {
								*/
								function createForm () {
									var htmlString = formGeneralHTML({element: 'formStart'});
									var modelProperties = {};
									for (var a= 0; a < successData.items.length; a++) {
										if (!modelProperties[successData.items[a]._propertyId]) {
											modelProperties[successData.items[a]._propertyId] = {};
										}

										var thisObj = modelProperties[successData.items[a]._propertyId];
										thisObj[successData.items[a].metaName] = successData.items[a].metaValue;

										if (a == successData.items.length - 1) {
											var keys = Object.keys(modelProperties),
												newItems = [],
												dataType, prop, isReqLabel;
											
											var completeForm = function completeForm () {
												htmlString += formGeneralHTML({element: 'formComplete'});

												MynyteApi.pageVars['Page Object'].Model = modelProperties;
												$( "div.mynyte-new-business-item").append(htmlString).css({'display': 'block'});	
											};
											
											var addPropFinal = function addPropFinal (i, isReqLabel, inputString) {
												var prop = keys[i];

												htmlString += formGeneralHTML({element: 'formFieldContainer', prop: modelProperties[prop], inputString: inputString});
												
												if (i < keys.length - 1) {
													compilePropHtmlToAdd(i+1);
												}
												else {
													completeForm();
												}	
											};

											var compilePropHtmlToAdd = function compilePropHtmlToAdd(i) {
												var inputString = "",
													prop = keys[i],
													dataType = modelProperties[prop]["Data Type"],
													isReq = (modelProperties[prop]["Is Required"]) ? " required-input": "",
													propType = modelProperties[prop]["Related Property Type"];

												MynyteApi.removeFormInputFromForm = function (button) {
													var par = $(button).parents('.input-inner-container');

													par.remove();
												};

												MynyteApi.addFormInputToForm = function (button) {
													var newInput = $(button).siblings('.input-container').find('.mynyte-form-input').first().clone(),
														newImg = $(button).siblings('.input-container').find('.mynyte-image-input-images').first().clone().empty(),
														par = $(button).siblings('.input-container')[0],
														innerCont = $("<span class='input-inner-container'></span>"),
														removeButton = $($.parseHTML("<button type='button' onclick='MynyteApi.removeFormInputFromForm(this);' class='remove-input-button mynyte-button mynyte-button-secondary mynyte-button-secondary-alt mynyte-button-secondary-dark mynyte-button-with-icon'><span class='mynyte-button-inner-wrapper'><i class='fa fa-minus'></i><span>Remove</span></span></button>"));

													newInput.val('').addClass('mynyte-removeable-input').appendTo(innerCont);
													removeButton.appendTo(innerCont);
													if (newImg) {
														newImg.innerHTML = "";
														newImg.appendTo(innerCont);
													}
													innerCont.appendTo(par);
												};
												//Should actually check if the option is a select-style option
												if (dataType.indexOf('INT') > -1 && propType != null) {
													var propSubType = modelProperties[prop]["Related Property Sub-Type"] || 'Landlord',
														propLabel = modelProperties[prop]["Related Property Label"] || 'Business Entity Item',
														propSubLabel = modelProperties[prop]["Related Property Sub-Label"] || "'Related Business Entity Specific Item Type'",
														propViewModelProps = modelProperties[prop]["Related Property ViewModel Props"] || ['_id'];

													propType = modelProperties[prop]["Related Property Type"] || 'Business Item';

														
													if (modelProperties[prop]["Related Property ViewModel Props"]) {
														var viewModelProps = modelProperties[prop]["Related Property ViewModel Props"].split(",");
														propViewModelProps = [];
														for (var a = 0; a < viewModelProps.length; a++) {
															viewModelProps[a] = viewModelProps[a].trim();
															propViewModelProps.push(viewModelProps[a]);
														}
													}
													/*
													propType = 'Catalogue Item';
													propSubType = 'Property';
													propLabel = 'Business Entity Item';
													propSubLabel = "'Related Business Entity Specific Item Type'";
													propViewModelProps = ['_id', 'Address Line 1'] || ['_id'];
													*/
															
													var itemTypeObj = genericItemTypeObj({element: propLabel, propType: propType, propSubLabel: propSubLabel, propSubType: propSubType});
													
													dataConnect({
														className: itemTypeObj[propLabel].class, action: itemTypeObj[propLabel].action, 
														data: itemTypeObj[propLabel].data,
														successCallback: function (params) {
															var viewType = 'Dropdown Selection',
																_businessId = MynyteApi.pageVars['New Business Item Forms'][0]._businessId,
																ind = 0, 
																successData = params.successData, 
																businessItems = {}, 
																htmlString = "", 
																htmlElem = null,
																htmlPropNameToDisplay = modelProperties[prop].Name.substr((modelProperties[prop].Name.indexOf('_') == 0) ? 1: 0, modelProperties[prop].Name.length).replace(" Id", ""),
																propNameCssFormat = modelProperties[prop].Name.replace(/ /g, '-').toLowerCase(),
																popupHtml = '<div class="mynyte-popup-cover dropdown-wrapper '+propNameCssFormat+'-dropdown-wrapper"><div class="mynyte-popup"><div class="mn-popup-body"><div class="dropdown-wrapper '+propNameCssFormat+'-dropdown-wrapper"><h4>Select a '+htmlPropNameToDisplay+'</h4><i data-name="' + propNameCssFormat + '" class="fa fa-times" onclick="MynyteApi.toggleRelatedItemSelect(event, this);"></i><ul class="dropdown '+propNameCssFormat+'-dropdown"></ul></div></div></div>';
																
															MynyteApi.pageVars['Page Object']["Business Items"] = {};
																
															$('body').append(popupHtml);

															loopObjPropsToCompileObj ({'format': 'default', 'viewType': viewType, '_businessId': _businessId, 'i': ind, 'successData': successData, 'businessItems': {}, 'htmlString': "", 'htmlElem': $('.dropdown.'+propNameCssFormat+'-dropdown'), 'viewModelProps': propViewModelProps});

															inputString = formFieldHTML({fieldType: 'Fake', prop: modelProperties[prop]});
															
															addPropFinal(i, isReqLabel, inputString);
														},
														errorCallback: function (errorDara) {
															console.log("error: ", errorData);
														}
													});
												}
												else {

													if (dataType.indexOf('VARCHAR') > -1) {
														var size = dataType.substr(dataType.indexOf('(') + 1, dataType.indexOf(')') - dataType.indexOf('(') - 1);
														var fieldType = (parseInt(size) <= 1000) ? 'Text': 'Textarea';

														inputString = formFieldHTML({fieldType: fieldType, prop: modelProperties[prop]});
													}
													/* THE REAL METHOD TO USE FOR INT WITH NO EXTRA LOGIC NEEDED */
													else if (dataType.indexOf('INT') > -1 && propType == null) {
														inputString = formFieldHTML({fieldType: 'Number', prop: modelProperties[prop]});
													}
													else if (dataType == 'DATE') {
														inputString = formFieldHTML({fieldType: 'DATE', prop: modelProperties[prop]});
														
													}
													else if (dataType == 'TIME') {
														inputString = formFieldHTML({fieldType: 'TIME', prop: modelProperties[prop]});
														
													}
													else if (dataType == 'IMAGE') {
														MynyteApi.imageUploadFileTypeCheck = function (elem) {

															function readFile(a) {
																var reader = new FileReader();

			   													reader.readAsDataURL(elem.files[a]);
			   													reader.onload = function (read) {
			    													var imgTest = new Image();

			    													function createRealImg (t) {
			    														var imgOuterContainer = $('<div class="img-outer-container"></div>');
			    														var imgContainer = $('<div class="img-container"></div>');
			    														var imgInputContainer = $('<div class="img-input-container"></div>');
				    													var img = $('<img />');
				    													var imgsContainer = $(elem).parent('span').find('.mynyte-image-input-images');
				    													img.attr('src', reader.result);
				    													img.attr('style', 'margin-top: ' + t);

				    													imgContainer.append(img);
				    													imgOuterContainer.append(imgContainer);
				    													//imgInputContainer.append($('<input class="img-container-alt mynyte-form-input mynyte-form-text-input" type="text" placeholder="Image Alternative Text (for SEO)"/>'));
				    													//imgInputContainer.append($('<input class="img-container-title mynyte-form-input mynyte-form-text-input" type="text" placeholder="Image Title" />'));
				    													imgOuterContainer.append(imgInputContainer);
				    													imgsContainer.append(imgOuterContainer);

				    													if (a < elem.files.length - 1) {
				    														readFile(a+1);
				    													}
				    													else {

				    													}
			    													}

																	imgTest.onload = function() {
																		var w = this.width, h = this.height, t = ((((w-h)/w)*100)/2) + '%';
				    													createRealImg(t);
																	};

																	imgTest.src = reader.result;
			   													};
																reader.onerror = function (error) {
			     													console.log('Error: ', error);
			   													};
		   													}

		   													readFile(0);
														};

														inputString = formFieldHTML({fieldType: 'IMAGE', prop: modelProperties[prop]});
													}

													addPropFinal(i, isReqLabel, inputString);
												}
											};

											compilePropHtmlToAdd(0);
										}
									}
								}

								MynyteApi.addBusinessItem = function () {
									var pageObjectModel = MynyteApi.pageVars['Page Object'].Model;
									MynyteApi.pageVars['Page Object']['Has Error'] = false;

									function alterElemClass (action, inputType) {
										if (action == "add") {
											switch (inputType) {
												case 'input':
													$('input[name="' + name + '"]').addClass('mynyte-input-error');
												break;
												case 'div':
													$('div[data-name="' + name + '"]').addClass('mynyte-input-error');
												break;
												case 'textarea':
													$('textarea[name="' + name + '"]').addClass('mynyte-input-error');
												break;
											}
										}
										else if (action == "remove") {
											switch (inputType) {
												case 'input':
													$('input[name="' + name + '"]').removeClass('mynyte-input-error');
												break;
												case 'div':
													$('div[data-name="' + name + '"]').removeClass('mynyte-input-error');
												break;
												case 'textarea':
													$('textarea[name="' + name + '"]').removeClass('mynyte-input-error');
												break;
											}
										}
									}


									var assignValToPageObject = function (i, val) {
										val = (typeof(val) === 'undefined') ? val : val.toString().replace("'", '&#39;').replace('"', '&#34;');
										if (i > 0) {
											pageObjectModel[prop].Value.push(val);
										}
										else if (isArr) {
											pageObjectModel[prop].Value = [val];
										}
										else {
											pageObjectModel[prop].Value = val;
										}
									};

									var handleInputVal = function (i) {
										var input = $('input[name="' + name + '"]').eq(i);

										if (input.attr('type') == 'file' && input[0].files[0]) {
											var inputImageAlt = input.siblings('.mynyte-image-input-images').eq(0).find('input.img-container-alt').val();
											var inputImageTitle = input.siblings('.mynyte-image-input-images').eq(0).find('input.img-container-title').val();
											valToAssign = input[0].files[0].name;
											pageObjectModel[prop].IsImage = true;
											pageObjectModel[prop].AltText = inputImageAlt;
											pageObjectModel[prop].TitleText = inputImageTitle;
										}
										else {
											valToAssign = input.val();
										}

										assignValToPageObject(i, valToAssign);
										inputType = 'input';
									};

									var handleDivVal = function (i) {
										name = name.toLowerCase().replace(/ /g, "-");
										valToAssign = $('div[data-name="' + name + '"]').data('selected-item-ref');

										assignValToPageObject(i, valToAssign);
										
										inputType = 'div';
									};

									var handleTextareaVal = function (i) {
										valToAssign = $('textarea[name="' + name + '"]').val();

										assignValToPageObject(i, valToAssign);

										inputType = 'textarea';
									};

									var handleErrorVal = function () {
										pageObjectModel[prop].error = "Please fill in a value for this field";
										alterElemClass("add", inputType);
										MynyteApi.pageVars['Page Object']['Has Error'] = true;
									};

									var reverseErrorValHandling = function () {
										pageObjectModel[prop].error = null;
										alterElemClass("remove", inputType);
									};

									for (var prop in pageObjectModel) {
										var name = pageObjectModel[prop].Name.toLowerCase().replace(/ /g, "-"),
											inputType = null,
											isArr = pageObjectModel[prop].Name.indexOf(' Arr[]' > -1),
											valToAssign = null,
											a = 0;

										if ($('input[name="' + name + '"]').length) {
											for (a = 0; a < $('input[name="' + name + '"]').length; a++) {
												handleInputVal(a);
											}
										}
										else if ($('div[data-name="' + name + '"]').length) {
											for (a = 0; a < $('div[data-name="' + name + '"]').length; a++) {
												handleDivVal(a);
											}
										}
										else if ($('textarea[name="' + name + '"]').length) {
											for (a = 0; a < $('textarea[name="' + name + '"]').length; a++) {
												handleTextareaVal(a);
											}
										}

										if (pageObjectModel[prop]["Is Required"] && ((pageObjectModel[prop].Value == "" || typeof(pageObjectModel[prop].Value) === 'undefined') && pageObjectModel[prop]) ) {
											handleErrorVal();
										}
										else if (pageObjectModel[prop]["Is Required"]) {
											reverseErrorValHandling();
										}
									}

									MynyteApi.pageVars['Page Object'].Model = pageObjectModel;
									
									if (!MynyteApi.pageVars['Page Object']['Has Error']) {
										var inputString = "",
											formData = new FormData($('form[name="mynyte-business-item-add-form"]')[0]);

										for(var keys = Object.keys(pageObjectModel), i = 0, end = keys.length; i < end; i++) {
											var checkForEndOfLoop = function checkForEndOfLoop () {
												if (i < end - 1) { inputString += ",";}
											  	else if (i == end - 1) {
											  		if (typeof(MynyteApi.pageVars['New Business Item Forms'][0].businessEntityItemSubType) !== 'undefined') {
											  			inputString += ", [['" + MynyteApi.pageVars['New Business Item Forms'][0].businessEntityItemTypeLabel + "', '" + MynyteApi.pageVars['New Business Item Forms'][0].businessEntityItemSubType + "']]";	
											  		}
											  		inputString += ", [['Date Created', CURDATE()]], [['Time Created', CURTIME()]]";
											  	}
											};
											if (pageObjectModel[keys[i]].Value.constructor === Array) {
												for (var val = 0; val < pageObjectModel[keys[i]].Value.length; val++) {
													inputString += "[['" + pageObjectModel[keys[i]].Name + "', '" + pageObjectModel[keys[i]].Value[val] + "']]";

													if (val == pageObjectModel[keys[i]].Value.length - 1) {
														checkForEndOfLoop();
													}
													else {
														inputString += ",";
													}
												}
											}
											else {
											  	inputString += "[['" + pageObjectModel[keys[i]].Name + "', '" + pageObjectModel[keys[i]].Value + "']]";

											  	checkForEndOfLoop();
											}
										}

										dataConnect({
											className: 'BusinessEntity', 
											action: 'addBusinessEntityItem', 
											data: {
												_businessId: MynyteApi.pageVars['New Business Item Forms'][0]._businessId,
												businessEntityItemName: MynyteApi.pageVars['New Business Item Forms'][0].businessEntityItemType,
												nameValuePairString: inputString
											},
											successCallback: function (params) {
												var successData = params.successData;
												//window.location.href = MynyteApi.pageVars['New Business Item Forms'][0]['onUploadCompleteUrl'];
											},
											errorCallback: function (errorData) {

											}
										});
										internalDataConnect({
											className: 'Image', 
											action: 'uploadImage', 
											data: formData,
											successCallback: function (params) {
												var successData = params.successData;
												//window.location.href = MynyteApi.pageVars['New Business Item Forms'][0]['onUploadCompleteUrl'];
											},
											errorCallback: function (errorData) {

											}
										});
										
									}

									return false;
								};

								createForm();

							/*
							RELATING TO LEGAL SERVE SPECIFICALLY
							dataConnect({className: 'BusinessEntity', action: 'getBusinessEntityItems', 
								data: {
									_businessId: 1,
									businessEntityItemType: "Business User Account",
									businessItemPropertyString: "('Name')"
								},
								existingVars: thisSuccessData,
								successCallback: function (params) {
									sortUserAccounts(params.existingVars, params.successData["items"]);
								},
								errorCallback: function (errorData2) { }
							});
							*/
						},
						errorCallback: function (errorData) {

						}
					});


				}
			});
		});

		MynyteApi.processContact = function (obj) {
			$.ajax({
			  url: "https://www.mynyte.co.uk/sneak-preview/data/extApi/Profile.php?action=registerContact",
			  method: "POST",
			  data: JSON.stringify(obj),
			  dataType: 'json'
			}).success(function (successData) {
				console.log('processContact successData: ', successData);
			}).error(function (errorData) {
        		console.log(errorData);
			});
		};

		MynyteApi.openPopup = function (params) {
			openPopup(params);
		};

		MynyteApi.closePopup = function (params) {
			closePopup(params);
		};

		MynyteApi.dataConnect = function (params) {
			dataConnect(params);
		};
		
		MynyteApi.createFeed = function (params) {
			createFeed(params);	
		};
		
		MynyteApi.createButton = function (params) {
			createButton(params);	
		};
		
		MynyteApi.createPortal = function (params) {
			createPortal(params);	
		};
		
		MynyteApi.toggleRelatedItemSelect = function (event, elem) {
			toggleRelatedItemSelect(event, elem);
		};
		
		MynyteApi.addItemToFormFromDropdown = function (button) {
			addItemToFormFromDropdown(button);
		};
		
	};

	MynyteApi();


		
		
})();
