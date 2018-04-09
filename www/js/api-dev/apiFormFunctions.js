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