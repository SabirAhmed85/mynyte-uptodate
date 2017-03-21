// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

var app = angular.module('NightLife', ['ionic','ngSanitize'/*,'btford.socket-io'*/ ,'ngCordova', 'ionic-datepicker', 'ionic-timepicker', 'ngIOS9UIWebViewPatch', 'ngMap', 'locator', 'ngOpenFB', 'ionic.service.core', 'ionic.service.push', 'ImageCropper']);

// not necessary for a web based app // needed for cordova/ phonegap application
app.run(function($ionicPlatform, $rootScope, $state, Profile, $ionicHistory, $cordovaStatusbar, $ionicPopup, Listings, $cordovaSQLite, Categories, userService, ngFB, Messages, Notifications, $http, /*socket,*/ listingsService, categoriesService, userObjectService, pushNotificationsService, $timeout, $ionicModal, $ionicViewSwitcher) {
  
    Number.prototype.formatMoney = function(c, d, t){
        var n = this,
            c = isNaN(c = Math.abs(c)) ? 2 : c, 
            d = d == undefined ? "." : d, 
            t = t == undefined ? "," : t, 
            s = n < 0 ? "-" : "", 
            i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", 
            j = (j = i.length) > 3 ? j % 3 : 0;
           return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
    };
    
    isArray = function(a) {
        return (!!a) && (a.constructor === Array);
    };

    $rootScope.initialiseAppFunction = function ($scope) {
      //SET UP
      //Generic Global rootScope Functions
      
      /* BRING BACK WHEN SOCKET IS WORKING
      socket.on('join:app', function (data) {
        if ($rootScope.debugMode) {'Socket app joined: ',console.log(data);}
      });
      
      socket.on('connect', function (data) {
        if ($rootScope.debugMode) {
            alert('connected');
            console.log('Socket connected: ', data);
        }
      });
      
      socket.on('connect_error', function (data) {
        //alert('connect error');
        if ($rootScope.debugMode) {console.log('Socket Connect error: ', data);}
      });
      
      socket.on('new-message', function (data) {
        if ($rootScope.currentViewName != 'app.messageGroup' && $rootScope.currentViewName != 'app.messageGroup') {
            $rootScope.currentUnreadMessage = data.newMessage;
            
            $rootScope.notificationReleaseTimer = window.setTimeout(function () {
                $rootScope.currentUnreadMessages.splice(i, 1);
            
                if (i < $rootScope.currentUnreadMessages.length - 1) {
                    $rootScope.alertUnreadMessages(i + 1);
                } else {
                    $rootScope.currentNotificationType = null;
                    $rootScope.currentlyLoopingThroughNotifications = false;
                }
            }, 2000);
        }
      });
      */

      //SET UP INITIAL ON APP LOAD VARIABLESM(AND FIND A BETTER PLACE TO PUT THESE)
      //Prepare Categories for Selection
      //Functions that will be used in Various places
      $rootScope.online = navigator.onLine;
      $rootScope.offlineNoteHide = false;
      window.addEventListener("offline", function() {
        $rootScope.$apply(function() {
          $rootScope.online = false;
        });
      }, false);

      window.addEventListener("online", function() {
        $rootScope.$apply(function() {
          $rootScope.online = true;
        });
      }, false);
      
      categoriesService.addMusicCategories("").then(function () {
        $rootScope.nightFind2ndSelect = categoriesService.musicCategories();
      });
      categoriesService.addTownCategories().then(function () {
        $rootScope.townCategories = categoriesService.townCategories();
      });
      categoriesService.addUserEngagementTypes().then(function () {
        $rootScope.userEngagementTypes = categoriesService.userEngagementTypes();
      });
      
      /* Prepare All details for the user */
      $rootScope.userLoggedIn = false;
      
      $rootScope.goToUpdate = function () {
        if ($rootScope.currentUnreadUpdate && $rootScope.currentUnreadUpdate != null) {
            userObjectService.goToUpdate($rootScope.currentUnreadUpdate);
        }
      }
      
      /* PUSH NOTIFICATION GLOBAL FUNCTIONS */
    $rootScope.prepareMessageNotificationFinal = function (recipientsArray, contents, heading, dataObj) {
        Notifications.getOneSignalDeviceTokensForProfiles(recipientsArray).success(function (deviceTokens) {
            var deviceTokensArray = [];
            if (deviceTokens != null) {
                for (a = 0; a < deviceTokens.length; a++) {
                    deviceTokensArray.push(deviceTokens[a].oneSignalDeviceToken);
                    if (a == deviceTokens.length - 1) {
                        pushNotificationsService.sendNotificationFinal($rootScope.oneSignalAppId, deviceTokensArray, contents, heading, dataObj);
                    }
                }
            }
        }).error(function (errorData) {
            $rootScope.prepareMessageNotificationFinal(recipientsArray, contents, heading, dataObj);
        });
    }
      
      $rootScope.$broadcast('restorestate');
      userService.model.user = userService.model.user || {};
      $rootScope.user = userObjectService.createUserObject(userService.model.user);
      
      if (($rootScope._userOneSignalId == 0 || typeof($rootScope._userOneSignalId) === 'undefined') && $rootScope.userLoggedIn) {
        //Initialise background timers to get notifications and messages
        $rootScope.user = userObjectService.startUsersMessagesAndNotificationsUpdateTimer($rootScope.user);
      }
      
      
      
      
      //Initialise View Variables
      $rootScope.initialiseCategories = function () {
          if ($rootScope.townCategories
              && $rootScope.musicCategories
              && $rootScope.userEngagementTypes) {
              $rootScope.userLoggedIn = (typeof($rootScope.user._id) !== 'undefined') ? true: false;
          } else {
              $rootScope.userLoggedIn = (typeof($rootScope.user._id) !== 'undefined') ? true: false;
              window.setTimeout(function () { $rootScope.initialiseCategories() }, 500);
          }
      }
      
      $rootScope.initialiseCategories();
      
      $rootScope.nightFinderListingTypes = [
          {name: 'Bar/Club', displayIndex: -1, className: 'cluborbar', selected: false},
          {name: 'Cinema', displayIndex: 0, className: 'cinema', selected: false},
          {name: 'Club Night', displayIndex: 1, className: 'clubnight', selected: true},
          {name: 'Restaurant', displayIndex: 2, className: 'restaurant', selected: false},
          {name: 'Takeaway', displayIndex: 3, className: 'takeaway', selected: false}
      ];
      $rootScope.currentSelectedListingTypeToFind = 'clubnight';
      
      $rootScope.debugMode = false;
      $rootScope.relListing = null;
      $rootScope.nightFindSlideLocked = false;
      $rootScope.messageGroupTimer = null;
      $rootScope.addBackActiveUserTimer = null;
      $rootScope.currentMessageGroupIdBeingViewed = null;
      $rootScope.hideSearch = false;
      $rootScope.files = $rootScope.files || [];
      $rootScope.showFrontScreenCover = false;
      $rootScope.currentOrderTrayTotal = "0.00";
      $rootScope.showHeaderButtons = false;
      $rootScope.showNightLifeSearch = true;
      $rootScope.showUpdatePost = !$rootScope.showNightLifeSearch;
      $rootScope.showFeedUpdateScreenCover = false;
      $rootScope.currentMessageInputPlaceholder = "Type your message here ...";
      $rootScope.currentSearchTown = {name: "Bedford", _id: 1};
      $rootScope.currentSearchMusic = {name: "All Music Styles", _id: 0};
      $rootScope.currentSearchRestaurantFoodCat = {name: "All Cuisines", _id: 0};
      $rootScope.currentSearchTakeawayFoodCat = {name: "All Cuisines", _id: 0};
      $rootScope.currentSearchMovieCat = {name: "All Movie Styles", _id: 0};
      $rootScope.currentSearchClubOrBarCat = {name: "Bars & Clubs", _id: 0};
      $rootScope.currentSearchBusinessType = {name: "Takeaway", _id: 5};
      $rootScope.topRightButtonSRef = "app.addBusinessItem({itemType: 'OwnEvent'})";
      
      $rootScope.feedHeaderItem = "closed";
      $rootScope.appInitialised = true;
      
      $rootScope.oneSignalAppId = "5d38e847-c406-4e2e-85d6-27a76ce657f3";
      $rootScope.gcnProjectNumber = "357832123193";
      $rootScope._userOneSignalId = 0;
      $rootScope.userUpdateTimer = null;
      
      $scope.pageLoad();
    }
    
    $rootScope.checkForAppInit = function ($scope) {
        var appInit = function ($scope) {
            if ($rootScope.appInitialised != true) {
                if (typeof($rootScope.initialiseAppFunction) === 'undefined') {
                    window.setTimeout(function () {appInit($scope);}, 30); return false;}
                else {
                    $rootScope.initialiseAppFunction($scope);
                }
            } else {
                $scope.pageLoad();
            }
        }
        
        appInit($scope);
    }
  //$cordovaStatusBar.style = 1; //Light
  $ionicPlatform.ready(function(datesWorkerFS) {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    
    ngFB.init({appId: '1633788096937299'});
    
    if (navigator.splashscreen) {
        setTimeout(function() {
            navigator.splashscreen.hide();
        }, 10);
    };
    
    var cordovaPluginCheckCounter = 0;
    var checkForCordovaPlugins = function(){
        var countAgain = function () {
            cordovaPluginCheckCounter += 1;
            if (cordovaPluginCheckCounter < 10) {
                window.setTimeout(function () {checkForCordovaPlugins()}, 500);
            }
        }
        if (typeof(cordova) === 'undefined') {
            countAgain();
            return false;
        }
        if (cordova.plugins == null) {
            //console.log("Cordova plugins not Found");
            countAgain();
            return false;
        }
        
        if (cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.disableScroll(true);
        }
        else {
            countAgain();
        }
    };
    
    checkForCordovaPlugins();
    
    var oneSignalReady = function () {
      // Enable to debug issues.
      // window.plugins.OneSignal.setLogLevel({logLevel: 4, visualLevel: 4});
      // receive a call back? - output the data to console
        var notificationActionConfig = {
            goToMessage: {
                navFunction: function () {
                    $state.go('app.profile');
                    window.setTimeout(function () {
                        $state.go('app.messageGroups', {'groupType': data.msgGroupType});
                        window.setTimeout(function () {
                            $state.go('app.messageGroup', {'_id': data._msgGroupId, 'groupType': data.msgGroupType});
                        }, 300);
                    }, 500);
                    
                }
            },
            goToNotifications: {
                navFunction: function () {
                    $state.go('app.profile');
                    window.setTimeout(function () {
                        $state.go('app.notifications');
                    }, 500);
                }
            },
            goToBusinessItem: {
                navFunction: function () {
                    var businessItemTypeDetailed = data.businessItemType;
                    if (data.businessItemTypeDetailed) {
                       businessItemTypeDetailed = data.businessItemTypeDetailed;
                    }
                    $state.go('app.profile');
                    window.setTimeout(function () {
                        $state.go('app.businessItems', {'itemType': data.businessItemType, 'timeScale': 'present'});
                        window.setTimeout(function () {
                            $state.go('app.businessItem', {'_id': data._businessItemId, 'itemType': businessItemTypeDetailed, 'timeScale': 'present'});
                        }, 300);
                    }, 500);
                }
            },
            goToBusinessItems: {
                navFunction: function () {
                    $state.go('app.profile');
                    window.setTimeout(function () {
                        $state.go('app.businessItems', {'itemType': data.businessItemType, 'timeScale': 'present'});
                        
                    }, 500);
                }
            },
            goToFeedListingItem: {
                navFunction: function () {
                    $state.go('app.nlfeedListing', {'listingType': data.businessItemType, '_listingId': data._businessItemId});
                }
            },
            goToOffer: {
                navFunction: function () {
                    $state.go('app.offers');
                    window.setTimeout(function () {
                        $state.go('app.offerDetail', {'_id': data._businessItemId});
                        
                    }, 500);
                }
            },
            goToMyNyteActivity: {
                navFunction: function () {
                    $state.go('app.profile');
                    window.setTimeout(function () {
                        $state.go('app.businessItems', {'itemType': data.businessItemType, 'timeScale': 'present'});
                    }, 500);
                }
            }
        };
        
      var notificationOpenedCallback = function(jsonData) {
        var data = jsonData.notification.payload.additionalData;
        
        notificationActionConfig[data.actionFunction].navFunction();
      };
      
      var notificationReceivedCallback = function () {
        //var data = jsonData.notification.payload.additionalData;
        userObjectService.getUsersMessagesAndNotificationsUpdateDirectly($rootScope.user);
      }
      
      // for android, this'll both params need to be filled in. See https://documentation.onesignal.com/docs/cordova-sdk-setup
        
      window.plugins.OneSignal
      .startInit($rootScope.oneSignalAppId, $rootScope.gcnProjectNumber)
      .handleNotificationReceived(notificationReceivedCallback)
      .handleNotificationOpened(notificationOpenedCallback)
      .inFocusDisplaying(window.plugins.OneSignal.OSInFocusDisplayOption.None)
      .endInit();
      
      window.plugins.OneSignal.registerForPushNotifications();
      window.plugins.OneSignal.getIds(function(ids) {
          var _userProfileId = ($rootScope.userLoggedIn) ? $rootScope.user._profileId: 0;
          
          var createOneSignalId = function (_userProfileId) {
              Notifications.createOneSignalId(_userProfileId, $rootScope._userOneSignalId, ids.userId).success(function (successData) {
                
                if (successData[0]._oneSignalId == 0) {
                    $rootScope.user = userObjectService.startUsersMessagesAndNotificationsUpdateTimer($rootScope.user);
                }
                else if ($rootScope.userUpdateTimer != null) {
                    $timeout.cancel($rootScope.userUpdateTimer);
                    $rootScope.userUpdateTimer = null;
                }
                
                $rootScope._userOneSignalId = successData[0]._oneSignalId;
                $rootScope.user._oneSignalId = successData[0]._oneSignalId;
                userService.model._oneSignalId = $rootScope._userOneSignalId;
                $rootScope.makeUserActive($rootScope.user._profileId, $rootScope._userOneSignalId);
                $rootScope.$broadcast('savestate');
              }).error(function (errorData) {
                createOneSignalId(_userProfileId);
              });
          }
          
          createOneSignalId(_userProfileId);
      });
      
      //window.plugins.OneSignal.setSubscription(true);
      //verbose
      // change visual level to 6 for pop ups
      //window.plugins.OneSignal.setLogLevel({logLevel: 6, visualLevel: 6});
    };
    
    if (ionic.Platform.isAndroid() || ionic.Platform.isIOS() || ionic.Platform.isIPad()) {
        var oneSignalCheckCounter = 0;
        var checkForOneSignal = function(){
            var countAgain = function () {
                oneSignalCheckCounter += 1;
                if (oneSignalCheckCounter < 10) {
                    window.setTimeout(function () {checkForOneSignal()}, 500);
                }
            }
            if (window.plugins == null) {
                if ($rootScope.debugMode) {console.log("window plugins not Found");}
                countAgain();
                return false;
            }
            
            if (window.plugins.OneSignal) {
                if ($rootScope.debugMode) {alert("onesignal Ready");}
                oneSignalReady();
            } else {
                countAgain();
            }
        };
        
        checkForOneSignal();
        
        if (ionic.Platform.isIOS()) {
            $rootScope.callingEnabled = true;
        }
        else {
            var ua = navigator.userAgent.toLowerCase();
            var isAndroidMobile = ua.indexOf("android") > -1 && ua.indexOf("mobile") > -1;
            if(isAndroidMobile) {
                $rootScope.callingEnabled = true;
            }
        }
    }
    
    $rootScope.clearAllExpiredTransactions = function () {
        Notifications.clearAllExpiredTransactions().success(function (successData) {
            if ($rootScope.debugMode) {console.log('All Expired Transaction Success Data: ', successData);};
            var fullNotificationsArray = ["Taxi Booking Accepted", "Taxi Booking Not Available", "Table Booking Not Accepted", "Taxi Booking Won"];
            var fullNotificationsObject =
            {
                "Taxi Booking Accepted": {
                    "contents": "Your Taxi Booking Request has been accepted.",
                    "headings": "Taxi Booking Update",
                    "dataObj": {"actionFunction":"goToMyNyteActivity"},
                    "items": []
                },
                "Taxi Booking Not Available": {
                    "contents": "Your Taxi Booking Request has not been accepted.",
                    "headings": "Taxi Booking Update",
                    "dataObj": {"actionFunction":"goToMyNyteActivity"},
                    "items": []
                },
                "Table Booking Not Accepted": {
                    "contents": "Your Restaurant Table Booking Request has not been accepted.",
                    "headings": "Table Booking Update",
                    "dataObj": {"actionFunction":"goToMyNyteActivity"},
                    "items": []
                },
                "Taxi Booking Won": {
                    "contents": "You've just won a Taxi Booking!",
                    "headings": "Taxi Booking Won",
                    "dataObj": {"actionFunction":"goToBusinessItems", "businessItemType": "ownTaxiBookings"},
                    "items": []
                }
            };
                
            if (successData != null) {
                var prepareNotif = function (obj) {
                    if (obj["items"] != null && obj["items"].length > 0) {
                        $rootScope.prepareMessageNotificationFinal(obj["items"], obj["headings"], obj["contents"], obj["dataObj"]);
                    }
                }
                for (a = 0; a < successData.length; a++) {
                    fullNotificationsObject[successData[a].alertType]["items"].push(successData[a]._recipientProfileId);
                    
                    if (a == successData.length - 1) {
                        var obj = null;
                        for (b = 0; b < fullNotificationsArray.length; b++) {
                            obj = fullNotificationsObject[fullNotificationsArray[b]];
                            prepareNotif(obj);
                            
                            if (b == fullNotificationsArray.length - 1 && $rootScope.debugMode) {
                                console.log(fullNotificationsObject);
                            }
                        }
                    }
                }
            }
        }).error(function (errorData) {
            $rootScope.clearAllExpiredTransactions();
        });
    }
    
    $rootScope.clearAllExpiredTransactions();
    
    // DEFAULT ROOTSCOPE VARIABLES
    $rootScope.topRightButtonFunction = function () {
        //JUST Temporary until the clock Button becomes the default function
        $rootScope.showHeaderButtonsFunction();
    }
    $rootScope.feedTopRightButtonFunction = function () {
        //JUST Temporary until the clock Button becomes the default function
        $rootScope.showHeaderButtonsFunction();
    }
    
    $rootScope.allTabsObject = [
        {mainView: "app.profile",
        subViews: ["app.resetPassword", "app.registerIntro", "app.register", "app.notificationsSummary", "app.notification", "app.messageGroups", "app.messageGroup", "app.accountSettings", "app.accountSettingsAdvanced", "app.businessItems", "app.addBusinessItem", "app.businessItem", "app.businessItemSettings", "app.contacts", "app.addContact", "app.contactDetail", "app.profileItems", "app.addProfileItem", "app.contactMyNyte"]},
        {mainView: "app.offers",
        subViews: ["app.offerDetail"]},
        {mainView: "app.nlfeed",
        subViews: ["app.nlfeedListing", "app.nlfeedListing", "app.nlfeedListing-photos", "app.nlfeedListing-specific-photos", "bookTable", "app.bookTickets", "app.seeTrailer", "app.seeMenu", "app.seeMenuItems", "app.seeBusinessItems", "app.seeBusinessMenuItems", "app.completeTakeawayOrder"]},
        {mainView: "app.taxi",
        subViews: []},
        {mainView: "app.more",
        subViews: []}
    ];
        
    $rootScope.initialBackButtonFunction = function () {
        if ($ionicHistory.backTitle()) {
            $ionicHistory.goBack();
        } else {
            var allTabsObject = $rootScope.allTabsObject;
            var currentViewName = $rootScope.currentViewName;
            for (a = 0; a < allTabsObject.length; a++) {
                if (allTabsObject[a].subViews.indexOf(currentViewName) > -1) {
                    $ionicViewSwitcher.nextDirection('back');
                    $state.go(allTabsObject[a].mainView);
                    return false;
                }
            }
        }
        
        $rootScope.backButtonFunction = $rootScope.initialBackButtonFunction;
    }
    
    $rootScope.backButtonFunction = $rootScope.initialBackButtonFunction;
    
    $rootScope.showGlobalTownSelect = false;
    $rootScope.currentlyEditing = false;
    $rootScope.showSearchPanel = false;
    $rootScope.hideSearchClearButton = true;
    $rootScope.nightSearchOpen = true;
    $rootScope.showTheWhatsOpenFunction = true;
    $rootScope.hideSearch = false;
    $rootScope.searchInputPlaceholder = 'Search by name';
    $rootScope.searchOnRight = false;
    $rootScope.showAssistantButton = true;
    $rootScope.assistantButtonActive = true;
    $rootScope.showAssistantPanel = false;
    $rootScope.previousStateName = "nlfeed";
    $rootScope.searchQuery = "";
    
    $rootScope.searchPanelBusinessCatsToShow = [];
    $rootScope.searchPanelResultsToShow = [];
    
    /* Functions for top header bar utility */
    $rootScope.openAssistant = function () {
        if (!$rootScope.assistantButtonActive) {return false};
            //$rootScope.$apply();
        
        var assistantDisplayConfig = {
            'app.nlfeed': {
                'header-img': 'bayleaf.jpg',
                'detail-img-array': [
                    {'src': 'https://www.mynyte.co.uk/sneak-preview/img/user_images/cover_photo/bayleaf.jpg'}
                    , {'src': 'https://www.mynyte.co.uk/sneak-preview/img/user_images/cover_photo/alamin.jpg'}
                    , {'src': 'https://www.mynyte.co.uk/sneak-preview/img/user_images/cover_photo/el-greco.jpg'}]
            },
            'app.profile': {
                'header-img': 'bayleaf.jpg',
                'detail-img-array': [
                    {'src': 'https://www.mynyte.co.uk/sneak-preview/img/user_images/cover_photo/alamin.jpg'}
                    , {'src': 'https://www.mynyte.co.uk/sneak-preview/img/user_images/cover_photo/bayleaf.jpg'}
                    , {'src': 'https://www.mynyte.co.uk/sneak-preview/img/user_images/cover_photo/el-greco.jpg'}]
            },
            'app.offers': {
                'header-img': 'bayleaf.jpg',
                'detail-img-array': [
                    {'src': 'https://www.mynyte.co.uk/sneak-preview/img/user_images/cover_photo/bayleaf.jpg'}
                    , {'src': 'https://www.mynyte.co.uk/sneak-preview/img/user_images/cover_photo/alamin.jpg'}]
            },
            'app.taxi': {
                'header-img': 'bayleaf.jpg',
                'detail-img-array': [
                    {'src': 'https://www.mynyte.co.uk/sneak-preview/img/user_images/cover_photo/bayleaf.jpg'}
                    , {'src': 'https://www.mynyte.co.uk/sneak-preview/img/user_images/cover_photo/alamin.jpg'}
                    , {'src': 'https://www.mynyte.co.uk/sneak-preview/img/user_images/cover_photo/el-greco.jpg'}]
            }
        }
        
        $rootScope.allPopoverImages = assistantDisplayConfig[$rootScope.currentViewName]['detail-img-array'];
        $rootScope.showPopoverImages(0);
        
        $rootScope.topRightButtonFunction = function () {
            $rootScope.hideAssistant($rootScope);
        }
        
        $rootScope.searchActive = false;
    }
    
    $rootScope.hideAssistant = function () {
        $rootScope.showAssistantPanel = ($rootScope.hideSearch) ? false: $rootScope.showAssistantPanel;
        
        if ($rootScope.hideSearch && $rootScope.currentViewName == 'app.nlfeed') {
            $rootScope.searchActive = true;
        }
        
        $rootScope.topRightButtonFunction = ($rootScope.currentViewName != 'app.nlfeed') ? $rootScope.topRightButtonFunction : function () {
            $rootScope.showHeaderButtonsFunction();
        };
    }
    
    $rootScope.showSearchPanelFunc = function () {
        var getProfiles = function () {
            Profile.getProfiles($rootScope.currentSearchTown._id).success(function (successData) {
                var businessCatsToShow = [];
                var businessCatIndexesAdded = [];
                
                for (a = 0; a < successData.length; a++) {
                    if (successData[a].isBusiness == 1) {
                        if (businessCatIndexesAdded.indexOf(successData[a]._businessTypeId) == -1 && successData[a].showBusinessTypeInMainSearch == 1) {
                            if (successData[a].businessType == 'Restaurant' || successData[a].businessType == 'Takeaway') {
                                businessCatsToShow.unshift({_id: successData[a]._businessTypeId, name: successData[a].businessType});
                            } else {
                                businessCatsToShow.push({_id: successData[a]._businessTypeId, name: successData[a].businessType});
                            }
                            businessCatIndexesAdded.push(successData[a]._businessTypeId);
                        }
                    }
                }
                
                $rootScope.searchPanelBusinessCatsToShow = businessCatsToShow;
            }).error(function () {
                getProfiles();
            });
        }
        
        getProfiles();
        
        $rootScope.topRightButtonFunction = function () {
            $rootScope.hideSearchPanel();
        }
        $rootScope.feedTopRightButtonFunction = function () {
            $rootScope.hideSearchPanel();
        }
        
        $rootScope.searchQuery = "";
        $rootScope.searchInputPlaceholder = 'Search all places, people & events...';
        $rootScope.hideSearchClearButton = false;
        $rootScope.showAssistantButton = false;
        window.setTimeout(function () {
            $rootScope.showSearchPanel = true;
        }, 50);
    };
    $rootScope.conductSearch = function (searchQuery) {
        if (!$rootScope.showSearchPanel) {
            return false;
        }
        $rootScope.searchPanelResultsToShow = [];
        $rootScope.searchQuery = searchQuery;
        
        Profile.getListingsByName($rootScope.currentSearchTown._id, searchQuery).success(function (successData) {
            if (successData != 'null' && successData != null) {
                for (a = 0; a < successData.length; a++) {
                  listingsService.createListingTypesObjForListing(successData[a]);
                }
                $rootScope.searchPanelResultsToShow = successData;
            }
        }).error(function () {
            $rootScope.conductSearch(searchQuery);
        });
    };
    $rootScope.clearSearchInput = function () {
        $rootScope.searchQuery = "";
        $('#search-input').val("");
    }
    $rootScope.hideSearchPanel = function () {
        $rootScope.searchQuery = "";
        $('#search-input').val("");
        $rootScope.searchPanelResultsToShow = [];
        $rootScope.searchInputPlaceholder = 'Search by name';
        $rootScope.showSearchPanel = false;
        $rootScope.hideSearchClearButton = true;
        $rootScope.showAssistantButton = true;
        $rootScope.searchActive = true;
        
        $rootScope.topRightButtonFunction = function () {
            $rootScope.showHeaderButtonsFunction();
        }
        $rootScope.feedTopRightButtonFunction = function () {
            $rootScope.showHeaderButtonsFunction();
        }
    };
    $rootScope.hideHeaderButtonsFunction = function () {
        $rootScope.hideSearch = false;
        $rootScope.showHeaderButtons = false;
        $rootScope.topRightButtonIsClock = true;
        $rootScope.showAssistantButton = true;
        $rootScope.searchActive = true;
        $rootScope.topRightButtonFunction = function () {
            $rootScope.showHeaderButtonsFunction();
        }
        $rootScope.feedTopRightButtonFunction = function () {
            $rootScope.showHeaderButtonsFunction();
        }
        $rootScope.showSearchPanel = false;
    };
    
    $rootScope.fillRecipientSearchResults = function (results, $scope, chosenRecipientsArray, possRecipientsArray) {
        if ($rootScope.debugMode) {console.log(results);};
        if (results == null || results.length == 0 || results == 'null') {
            results = [];
        }
        var duplicate = [];
        for (a = 0; a < chosenRecipientsArray.length; a++) {
            for (b = 0; b < results.length; b++) {
                if (chosenRecipientsArray[a]._profileId == results[b]._profileId) {
                    results[b].deleteIt = true;
                }
            }
        }
        for (a = results.length - 1; a > -1; a--) {
            if (results[a].deleteIt == true) {
                results.splice(a, 1);
            }
        }
        possRecipientsArray = [];
        possRecipientsArray = results || [];
        
        return possRecipientsArray;
    }

    $rootScope.showHeaderButtonsFunction = function () {
        $rootScope.appLoading = true;
        
        Profile.getAllOpenBusinessAccountsByTown($rootScope.currentSearchTown._id, $rootScope.currentSearchBusinessType._id).success(function (successData) {
            if (successData != null) {
                $rootScope.searchPanelResultsToShow = successData;
            }
            else {
                $rootScope.searchPanelResultsToShow = [];
            }
            
            $rootScope.showAssistantButton = false;
            $rootScope.showSearchPanel = true;
            $rootScope.hideSearch = true;
            $rootScope.showHeaderButtons = true;
            $rootScope.topRightButtonIsClock = false;
            $rootScope.topRightButtonFunction = function () {
                $rootScope.hideHeaderButtonsFunction();
            }
            $rootScope.feedTopRightButtonFunction = function () {
                $rootScope.hideHeaderButtonsFunction();
            }
            $rootScope.appLoading = false;
        }).error(function (errorData) {
            $rootScope.showHeaderButtonsFunction();
        });
    };
    
    /* Generic functions for Feed Listing Pages */
    $rootScope.toggleUserEngagement = function (userEngagementType, listing, $event) {
        if ($rootScope.userLoggedIn) {
            for (a=0; a < $rootScope.userEngagementTypes.length; a++) {
                if ($rootScope.userEngagementTypes[a].name == userEngagementType) {
                    var relIndex = a;
                    var relId = (listing.listingType == 'Event' || listing.listingType == 'Offer' || listing.listingType == 'Movie') ? listing.relListingId: listing._profileId;
                    
                    function alterIconColor (listing) {
                        if (userEngagementType == 'Like' && listing.like == null) {
                            listing.like = '3';
                        }
                        else if (userEngagementType == 'Like') {
                            listing.like = null;
                        }
                        else if (userEngagementType == 'Watch' && listing.watch == null) {
                            listing.watch = '2';
                        }
                        else if (userEngagementType == 'Watch') {
                            listing.watch = null;
                        }
                        else if (userEngagementType == 'Follow' && (listing.follow == null || listing.follow == false) ) {
                            listing.follow = (listing.follow == null) ? '1' : true;
                        }
                        else if (userEngagementType == 'Follow') {
                            listing.follow = (listing.follow == '1') ? null : false;
                        }
                    }

                    function createEngagementFinal (listing) {
                        Profile.createUserEngagement($rootScope.userEngagementTypes[relIndex]._id, $rootScope.user._profileId, relId, listing.listingType, [], []).success(function () {
                            $rootScope.$broadcast('interacted-with-feed-listing', {_listingId: relId, listingType: listing.listingType, engagementType: $rootScope.userEngagementTypes[relIndex].name});
                            //alterIconColor(listing);
                        }).error(function () {
                            createEngagementFinal(listing);
                        });
                    }
                    function removeEngagementFinal (listing) {
                        Profile.deleteUserEngagement($rootScope.userEngagementTypes[relIndex]._id, $rootScope.user._profileId, relId, listing.listingType).success(function (successData) {
                            $rootScope.$broadcast('interacted-with-feed-listing', {_listingId: relId, listingType: listing.listingType, engagementType: $rootScope.userEngagementTypes[relIndex].name});
                            //alterIconColor(listing);
                        }).error(function () {
                            removeEngagementFinal(listing);
                        });
                    }

                    if (userEngagementType == 'Like' && listing.like == null) {
                        createEngagementFinal(listing);
                    }
                    else if (userEngagementType == 'Like') {
                        removeEngagementFinal(listing);
                    }
                    else if (userEngagementType == 'Watch' && listing.watch == null) {
                        createEngagementFinal(listing);
                    }
                    else if (userEngagementType == 'Watch') {
                        removeEngagementFinal(listing);
                    }
                    else if (userEngagementType == 'Follow' && listing.follow == null) {
                        createEngagementFinal(listing);
                    }
                    else if (userEngagementType == 'Follow') {
                        removeEngagementFinal(listing);
                    }
                }
            }
        }
        else {
            $state.go('app.profile');
        }
        
        $event.stopPropagation();
        $event.preventDefault();
    }
        
    $rootScope.handleListingsToUpdateInteractions = function (features, args) {
        for (a = 0; a < features.length; a++) {
            var relId = (features[a].listingType == 'Event' || features[a].listingType == 'Offer' || features[a].listingType == 'Movie') ? features[a].relListingId: features[a]._profileId;
            
            if (relId == args._listingId && features[a].listingType == args.listingType) {
                var relIndex = a;
                
                if (args.engagementType == 'Like' && features[relIndex].like == null) {
                    features[relIndex].like = '3';
                }
                else if (args.engagementType == 'Like') {
                    features[relIndex].like = null;
                }
                else if (args.engagementType == 'Watch' && features[relIndex].watch == null) {
                    features[relIndex].watch = '2';
                }
                else if (args.engagementType == 'Watch') {
                    features[relIndex].watch = null;
                }
                else if (args.engagementType == 'Follow' && (features[relIndex].follow == null || features[relIndex].follow == false) ) {
                    features[relIndex].follow = (features[relIndex].follow == null) ? '1' : true;
                }
                else if (args.engagementType == 'Follow') {
                    features[relIndex].follow = (features[relIndex].follow == '1') ? null : false;
                }
            }
        }
    }
    
    $rootScope.pinListingToMessage = function ($event, listing, listingType, listingSpecItemId, $scope) {
        if ($rootScope.userLoggedIn) {
            $rootScope.backButtonFunction = function () {
                if ($ionicHistory.currentStateName == "app.messageGroups") {
                    $state.go('app.profile');
                    var timer = window.setTimeout(function () {$state.go('app.nlfeed');}, 320);
                }
                else {
                    $ionicHistory.goBack();
                }
            }
            listing.relListingType = listingType;
            listing.relListingTypeAlias = (listingType.indexOf('Businesses') > -1) ? listingType.substr(listingType.indexOf('Businesses')+ 10, listingType.length) : listingType.substr(listingType.indexOf('Events')+ 6, listingType.length);
            listing.relListingTypeAlias = (listing.relListingTypeAlias == "") ? listingType: listing.relListingTypeAlias;
            listing.relListingSpecItemId = listingSpecItemId;
            $rootScope.relListing = listing;
            $rootScope.currentMessageInputPlaceholder = "Add a caption (optional) ...";
            $state.go('app.profile');
            var timer = window.setTimeout(function () {$state.go('app.messageGroups', {'relListing': listing, 'groupType': 'Person'});}, 240);
            $event.stopPropagation();
            $event.preventDefault();
        } else {
            $rootScope.showPopUp($scope, 'SendListing');
        }
    }

    $rootScope.shareListing = function ($event, listing) {
        $event.stopPropagation();
        $event.preventDefault();

        $rootScope.showFrontScreenType = "Share Listing";
        $rootScope.frontScreenCoverNote = "Share this ...";
        $rootScope.showFrontScreenCover = true;

        //$scope.shareViaTwitter('hey', 'something.jpg', 'www.hey.com');
        window.plugins.socialsharing.share('Hey', 'ermm', null, 'blah.com');
    }
    
    /* Functions For Actual Night Search */
    
    $rootScope.toogleNightSearch = function () {
        $rootScope.nightSearchOpen = !$rootScope.nightSearchOpen;
    }
    
    $rootScope.changeCurrentSearchBusinessType = function (businessTypeName) {
        var whatsOpenBusinessTypesArray = {
            Bar: 3,
            Club: 2,
            Restaurant: 4,
            Takeaway: 5
        };
        
        $rootScope.currentSearchBusinessType = {_id: whatsOpenBusinessTypesArray[businessTypeName], name: businessTypeName};
        
        if ($rootScope.showHeaderButtons) {
            $rootScope.showHeaderButtonsFunction();
        }
    }

    $rootScope.showPopUp = function ($scope, popUpType) {
      var messages = {
          Guestlist: 'get on the Guestlist for this event',
          BookTable: 'book a table at this restaurant',
          Enquiry: 'make this enquiry',
          Message: 'send a message to this person',
          SendListing: 'send this listing to friends',
          Like: 'follow, watch or like this listing'
      }
      $ionicPopup.show({
          title: 'Log In to proceed',
          template: '<i class="ion-person main-icon"></i><p>You must be logged in to '+messages[popUpType]+'</p>',
          //subTitle: 'Are you sure you want to Delete this item?',
          buttons: [
              { 
                  text: 'Close',
                  onTap: function(e) {
                  } 
              },
              { 
                  text: 'Log in now',
                  onTap: function(e) {
                      $state.go('app.profile');
                  } 
              }
          ],
          scope: $scope
      });
    };
 
	$rootScope.showPopoverImages = function(index) {
        window.screen.unlockOrientation();
        
		$rootScope.activeSlide = index;
		$rootScope.showPopoverModal('templates/shared-partials/image-popover.html');
	}
 
	$rootScope.showPopoverModal = function(templateUrl) {
		$ionicModal.fromTemplateUrl(templateUrl, {
			scope: $rootScope,
			animation: 'scale-in'
		}).then(function(modal) {
			$rootScope.modal = modal;
			$rootScope.modal.show();
		});
	}
 
	// Close the modal
	$rootScope.closePopoverModal = function() {
        if (window.screen.lockOrientation) { window.screen.lockOrientation('portrait'); }
		$rootScope.modal.hide();
		$rootScope.modal.remove();
        
        $rootScope.hideAssistant();
	};
    
    $rootScope.selectExtraOption = function (chosenOptionItem, $event, obj) {
        var mustBeSelectedOptions = [
            'offerType'
            ,'offerStartPeriod'
            ,'offerRegularityType'
            ,'eventRegularityType'
            ,'eventGuestListOption'
        ];
        
        chosenOptionItem.mustBeSelected = (mustBeSelectedOptions.indexOf(chosenOptionItem.itemType) != -1) ? true: false;
        
        switch(chosenOptionItem.itemType) {
            case 'offerType':
                obj.selectedOfferType = chosenOptionItem;
                break;
            case 'offerStartPeriod':
                obj.selectedOfferStartPeriod = chosenOptionItem;
                break;
            case 'offerRegularityType':
                obj.selectedOfferRegularityType = chosenOptionItem;
                break;
            case 'eventRegularityType':
                obj.selectedEventRegularityType = chosenOptionItem;
                break;
            case 'eventGuestListOption':
                obj.selectedEventGuestListOption = chosenOptionItem;
                break;
        }

        $event.preventDefault();
    }
    
    $rootScope.checkIfDisplayNameTaken = function (displayName, $scope) {
        if (displayName.length > 4) {
            Profile.checkIfDisplayNameTaken(displayName).success(function (result) {
                $scope.displayNameTaken = (parseInt(result["total"]) > 0) ? true: false;
            }).error(function () {
                $rootScope.checkIfDisplayNameTaken(displayName, $scope);
            });
        }
    }
    
  });
});


