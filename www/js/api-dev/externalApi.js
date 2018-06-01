(function(){
//Global Reused Functions

// DOM Ready - do your stuff
MynyteApi = function () {
		//***apiSetupVarsScript***//

	//***apiGlobalFunctionsScript***//

	//***apiDataConnectScript***//

	//***apiPopupScript***//

	//***apiCreateHTMLScript***//

	//***apiFormFunctions***//

	//***apiItemViewFunctions***//
	
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
			bisd,
			itemPluralName = (params.businessEntityItemSubType.indexOf(params.businessEntityItemSubType.length - 1) == 'y') ? params.businessEntityItemSubType.substr(0, params.businessEntityItemSubType.length - 1) + 'ies': params.businessEntityItemType + 's';

		createPopup({'class': 'simple-loader', 'iconClass': 'circle-o-notch fa-spin fa-4x', 'message': 'Loading ' + itemPluralName});
		openPopup({'class': 'simple-loader', 'speed': 'fast'});
		
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
                	successData = (successData.items[0].vmIndex == null) ? successData: orderObjPropsByVMIndex({items: successData.items});
                    loopObjPropsToCompileObj({'format': 'default', 'viewType': viewType, '_businessId': _businessId, 'i': i, 'successData': successData, 'businessItems': businessItems, 'htmlString': htmlString, 'htmlElem': $( "div.mynyte-business-items-summary"), 'objIndex': 0});
                }
                else if (successData.items != null && (bisd.htmlViewModelMethod == 'custom' && bisd.htmlViewModelScript != '')) {
                	successData = (successData.items[0].vmIndex == null) ? successData: orderObjPropsByVMIndex({items: successData.items});
                	loopObjPropsToCompileObj({'format': 'custom', 'viewType': viewType, '_businessId': _businessId, 'i': i, 'successData': successData, 'businessItems': businessItems, 'htmlString': htmlString, 'htmlElem': $( "div.mynyte-business-items-summary"), 'htmlViewModelParams': bisd.htmlViewModelParams, 'htmlViewModelScript': bisd.htmlViewModelScript, 'internalDataUrl': bisd.internalDataUrl, 'objIndex': 0});
                }
                else {
                    prepareBusinessItemsView({'format': 'custom', 'viewType': viewType, 'successData': successData, 'htmlString': htmlString, 'htmlElem': $( "div.mynyte-business-items-summary"), 'objIndex': 0});
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
		var items = params.items,
			newItems;

		function compare(a,b) {
		  if (parseInt(a.vmIndex) < parseInt(b.vmIndex))
		    return -1;
		  if (parseInt(a.vmIndex) > parseInt(b.vmIndex))
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
				thisItemMetaNameWithHyphen = thisItem.metaName.replace(" Id", "- Id").replace("_Related ", "_Related -"),
				thisItemMetaNameFormatted = thisItemMetaNameWithHyphen.replace(/-/g, "").replace("_", "").replace(" Id", ""),
				firstStringPos = getPosition(thisItemMetaNameWithHyphen, "-", 1),
				lastStringPos = getPosition(thisItemMetaNameWithHyphen, "-", 2),
				thisItemPropertyName = thisItemMetaNameWithHyphen.substring(firstStringPos + 1, lastStringPos),
				specialProps = JSON.parse(MynyteApi.pageVars['Business Item Summary Displays'][0].specialProps);
			
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
					if (MynyteApi.pageVars['Business Item Summary Displays'] && MynyteApi.pageVars['Business Item Summary Displays'][0].specialProps && specialProps[thisItemPropertyName]) {
						var counter = 0;
						businessItems[success.existingVars.thisItemId][success.existingVars.thisItemMetaNameFormatted] = "";

						for (var z = 0; z < success.successData.items.length; z++) {
							if (specialProps[thisItemPropertyName].indexOf(success.successData.items[z].metaName) > -1) {
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
			for (var ind = firstItemIndex; ind < lastItemIndex; ind++) {
				htmlString += businessItemsSummaryItemHTML({element: 'itemStart', item: businessItems[ind], view: viewType});

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
					closePopup({'class': 'simple-loader'});
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
						closePopup({'class': 'simple-loader'});
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
				closePopup({'class': 'simple-loader'});
			}
			else if (viewType == 'Dropdown Selection') {
				htmlElem.append(htmlString);
			}
		}
	}

	function prepareMyNyteItems () {
		$(document).ready(function() {
			//***apiImportScriptsScript***//
			
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