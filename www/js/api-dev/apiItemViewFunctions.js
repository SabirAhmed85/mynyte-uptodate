function itemViewObjectInit(params) {
	var bidd;
	
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
				_businessId: bidd.elem.data('bid'),
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
						'_businessId': bidd2._businessId,
						'businessEntityItemType': bidd2.businessEntityItemType,
						'businessEntityItemTypeLabel': bidd2.businessEntityItemTypeLabel,
						'businessEntityItemSubType': bidd2.businessEntityItemSubType,
						'_relatedViewModelId': bidd2._relatedViewModelId,
						'onUploadCompleteUrl': bidd2.onUploadCompleteUrl,
						'internalDataUrl': bidd2.internalDataUrl || '/'
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
					bidd.elem.append(htmlString).css({'display': 'block'});
				}
			}
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
				_businessId: bidd.elem.data('bid'),
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