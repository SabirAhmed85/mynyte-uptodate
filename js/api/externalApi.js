(function(){
   // DOM Ready - do your stuff
   MynyteApi = function () {
   		var disableScroll = false;
   		var windowOuterHeight = $(window).height();
		
		MynyteApi.pageVars = {};
		MynyteApi.pageVars['Globals'] = {
			'Mynyte': {
				'main-logo': 'https://www.mynyte.co.uk/sneak-preview/img/logo.png',
				'table-booking-frame-src': 'https://www.mynyte.co.uk/staging/#/app/externalApi/bookTable/light/87/0'
			},
			'Myday': {
				'main-logo': 'https://www.mydayapp.co.uk/sneak-preview/img/logo.png'
			}
		};
		
		function disableScrolling() {
		    disableScroll = true;
		}
		function enableScrolling() {
		    disableScroll = false;
		}
		$('body').ontouchmove = function(e){
		   if(disableScroll){
		     e.preventDefault();
		   } 
		}

		function dataConnect (params) {
			var className = params.className;
			var action = params.action;
			var data = params.data || null;
			var existingVars = params.existingVars || null;
			var successCallback = params.successCallback || function () {};
			var errorCallback = params.errorCallback || function () {};

			var jsonpCallback = function (reponse) {};

			$.ajax({
				url: "https://www.mynyte.co.uk/sneak-preview/data/extApi/"+className+".php?action="+action,
				type: "GET",
				dataType: "jsonp",
				jsonp: "jsonp",
				jsonpCallback: action,
				context: self,
				crossDomain: true,
				data: data,
				success: function (successData) {
					successCallback({successData: successData, existingVars: existingVars});
				},
				error: function (jqxhr,status,errorData) {
					errorCallback(errorData);
				},
				complete: function (data) {

				}
			});
		}

		function lockScroll () {
			// lock scroll position, but retain settings for later
			var scrollPosition = [
				self.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft,
				self.pageYOffset || document.documentElement.scrollTop  || document.body.scrollTop
			];
			var html = jQuery('html'); // it would make more sense to apply this to body, but IE7 won't have that
			html.data('scroll-position', scrollPosition);
			html.data('previous-overflow', html.css('overflow'));
			html.css('overflow', 'hidden');
			window.scrollTo(scrollPosition[0], scrollPosition[1]);
		}

		function unlockScroll() {
			var html = jQuery('html');
			var scrollPosition = html.data('scroll-position');
			html.css('overflow', html.data('previous-overflow'));
			window.scrollTo(scrollPosition[0], scrollPosition[1]);
		}

		$(document)
		    .on('focus', 'input.popup-input', function(e) {
		        $('body').addClass('fixfixed');
		    })
		    .on('blur', 'input.popup-input', function(e) {
		        $('body').removeClass('fixfixed');
		    });

   		function include(filename, onload) {
		    var head = document.getElementsByTagName('head')[0];
		    var script = document.createElement('script');
		    script.src = filename;
		    script.type = 'text/javascript';
		    script.onload = script.onreadystatechange = function() {
		        if (script.readyState) {
		            if (script.readyState === 'complete' || script.readyState === 'loaded') {
		                script.onreadystatechange = null;                                                  
		                onload();
		            }
		        } 
		        else {
		            onload();          
		        }
		    };
		    head.appendChild(script);
		}

		function openPopup(params) {
			var speed = (params.speed == 'fast') ? 1: 250;
			lockScroll();
			disableScrolling();

			//Only for IOS
			if (navigator.userAgent.match(/(iP(od|hone|ad))/)) {   
				var offset = document.body.scrollTop;
				document.body.style.top = (offset * -1) + 'px';
				document.body.classList.add('mn-modal--opened');
			}

			window.setTimeout(function () {$('.mynyte-popup-cover').addClass("mynyte-popup-open")}, speed);

			if (params.onComplete) {
				params.onComplete();
			}
		}

		function closePopup(params) {
			$('.mynyte-popup-cover').removeClass("mynyte-popup-open");
			// un-lock scroll position
		  	unlockScroll();
		    enableScrolling();

			//IOS Only
			if (navigator.userAgent.match(/(iP(od|hone|ad))/)) {   
				var offset = parseInt(document.body.style.top, 10);
  				document.body.classList.remove('mn-modal--opened');
  				document.body.scrollTop = (offset * -1);
  			}

		}
		
		function createFeed (params) {
			var elem = params.elem;
			var feedType = params.feedType;
			var feedTypeAction = {'offersFeed': 'getOffersFeed', 'menuDisplay': 'getMenuItems'};
			
			dataConnect({
				'className': 'Profile',
				'action': feedTypeAction[feedType],
				'data': {'_businessId': 87},
				'existingVars': params,
				'successCallback': function (params) {
					var successData = params.successData;
					var existingVars = params.existingVars;
					
					if (feedType == 'offersFeed') {
						successData = successData.items;
						console.log(params);
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
					else if (feedType == 'menuDisplay') {
						console.log(successData);
						successData = successData.items;
						var categories = {};

						var htmlToAdd = "<div class='container-header'>See our Menu</div>";
						htmlToAdd += "<div class='container-dummy'>";
						for (var a = 0; a < successData.length; a++) {
						  if (categories[successData[a].menuItemCategoryName] === undefined) {
							categories[successData[a].menuItemCategoryName] = [];
						  }
						  if (a == successData.length - 1) {
							for (var b = 0; b < successData.length; b++) {
								categories[successData[b].menuItemCategoryName].push({'name': successData[b].Name, 'price': successData[b].Price});

								if (b == successData.length - 1) {

									for (var cat in categories) {
										if (categories.hasOwnProperty(cat)) {
											htmlToAdd += "<div class='listing listing-menu-item'>";
											htmlToAdd += "<div class='header'>"+cat+"<span class='listing-menu-item-open'>+</span></div>";
											htmlToAdd += "<div class='body'>"
											for (var c = 0; c < categories[cat].length; c++) {
												htmlToAdd += "<div class='text-container'><span class='title'>"+categories[cat][c]["name"]+"</span><span class='options'>Options</span><span class='price'>£ "+categories[cat][c]["price"]+"</span></div>";

												if (c == categories[cat].length - 1) {
													$('.header').on("click", function () {
														$(this).siblings('.body').addClass('open');
													});
												}
											}
											htmlToAdd += "</div></div>";
										}
									}
								}
							}
						  }
						}
						htmlToAdd += "</div>";


						htmlToAdd += "<div class='container-footer'><span class='footer-transcript-note'>"+existingVars.menuDisplayTranscriptNote+"</span><img class='mynyte-chat-logo' alt='"+existingVars.menuDisplayImgAlt+"' src='"+existingVars.menuDisplayImgSrc+"'/></div>";
						console.log(htmlToAdd);
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
				},
				'errorCallback': function () {
					
				}
			});
		}

		function createButton (params) {
			var onclickFn, elem;
			var type = params.type;
			var brand = params.currentBrand || 'Mynyte';
			var brandObj = MynyteApi.pageVars['Globals'][brand];

			var buttonsHtmlObj = {
				'MyNyteTableBook': {
					html: "<img src='"+brandObj['main-logo']+"' alt='Book a restraurant table with MyNyte'/><span>Book a table with MyNyte</span>",
					elem: $( "a.mynyte-table-book" ),
					colourScheme: 'dark',
					onclickFn: function () {
						var myWindow = window.open("https://www.mynyte.co.uk/#/app/profile/", "mynyte-table-book-window", "width=485,height=560");
					}
				},
				'MyNyteEventEntryBook': {
					html: "<img src='"+brandObj['main-logo']+"' alt='Book event entry with MyNyte'/><span>Book event entry with MyNyte</span>",
					elem: $( "a.mynyte-event-entry-book" ),
					colourScheme: 'dark',
					onclickFn: function () {
						var myWindow = window.open("https://www.mynyte.co.uk/#/app/profile/", "mynyte-table-book-window", "width=485,height=560");
					}
				}
			};

			elem = params.elem || buttonsHtmlObj[type]['elem'];
			onclickFn = params.onclickFn || buttonsHtmlObj[type]['onclickFn'] || null;
			colourScheme = params.colourScheme || buttonsHtmlObj[type]['colorScheme'] || 'dark';
			
			

			elem
				.html(buttonsHtmlObj[type]['html'])
				.css("display", "block");

			if (onclickFn != null) {
				elem
				.on("click", onclickFn);
			}
		}
		
		function createPortal (params) {
			var elem, html, onComplete;
			var type = params.type;
			var colourScheme = params.colourScheme || 'dark';
			var brand = params.brand || 'Mynyte';
			
			var portalObj = {
				'TableBooking': {
					html: "<div class='container-header'>Book a Table with us through MyNyte</div><div class='container-dummy'><iframe allowtransparency='true' style='height: calc(100%); background: '"+((colourScheme == 'dark') ? '#212121': '#f7f7f7')+";' src='"+MynyteApi.pageVars['Globals'][brand]['table-booking-frame-src']+"'></iframe></div><div class='container-footer'><span class='footer-transcript-note'><b>Book Tables with ease</b>, and find out what\'s going on in town...</span><img class='mynyte-chat-logo' alt='Log into MyNyte to book tables and make your evening plans' src='"+MynyteApi.pageVars['Globals'][brand]['main-logo']+"'/></div>",
					elem: $('.mynyte-table-booking'),
					onComplete: function () {
						$('div.mynyte-table-booking').addClass("mynyte-frame-container");
					}
				}
			};
			
			onComplete = params.onComplete || portalObj[type]['onComplete'] || null;
			elem = params.elem || portalObj[type]['elem'];
			htmlText = portalObj[type]['html'];
			console.log(portalObj[type]);
			elem.html(htmlText).css("display", "block");
				
			if (onComplete != null) {
				onComplete();
			}
		}
		
		function loopObjPropsToCompileObj (viewType, _businessId, i, successData, businessItems, htmlString, htmlElem) {
			var thisItem = successData["items"][i];
		
			function nextItem () {
				if (i == successData["items"].length - 1) {
					MynyteApi.pageVars['Page Object']["Business Items"] = businessItems;
					prepareBusinessItemsView(viewType, successData, htmlString, htmlElem);
				}
				else {
					loopObjPropsToCompileObj(viewType, _businessId, i + 1, successData, businessItems, htmlString, htmlElem);
				}
			}
		
			if (!businessItems[thisItem["_id"]]) {
				businessItems[thisItem["_id"]] = {}
			}
			
			businessItems[thisItem["_id"]]["_id"] = thisItem["_id"];
			
			if (thisItem["metaName"].indexOf("Arr[]") == -1 && thisItem["metaName"].indexOf("_") != 0) {
				businessItems[thisItem["_id"]][thisItem["metaName"]] = thisItem["metaValue"];
		
				nextItem();
			}
			else if (thisItem["metaName"].indexOf("Arr[]") == -1 && thisItem["metaName"].indexOf("_Related") == 0 && viewType == 'Dropdown Selection') {
				businessItems[thisItem["_id"]][thisItem["metaName"]] = thisItem["metaValue"];
				
				nextItem();
			}
			else if (thisItem["metaName"].indexOf("Arr[]") == -1 && thisItem["metaName"].indexOf("_Related") == 0 && viewType != 'Dropdown Selection') {
				function getPosition(string, subString, index) {
					return string.split(subString, index).join(subString).length;
				}
				var thisItemId = thisItem["_id"];
				var thisItemMetaName = thisItem["metaName"];
				var thisItemMetaNameFormatted = thisItem["metaName"].replace(/-/g, "").replace("_", "").replace(" Id", "");
				var firstStringPos = getPosition(thisItem["metaName"], "-", 1);
				var lastStringPos = getPosition(thisItem["metaName"], "-", 2);
				var thisItemPropertyName = thisItem["metaName"].substring(firstStringPos + 1, lastStringPos);
				console.log(thisItemMetaName, thisItemPropertyName, firstStringPos, lastStringPos);
				dataConnect({
					existingVars: {"thisItemId": thisItemId, "thisItemMetaName": thisItemMetaName,
						"thisItemMetaNameFormatted": thisItemMetaNameFormatted},
					className: 'BusinessEntity', 
					action: 'getBusinessEntityItemsMeta', 
					data: {
						_businessId: _businessId,
						_businessEntityItemId: thisItem["metaValue"]
					},
					successCallback: function (success) {
					console.log(thisItemPropertyName);
					
						if (MynyteApi.pageVars['Business Item Summary Displays'] && MynyteApi.pageVars['Business Item Summary Displays'][0]['specialProps'] && MynyteApi.pageVars['Business Item Summary Displays'][0]['specialProps'][thisItemPropertyName]) {
						console.log(thisItemPropertyName);
							var counter = 0;
							businessItems[success["existingVars"]["thisItemId"]][success["existingVars"]["thisItemMetaNameFormatted"]] = "";

							for (var z = 0; z < success["successData"]["items"].length; z++) {
							console.log(thisItemPropertyName);
								if (MynyteApi.pageVars['Business Item Summary Displays'][0]['specialProps'][thisItemPropertyName].indexOf(success["successData"]["items"][z]["metaName"]) > -1) {
									if (counter > 0) {
										businessItems[success["existingVars"]["thisItemId"]][success["existingVars"]["thisItemMetaNameFormatted"]] += " - ";
									}
									businessItems[success["existingVars"]["thisItemId"]][success["existingVars"]["thisItemMetaNameFormatted"]] += success["successData"]["items"][z]["metaValue"];
									counter += 1;
								}
							
								if (z == success["successData"]["items"].length - 1) {
									nextItem();
								}
							}
						}
						else {
							businessItems[success["existingVars"]["thisItemId"]][success["existingVars"]["thisItemMetaNameFormatted"]] = success["successData"]["items"][0]["metaValue"];
							nextItem();
						}
					},
					errorCallback: function () {

					}
				});
			}
			else if (thisItem["metaName"].indexOf("Arr[]") > -1) {
				var metaNameFormatted = thisItem["metaName"].replace(" Arr[]", "");
				businessItems[thisItem["_id"]]["Arrays"] = businessItems[thisItem["_id"]]["Arrays"] || {};
				businessItems[thisItem["_id"]]["Arrays"][metaNameFormatted] = businessItems[thisItem["_id"]]["Arrays"][metaNameFormatted] || [];
				businessItems[thisItem["_id"]]["Arrays"][metaNameFormatted].push(thisItem["metaValue"]);
		
				nextItem();
			}
		}
		
		function prepareBusinessItemsView (viewType, successData, htmlString, htmlElem) {
			console.log(viewType);
			console.log(successData);
			if (successData["items"] != null) {
				var businessItems = MynyteApi.pageVars['Page Object']["Business Items"];
				var dropdownClass = (viewType == 'Dropdown Selection') ? "": " dropdown-selection-option";
				for (var keys = Object.keys(businessItems), i = 0, end = keys.length; i < end; i++) {
					var ind = keys[i];
						console.log( businessItems[ind]);
					var elemType = (viewType == 'Dropdown Selection') ? 'li': 'div';
					htmlString += "<"+elemType+" class='mynyte-business-items-summary-item"+dropdownClass+"' data-item-ref='"+businessItems[ind]["_id"]+"'>";

					for (var prop in businessItems[ind]) {
						if (prop != "Arrays") {
							htmlString += "<div class='mynyte-label-container "+prop+"-label-container'><label class='mynyte-label'>" + prop + "</label>";
							htmlString += "<span class='mynyte-label-detail'>" + businessItems[ind][prop] + "</span></div>";
						} else {
							for (var prop2 in businessItems[ind][prop]) {
								htmlString += "<div class='mynyte-label-container "+prop+"-label-container'><label class='mynyte-label'>" + prop2 + "</label>";
								htmlString += "<span class='mynyte-label-detail'><ul>";
								for (var a = 0; a < businessItems[ind][prop][prop2].length; a++) {
									htmlString += "<li>" + businessItems[ind][prop][prop2][a] + "</li>";
								}
								htmlString += "</ul></span></div>";
							}
						}
					}
					
					
					if (viewType == 'Item Summary') {
						htmlString += "<a href='" + htmlElem.data('link') + ind + "' class='action-button view-detail-button'>View Detail</a>";
						htmlString += "</div>";
					}
					else if (viewType == 'Dropdown Selection') {
						htmlString += "<a onclick='MynyteApi.addItemToFormFromDropdown(this);' class='action-button dropdown-option-select-button'>Select</a>";
						console.log(htmlString);
					}
					
					htmlString += "</"+elemType+">";

					if (i == end - 1 && viewType == 'Item Summary') {
						console.log(MynyteApi.pageVars);
						htmlElem.append(htmlString).css({'display': 'block'});
					}
					else if (i == end - 1 && viewType == 'Dropdown Selection') {
						console.log(htmlString);
						htmlElem.append(htmlString);
					}
				}
			}
			else {
				htmlString = "<div>" + MynyteApi.pageVars['Business Item Summary Displays'][0]["noItemsNote"] + "</div>";
				
				if (viewType == 'Item Summary') {
					htmlElem.append(htmlString).css({'display': 'block'});
				}
				else if (viewType == 'Dropdown Selection') {
					console.log(htmlString);
					htmlElem.append(htmlString);
				}
			}
		}
		
		function toggleRelatedItemSelect(e, elem) {
			e.preventDefault();
			var propLabel = $(elem).data('name'),
				popupCover = $('body').find('.dropdown-wrapper.'+propLabel+'-dropdown-wrapper').parents('.mynyte-popup-cover');
			console.log(propLabel);
			if (popupCover.hasClass('mynyte-popup-open')) {
				popupCover.removeClass('mynyte-popup-open');
			} else {
				popupCover.addClass('mynyte-popup-open');
			}
		}
		
		function addItemToFormFromDropdown (button) {
			console.log(button);
			var input, propLabel,
				item = $(button).parents('li').data('item-ref'),
				parUl = $(button).parents('li').parents('ul.dropdown'),
				classList = parUl.attr('class').split(/\s+/);
				
			$(button).parents('.mynyte-popup-open').removeClass('mynyte-popup-open');
			$.each(classList, function(index, i) {
    			if (i.indexOf('-dropdown') > -1) {
        			//do something
					console.log(i.substr(0, i.indexOf('-dropdown')));
					propLabel = i.substr(0, i.indexOf('-dropdown'));
					input = $('.mynyte-form-input.mynyte-form-fake-input[data-name="'+propLabel+'"]');
					$(input).find('.selected-option-label').html('Hello');
    			}
			});
			console.log(item);
		}

		include('//ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js', function() {
			$(document).ready(function() {
				//General css files
				$('head').append('<link rel="stylesheet" href="https://www.mynyte.co.uk/css/api-style.css" type="text/css" />');
				$('head').append('<link rel="stylesheet" href="https://webfonts.creativecloud.com/c/69721a/1w;quicksand,2,WXp:W:n4,WXn:W:n7/l" type="text/css" />');
				$('head').append('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" type="text/css" />');
				
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
					}
				}
				
				//If MyNyte Table Booking Plugin
				if ($( "div.mynyte-table-booking" ).length) {
					/*
					var tableBookingImgAlt = 'Log into MyNyte to book tables and make your evening plans',
					tableBookingImgSrc = 'https://www.mynyte.co.uk/sneak-preview/img/logo.png',
					tableBookingTranscriptNote = '<b>Book Tables with ease</b>, and find out what\'s going on in town...',
					tableBookingFrameSrc = 'https://www.mynyte.co.uk/staging/#/app/externalApi/bookTable/light/87/0',
					tableBookingFrameBg = ($('div.mynyte-table-booking').hasClass("mn-dark")) ? '#212121': '#f7f7f7',
					tableBookingFrameStyle = 'height: calc(100%); background: '+($('div.mynyte-table-booking').hasClass("mn-dark")) ? '#212121': '#f7f7f7'+';';

					var tableBookingHtml = "<div class='container-header'>Book a Table with us through MyNyte</div>";
					tableBookingHtml += "<div class='container-dummy'><iframe allowtransparency='true' style='"+tableBookingFrameStyle+"' src='"+tableBookingFrameSrc+"'></iframe></div>";
					tableBookingHtml += "<div class='container-footer'><span class='footer-transcript-note'>"+tableBookingTranscriptNote+"</span><img class='mynyte-chat-logo' alt='"+tableBookingImgAlt+"' src='"+tableBookingImgSrc+"'/></div>";
					*/
					
					createPortal({'type': TableBooking, 'onComplete': function () {$('div.mynyte-table-booking').addClass("mynyte-frame-container")}});
				}


				//If MyNyte Menu Display Plugin
				if ($( "div.mynyte-menu-display" ).length) {
					//createFeed({'feedType': 'menuDisplay', 'menuDisplayImgAlt': 'Log into MyNyte to book tables and make your evening plans', 'menuDisplayImgSrc': 'https://www.mynyte.co.uk/sneak-preview/img/logo.png', 'menuDisplayTranscriptNote': '<b>Book Tables with ease</b>, and find out what\'s going on in town...'});
				}

				//If MyNyte Business items SUmmary
				if ($( "div.mynyte-business-items-summary").length) {
					var htmlDiv = $( "div.mynyte-business-items-summary");
					
					MynyteApi.pageVars['Page Object'] = {};
					MynyteApi.pageVars['Business Item Summary Displays'] = [];

					MynyteApi.pageVars['Business Item Summary Displays'][0] = {
						'_businessId': htmlDiv.data('bid'),
						'businessEntityItemType': htmlDiv.data('item-type'),
						'businessEntityItemTypeLabel': htmlDiv.data('item-sub-type').split(",")[0],
						'businessEntityItemSubType': htmlDiv.data('item-sub-type').split(",")[1],
						'extraFiltersString': htmlDiv.data('item-extra-filters'),
						'noItemsNote': htmlDiv.data('no-items-note') || "You currently have 0 " + htmlDiv.data('item-sub-type').split(",")[1] + "s.",
                        'specialProps': htmlDiv.data('special-prop')
					};

					dataConnect({
						className: 'BusinessEntity', 
						action: 'getBusinessEntityItems', 
						data: {
							_businessId: MynyteApi.pageVars['Business Item Summary Displays'][0]['_businessId'],
							businessEntityItemType: MynyteApi.pageVars['Business Item Summary Displays'][0]['businessEntityItemType']
							, extraFiltersString: MynyteApi.pageVars['Business Item Summary Displays'][0]['extraFiltersString']
						},
						successCallback: function (params) {
							var viewType = 'Item Summary',
								_businessId = MynyteApi.pageVars['Business Item Summary Displays'][0]['_businessId'],
								i = 0,
								successData = params.successData,
								businessItems = {},
								htmlString = "";
							console.log(successData);
							MynyteApi.pageVars['Page Object']["Business Items"] = {};

                            if (successData["items"] != null) {
                                loopObjPropsToCompileObj(viewType, _businessId, i, successData, businessItems, htmlString, $( "div.mynyte-business-items-summary"));
                            }
                            else {
                                prepareBusinessItemsView(viewType, successData, htmlString, $( "div.mynyte-business-items-summary"));
                            }
						},
						errorCallback: function (errorData) {

						}
					});
				}

				//If MyNyte Business items SUmmary
				if ($("div.mynyte-business-item-detail").length) {
					MynyteApi.pageVars['Page Object'] = {};
					MynyteApi.pageVars['Business Item Detail Displays'] = [];

					MynyteApi.pageVars['Business Item Detail Displays'][0] = {
						'businessEntityItemId': (window.location.href.indexOf('?_itemId') > -1) ? window.location.href.substr(window.location.href.indexOf('?_itemId=') + 9, window.location.href.length): $("div.mynyte-business-item-detail").data('item-id')
					};

					dataConnect({
						className: 'BusinessEntity', 
						action: 'getBusinessEntityItemsMeta', 
						data: {
							_businessId: $("div.mynyte-business-item-detail").data('bid'),
							_businessEntityItemId: MynyteApi.pageVars['Business Item Detail Displays'][0]['businessEntityItemId']
						},
						successCallback: function (params) {
							var successData = params.successData;
							var htmlString = "";
							MynyteApi.pageVars['Page Object'] = successData;

							for (var a= 0; a < successData["items"].length; a++) {
								htmlString += "<div class='mynyte-label-container'><label class='mynyte-label'>" + successData["items"][a]["metaName"] + "</label>";
								htmlString += "<span class='mynyte-label-detail'>" + successData["items"][a]["metaValue"] + "</span></div>";


								if (a == successData["items"].length - 1) {
									$( "div.mynyte-business-item-detail").append(htmlString).css({'display': 'block'});
								}
							}
						},
						errorCallback: function (errorData) {

						}
					});

				}

				//If MyNyte Business items SUmmary
				if ($( "div.mynyte-new-business-item").length) {
					var htmlDiv = $( "div.mynyte-new-business-item");
					MynyteApi.pageVars['Page Object'] = {};
					MynyteApi.pageVars['New Business Item Forms'] = [];

					MynyteApi.pageVars['New Business Item Forms'][0] = {
						'_businessId': htmlDiv.data('bid'),
						'businessEntityItemType': htmlDiv.data('item-type'),
						'businessEntityItemTypeLabel': htmlDiv.data('item-sub-type').split(",")[0],
						'businessEntityItemSubType': htmlDiv.data('item-sub-type').split(",")[1],
						'_relatedViewModelId': htmlDiv.data('viewmodel-id'),
						'onUploadCompleteUrl': htmlDiv.data('link')
					};

					var extraFiltersString = "";
					if ($( "div.mynyte-new-business-item").data('item-extra-filters').length) {
						for (var a = 0; a < $( "div.mynyte-new-business-item").data('item-extra-filters').split("||").length; a++) {
							var thisObj = $( "div.mynyte-new-business-item").data('item-extra-filters').split("||")[a];
							extraFiltersString += "[[" + thisObj + "]]";
						}
					}
					else {
						extraFiltersString = null;
					}

					dataConnect({className: 'BusinessEntity', action: 'getBusinessEntityItemModel', 
						data: {
							_businessId: MynyteApi.pageVars['New Business Item Forms'][0]['_businessId'],
							businessEntityItemType: MynyteApi.pageVars['New Business Item Forms'][0]['businessEntityItemType'],
							extraFiltersString: extraFiltersString,
							_relatedViewModelId: MynyteApi.pageVars['New Business Item Forms'][0]['_relatedViewModelId']
						},
						successCallback: function (params) {
							var successData = params.successData;

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
								function createForm () {
									var htmlString = "<form action='#'' onsubmit='return MynyteApi.addBusinessItem();'>";
									var modelProperties = {};
									for (var a= 0; a < successData["items"].length; a++) {
										if (!modelProperties[successData["items"][a]["_propertyId"]]) {
											modelProperties[successData["items"][a]["_propertyId"]] = {};
										}

										var thisObj = modelProperties[successData["items"][a]["_propertyId"]];
										thisObj[successData["items"][a]["metaName"]] = successData["items"][a]["metaValue"];

										if (a == successData["items"].length - 1) {
											var keys = Object.keys(modelProperties);
											
											function completeForm () {
												htmlString += "<div class='mynyte-form-field-container mynyte-button-container'><button type='submit'>Add Item</button></div>";
												htmlString += "</form>";

												MynyteApi.pageVars['Page Object']['Model'] = modelProperties;
												$( "div.mynyte-new-business-item").append(htmlString).css({'display': 'block'});	
											}
											
											function addPropFinal (i, isReqLabel, inputString) {
												var prop = keys[i];
												htmlString += "<div class='mynyte-form-field-container'><label class='mynyte-form-field-label'>" + modelProperties[prop]["Name"] + isReqLabel + "</label>";
												htmlString += "<div class='mynyte-form-input-container'>" + inputString + "</div></div>";
												
												if (i < keys.length - 1) {
													console.log(i);
													compilePropToAdd(i+1);
												}
												else {
													completeForm();
												}	
											}
											
											function compilePropToAdd (i) {
												var prop = keys[i];
												console.log(modelProperties[prop]);
												var inputString = "";
												var dataType  = modelProperties[prop]["Data Type"];
												var name = modelProperties[prop]["Name"];
												var isReq = (modelProperties[prop]["Is Required"]) ? " required-input": "";
												var isReqLabel = (modelProperties[prop]["Is Required"]) ? " (Required)": "";
												var maxLen = (modelProperties[prop]["Max Length"]) ? " data-maxLength='"+modelProperties[prop]["Max Length"]+"'": "";
												var minLen = (modelProperties[prop]["Min Length"]) ? " data-minLength='"+modelProperties[prop]["Min Length"]+"'": "";
												var propType = modelProperties[prop]["Prop Type"];
												var propSubType = modelProperties[prop]["Prop Sub-Type"];

												if (dataType.indexOf('VARCHAR') > -1) {
													inputString = "<input name = '" +name+ "' class='mynyte-form-input mynyte-form-text-input"+isReq+"' type='text' "+maxLen+""+minLen+" />";
													if (maxLen != "") {
														inputString += "<span class='input-maxlength-note'>" + modelProperties[prop]["Max Length"] + " Char Max</span>";
													}
													
													addPropFinal(i, isReqLabel, inputString);
												}
												/* THE REAL METHOD TO USE FOR INT WITH NO EXTRA LOGIC NEEDED */
												else if (dataType.indexOf('INT') > -1 && propType != null) {
													inputString = "<input name='"+name+"' class='mynyte-form-input mynyte-form-text-input"+isReq+"' type='number' "+maxLen+""+minLen+" />";
													if (maxLen != "") {
														inputString += "<span class='input-maxlength-note'>" + modelProperties[prop]["Max Length"] + " Char Max</span>";
													}
													
													addPropFinal(i, isReqLabel, inputString);
												}
												
												//Should check if the option is a select-style option

												else if (dataType.indexOf('INT') > -1 && propType == null) {		
															propType = 'Catalogue Item';
															propSubType = 'Property';
															propLabel = 'Business Entity Item';
															propSubLabel = "'Related Business Entity Specific Item Type'";
															
													var itemTypeObj = {
														'Business Entity Item': {
															class: 'BusinessEntity', action: 'getBusinessEntityItems',
															data: {
																_businessId: MynyteApi.pageVars['New Business Item Forms'][0]['_businessId'],
																businessEntityItemType: propType,
																extraFiltersString: "[["+propSubLabel+"='Property']]",
																_relatedViewModelId: 'NULL'
															}	
														}
													};
													
													dataConnect({
														className: itemTypeObj[propLabel]['class'], action: itemTypeObj[propLabel]['action'], 
														data: itemTypeObj[propLabel]['data'],
														successCallback: function (params) {
															var viewType = 'Dropdown Selection',
																_businessId = MynyteApi.pageVars['New Business Item Forms'][0]['_businessId'],
																ind = 0, 
																successData = params.successData, 
																businessItems = {}, 
																htmlString = "", 
																htmlElem = null,
																propNameToDisplay = modelProperties[prop]["Name"].substr((modelProperties[prop]["Name"].indexOf('_') == 0) ? 1: 0, modelProperties[prop]["Name"].length).replace(" Id", ""),
																propNameCssFormat = modelProperties[prop]["Name"].replace(/ /g, '-').toLowerCase(),
																popupHtml = '<div class="mynyte-popup-cover dropdown-wrapper price-dropdown-wrapper"><div class="mynyte-popup"><div class="mn-popup-body"><div class="dropdown-wrapper '+name.replace(/ /g, '-').toLowerCase()+'-dropdown-wrapper"><h4>Select a '+propNameToDisplay+'</h4><i data-name="' + propNameCssFormat + '" class="fa fa-times" onclick="return MynyteApi.toggleRelatedItemSelect(event, this)"></i><ul class="dropdown '+name.replace(/ /g, '-').toLowerCase()+'-dropdown"></ul></div></div></div>';
																
															MynyteApi.pageVars['Page Object']["Business Items"] = {};
																
															$('body').append(popupHtml);
															
															loopObjPropsToCompileObj (viewType, _businessId, ind, successData, {}, "", $('.dropdown'));
															console.log(successData);
															
															inputString = "<div data-name='" + propNameCssFormat + "' class='mynyte-form-input mynyte-form-fake-input' onclick='return MynyteApi.toggleRelatedItemSelect(event, this)'><span class='selected-option-label'></span><button class='mynyte-form-select-toggler'><i class='fa fa-chevron-down'></i></button></div>";
															inputString += "";
															
															addPropFinal(i, isReqLabel, inputString);
														},
														errorCallback: function (errorDara) {
															console.log("error: ", errorData);
														}
													});
												}
												else if (dataType == 'DATE') {
													inputString = "<div data-name='" +  modelProperties[prop]["Name"] + "' class='mynyte-form-input mynyte-form-fake-input"+isReq+"'><button class='mynyte-form-datepicker'></button></div>";
													
													addPropFinal(i, isReqLabel, inputString);
												}
												else if (dataType == 'TIME') {
													inputString = "<div data-name='" +  modelProperties[prop]["Name"] + "' class='mynyte-form-input mynyte-form-fake-input"+isReq+"'><button class='mynyte-form-timepicker'></button></div>";
													
													addPropFinal(i, isReqLabel, inputString);
												}
											}
											
											compilePropToAdd(0);
										}
									}
								}

								MynyteApi.addBusinessItem = function () {
									var pageObjectModel = MynyteApi.pageVars['Page Object']['Model'];
									MynyteApi.pageVars['Page Object']['Has Error'] = false;

									for (var prop in pageObjectModel) {
										var name = pageObjectModel[prop]["Name"];
										var inputType = null;
										if ($('input[name="' + name + '"]').length) {
											pageObjectModel[prop]["Value"] = $('input[name="' + name + '"]').val();
											inputType = 'input';
										}
										else if ($('div[data-name="' + name + '"]').length) {
											pageObjectModel[prop]["Value"] = $('div[data-name="' + name + '"]').attr('data-value');
											
											inputType = 'div';
										}
										else if ($('textarea[name="' + name + '"]').length) {
											pageObjectModel[prop]["Value"] = $('textarea[name="' + name + '"]').val();
											inputType = 'textarea';
										}

										if (pageObjectModel[prop]["Value"] == "" || typeof(pageObjectModel[prop]["Value"]) === 'undefined') {
											pageObjectModel[prop]["error"] = "Please fill in a value for this field";
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
											};
											MynyteApi.pageVars['Page Object']['Has Error'] = true;
										}
										else {
											pageObjectModel[prop]["error"] = null;
										}
									}

									MynyteApi.pageVars['Page Object']['Model'] = pageObjectModel;


									if (!MynyteApi.pageVars['Page Object']['Has Error']) {
										var pageObjectModel = MynyteApi.pageVars['Page Object']['Model'];
										var inputString = "";

										for(var keys = Object.keys(pageObjectModel), i = 0, end = keys.length; i < end; i++) {
										  inputString += "[['" + pageObjectModel[keys[i]]["Name"] + "', '" + pageObjectModel[keys[i]]["Value"] + "']]";

										  if (i < end - 1) { inputString += ",";}
										  else if (i == end - 1) {
										  	if (typeof(MynyteApi.pageVars['New Business Item Forms'][0]['businessEntityItemSubType']) !== 'undefined') {
										  		inputString += ", [['" + MynyteApi.pageVars['New Business Item Forms'][0]['businessEntityItemTypeLabel'] + "', '" + MynyteApi.pageVars['New Business Item Forms'][0]['businessEntityItemSubType'] + "']]";	
										  	}
										  	inputString += ", [['Date Created', CURDATE()]], [['Time Created', CURTIME()]]";
										  }
										};

										dataConnect({
											className: 'BusinessEntity', 
											action: 'addBusinessEntityItem', 
											data: {
												_businessId: MynyteApi.pageVars['New Business Item Forms'][0]['_businessId'],
												businessEntityItemName: MynyteApi.pageVars['New Business Item Forms'][0]["businessEntityItemType"],
												nameValuePairString: inputString
											},
											successCallback: function (params) {
												var successData = params.successData;
												window.location.href = MynyteApi.pageVars['New Business Item Forms'][0]['onUploadCompleteUrl'];
											},
											errorCallback: function (errorData) {

											}
										});
									}

									console.log(pageObjectModel);

									return false;
								};

								createForm();

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
			});
		});

		MynyteApi.processContact = function (obj) {
			$.ajax({
			  url: "https://www.mynyte.co.uk/sneak-preview/data/extApi/Profile.php?action=registerContact",
			  method: "POST",
			  data: JSON.stringify(obj),
			  dataType: 'json'
			}).success(function (successData) {
				console.log(successData);
			}).error(function (errorData) {
        		console.log(errorData);
			});
		}

		MynyteApi.dataConnect = function (params) {
			dataConnect(params);
		}
		
		MynyteApi.createFeed = function (params) {
			createFeed(params);	
		}
		
		MynyteApi.createButton = function (params) {
			createButton(params);	
		}
		
		MynyteApi.createPortal = function (params) {
			createPortal(params);	
		}
		
		MynyteApi.toggleRelatedItemSelect = function (event, elem) {
			toggleRelatedItemSelect(event, elem);
		};
		
		MynyteApi.addItemToFormFromDropdown = function (button) {
			addItemToFormFromDropdown(button);
		};
		
	}

	MynyteApi();


		
		
})();