/* main controller function */
app.controller('MainCtrl', ['$scope', '$ionicSideMenuDelegate', '$ionicHistory', function($scope, $ionicSideMenuDelegate, $ionicHistory) {
  	// Toggle left function for app sidebar
  	$scope.toggleLeft = function() {
    	$ionicSideMenuDelegate.toggleLeft();
  	};
  	// go back to previous page
  	$scope.goBackOne = function(){
		$ionicHistory.goBack();
	}
}])

app.config(function($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
    // Allow same origin resource loads.
    'self',
    // Allow loading from our assets domain.  Notice the difference between * and **.
    'http://www.youtube.com/**'
  ]);
})

// config to disable default ionic navbar back button text and setting a new icon
// logo in back button can be replaced from /templates/sidebar-menu.html file
app.config(function($ionicConfigProvider) {
    $ionicConfigProvider.tabs.position('bottom');
    $ionicConfigProvider.backButton.text('').icon('ion-ios-arrow-back').previousTitleText(false);
})

    /* INTRODUCE WHEN CREATED
    // intro controller // 
    app.controller('IntroCtrl', ['$scope', '$state', '$ionicSlideBoxDelegate', function($scope, $state, $ionicSlideBoxDelegate) {
      // Called to navigate to the main app
      $scope.next = function() {
        $ionicSlideBoxDelegate.next();
      };
      $scope.previous = function() {
        $ionicSlideBoxDelegate.previous();
      };

      // Called each time the slide changes
      $scope.slideChanged = function(index) {
        $scope.slideIndex = index;
      };
      // discard and move to homepage
      $scope.discardIntroPage = function(){
            $state.go('app.login');
      }
    }])
    */

    /* RE-INTRODUCE IN FUTURE
    // Videos Controller
    app.controller('VideosCtrl', ['$rootScope', '$state', '$stateParams', '$scope', '$sce', 'Offers', 'Profile', 'Events', 'Taxi', function($rootScope, $state, $stateParams, $scope, $sce, Offers, Profile, Events, Taxi) {
        //Variables & Constants
        $scope.videos = [];
        $scope.itemType = $stateParams.itemType;
        
        switch($stateParams.itemType) {
            case 'Party Playlists':
                $scope.getVideos = function () {
                    $scope.videos = [{title: 'The Weeknd', src: 'http://www.youtube.com/embed/KEI4qSrkPAs'}, {title: 'Drake - Hotline Bling', src: 'http://www.youtube.com/embed/uxpDa-c-4Mc'}];
                    for (a = 0; a < $scope.videos.length; a++) {
                        $scope.videos[a].src = $sce.trustAsResourceUrl($scope.videos[a].src);
                    }
     
                    Offers.getOffersByBusinessId($rootScope.user._id).success(function (successData) {
                        console.log(successData);
                        if (successData != 'null') {
                            $scope.businessItems = successData;
                        }
                    }).error(function () {
                    
                    });
     
                }
                
                //Updates based on Outside events
                $rootScope.$on('new-offer', function(event, args) {
                    $scope.getBusinessItems();
                    // do what you want to do
                })
                break;
            case 'Movie Trailers':
                $scope.getVideos = function () {
                    $scope.videos = [{title: 'The Revenant', src: 'http://www.youtube.com/embed/LoebZZ8K5N0'}, {title: 'Something Else', src: 'http://www.youtube.com/embed/COvnHv42T-A'}];
                    for (a = 0; a < $scope.videos.length; a++) {
                        $scope.videos[a].src = $sce.trustAsResourceUrl($scope.videos[a].src);
                    }
     
                    ///
                    Events.getEventsByBusiness($rootScope.user._id).success(function (successData) {
                        console.log(successData);
                        console.log($rootScope.user);
                        if (successData != 'null') {
                            $scope.businessItems = successData;
                        }
                    }).error(function () {
                    
                    });
                    ///
     
                }
                break;
        };
        
        $scope.getVideos();
        
        ///
        BusinessItems.getBusinessItems($stateParams.itemType, $stateParams.timeScale).success(function (businessItems) {
            if (businessItems != 'null') {
                $scope.businessitems = businessItems;
            }
        }.error(function () {
        
        }));
        ///
    }]);
    */

