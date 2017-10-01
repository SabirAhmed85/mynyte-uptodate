(function(){
   // DOM Ready - do your stuff
   MynyteApi = function () {
   		var disableScroll = false;
   		var windowOuterHeight = $(window).height();
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
		    .on('focus', 'input', function(e) {
		        $('body').addClass('fixfixed');
		    })
		    .on('blur', 'input', function(e) {
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

		include('//ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js', function() {
			$(document).ready(function() {
		   		//If Offers Feed Exists in Page
		   		if ($( "a.mynyte-table-book" ).length) {
		   			var obj = {'action':'getOffersFeed', '_businessId': 87};
			   		function jsonpCallback (reponse) {
			   			//console.log(response);
			   		}
					$.ajax({
						url: "https://www.mynyte.co.uk/sneak-preview/data/extApi/Profile.php?_businessId=87",
						type: "GET",
						dataType: "jsonp",
						jsonp: "jsonp",
						jsonpCallback: "getOffersFeed",
						crossDomain: true,
						//data: JSON.stringify(obj),
						success: function (successData) {
							successData = successData.items;
							$('head').append('<link rel="stylesheet" href="https://www.mynyte.co.uk/css/api-style.css" type="text/css" />');
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

							$('.mynyte-listings').append(htmlToAdd).css({'display': 'block'});
						},
						error: function (jqxhr,status,errorData) {

						},
						complete: function (data) {

						}
					});
				}

				//If MyNyte Book Table Feed Exists in Page
				if ($( "a.mynyte-table-book" ).length) {
					$('a.mynyte-table-book')
						.html("<img src='https://www.mynyte.co.uk/sneak-preview/img/logo.png' alt='Book a restraurant table with MyNyte'/><span>Book a table with MyNyte</span>")
						.css("display", "block");
					$('a.mynyte-table-book').on("click", function () {
						var myWindow = window.open("https://www.mynyte.co.uk/#/app/profile/", "mynyte-table-book-window", "width=485,height=560");
					});
				}


				//If MyNyte Book Table Feed Exists in Page
				if ($( "a.mynyte-event-entry-book" ).length) {
					$('a.mynyte-event-entry-book')
						.html("<img src='https://www.mynyte.co.uk/sneak-preview/img/logo.png' alt='Book event entry with MyNyte'/><span>Book event entry with MyNyte</span>")
						.css("display", "block");
					$('a.mynyte-event-entry-book').on("click", function () {
						var myWindow = window.open("https://www.mynyte.co.uk/#/app/profile/", "mynyte-table-book-window", "width=485,height=560");
					});
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
					var tableBookingImgAlt = 'Log into MyNyte to book tables and make your evening plans',
					tableBookingImgSrc = 'https://www.mynyte.co.uk/sneak-preview/img/logo.png',
					tableBookingTranscriptNote = '<b>Book Tables with ease</b>, and find out what\'s going on in town...',
					tableBookingFrameSrc = 'https://www.mynyte.co.uk/staging/#/app/externalApi/bookTable/light/87/0',
					tableBookingFrameBg = ($('div.mynyte-table-booking').hasClass("mn-dark")) ? '#212121': '#f7f7f7',
					tableBookingFrameStyle = 'height: calc(100%); background: '+tableBookingFrameBg+';';

					var tableBookingHtml = "<div class='container-header'>Book a Table with us through MyNyte</div>";
					tableBookingHtml += "<div class='container-dummy'><iframe allowtransparency='true' style='"+tableBookingFrameStyle+"' src='"+tableBookingFrameSrc+"'></iframe></div>";
					tableBookingHtml += "<div class='container-footer'><span class='footer-transcript-note'>"+tableBookingTranscriptNote+"</span><img class='mynyte-chat-logo' alt='"+tableBookingImgAlt+"' src='"+tableBookingImgSrc+"'/></div>";
					$('div.mynyte-table-booking')
						.html(tableBookingHtml)
						.css("display", "block")
						.addClass("mynyte-frame-container");
				}


				//If MyNyte Menu Display Plugin
				if ($( "div.mynyte-menu-display" ).length) {

					var menuDisplayImgAlt = 'Log into MyNyte to book tables and make your evening plans',
					menuDisplayImgSrc = 'https://www.mynyte.co.uk/sneak-preview/img/logo.png',
					menuDisplayTranscriptNote = '<b>Book Tables with ease</b>, and find out what\'s going on in town...';

					$('div.mynyte-menu-display')
						.css("display", "block");

					$.ajax({
						url: "https://www.mynyte.co.uk/sneak-preview/data/extApi/Profile.php?_businessId=87",
						type: "GET",
						dataType: "jsonp",
						jsonp: "jsonp",
						jsonpCallback: "getMenuItems",
						crossDomain: true,
						//data: JSON.stringify(obj),
						success: function (successData) {
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


							htmlToAdd += "<div class='container-footer'><span class='footer-transcript-note'>"+menuDisplayTranscriptNote+"</span><img class='mynyte-chat-logo' alt='"+menuDisplayImgAlt+"' src='"+menuDisplayImgSrc+"'/></div>";

							$('.mynyte-menu-display').addClass("mynyte-frame-container").append(htmlToAdd).css({'display': 'block'});

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
						},
						error: function (jqxhr,status,errorData) {

						},
						complete: function (data) {

						}
					});
				}

				//If MyNyte Business items SUmmary
				if ($( "div.mynyte-business-items-summary").length) {
					MynyteApi.pageVars['Page Object'] = {};
					MynyteApi.pageVars['Business Item Summary Displays'] = [];

					MynyteApi.pageVars['Business Item Summary Displays'][0] = {
						'businessEntityItemType': $( "div.mynyte-new-business-item").data('item-type'),
						'businessEntityItemTypeLabel': $( "div.mynyte-new-business-item").data('item-sub-type').split(",")[0],
						'businessEntityItemSubType': $( "div.mynyte-new-business-item").data('item-sub-type').split(",")[1]
					};

					dataConnect({
						className: 'BusinessEntity', 
						action: 'getBusinessEntityItems', 
						data: {
							_businessId: 1,
							businessEntityItemType: MynyteApi.pageVars['Business Item Summary Displays'][0]['businessEntityItemType']
							, extraFiltersString: "[['_Related User Account Id':= '126']]"
						},
						successCallback: function (params) {
							var successData = params.successData;
							var htmlString = "";
							var businessItems = {};
							console.log(successData);
							MynyteApi.pageVars['Page Object']["Business Items"] = {};

							function prepareBusinessItemsView () {
								var businessItems = MynyteApi.pageVars['Page Object']["Business Items"];
								for (var keys = Object.keys(businessItems), i = 0, end = keys.length; i < end; i++) {
									var ind = keys[i];
										console.log( businessItems[ind]);
									htmlString += "<div class='mynyte-business-items-summary-item'>";

									for (var prop in businessItems[ind]) {
										htmlString += "<div class='mynyte-label-container'><label class='mynyte-label'>" + prop + "</label>";
										htmlString += "<span class='mynyte-label-detail'>" + businessItems[ind][prop] + "</span></div>";
									}

									htmlString += "</div>";

									if (i == end - 1) {
										console.log(MynyteApi.pageVars);
										$( "div.mynyte-business-items-summary").append(htmlString).css({'display': 'block'});
									}
								}
							}

							for (var a= 0; a < successData["items"].length; a++) {
								var thisItem = successData["items"][a];
								if (!businessItems[thisItem["_id"]]) {
									businessItems[thisItem["_id"]] = {}
								}
								businessItems[thisItem["_id"]][thisItem["name"]] = thisItem["value"];

								if (a == successData["items"].length - 1) {
									MynyteApi.pageVars['Page Object']["Business Items"] = businessItems;
									prepareBusinessItemsView();
								}
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
						'businessEntityItemId': $("div.mynyte-business-item-detail").data('item-id')
					};

					dataConnect({
						className: 'BusinessEntity', 
						action: 'getBusinessEntityItemsMeta', 
						data: {
							_businessId: 1,
							_businessEntityItemId: MynyteApi.pageVars['Business Item Detail Displays'][0]['businessEntityItemId']
						},
						successCallback: function (params) {
							var successData = params.successData;
							var htmlString = "";
							MynyteApi.pageVars['Page Object'] = successData;

							for (var a= 0; a < successData["items"].length; a++) {
								htmlString += "<div class='mynyte-label-container'><label class='mynyte-label'>" + successData["items"][a]["name"] + "</label>";
								htmlString += "<span class='mynyte-label-detail'>" + successData["items"][a]["value"] + "</span></div>";


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
					MynyteApi.pageVars['Page Object'] = {};
					MynyteApi.pageVars['New Business Item Forms'] = [];

					MynyteApi.pageVars['New Business Item Forms'][0] = {
						'businessEntityItemType': $( "div.mynyte-new-business-item").data('item-type'),
						'businessEntityItemTypeLabel': $( "div.mynyte-new-business-item").data('item-sub-type').split(",")[0],
						'businessEntityItemSubType': $( "div.mynyte-new-business-item").data('item-sub-type').split(",")[1],
						'_relatedViewModelId': $( "div.mynyte-new-business-item").data('viewmodel-id')
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
							_businessId: 1,
							businessEntityItemType: MynyteApi.pageVars['New Business Item Forms'][0]['businessEntityItemType'],
							extraFiltersString: extraFiltersString,
							_relatedViewModelId: MynyteApi.pageVars['New Business Item Forms'][0]['_relatedViewModelId']
						},
						successCallback: function (params) {
							var thisSuccessData = params.successData;

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
								var htmlString = "<form action='#'' onsubmit='return MynyteApi.addBusinessItem();'>";
								var modelProperties = {};
								for (var a= 0; a < successData["items"].length; a++) {
									if (!modelProperties[successData["items"][a]["_propertyId"]]) {
										modelProperties[successData["items"][a]["_propertyId"]] = {};
									}

									var thisObj = modelProperties[successData["items"][a]["_propertyId"]];
									thisObj[successData["items"][a]["name"]] = successData["items"][a]["value"];

									if (a == successData["items"].length - 1) {
										for (var prop in modelProperties) {
											var inputString = "";
											var dataType  = modelProperties[prop]["Data Type"];

											if (dataType.indexOf('VARCHAR') > -1) {
												inputString = "<input name = '" + modelProperties[prop]["Name"] + "' class='mynyte-form-input mynyte-form-text-input' type='text' />";
											}
											/* THE REAL METHOD TO USE FOR INT WITH NO EXTRA LOGIC NEEDED
											else if (dataType.indexOf('INT') > -1) {
												inputString = "<input class='mynyte-form-input mynyte-form-text-input' type='number' />";
												inputString += businessOptionsHtml;
											}
											*/
											/*Should check if the option is a select-style option*/
											else if (dataType.indexOf('INT') > -1) {
												MynyteApi.selectToggle = function (elem) {
													if ($(elem).siblings('ul.mynyte-form-fake-select').eq(0).hasClass("open")) {
														$(elem).siblings('ul.mynyte-form-fake-select').eq(0).removeClass("open");
													} else {
														$(elem).siblings('ul.mynyte-form-fake-select').eq(0).addClass("open");
													}

													return false;
												}
												MynyteApi.selectOptionSelect = function (propName, option) {
													console.log(propName, option);
													//MynyteApi.pageVars["Page Object"][propName] = $(option).data("value");
													$(option).parents('ul').eq(0).siblings('.mynyte-form-fake-input').eq(0).attr("data-value", $(option).data("value"));
													$(option).parents('ul').eq(0).siblings('.mynyte-form-fake-input').eq(0).find('.selected-option-label').html($(option).html());
													$(option).parents('ul').eq(0).removeClass("open");
													console.log(MynyteApi.pageVars);
												}
												inputString = "<div data-name='" +  modelProperties[prop]["Name"] + "' class='mynyte-form-input mynyte-form-fake-input' onclick='return MynyteApi.selectToggle(this)'><span class='selected-option-label'></span><button class='mynyte-form-selecttoggler'></button></div>";
												inputString += businessOptionsHtml;
											}
											else if (dataType == 'DATE') {
												inputString = "<div data-name='" +  modelProperties[prop]["Name"] + "' class='mynyte-form-input mynyte-form-fake-input'><button class='mynyte-form-datepicker'></button></div>";
											}
											else if (dataType == 'TIME') {
												inputString = "<div data-name='" +  modelProperties[prop]["Name"] + "' class='mynyte-form-input mynyte-form-fake-input'><button class='mynyte-form-timepicker'></button></div>";
											}

											htmlString += "<div class='mynyte-form-field-container'><label class='mynyte-form-field-label'>" + modelProperties[prop]["Name"] + "</label>";
											htmlString += "<div class='mynyte-form-input-container'>" + inputString + "</div></div>";

										}

										htmlString += "<button type='submit'>Add Item</button>";
										htmlString += "</form>";

										MynyteApi.pageVars['Page Object']['Model'] = modelProperties;
										$( "div.mynyte-new-business-item").append(htmlString).css({'display': 'block'});
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
												_businessId: 1,
												businessEntityItemName: MynyteApi.pageVars['New Business Item Forms'][0]["businessEntityItemType"],
												nameValuePairString: inputString
											},
											successCallback: function (params) {
												var successData = params.successData;
												location.reload();
											},
											errorCallback: function (errorData) {

											}
										});
									}

									console.log(pageObjectModel);

									return false;
								};
							} 

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
						},
						errorCallback: function (errorData) {

						}
					});


				}
			});
		});

		MynyteApi.pageVars = {};

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

	}

	MynyteApi();


		
		
})();
