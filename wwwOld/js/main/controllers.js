// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
//var app = angular.module('NightLife', ['ionic','ngSanitize', 'ngCordova','ngIOS9UIWebViewPatch','mobsocial.products', 'ngMap', 'ui.grid', 'ui.grid.pagination', 'locator']);
var app = angular.module('NightLife', ['ionic','ngSanitize', 'ngCordova', 'ionic-datepicker', 'ionic-timepicker', 'ngIOS9UIWebViewPatch','mobsocial.products', 'ngMap', 'locator', 'ngOpenFB', 'ionic.service.core', 'ionic.service.push']);
// not necessary for a web based app // needed for cordova/ phonegap application
app.run(function($ionicPlatform, $rootScope, $state, Profile, $ionicHistory, $cordovaStatusbar, $ionicPopup, Listings, $cordovaSQLite, Categories, userService, ngFB, Messages, Notifications, $http) {
  
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
        console.log($scope);
      //SET UP
      //Generic Global rootScope Functions
        
      $rootScope.createListingTypesObjForListing = function (listing) {
          listing.listingTypes = [];
          if (listing.listingType1 != null) {
              listing.listingTypes.push(listing.listingType1);
          }
          if (listing.listingType2 != null) {
              listing.listingTypes.push(listing.listingType2);
          }
          if (listing.listingType3 != null) {
              listing.listingTypes.push(listing.listingType3);
          }
      }
      
      $rootScope.createListingTypesCatObjForListing = function (listing) {
          listing.listingTypesCats = [];
          if (listing.listingTypeCat1 != null) {
              listing.listingTypesCats.push(listing.listingTypeCat1);
          }
          if (listing.listingTypeCat2 != null) {
              listing.listingTypesCats.push(listing.listingTypeCat2);
          }
          if (listing.listingTypeCat3 != null) {
              listing.listingTypesCats.push(listing.listingTypeCat3);
          }
          if (listing.listingTypeCat4 != null) {
              listing.listingTypesCats.push(listing.listingTypeCat4);
          }
      }

      $rootScope.sortThroughListingsResults = function ($scope, data, index, obj) {
          $rootScope.createListingTypesObjForListing(data[index]);
          $rootScope.createListingTypesCatObjForListing(data[index]);

          if (index < data.length - 1) {
              $rootScope.sortThroughListingsResults($scope, data, index + 1, obj);
          }
          else {
              if (obj == 'features') {
                  $scope.features = data;
              } else if (obj == 'listings') {
                  $scope.listings = data;
              }
              setTimeout(function () {
                $scope.pageLoading = false;
              }, 150);
          }
      }
      

      //SET UP INITIAL ON APP LOAD VARIABLESM(AND FIND A BETTER PLACE TO PUT THESE)
      //Prepare Categories for Selection
      //Functions that will be used in Various places
      Categories.getAvailableTowns().success(function (towns) {
          for (a = 0; a < towns.length; a++) {
              towns[a].active = false;
              towns[a].selected = false;
              if (towns[a].name == $rootScope.currentSearchTown.name) {
                  towns[a].active = true;
                  towns[a].selected = true;
              }
          }
          $rootScope.townCategories = towns;
      });
      Categories.getAvailableMusicStyles().success(function (musicStyles) {
          musicStyles.unshift({name: 'All Music Styles', _id: 0});
          for (a = 0; a < musicStyles.length; a++) {
              musicStyles[a].active = false;
              musicStyles[a].selected = false;
              if (musicStyles[a].name == $rootScope.currentSearchMusic.name) {
                  musicStyles[a].active = true;
                  musicStyles[a].selected = true;
              }
          }
          $rootScope.musicCategories = musicStyles;
          $rootScope.nightFind2ndSelect = $rootScope.musicCategories;
      });
      Profile.getAllUserEngagementTypes().success(function (successData) {
          $rootScope.userEngagementTypes = successData;
          console.log($rootScope.userEngagementTypes);
      }).error(function () {

      });
      
      
      
      /* Prepare All details for the user */
      $rootScope.userLoggedIn = false;
      
      $rootScope.goToNotification = function () {
        if ($rootScope.currentNotificationType == 'Messages') {
            $rootScope.currentNotificationType = null;
            if ($rootScope.currentViewName != 'app.profile'
                && $rootScope.currentViewName != 'app.messageGroups'
                && $rootScope.currentViewName != 'app.messageGroup') {
                $state.go('app.profile');
            }
            window.setTimeout(function () {
                if ($rootScope.currentViewName != 'app.messageGroups') {
                    $state.go('app.messageGroups', {'relListing': null, 'groupType': $rootScope.currentUnreadMessage.type});
                }
                
                window.setTimeout(function () {
                    $state.go('app.messageGroup', {'_id': $rootScope.currentUnreadMessage._messageGroupId, 'groupType': $rootScope.currentUnreadMessage.type});
                }, 50);
            }
            , 50);
        }
      }
      
      $rootScope.alertUnreadMessages = function (i) {
        $rootScope.currentlyLoopingThroughNotifications = true;
        if ($rootScope.currentUnreadMessages[i].notificationType == 'Messages') {
            Messages.getMessageDetails($rootScope.currentUnreadMessages[i]._id).success(function (successData) {
                $rootScope.currentNotificationType = 'Messages';
                $rootScope.currentUnreadMessage = successData[0];
                console.log($rootScope.currentUnreadMessage);
                $rootScope.notificationReleaseTimer = window.setTimeout(function () {
                    console.log($rootScope.user._unreadMessageIds);
                    $rootScope.currentUnreadMessages.splice(i, 1);
                
                    if (i < $rootScope.currentUnreadMessages.length - 1) {
                        $rootScope.alertUnreadMessages(i + 1);
                    } else {
                        $rootScope.currentNotificationType = null;
                        $rootScope.user._unreadMessageIdsGroupIds = [];
                        $rootScope.startUserMessagesUpdateTimer();
                        $rootScope.currentlyLoopingThroughNotifications = false;
                    }
                }, 2000);
                
            }).error(function (errorData) {
                console.log("errorData: ", errorData);
                $rootScope.alertUnreadMessages(i);
            });
        }
        else if ($rootScope.currentUnreadMessages[i].notificationType == 'Notifications') {
        
        }
      }
      
      $rootScope.startUserMessagesUpdateTimer = function (isFirstTime) {
        var timer = (isFirstTime) ? 1000: 10000;
        $rootScope.messageUpdateTimer = window.setTimeout(function () {
            $rootScope.messageUpdateFunction = function () {
                Messages.getUnreadUserMessagesSummaryForUpdate($rootScope.user._profileId).success(function (successData) {
                    console.log(successData);
                    var loopThroughNewMessagesAndNotify = function (i) {
                            console.log('sidnfisn', successData[i]._id, $rootScope.user._unreadMessageIds);
                        if ($rootScope.user._unreadMessageIds.indexOf(parseInt(successData[i]._id)) == -1
                            && ($rootScope.currentViewName != 'app.messageGroup' || $rootScope.currentMessageGroupIdBeingViewed != successData[i]._messageGroupId)) {
                            console.log('sidknknnfisn', successData[i]._id);
                            successData[i].notificationType = 'Messages';
                            $rootScope.user._unreadMessageIds.push(parseInt(successData[i]._id));
                            if ($rootScope.user._unreadMessageIdsGroupIds.indexOf(parseInt(successData[i]._messageGroupId)) == -1) {
                                $rootScope.user._unreadMessageIdsGroupIds.push(parseInt(successData[i]._messageGroupId));
                            }
                            if ($rootScope.user._unreadMessageIdsGroupIdsToDisplay.indexOf(parseInt(successData[i]._messageGroupId)) == -1) {
                                $rootScope.currentUnreadMessages.push(successData[i]);
                                $rootScope.user._unreadMessageIdsGroupIdsToDisplay.push(parseInt(successData[i]._messageGroupId));
                            }
                        }
                        
                        if (i < successData.length - 1) {
                            loopThroughNewMessagesAndNotify(i + 1);
                        } else {
                            if ($rootScope.currentUnreadMessages.length == 0) {
                                $rootScope.startUserMessagesUpdateTimer();
                            }
                            else if (!$rootScope.currentlyLoopingThroughNotifications) {
                                $rootScope.alertUnreadMessages(0);
                            }
                            console.log($rootScope.currentUnreadMessages);
                        }
                    }
                    if (successData != null) {
                        loopThroughNewMessagesAndNotify(0);
                    } else {
                        $rootScope.startUserMessagesUpdateTimer(false);
                    }
                }).error(function (errorData) {
                    console.log("errorData: ", errorData);
                    $rootScope.messageUpdateFunction();
                });
            }
            
            $rootScope.messageUpdateFunction();
        }, timer);
      }
      
      $rootScope.sortAllUsersMessages = function () {
        Messages.getAllUserMessagesSummaryForUpdate($rootScope.user._profileId).success(function (successData) {
            $rootScope.currentUnreadMessages = [];
            $rootScope.user._unreadMessageIdsGroupIds = [];
            $rootScope.startUserMessagesUpdateTimer(true);
        }).error(function (errorData) {
            $rootScope.sortAllUsersMessages();
        });
      }
      
      $rootScope.startUserNotificationsUpdateTimer = function (isFirstTime) {
        var timer = (isFirstTime) ? 1000: 15000;
        $rootScope.notificationUpdateTimer = window.setTimeout(function () {
            $rootScope.notificationUpdateFunction = function () {
                Notifications.getUnreadUserNotificationsSummaryForUpdate($rootScope.user._profileId).success(function (successData) {
                    console.log(successData);
                    var loopThroughNewNotificationsAndNotify = function (i) {
                    
                        if ($rootScope.user._unreadNotificationIds.indexOf(parseInt(successData[i]._id)) == -1
                            && $rootScope.currentViewName != 'app.notifications') {
                            console.log('sidknknnfisn', successData[i]._id);
                            $rootScope.user._unreadNotificationIds.push(parseInt(successData[i]._id));
                            successData[i].notificationType = 'Notifications';
                            $rootScope.currentUnreadMessages.push(successData[i]);
                        }
                        
                        if (i < successData.length - 1) {
                            loopThroughNewNotificationsAndNotify(i + 1);
                        } else {
                            if ($rootScope.currentUnreadMessages.length == 0) {
                                $rootScope.startUserMessagesUpdateTimer();
                            }
                            else if (!$rootScope.currentlyLoopingThroughNotifications) {
                                $rootScope.alertUnreadMessages(0);
                            }
                            console.log($rootScope.currentUnreadMessages);
                        }
                    }
                    if (successData != null) {
                        loopThroughNewNotificationsAndNotify(0);
                    } else {
                        $rootScope.startUserMessagesUpdateTimer(false);
                    }
                }).error(function (errorData) {
                    console.log("errorData: ", errorData);
                    $rootScope.notificationUpdateFunction();
                });
            }
            
            $rootScope.notificationUpdateFunction();
        }, timer);
      }
      
      $rootScope.sortAllUsersNotifications = function () {
        Notifications.getAllUserNotificationsSummaryForUpdate($rootScope.user._profileId).success(function (successData) {
            $rootScope.currentUnreadNotifications = [];
            $rootScope.startUserNotificationsUpdateTimer(true);
        }).error(function (errorData) {
            $rootScope.sortAllUsersNotifications();
        });
      }
      
      $rootScope.makeUserActive = function () {
        /*
        alert("dj");
        alert($rootScope.user._profileId);
        alert($rootScope.user._oneSignalId);
        */
        $rootScope.user._oneSignalId = $rootScope.user._oneSignalId || 0;
        Profile.makeUserActive($rootScope.user._profileId, $rootScope.user._oneSignalId).success(function () {
                
        }).error(function () {
            $rootScope.makeUserActive();
        });
      }
      
      $rootScope.prepareUsersData = function () {
        $rootScope.makeUserActive();
        $rootScope.user._unreadMessageIds = $rootScope.user._unreadMessageIds || [];
        $rootScope.user._unreadMessageIdsGroupIdsToDisplay = $rootScope.user._unreadMessageIdsGroupIdsToDisplay || [];
        $rootScope.sortAllUsersMessages();
        
        $rootScope.user._unreadNotificationIds = $rootScope.user._unreadNotificationIds || [];
        $rootScope.sortAllUsersNotifications();
      }
      
      /* PUSH NOTIFICATION GLOBAL FUNCTIONS */
    $rootScope.sendMessageNotificationFinal = function (deviceTokens, contents, heading, dataObj) {
        //If a message is being sent from Person to Business, we take user.name
        //If message from person to person, take user.displayName
        //Business to Person - take user.displayName
        $http({
            method: 'POST',
            url: 'https://onesignal.com/api/v1/notifications',
            headers: {"Content-Type":"application/json"},
            port: 443,
            data: {
              "app_id": $rootScope.oneSignalAppId,
              "include_player_ids": deviceTokens,
              "data": dataObj,
              "headings": {"en": heading},
              "contents": {"en": contents},
              "ios_badgeType": "Increase",
              "ios_badgeCount": 1
            }
        }).then(
            function successCallback(response) {
                console.log("success: ", response);
                // this callback will be called asynchronously
                // when the response is available
            }, function errorCallback(response) {
                console.log("fail: ", response);
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            }
        );
    }
    $rootScope.prepareMessageNotificationFinal = function (recipientsArray, contents, heading, dataObj) {
        Notifications.getOneSignalDeviceTokensForProfiles(recipientsArray).success(function (deviceTokens) {
            var deviceTokensArray = [];
            console.log('de: ', deviceTokens);
            if (deviceTokens != null) {
                for (a = 0; a < deviceTokens.length; a++) {
                    deviceTokensArray.push(deviceTokens[a].oneSignalDeviceToken);
                    if (a == deviceTokens.length - 1) {
                        $rootScope.sendMessageNotificationFinal(deviceTokensArray, contents, heading, dataObj);
                    }
                }
            }
        }).error(function (errorData) {
            $rootScope.prepareMessageNotificationFinal(recipientsArray, contents, heading, dataObj);
        });
    }
      
      $rootScope.$broadcast('restorestate');
      $rootScope.user = userService.model.user;
      //$rootScope.user._unreadMessageIds = [];
      console.log('r', $rootScope.user._unreadMessageIds);
      
      userService.model.user.something = {};
      $rootScope.user.something = {};
      
      $rootScope.user.userInteractionObject = $rootScope.user.userInteractionObject || {};
      $rootScope.user.userInteractionObject = (typeof($rootScope.user.userInteractionObject) !== undefined) ? $rootScope.user.userInteractionObject: {};
      $rootScope.user.userInteractionObject.searchesConducted = $rootScope.user.userInteractionObject.searchesConducted || {};
      
      if (typeof($rootScope.user._id) !== 'undefined') {
          $rootScope.createListingTypesObjForListing($rootScope.user);
          $rootScope.userLoggedIn = true;
          $rootScope.prepareUsersData();
      }
      console.log(userService.model);
      
      //Initialise background timers to update Transactions
      
      
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
      $rootScope._userOneSignalId = 0;
      
      console.log('scope');
      $scope.pageLoad();
    }
  //$cordovaStatusBar.style = 1; //Light
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    ngFB.init({appId: '1633788096937299'});
    
    if (navigator.splashscreen) {
        setTimeout(function() {
            navigator.splashscreen.hide();
        }, 10);
    };
    
    var oneSignalReady = function () {
      // Enable to debug issues.
      // console.log("readyFunction");
      // window.plugins.OneSignal.setLogLevel({logLevel: 4, visualLevel: 4});
      // receive a call back? - output the data to console
      var notificationOpenedCallback = function(jsonData) {
        var data = jsonData.notification.payload.additionalData;
        //alert(JSON.stringify(data));
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
                    $state.go('app.profile');
                    window.setTimeout(function () {
                        alert(data.businessItemType);
                        $state.go('app.businessItems', {'itemType': data.businessItemType, 'timeScale': 'present'});
                        window.setTimeout(function () {
                            $state.go('app.businessItem', {'_id': data._businessItemId, 'itemType': data.businessItemType, 'timeScale': 'present'});
                        }, 300);
                    }, 500);
                }
            },
            goToBusinessItems: {
                navFunction: function () {
                    $state.go('app.profile');
                    window.setTimeout(function () {
                        alert(data.businessItemType);
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
        alert("oi");
        notificationActionConfig[data.actionFunction].navFunction();
      };
      
      // for android, this'll both params need to be filled in. See https://documentation.onesignal.com/docs/cordova-sdk-setup
        
      window.plugins.OneSignal
      .startInit($rootScope.oneSignalAppId,"")
      .handleNotificationOpened(notificationOpenedCallback)
      .endInit();
      
      window.plugins.OneSignal.registerForPushNotifications();
      window.plugins.OneSignal.getIds(function(ids) {
          var _userProfileId = ($rootScope.userLoggedIn) ? $rootScope.user._profileId: 0;
          
          Notifications.createOneSignalId(_userProfileId, $rootScope._userOneSignalId, ids.userId).success(function (successData) {
            $rootScope._userOneSignalId = successData[0]._oneSignalId;
            $rootScope.user._oneSignalId = successData[0]._oneSignalId;
            userService.model._oneSignalId = $rootScope._userOneSignalId;
            $rootScope.makeUserActive($rootScope.user._profileId, $rootScope._userOneSignalId);
            $rootScope.$broadcast('savestate');
          }).error(function (errorData) {
          
          });
      });
      
      //window.plugins.OneSignal.setSubscription(true);
      //verbose
      // change visual level to 6 for pop ups
      //window.plugins.OneSignal.setLogLevel({logLevel: 6, visualLevel: 6});
      
      /*
      $http(
        {
            method: 'POST',
            url: 'https://onesignal.com/api/v1/notifications',
            data: {
              "app_id": $rootScope.oneSignalAppId,
              "include_player_ids": ["e570810d-9423-491e-88f4-4e1f5f695c38"],
              "data": {"foo": "bar"},
              "contents": {"en": "Yo Eshan, wagwan?"}
        }
      });
      */
    };
    
    var oneSignalCheckCounter = 0;
    var checkForOneSignal = function(){
      if (window.plugins == null) {
        //alert("plugins not Found");
        window.setTimeout(function () {checkForOneSignal()}, 500);
      } else {
          if (window.plugins.OneSignal) {
            //alert("onesignal Ready");
            oneSignalReady();
          } else {
            //alert("stillChecking, ", window.plugins.OneSignal, window.plugins);
            oneSignalCheckCounter += 1;
            
            //also add a check to see if the platform is non IoS and non-Android
            if (oneSignalCheckCounter < 5) {
                window.setTimeout(function () {checkForOneSignal()}, 500);
            }
          }
      }
    };
    
    checkForOneSignal();
    
    $rootScope.clearAllExpiredTransactions = function () {
        Notifications.clearAllExpiredTransactions().success(function (successData) {
            console.log('All Expired Transaction Success Data: ', successData);
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
                            
                            if (b == fullNotificationsArray.length - 1) {
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
    $rootScope.backButtonFunction = function () {
        $ionicHistory.goBack();
    }
    
    $rootScope.showGlobalTownSelect = false;
    $rootScope.currentlyEditing = false;
    $rootScope.showSearchPanel = false;
    $rootScope.hideSearchClearButton = true;
    $rootScope.nightSearchOpen = true;
    $rootScope.showTheWhatsOpenFunction = true;
    $rootScope.hideSearch = false;
    $rootScope.searchOnRight = false;
    $rootScope.previousStateName = "nlfeed";
    $rootScope.searchQuery = "";
    
    $rootScope.searchPanelBusinessCatsToShow = [];
    $rootScope.searchPanelResultsToShow = [];
    
    $rootScope.toogleNightSearch = function () {
        $rootScope.nightSearchOpen = !$rootScope.nightSearchOpen;
    }
    
    $rootScope.showSearchPanelFunc = function () {
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
        
        });
        
        $rootScope.topRightButtonFunction = function () {
            $rootScope.hideSearchPanel();
        }
        
        $rootScope.showSearchPanel = true;
        $rootScope.hideSearchClearButton = false;
    };
    $rootScope.conductSearch = function (searchQuery) {
        $rootScope.searchPanelResultsToShow = [];
        $rootScope.searchQuery = searchQuery;
        
        Profile.getListingsByName($rootScope.currentSearchTown._id, searchQuery).success(function (successData) {
            if (successData != 'null') {
                console.log(successData);
                for (a = 0; a < successData.length; a++) {
                  $rootScope.createListingTypesObjForListing(successData[a]);
                }
                $rootScope.searchPanelResultsToShow = successData;
            }
        }).error(function () {
            $rootScope.conductSearch(searchQuery);
        });
    };
    $rootScope.hideSearchPanel = function () {
        $rootScope.showSearchPanel = false;
        $rootScope.hideSearchClearButton = true;
        $rootScope.topRightButtonFunction = function () {
            $rootScope.showHeaderButtonsFunction();
        }
    };
    $rootScope.hideHeaderButtonsFunction = function () {
        $rootScope.hideSearch = false;
        $rootScope.showHeaderButtons = false;
        $rootScope.topRightButtonIsClock = true;
        $rootScope.topRightButtonFunction = function () {
            $rootScope.showHeaderButtonsFunction();
        }
        $rootScope.showSearchPanel = false;
    };

    $rootScope.showHeaderButtonsFunction = function () {
        $rootScope.appLoading = true;
        
        Profile.getAllOpenBusinessAccountsByTown($rootScope.currentSearchTown._id, $rootScope.currentSearchBusinessType._id).success(function (successData) {
            console.log(successData);
            if (successData != 'null') {
                $rootScope.searchPanelResultsToShow = successData;
            }
            else {
                $rootScope.searchPanelResultsToShow = [];
            }
            
            $rootScope.showSearchPanel = true;
            $rootScope.hideSearch = true;
            $rootScope.showHeaderButtons = true;
            $rootScope.topRightButtonIsClock = false;
            $rootScope.topRightButtonFunction = function () {
                $rootScope.hideHeaderButtonsFunction();
            }
            $rootScope.appLoading = false;
        }).error(function (errorData) {
            
        });
    };
    
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

    $rootScope.getShortenedDateString = function (dateTimeString) {
        return dateTimeString.substr(0, dateTimeString.indexOf(' '));
    }
    $rootScope.getShortenedTimeString = function (dateTimeString) {
        var spaceIndex = dateTimeString.indexOf(' ') + 1;
        var colonIndex = dateTimeString.indexOf(':');
        var hourRequested = parseInt(dateTimeString.substr(spaceIndex, 2));
        var minRequested = dateTimeString.substr(colonIndex, 3);
        var amPmRequested = (hourRequested > 12) ? ' PM': ' AM';
        hourRequested = (hourRequested > 12) ? hourRequested - 12: hourRequested;
        return hourRequested + minRequested + amPmRequested;
    }
    $rootScope.getTimeInTotalSeconds = function (dateTimeString) {
        var spaceIndex = dateTimeString.indexOf(' ') + 1;
        var colonIndex = dateTimeString.indexOf(':') + 1;
        var hourRequested = parseInt(dateTimeString.substr(spaceIndex, 2));
        var minRequested = dateTimeString.substr(colonIndex, 2);
        console.log(dateTimeString);
        console.log(minRequested);
        console.log( parseInt(minRequested));
        console.log( (hourRequested*3600) + (parseInt(minRequested)*60) );
        return ((hourRequested*3600) + (minRequested*60));
    }

    $rootScope.days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    $rootScope.months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    $rootScope.convertToDate = function ($scope, date) {
      $scope.chosenWeekday = {index: date.getDay(), name: $rootScope.days[date.getDay()]};
      return $rootScope.days[date.getDay()] + ', ' + date.getDate() + ' ' + $rootScope.months[date.getMonth()] + ' ' + date.getFullYear();
    }
    $rootScope.convertToReadableDate = function ($scope, dateProp) {
        var string = $rootScope.getShortenedDateString(dateProp);
        string = $rootScope.convertToDate($scope, new Date(string));
        return string;
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
    
    $rootScope.selectExtraOption = function (chosenOptionItem, $event, $scope) {
        console.log(chosenOptionItem);
        var mustBeSelectedOptions = [
            'offerType'
            ,'offerStartPeriod'
            ,'eventRegularityType'
        ];
        
        chosenOptionItem.mustBeSelected = (mustBeSelectedOptions.indexOf(chosenOptionItem.itemType) != -1) ? true: false;
        
        switch(chosenOptionItem.itemType) {
            case 'offerType':
                $scope.selectedOfferType = chosenOptionItem;
                break;
            case 'offerStartPeriod':
                $scope.selectedOfferStartPeriod = chosenOptionItem;
                break;
            case 'eventRegularityType':
                $scope.selectedEventRegularityType = chosenOptionItem;
                break;
        }

        $event.preventDefault();
    }
    
  });
});

/*
//app run getting device id
app.run(function ($rootScope, myPushNotification) {
	// app device ready
	document.addEventListener("deviceready", function(){
		if(!localStorage.device_token_syt || localStorage.device_token_syt == '-1'){ 
			myPushNotification.registerPush();
		}
	});
   $rootScope.get_device_token = function () {
      if(localStorage.device_token_syt) {
         return localStorage.device_token_syt;
      } else {
         return '-1';
      }
   }
   $rootScope.set_device_token = function (token) {
      localStorage.device_token_syt = token;
      return localStorage.device_token_syt;
   }
});
*/

//myservice device registration id to localstorage
app.service('myService', ['$http', function($http) {
   this.registerID = function(regID, platform) {
   		//alert(regID);
		localStorage.device_token_syt = regID;
   }
}]);

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
	// sharing plugin
	$scope.shareMain = function(){
		var title = "Download Smove For Android";
		var url = "https://play.google.com/store/apps/details?id=com.myspecialgames.swipe";
		window.plugins.socialsharing.share(title, null, null, url)
	}
	$scope.shareArticle = function(title,url){
		window.plugins.socialsharing.share(title, null, null, url)
	}
	$scope.openLinkArticle = function(url){
		window.open(url, '_system');
	}
}])

    /* Videos Controller */
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
                /*
                    Offers.getOffersByBusinessId($rootScope.user._id).success(function (successData) {
                        console.log(successData);
                        if (successData != 'null') {
                            $scope.businessItems = successData;
                        }
                    }).error(function () {
                    
                    });
                    */
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
                    /*
                    Events.getEventsByBusiness($rootScope.user._id).success(function (successData) {
                        console.log(successData);
                        console.log($rootScope.user);
                        if (successData != 'null') {
                            $scope.businessItems = successData;
                        }
                    }).error(function () {
                    
                    });
                    */
                }
                break;
        };
        
        $scope.getVideos();
        
        /*
        BusinessItems.getBusinessItems($stateParams.itemType, $stateParams.timeScale).success(function (businessItems) {
            if (businessItems != 'null') {
                $scope.businessitems = businessItems;
            }
        }.error(function () {
        
        }));
        */
    }]);

