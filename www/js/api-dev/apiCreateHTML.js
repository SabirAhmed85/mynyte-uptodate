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
		},
		'Edit': function () {
			obj = {
				html: "<div class='mynyte-form-field-container mynyte-button-container'><button class='mynyte-button-secondary mynyte-button' onclick='MynyteApi.editButtonClicked(this)'><span class='mynyte-button-inner-wrapper'><i class='fa fa-edit'></i><span>Edit</span></span></button></div>"
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
			console.log(params.item._itemId);
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
	var dataType, name, isReq, maxLen, minLen, propNameCssFormat, propType, propSubType, prop = params.prop;

	var globalFieldSetup = {
		dataType: function () {dataType =  prop["Data Type"];},
		name: function () {name = propNameCssFormatter(prop.Name);},
		isReq: function () {isReq = (prop["Is Required"]) ? " required-input": "";},
		maxLen: function () {maxLen = (prop["Max Length"]) ? " data-maxLength='"+prop["Max Length"]+"'": "";},
		minLen: function () {minLen = (prop["Min Length"]) ? " data-minLength='"+prop["Min Length"]+"'": "";},
		propNameCssFormat: function () {propNameCssFormat = propNameCssFormatter(prop.Name);},
		propType: function () {propType = prop["Related Property Type"];},
		propSubType: function () {propSubType = prop["Related Property Sub-Type"];},
		isArray: function () {isArray = prop.Name.indexOf(" Arr[]") > -1;}
	};

	var createFieldHTML = {
		'Text': function () {
			inputString += "<input name = '" +name+ "' value='" + ((typeof(params.value) !== 'undefined') ? params.value: '')+ "' class='mynyte-form-input mynyte-form-text-input"+isReq+"' type='text' "+maxLen+""+minLen+" /></span>";
			if (maxLen != "") {
				inputString += "<span class='input-maxlength-note'>" + maxLen + " Char Max</span>";
			}
		},
		'Textarea': function () {
			inputString += "<textarea rows='3' name = '" +name+ "' value='" + ((typeof(params.value) !== 'undefined') ? params.value: '')+ "' class='mynyte-form-input mynyte-form-textarea-input"+isReq+"' "+maxLen+""+minLen+" ></textarea></span>";
			if (maxLen != "") {
				inputString += "<span class='input-maxlength-note'>" + maxLen + " Char Max</span>";
			}
		},
		'Number': function () {
			inputString += "<input name='"+name+"' value='" + ((typeof(params.value) !== 'undefined') ? params.value: '')+ "' class='mynyte-form-input mynyte-form-text-input"+isReq+"' type='number' "+maxLen+""+minLen+" /></span>";
		},
		'Double': function () {
			inputString += "<input name='"+name+"' value='" + ((typeof(params.value) !== 'undefined') ? params.value: '')+ "' class='mynyte-form-input mynyte-form-text-input"+isReq+"' type='number' step='0.01' "+maxLen+""+minLen+" /></span>";
		},
		'Fake': function () {
			inputString += "<div data-index='0' data-name='" + propNameCssFormat + "' class='mynyte-form-input mynyte-form-fake-input' onclick='return MynyteApi.toggleRelatedItemSelect(event, this)'><span class='selected-option-label'>" + ((typeof(params.value) !== 'undefined') ? params.value: 'Select an Option') + "</span><button class='mynyte-form-select-toggler'><i class='fa fa-chevron-down'></i></button></div></span>";
		},
		'IMAGE': function () {
			inputString += "<span><input onchange='MynyteApi.imageUploadFileTypeCheck(this)' name = '" +name+ "' class='mynyte-form-input mynyte-form-image-input"+isReq+"' type='file' accept='image/*' "+maxLen+""+minLen+"/><span class='mynyte-image-input-images'></span></span></span>";
		},
		'FILE': function () {
			console.log("okos");
			inputString += "<span><input onchange='MynyteApi.imageUploadFileTypeCheck(this)' name = '" +name+ "' class='mynyte-form-input mynyte-form-image-input"+isReq+"' type='file' "+maxLen+""+minLen+"/><span class='mynyte-image-input-images'></span></span></span>";
		},
		'DATE': function () {
			inputString += "<div data-name='" +  name + "' class='mynyte-form-input mynyte-form-fake-input"+isReq+"'><span>" + ((typeof(params.value) !== 'undefined') ? params.value: '') + "</span><button id='datepicker-"+ propNameCssFormat +"' type='button' class='mynyte-form-datepicker "+ propNameCssFormat +"'><i class='fa fa-calendar'></i></button></div></span>";
		},
		'TIME': function () {
			inputString += "<div data-name='" +  name + "' class='mynyte-form-input mynyte-form-fake-input"+isReq+"'><span>" + ((typeof(params.value) !== 'undefined') ? params.value: '') + "</span><button id='timepicker-" + propNameCssFormat + "' class='mynyte-form-timepicker'><i class='fa fa-clock'></i></button></div></span>";
		}
	};

	//globalFieldSetup[params.prop]();
	for (var val in globalFieldSetup) {
		globalFieldSetup[val]();
	}
	inputString += "<span class='input-container'>";
	createFieldHTML[params.fieldType]();
	console.log(params.fieldType);

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
				isReqLabel = (params.prop["Is Required"]) ? " (Required)": "",
				cssName = params.prop.Name.replace(/ /g, "-").replace(".", "").toLowerCase();

			htmlString += "<div class='mynyte-form-field-container " + cssName + "-field-container'><label class='mynyte-form-field-label'>" + name + isReqLabel + "</label>";
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