/* Pop up */
app.controller('PopupCtrl',function($scope, $ionicPopup, $timeout) {

    // Triggered on a button click, or some other target
    $scope.showPopup = function(popupType, optionChoice) {
        $scope.data = {}

        if (popupType == "ConfirmDelete") {
           // An elaborate, custom popup to delete
           var confirmDelete = $ionicPopup.show({
             title: 'Delete Item',
             template: '<p>Are you sure you want to Delete this item?</p>',
             //subTitle: 'Are you sure you want to Delete this item?',
             scope: $scope,
             buttons: [
               { text: 'Cancel' },
               {
                 text: '<b>Confirm</b>',
                 type: 'button-positive',
                 onTap: function(e) {
                   $scope.deleteOptionChoice(optionChoice, 1);
                 }
               },
             ]
           });
        }
        else if (popupType == "NewMenuExtraOptionOption") {
           // An elaborate, custom popup to delete
           var confirmDelete = $ionicPopup.show({
             template: '<input type="text" placeholder="Option Choice Name" ng-model="currentOptionBeingAdded.name"><label ng-show="businessItem.priceRelevant" class="field-label">Extra Charge</label><input type="number" placeholder="Extra Charge" step="0.01" ng-model="currentOptionBeingAdded.extraPrice" ng-show="businessItem.priceRelevant"><label class="field-label">Order in the list (sequence)</label><input class="order-index" type="number" step="1" ng-model="currentOptionBeingAdded.orderIndex">',
             title: 'New Option Choice',
             scope: $scope,
             buttons: [
               { text: 'Cancel' },
               {
                 text: '<b>Save</b>',
                 type: 'button-positive',
                 onTap: function(e) {
                   $scope.createOptionChoice();
                 }
               },
             ]
           });
        }
    };
   
   /* EXAMPLES
   
   var myPopup = $ionicPopup.show({
     template: '<input type="password" ng-model="data.wifi">',
     title: 'Enter Wi-Fi Password',
     subTitle: 'Please use normal things',
     scope: $scope,
     buttons: [
       { text: 'Cancel' },
       {
         text: '<b>Save</b>',
         type: 'button-positive',
         onTap: function(e) {
           if (!$scope.data.wifi) {
             //don't allow the user to close unless he enters wifi password
             e.preventDefault();
           } else {
             return $scope.data.wifi;
           }
         }
       },
     ]
   });
   myPopup.then(function(res) {
     console.log('Tapped!', res);
   });
   $timeout(function() {
      myPopup.close(); //close the popup after 3 seconds for some reason
   }, 3000);
   
   // A confirm dialog
   $scope.showConfirm = function() {
     var confirmPopup = $ionicPopup.confirm({
       title: 'Consume Ice Cream',
       template: 'Are you sure you want to eat this ice cream?'
     });
     confirmPopup.then(function(res) {
       if(res) {
         console.log('You are sure');
       } else {
         console.log('You are not sure');
       }
     });
   };

   // An alert dialog
   $scope.showAlert = function() {
     var alertPopup = $ionicPopup.alert({
       title: 'Don\'t eat that!',
       template: 'It might taste good'
     });
     alertPopup.then(function(res) {
       console.log('Thank you for not eating my delicious ice cream cone');
     });
   };
   */
});
/*
.controller('ImagePopoverCtrl', function($scope, $ionicModal) {
	$scope.allImages = [{
		'src' : 'img/pic1.jpg'
	}, {
		'src' : 'img/pic2.jpg'
	}, {
		'src' : 'img/pic3.jpg'
	}];
 
	$scope.showPopoverImages = function(index) {
		$scope.activeSlide = index;
		$scope.showModal('templates/shared-partials/image-popover.html');
	}
 
	$scope.showModal = function(templateUrl) {
		$ionicModal.fromTemplateUrl(templateUrl, {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function(modal) {
			$scope.modal = modal;
			$scope.modal.show();
		});
	}
 
	// Close the modal
	$scope.closeModal = function() {
		$scope.modal.hide();
		$scope.modal.remove()
	};
});
*/
