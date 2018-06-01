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
	var html = "", metaName = params.metaName || params.item.metaName, intDataUrl = params.internalDataUrl, metaValue = params.metaValue || params.item.metaValue;

	if (params.dataType != "image" && params.dataType != "file") {
		if (params.dataFormat == 'money') {
			metaValue = formatMoneyVal({value: metaValue});
		}
		html += "<div class='mynyte-label-container'><label class='mynyte-label'>" + metaName + "</label>";
		html += "<span class='mynyte-label-detail'>" + metaValue + "</span></div>";
	}
	else if ((params.dataType == "image" || params.dataType == "file") && metaName.indexOf("Arr[]") == -1) {
		html += "<div class='mynyte-label-container'><label class='mynyte-label'>" + metaName + "</label>";
		html += "<span class='mynyte-label-detail with-image'><img src='"+intDataUrl+"/images/"+metaValue+"' alt='' /></span></div>";
	}
	else if ((params.dataType == "image" || params.dataType == "file") && metaName.indexOf("Arr[]") > -1) {
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
	inputString += (params.index > 0 && ((params.fieldType != "IMAGE" && params.fieldType != "FILE") || (params.formType != 'edit-item-form'))) ? '<button type="button" onclick="MynyteApi.removeFormInputFromForm(this);" class="remove-input-button mynyte-button mynyte-button-secondary mynyte-button-secondary-alt mynyte-button-secondary-dark mynyte-button-with-icon"><span class="mynyte-button-inner-wrapper"><i class="fa fa-minus"></i><span>Remove</span></span></button>': '';
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