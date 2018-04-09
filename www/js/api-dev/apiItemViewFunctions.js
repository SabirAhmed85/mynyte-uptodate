function itemViewObjectInit(params) {
	var bidd;
	
	MynyteApi.pageVars['Business Item Detail Displays'] = MynyteApi.pageVars['Business Item Detail Displays'] || [];

	MynyteApi.pageVars['Business Item Detail Displays'][MynyteApi.pageVars['Business Item Detail Displays'].length] = {
		'businessEntityItemId': (window.location.href.indexOf('?_itemId') > -1) ? window.location.href.substr(window.location.href.indexOf('?_itemId=') + 9, window.location.href.length): params.businessEntityItemId || $("div.mynyte-business-item-detail").data('item-id'),
		'businessEntityItemType': params.businessEntityItemType || '/',
		'internalDataUrl': params.internalDataUrl|| '/',
		'_relatedViewModelId': params._relatedViewModelId,
		'htmlViewModelMethod': params.htmlViewModelMethod || 'default',
		'htmlViewModelScript': params.htmlViewModelScript || '',
		'htmlViewModelParams': params.htmlViewModelParams || {},
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
			model = params.existingVars.model,
			oldParams = params.existingVars.oldParams,
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
				var params2 = {
					'_businessId': oldParams._businessId,
					'businessEntityItemType': oldParams.businessEntityItemType,
					'businessEntityItemTypeLabel': oldParams.businessEntityItemTypeLabel,
					'businessEntityItemSubType': oldParams.businessEntityItemSubType,
					'_relatedViewModelId': oldParams._relatedViewModelId,
					'onUploadCompleteUrl': oldParams.onUploadCompleteUrl,
					'internalDataUrl': oldParams.internalDataUrl || '/'
				};
				formObjectInit(params2);
				//loopPropertiesToCreateItemHtml();
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