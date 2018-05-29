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
MynyteApi.pageVars = {
	_businessId: _bid
};
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

function propNameCssFormatter(name) {
    return name.replace(/ /g, '-').replace(/\[/g, "").replace(/\]/g, "").toLowerCase();
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

function internalDataFileConnect (params) {
	var className = params.className;
	var action = params.action;
	var data = params.data || null;
	var existingVars = params.existingVars || null;
	var successCallback = params.successCallback || function () {};
	var errorCallback = params.errorCallback || function () {};

	var actionPropsMap = {
		uploadImage: {
			type: "POST", cache: false, processData: false, async: true
		}
	};

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

function internalDataConnect (params) {
	var className = params.className;
	var action = params.action;
	var data = params.data || null;
	var existingVars = params.existingVars || null;
	var successCallback = params.successCallback || function () {};
	var errorCallback = params.errorCallback || function () {};

	var actionPropsMap = {
		removeImage: {
			type: "POST"
		}
	};

	$.ajax({
		url: MynyteApi.pageVars['New Business Item Forms'][0].internalDataUrl+"/"+className+".php?action="+action,
		type: actionPropsMap[action].type,
		dataType: "json",
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

	function createPopup(params) {
	var popupHtml = "";
	console.log(params);
	params.oldClass = params.class;
	params.class = (params.class) ? ' ' + params.class : '';

	if ($('.mynyte-popup-cover.'+params.oldClass).length == 0) {
		var div = $("<div/>").appendTo($('body'));
		div.attr('class', 'mynyte-popup-cover ' + params.oldClass);

		if (params.class == " menu-item-detail") {
			popupHtml = '<div class="mynyte-popup'+params.class+'">';
				popupHtml += '<div class="mn-popup-header">';
					popupHtml += '<h4 class="menu-item-title"></h4>';
					popupHtml += '<i class="fa fa-times mn-popup-close" onclick="MynyteApi.closePopup({});"></i>';
				popupHtml += '</div>';
				popupHtml += '<div class="mn-popup-body">';
					popupHtml += '<img src="#" alt=""/>';
					popupHtml += '<p class="menu-item-description"></p>';
				popupHtml += '</div>';
			popupHtml += '</div>';
		}
		else if (params.class == " business-item-success") {
			popupHtml = '<div class="mynyte-popup'+params.class+'">';
				popupHtml += '<div class="mn-popup-header">';
					popupHtml += '<h4 class="menu-item-title">' + params.itemName + ' Uploaded</h4>';
					popupHtml += '<i class="fa fa-times mn-popup-close" onclick="MynyteApi.closePopup({});"></i>';
				popupHtml += '</div>';
				popupHtml += '<div class="mn-popup-body">';
					popupHtml += '<p>Your ' + params.itemName + ' has been successfully uploaded</p>';
					popupHtml += '<a class="button-link mynyte-button mynyte-button-secondary" target="_blank" href="' + params.itemLink + params._itemId +'">See your new ' + params.itemName + '</a>';
					popupHtml += '<button class="mynyte-button-primary mynyte-button" onClick="window.location.reload()">Upload another ' + params.itemName + '</button>';
				popupHtml += '</div>';
			popupHtml += '</div>';
		}
		else if (params.class == " remove-image") {
			popupHtml = '<div class="mynyte-popup'+params.class+'">';
				popupHtml += '<div class="mn-popup-header">';
					popupHtml += '<h4 class="menu-item-title">Delete Image</h4>';
					popupHtml += '<i class="fa fa-times mn-popup-close" onclick="MynyteApi.closePopup({class: \'remove-image\'});"></i>';
				popupHtml += '</div>';
				popupHtml += '<div class="mn-popup-body">';
					popupHtml += '<p>Are you sure you want to delete this image? This action cannot be undone.</p>';
					popupHtml += '<button class="mynyte-button-primary mynyte-button" onclick="MynyteApi.confirmRemoveImage();">Delete Item</button>';
					popupHtml += '<button class="mynyte-button-secondary mynyte-button" onclick="MynyteApi.closePopup({class: \'remove-image\'});">Cancel</button>';
				popupHtml += '</div>';
			popupHtml += '</div>';
		}
		else if (params.class == " simple-loader") {
			popupHtml = '<div class="mynyte-popup'+params.class+'">';
				popupHtml += '<div class="mn-popup-body">';
					popupHtml += '<i class="fa-' + params.iconClass + ' fa"></i>';
					popupHtml += '<p>' + params.message + '</p>';
				popupHtml += '</div>';
			popupHtml += '</div>';
		}

		$('.mynyte-popup-cover.'+params.oldClass).append(popupHtml);

	}
}

function openPopup(params) {
	var speed = (params.speed == 'fast') ? 1: 250,
		className = (params.class) ? '.'+params.class: '';
	lockScroll();
	disableScrolling();

	//Only for IOS
	if (navigator.userAgent.match(/(iP(od|hone|ad))/)) {   
		var offset = document.body.scrollTop;
		document.body.style.top = (offset * -1) + 'px';
		document.body.classList.add('mn-modal--opened');
	}

	window.setTimeout(
		function () {$('.mynyte-popup-cover'+className).addClass("mynyte-popup-open");
	}, speed);

	if (params.onComplete) {
		params.onComplete();
	}
}
MynyteApi.openPopup = openPopup;

function closePopup(params) {
	var className = (params.class) ? '.'+params.class: '';
	$('.mynyte-popup-cover.mynyte-popup-open').removeClass("mynyte-popup-open");
	console.log($('.mynyte-popup-cover'+className));
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
MynyteApi.closePopup = closePopup;

	function genericItemTypeObj (params) {
	var obj = {};
	var genericItemTypeObj = {
		'Business Entity Item': function () {
			obj = {
				'Business Entity Item': {
					class: 'BusinessEntity', action: 'getBusinessEntityItems',
					data: {
						_businessId: MynyteApi.pageVars._businessId,
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
		},
		'Edit': function () {
			obj = {
				html: "<div class='mynyte-form-field-container mynyte-button-container'><button id='mynyte-item-edit-button' class='mynyte-button-secondary mynyte-button' onclick='MynyteApi.editButtonClicked(this)'><span class='mynyte-button-inner-wrapper'><i class='fa fa-edit'></i><span>Edit</span></span></button></div>"
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
	console.log("meta", metaName, metaValue, params.dataType);

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
			console.log(params.item._itemId);
			html += "<"+ elemType + dataPropToDisplayString() +" class='mynyte-business-items-summary-item"+dropdownClass+"' data-item-ref='"+params.item._itemId+"'>";
		},
		'nonArrayProp': function () {
			var cssPropToDisplay = globalSetup.cssPropToDisplay();
			var imgClass = (params.prop.indexOf('Image') > -1) ? " with-image": "";

			html += "<div class='mynyte-label-container "+cssPropToDisplay+"-label-container'><label class='mynyte-label'>" + params.prop + "</label>";
			html += "<span class='mynyte-label-detail" + imgClass + "'>";
			html += (params.prop.indexOf('Image') == -1) ? params.item[params.prop] : "";
			html += (params.prop.indexOf('Image') > -1) ? "<img class='mynyte-label-img' src='" + params.internalDataUrl + "images/" + params.item[params.prop] + "' />" : "";
			html += "</span></div>";
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
			html += "<a href='" + params.dataLink + params._itemId + "' class='action-button view-detail-button'>View Detail</a>";
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
	var html = "",
		itemsLen = params.itemsLen,
		currentPage = params.currentPage,
		pageItemLimit = params.pageItemLimit;

	var globalSetup = {
	};

	var businessItemsSummaryGeneralHTML = {
		'pager': function () {
			var pages = itemsLen / pageItemLimit,
				lowInd = ((params.currentPage - 1) * pageItemLimit) + 1,
				highInd = ((params.currentPage - 1) * pageItemLimit) + pageItemLimit,
				selectedStr;
			highInd = (highInd > itemsLen) ? itemsLen: highInd;

			html += "<div class='mynyte-items-pager'><span class='mn-pager-text'>Currently showing results " + lowInd + " to " + highInd + " out of " + itemsLen + ".</span>";
			html += "<span class='mn-pager-dropdown'><span>Go to page:</span> <select onchange='MynyteApi.changeBusinessItemsCurrentPage(this);'>";
			for (var a = 0; a < pages; a++) {
				selectedStr = (a+1 == currentPage) ? " selected='selected'": "";
				html += "<option value='page_" + (a + 1) + "'"+ selectedStr +">" + (a + 1) + "</option>"; 
			}
			html += "</select></div>";
		},
		'noItemsNote': function () {
			html += "<div>" + params.text + "</div>";
		}
	};

	businessItemsSummaryGeneralHTML[params.element]();
	return html;
}

function formFieldHTML(params) {
	var inputString = "";
	var dataType, name, isReq, maxLen, minLen, propNameCssFormat, propType, propSubType, prop = params.prop, isArray, removeableClass;

	var globalFieldSetup = {
		dataType: function () {dataType =  prop["Data Type"];},
		name: function () {name = propNameCssFormatter(prop.Name);},
		isReq: function () {isReq = (prop["Is Required"]) ? " required-input": "";},
		maxLen: function () {maxLen = (prop["Max Length"]) ? " data-maxLength='"+prop["Max Length"]+"'": "";},
		minLen: function () {minLen = (prop["Min Length"]) ? " data-minLength='"+prop["Min Length"]+"'": "";},
		propNameCssFormat: function () {propNameCssFormat = propNameCssFormatter(prop.Name);},
		propType: function () {propType = prop["Related Property Type"];},
		propSubType: function () {propSubType = prop["Related Property Sub-Type"];},
		isArray: function () {isArray = prop.Name.indexOf(" Arr[]") > -1;},
		removeableClass: function () {removeableClass = (params.index > 0) ? ' mynyte-removeable-input': '';},
		selectedItemRef: function () {selectedItemRegTag = (params.formType == 'edit-item-form') ? " data-selected-item-ref='" + params.value + "'": "";}
	};

	var createFieldHTML = {
		'Text': function () {
			inputString += "<input name = '" +name+ "' data-name='" +name+ "' value='" + ((typeof(params.value) !== 'undefined') ? params.value: '')+ "' class='mynyte-form-input mynyte-form-text-input"+isReq+removeableClass+"' type='text' "+maxLen+""+minLen+" />";
			if (maxLen != "") {
				inputString += "<span class='input-maxlength-note'>" + maxLen + " Char Max</span>";
			}
		},
		'Textarea': function () {
			inputString += "<textarea rows='3' name='" +name+ "' data-name='" +name+ "' class='mynyte-form-input mynyte-form-textarea-input"+isReq+removeableClass+"' "+maxLen+""+minLen+" >" + ((typeof(params.value) !== 'undefined') ? params.value: '') + "</textarea>";
			if (maxLen != "") {
				inputString += "<span class='input-maxlength-note'>" + maxLen + " Char Max</span>";
			}
		},
		'Number': function () {
			inputString += "<input name='"+name+"' data-name='" +name+ "' value='" + ((typeof(params.value) !== 'undefined') ? params.value: '')+ "' class='mynyte-form-input mynyte-form-text-input"+isReq+removeableClass+"' type='number' "+maxLen+""+minLen+" />";
		},
		'Double': function () {
			inputString += "<input name='"+name+"' data-name='" +name+ "' value='" + ((typeof(params.value) !== 'undefined') ? params.value: '')+ "' class='mynyte-form-input mynyte-form-text-input"+isReq+removeableClass+"' type='number' step='0.01' "+maxLen+""+minLen+" />";
		},
		'Fake': function () {
			inputString += "<div data-index='" + params.index + "' name='" + propNameCssFormat + "' data-name='" + propNameCssFormat + "' class='mynyte-form-input mynyte-form-fake-input"+removeableClass+"' onclick='return MynyteApi.toggleRelatedItemSelect(event, this)'" + selectedItemRegTag + "><span class='selected-option-label'>" + ((typeof(params.displayValue) !== 'undefined') ? params.displayValue: 'Select an Option') + "</span><button class='mynyte-form-select-toggler'><i class='fa fa-chevron-down'></i></button></div>";
		},
		'IMAGE': function () {
			if (params.formType == 'edit-item-form') {
				inputString += "<span class='existing-img-container'><img src='mynyte-data/images/" + params.value + "' /><span data-src='" + params.value + "' data-prop-name='" + prop.Name + "' class='remove-img-button' onclick='MynyteApi.removeImage(this)'>x</span></span>";
			}
			inputString += "<span style='display: " + ((params.formType != 'edit-item-form') ? 'inherit': 'none') + "'><input data-dummy='" + ((params.formType != 'edit-item-form') ? 'false': 'true') + "' onchange='MynyteApi.imageUploadFileTypeCheck(this)' data-name='" + name + "' name='" +name+(params.index||0)+ "' class='mynyte-form-input mynyte-form-image-input"+isReq+removeableClass+"' type='file' accept='image/*' "+maxLen+""+minLen+"/><span class='mynyte-image-input-images'></span></span>";
		},
		'FILE': function () {
			if (params.formType == 'edit-item-form') {
				inputString += "<span class='existing-img-container'><img src='mynyte-data/images/" + params.value + "' /><span data-src='" + params.value + "' data-prop-name='" + prop.Name + "' class='remove-img-button' onclick='MynyteApi.removeImage(this)'>x</span></span>";
			}
			inputString += "<span style='display: " + ((params.formType != 'edit-item-form') ? 'inherit': 'none') + "'><input data-dummy='" + ((params.formType != 'edit-item-form') ? 'false': 'true') + "' onchange='MynyteApi.imageUploadFileTypeCheck(this)' name='" +name+params.index+ "' data-name='" +name+ "' class='mynyte-form-input mynyte-form-image-input"+isReq+removeableClass+"' type='file' "+maxLen+""+minLen+"/><span class='mynyte-image-input-images'></span></span>";
		},
		'DATE': function () {
			inputString += "<div name='" + name + "' data-name='" +  name + "' class='mynyte-form-input mynyte-form-fake-input"+isReq+removeableClass+"'" + selectedItemRegTag + "><span>" + ((typeof(params.value) !== 'undefined') ? params.value: '') + "</span><button id='datepicker-"+ propNameCssFormat +"' type='button' class='mynyte-form-datepicker "+ propNameCssFormat +"'><i class='fa fa-calendar'></i></button></div>";
		},
		'TIME': function () {
			inputString += "<div name='" + name + "' data-name='" +  name + "' class='mynyte-form-input mynyte-form-fake-input"+isReq+removeableClass+"'" + selectedItemRegTag + "><span>" + ((typeof(params.value) !== 'undefined') ? params.value: '') + "</span><button id='timepicker-" + propNameCssFormat + "' class='mynyte-form-timepicker'><i class='fa fa-clock'></i></button></div>";
		}
	};

	//globalFieldSetup[params.prop]();
	for (var val in globalFieldSetup) {
		globalFieldSetup[val]();
	}
	inputString += (params.index == 0 || params.index == null) ? "<span class='input-container'>": '';
	inputString += (params.index == 1) ? '<span class="input-inner-container">': '';
	createFieldHTML[params.fieldType]();
	inputString += (params.index > 0) ? '<button type="button" onclick="MynyteApi.removeFormInputFromForm(this);" class="remove-input-button mynyte-button mynyte-button-secondary mynyte-button-secondary-alt mynyte-button-secondary-dark mynyte-button-with-icon"><span class="mynyte-button-inner-wrapper"><i class="fa fa-minus"></i><span>Remove</span></span></button>': '';
	inputString += (params.index == params.maxIndex && params.index != null) ? "</span>": ''; // end the input inner container
	inputString += (params.index == params.maxIndex || params.index == null) ? "</span>": ''; // end the input container

	if (!!isArray && (params.index == null || params.index == params.maxIndex)) {
		inputString += "<button onclick='MynyteApi.addFormInputToForm(this)' class='add-input-button mynyte-button mynyte-button-secondary mynyte-button-with-icon' type='button'><span class='mynyte-button-inner-wrapper'><i class='fa fa-plus'></i><span>Add Another</span></span></button>";
	}

	return inputString;
}

function formGeneralHTML(params) {
	var htmlString = "";
	var formGeneralHTML = {
		'formStart': function () {
			var onSub = (params.formType != 'edit-item-form') ? 'MynyteApi.addOrUpdateBusinessItem("add")': 'MynyteApi.addOrUpdateBusinessItem("edit")';
			htmlString += "<form action='#' name='mynyte-business-item-add-form' id='mynyte-business-item-add-form' onsubmit='return " + onSub + ";' data-item-id='" + params._businessEntityItemId + "'>";
		},
		'formFieldLabel': function () {
			var name = params.prop.Name.replace(" Arr[]", "s").replace(" Id", "").replace("_Related", ""),
				isReqLabel = (params.prop["Is Required"]) ? " (Required)": "",
				cssName = params.prop.Name.replace(/ /g, "-").replace(".", "").toLowerCase();

			htmlString += "<div class='mynyte-form-field-container " + cssName + "-field-container'><label class='mynyte-form-field-label'>" + name + isReqLabel + "</label>";
			htmlString += "<div class='mynyte-form-input-container'>" + params.inputString;
			htmlString += (params.index == params.maxIndex || params.index == null) ? "</div></div>": "";
			console.log('formFieldLabel: ', params.index, params.maxIndex);
		},
		'formFieldContainer': function () {
			htmlString += params.inputString;
			htmlString += (params.index == params.maxIndex) ? "</div></div>": "";
			console.log('formFieldContainer: ', params.index, params.maxIndex);
		},
		'formComplete': function () {
			var text = (params.formType != 'edit-item-form') ? 'Add': 'Update';
			htmlString += "<div class='mynyte-form-field-container mynyte-button-container'><button type='submit'>" + text + " Item</button></div>";
			htmlString += "</form>";
		}
	};

	formGeneralHTML[params.element]();
	return htmlString;
}


MynyteApi.scripts.businessItemPropertyHtml = businessItemPropertyHtml;
MynyteApi.scripts.formFieldHTML = formFieldHTML;
MynyteApi.scripts.formGeneralHTML = formGeneralHTML;

	function prepareBusinessItemForm (modelProperties, htmlString) {
	var keys = Object.keys(modelProperties),
		newItems = [], dateProps = [],
		dataType, prop, isReqLabel, bidd, bif;
	var nonBootstrapProps = ["class", "onChangeDate"];

	var addFormDatePickers = function () {
		function bootstrapOnload() {
			for (var a = 0; a < dateProps.length; a++) {
				var thisProp = dateProps[a], obj = {}, bsObj = {};
				for (var prop in thisProp) {
					obj[prop] = thisProp[prop];
					if (nonBootstrapProps.indexOf(prop) == -1) {
						bsObj[prop] = thisProp[prop];
					}
				}
				console.log(obj, bsObj);
				$('.mynyte-form-datepicker.'+dateProps[a].class).datepicker(bsObj).on('changeDate', function () {
					if (obj.onChangeDate) {
						obj.onChangeDate();
					}
				});	
			}
		}
		if (!$.fn.datepicker) {
			MynyteApi.importBootstrapDatepicker({
				onLoad: function () {
					bootstrapOnload();
				}
			});
		}
		else {
			bootstrapOnload();
		}
	}
	
	var completeForm = function completeForm () {
		var bif = MynyteApi.pageVars['New Business Item Forms'][MynyteApi.pageVars['New Business Item Forms'].length - 1]
		htmlString += formGeneralHTML({element: 'formComplete', formType: bif.formType});

		MynyteApi.pageVars['Page Object'].Model = modelProperties;

		if ($( "div.mynyte-new-business-item").length) {
			bif = MynyteApi.pageVars['New Business Item Forms'][MynyteApi.pageVars['New Business Item Forms'].length - 1];
			console.log(bif);
			bif.elem.append(htmlString).css({'display': 'block'});
		}
		else if ($( "div.mynyte-business-item-detail").length) {
			bidd = MynyteApi.pageVars['Business Item Detail Displays'][MynyteApi.pageVars['Business Item Detail Displays'].length - 1];
			bidd.elem.children('.mynyte-label-container').hide();
			bidd.elem.append(htmlString).css({'display': 'block'});
			MynyteApi.pageVars['Business Item Detail Displays'][MynyteApi.pageVars['Business Item Detail Displays'].length - 1].onFormChangeComplete();
		}

		if (dateProps.length) {
			addFormDatePickers();
		}
	};
	
	var addPropFinal = function addPropFinal (i, isReqLabel, inputString, i2, maxIndex) {
		var prop = keys[i];

		htmlString += (i2 != null && i2 > 0) ? formGeneralHTML({element: 'formFieldContainer', prop: modelProperties[prop], inputString: inputString, index: i2, maxIndex: maxIndex}) : formGeneralHTML({element: 'formFieldLabel', prop: modelProperties[prop], inputString: inputString, index: i2, maxIndex: maxIndex});

		console.log(i2, maxIndex, "i2");
		
		if ((i < keys.length - 1 && i2 == null) || (i < keys.length - 1 && i2 != null && i2 == maxIndex)) {
			if (modelProperties[keys[i+1]]["Value"]) {
				compilePropHtmlToAdd(i+1, 0, modelProperties[keys[i+1]]["Value"].length - 1);
			}
			else {
				compilePropHtmlToAdd(i+1, null, null);
			}
		}
		else if (i < keys.length - 1 && i2 != null && i2 < maxIndex) {
			compilePropHtmlToAdd(i, i2+1, maxIndex);
		}
		else {
			completeForm();
		}	
	};

	var compilePropHtmlToAdd = function compilePropHtmlToAdd(i, i2, maxIndex) {
		var inputString = "",
			prop = keys[i],
			dataType = modelProperties[prop]["Data Type"],
			dataVal = modelProperties[prop]["Value"],
			isReq = (modelProperties[prop]["Is Required"]) ? " required-input": "",
			propType = modelProperties[prop]["Related Property Type"];

		console.log("prop: ", modelProperties[prop]);

		MynyteApi.removeFormInputFromForm = function (button) {
			var par = $(button).parents('.input-inner-container');

			par.remove();
		};

		MynyteApi.addFormInputToForm = function (button) {
			var numbers, nameAttr, newNum;
			var newInput = $(button).siblings('.input-container').find('.mynyte-form-input').last().clone(),
				newImg = $(button).siblings('.input-container').find('.mynyte-image-input-images').last().clone().empty(),
				par = $(button).siblings('.input-container')[0],
				innerCont = $("<span class='input-inner-container'></span>"),
				removeButton = $($.parseHTML("<button type='button' onclick='MynyteApi.removeFormInputFromForm(this);' class='remove-input-button mynyte-button mynyte-button-secondary mynyte-button-secondary-alt mynyte-button-secondary-dark mynyte-button-with-icon'><span class='mynyte-button-inner-wrapper'><i class='fa fa-minus'></i><span>Remove</span></span></button>"));

			newInput.attr("data-index", $(button).siblings('.input-container').find('.mynyte-form-input').length);
			newInput.attr("data-dummy", false);
			nameAttr = newInput.attr("name");
			numbers = nameAttr.match(/\d+/);

			if (numbers != null) {
				newNum = nameAttr.replace(/[0-9]/g, '');
				newNum += parseInt(numbers[0]) + 1;
				newInput.attr("name", newNum);
			}

			if ($(newInput).find('.selected-option-label').length) {
				$(newInput).find('.selected-option-label').find('span').html('');
			}

			newInput.val('').addClass('mynyte-removeable-input').appendTo(innerCont);
			removeButton.appendTo(innerCont);

			if (newImg) {
				newImg.innerHTML = "";
				newImg.appendTo(innerCont);
			}
			innerCont.appendTo(par);
		};

		function compileFieldHtml (val, i2, maxIndex) {
			var displayVal;
			var bif = MynyteApi.pageVars['New Business Item Forms'][MynyteApi.pageVars['New Business Item Forms'].length - 1];
			//Should actually check if the option is a select-style option
			if (dataType.indexOf('INT') > -1 && propType != null) {
				var propSubType = modelProperties[prop]["Related Property Sub-Type"] || 'Landlord',
					propLabel = modelProperties[prop]["Related Property Label"] || 'Business Entity Item',
					propSubLabel = modelProperties[prop]["Related Property Sub-Label"] || "'Related Business Entity Specific Item Type'",
					propViewModelProps = modelProperties[prop]["Related Property ViewModel Props"] || ['_id'];

				propType = modelProperties[prop]["Related Property Type"] || 'Business Item';

				function completeCompilingFakeFieldHtml () {
					for (var thisProp in MynyteApi.pageVars['Page Object']["Inner Business Items"][propSubType]) {
						if (thisProp == parseInt(val)) {
							displayVal = MynyteApi.pageVars['Page Object']["Inner Business Items"][propSubType][thisProp].Name;
						}
					}
					inputString = formFieldHTML({fieldType: 'Fake', prop: modelProperties[prop], value: val, displayValue: displayVal, index: i2, maxIndex: maxIndex, formType: bif.formType});
					addPropFinal(i, isReqLabel, inputString, i2, maxIndex);
				}

				
				if (i2 == 0 || i2 == null) {
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
								propNameCssFormat = propNameCssFormatter(modelProperties[prop].Name),
								popupHtml = '<div class="mynyte-popup-cover dropdown-wrapper '+propNameCssFormat+'-dropdown-wrapper"><div class="mynyte-popup"><div class="mn-popup-body"><div class="dropdown-wrapper '+propNameCssFormat+'-dropdown-wrapper"><h4>Select a '+htmlPropNameToDisplay+'</h4><i data-name="' + propNameCssFormat + '" class="fa fa-times" onclick="MynyteApi.toggleRelatedItemSelect(event, this);"></i><ul class="dropdown '+propNameCssFormat+'-dropdown"></ul></div></div></div>';

							MynyteApi.pageVars['Page Object']["Business Items"] = {};

							if (!MynyteApi.pageVars['Business Item Summary Displays']) {
								MynyteApi.pageVars['Business Item Summary Displays'] = [];
							}
							MynyteApi.pageVars['Business Item Summary Displays'][MynyteApi.pageVars['Business Item Summary Displays'].length] = {
								'viewModelProps': propViewModelProps,
								'currentPage': 1,
								'pageItemLimit': 0,
								'pagerEnabled': false,
								'viewModelProps': propViewModelProps
							};

							$('body').append(popupHtml);

							loopObjPropsToCompileObj ({'format': 'default', 'viewType': viewType, '_businessId': _businessId, 'i': ind, 'successData': successData, 'businessItems': {}, 'innerBusinessItemType': modelProperties[prop]["Related Property Sub-Type"], 'htmlString': "", 'htmlElem': $('.dropdown.'+propNameCssFormat+'-dropdown'), objIndex: MynyteApi.pageVars['Business Item Summary Displays'].length - 1});

							completeCompilingFakeFieldHtml();
						},
						errorCallback: function (errorData) {
							console.log("error: ", errorData);
						}
					});
				}
				else {
					console.log("PAGEVARS", MynyteApi.pageVars['Page Object']["Inner Business Items"][modelProperties[prop]["Related Property Sub-Type"]]);
					completeCompilingFakeFieldHtml();
				}
			}
			else {

				if (dataType.indexOf('VARCHAR') > -1) {
					var size = dataType.substr(dataType.indexOf('(') + 1, dataType.indexOf(')') - dataType.indexOf('(') - 1);
					var fieldType = (parseInt(size) <= 1000) ? 'Text': 'Textarea';

					inputString = formFieldHTML({formType: bif.formType, fieldType: fieldType, prop: modelProperties[prop], value: val, index: i2, maxIndex: maxIndex});
				}
				/* THE REAL METHOD TO USE FOR INT WITH NO EXTRA LOGIC NEEDED */
				else if (dataType.indexOf('INT') > -1 && propType == null) {
					inputString = formFieldHTML({formType: bif.formType, fieldType: 'Number', prop: modelProperties[prop], value: val, index: i2, maxIndex: maxIndex});
				}
				else if (dataType.indexOf('DOUBLE') > -1 && propType == null) {
					inputString = formFieldHTML({formType: bif.formType, fieldType: 'Double', prop: modelProperties[prop], value: val, index: i2, maxIndex: maxIndex});
				}
				else if (dataType == 'DATE') {
					inputString = formFieldHTML({formType: bif.formType, fieldType: 'DATE', prop: modelProperties[prop], value: val, index: i2, maxIndex: maxIndex});
					dateProps.push({
						class: propNameCssFormatter(modelProperties[prop].Name), 
						format: 'dd/mm/yyyy',
						autoclose: true,
						onChangeDate: function () {
							var button = $('#datepicker-'+propNameCssFormatter(modelProperties[prop].Name));
							var date = button.datepicker("getFormattedDate");
							var par = button.parent('div');
							par.attr("data-selected-item-ref", date);
							par.find('span').eq(0).html(date);
						}
					});
				}
				else if (dataType == 'TIME') {
					inputString = formFieldHTML({formType: bif.formType, fieldType: 'TIME', prop: modelProperties[prop], value: val, index: i2, maxIndex: maxIndex});
					
				}
				else if (dataType == 'IMAGE' || dataType == 'FILE') {
					MynyteApi.imageUploadFileTypeCheck = MynyteApi.imageUploadFileTypeCheck || function (elem) {

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

					if (bif.formType == 'edit-item-form') {
						MynyteApi.removeImage = MynyteApi.removeImage || function (elem) {
							$('.mynyte-img-to-remove').removeClass('.mynyte-img-to-remove');
							$(elem).addClass('mynyte-img-to-remove');
							MynyteApi.imageToRemove = {'src': $(elem).data('src'), 'propName': $(elem).data('prop-name')};
							createPopup({'class': 'remove-image', 'iconClass': 'circle-o-notch fa-spin fa-4x'});
							openPopup({'class': 'remove-image'});
						};

						MynyteApi.confirmRemoveImage = MynyteApi.confirmRemoveImage || function () {
							console.log(MynyteApi.imageToRemove);
							$('.mynyte-img-to-remove').parents('.existing-img-container').remove();
							
							dataConnect({
								className: 'BusinessEntity', 
								action: 'removePropertyFromBusinessEntityItem', 
								data: {
									_businessEntityItemId: $('form#mynyte-business-item-add-form').data('item-id'),
									metaName: MynyteApi.imageToRemove.propName,
									metaValue: MynyteApi.imageToRemove.src
								},
								successCallback: function (params) {
									MynyteApi.imageToRemove = {};
									closePopup({'class': 'remove-image'});
								},
								errorCallback: function (errorData) {

								}
							});
							internalDataConnect({
								className: 'Image', 
								action: 'removeImage', 
								data: {'src': MynyteApi.imageToRemove.src},
								successCallback: function (params) {}, errorCallback: function (errorData) {}
							});
						};
					}

					inputString = formFieldHTML({formType: bif.formType, fieldType: dataType, prop: modelProperties[prop], value: val, index: i2, maxIndex: maxIndex});
				}

				addPropFinal(i, isReqLabel, inputString, i2, maxIndex);
			}

		}
		
		if (typeof(dataVal) === 'undefined' || dataVal == '') {
			compileFieldHtml('', 0, 0);
		} else if (i2 == null) {
			compileFieldHtml(dataVal[0], 0, dataVal.length - 1);
		}
		else {
			compileFieldHtml(dataVal[i2], i2, dataVal.length - 1);
		}
	};

	//orderModelProps();
	if (modelProperties[keys[0]]["Value"]) {
		compilePropHtmlToAdd(0, 0, modelProperties[keys[0]]["Value"].length - 1);
	}
	else {
		compilePropHtmlToAdd(0, null, null);
	}
}
MynyteApi.prepareBusinessItemForm = prepareBusinessItemForm;

function mapBusinessItemValuesToModel(model, html) {
	var row, len = MynyteApi.pageVars["Page Object"].items.length;
	console.log("mapping: ", model, MynyteApi.pageVars["Page Object"].items);
	for (var z = 0; z < len; z++) {
		console.log(z);
		row = MynyteApi.pageVars["Page Object"].items[z];

		for (var prop in model) {
			if (model[prop].Name == row.metaName) {
				model[prop].Value = model[prop].Value || [];
				model[prop].Value.push(row.metaValue);
			}
		}

		if (z == len - 1) {
			console.log("z: ", z);
			prepareBusinessItemForm(model, html);
		}
	}
}

function prepareBusinessItemFormObject (successData, formType, _businessEntityItemId) {
	var htmlString = formGeneralHTML({element: 'formStart', formType: formType, _businessEntityItemId: _businessEntityItemId});
	var modelProperties = {};
	var indexBased = (successData.items[0].vmIndex != null);

	for (var a= 0; a < successData.items.length; a++) {
		if (indexBased && !modelProperties[successData.items[a].vmIndex]) {
			modelProperties[successData.items[a].vmIndex] = {i: successData.items[a].vmIndex};
		}
		else if (!indexBased && !modelProperties[successData.items[a]._propertyId]) {
			modelProperties[successData.items[a]._propertyId] = {i: successData.items[a].vmIndex};
		}

		var thisObj = (indexBased) ? modelProperties[successData.items[a].vmIndex] : modelProperties[successData.items[a]._propertyId];
		thisObj[successData.items[a].metaName] = successData.items[a].metaValue;

		if (a == successData.items.length - 1 && MynyteApi.pageVars['New Business Item Forms'][MynyteApi.pageVars['New Business Item Forms'].length - 1].formType != 'edit-item-form') {
			console.log(successData.items, modelProperties);
			prepareBusinessItemForm(modelProperties, htmlString);
		}
		else if (a == successData.items.length - 1 && MynyteApi.pageVars['New Business Item Forms'][MynyteApi.pageVars['New Business Item Forms'].length - 1].formType == 'edit-item-form') {
			mapBusinessItemValuesToModel(modelProperties, htmlString);
		}
	}
}

function createBusinessItemFormPageVar (params) {
	MynyteApi.pageVars['New Business Item Forms'] = MynyteApi.pageVars['New Business Item Forms'] || [];

	MynyteApi.pageVars['New Business Item Forms'][MynyteApi.pageVars['New Business Item Forms'].length] = {
		'elem': params.elem,
		'_businessId': params._businessId,
		'businessEntityItemType': params.businessEntityItemType,
		'businessEntityItemTypeLabel': params.businessEntityItemTypeLabel,
		'businessEntityItemSubType': params.businessEntityItemSubType,
		'_relatedViewModelId': params._relatedViewModelId,
		'onUploadCompleteUrl': params.onUploadCompleteUrl,
		'internalDataUrl': params.internalDataUrl || '/',
		'formType': params.formType || 'add-item-form'
	};

	if (window.location.href.indexOf('?_itemId') > -1) {
		MynyteApi.pageVars['New Business Item Forms'][MynyteApi.pageVars['New Business Item Forms'].length - 1]._businessEntityItemId = parseInt(window.location.href.substr(window.location.href.indexOf('?_itemId=') + 9, window.location.href.length));
	}

	return MynyteApi.pageVars['New Business Item Forms'].length - 1;
}

function initialiseBusinessItemFormFunctionsAndEvents(thisBif) {
	function handleFormProcessing (pageObjectModel) {
		MynyteApi.pageVars['Page Object']['Has Error'] = false;

		console.log("lo");
		function alterElemClass (action, inputType, name) {
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

		var handleInputVal = function (i, name) {
			var input = $('input[data-name="' + name + '"]').eq(i);
			var valToAssign;

			if ($(input).attr('data-dummy') != 'true') {
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
			}
		};

		var handleDivVal = function (i, name) {
			var valToAssign = $('div[data-name="' + name + '"]').eq(i).attr('data-selected-item-ref');
			assignValToPageObject(i, valToAssign);
		};

		var handleTextareaVal = function (i, name) {
			var valToAssign = $('textarea[data-name="' + name + '"]').val();
			assignValToPageObject(i, valToAssign);
		};

		var handleErrorVal = function (name) {
			pageObjectModel[prop].error = "Please fill in a value for this field";
			alterElemClass("add", inputType, name);
			MynyteApi.pageVars['Page Object']['Has Error'] = true;
		};

		var reverseErrorValHandling = function (name) {
			pageObjectModel[prop].error = null;
			alterElemClass("remove", inputType, name);
		};

		for (var prop in pageObjectModel) {
			var name = propNameCssFormatter(pageObjectModel[prop].Name),
				inputType = null,
				isArr = pageObjectModel[prop].Name.indexOf(' Arr[]' > -1),
				valToAssign = null,
				a = 0;

			if ($('input[data-name="' + name + '"]').length) {
				inputType = 'input';
				for (a = 0; a < $('input[data-name="' + name + '"]').length; a++) {
					handleInputVal(a, name);
				}
			}
			else if ($('div[data-name="' + name + '"]').length) {
				inputType = 'div';
				for (a = 0; a < $('div[data-name="' + name + '"]').length; a++) {
					handleDivVal(a, name);
				}
			}
			else if ($('textarea[data-name="' + name + '"]').length) {
				inputType = 'textarea';
				for (a = 0; a < $('textarea[data-name="' + name + '"]').length; a++) {
					handleTextareaVal(a, name);
				}
			}

			if (pageObjectModel[prop]["Is Required"] && ((pageObjectModel[prop].Value == "" || typeof(pageObjectModel[prop].Value) === 'undefined') && pageObjectModel[prop]) ) {
				handleErrorVal(name);
			}
			else if (pageObjectModel[prop]["Is Required"]) {
				reverseErrorValHandling(name);
			}
		}

		MynyteApi.pageVars['Page Object'].Model = pageObjectModel;
	}

	MynyteApi.toggleRelatedItemSelect = function (e, elem) {

		e.preventDefault();
		var propLabel = $(elem).data('name'),
			propIndex = $(elem).data('index'),
			popupCover = $('body').find('.dropdown-wrapper.'+propLabel+'-dropdown-wrapper').parents('.mynyte-popup-cover');
			
		if (popupCover.hasClass('mynyte-popup-open')) {
			popupCover.removeClass('mynyte-popup-open');
			popupCover.removeAttr('data-index');
		} else {
			popupCover.addClass('mynyte-popup-open');
			popupCover.attr('data-index', propIndex);
		}
	}
	
	MynyteApi.addItemToFormFromDropdown = function  (button) {
		var input, propLabel,
			li = $(button).parents('li'),
			item = li.data('item-ref'),
			propToDisplay = li.data('prop-to-display'),
			parUl = li.parents('ul.dropdown'),
			parCover = $(parUl).closest('.mynyte-popup-cover'),
			classList = parUl.attr('class').split(/\s+/);
			
		$(button).parents('.mynyte-popup-open').removeClass('mynyte-popup-open');
		$.each(classList, function(index, i) {
			if (i.indexOf('-dropdown') > -1) {
    			//do something
				propLabel = i.substr(0, i.indexOf('-dropdown'));
				input = $('.mynyte-form-input.mynyte-form-fake-input[data-name="'+propLabel+'"]').eq(parCover[0].dataset.index);
				
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

	MynyteApi.addOrUpdateBusinessItem = function (addOrUpdate) {
		console.log(addOrUpdate);
		var pageObjectModel = MynyteApi.pageVars['Page Object'].Model;
		var action = (addOrUpdate == 'add') ? 'addBusinessEntityItem': 'updateBusinessEntityItem';
		var newBifId = MynyteApi.pageVars['New Business Item Forms'].length - 1;
		var thisBif = MynyteApi.pageVars['New Business Item Forms'][newBifId];
		var inputString = "";
		handleFormProcessing(pageObjectModel);

		console.log(MynyteApi.pageVars['Page Object']);
		
		if (!MynyteApi.pageVars['Page Object']['Has Error']) {
			var formData = new FormData($('form[name="mynyte-business-item-add-form"]')[newBifId]),
				confirmationShown = false,
				imageUploadComplete = false, 
				_newItemId = null,
				data,
				itemDisplayName = (typeof(thisBif.businessEntityItemSubType) !== 'undefined') ? thisBif.businessEntityItemSubType: thisBif.businessEntityItemType;

			$('.mynyte-button-container button').attr("disabled", "disabled");
			createPopup({'class': 'simple-loader', 'iconClass': 'circle-o-notch fa-spin fa-4x', 'message': ((addOrUpdate == 'add') ? 'Adding ': 'Editing ') + itemDisplayName});
			openPopup({'class': 'simple-loader', 'speed': 'fast'});

			for(var keys = Object.keys(pageObjectModel), i = 0, end = keys.length; i < end; i++) {
				var checkForEndOfLoop = function () {
					if (i < end - 1) {
						inputString += ",";
					}
				  	else if (i == end - 1) {
				  		if (typeof(thisBif.businessEntityItemSubType) !== 'undefined') {
				  			inputString += ",[['" + thisBif.businessEntityItemTypeLabel + "', '" + thisBif.businessEntityItemSubType + "']]";	
				  		}
				  		inputString += (addOrUpdate == 'add') ? ",[['Date Created', CURDATE()]],[['Time Created', CURTIME()]]" : ",[['Date Updated', CURDATE()]],[['Time Updated', CURTIME()]]";
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

			data = (addOrUpdate == 'add') ? 
				{
					_businessId: thisBif._businessId,
					businessEntityItemName: thisBif.businessEntityItemType,
					nameValuePairString: inputString
				}: 
				{
					_businessId: thisBif._businessId,
					_businessEntityItemId: thisBif._businessEntityItemId,
					updateString: inputString
				}
			;

			dataConnect({
				className: 'BusinessEntity', 
				action: action, 
				data: data,
				successCallback: function (params) {
					var successData = params.successData;
					_newItemId = successData.item;
					if (addOrUpdate == 'add') {
						closePopup({'class': 'simple-loader'});
						createPopup({'class': 'business-item-success', 'itemName': 'Property', '_itemId': _newItemId, 'itemLink': 'new-property-admin.php?_itemId='});
						openPopup({'class': 'business-item-success'});
					}
					else {
						closePopup({'class': 'simple-loader'});
						MynyteApi.editButtonClicked($('#mynyte-item-edit-button'));
						//location.reload();
					}
					//window.location.href = MynyteApi.pageVars['New Business Item Forms'][0]['onUploadCompleteUrl'];
				},
				errorCallback: function (errorData) {

				}
			});
			internalDataFileConnect({
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
}

function formObjectInit(params) {
	var newBifId = createBusinessItemFormPageVar(params);
	var extraFiltersString = "";
	var thisBif = MynyteApi.pageVars['New Business Item Forms'][newBifId];

	MynyteApi.pageVars['Page Object'] = (thisBif.formType == 'edit-item-form') ? MynyteApi.pageVars['Page Object']: {};

	if ($( "div.mynyte-new-business-item").length && $( "div.mynyte-new-business-item").data('item-extra-filters').length) {
		for (var a = 0; a < $( "div.mynyte-new-business-item").data('item-extra-filters').split("||").length; a++) {
			var thisObj = $( "div.mynyte-new-business-item").data('item-extra-filters').split("||")[a];
			extraFiltersString += "[[" + thisObj + "]]";
		}
	}
	else {
		extraFiltersString = params.extraFiltersString;
	}

	dataConnect({className: 'BusinessEntity', action: 'getBusinessEntityItemModel', 
		data: {
			_businessId: MynyteApi.pageVars['New Business Item Forms'][newBifId]._businessId,
			businessEntityItemType: MynyteApi.pageVars['New Business Item Forms'][newBifId].businessEntityItemType,
			extraFiltersString: extraFiltersString,
			_relatedViewModelId: MynyteApi.pageVars['New Business Item Forms'][newBifId]._relatedViewModelId
		},
		existingVars: {
			newBifId: newBifId
		},
		successCallback: function (params) {
			var successData = params.successData;
			var existingVars = params.existingVars;
			var thisBif = MynyteApi.pageVars['New Business Item Forms'][existingVars.newBifId];
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

				initialiseBusinessItemFormFunctionsAndEvents(thisBif);

				prepareBusinessItemFormObject(successData, thisBif.formType, thisBif._businessEntityItemId);

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
MynyteApi.formObjectInit = formObjectInit;

	function itemViewObjectInit(params) {
	var bidd;

	MynyteApi.pageVars['Page Object'] = {};
	
	MynyteApi.pageVars['Business Item Detail Displays'] = MynyteApi.pageVars['Business Item Detail Displays'] || [];

	MynyteApi.pageVars['Business Item Detail Displays'][MynyteApi.pageVars['Business Item Detail Displays'].length] = {
		'elem': params.elem, 
		'businessEntityItemId': (window.location.href.indexOf('?_itemId') > -1) ? window.location.href.substr(window.location.href.indexOf('?_itemId=') + 9, window.location.href.length): params.businessEntityItemId || $("div.mynyte-business-item-detail").data('item-id'),
		'businessEntityItemType': params.businessEntityItemType || '/',
		'internalDataUrl': params.internalDataUrl|| '/',
		'_relatedViewModelId': params._relatedViewModelId,
		'htmlViewModelMethod': params.htmlViewModelMethod || 'default',
		'htmlViewModelScript': params.htmlViewModelScript || '',
		'htmlViewModelParams': params.htmlViewModelParams || {},
		'isEditable': params.isEditable || false,
		'businessEntityItemSubType': params.businessEntityItemSubType,
		'businessEntityItemTypeLabel': params.businessEntityItemTypeLabel,
		'UploadCompleteUrl': params.UploadCompleteUrl,
		'_businessId': params._businessId
	};
	bidd = MynyteApi.pageVars['Business Item Detail Displays'][MynyteApi.pageVars['Business Item Detail Displays'].length - 1];
	console.log(params);

	var getItemModel = function getItemModel () {
		dataConnect({
			className: 'BusinessEntity', 
			action: 'getBusinessEntityItemModel', 
			data: {
				_businessId: bidd._businessId,
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
			model = params.existingVars.model,
			oldParams = params.existingVars.oldParams,
			itemModel = {},
			finalItemModel = {},
			arrays = {},
			htmlString = "";
		MynyteApi.pageVars['Page Object'] = successData;

		function editButtonDisplayToggle(isEditing, b) {
			if (!!isEditing) {
				b.find('i').addClass('fa-close').removeClass('fa-edit');
				b.find('span.mynyte-button-inner-wrapper').find('span').html('Cancel');
			} else {
				b.removeClass('is-editing');
				b.find('i').addClass('fa-edit').removeClass('fa-close');
				b.find('span.mynyte-button-inner-wrapper').find('span').html('Edit');
			}
		}

		function formDisplayToggle(toHide, b) {
			var p = b.parents('.mynyte-button-container').eq(0);
			if (!!toHide) {
				console.log(toHide);
				p.siblings('.mynyte-label-container').show();
				p.siblings('form').hide();
			} else {
				p.siblings('.mynyte-label-container').hide();
				p.siblings('form').show();
			}
		};

		function editButtonClicked(button) {
			var b = $(button);
			if (!b.hasClass('is-editing')) {
				b.addClass('is-editing');

				var bidd2 = MynyteApi.pageVars['Business Item Detail Displays'][MynyteApi.pageVars['Business Item Detail Displays'].length - 1];
				if (typeof(bidd2.onFormChangeComplete) === 'undefined') {
					bidd2.onFormChangeComplete = function () {
						editButtonDisplayToggle(true, b);
					};

					var params2 = {
						'elem': bidd2.elem,
						'_businessId': bidd2._businessId,
						'businessEntityItemType': bidd2.businessEntityItemType,
						'businessEntityItemTypeLabel': bidd2.businessEntityItemTypeLabel,
						'businessEntityItemSubType': bidd2.businessEntityItemSubType,
						'_relatedViewModelId': bidd2._relatedViewModelId,
						'onUploadCompleteUrl': bidd2.onUploadCompleteUrl,
						'internalDataUrl': bidd2.internalDataUrl || '/',
						'formType': 'edit-item-form'
					};
					formObjectInit(params2);
				}
				else {
					formDisplayToggle(false, b);
					editButtonDisplayToggle(true, b);
				}
			}
			else {
				formDisplayToggle(true, b);
				editButtonDisplayToggle(false, b);
			}
		}
		MynyteApi.editButtonClicked = editButtonClicked;

		function createItemEditButton () {
			var buttonHtml = buttonsHtmlObj({element: 'Edit'});
			bidd.elem.append(buttonHtml.html);
			console.log(buttonHtml);
		}

		function getPossibleValsForObjectProperty (itemModel, itemVal) {
			if (typeof(itemModel) === 'undefined') {return itemVal;}
			if (itemModel["Data Type"].indexOf('INT') > -1 && itemModel["Related Property Type"] != null) {
				var propSubType = itemModel["Related Property Sub-Type"] || 'Landlord',
					propLabel = itemModel["Related Property Label"] || 'Business Entity Item',
					propSubLabel = itemModel["Related Property Sub-Label"] || "'Related Business Entity Specific Item Type'",
					propViewModelProps = itemModel["Related Property ViewModel Props"] || ['_id'],
					propType = itemModel["Related Property Type"] || 'Business Item';
					
				var itemTypeObj = genericItemTypeObj({element: propLabel, propType: propType, propSubLabel: propSubLabel, propSubType: propSubType});

				dataConnect({
					className: itemTypeObj[propLabel].class, action: itemTypeObj[propLabel].action, 
					data: itemTypeObj[propLabel].data,
					successCallback: function (params) {
						var viewType = 'Detail Display',
							_businessId = MynyteApi.pageVars._businessId,
							ind = 0, 
							successData = params.successData, 
							businessItems = {}, 
							htmlString = "", 
							htmlElem = null,
							htmlPropNameToDisplay = itemModel.Name.substr((itemModel.Name.indexOf('_') == 0) ? 1: 0, itemModel.Name.length).replace(" Id", ""),
							propNameCssFormat = propNameCssFormatter(itemModel.Name);

						loopObjPropsToCompileObj ({'format': 'default', 'viewType': viewType, '_businessId': _businessId, 'i': ind, 'successData': successData, 'businessItems': {}, 'innerBusinessItemType': itemModel["Related Property Sub-Type"], objIndex: MynyteApi.pageVars['Business Item Detail Displays'].length - 1});
						
						for (var thisProp in MynyteApi.pageVars['Page Object']["Inner Business Items"][propSubType]) {
							console.log(thisProp, itemVal, "HEY");
							if (thisProp == parseInt(itemVal)) {
								displayVal = MynyteApi.pageVars['Page Object']["Inner Business Items"][propSubType][thisProp].Name;

						//inputString = formFieldHTML({fieldType: 'Fake', prop: modelProperties[prop], value: val, displayValue: displayVal, index: i2, maxIndex: maxIndex, formType: bif.formType});
								
						console.log("DOOS44IE", displayVal);
							return displayVal;
							}
						}
					},
					errorCallback: function (errorData) {
						console.log("error: ", errorData);
					}
				});
			}
			else {
				return itemVal;
			}
		}

		function loopPropertiesToCreateItemHtml () {
			var htmlString = "";

			function innerLoopPropertiesToCreateItemHtml (a) {
				item = successData.items[a];
				itemModel = finalItemModel[item.metaName];
				dataType = (typeof(itemModel) !== 'undefined') ? itemModel["Data Type"].toLowerCase() : 'string';

				function nextItem (a) {
					if (a == successData.items.length - 1) {
						bidd.elem.append(htmlString).css({'display': 'block'});
					}
					else {
						innerLoopPropertiesToCreateItemHtml(a + 1);
					}
				}

				if (item.metaName.indexOf("Arr[]") > -1 && arrays[item.metaName]) {
					arrays[item.metaName].push(item);
					nextItem(a);
				}
				else if (item.metaName.indexOf("Arr[]") > -1) {
					arrays[item.metaName] = [item];
					nextItem(a);
				}
				else {
					console.log(itemModel);
					//item.metaValue = getPossibleValsForObjectProperty(itemModel, item.metaValue);
					console.log(item.metaValue);
					/*
					if (itemModel && itemModel["Data Type"].indexOf('INT') > -1 && itemModel["Related Property Type"] != null) {
						var propSubType = itemModel["Related Property Sub-Type"] || 'Landlord',
							propLabel = itemModel["Related Property Label"] || 'Business Entity Item',
							propSubLabel = itemModel["Related Property Sub-Label"] || "'Related Business Entity Specific Item Type'",
							propViewModelProps = itemModel["Related Property ViewModel Props"] || ['_id'],
							propType = itemModel["Related Property Type"] || 'Business Item',
							dataType = itemModel["Data Type"] || 'VARCHAR';
							
						var itemTypeObj = genericItemTypeObj({element: propLabel, propType: propType, propSubLabel: propSubLabel, propSubType: propSubType});

						dataConnect({
							className: itemTypeObj[propLabel].class, action: itemTypeObj[propLabel].action, 
							data: itemTypeObj[propLabel].data,
							successCallback: function (params) {
								var viewType = 'Detail Display',
									_businessId = MynyteApi.pageVars._businessId,
									ind = 0, 
									successData = params.successData, 
									businessItems = {}, 
									htmlString = "", 
									htmlElem = null,
									htmlPropNameToDisplay = itemModel.Name.substr((itemModel.Name.indexOf('_') == 0) ? 1: 0, itemModel.Name.length).replace(" Id", ""),
									propNameCssFormat = propNameCssFormatter(itemModel.Name);

								loopObjPropsToCompileObj ({'format': 'default', 'viewType': viewType, '_businessId': _businessId, 'i': ind, 'successData': successData, 'businessItems': {}, 'innerBusinessItemType': itemModel["Related Property Sub-Type"], objIndex: MynyteApi.pageVars['Business Item Detail Displays'].length - 1});
								
								for (var thisProp in MynyteApi.pageVars['Page Object']["Inner Business Items"][propSubType]) {
									console.log(thisProp, item.metaValue, "HEY");
									if (thisProp == parseInt(item.metaValue)) {
										//item.metaValue = MynyteApi.pageVars['Page Object']["Inner Business Items"][propSubType][thisProp].Name;
										htmlString += businessItemPropertyHtml({item: item, dataType: dataType, internalDataUrl: bidd.internalDataUrl});
										nextItem(a);
									}
								}
							},
							errorCallback: function (errorData) {
								console.log("error: ", errorData);
							}
						});
					}
					else {
						*/
						htmlString += businessItemPropertyHtml({item: item, dataType: dataType, internalDataUrl: bidd.internalDataUrl});
						nextItem(a);
					//}
				}
			}

			innerLoopPropertiesToCreateItemHtml(0);
		}

		function loopItemModelForTypes () {
			var htmlString;

			for (var prop in itemModel) {
				finalItemModel[itemModel[prop].Name] = itemModel[prop];
			}

			if (bidd.htmlViewModelMethod != 'custom' || bidd.htmlViewModelScript == '') {
				if (!!bidd.isEditable) {
					createItemEditButton();
				}
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
							bidd.elem.append(html).css({'display': 'block'});
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
				var ind = model.items[i].vmIndex;

				if (itemModel[_id]) {}
				else {
					itemModel[_id] = {i: ind};
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
			existingVars: {
				model: model,
				oldParams: params
			}, 
			data: {
				_businessId: bidd._businessId,
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

MynyteApi.itemViewObjectInit = itemViewObjectInit;
	
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

	function createSummary (params) {
		var htmlDiv = params.elem,
			bisd;
		
		MynyteApi.pageVars['Page Object'] = {};
		MynyteApi.pageVars['Business Item Summary Displays'] = [];
		MynyteApi.pageVars['Business Item Summary Displays'][0] = {
			'elem': params.elem,
			'_businessId': params._businessId,
			'businessEntityItemType': params.businessEntityItemType,
			'businessEntityItemTypeLabel': params.businessEntityItemTypeLabel,
			'businessEntityItemSubType': params.businessEntityItemSubType,
			'_relatedViewModelId': params._relatedViewModelId,
			'extraFiltersString': params.extraFiltersString,
			'noItemsNote': params.noItemsNote || "You currently have 0 " + params.businessEntityItemSubType + "s.",
            'specialProps': params.specialProps,
			'internalDataUrl': params.internalDataUrl || '/',
			'dataLink': params.dataLink,
			'htmlViewModelMethod': params.htmlViewModelMethod || 'default',
			'htmlViewModelScript': params.htmlViewModelScript || '',
			'htmlViewModelParams': params.htmlViewModelParams || {},
			'pagerEnabled': params.pagerEnabled || true,
			'customPager': params.customPager || false,
			'currentPage': params.currentPage || 1,
			'pageItemLimit': params.pageItemLimit || 10
		};
		bisd = MynyteApi.pageVars['Business Item Summary Displays'][0];

		dataConnect({
			className: 'BusinessEntity', 
			action: 'getBusinessEntityItems', 
			data: {
				_businessId: bisd._businessId,
				businessEntityItemType: bisd.businessEntityItemType,
				extraFiltersString: bisd.extraFiltersString,
				_relatedViewModelId: bisd._relatedViewModelId
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
                	successData = (successData.items[0].vmIndex == null) ? successData: orderObjPropsByVMIndex({successData: successData});
                    loopObjPropsToCompileObj({'format': 'default', 'viewType': viewType, '_businessId': _businessId, 'i': i, 'successData': successData, 'businessItems': businessItems, 'htmlString': htmlString, 'htmlElem': $( "div.mynyte-business-items-summary"), 'objIndex': 0});
                }
                else if (successData.items != null && (bisd.htmlViewModelMethod == 'custom' && bisd.htmlViewModelScript != '')) {
                	successData = (successData.items[0].vmIndex == null) ? successData: orderObjPropsByVMIndex({successData: successData});
                	loopObjPropsToCompileObj({'format': 'custom', 'viewType': viewType, '_businessId': _businessId, 'i': i, 'successData': successData, 'businessItems': businessItems, 'htmlString': htmlString, 'htmlElem': $( "div.mynyte-business-items-summary"), 'htmlViewModelParams': bisd.htmlViewModelParams, 'htmlViewModelScript': bisd.htmlViewModelScript, 'internalDataUrl': bisd.internalDataUrl, 'objIndex': 0});
                }
                else {
                    prepareBusinessItemsView({'format': 'custom', 'viewType': viewType, 'successData': successData, 'htmlString': htmlString, 'htmlElem': $( "div.mynyte-business-items-summary"), 'bisdIndex': 0});
                }
			},
			errorCallback: function (errorData) {

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

	function orderObjPropsByVMIndex (params) {
		var items = params.successData.items,
			newItems;

		function compare(a,b) {
		  if (a.vmIndex < b.vmIndex)
		    return -1;
		  if (a.vmIndex > b.vmIndex)
		    return 1;
		  return 0;
		}

		items.sort(compare);

		newItems = {'items': items};

		return newItems;
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
			thisItem = successData.items[i],
			htmlViewModelParams = params.htmlViewModelParams,
			htmlViewModelScript = params.htmlViewModelScript,
			internalDataUrl = params.internalDataUrl;

		var obj = (params.viewType == 'Detail Display') ? MynyteApi.pageVars['Business Item Detail Displays'][params.objIndex] : MynyteApi.pageVars['Business Item Summary Displays'][params.objIndex];
		var viewModelProps = obj.viewModelProps || null;

		function nextItem () {
			if (i == successData.items.length - 1) {
				MynyteApi.pageVars['Page Object']["Business Items"] = businessItems;
				MynyteApi.pageVars['Page Object']["Inner Business Items"] = MynyteApi.pageVars['Page Object']["Inner Business Items"] || [];
				if (params.innerBusinessItemType) {
					MynyteApi.pageVars['Page Object']["Inner Business Items"][params.innerBusinessItemType] = businessItems;
				}

				if (viewType != null && viewType != 'Detail Display') {
					prepareBusinessItemsView({'format': format, 'viewType': viewType, 'successData': successData, 'htmlString': htmlString, 'htmlElem': htmlElem, 'htmlViewModelParams': htmlViewModelParams, 'htmlViewModelScript': htmlViewModelScript, 'internalDataUrl': internalDataUrl, 'objIndex': params.objIndex});
				}
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
		var bisd = MynyteApi.pageVars['Business Item Summary Displays'][params.objIndex];

		var format = params.format,
			viewType = params.viewType,
			successData = params.successData,
			htmlString = params.htmlString,
			htmlElem = params.htmlElem,
			htmlViewModelScript = bisd.htmlViewModelScript,
			htmlViewModelParams = bisd.htmlViewModelParams,
			internalDataUrl = bisd.internalDataUrl,
			pagerEnabled = bisd.pagerEnabled,
			customPager = bisd.customPager,
			currentPage = bisd.currentPage,
			pageItemLimit = bisd.pageItemLimit,
			businessItems = $.map(MynyteApi.pageVars['Page Object']["Business Items"], function(value, index) {
	    		return [value];
			}),
			firstItemIndex, lastItemIndex;
		pageItemLimit = (pageItemLimit == 0) ? successData.items.length: pageItemLimit;
		firstItemIndex = ((currentPage-1)*pageItemLimit);
		lastItemIndex = ((currentPage*pageItemLimit) < businessItems.length) ? (currentPage*pageItemLimit) : businessItems.length;

		if (!!pagerEnabled) {
			if (window.location.href.indexOf("?") == -1) {
				var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?page=1';
				window.history.pushState({ path: newurl }, '', newurl);
			}

			MynyteApi.changeBusinessItemsCurrentPage = function (select) {
				var pageNum = $(select).val().replace("page_", "");
				console.log($(select).val());
				var oldPage, newSearch;

				function getParameterByName(name) {
				    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
				    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
				    results = regex.exec(location.search);
				    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
				}

				oldPage = getParameterByName('page');
				newSearch = window.location.search.replace('?page='+oldPage, '?page='+pageNum);
				newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + newSearch;
				window.history.pushState({ path: newurl }, '', newurl);
				$(bisd.elem).empty();
				MynyteApi.createSummary({
					'elem': bisd.elem,
					'summaryType': 'businessItems',
					'_businessId': bisd._businessId,
					'businessEntityItemType': bisd.businessEntityItemType,
					'businessEntityItemTypeLabel': bisd.businessEntityItemTypeLabel,
					'businessEntityItemSubType': bisd.businessEntityItemSubType,
					'extraFiltersString': bisd.extraFiltersString,
					'internalDataUrl': bisd.internalDataUrl,
					'htmlViewModelMethod': bisd.htmlViewModelMethod,
					'htmlViewModelScript': bisd.htmlViewModelScript,
					'dataLink': bisd.dataLink,
					'noItemsNote': bisd.noItemsNote,
					'pageItemLimit': bisd.pageItemLimit,
					'currentPage': pageNum
				});
			}

			htmlString += (!customPager) ? 
				businessItemsSummaryGeneralHTML({element: 'pager', itemsLen: businessItems.length, currentPage: currentPage, pageItemLimit: pageItemLimit}):
				customBusinessItemsSummaryGeneralHtml({element: 'pager', itemsLen: businessItems.length, currentPage: currentPage, pageItemLimit: pageItemLimit});
		}
		else {
			lastItemIndex = businessItems.length;
		}
			
		if (successData.items != null && format == 'default') {
			console.log(firstItemIndex, lastItemIndex);
			for (var ind = firstItemIndex; ind < lastItemIndex; ind++) {
				htmlString += businessItemsSummaryItemHTML({element: 'itemStart', item: businessItems[ind], view: viewType});
console.log(businessItems[ind]);
				for (var prop in businessItems[ind]) {
					if (prop != "Arrays" && prop != '_itemId') {
						htmlString += businessItemsSummaryItemHTML({element: 'nonArrayProp', item: businessItems[ind], prop: prop, internalDataUrl: bisd.internalDataUrl});
					} else if (prop != '_itemId') {
						for (var prop2 in businessItems[ind][prop]) {
							htmlString += businessItemsSummaryItemHTML({element: 'arrayProp', item: businessItems[ind], prop: prop, prop2: prop2});
						}
					}
				}
				
				if (viewType == 'Item Summary') {
					htmlString += businessItemsSummaryItemHTML({element: 'itemSummaryPreClose', htmlElem: htmlElem, _itemId: businessItems[ind]._id, dataLink: bisd.dataLink});
				}
				else if (viewType == 'Dropdown Selection') {
					htmlString += businessItemsSummaryItemHTML({element: 'dropdownSelectionPreClose'});
				}
				
				htmlString += businessItemsSummaryItemHTML({element: 'itemClose', view: viewType});
				
				if (ind == lastItemIndex - 1 && viewType == 'Item Summary') {
					htmlElem.append(htmlString).css({'display': 'block'});
				}
				else if (ind == lastItemIndex - 1 && viewType == 'Dropdown Selection') {
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
					extraParams: htmlViewModelParams,
					htmlString: htmlString, 
					itemsLen: businessItems.length, 
					currentPage: currentPage, 
					pageItemLimit: pageItemLimit
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

	function prepareMyNyteItems () {
		$(document).ready(function() {
			//General css files
$('head').append('<link rel="stylesheet" href="'+ current_environment_root_prefix + "/" +current_environment_file_url+'css/api-style.css" type="text/css" />');
$('head').append('<link rel="stylesheet" href="'+ current_environment_root_prefix + "/" +current_environment_file_url+'css/ionicons.min.css" type="text/css" />');
$('head').append('<link rel="stylesheet" href="https://webfonts.creativecloud.com/c/69721a/1w;quicksand,2,WXp:W:n4,WXn:W:n7/l" type="text/css" />');
$('head').append('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" type="text/css" />');

function importJSScript(params) {
	var d=document,
		s=d.createElement('script');

	s.src = params.src;
	s.onload = function () {
		if (params.onLoad) {
			params.onLoad();
		}
	};
	d.head.appendChild(s);
}
MynyteApi.importJSScript = importJSScript;

function importBootstrapDatepicker(params) {
	$('head').append('<link rel="stylesheet" href="'+ current_environment_root_prefix + "/" +current_environment_file_url+'js/api/bootstrap/css/bootstrap.min.css" type="text/css" />');
	$('head').append('<link rel="stylesheet" href="'+ current_environment_root_prefix + "/" +current_environment_file_url+'js/api/bootstrap/css/bootstrap-datepicker3.min.css" type="text/css" />');
	importJSScript({src: current_environment_root_prefix + "/" +current_environment_file_url+'js/api/bootstrap/js/bootstrap-datepicker.min.js', onLoad: params.onLoad});
}
MynyteApi.importBootstrapDatepicker = importBootstrapDatepicker;
			
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
				/*
				var htmlDiv = $( "div.mynyte-business-items-summary");
				createSummary({
					'elem': $( "div.mynyte-business-items-summary")[0],
					'summaryType': 'businessItems',
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
				});*/
			}

			//If MyNyte Business items SUmmary
			if ($("div.mynyte-business-item-detail").length) {
				/*var params = {
						'elem': $("div.mynyte-business-item-detail"),
						'businessEntityItemId': (window.location.href.indexOf('?_itemId') > -1) ? window.location.href.substr(window.location.href.indexOf('?_itemId=') + 9, window.location.href.length): $("div.mynyte-business-item-detail").data('item-id'),
						'businessEntityItemType': elem.data('item-type') || '/',
						'internalDataUrl': elem.data('internal-data') || '/',
						'_relatedViewModelId': elem.data('viewmodel-id'),
						'htmlViewModelMethod': elem.data('html-method') || 'default',
						'htmlViewModelScript': elem.data('html-script') || '',
						'htmlViewModelParams': elem.data('html-script-input') || {},
						'businessEntityItemSubType': (elem.data('item-sub-type')) ? elem.data('item-sub-type').split(",")[1] : null,
						'businessEntityItemTypeLabel': (elem.data('item-sub-type')) ? elem.data('item-sub-type').split(",")[0] : null,
						'UploadCompleteUrl': elem.data('link'),
						'_businessId': elem.data('bid'),
						'isEditable': (elem.data('editable') == true) 
					};

				MynteApi.itemViewObjectInit(params);*/
			}

			//If MyNyte Business items SUmmary
			if ($( "div.mynyte-new-business-item").length) {
				/*
				var htmlDiv = $( "div.mynyte-new-business-item");

				var params = {
					'_businessId': htmlDiv.data('bid'),
					'businessEntityItemType': htmlDiv.data('item-type'),
					'businessEntityItemTypeLabel': htmlDiv.data('item-sub-type').split(",")[0],
					'businessEntityItemSubType': htmlDiv.data('item-sub-type').split(",")[1],
					'_relatedViewModelId': htmlDiv.data('viewmodel-id'),
					'onUploadCompleteUrl': htmlDiv.data('link'),
					'internalDataUrl': htmlDiv.data('internal-data') || '/'
				};

				MynyteApi.formObjectInit(params);
				*/
			}
		});
	}

	if (window.jQuery) {
		prepareMyNyteItems();
	}
	else {
		include('//ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js', function() {
			prepareMyNyteItems();
		});
	}

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

	MynyteApi.createSummary = function (params) {
		createSummary(params);
	};
	
	MynyteApi.createButton = function (params) {
		createButton(params);	
	};
	
	MynyteApi.createPortal = function (params) {
		createPortal(params);	
	};
	
};

MynyteApi();
})();