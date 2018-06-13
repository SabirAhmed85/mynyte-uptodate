function itemViewObjectInit(params) {
	var bidd;

	createPopup({'class': 'simple-loader', 'iconClass': 'circle-o-notch fa-spin fa-4x', 'message': 'Loading ' + params.businessEntityItemSubType});
	openPopup({'class': 'simple-loader', 'speed': 'fast'});

	MynyteApi.pageVars['Page Object'] = {};
	
	MynyteApi.pageVars['Business Item Detail Displays'] = MynyteApi.pageVars['Business Item Detail Displays'] || [];
	MynyteApi.pageVars['Business Item Detail Displays'][MynyteApi.pageVars['Business Item Detail Displays'].length] = {
		'elem': params.elem, 
		'businessEntityItemId': (window.location.href.indexOf('?_itemId') > -1) ? window.location.href.substr(window.location.href.indexOf('?_itemId=') + 9, window.location.href.length): params.businessEntityItemId || $("div.mynyte-business-item-detail").data('item-id'),
		'businessEntityItemType': params.businessEntityItemType || '/',
		'internalDataUrl': params.internalDataUrl|| '/',
		'_relatedViewModelId': params._relatedViewModelId,
		'_relatedViewModelForEditId': params._relatedViewModelForEditId,
		'htmlViewModelMethod': params.htmlViewModelMethod || 'default',
		'htmlViewModelScript': params.htmlViewModelScript || '',
		'htmlViewModelParams': params.htmlViewModelParams || {},
		'isEditable': params.isEditable || false,
		'businessEntityItemSubType': params.businessEntityItemSubType,
		'businessEntityItemTypeLabel': params.businessEntityItemTypeLabel,
		'UploadCompleteUrl': params.UploadCompleteUrl,
		'_businessId': params._businessId,
		'noItemNote': params.noItemNote
	};
	bidd = MynyteApi.pageVars['Business Item Detail Displays'][MynyteApi.pageVars['Business Item Detail Displays'].length - 1];

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

		if (successData.items != null && successData.items.length > 0) {

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
						createPopup({'class': 'simple-loader', 'iconClass': 'circle-o-notch fa-spin fa-4x', 'message': 'Loading Edit Form'});
						openPopup({'class': 'simple-loader', 'speed': 'fast'});

						bidd2.onFormChangeComplete = function () {
							editButtonDisplayToggle(true, b);
							closePopup({'class': 'simple-loader'});
						};

						var params2 = {
							'elem': bidd2.elem,
							'_businessId': bidd2._businessId,
							'businessEntityItemType': bidd2.businessEntityItemType,
							'businessEntityItemTypeLabel': bidd2.businessEntityItemTypeLabel,
							'businessEntityItemSubType': bidd2.businessEntityItemSubType,
							'_relatedViewModelId': bidd2._relatedViewModelForEditId || bidd2._relatedViewModelId,
							'onUploadCompleteUrl': bidd2.onUploadCompleteUrl,
							'internalDataUrl': bidd2.internalDataUrl || '/',
							'formType': 'edit-item-form'
						};
						formObjectInit(params2);
					}
					else {
						formDisplayToggle(false, b);
						editButtonDisplayToggle(true, b);
						closePopup({'class': 'simple-loader'});
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
								if (thisProp == parseInt(itemVal)) {
									displayVal = MynyteApi.pageVars['Page Object']["Inner Business Items"][propSubType][thisProp].Name;

									//inputString = formFieldHTML({fieldType: 'Fake', prop: modelProperties[prop], value: val, displayValue: displayVal, index: i2, maxIndex: maxIndex, formType: bif.formType});
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
					dataFormat = (typeof(itemModel) !== 'undefined' && typeof(itemModel["Data Format"]) !== 'undefined') ? itemModel["Data Format"].toLowerCase() : null;

					function nextItem (a) {
						if (a == successData.items.length - 1) {
							bidd.elem.append(htmlString).css({'display': 'block'});
							closePopup({'class': 'simple-loader'});
						}
						else {
							innerLoopPropertiesToCreateItemHtml(a + 1);
						}
					}

					if (item.viewProperty == false) {
						nextItem(a);
					}
					else if (item.metaName.indexOf("Arr[]") > -1 && arrays[item.metaName]) {
						arrays[item.metaName].push(item);
						nextItem(a);
					}
					else if (item.metaName.indexOf("Arr[]") > -1) {
						arrays[item.metaName] = [item];
						nextItem(a);
					}
					else if (itemModel && itemModel["Data Type"].indexOf('INT') > -1 && itemModel["Related Property Type"] != null) {
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
									successData = params.successData,
									htmlPropNameToDisplay = itemModel.Name.substr((itemModel.Name.indexOf('_') == 0) ? 1: 0, itemModel.Name.length).replace(" Id", ""),
									propNameCssFormat = propNameCssFormatter(itemModel.Name);

								loopObjPropsToCompileObj ({'format': 'default', 'viewType': viewType, '_businessId': MynyteApi.pageVars._businessId, 'i': 0, 'successData': successData, 'businessItems': {}, 'innerBusinessItemType': itemModel["Related Property Sub-Type"], objIndex: MynyteApi.pageVars['Business Item Detail Displays'].length - 1});
								
								for (var thisProp in MynyteApi.pageVars['Page Object']["Inner Business Items"][propSubType]) {
									if (thisProp == parseInt(item.metaValue)) {
										htmlString += businessItemPropertyHtml({item: item, metaName: htmlPropNameToDisplay, metaValue: MynyteApi.pageVars['Page Object']["Inner Business Items"][propSubType][thisProp].Name, dataType: dataType, internalDataUrl: bidd.internalDataUrl});
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
						
						htmlString += businessItemPropertyHtml({item: item, dataType: dataType, dataFormat: dataFormat, internalDataUrl: bidd.internalDataUrl});
						nextItem(a);
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

					if (finalItemModel[Object.keys(finalItemModel)[0]].vmIndex != null) {
						successData.items = successData.items.map(function (x) {
							if (typeof(finalItemModel[x.metaName]) !== 'undefined') {
								x.viewProperty = true;
								x.vmIndex = finalItemModel[x.metaName].vmIndex;
							}
							else {
								x.viewProperty = false;
								x.vmIndex = 0;
							}
							return x;
						});
						successData = (finalItemModel[Object.keys(finalItemModel)[0]].vmIndex == null) ? successData : orderObjPropsByVMIndex({returnAsItems: false, items: successData.items});
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
								closePopup({class: 'simple-loader'});
							},
							internalDataUrl: bidd.internalDataUrl,
							extraParams: bidd.htmlViewModelParams,
							noItemNote: bidd.noItemNote
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
						itemModel[_id] = {vmIndex: ind};
					}

					itemModel[_id][name] = val;

					if (i == model.items.length - 1) {
						loopItemModelForTypes();
					}
				}
			}

			loopItemModelForIds();
		}
		else {
			htmlString = bidd.noItemNote;
			bidd.elem.append(htmlString).css({'display': 'block'});
			closePopup({'class': 'simple-loader'});
		}
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