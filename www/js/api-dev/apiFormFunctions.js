function prepareBusinessItemForm (modelProperties, htmlString) {
	var keys = Object.keys(modelProperties),
		newItems = [], dateProps = [],
		dataType, prop, isReqLabel;
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
		htmlString += formGeneralHTML({element: 'formComplete'});

		MynyteApi.pageVars['Page Object'].Model = modelProperties;
		$( "div.mynyte-new-business-item").append(htmlString).css({'display': 'block'});

		if (dateProps.length) {
			addFormDatePickers();
		}
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
			dataVal = modelProperties[prop]["Value"],
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

			newInput.attr("data-index", $(button).siblings('.input-container').find('.mynyte-form-input').length);
			if ($(newInput).find('.selected-option-label').length) {
				console.log($(newInput).find('.selected-option-label'));
				$(newInput).find('.selected-option-label').find('span').html('');
			}
			console.log($(newInput).find('.selected-option-label').length);
			newInput.val('').addClass('mynyte-removeable-input').appendTo(innerCont);
			removeButton.appendTo(innerCont);

			if (newImg) {
				newImg.innerHTML = "";
				newImg.appendTo(innerCont);
			}
			innerCont.appendTo(par);
		};

		function compileFieldHtml (val) {
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

						loopObjPropsToCompileObj ({'format': 'default', 'viewType': viewType, '_businessId': _businessId, 'i': ind, 'successData': successData, 'businessItems': {}, 'htmlString': "", 'htmlElem': $('.dropdown.'+propNameCssFormat+'-dropdown'), bisdIndex: MynyteApi.pageVars['Business Item Summary Displays'].length - 1});

						inputString = formFieldHTML({fieldType: 'Fake', prop: modelProperties[prop], value: val});
						
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

					inputString = formFieldHTML({fieldType: fieldType, prop: modelProperties[prop], value: val});
				}
				/* THE REAL METHOD TO USE FOR INT WITH NO EXTRA LOGIC NEEDED */
				else if (dataType.indexOf('INT') > -1 && propType == null) {
					inputString = formFieldHTML({fieldType: 'Number', prop: modelProperties[prop], value: val});
				}
				else if (dataType.indexOf('DOUBLE') > -1 && propType == null) {
					inputString = formFieldHTML({fieldType: 'Double', prop: modelProperties[prop], value: val});
				}
				else if (dataType == 'DATE') {
					inputString = formFieldHTML({fieldType: 'DATE', prop: modelProperties[prop], value: val});
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
					inputString = formFieldHTML({fieldType: 'TIME', prop: modelProperties[prop], value: val});
					
				}
				else if (dataType == 'IMAGE' || dataType == 'FILE') {
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

					inputString = formFieldHTML({fieldType: dataType, prop: modelProperties[prop]});
				}

				addPropFinal(i, isReqLabel, inputString);
			}

		}
		
		console.log(dataVal);
		if (typeof(dataVal) === 'undefined' || dataVal == '') {
			compileFieldHtml('');
		} else {
			for (var a = 0; a < dataVal.length; a++) {
				compileFieldHtml(dataVal[a]);
			}
		}
	};

	//orderModelProps();
	compilePropHtmlToAdd(0);
}
MynyteApi.prepareBusinessItemForm = prepareBusinessItemForm;

function prepareBusinessItemFormObject (successData) {
	var htmlString = formGeneralHTML({element: 'formStart'});
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

		if (a == successData.items.length - 1) {
			console.log(successData.items, modelProperties);
			prepareBusinessItemForm(modelProperties, htmlString);
		}
	}
}

function createBusinessItemFormPageVar (params) {
	MynyteApi.pageVars['New Business Item Forms'] = MynyteApi.pageVars['New Business Item Forms'] || [];

	MynyteApi.pageVars['New Business Item Forms'][MynyteApi.pageVars['New Business Item Forms'].length] = {
		'_businessId': params._businessId,
		'businessEntityItemType': params.businessEntityItemType,
		'businessEntityItemTypeLabel': params.businessEntityItemTypeLabel,
		'businessEntityItemSubType': params.businessEntityItemSubType,
		'_relatedViewModelId': params._relatedViewModelId,
		'onUploadCompleteUrl': params.onUploadCompleteUrl,
		'internalDataUrl': params.internalDataUrl || '/'
	};

	return MynyteApi.pageVars['New Business Item Forms'].length - 1;
}

function initialiseBusinessItemFormFunctionsAndEvents(thisBif) {
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
			name = propNameCssFormatter(name);
			valToAssign = $('div[data-name="' + name + '"]').data('selected-item-ref');
			console.log(valToAssign, i);
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
			var name = propNameCssFormatter(pageObjectModel[prop].Name),
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

		console.log(MynyteApi.pageVars['Page Object']);
		
		if (!MynyteApi.pageVars['Page Object']['Has Error']) {
			var inputString = "",
				formData = new FormData($('form[name="mynyte-business-item-add-form"]')[newBifId]),
				confirmationShown = false,
				imageUploadComplete = false, 
				_newItemId = null,
				itemDisplayName = (typeof(thisBif.businessEntityItemSubType) !== 'undefined') ? thisBif.businessEntityItemSubType: thisBif.businessEntityItemType;

			$('.mynyte-button-container button').attr("disabled", "disabled");
			createPopup({'class': 'simple-loader', 'iconClass': 'circle-o-notch fa-spin fa-4x', 'message': 'Adding ' + itemDisplayName});
			openPopup({'class': 'simple-loader'});

			for(var keys = Object.keys(pageObjectModel), i = 0, end = keys.length; i < end; i++) {
				var checkForEndOfLoop = function checkForEndOfLoop () {
					if (i < end - 1) { inputString += ",";}
				  	else if (i == end - 1) {
				  		if (typeof(thisBif.businessEntityItemSubType) !== 'undefined') {
				  			inputString += ", [['" + thisBif.businessEntityItemTypeLabel + "', '" + thisBif.businessEntityItemSubType + "']]";	
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
					_businessId: thisBif._businessId,
					businessEntityItemName: thisBif.businessEntityItemType,
					nameValuePairString: inputString
				},
				successCallback: function (params) {
					var successData = params.successData;
					_newItemId = successData.item;
					closePopup({'class': 'simple-loader'});
					createPopup({'class': 'business-item-success', 'itemName': 'Property', '_itemId': _newItemId, 'itemLink': 'new-property-admin.php?_itemId='});
					openPopup({'class': 'business-item-success'});
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
}

function formObjectInit(params) {

	var newBifId = createBusinessItemFormPageVar(params);

	console.log(MynyteApi.pageVars['New Business Item Forms']);

	var extraFiltersString = "";
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

				prepareBusinessItemFormObject(successData);

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