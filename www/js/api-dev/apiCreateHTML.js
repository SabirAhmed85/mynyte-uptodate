function genericItemTypeObj (params) {
	var obj = {};
	var genericItemTypeObj = {
		'Business Entity Item': function () {
			obj = {
				class: 'BusinessEntity', action: 'getBusinessEntityItems',
				data: {
					_businessId: MynyteApi.pageVars['New Business Item Forms'][0]._businessId,
					businessEntityItemType: params.propType,
					extraFiltersString: "[["+params.propSubLabel+"='"+params.propSubType+"']]",
					_relatedViewModelId: 'NULL'
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
						if (prop != "Arrays") {
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

			html += "<"+ elemType + dataPropToDisplayString() +" class='mynyte-business-items-summary-item"+dropdownClass+"' data-item-ref='"+params.item._id+"'>";
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
			html += "<a href='" + params.htmlElem.data('link') + params.i + "' class='action-button view-detail-button'>View Detail</a>";
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
	var inputString;
	var dataType, name, isReq, maxLen, minLen, propNameCssFormat, propType, propSubType;

	var globalFieldSetup = {
		dataType: function () {dataType =  prop["Data Type"];},
		name: function () {name = prop.Name.toLowerCase().replace(/ /g, "-");},
		isReq: function () {isReq = (prop["Is Required"]) ? " required-input": "";},
		maxLen: function () {maxLen = (prop["Max Length"]) ? " data-maxLength='"+prop["Max Length"]+"'": "";},
		minLen: function () {minLen = (prop["Min Length"]) ? " data-minLength='"+prop["Min Length"]+"'": "";},
		propNameCssFormat: function () {propNameCssFormat = prop.Name.replace(/ /g, '-').toLowerCase();},
		propType: function () {propType = prop["Related Property Type"];},
		propSubType: function () {propSubType = prop["Related Property Sub-Type"];}
	};

	var createFieldHTML = {
		'Text': function () {
			inputString = "<input name = '" +params.name+ "' class='mynyte-form-input mynyte-form-text-input"+params.isReq+"' type='text' "+params.maxLen+""+params.minLen+" />";
			if (params.maxLen != "") {
				inputString += "<span class='input-maxlength-note'>" + params.maxLen + " Char Max</span>";
			}
		},
		'Number': function () {
			inputString = "<input name='"+name+"' class='mynyte-form-input mynyte-form-text-input"+isReq+"' type='number' "+maxLen+""+minLen+" />";
			if (maxLen != "") {
				inputString += "<span class='input-maxlength-note'>" + maxLen + " Char Max</span>";
			}
		},
		'Fake': function () {
			inputString = "<div data-name='" + propNameCssFormat + "' class='mynyte-form-input mynyte-form-fake-input' onclick='return MynyteApi.toggleRelatedItemSelect(event, this)'><span class='selected-option-label'></span><button class='mynyte-form-select-toggler'><i class='fa fa-chevron-down'></i></button></div>";
		},
		'IMAGE': function () {
			inputString = "<span><input onchange='MynyteApi.imageUploadFileTypeCheck(this)' name = '" +name+ "' class='mynyte-form-input mynyte-form-image-input"+isReq+"' type='file' accept='image/*' "+maxLen+""+minLen+" multiple/><span class='mynyte-image-input-images'></span></span>";
		},
		'DATE': function () {
			inputString = "<div data-name='" +  params.name + "' class='mynyte-form-input mynyte-form-fake-input"+params.isReq+"'><button class='mynyte-form-datepicker'></button></div>";
		},
		'TIME': function () {
			inputString = "<div data-name='" +  params.name + "' class='mynyte-form-input mynyte-form-fake-input"+params.isReq+"'><button class='mynyte-form-timepicker'></button></div>";
		}
	};


	globalFieldSetup[params.prop]();
	fieldHTML[params.fieldType]();
	return inputString;
}

function formGeneralHTML(params) {
	var htmlString;
	var formGeneralHTML = {
		'formStart': function () {
			htmlString = "<form action='#' name='mynyte-business-item-add-form' onsubmit='return MynyteApi.addBusinessItem();'>";
		},
		'formFieldContainer': function () {
			var name = params.prop.Name.replace(" Arr[]", "s"),
				isReqLabel = (params.prop["Is Required"]) ? " (Required)": "";

			htmlString += "<div class='mynyte-form-field-container'><label class='mynyte-form-field-label'>" + name + isReqLabel + "</label>";
			htmlString += "<div class='mynyte-form-input-container'>" + params.inputString + "</div></div>";
		},
		'formComlete': function () {
			htmlString = "<div class='mynyte-form-field-container mynyte-button-container'><button type='submit'>Add Item</button></div>";
			htmlString += "</form>";
		}
	};

	formGeneralHTML[params.element]();
	return htmlString;
}


MynyteApi.scripts.businessItemPropertyHtml = businessItemPropertyHtml;
MynyteApi.scripts.formFieldHTML = formFieldHTML;
MynyteApi.scripts.formGeneralHTML = formGeneralHTML;