// login page of app //
app.controller('LoginCtrl', ['$state','$scope', function($state, $scope) {
	// add your login logic here
    var Content1 = {title:"Hello"};
    var Content2 = {title:"Goodbye"};
    $scope.mainContent = Content1;
    $scope.showTitle = false;
    $scope.pageItems = [Content1, Content2];
    
	$scope.doLogin = function(){
        if ($scope.mainContent == Content1) {
            $scope.mainContent = Content2;
        }
        else {
            $scope.mainContent = Content1;
            $scope.pageItems.push({title:"Something"});
        }
        $scope.showTitle = !$scope.showTitle;
	}
}])

// Sign up page of app //
app.controller('SignUpCtrl', ['$state','$scope', function($state, $scope) {	
	// sign up logic here
	$scope.doRegister = function(){
		$state.go('app.features');
	}
}])

// new items v2.0
// messages list
app.controller('MessagesCtrl', ['$scope', 'Messages', function($scope, Messages){
	$scope.items = [];
	$scope.postsCompleted = false;
	// load more content function
	$scope.getPosts = function(){
		Messages.getMesages()
		.success(function (posts) {
			$scope.items = $scope.items.concat(posts);
			$scope.$broadcast('scroll.infiniteScrollComplete');
			$scope.postsCompleted = true;
		})
		.error(function (error) {
			$scope.items = [];
		});
	}
	// pull to refresh buttons
	$scope.doRefresh = function(){
		$scope.items = [];
		$scope.postsCompleted = false;
		$scope.getPosts();
		$scope.$broadcast('scroll.refreshComplete');
	}
}]);
// single message
app.controller('MessageCtrl', ['$scope', 'Messages', '$ionicScrollDelegate', function($scope, Messages, $ionicScrollDelegate ){
	$scope.messages = [];
	$scope.postsCompleted = false;
	// load more content function
	$scope.getPosts = function(){
		Messages.getMessage()
		.success(function (posts) {
			$scope.messages = $scope.messages.concat(posts);
			//console.log($scope.messages);
			$scope.$broadcast('scroll.infiniteScrollComplete');
			$ionicScrollDelegate.scrollBottom();
			$scope.postsCompleted = true;
		})
		.error(function (error) {
			$scope.items = [];
		});
	}
	// pull to refresh buttons
	$scope.doRefresh = function(){
		$scope.messages = [];
		$scope.postsCompleted = false;
		$scope.getPosts();
		$scope.$broadcast('scroll.refreshComplete');
	}
	$scope.addMesage = function(){
		var newMessage = new function() {
			this.message = $scope.datamessage;
			this.from = '2';
			this._id	= '12';
			this.title	= 'sample';
			this.image	= 'http://3.bp.blogspot.com/-bTWNRjookMQ/VYGjnv5nKtI/AAAAAAAAA08/wXshQ9sNDeU/s100-c/blank-792125_1280.jpg';
		}
		$scope.messages = $scope.messages.concat(newMessage);
		$scope.datamessage = "";
		$ionicScrollDelegate.scrollBottom();
    }
}]);

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
   else {
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
   }
  };
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
});
