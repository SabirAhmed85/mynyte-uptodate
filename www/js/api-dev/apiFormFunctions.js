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
					for (var thisProp in MynyteApi.pageVars['Page Object']["Inner Business Items"][modelProperties[prop]["Related Property Sub-Type"]]) {
						if (thisProp == parseInt(val)) {
							displayVal = MynyteApi.pageVars['Page Object']["Inner Business Items"][modelProperties[prop]["Related Property Sub-Type"]][thisProp].Name;
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

							loopObjPropsToCompileObj ({'format': 'default', 'viewType': viewType, '_businessId': _businessId, 'i': ind, 'successData': successData, 'businessItems': {}, 'innerBusinessItemType': modelProperties[prop]["Related Property Sub-Type"], 'htmlString': "", 'htmlElem': $('.dropdown.'+propNameCssFormat+'-dropdown'), bisdIndex: MynyteApi.pageVars['Business Item Summary Displays'].length - 1});

							completeCompilingFakeFieldHtml();
						},
						errorCallback: function (errorDara) {
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