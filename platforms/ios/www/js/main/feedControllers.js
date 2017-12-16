// NL Feed //
app.controller('NLFeedCtrl', ['$rootScope', '$ionicHistory', '$ionicViewSwitcher', '$ionicScrollDelegate', '$cordovaSocialSharing', '$state','$scope', 'Categories', 'Places', 'Events', 'NgMap', 'Profile', 'location', 'Offers', 'fileReader', 'userService', '$cordovaSQLite', function($rootScope, $ionicHistory, $ionicViewSwitcher, $ionicScrollDelegate, $cordovaSocialSharing, $state, $scope, Categories, Places, Events, NgMap, Profile, location, Offers, fileReader, userService, $cordovaSQLite) {
    //location.get(angular.noop, angular.noop);
    $scope.pageLoading = true;
    $scope.pageLoadInit = function () {
        if ($rootScope.appInitialised != true) {
            if (typeof($rootScope.initialiseAppFunction) === 'undefined') {
                window.setTimeout(function () {$scope.pageLoadInit();}, 30); return false;}
            else {
                $rootScope.initialiseAppFunction($scope);
            }
        }
    }
    
    $scope.pageLoad = function () {
        $scope.rootScope = $rootScope;
        
        $scope.$on('$ionicView.enter', function() {
            $rootScope.topRightButtonFunction = function () {
                if ($rootScope.hideSearch) {
                    $rootScope.hideHeaderButtonsFunction();
                } else {
                    $rootScope.showHeaderButtonsFunction();
                }
            };
        });
        
        console.log('dj');
        //Root Functions that Apply heavily to this page
        $rootScope.changeFeedHeader = function (newItem) {
            $rootScope.showNightLifeSearch = (newItem == 'closed') ? $rootScope.showNightLifeSearch: false;
            $scope.feedType = (newItem == 'closed') ? 'Main': newItem;
            $rootScope.appLoading = true;
            $scope.reloadingCentralContent = true;

            
            $scope.features = [];
            window.setTimeout(function () {
                $scope.getListingsFunction(newItem);
            }, 30);
            

            /*
            window.setTimeout(function () {
                    $rootScope.feedHeaderItem = newItem;
                    $rootScope.appLoading = false;
                    $scope.reloadingCentralContent = false;
                }, 200);
                */
        }

        $rootScope.toggleNightLifeSearch = function () {
            $rootScope.showNightLifeSearch = !$rootScope.showNightLifeSearch;
            $rootScope.showMusicSelect = false;
            $rootScope.showTownSelect = false;
        }
        
        $rootScope.showTownSelectFunc = function () {
            $rootScope.showTownSelect = !$rootScope.showTownSelect;
            $rootScope.showMusicSelect = false;
        };
        
        $rootScope.showMusicSelectFunc = function () {
            $rootScope.showMusicSelect = !$rootScope.showMusicSelect;
            $rootScope.showTownSelect = false;
        };
        
        $rootScope.showNightFind2ndSelectFunc = function () {
            $rootScope.showNightFind2ndSelect = !$rootScope.showNightFind2ndSelect;
        }
        
        $rootScope.selectTown = function (town) {
            $rootScope.currentSearchTown = town;
            $rootScope.showTownSelect = !$rootScope.showTownSelect;
            for (a = 0; a < $rootScope.townCategories.length; a++) {
                $rootScope.townCategories[a].selected = ($rootScope.townCategories[a]._id == town._id) ? true: false;
            }
        };
        
        $rootScope.select2ndSelectCat = function (cat) {
            var currentName = $rootScope.currentSelectedListingTypeToFind;
            $ionicScrollDelegate.scrollTop();
            
            if (currentName == 'restaurant') {
                $rootScope.currentSearchRestaurantFoodCat = cat;
                for (a = 0; a < $rootScope.restaurantFoodCategories.length; a++) {
                    $rootScope.restaurantFoodCategories[a].active = ($rootScope.restaurantFoodCategories[a]._id == cat._id) ? true: false;
                    $rootScope.restaurantFoodCategories[a].selected = ($rootScope.restaurantFoodCategories[a]._id == cat._id) ? true: false;
                }
            }
            else if (currentName == 'takeaway') {
                $rootScope.currentSearchTakeawayFoodCat = cat;
                for (a = 0; a < $rootScope.takeawayFoodCategories.length; a++) {
                    $rootScope.takeawayFoodCategories[a].active = ($rootScope.takeawayFoodCategories[a]._id == cat._id) ? true: false;
                    $rootScope.takeawayFoodCategories[a].selected = ($rootScope.takeawayFoodCategories[a]._id == cat._id) ? true: false;
                }
            }
            else if (currentName == 'cinema') {
                $rootScope.currentSearchMovieCat = cat;
                for (a = 0; a < $rootScope.movieCategories.length; a++) {
                    $rootScope.movieCategories[a].active = ($rootScope.movieCategories[a]._id == cat._id) ? true: false;
                    $rootScope.movieCategories[a].selected = ($rootScope.movieCategories[a]._id == cat._id) ? true: false;
                }
            }
            else if (currentName == 'clubnight') {
                $rootScope.currentSearchMusic = cat;
                for (a = 0; a < $rootScope.musicCategories.length; a++) {
                    $rootScope.musicCategories[a].active = ($rootScope.musicCategories[a]._id == cat._id) ? true: false;
                    $rootScope.musicCategories[a].selected = ($rootScope.musicCategories[a]._id == cat._id) ? true: false;
                }
            }
            else if (currentName == 'cluborbar') {
                $rootScope.currentSearchClubOrBarCat = cat;
                for (a = 0; a < $rootScope.clubOrBarCategories.length; a++) {
                    $rootScope.clubOrBarCategories[a].active = ($rootScope.clubOrBarCategories[a]._id == cat._id) ? true: false;
                    $rootScope.clubOrBarCategories[a].selected = ($rootScope.clubOrBarCategories[a]._id == cat._id) ? true: false;
                }
            }
            
            for (a = 0; a < $scope.nightFind2ndSelect.length; a++) {
                $rootScope.nightFind2ndSelect[a].active = ($rootScope.nightFind2ndSelect[a]._id == cat._id) ? true: false;
                $rootScope.nightFind2ndSelect[a].selected = ($rootScope.nightFind2ndSelect[a]._id == cat._id) ? true: false;
            }
            
            $rootScope.showNightFind2ndSelect = false;
        }
        
        $rootScope.selectMusic = function (music) {
            $rootScope.currentSearchMusic = music;
            $rootScope.showMusicSelect = !$rootScope.showMusicSelect;
            for (a = 0; a < $scope.musicCategories.length; a++) {
                $rootScope.musicCategories[a].selected = ($rootScope.musicCategories[a]._id == music._id) ? true: false;
            }
        };
        $rootScope.activateMusic = function (music) {
            $rootScope.currentSearchMusic = music;
            $rootScope.showMusicSelect = !$rootScope.showMusicSelect;
            for (a = 0; a < $scope.musicCategories.length; a++) {
                $rootScope.musicCategories[a].active = ($rootScope.musicCategories[a]._id == music._id) ? true: false;
                $rootScope.musicCategories[a].selected = ($rootScope.musicCategories[a]._id == music._id) ? true: false;
            }
        };

        $rootScope.toggleUserEngagement = function (userEngagementType, listing, $event) {
            if ($rootScope.userLoggedIn) {
                for (a=0; a < $rootScope.userEngagementTypes.length; a++) {
                    if ($rootScope.userEngagementTypes[a].name == userEngagementType) {
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
                                console.log('lop');
                            }
                            else if (userEngagementType == 'Follow') {
                                listing.follow = (listing.follow == '1') ? null : false;
                                console.log('lol');
                            }

                            console.log(listing);
                        }

                        function createEngagementFinal (listing) {
                            Profile.createUserEngagement($rootScope.userEngagementTypes[a]._id, $rootScope.user._profileId, relId, listing.listingType, [], []).success(function () {
                                alterIconColor(listing);
                            }).error(function () {

                            });
                        }
                        function removeEngagementFinal (listing) {
                            Profile.deleteUserEngagement($rootScope.userEngagementTypes[a]._id, $rootScope.user._profileId, relId, listing.listingType).success(function (successData) {
                                alterIconColor(listing);
                            }).error(function () {

                            });
                        }

                        if (userEngagementType == 'Like' && listing.like == null) {
                            createEngagementFinal(listing);
                            console.log("whsso");
                        }
                        else if (userEngagementType == 'Like') {
                            console.log("who");
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

        $rootScope.fillRecipientSearchResults = function (results, $scope, chosenRecipientsArray, possRecipientsArray) {
            console.log(results);
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
        

        // Set Up Variables Actual Scope variables
        
        
        $scope.isModalVisible = false;
        $scope.reloadingCentralContent = false;
        $scope.ionicScrollDelegate = $ionicScrollDelegate;
        $scope.feedType = 'Main';
        
        $scope.nightFindSlideLocked = false;
        
        $scope.getListingsFunction = function (newItem, stateToChange) {
            Profile.getListingsForFeed($rootScope.currentSearchTown._id, $rootScope.user._profileId, $scope.feedType).success(function (successData) { 
                if (newItem == 'movies') {
                    for (a = 0; a < successData.length; a++) {
                        successData[a].cinemas = [
                            {'name': "Aspects Cinema",
                            'showingTimes': [{'time': "6:30", 'active':false}, {'time': "7:30", 'active':false}, {'time': "8:30", 'active':false}]},
                            {'name': "Another Cinema",
                            'showingTimes': [{'time': "5:30", 'active':false}, {'time': "8:25", 'active':false}]}
                        ];
                    }
                }
                if (successData != null) {
                    $rootScope.sortThroughListingsResults($scope, successData, 0, 'features');
                } else {
                    $scope.features = [];
                }

                $rootScope.feedHeaderItem = newItem;
                $rootScope.appLoading = false;
                $scope.reloadingCentralContent = false;

                console.log(stateToChange);
                if (stateToChange == 'globalTownSelect') {
                    $rootScope.showGlobalTownSelect = false;
                }
            }).error(function () {
                $scope.getListingsFunction(newItem, stateToChange);
            });
        }

        $scope.arrangeGlobalTownSelectFunction  = function (state) {
            if (state == 'feedSearch') {
                $rootScope.activateTown = function (town) {

                };
            }
            else if (state == 'feedHeader') {
                $rootScope.activateTown = function (town) {
                    $rootScope.appLoading = true;
                    $rootScope.currentSearchTown = town;
                    for (a = 0; a < $rootScope.townCategories.length; a++) {
                        $rootScope.townCategories[a].active = ($rootScope.townCategories[a]._id == town._id) ? true: false;
                        $rootScope.townCategories[a].selected = ($rootScope.townCategories[a]._id == town._id) ? true: false;
                    }
                    var newItem = ($scope.feedType == 'Main') ? 'closed': $scope.feedType;
                    $scope.getListingsFunction(newItem, 'globalTownSelect');
                };
            }
            $rootScope.showGlobalTownSelect = true;
        };
        
        $scope.findNight = function () {
                $state.go('app.nlfeedListings', {'_townId': $rootScope.currentSearchTown._id, '_musicStyleId': $rootScope.currentSearchMusic._id});
            };
        //
        
        $rootScope.pinListingToMessage = function ($event, listing, listingType, listingSpecItemId, $scope) {
                console.log('listing1: ' + listing);
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
                listing.relListingTypeAlias = listingType.substr(listingType.indexOf('Businesses')+ 10, listingType.length);
                listing.relListingTypeAlias = (listing.relListingTypeAlias == "") ? listingType: listing.relListingTypeAlias;
                listing.relListingSpecItemId = listingSpecItemId;
                $rootScope.relListing = listing;
                $rootScope.currentMessageInputPlaceholder = "Add a caption (optional) ...";
                console.log('listing: ' + listing);
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

        $scope.shareAnywhere = function() {
            $cordovaSocialSharing.share("This is your message", "This is your subject", "www/imagefile.png", "https://www.thepolyglotdeveloper.com");
        }
     
        $scope.shareViaTwitter = function(message, image, link) {
            $cordovaSocialSharing.canShareVia("twitter", message, image, link).then(function(result) {
                $cordovaSocialSharing.shareViaTwitter(message, image, link);
            }, function(error) {
                alert("Cannot share on Twitter");
            });
        }
        
        /*
        NgMap.getMap().then(function(map) {
        console.log(map.getCenter());
        console.log('markers', map.markers);
        console.log('shapes', map.shapes);
      });
      */
        
        //Prepare Features
        $scope.getOriginalListings = function () {
            Profile.getListingsForFeed($rootScope.currentSearchTown._id, $rootScope.user._profileId, $scope.feedType).success(function (successData) {
                console.log('getListingsforFeed in NlFeed results: ', successData);
                for (a = 0; a < successData.length; a++) {
                    if (successData[a].listingType == 'Movie') {
                        successData[a].cinemas = [
                            {'name': "Aspects Cinema",
                            'showingTimes': [{'time': "6:30", 'active':false}, {'time': "7:30", 'active':false}, {'time': "8:30", 'active':false}]},
                            {'name': "Another Cinema",
                            'showingTimes': [{'time': "5:30", 'active':false}, {'time': "8:25", 'active':false}]}
                        ];
                    }
                }

                $rootScope.sortThroughListingsResults($scope, successData, 0, 'features');
                console.log($scope.features);

            }).error(function () {
                $scope.getOriginalListings();
            });
        }
        
        //User Based Functions
        $rootScope.updateCurrentListingTypeToFind = function (name, $event, eventType, $rootScope) {
            console.log("ksdn", $($event.target));
            //$scope.pageLoading = true;
            if ($($event.target).hasClass('index-1') && eventType == 'click') {return false};
            console.log(name);
            $rootScope.currentSelectedListingTypeToFind = name;
            
            var incrementVal = 0;
            
            for (a = 0; a < $rootScope.nightFinderListingTypes.length; a++) {
                $rootScope.nightFinderListingTypes[a].displayIndex += incrementVal;
                $rootScope.nightFinderListingTypes[a].displayIndex = ($rootScope.nightFinderListingTypes[a].displayIndex == 4) ? -1: $rootScope.nightFinderListingTypes[a].displayIndex;
                $rootScope.nightFinderListingTypes[a].displayIndex = ($rootScope.nightFinderListingTypes[a].displayIndex == -2) ? 3: $rootScope.nightFinderListingTypes[a].displayIndex;
            }
            
            if (name == 'restaurant') {
                if ($rootScope.restaurantFoodCategories) {
                    $rootScope.nightFind2ndSelect = $rootScope.restaurantFoodCategories;
                    $scope.pageLoading = false;
                } else {
                    var getAvailableFoodStyles = function () {
                        Categories.getAvailableFoodStyles($rootScope.currentSearchTown._id, 'Restaurant').success(function (foodStyles) {
                            console.log(foodStyles);
                            foodStyles = (foodStyles == 'null') ? []: foodStyles;
                            foodStyles.unshift($rootScope.currentSearchRestaurantFoodCat);
                            for (a = 0; a < foodStyles.length; a++) {
                                foodStyles[a].active = (foodStyles[a].name == $rootScope.currentSearchRestaurantFoodCat.name) ? true: false;
                                foodStyles[a].selected = (foodStyles[a].name == $rootScope.currentSearchRestaurantFoodCat.name) ? true : false;
                            }
                            $rootScope.restaurantFoodCategories = foodStyles;
                            $rootScope.nightFind2ndSelect = $rootScope.restaurantFoodCategories;
                            $scope.pageLoading = false;
                        }).error(function () {
                            getAvailableFoodStyles();
                        });
                    }
                    getAvailableFoodStyles();
                }
            }
            else if (name == 'takeaway') {
                if ($rootScope.takeawayFoodCategories) {
                    $rootScope.nightFind2ndSelect = $rootScope.takeawayFoodCategories;
                    $scope.pageLoading = false;
                } else {
                    var getAvailableFoodStyles = function () {
                        Categories.getAvailableFoodStyles($rootScope.currentSearchTown._id, 'Takeaway').success(function (foodStyles) {
                            foodStyles = (foodStyles == 'null') ? []: foodStyles;
                            foodStyles.unshift($rootScope.currentSearchTakeawayFoodCat);
                            for (a = 0; a < foodStyles.length; a++) {
                                foodStyles[a].active = (foodStyles[a].name == $rootScope.currentSearchTakeawayFoodCat.name) ? true: false;
                                foodStyles[a].selected = (foodStyles[a].name == $rootScope.currentSearchTakeawayFoodCat.name) ? true : false;
                            }
                            $rootScope.takeawayFoodCategories = foodStyles;
                            $rootScope.nightFind2ndSelect = $rootScope.takeawayFoodCategories;
                            $scope.pageLoading = false;
                        }).error(function () {
                            getAvailableFoodStyles();
                        });
                    }
                    getAvailableFoodStyles();
                }
            }
            else if (name == 'cinema') {
                if ($rootScope.movieCategories) {
                    $rootScope.nightFind2ndSelect = $rootScope.movieCategories;
                    $scope.pageLoading = false;
                } else {
                    var getAvailableMovieStyles = function () {
                        Categories.getAvailableMovieStyles().success(function (movieStyles) {
                            movieStyles = (movieStyles == 'null') ? []: movieStyles;
                            movieStyles.unshift($rootScope.currentSearchMovieCat);
                            for (a = 0; a < movieStyles.length; a++) {
                                movieStyles[a].active = (movieStyles[a].name == $rootScope.currentSearchMovieCat.name) ? true: false;
                                movieStyles[a].selected = (movieStyles[a].name == $rootScope.currentSearchMovieCat.name) ? true : false;
                            }
                            $rootScope.movieCategories = movieStyles;
                            $rootScope.nightFind2ndSelect = $rootScope.movieCategories;
                            $scope.pageLoading = false;
                        }).error(function () {
                            getAvailableMovieStyles();
                        });
                    }
                    getAvailableMovieStyles();
                }
            }
            else if (name == 'cluborbar') {
                if ($rootScope.clubOrBarCategories) {
                    $rootScope.nightFind2ndSelect = $rootScope.clubOrBarCategories;
                    $scope.pageLoading = false;
                } else {
                    clubOrBarCategories = [
                        {name: 'Clubs', _id: 2},
                        {name: 'Bars', _id: 3}
                    ];
                    clubOrBarCategories.unshift($rootScope.currentSearchClubOrBarCat);
                    for (a = 0; a < clubOrBarCategories.length; a++) {
                        clubOrBarCategories[a].active = (clubOrBarCategories[a].name == $rootScope.currentSearchClubOrBarCat.name) ? true: false;
                        clubOrBarCategories[a].selected = (clubOrBarCategories[a].name == $rootScope.currentSearchClubOrBarCat.name) ? true : false;
                    }
                    $rootScope.clubOrBarCategories = clubOrBarCategories;
                    $rootScope.nightFind2ndSelect = $rootScope.clubOrBarCategories;
                    $scope.pageLoading = false;
                }
            }
            else if (name == 'clubnight') {
                $rootScope.nightFind2ndSelect = $rootScope.musicCategories;
                console.log('df');
                $scope.pageLoading = false;
            }
        }

        
        $scope.findNight = function () {
            var searchTypes = {
                clubnight: {searchName: 'searchEventsByMusic'},
                cinema: {searchName: 'searchMoviesByMovieStyle'},
                restaurant: {searchName: 'searchRestaurantsByFoodStyle'},
                takeaway: {searchName: 'searchTakeawaysByFoodStyle'},
                cluborbar: {searchName: 'searchClubsOrBars'}
            }
            var searchTypeName = searchTypes[$rootScope.currentSelectedListingTypeToFind]['searchName'];
            
            if ($rootScope.currentSelectedListingTypeToFind == 'cluborbar') {
                if ($rootScope.currentSearchClubOrBarCat.name == 'Bars') {
                    searchTypeName = 'searchBars';
                }
                else if ($rootScope.currentSearchClubOrBarCat.name == 'Clubs') {
                    searchTypeName = 'searchClubs';
                }
                else if ($rootScope.currentSearchClubOrBarCat.name == 'Bars & Clubs') {
                    searchTypeName = 'searchBarsAndClubs';
                }
            }
        
            $rootScope.user.userInteractionObject.searchesConducted.clubNightSearches = $rootScope.user.userInteractionObject.searchesConducted.clubNightSearches || [];
            $rootScope.user.userInteractionObject.searchesConducted.clubNightSearches.push({'_townId': $rootScope.currentSearchTown._id, '_musicStyleId': $rootScope.currentSearchMusic._id});
            $state.go('app.nlfeedListings', {'searchType': searchTypeName});
        };
        
        $scope.postUpdateToFeed = function () {
            $rootScope.updateButtonDisabled = true;
            $rootScope.selectedUpdateBusiness = "";
            $rootScope.selectedUpdateFollower = "";
            $rootScope.chosenUpdateBusinesses = $rootScope.chosenUpdateBusinesses || [];
            $rootScope.possibleUpdateBusinesses = $rootScope.possibleUpdateBusinesses || [];
            $rootScope.chosenUpdateFollowers = $rootScope.chosenUpdateFollowers || [];
            $rootScope.possibleUpdateFollowers = $rootScope.possibleUpdateFollowers || [];
            $ionicScrollDelegate.getScrollView().options.scrollingY = !$ionicScrollDelegate.getScrollView().options.scrollingY;
            $rootScope.showUpdatePost = !$rootScope.showUpdatePost;
            $rootScope.showFeedUpdateScreenCover = !$rootScope.showFeedUpdateScreenCover;
        }

        $rootScope.goToLogin = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $rootScope.showUpdatePost = false;
            $rootScope.showFeedUpdateScreenCover = false;
            $ionicScrollDelegate.getScrollView().options.scrollingY = true;
            $state.go('app.profile');
        }

        $scope.prepareUpdateType = function (updateType) {
            var updateTypeNotes = {
                Night: {coverNote: 'Upload Photos of a night', buttonMsg: 'Post My Photos', i: 'ion-images'},
                Meal: {coverNote: 'Upload Photos of a meal', buttonMsg: 'Post My Photos', i: 'ion-images'},
                Approval: {coverNote: 'Give a business your approval', buttonMsg: 'Give your Seal of Approval', i:'ion-ribbon-b'},
                CheckIn: {coverNote: 'Checkin somewhere in town', buttonMsg: 'Check In', i:'ion-location'}
            }

            $rootScope.frontScreenCoverNote = updateTypeNotes[updateType].coverNote;
            $rootScope.showFrontScreenType = 'Update';
            $rootScope.updateMessage = updateTypeNotes[updateType].buttonMsg;
            $rootScope.updateIcon = updateTypeNotes[updateType].i;
            $rootScope.updateType = updateType;
            $rootScope.showFrontScreenCover = true;
            for (a = 0; a < $rootScope.userEngagementTypes.length; a++) {
                if ($rootScope.userEngagementTypes[a].name == $rootScope.updateType) {
                    $rootScope.updateTypeId = $rootScope.userEngagementTypes[a]._id;
                }
            }
        }

        $rootScope.closeUpdatePanel = function () {
            $rootScope.chosenUpdateBusinesses = [];
            $rootScope.possibleUpdateBusinesses = [];
            $rootScope.chosenUpdateFollowers = [];
            $rootScope.possibleUpdateFollowers = [];
            $rootScope.selectedUpdateFollower = "";
            $rootScope.selectedUpdateBusiness = "";
            $rootScope.updateButtonDisabled = true;
            $rootScope.showFrontScreenCover = false;
        }

        $rootScope.getAllBusinessesByName = function (searchString) {
            if (searchString == '') {
                $rootScope.possibleUpdateBusinesses = [];
                return false;
            }
            var businessType1 = '_', businessType2 = '_';
            if ($rootScope.updateType == 'Night') {
                businessType1 = 'Nightclub';
                businessType2 = 'Bar';
            } else if ($rootScope.updateType == 'Meal') {
                businessType1 = 'Restaurant';
                businessType2 = 'Takeaway';
            } 
            Profile.getAllBusinessesByName(searchString, businessType1, businessType2).success(function (successData) {
                $rootScope.possibleUpdateBusinesses = (searchString.length > 0) ? $rootScope.possibleUpdateBusinesses: [];
                $rootScope.possibleUpdateBusinesses = $rootScope.fillRecipientSearchResults(successData, $scope, $rootScope.chosenUpdateBusinesses);
            }).error(function () {
                $rootScope.getAllBusinessesByName(searchString);
            });
        }

        $rootScope.getAllFollowersByName = function (searchString) {
            if (searchString == '') {
                $rootScope.possibleUpdateFollowers = [];
                return false;
            }
            Profile.getAllFollowersByName(searchString, $rootScope.user._profileId).success(function (successData) {
                $rootScope.possibleUpdateFollowers = $rootScope.fillRecipientSearchResults(successData, $scope, $scope.chosenUpdateFollowers);
            }).error(function () {
                $rootScope.getAllFollowersByName(searchString);
            });
        }

        $rootScope.addPossibleUpdateBusiness = function (business) {
            $rootScope.selectedUpdateBusiness = "";
            $rootScope.chosenUpdateBusinesses.push(business);
            $rootScope.possibleUpdateBusinesses = [];

            if ($scope.updateType == 'CheckIn' || $scope.updateType == 'Approval') {
                $rootScope.updateButtonDisabled = false;
            }
            else if ( $rootScope.files.length > 0 && 
                ($scope.updateType == 'Meal' || $scope.updateType == 'Night') ) {
                $rootScope.updateButtonDisabled = false;
            }
        }

        $rootScope.addPossibleUpdateFollower = function (follower) {
            $rootScope.selectedUpdateFollower = "";
            $rootScope.chosenUpdateFollowers.push(follower);
            $rootScope.possibleUpdateFollowers = [];
        }

        $rootScope.getFile = function () {
            $rootScope.progress = 0;
            for (a = 0; a < $rootScope.files.length; a++) {
                fileReader.readAsDataUrl($rootScope.files[a], $rootScope)
                          .then(function(result) {
                                $rootScope.imageSrcs = $rootScope.imageSrcs || [];
                              $rootScope.imageSrcs.push({'imageSrc': result});
                          });
            }
            if ($rootScope.files.length > 0) {
                $rootScope.updateButtonDisabled = false;
            }
        };

        $rootScope.imgUploadPrepare = function () {
            document.getElementById('img-upload').click();
        }
     
        $rootScope.$on("fileProgress", function(e, progress) {
            $rootScope.progress = progress.loaded / progress.total;
        });

        $rootScope.onFileSelect = function($files) {
            $rootScope.updateImages = $files;
            //$files: an array of files selected, each file has name, size, and type.
            for (var i = 0; i < $files.length; i++) {
              var $file = $files[i];
              console.log($file);
              
              $rootScope.uploadFileFinal = function ($file) {
                  Profile.uploadFile($file).success(function(successData) {
                    // file is uploaded successfully
                    console.log(successData);
                  }).error(function (errorData) {
                        $rootScope.uploadFileFinal($file);
                  });
              }
              $rootScope.uploadFileFinal($file);
            }
        }

        $rootScope.finishPostingUpdate = function (business) {
            console.log($rootScope.files);
            //return false;
            if (!$rootScope.updateButtonDisabled) {
                console.log("ko");
                $rootScope.appLoading = true;
                Profile.createUserEngagement($rootScope.updateTypeId, $rootScope.user._profileId, $rootScope.chosenUpdateBusinesses[0].relListingId, $rootScope.chosenUpdateBusinesses[0].listingType, $rootScope.chosenUpdateFollowers, $rootScope.files).success(function (successData) {
                    console.log(successData);
                    $rootScope.updateButtonDisabled = true;
                    $rootScope.possibleUpdateBusinesses = [];
                    $rootScope.chosenUpdateBusinesses = [];
                    $rootScope.showUpdatePost = false;
                    $rootScope.showFrontScreenCover = false;
                    $rootScope.showFeedUpdateScreenCover = false;
                    $rootScope.appLoading = false;
                }).error(function () {
                    $rootScope.finishPostingUpdate(business);
                });
            }
        }

        $scope.pinListingToMsg = function (listing, $event) {
            $rootScope.pinListingToMessage($event, listing, listing.listingType, null, $scope);
        }
        
        $scope.showShowingTimeButtons = function (feature, cinema, showingTime, $event) {
            $event.stopPropagation();
            $event.preventDefault();
            
            if (showingTime.active) {
                $scope.hideShowingTimeButtons(feature, $event);
                return false;
            }
            
            var scrollVal = $event.y;
            if (scrollVal < 100) {
                scrollVal = 100;
            } else if (scrollVal > 380) {
                scrollVal = -100;
            } else {
                scrollVal = 0;
            }
            
            $ionicScrollDelegate.scrollTo($ionicScrollDelegate.getScrollPosition().left, $ionicScrollDelegate.getScrollPosition().top - scrollVal, true);
            
            var relIndex = 0;
            for (a = 0; a < feature.cinemas.length; a++) {
                if (feature.cinemas[a] == cinema) {
                    relCinemaIndex = a;
                }
                feature.cinemas[a].active = (feature.cinemas[a] == cinema) ? true: false;
                
                for (b = 0; b < feature.cinemas[a].showingTimes.length; b++) {
                    feature.cinemas[a].showingTimes[b].active = (feature.cinemas[a].showingTimes[b] == showingTime) ? true : false;
                    relIndex = (feature.cinemas[a].showingTimes[b] == showingTime) ? b: relIndex;
                }
            }
            
            $scope.currentScrollTop = $ionicScrollDelegate.getScrollPosition().top;
            $scope.currentShowingTimePopUpTriangleXVal = relIndex * 90;
            $scope.currentShowingTimePopUpTopVal = (relCinemaIndex + 1) * 68;
            feature.showShowingTimeButtons = true;
            window.setTimeout(function () { $ionicScrollDelegate.getScrollView().options.scrollingY = false; }, 100);
        };
        $scope.hideShowingTimeButtons = function (feature, $event) {
            $event.stopPropagation();
            $event.preventDefault();
            if (!$scope.showShowingTimeButtons) {
                return false;
            }
            
            $ionicScrollDelegate.getScrollView().options.scrollingY = true;
            feature.showShowingTimeButtons = false;
            for (a = 0; a < feature.cinemas.length; a++) {
                feature.cinemas[a].active = false;
                for (b = 0; b < feature.cinemas[a].showingTimes.length; b++) {
                    feature.cinemas[a].showingTimes[b].active = false;
                }
            }
        };

        $scope.seeListingDetail = function (feature) {
            if (feature.listingType == 'Offer') {
                $state.go('app.offers');
                var timer = window.setTimeout(function () {
                    $state.go('app.offerDetail', {'_id': feature.relListingId});
                }, 100);
                /*
                $rootScope.backButtonFunction = function () {
                    if ($ionicHistory.currentStateName == "app.offerDetail") {
                        $state.go('app.offers');
                        var timer = window.setTimeout(function () {$state.go('app.nlfeed');}, 320);
                    }
                    else {
                        $ionicHistory.goBack();
                    }
                }
                */
            } else {
                $state.go('app.nlfeedListing', {_listingId:feature.relListingId, listingType:feature.listingType});
            }
        }
        
        $scope.feedButtonPressed = function (feature, $event) {
            $event.preventDefault();
            $event.stopPropagation();
            console.log(feature);
            switch(feature.tonightsFeedButtonOption) {
                case 'Book Table':
                    if (!$rootScope.userLoggedIn) {
                        $rootScope.showPopUp($scope, 'BookTable');
                        return false;
                    }
                break;
            };
            
            var listingId = (feature.listingType == 'Business') ? feature._profileId: feature.relListingId;
            $state.go('app.nlfeedListing', {'_listingId': feature.relListingId, 'listingType':feature.listingType});
            switch(feature.tonightsFeedButtonOption) {
                case 'See Photos':
                    var listingType = (feature.listingType == 'Business') ? 'Profile': feature.listingType;
                    var timer = window.setTimeout(function () {
                        $state.go('app.nlfeedListing-photos', {_listingId: listingId, listingType: listingType});
                    }, 120);
                    break;
                case 'See Takeaway Menu':
                    var timer = window.setTimeout(function () {
                        $state.go('app.seeMenu', {'_businessId': feature.relListingId, '_menuTypeId': 1});
                    }, 120);
                    break;
                case 'Book Table':
                    var timer = window.setTimeout(function () {
                        $state.go('app.bookTable', {'_id': listingId});
                    }, 120);
                    break;
                case 'See A la Carte Menu':
                    var timer = window.setTimeout(function () {
                        $state.go('app.seeMenu', {'_businessId': feature.relListingId, '_menuTypeId': 2});
                    }, 120);
                    break;
            };
        }

        $scope.getOriginalListings();
        $rootScope.$on('user-logged-in', function (event, args) {
            $scope.getOriginalListings();
        });
        
        /*
        setTimeout(function() {
            alert(window);
            alert(window.statusbar);
            console.log(window);
            console.log(window.statusbar);
            if (window.statusbar) {
                statusbar.styleLightContent();
            }
            else {
                $rootScope.headerHasStatusBar = false;
            }
        }, 5000); */
    }
    
    $scope.pageLoadInit();
}])

    // NL Feed Listings //
    app.controller('NLFeedListingsCtrl', ['$ionicHistory', '$state','$scope', '$rootScope', '$stateParams', 'Categories', 'Places', 'Events', 'Profile', 'Listings', function($ionicHistory, $state, $scope, $rootScope, $stateParams, Categories, Places, Events, Profile, Listings) {
        // Set Up Variables
        $scope.rootScope = $rootScope;
        $scope.pageLoading = true;
        $scope.searchOnRight = true;
        
        $scope.searchType = $stateParams.searchType;
        $scope.listings = [];
        $scope.features = [];
        
        var addListingsToFeaturedListings = function (listings) {
            for (a = 0; a < listings.length; a++) {
                if (listings[a].isFeatured == "1") {
                    $scope.features.push(listings[a]);
                }
            }
        }
        
        //Prepare Page Load Data
        var getListingsByBusinessType = function (_townId, _businessTypeId) {
            Profile.getListingsByBusinessType(_townId, _businessTypeId).success(function (listings) {
                addListingsToFeaturedListings(listings);
                
                if (listings != 'null' && listings != null) {
                    $rootScope.sortThroughListingsResults($scope, listings, 0, 'listings');
                }
                window.setTimeout(function () { $scope.pageLoading = false;}, 150);
                console.log('getListingsByBusinessType in NLFeedListings results: ', $scope.listings);
            }).error(function () {
                getListingsByBusinessType(_townId, _businessTypeId);
            });
        }
        
        var getBarsAndClubsByTown = function (_townId) {
            Listings.getBarsAndClubsByTown(_townId).success(function (listings) {
                addListingsToFeaturedListings(listings);
                
                if (listings != 'null' && listings != null) {
                    $rootScope.sortThroughListingsResults($scope, listings, 0, 'listings');
                }
                window.setTimeout(function () { $scope.pageLoading = false;}, 150);
                console.log('getBarsAndClubsByTown in NLFeedListings results: ', $scope.listings);
            }).error(function () {
                getBarsAndClubsByTown(_townId);
            });
        }

        $scope.pinListingToMsg = function (listing, $event) {
            $rootScope.pinListingToMessage($event, listing, listing.listingType, null, $scope);
        }
    
        $scope.findNight = function () {
            Events.getEventsByTown($rootScope.currentSearchTown._id, $rootScope.currentSearchMusic._id).success(function (listings) {
                console.log('getEventsbytown in NLFeedListings results: ', listings);
                addListingsToFeaturedListings(listings);
                if (listings != 'null' && listings != null) {
                    $rootScope.sortThroughListingsResults($scope, listings, 0, 'listings');
                }
                window.setTimeout(function () { $scope.pageLoading = false;}, 150);
            }).error(function () {
                $scope.findNight();
            });
        };
        
        $scope.findMovies = function () {
            Listings.getMoviesByTownAndMovieStyle($rootScope.currentSearchTown._id, $rootScope.currentSearchMovieCat._id).success(function (listings) {
                addListingsToFeaturedListings(listings);
                if (listings != 'null' && listings != null) {
                    $rootScope.sortThroughListingsResults($scope, listings, 0, 'listings');
                }
                window.setTimeout(function () { $scope.pageLoading = false;}, 150);
            }).error(function () {
                $scope.findMovies();
            });
        };
        
        $scope.findRestaurants = function () {
            Listings.getRestaurantsOrTakeawaysByTownAndFoodStyle($rootScope.currentSearchTown._id, $rootScope.currentSearchRestaurantFoodCat._id, 'Restaurant').success(function (listings) {
                addListingsToFeaturedListings(listings);
                if (listings != 'null' && listings != null) {
                    $rootScope.sortThroughListingsResults($scope, listings, 0, 'listings');
                }
                window.setTimeout(function () { $scope.pageLoading = false;}, 150);
            }).error(function () {
                $scope.findRestaurants();
            });
        };
        
        $scope.findTakeaways = function () {
            Listings.getRestaurantsOrTakeawaysByTownAndFoodStyle($rootScope.currentSearchTown._id, $rootScope.currentSearchTakeawayFoodCat._id, 'Takeaway').success(function (listings) {
                addListingsToFeaturedListings(listings);
                if (listings != 'null' && listings != null) {
                    $rootScope.sortThroughListingsResults($scope, listings, 0, 'listings');
                }
                
                window.setTimeout(function () { $scope.pageLoading = false;}, 150);
            }).error(function () {
                $scope.findTakeaways();
            });
        };
        
        $scope.seeListingDetail = function (feature) {
            $state.go('app.nlfeedListing', {_listingId:feature.relListingId, listingType:feature.listingType});
        }
        
        switch($scope.searchType) {
            case 'searchBusinessByCategory':
            case 'searchBars':
            case 'searchClubs':
            case 'searchBarsAndClubs':
                var _businessTypeId = $stateParams._businessTypeId;
                
                switch($scope.searchType) {
                    case 'searchBusinessByCategory':
                        $rootScope.currentSearchStyleTerm = $stateParams._businessTypeId;
                        $rootScope.currentSearchTypeTerm = 'Businesses';
                        break;
                    case 'searchBars':
                        $rootScope.currentSearchStyleTerm = "";
                        $rootScope.currentSearchTypeTerm = 'Bars';
                        _businessTypeId = 3;
                        break;
                    case 'searchClubs':
                        $rootScope.currentSearchStyleTerm = "";
                        $rootScope.currentSearchTypeTerm = 'Clubs';
                        _businessTypeId = 2;
                        break;
                    case 'searchBarsAndClubs':
                        $rootScope.currentSearchStyleTerm = "";
                        $rootScope.currentSearchTypeTerm = 'Bars & Clubs';
                        break;
                };
                
                if ($scope.searchType == 'searchBarsAndClubs') {
                    getBarsAndClubsByTown($rootScope.currentSearchTown._id);
                } else {
                    getListingsByBusinessType($rootScope.currentSearchTown._id, _businessTypeId);
                }
                break;
            case 'searchEventsByMusic':
                $rootScope.currentSearchStyleTerm = $rootScope.currentSearchMusic.name;
                $rootScope.currentSearchTypeTerm = 'Nights';
                $scope.findNight();
                break;
            case 'searchMoviesByMovieStyle':
                $rootScope.currentSearchStyleTerm = $rootScope.currentSearchMovieCat.name;
                $rootScope.currentSearchTypeTerm = 'Movies';
                $scope.findMovies();
                break;
            case 'searchRestaurantsByFoodStyle':
                $rootScope.currentSearchStyleTerm = $rootScope.currentSearchRestaurantFoodCat.name;
                $rootScope.currentSearchTypeTerm = 'Restaurants';
                $scope.findRestaurants();
                break;
            case 'searchTakeawaysByFoodStyle':
                $rootScope.currentSearchStyleTerm = $rootScope.currentSearchTakeawayFoodCat.name;
                $rootScope.currentSearchTypeTerm = 'Takeaways';
                $scope.findTakeaways();
                break;
        };
        
        console.log('d', $scope.listings.length);
        
    }])

    // NL Feed Listing //
    app.controller('NLFeedListingCtrl', ['$ionicHistory', '$rootScope', '$state','$scope', '$stateParams', '$ionicPopup', 'Categories', 'Places', 'Events', 'Profile', 'Messages', function($ionicHistory, $rootScope, $state, $scope, $stateParams, $ionicPopup, Categories, Places, Events, Profile, Messages) {
        // Set Up Variables
        $scope.rootScope = $rootScope;
        $scope.listing = {};
        $scope.pageLoading = true;
        
        var id = ($rootScope.userLoggedIn) ? $rootScope.user._profileId: 0;
        //Prepare Page Load Data
        var prepareListingData = function () {
            Profile.getListingById($stateParams._listingId, $stateParams.listingType, id).success(function (successData) {
                console.log(successData[0]);
                console.log(successData[0].follow);
                $scope.listing = successData[0];
                $rootScope.pageTitle = $scope.listing.name;
                $scope.listing.follow = successData[0].follow;
                console.log($scope.listing.follow);
                $rootScope.createListingTypesObjForListing($scope.listing);

                $scope.listing.isAcceptingTaxiBookings = ($scope.listing.isAcceptingTaxiBookings == '1') ? true : false;
                $scope.listing.isAcceptingTableBookings = ($scope.listing.isAcceptingTableBookings == '1') ? true : false;
                $scope.listing.isAcceptingOnlineOrders = ($scope.listing.isAcceptingOnlineOrders == '1') ? true : false;
                $scope.listing.showTakeawayMenu = ($scope.listing.showTakeawayMenu == '1' && $scope.listing.hasTakeawayMenuItem) ? true: false;
                $scope.listing.showCarteMenu = ($scope.listing.showCarteMenu == '1' && $scope.listing.hasCarteMenuItem) ? true: false;

                if ($scope.listing.listingType == 'Event' && $scope.listing.weekday == null) {
                    $scope.listing.dateString = $scope.listing.date.split(' ');
                    //$scope.listing.dateString = $scope.listing.dateString[0].split('-');
                    $scope.selectedDate1 = new Date($scope.listing.dateString[0]);
                    $scope.listing.dateDisplay = $rootScope.convertToDate($scope, $scope.selectedDate1);
                    console.log($scope.selectedDate1, $scope.listing.dateDisplay);

                    $scope.guestListAllowed = ($scope.guestListAllowed != null && ( $scope.guestListMax == null || ($scope.guestListCurrentTotal < $scope.guestListMax))) ? true : false;
                    //console.log(new Date($scope.listing.dateString[0], $scope.listing.dateString[1] - 1, $scope.listing.dateString[2]));
                }
                else if ($scope.listing.listingType == 'Event' && $scope.listing.weekday != null) {
                    $scope.listing.lastDate = ($scope.listing.lastDate != null) ? $rootScope.getShortenedDateString($scope.listing.lastDate): null;
                    $scope.listing.lastDate = ($scope.listing.lastDate != null) ? $rootScope.convertToDate($scope, new Date($scope.listing.lastDate)): null;
                }

                console.log('getListingById in NLFeedListing results: ', $scope.listing);
                console.log($scope.listing);
                $scope.messageDisabled = ($rootScope.user.isBusiness == '1' || $scope.listing.listingType == 'Movie' ||
                        ($rootScope.userLoggedIn && $scope.listing.following != '1' && $scope.listing.listingType == 'Person' && $rootScope.user.isBusiness == '0')
                    ) ? true : false;
                    
                
                window.setTimeout(function () { $scope.pageLoading = false;}, 150);
            }).error(function () {
                prepareListingData();
            });
        }
    
        prepareListingData();
        
        $scope.attemptToLikeOrFollowListing = function (engagementType, listing, $event) {
            /*
            $.ajax({
                    url: 'https://api.wit.ai/message?v=20140826&q=',
                    beforeSend: function(xhr) {
                         xhr.setRequestHeader("Authorization", "Bearer 6QXNMEMFHNY4FJ5ELNFMP5KRW52WFXN5")
                    }, success: function(data){
                        alert(data);
                        //process the JSON data etc
                    }
            });
            */
            
            if ($rootScope.userLoggedIn) {
                $rootScope.toggleUserEngagement(engagementType, listing, $event);
            } else {
                //show pop-up
                $rootScope.showPopUp($scope, 'Like');
            }
        }

        $scope.sendMessage = function () {
            if ($rootScope.userLoggedIn
                && $rootScope.user.isBusiness == '0'
                && ( ($scope.listing.isBusiness == '1' || $scope.listing.listingType == 'Event') || ($scope.listing.following == '1' && $scope.listing.isBusiness != '1') )
                ) {
                //Go to message Screen
                $state.go('app.profile');
                var relListing = ($scope.listing.listingType == 'Event') ? $scope.listing: null;
                
                $rootScope.relListing = relListing;
                if ($scope.listing.listingType == 'Event') {
                    $rootScope.relListing.relListingTypeAlias = "Event";
                }
                if ($rootScope.relListing) {
                    $rootScope.relListing.relListingType = (relListing != null) ? relListing.listingType: null;
                    $rootScope.relListing.relListingSpecItemId = (relListing != null) ? relListing.relListingId : null;
                }
                console.log($rootScope.relListing);
                var groupType = ($scope.listing.isBusiness == '1' || $scope.listing.listingType == 'Event') ? 'Business' : 'Person';
                var timer = window.setTimeout(function () {$state.go('app.messageGroups', {'relListing': null, 'groupType': groupType});}, 60);
                var timer2 = window.setTimeout(function () {
                    Messages.checkIfMessageGroupExists([$rootScope.user._profileId, $scope.listing._profileId]).success(function (successData) {
                        console.log("dat", successData);
                        if (successData == null) {
                            $state.go('app.messageGroup', {'_id': null, 'relListing': null, '_profileIds': [$rootScope.user._profileId, $scope.listing._profileId], 'groupType': groupType});
                        } else {
                            $state.go('app.messageGroup', {'_id': successData[0]._id, 'relListing': null, '_profileIds': [], 'groupType': groupType});
                        }
                    }).error(function () {


                    });
                }, 230);
            } else if (!$rootScope.userLoggedIn) {
                if ($scope.listing.isBusiness == '1' || $scope.listing.listingType == 'Event') {
                    $rootScope.showPopUp($scope, 'Enquiry');
                } else {
                    //Pop up -- you can only message people when logged in
                    $rootScope.showPopUp($scope, 'Message');
                }
            }
        }

        $scope.seePhotos = function (listing) {
            if (listing.listingType == 'Person') {
                return false;
            }
            var relId = null, relType = null;
            if (listing.listingType == 'Movie' || listing.listingType == 'Event') {
                relId = listing.relListingId;
                relType = listing.listingType;
            } else {
                relId = listing._profileId;
                relType = 'Profile';
            }
            $state.go('app.nlfeedListing-photos', {_listingId: relId, listingType: relType});
        }
        
        $scope.goToSeeTrailer = function () {
            $state.go('app.seeTrailer', {_id: $scope.listing.relListingId, movieTitle: $scope.listing.name});
        }

        $scope.goToBookTable = function () {
            if ($scope.listing.isAcceptingTableBookings && $rootScope.userLoggedIn) {
                $state.go('app.bookTable', {'_id': $scope.listing.relListingId});
            }
            else if ($scope.listing.isAcceptingTableBookings && !$rootScope.userLoggedIn) {
                $rootScope.showPopUp($scope, 'BookTable');
            }
        }

        $scope.goToBookTickets = function () {
            if ($scope.listing.guestListAllowed && $rootScope.userLoggedIn) {
                $state.go('app.bookTickets', {'_id': $scope.listing.relListingId});
            }
            else if ($scope.listing.guestListAllowed && !$rootScope.userLoggedIn) {
                $rootScope.showPopUp($scope, 'Guestlist');
            }
        }

        $scope.goToSeeMenu = function (menuType) {
            if ($scope.listing.showCarteMenu && menuType == 'Carte') {
                $state.go('app.seeMenu', {'_businessId': $scope.listing.relListingId, '_menuTypeId': 2});
            }
            else if ($scope.listing.showTakeawayMenu && menuType == 'Takeaway') {
                $state.go('app.seeMenu', {'_businessId': $scope.listing.relListingId, '_menuTypeId': 1});
            }
        }

        $scope.pinListingToMsg = function (listing, $event) {
            $rootScope.pinListingToMessage($event, listing, listing.listingType, null, $scope);
        }

        $scope.goToBookTaxi = function () {
            
        }
    }])

    app.controller('NLFeedListingEnquiryCtrl', ['$ionicHistory', '$rootScope', '$state','$scope', '$stateParams', 'Categories', 'Places', 'Events', 'Profile', function($ionicHistory, $rootScope, $state, $scope, $stateParams, Categories, Places, Events, Profile) {
        // Set Up Variables
        $scope.rootScope = $rootScope;
        $scope.photoAlbums = [];
        $scope.windowWidth = (window.innerWidth/100) * 30;
        $scope._listingId = $stateParams._listingId;
        $scope.listingType = $stateParams.listingType;
        
        //Prepare Page Load Data
        Profile.getPhotoAlbumsSummaryForListing($stateParams._listingId, $stateParams.listingType).success(function (successData) {
            console.log(successData);
            if (successData != 'null') {
                $scope.photoAlbums = successData;
            }
        }).error(function () {
        
        });

        $scope.nextPageFunction = function (item) {
            $state.go('app.nlfeedListing-specific-photos', {_listingId: $stateParams._listingId, listingType: $stateParams.listingType, _albumId: item._albumId, albumType: item.picType});
        }
    }])

    app.controller('NLFeedListingPhotosCtrl', ['$ionicHistory', '$rootScope', '$state','$scope', '$stateParams', 'Categories', 'Places', 'Events', 'Profile', function($ionicHistory, $rootScope, $state, $scope, $stateParams, Categories, Places, Events, Profile) {
        // Set Up Variables
        $scope.rootScope = $rootScope;
        $scope.photoAlbums = [];
        $scope.windowWidth = (window.innerWidth/100) * 30;
        $scope._listingId = $stateParams._listingId;
        $scope.listingType = $stateParams.listingType;
        
        //Prepare Page Load Data
        var getPhotoAlbumsSummaryForListing = function () {
            Profile.getPhotoAlbumsSummaryForListing($stateParams._listingId, $stateParams.listingType).success(function (successData) {
                console.log(successData);
                if (successData != 'null') {
                    $scope.photoAlbums = successData;
                }
            }).error(function () {
                getPhotoAlbumsSummaryForListing();
            });
        }

        $scope.nextPageFunction = function (item) {
            $state.go('app.nlfeedListing-specific-photos', {_listingId: $stateParams._listingId, listingType: $stateParams.listingType, _albumId: item._albumId, albumType: item.picType});
        }
    }])

    app.controller('NLFeedListingSpecificPhotosCtrl', ['$ionicHistory', '$rootScope', '$state','$scope', '$stateParams', 'Categories', 'Places', 'Events', 'Profile', function($ionicHistory, $rootScope, $state, $scope, $stateParams, Categories, Places, Events, Profile) {
        // Set Up Variables
        $scope.rootScope = $rootScope;
        $scope.photos = [];
        $scope.windowWidth = (window.innerWidth/100) * 30;
        $scope._listingProfileId = $stateParams._listingProfileId;
        
        //Prepare Page Load Data
        var getSpecificAlbumSummaryForListing = function () {
            Profile.getSpecificAlbumSummaryForListing($stateParams._listingId, $stateParams._albumId, $stateParams.albumType, $stateParams.listingType).success(function (successData) {
                console.log(successData);
                if (successData != 'null') {
                    $scope.photos = successData;
                }
            }).error(function () {
                getSpecificAlbumSummaryForListing();
            });
        }

        $scope.goToBookTable = function () {
            if ($scope.listing.isAcceptingTableBookings) {
                $state.go('app.bookTable', {'_id': $scope.listing.relListingId});
            }
        }

        $scope.goToSeeMenu = function (menuType) {
            if ($scope.listing.showCarteMenu && menuType == 'Carte') {
                $state.go('app.seeMenu', {'_businessId': $scope.listing.relListingId, '_menuTypeId': 2});
            }
            else if ($scope.listing.showTakeawayMenu && menuType == 'Takeaway') {
                $state.go('app.seeMenu', {'_businessId': $scope.listing.relListingId, '_menuTypeId': 1});
            }
        }

        $scope.goToBookTaxi = function () {
            
        }
    }])

    /* See Businesses Items Views Controller */
    app.controller('SeeBusinessesItemsCtrl', ['$rootScope', '$state', '$stateParams', '$scope', 'Offers', 'Profile', 'Events', 'Taxi', 'MenuItems', function($rootScope, $state, $stateParams, $scope, Offers, Profile, Events, Taxi, MenuItems) {
        //Variables & Constants
        $scope.rootScope = $rootScope;
        $scope.businessesItems = [];
        console.log($stateParams.itemType);
        $scope.itemType = $stateParams.itemType;
        $scope.$on('$ionicView.enter', function() {
        
            if ($stateParams.itemType == 'Offers') {
                $rootScope.topRightButtonShouldBeSettings = true;
                $rootScope.topRightButtonFunction = function () {
                    $state.go('app.businessItemSettings', {'itemType': $stateParams.itemType});
                };
            } else {
                $rootScope.topRightButtonShouldBeSettings = false;
                $rootScope.topRightButtonFunction = function () {
                    $state.go('app.addBusinessItem', {'itemType': $stateParams.itemType});
                };
            }
        })
        
        if ($stateParams.itemType != 'Offers') {
            $scope.nextPageFunction = function (item) {
                $state.go('app.businessItem', {'_id': item.relListingId, 'itemType': $stateParams.itemType});
            };
        } else {
            $scope.nextPageFunction = function (item) {
                $state.go('app.seeBusinessMenuItems', {'_businessId': $rootScope.user._id, '_menuItemCategoryId': item._id});
            };
        }
        
        switch($stateParams.itemType) {
            case 'Offers':
                $scope.getBusinessItems = function () {
                    var listingType = ($stateParams.listingType == 'Event') ? 'Event': 'Business';
                    var _userId = ($rootScope.userLoggedIn) ? $rootScope.user._profileId: 0;
                    
                    Offers.getOffers($stateParams._businessId, listingType, _userId).success(function (offers) {
                        console.log(offers);

                        var allCategoryLabels = [];
                        var allCategories = [];
                        //Loop Through all offers and rceive relevant Cat names
                        for (a = 0; a < offers.length; a++) {
                            var stringToCheck = offers[a].offerSubCategoryName;
                            if (allCategoryLabels.indexOf(stringToCheck) == -1) {
                                allCategoryLabels.push(stringToCheck);
                                allCategories.showFull = false;
                            }
                            offers[a].startDateTimeString = $rootScope.convertToDate($scope, new Date(offers[a].startDateTime.split(' ')[0] ) );
                            offers[a].endDateTimeString = $rootScope.convertToDate($scope, new Date(offers[a].endDateTime.split(' ')[0] ) );
                        }

                        for (a = 0; a < allCategoryLabels.length; a++) {
                            allCategories[a] = []
                            allCategories[a].name = allCategoryLabels[a];
                            allCategories[a].offers = [];
                            
                            for (b = 0; b < offers.length; b++) {
                                var stringToCheck = offers[b].offerSubCategoryName;
                                if (stringToCheck == allCategoryLabels[a]) {
                                    offers[b].index = allCategories[a].offers.length + 1;
                                    allCategories[a].offers.push(offers[b]);
                                }
                            }
                        }
            
                        if (offers != 'null') {
                            $scope.businessesItems = allCategories;
                        }
                    }).error(function () {
                        $scope.getBusinessItems();
                    });
                }

                // Updated from User
                $scope.goToOffer = function (offer) {
                    $state.go('app.offers');
                    var timer =window.setTimeout(function () {
                        $state.go('app.offerDetail', {_id: offer._id});
                    }, 200);
                }
                
                //Updates based on Outside events
                $rootScope.$on('new-offer', function(event, args) {
                    $scope.getBusinessItems();
                    // do what you want to do
                })
                break;
            case 'UpcomingEvents':
                $scope.getBusinessItems = function () {
                    Events.getEventsByBusiness($stateParams._businessId, 'Future').success(function (successData) {
                        console.log(successData);
                        console.log($rootScope.user);
                        $scope.businessesItems = (successData != 'null') ? successData: [];
                    }).error(function () {
                        $scope.getBusinessItems();
                    });
                }
                break;
            
        };
        
        $scope.getBusinessItems();
    }]);

    // See Trailer //
    app.controller('SeeTrailerCtrl', ['$ionicHistory', '$rootScope', '$state', '$scope', '$stateParams', 'Movies', '$sce', function($ionicHistory, $rootScope, $state, $scope, $stateParams, Movies, $sce) {
        // Set Up Variables
        $scope.pageLoading = true;
        $scope.rootScope = $rootScope;
        $scope.movieTitle = $stateParams.movieTitle;
        
        Movies.getMoviesTrailerLink($stateParams._id).success(function (successData) {
            $scope.movieTrailerLink = $sce.trustAsResourceUrl(successData[0].trailerLink);
            $scope.pageLoading = false;
            console.log($scope.movieTrailerLink);
        }).error(function (errorData) {
        
        });
        
    }])

    // Book Table //
    app.controller('BookTableCtrl', ['$ionicHistory', 'ionicDatePicker', 'ionicTimePicker', '$rootScope', '$state', '$scope', '$stateParams', 'TableBooking', '$ionicPopup', function($ionicHistory, ionicDatePicker, ionicTimePicker, $rootScope, $state, $scope, $stateParams, TableBooking, $ionicPopup) {
        // Set Up Variables
        $scope.rootScope = $rootScope;
        $scope.listing = [];
        $scope.tableFor = 2;
        $scope.name = null;
        $scope.email = null;
        $scope.selectedDate1 = new Date();
        $scope.selectedTime = new Date(64800 * 1000);
        $scope.todaysDate = new Date();
        $scope.finalDate = new Date();
        $scope.days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        $scope.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        $scope.convertToDate = function () {
            return $scope.days[$scope.selectedDate1.getDay()] + ', ' + $scope.selectedDate1.getDate() + ' ' + $scope.months[$scope.selectedDate1.getMonth()] + ' ' + $scope.selectedDate1.getFullYear();
        }
        $scope.convertToTime = function () {
            $scope.selectedHour = ($scope.selectedTime.getUTCHours() < 10) ? '0' + $scope.selectedTime.getUTCHours(): $scope.selectedTime.getUTCHours();
            $scope.selectedMinutes = ($scope.selectedTime.getUTCMinutes() < 10) ? '0' + $scope.selectedTime.getUTCMinutes(): $scope.selectedTime.getUTCMinutes();
            return $scope.selectedHour + ':' + $scope.selectedMinutes;
        }
        $scope.dateInputHTML = $scope.convertToDate();
        $scope.timeInputHTML = $scope.convertToTime();

        var ipObj1 = {
          callback: function (val) {  //Mandatory
            $scope.selectedDate1 = new Date(val);
            $scope.dateInputHTML = $scope.convertToDate();
            ipObj1.inputDate = new Date(val);
            console.log('Return value from the datepicker popup is : ' + new Date(val));
          },
          disabledDates: [            //Optional
            new Date(2016, 2, 16),
            new Date(2015, 3, 16),
            new Date(2015, 4, 16),
            new Date(2015, 5, 16),
            new Date('Wednesday, August 12, 2015'),
            new Date("08-16-2016"),
            new Date(1439676000000)
          ],
          from: new Date(), //Optional
          to: $scope.finalDate.setDate($scope.finalDate.getDate() + 30), //Optional
          inputDate: $scope.selectedDate1,      //Optional
          mondayFirst: true,          //Optional
          disableWeekdays: [],       //Optional
          closeOnSelect: true,       //Optional
          templateType: 'popup'       //Optional
        };

        var ipObj2 = {
            callback: function (val) {      //Mandatory
              if (typeof (val) === 'undefined') {
                console.log('Time not selected');
              } else {
                $scope.selectedTime = new Date(val * 1000);
                $scope.timeInputHTML = $scope.convertToTime();
                ipObj2.inputTime = ($scope.selectedTime.getUTCMinutes() < 30) ? val: val - 3600;
                console.log('Selected epoch is : ', ipObj2.inputTime, 'and the time is ', $scope.selectedTime.getUTCHours(), 'H :', $scope.selectedTime.getUTCMinutes(), 'M');
              }
            },
            inputTime: 64800,   //Optional
            format: 12,         //Optional
            step: 10,           //Optional
            setLabel: 'Set'    //Optional
          };

        $scope.updateTableFor = function (val) {
            $scope.tableFor = ( ($scope.tableFor == 1 && val == -1) || ($scope.tableFor == 99 && val == 1) ) ? $scope.tableFor: $scope.tableFor += val; 
        }

        $scope.openTimePicker = function(){
          ionicTimePicker.openTimePicker(ipObj2);
        };

        $scope.openDatePicker = function(){
          ionicDatePicker.openDatePicker(ipObj1);
        };

        $scope.completeTableBooking = function (name, email) {
            $scope.dateTimeString = $scope.selectedDate1.getFullYear() + '-' + ($scope.selectedDate1.getMonth() + 1) + '-' + $scope.selectedDate1.getDate() + ' ' + $scope.selectedHour + ':' + $scope.selectedMinutes;
            var _profId = ($rootScope.userLoggedIn) ? $rootScope.user._profileId: null;
            TableBooking.createTableBooking(_profId, $stateParams._id, name, email, $scope.tableFor, $scope.dateTimeString).success(function (successData) {
                var contents = "You've received a Table Booking Request.";
                var header = "Table Booking Requested";
                var dataObj = {
                    "actionFunction": "goToBusinessItem",
                    "businessItemType": "RequestedTableBookings",
                    "_businessItemId": successData[0]._id
                };
                
                var recipientsArray = [successData[0]._profileId];
                
                $rootScope.prepareMessageNotificationFinal(recipientsArray, contents, header, dataObj);
                
                $ionicPopup.show({
                    title: 'Table Booking Requested',
                    template: '<i class="ion-checkmark main-icon"></i><p>Your Table Booking has been requested. We\'ll update you once the restaurant has responded.</p>',
                    //subTitle: 'Are you sure you want to Delete this item?',
                    scope: $scope,
                    buttons: [
                        { 
                            text: 'Close',
                            onTap: function(e) {
                                $ionicHistory.goBack();
                            } 
                        }
                    ]
                });
            }).error(function (errorData) {
                $scope.completeTableBooking(name, email);
            });
        }
    }])

// Book Tickets //
    app.controller('BookTicketsCtrl', ['$ionicHistory', '$rootScope', '$state', '$scope', '$stateParams', '$ionicPopup', 'Events', function($ionicHistory, $rootScope, $state, $scope, $stateParams, $ionicPopup, Events) {
        // Set Up Variables
        $scope.rootScope = $rootScope;
        $scope.listing = [];
        $scope.additionalGuests = 0;
        $scope.showEventDates = false;
        $scope.bookingAllowed = true;

        $scope.updateAdditionalGuests = function (val) {
            $scope.additionalGuests = ( ($scope.additionalGuests == 0 && val == -1) || ($scope.tableFor == 19 && val == 1) ) ? $scope.additionalGuests: $scope.additionalGuests += val; 
        }

        $scope.getEventDetails = function () {
            Events.getEventDateDetails($stateParams._id, $rootScope.user._profileId).success(function (successData) {
                console.log(successData);
                $scope.listing = successData[0];
                if ($scope.listing.weekday == null) {
                    $scope.chosenDate = $scope.listing.date;
                    $scope.listing.dateString = $scope.listing.date.split(' ');
                    //$scope.listing.dateString = $scope.listing.dateString[0].split('-');
                    $scope.selectedDate1 = new Date($scope.listing.dateString[0]);
                    $scope.dateDisplay = $rootScope.convertToDate($scope, $scope.selectedDate1);
                    console.log($socpe.dateDisplay);
                } else {
                    $scope.eventDates = [];
                    $scope.eventDatesBooked = [];

                    $scope.eventDates.push($scope.listing.date);
                    $scope.eventDatesBooked[0] = null;
                    if ($scope.listing.week2Date != null) {
                        $scope.eventDates.push($scope.listing.week2Date);
                        $scope.eventDatesBooked[1] = ($scope.listing._week2DateBooked == null) ? null: $scope.listing.week2Date.split(' ')[0];
                    }
                    if ($scope.listing.week3Date != null) {
                        $scope.eventDates.push($scope.listing.week3Date);
                        $scope.eventDatesBooked[2] = ($scope.listing._week3DateBooked == null) ? null: $scope.listing.week3Date.split(' ')[0];
                    }
                    if ($scope.listing.week4Date != null) {
                        $scope.eventDates.push($scope.listing.week4Date);
                        $scope.eventDatesBooked[3] = ($scope.listing._week4DateBooked == null) ? null: $scope.listing.week4Date.split(' ')[0];
                    }
                    if ($scope.listing.week5Date != null) {
                        $scope.eventDates.push($scope.listing.week5Date);
                        $scope.eventDatesBooked[4] = ($scope.listing._week5DateBooked == null) ? null: $scope.listing.week5Date.split(' ')[0];
                    }
                    if ($scope.listing.week6Date != null) {
                        $scope.eventDates.push($scope.listing.week6Date);
                        $scope.eventDatesBooked[5] = ($scope.listing._week6DateBooked == null) ? null: $scope.listing.week6Date.split(' ')[0];
                    }
                    if ($scope.listing.week7Date != null) {
                        $scope.eventDates.push($scope.listing.week7Date);
                        $scope.eventDatesBooked[6] = ($scope.listing._week7DateBooked == null) ? null: $scope.listing.week7Date.split(' ')[0];
                    }
                    if ($scope.listing.week8Date != null) {
                        $scope.eventDates.push($scope.listing.week8Date);
                        $scope.eventDatesBooked[7] = ($scope.listing._week8DateBooked == null) ? null: $scope.listing.week8Date.split(' ')[0];
                    }

                    $scope.eventDatesStrings = [];
                    for (a = 0; a < $scope.eventDates.length; a++) {
                        $scope.eventDates[a] = $scope.eventDates[a].split(' ')[0];
                        $scope.eventDatesStrings[a] = new Date($scope.eventDates[a]);
                        $scope.eventDatesStrings[a] = $rootScope.days[$scope.eventDatesStrings[a].getDay()] + ', ' + $scope.eventDatesStrings[a].getDate() + ' ' + $rootScope.months[$scope.eventDatesStrings[a].getMonth()] + ' ' + $scope.eventDatesStrings[a].getFullYear();
                    }
                    $scope.chosenEventDate = $scope.eventDatesStrings[0];
                }
                
            }).error(function () {
                $scope.getEventDetails();
            });
        }

        $scope.toggleEventDateVisibility = function () {
            $scope.showEventDates = !$scope.showEventDates;
        }

        $scope.selectEventDate = function (date) {
            $scope.chosenEventDate = date;
            $scope.showEventDates = false;
            var relIndex = 0;
            for (a = 0; a < $scope.eventDatesStrings.length; a++) {
                relIndex = ($scope.eventDatesStrings[a] == date) ? a: relIndex;
            }
            $scope.bookingAllowed = ($scope.eventDatesBooked.indexOf($scope.eventDates[relIndex]) == -1) ? true: false;
            $scope.chosenDate = $scope.eventDates[relIndex];

            console.log($scope.eventDates, $scope.eventDatesStrings, $scope.eventDatesBooked);
        }

        $scope.completeTicketBooking = function () {
            var _profId = ($rootScope.userLoggedIn) ? $rootScope.user._profileId: 2;
            console.log($stateParams._id, _profId, $scope.chosenDate + ' 00:00', $scope.additionalGuests, 'Guestlist');
            
            Events.createEventEntryBooking($stateParams._id, _profId, $scope.chosenDate, $scope.additionalGuests, 'Guestlist').success(function (successData) {
                var contents = "You've received an Event Booking for " + $scope.chosenDate + "(" + $scope.additionalGuests + " guests)";
                var header = "Event Entry Booking Received";
                var dataObj = {
                    "actionFunction": "goToBusinessItem",
                    "businessItemType": "OwnEvents",
                    "_businessItemId": $stateParams._id
                };
                
                var recipientsArray = [successData[0]._profileId];
                
                $rootScope.prepareMessageNotificationFinal(recipientsArray, contents, header, dataObj);
                
                $ionicPopup.show({
                    title: 'Guestlist Booking Complete',
                    template: '<i class="ion-checkmark main-icon"></i><p>Your Guestlist Booking for this event has been completed.</p>',
                    //subTitle: 'Are you sure you want to Delete this item?',
                    scope: $scope,
                    buttons: [
                        { 
                            text: 'Close',
                            onTap: function(e) {
                                $ionicHistory.goBack();
                            } 
                        }
                    ]
                });
            }).error(function (errorData) {
                $scope.completeTicketBooking();
            });
        }

        $scope.getEventDetails();
    }])

    // See Menu Summary//
    app.controller('SeeMenuCtrl', ['$ionicHistory', '$rootScope', '$state','$scope', '$stateParams', 'MenuItems', function($ionicHistory, $rootScope, $state, $scope, $stateParams, MenuItems) {
        // Set Up Variables
        $scope.rootScope = $rootScope;
        $scope.pageLoading = true;
        
        $scope._businessId = $stateParams._businessId;
        $scope._menuTypeId = $stateParams._menuTypeId;
        $scope.menuItemCategories = [];
        $scope.menuItemCategoriesAdded = [];
        $scope.menuItems = [];
        $scope.menuItemsAdded = [];
        $scope.currentOrderMethod = 'Collection';
        $scope.currentOrderReadyToSubmit = false;
        
        //Method Set up Here but can now be accessed globally
        
        $rootScope.finalMenuOrderObjCleanse = function ($scope) {
            var menuItemsToRemove = [];
            
            function calculateOrderTotal () {
                //$rootScope.$broadcast('menuItem-order-changed');
                var currentOrderTrayTotal = 0;
                if ($rootScope.currentSavedFoodOrders) {
                    for (a = 0; a < $rootScope.currentSavedFoodOrders.length; a++) {
                        if ($rootScope.currentSavedFoodOrders[a]._businessId == $stateParams._businessId) {
                            for (b = 0; b < $rootScope.currentSavedFoodOrders[a].menuItems.length; b++) {
                                for (c = 0; c < $rootScope.currentSavedFoodOrders[a].menuItems[b].item.itemsAddedToBasket.length; c++) {
                                
                                    if ($rootScope.currentSavedFoodOrders[a].menuItems[b].item.itemsAddedToBasket[c].specificItem.length > 0) {
                                        var optChoicesLength = $rootScope.currentSavedFoodOrders[a].menuItems[b].item.itemsAddedToBasket[c].specificItem.length;
                                        currentOrderTrayTotal += ($rootScope.currentSavedFoodOrders[a].menuItems[b].item.itemsAddedToBasket[c].quantity * parseFloat($rootScope.currentSavedFoodOrders[a].menuItems[b].item.itemsAddedToBasket[c].specificItem[optChoicesLength - 1].finalPrice) );
                                    } else {
                                        currentOrderTrayTotal += ($rootScope.currentSavedFoodOrders[a].menuItems[b].item.itemsAddedToBasket[c].quantity * parseFloat($rootScope.currentSavedFoodOrders[a].menuItems[b].item.itemsAddedToBasket[c].finalPrice) );
                                    }
                                }
                            }
                        }
                    }
                    
                    $rootScope.currentOrderTrayTotal = (currentOrderTrayTotal).formatMoney(2);
                    $scope.currentOrderReadyToSubmit = (currentOrderTrayTotal > parseFloat(10.00) || ($scope.currentOrderMethod == 'Collection' && currentOrderTrayTotal > parseFloat(0.00))) ? true: false;
                }
            }
            
            function removeMenuItems () {
                for (a = menuItemsToRemove.length - 1; a > 0; a--) {
                    $scope.thisTakeawaysOrderObject.splice(menuItemsToRemove[a], 0);
                    if (a == 1) {
                        calculateOrderTotal();
                    }
                }
            }
            
            function loopMenuItems (a) {
                if ($scope.thisTakeawaysOrderObject.menuItems[a].quantity == 0) {
                    menuItemsToRemove.push(a);
                }
                
                if (a < $scope.thisTakeawaysOrderObject.menuItems - 1) {
                    loopMenuItems(a + 1);
                }
                else if (menuItemsToRemove.length > 0) {
                    removeMenuItems();
                }
                else {
                    calculateOrderTotal();
                }
            }
            
            if ($scope.thisTakeawaysOrderObject && $scope.thisTakeawaysOrderObject.menuItems) {
                loopMenuItems(0);
            }
            else {
                //console.log("ko", $rootScope.finalMenuOrderObjCleanse);
                
                calculateOrderTotal();
            }
        }
        
        $scope.sortMenuItems = function () {
            var addMenuItemsToCat = function (i, catI) {
                if ($scope.menuItems[i].itemsAddedToBasket) {
                    for (ind = 0; ind < $scope.menuItems[i].itemsAddedToBasket.length; ind++) {
                        if ($scope.menuItems[i].itemsAddedToBasket[ind].specificItem.length == 0) {
                            $scope.menuItemCategories[catI].count += $scope.menuItems[i].itemsAddedToBasket[ind].quantity;
                        } else {
                            $scope.menuItemCategories[catI].count += $scope.menuItems[i].itemsAddedToBasket[ind].quantity;
                        }
                    }
                }
            }
            for (z = 0; z < $scope.menuItems.length; z++) {
                if ($scope.menuItemCategoriesAdded.indexOf($scope.menuItems[z]._menuItemCategoryId) == -1) {
                    $scope.menuItemCategories.push({
                        'name': $scope.menuItems[z].menuItemCategoryName,
                        '_id': $scope.menuItems[z]._menuItemCategoryId,
                        'count': 0
                    });
                    
                    var currentCategoriesIndex = $scope.menuItemCategories.length - 1;
                    
                    addMenuItemsToCat(z, currentCategoriesIndex);
                    
                    $scope.menuItemCategoriesAdded.push($scope.menuItems[z]._menuItemCategoryId);
                }
                else {
                    addMenuItemsToCat(z, $scope.menuItemCategoriesAdded.indexOf($scope.menuItems[z]._menuItemCategoryId));
                }
                
                if (z == $scope.menuItems.length - 1) {
                    $scope.pageLoading = false;
                }
            }
        }
        
        var getMenuItems = function () {
            MenuItems.getMenuItems($stateParams._businessId, 0, $stateParams._menuTypeId).success(function (successData) {
                $scope.menuItemCategories = [];
                $scope.menuItemCategoriesAdded = [];
                $scope.menuItems = [];
                $scope.menuItemsAdded = [];
                
                for (a = 0; a < successData.length; a++) {
                    tagsObj = {'tagName':successData[a].tagName, 'iconClass':successData[a].iconClass};
                    if ($scope.menuItemsAdded.indexOf(successData[a]._id) == -1) {
                    
                        //Check the rootScope order object to add already ordered items into this object
                        $rootScope.currentSavedFoodOrders = $rootScope.currentSavedFoodOrders || [];
                        
                        for (b = 0; b < $rootScope.currentSavedFoodOrders.length; b++) {
                            if ($rootScope.currentSavedFoodOrders[b]._businessId == $stateParams._businessId) {
                                var thisTakeawaysOrderObject = $rootScope.currentSavedFoodOrders[b];
                                for (c = 0; c < thisTakeawaysOrderObject.menuItems.length; c++) {
                                    if (thisTakeawaysOrderObject.menuItems[c].item._id == successData[a]._id) {
                                        successData[a].itemsAddedToBasket = thisTakeawaysOrderObject.menuItems[c].item.itemsAddedToBasket;
                                    }
                                }
                            }
                        }
                    
                        $scope.menuItems.push(successData[a]);
                        $scope.menuItemsAdded.push(successData[a]._id);
                    }
                    
                    if (a == successData.length - 1) {
                        $scope.sortMenuItems();
                    }
                }
            }).error(function () {
                getMenuItems();
            });
        }
        
        $scope.changeOrderMethod = function (method) {
            $scope.currentOrderReadyToSubmit = (parseFloat($rootScope.currentOrderTrayTotal) > parseFloat(10.00) || (method == 'Collection' && parseFloat($rootScope.currentOrderTrayTotal) > parseFloat(0.00))) ? true: false;
            $scope.currentOrderMethod = method;
        }
        
        $scope.completeOrder = function () {
            if ($scope.currentOrderReadyToSubmit) {
                $state.go('app.completeTakeawayOrder', {'_businessId': $stateParams._businessId});
            }
        }
        
        getMenuItems();
        $rootScope.finalMenuOrderObjCleanse($scope);
        
        //Updates based on Outside events
        $rootScope.$on('menuItem-order-changed', function(event, args) {
            $rootScope.finalMenuOrderObjCleanse($scope);
            getMenuItems();
            // do what you want to do
        })
        
    }])
    // See Menu Items//
    app.controller('SeeMenuItemsCtrl', ['$ionicHistory', '$rootScope', '$state','$scope', '$stateParams', 'MenuItems', function($ionicHistory, $rootScope, $state, $scope, $stateParams, MenuItems) {
        // Set Up Variables
        $scope.rootScope = $rootScope;
        $scope.pageLoading = true;
        
        $scope.showExtraOptions = false;
        $scope.menuItems = [];
        $scope.normalMenuItems = [];
        $scope.categorizedMenuItems = [];
        $scope.menuItemsAdded = [];
        $scope.currentExtraOptions = [];
        $scope.currentExtraOptionsStage = 1;
        $scope.currentExtraOptionsComplete = false;
        
        //Prepare Page Load Data
        var getMenuItems = function () {
            MenuItems.getMenuItems($stateParams._businessId, $stateParams._menuItemCategoryId, $stateParams._menuTypeId).success(function (successData) {
                
                if (successData == 'null') {
                    console.log('getMenuItems in SeeBusinessMenuItems results: ', successData);
                    return false;
                }
                
                var sortCategorizedAndNormalMenuItems = function () {
                    for (a = 0; a < $scope.menuItems.length; a++) {
                        if ($scope.menuItems[a].menuItemSubCategoryName != null) {
                            var existingArrayFound = false;
                            for (b = 0; b < $scope.categorizedMenuItems.length; b++) {
                                if ($scope.categorizedMenuItems[b].subCatName == $scope.menuItems[a].menuItemSubCategoryName) {
                                    $scope.categorizedMenuItems[b].items.push($scope.menuItems[a]);
                                    existingArrayFound = true;
                                }
                            }
                            if (!existingArrayFound) {
                                $scope.categorizedMenuItems.push({subCatName: successData[a].menuItemSubCategoryName, items: [$scope.menuItems[a]]});
                            }
                        } else {
                            $scope.normalMenuItems.push($scope.menuItems[a]);
                        }
                        
                        if (a == $scope.menuItems.length - 1) {
                            window.setTimeout(function () {$scope.pageLoading = false;}, 150);
                        }
                    }
                }
                
                $scope.menuItemCategoryName = successData[0].menuItemCategoryName;
                for (a = 0; a < successData.length; a++) {
                    var tagsObj = {'tagName':successData[a].tagName, 'iconClass':successData[a].iconClass};
                    if ($scope.menuItemsAdded.indexOf(successData[a]._id) == -1) {
                        successData[a].tags = [tagsObj];
                        
                        //Check the rootScope order object to add already ordered items into this object
                        $rootScope.currentSavedFoodOrders = $rootScope.currentSavedFoodOrders || [];
                        for (b = 0; b < $rootScope.currentSavedFoodOrders.length; b++) {
                            if ($rootScope.currentSavedFoodOrders[b]._businessId == $stateParams._businessId) {
                                var thisTakeawaysOrderObject = $rootScope.currentSavedFoodOrders[b];
                                
                                newOrder = false;
                                var itemExistsInOrder = false;
                                for (c = 0; c < thisTakeawaysOrderObject.menuItems.length; c++) {
                                    if (thisTakeawaysOrderObject.menuItems[c].item._id == successData[a]._id) {
                                        successData[a].itemsAddedToBasket = thisTakeawaysOrderObject.menuItems[c].item.itemsAddedToBasket;
                                    }
                                }
                            }
                        }
                    
                        $scope.menuItems.push(successData[a]);
                        $scope.menuItemsAdded.push(successData[a]._id);
                    }
                    else {
                        for (b = 0; b < $scope.menuItems.length; b++) {
                            if ($scope.menuItems[b]._id == successData[a]._id) {
                                $scope.menuItems[b].tags.push(tagsObj);
                            }
                        }
                    }
                    
                    if (a == successData.length - 1) {
                        sortCategorizedAndNormalMenuItems();
                    }
                }
                console.log("po", $scope.normalMenuItems);
                console.log("po", $scope.categorizedMenuItems);
                
            }).error(function () {
                getMenuItems();
            });
        }
        
        var specificItemsObjectMatch = function (obj1, obj2) {
            var returnBool = false;
            
            if(Object.prototype.toString.call( obj1.chosenOption ) === '[object Array]' ) {
                var arrayCount1 = obj1.chosenOption.length;
                var arrayCount2 = obj2.chosenOption.length;
                var counter = 0;
                
                if (arrayCount1 == arrayCount2) {
                    for (a = 0; a < arrayCount1; a++) {
                        if (obj1.chosenOption[a].name == obj2.chosenOption[a].name) {
                            if (obj1.quantityRelevant && obj1.chosenOption[a].quantity == obj2.chosenOption[a].quantity) {
                                counter += 1;
                            }
                            else if (!obj1.quantityRelevant) {
                                counter += 1;
                            }
                        }
                    }
                    
                    if (counter == arrayCount1) {
                        returnBool = true;
                    }
                }
            } else {
                if (obj1._id == obj2._id && obj1.chosenOption.name == obj2.chosenOption.name) {
                    if (obj1.quantityRelevant && obj1.chosenOption.quantity == obj2.chosenOption.quantity) {
                        returnbool = true;
                    }
                    else if (!obj1.quantityRelevant) {
                        returnBool = true;
                    }
                }
            }
            
            return returnBool;
        }
        
        $scope.deleteMenuItem = function (menuItem, item) {
            console.log(menuItem);
            console.log(item);
            if (item.showMenuItemOptions == true) {
                var relMenuItem;
                
                function finishDeletingSavedFoodOrder (relMenuItem) {
                    if (relMenuItem.quantity > 0) {
                        relMenuItem.quantity -= 1;
                    } else {
                        //$rootScope.currentSavedFoodOrders[relFoodOrderI].menuItems.splice(relMenuItemI, 1);
                    }
                    
                    $rootScope.$broadcast('menuItem-order-changed');
                    window.setTimeout(200, function () {$rootScope.finalMenuOrderObjCleanse($scope)});
                    console.log("u");
                    item.showMenuItemDeleteOptions = false;
                }
                
                function loopThroughSpecificItemsToDel (relMenuItem, b, c, specItemMatchCounter) {
                    if (specificItemsObjectMatch(relMenuItem.item.itemsAddedToBasket[b].specificItem[c], item.specificItem[c])) {
                        specItemMatchCounter += 1;
                    }
                    
                    if (c == (relMenuItem.item.itemsAddedToBasket[b].specificItem.length - 1)
                        && specItemMatchCounter == relMenuItem.item.itemsAddedToBasket[b].specificItem.length) {
                        console.log("mo");
                        finishDeletingSavedFoodOrder(relMenuItem);
                    }
                    else if (c == (relMenuItem.item.itemsAddedToBasket[b].specificItem.length - 1)
                        && specItemMatchCounter != relMenuItem.item.itemsAddedToBasket[b].specificItem.length
                        && b < relMenuItem.item.itemsAddedToBasket.length - 1) {
                        loopThroughBasketItemsToDel(relMenuItem, b+1);
                    }
                    else if (c < relMenuItem.item.itemsAddedToBasket[b].specificItem.length - 1) {
                        loopThroughSpecificItemsToDel(relMenuItem, b, c + 1, specItemMatchCounter);
                    }
                }
                
                function loopThroughBasketItemsToDel (relMenuItem, b) {
                    if (relMenuItem.item.itemsAddedToBasket[b].specificItem.length > 0) {
                        loopThroughSpecificItemsToDel(relMenuItem, b, 0, 0);
                    }
                    else {
                        finishDeletingSavedFoodOrder(relMenuItem);
                    }
                }
                
                function loopSavedFoodOrdersMenuItems (a, z) {
                    if ($rootScope.currentSavedFoodOrders[a].menuItems[z].item._id == menuItem._id) {
                        relMenuItem = $rootScope.currentSavedFoodOrders[a].menuItems[z];
                        relFoodOrderI = z;
                        relMenuItemI = a;
                        loopThroughBasketItemsToDel(relMenuItem, 0);
                    }
                    else if (z < $rootScope.currentSavedFoodOrders[a].menuItems.length - 1) {
                        loopSavedFoodOrdersMenuItems(a, z+1);
                    }
                }
                
                function loopSavedFoodOrders(a) {
                    if ($rootScope.currentSavedFoodOrders[a]._businessId == $stateParams._businessId) {
                        loopSavedFoodOrdersMenuItems(a, 0);
                    }
                    else if (a < $rootScope.currentSavedFoodOrders.length - 1) {
                        loopSavedFoodOrders(a+1);
                    }
                };
                
                //remove from main Food Orders Array
                loopSavedFoodOrders(0);
                
                //remove from the page Scopes MenuItem array
                function loopThroughBasketSpecificItemsToDel(a, b, d, c, allOptionsSame) {
                    var allOptionsSame = specificItemsObjectMatch(item.specificItem[d], $scope.menuItems[a].itemsAddedToBasket[b].specificItem[c]);
                    if (c == $scope.menuItems[a].itemsAddedToBasket[b].specificItem.length - 1
                        && d == item.specificItem.length - 1) {
                        if (allOptionsSame) {
                            $scope.menuItems[a].itemsAddedToBasket[b].quantity -= 1;
                            item.showMenuItemDeleteOptions = false;
                        }
                        if (d == item.specificItem.length - 1 && $scope.menuItems[a].itemsAddedToBasket[b].quantity == 0) {
                            $scope.menuItems[a].itemsAddedToBasket.splice(b, 1);
                        }
                    }
                    else if (d < item.specificItem.length - 1) {
                        loopThroughItemSpecificItemsToDel(a, b, d+1, c)
                    }
                    else if (c < $scope.menuItems[a].itemsAddedToBasket[b].specificItem.length - 1) {
                        loopThroughBasketSpecificItemsToDel(a, b, d, c+1, allOptionsSame);
                    }
                }
                
                function loopThroughItemSpecificItemsToDel(a, b, d, c) {
                    var allOptionsSame = true;
                    loopThroughBasketSpecificItemsToDel(a, b, d, c, allOptionsSame);
                }
                
                function loopThroughMenuBasketItemsToDel (a, b) {
                    if ($scope.menuItems[a].itemsAddedToBasket[b].specificItem.length > 0) {
                        loopThroughItemSpecificItemsToDel(a, b, 0, 0);
                    }
                    else {
                        if ($scope.menuItems[a].itemsAddedToBasket[b].quantity > 1) {
                            $scope.menuItems[a].itemsAddedToBasket[b].quantity -= 1;
                        }
                        else {
                            $scope.menuItems[a].itemsAddedToBasket.splice(b, 1);
                        }
                        
                        /* Shouldnt need
                        if (b < $scope.menuItems[a].itemsAddedToBasket.length - 1) {
                            loopThroughMenuBasketItemsToDel(a, b+1);
                        }
                        */
                    }
                }
                for (a = 0; a < $scope.menuItems.length; a++) {
                    if ($scope.menuItems[a]._id == menuItem._id) {
                        loopThroughMenuBasketItemsToDel(a, 0);
                    }
                }
            }
            else {
                item.showMenuItemOptions = true;
            }
        }
        
        $scope.completeAddingItemToOrder = function () {
            if (!$scope.currentExtraOptionsComplete) {
                return false;
            }
            
            var newOrder = true;
            var itemHasNoOptions;
            
            $scope.showExtraOptions = false;
            $scope.currentItemBeingOrdered.oldSpecificItem = (!$scope.currentItemBeingAddedIsNew) ? $scope.currentItemBeingOrdered.specificItem: null;
            $scope.currentItemBeingOrdered.specificItem = $scope.currentExtraOptions;
            
            itemHasNoOptions = ($scope.currentItemBeingOrdered.specificItem.length == 0) ? true: false;
            
            $rootScope.currentSavedFoodOrders = $rootScope.currentSavedFoodOrders || [];
            
            $scope.currentItemBeingOrdered.showMenuItemOptions = false;
            $scope.currentItemBeingOrdered.menuItemOptions = "none";
            $scope.currentItemBeingOrderedQuantity = $scope.currentItemBeingOrdered.quantity;
            
            if ($scope.currentExtraOptionsChosenOption) {
                $scope.currentExtraOptionsChosenOption.finalPrice = $scope.currentExtraOptionsPrice;
            }
            
            //process the optionChoices array and add the selected Option as a new property
            for (a = 0; a < $scope.currentItemBeingOrdered.specificItem.length; a++) {
                if ($scope.currentItemBeingOrdered.specificItem[a].optionChoices != null) {
                    $scope.currentItemBeingOrdered.specificItem[a].chosenOption = ($scope.currentItemBeingOrdered.specificItem[a].type == 'Multi') ? []: $scope.currentItemBeingOrdered.specificItem[a].chosenOption;
                    for (b = 0; b < $scope.currentItemBeingOrdered.specificItem[a].optionChoices.length; b++) {
                        if ($scope.currentItemBeingOrdered.specificItem[a].optionChoices[b].preselected) {
                            $scope.currentItemBeingOrdered.specificItem[a].optionChoices[b].selected = true;
                            $scope.currentItemBeingOrdered.specificItem[a].selected = true;
                            if ($scope.currentItemBeingOrdered.specificItem[a].type == 'Only One') {
                                $scope.currentItemBeingOrdered.specificItem[a].chosenOption = $scope.currentItemBeingOrdered.specificItem[a].optionChoices[b];
                            }
                            else if ($scope.currentItemBeingOrdered.specificItem[a].type == 'Multi') {
                                $scope.currentItemBeingOrdered.specificItem[a].chosenOption = (isArray($scope.currentItemBeingOrdered.specificItem[a].chosenOption)) ? $scope.currentItemBeingOrdered.specificItem[a].chosenOption : [] ;
                                $scope.currentItemBeingOrdered.specificItem[a].chosenOption.push($scope.currentItemBeingOrdered.specificItem[a].optionChoices[b]);
                            }
                        }
                    }
                }
            }
            
            //add order to the rootScope order object
            for (a = 0; a < $rootScope.currentSavedFoodOrders.length; a++) {
                if ($rootScope.currentSavedFoodOrders[a]._businessId == $stateParams._businessId) {
                    newOrder = false;
                    var itemExistsInOrder = false;
                    for (b = 0; b < $rootScope.currentSavedFoodOrders[a].menuItems.length; b++) {
                        if ($rootScope.currentSavedFoodOrders[a].menuItems[b].item._id == $scope.currentItemBeingOrdered._id) {
                            if ($scope.currentItemBeingAddedIsNew) {
                                $rootScope.currentSavedFoodOrders[a].menuItems[b].quantity += 1;
                            }
                            itemExistsInOrder = true;
                        }
                    }
                    
                    if (!itemExistsInOrder) {
                        $rootScope.currentSavedFoodOrders[a].menuItems.push({'quantity': 1, 'item': $scope.currentItemBeingOrdered});
                    }
                }
            }
            
            if (newOrder) {
                $rootScope.currentSavedFoodOrders.push({
                    '_businessId': $stateParams._businessId,
                    'menuItems': [{'quantity': 1, 'item': $scope.currentItemBeingOrdered}]
                });
                $scope.thisTakeawaysOrderObject = $rootScope.currentSavedFoodOrders[0];
            }
            
            //add the item to the pages menu items
            
            function completeAddingItemIntoBasket (a, b, itemAlreadyInBasket, itemIsAnEditButNewItemNotInBasket) {
                if (!itemAlreadyInBasket && itemHasNoOptions) {
                    $scope.menuItems[a].itemsAddedToBasket.push({'quantity': 1, 'specificItem': $scope.currentItemBeingOrdered.specificItem, 'finalPrice': $scope.currentItemBeingOrdered.Price});
                }
                else if (!itemAlreadyInBasket && !itemHasNoOptions && $scope.currentItemBeingAddedIsNew) {
                    //$scope.currentItemBeingOrdered.specificItem has the
                    // 'FinalPrice' property attached to it
                    $scope.menuItems[a].itemsAddedToBasket.push({'quantity': 1, 'specificItem': $scope.currentItemBeingOrdered.specificItem});
                }
                else if (!itemAlreadyInBasket && !itemHasNoOptions && !$scope.currentItemBeingAddedIsNew) {
                    itemIsAnEditButNewItemNotInBasket = true;
                }
                
                if (!itemHasNoOptions && !$scope.currentItemBeingAddedIsNew) {
                    //Check if this is an item change, and if so, then remove the old item that it used to be
                    var indexToRemove = null;
                    for (d = 0; d < $scope.menuItems[a].itemsAddedToBasket.length; d++) {
                        indexToRemove = ($scope.menuItems[a].itemsAddedToBasket[d].isBeingEdited) ? d: indexToRemove;
                    }
                    if (indexToRemove != null && !itemIsAnEditButNewItemNotInBasket) {
                        $scope.menuItems[a].itemsAddedToBasket.splice(indexToRemove, 1);
                    }
                }
            }
            
            function loopThroughSpecificItems (a, b, c, itemAlreadyInBasket, itemIsAnEditButNewItemNotInBasket, specItemMatchCounter) {
                var addQuantityToSpecificItem = function () {
                    itemAlreadyInBasket = true;
                    if ($scope.currentItemBeingAddedIsNew) {
                        $scope.menuItems[a].itemsAddedToBasket[b].quantity += 1;
                    } else {
                        $scope.menuItems[a].itemsAddedToBasket[b].quantity += $scope.currentItemBeingOrderedQuantity;
                    }
                }
                
                var objectMatchBool = specificItemsObjectMatch($scope.menuItems[a].itemsAddedToBasket[b].specificItem[c], $scope.currentItemBeingOrdered.specificItem[c]);
                
                if (objectMatchBool && !$scope.menuItems[a].itemsAddedToBasket[b].isBeingEdited) {
                    specItemMatchCounter += 1;
                }
                
                if (specItemMatchCounter == $scope.menuItems[a].itemsAddedToBasket[b].specificItem.length) {
                    addQuantityToSpecificItem();
                }
                
                if (c == $scope.menuItems[a].itemsAddedToBasket[b].specificItem.length - 1 && b < $scope.menuItems[a].itemsAddedToBasket.length - 1) {
                    loopItemsAddedToBasket(a, b + 1, itemAlreadyInBasket, itemIsAnEditButNewItemNotInBasket);
                }
                else if (c == $scope.menuItems[a].itemsAddedToBasket[b].specificItem.length - 1 && b == $scope.menuItems[a].itemsAddedToBasket.length - 1) {
                    completeAddingItemIntoBasket(a, b, itemAlreadyInBasket, itemIsAnEditButNewItemNotInBasket);
                }
                else if (c < $scope.menuItems[a].itemsAddedToBasket[b].specificItem.length - 1){
                    loopThroughSpecificItems(a, b, c + 1, itemAlreadyInBasket, itemIsAnEditButNewItemNotInBasket, specItemMatchCounter);
                }
            }
            
            function loopItemsAddedToBasket (a, b, itemAlreadyInBasket, itemIsAnEditButNewItemNotInBasket) {
                if ($scope.menuItems[a].itemsAddedToBasket[b].specificItem.length == 0 && itemHasNoOptions) {
                    //item already been ordered and has no options
                    $scope.menuItems[a].itemsAddedToBasket[b].quantity += 1;
                    itemAlreadyInBasket = true;
                    
                    completeAddingItemIntoBasket(a, b, itemAlreadyInBasket, itemIsAnEditButNewItemNotInBasket);
                }
                else if (!itemHasNoOptions) {
                    if ($scope.menuItems[a].itemsAddedToBasket[b].specificItem.length == $scope.currentItemBeingOrdered.specificItem.length) {
                        loopThroughSpecificItems(a, b, 0, itemAlreadyInBasket, itemIsAnEditButNewItemNotInBasket, 0);
                    } else {
                        if (b < $scope.menuItems[a].itemsAddedToBasket.length) {
                            loopItemsAddedToBasket(a, b + 1, itemAlreadyInBasket, itemIsAnEditButNewItemNotInBasket);
                        }
                        else {
                            completeAddingItemIntoBasket(a, b, itemAlreadyInBasket, itemIsAnEditButNewItemNotInBasket)
                        }
                    }
                    
                    //console.log("ORDERS", $rootScope.currentSavedFoodOrders[0]);
                    
                }
            }
            
            function loopMenuItems (a, itemAlreadyInBasket, itemIsAnEditButNewItemNotInBasket) {
                if ($scope.menuItems[a]._id == $scope.currentItemBeingOrdered._id) {
                    $scope.menuItems[a].itemsAddedToBasket = $scope.menuItems[a].itemsAddedToBasket || [];
                    
                    if ($scope.menuItems[a].itemsAddedToBasket.length > 0) {
                        loopItemsAddedToBasket(a, 0, itemAlreadyInBasket, itemIsAnEditButNewItemNotInBasket);
                    } else {
                        completeAddingItemIntoBasket(a, 0, itemAlreadyInBasket, itemIsAnEditButNewItemNotInBasket);
                    }
                } else {
                    if (a < $scope.menuItems.length) {
                        loopMenuItems(a + 1);
                    }
                }
            }
            
            loopMenuItems(0, false, false);
            
            window.setTimeout(function () {
                //process the optionChoices array and remove unselected option choices
                for (a = 0; a < $scope.currentItemBeingOrdered.specificItem.length; a++) {
                    $scope.currentItemBeingOrdered.specificItem[a].optionChoices = null;
                }
                
                $scope.currentExtraOptions = [];
                $scope.currentExtraOptionsStage = 1;
            }, 300);
            
            $rootScope.$broadcast('menuItem-order-changed');
            $rootScope.finalMenuOrderObjCleanse($scope);
            console.log($rootScope.currentSavedFoodOrders);
            console.log($scope.menuItems);
            $scope.currentItemBeingOrdered.isBeingEdited = false;
        }
        
        $scope.addMenuItemToOrder = function (item) {
            $scope.currentItemBeingAddedIsNew = true;
            $scope.currentItemBeingOrdered = item;
            if (item._menuExtraOptionId == null) {
                $scope.currentItemBeingOrdered.optionChoices = [];
                $scope.currentItemBeingOrdered.finalPrice = item.Price;
                $scope.currentExtraOptionsComplete = true;
                $scope.completeAddingItemToOrder();
            }
            else {
                $rootScope.appLoading = true;
                $scope.currentExtraOptions = [];
                $scope.currentExtraOptionsStage = 1;
                $scope.currentExtraOptionsComplete = false;
                $scope.currentExtraOptionsPrice = item.Price;
                MenuItems.getMenuItemsExtraOptions($stateParams._businessId, item._id).success(function (successData) {
                    var menuExtraOptionsProcessed = [];
                    console.log(successData);
                    for (a = 0; a < successData.length; a++) {
                        if (menuExtraOptionsProcessed.indexOf(successData[a]._menuExtraOptionId) == -1) {
                            $scope.currentExtraOptions.push({
                                'index': $scope.currentExtraOptions.length,
                                '_id': successData[a]._menuExtraOptionId,
                                'name': successData[a].menuExtraOptionName,
                                'extraChargeIsPerUnit': (successData[a].extraChargeIsPerUnit == '1') ? true: false,
                                'type': successData[a].Type,
                                'priceRelevant': (successData[a].PriceRelevant == '1') ? true: false,
                                'quantityRelevant': (successData[a].QuantityRelevant == '1') ? true: false,
                                'selected': false,
                                'preselected': false,
                                'optionChoices': [{
                                    '_id': successData[a]._id,
                                    'name': successData[a].Name,
                                    'extraPrice': (successData[a].ExtraPrice == null) ? null : (parseFloat(successData[a].ExtraPrice)).formatMoney(2),
                                    'totalExtraPrice': (successData[a].totalExtraPrice == null) ? null: (parseFloat(successData[a].totalExtraPrice)).formatMoney(2),
                                    'selected': false,
                                    'preselected': false
                                }]
                            });
                            menuExtraOptionsProcessed.push(successData[a]._menuExtraOptionId);
                        }
                        else {
                            for (b = 0; b < $scope.currentExtraOptions.length; b++) {
                                if ($scope.currentExtraOptions[b]._id == successData[a]._menuExtraOptionId) {
                                    $scope.currentExtraOptions[b].optionChoices.push({
                                        '_id': successData[a]._id,
                                        'name': successData[a].Name,
                                        'extraPrice': (successData[a].ExtraPrice == null) ? null: (parseFloat(successData[a].ExtraPrice)).formatMoney(2),
                                        'totalExtraPrice': (successData[a].totalExtraPrice == null) ? null : (parseFloat(successData[a].totalExtraPrice)).formatMoney(2),
                                        'selected': false,
                                        'preselected': false
                                    });
                                }
                            }
                        }
                        
                        if (a == successData.length - 1) {
                            $rootScope.appLoading = false;
                        }
                    }
                    
                    $scope.showExtraOptions = true;
                }).error(function () {
                
                });
            }
        };
        
        $scope.changeMenuItemOptions = function (menuItem, item) {
            $rootScope.appLoading = true;
            
            $scope.currentItemBeingAddedIsNew = false;
            $scope.currentExtraOptionsPrice = parseFloat(item.specificItem[item.specificItem.length - 1].finalPrice);
            $scope.currentExtraOptionsPrice  = ($scope.currentExtraOptionsPrice).formatMoney(2);
            
            item.isBeingEdited = true;
            $scope.currentItemBeingOrdered = item;
            $scope.currentItemBeingOrdered._id = menuItem._id;
            $scope.currentExtraOptions = [];
            $scope.currentExtraOptionsComplete = false;
            
            MenuItems.getMenuItemsExtraOptions($stateParams._businessId, menuItem._id).success(function (successData) {
                var menuExtraOptionsProcessed = [];
                for (a = 0; a < successData.length; a++) {
                    if (menuExtraOptionsProcessed.indexOf(successData[a]._menuExtraOptionId) == -1) {
                        var optionsIndex = $scope.currentExtraOptions.length;
                        var selectedVal = false;
                        if (isArray(item.specificItem[optionsIndex].chosenOption)) {
                            for (z = 0; z < item.specificItem[optionsIndex].chosenOption.length; z++) {
                                selectedVal = (item.specificItem[optionsIndex].chosenOption[z]._id == successData[a]._id) ? true: selectedVal;
                            }
                        }
                        else {
                            selectedVal = (item.specificItem[optionsIndex].chosenOption._id == successData[a]._id) ? true : selectedVal;
                        }
                        $scope.currentExtraOptions.push({
                            'index': optionsIndex,
                            '_id': successData[a]._menuExtraOptionId,
                            'name': successData[a].menuExtraOptionName,
                            'extraChargeIsPerUnit': (successData[a].extraChargeIsPerUnit == '1') ? true: false,
                            'type': successData[a].Type,
                            'priceRelevant': (successData[a].PriceRelevant == '1') ? true: false,
                            'quantityRelevant': (successData[a].QuantityRelevant == '1') ? true: false,
                            'selected': true,
                            'preselected': true,
                            'optionChoices': [{
                                '_id': successData[a]._id,
                                'name': successData[a].Name,
                                'extraPrice': (successData[a].ExtraPrice == null) ? null : (parseFloat(successData[a].ExtraPrice)).formatMoney(2),
                                'totalExtraPrice': (successData[a].totalExtraPrice == null) ? null: (parseFloat(successData[a].totalExtraPrice)).formatMoney(2),
                                'selected': selectedVal,
                                'preselected': selectedVal
                            }],
                            'chosenOption': item.specificItem[optionsIndex].chosenOption
                        });
                        menuExtraOptionsProcessed.push(successData[a]._menuExtraOptionId);
                    }
                    else {
                        for (b = 0; b < $scope.currentExtraOptions.length; b++) {
                            if ($scope.currentExtraOptions[b]._id == successData[a]._menuExtraOptionId) {
                                var selectedVal = false;
                                if (isArray(item.specificItem[b].chosenOption)) {
                                    for (z = 0; z < item.specificItem[b].chosenOption.length; z++) {
                                        selectedVal = (item.specificItem[b].chosenOption[z]._id == successData[a]._id) ? true: selectedVal;
                                    }
                                }
                                else {
                                    selectedVal = (item.specificItem[b].chosenOption._id == successData[a]._id) ? true : selectedVal;
                                }
                                
                                $scope.currentExtraOptions[b].optionChoices.push({
                                    '_id': successData[a]._id,
                                    'name': successData[a].Name,
                                    'extraPrice': (successData[a].ExtraPrice == null) ? null: (parseFloat(successData[a].ExtraPrice)).formatMoney(2),
                                    'totalExtraPrice': (successData[a].totalExtraPrice == null) ? null : (parseFloat(successData[a].totalExtraPrice)).formatMoney(2),
                                    'selected': selectedVal,
                                    'preselected': selectedVal
                                });
                            }
                        }
                    }
                    
                    if (a == successData.length - 1) {
                        $scope.currentExtraOptionsComplete = true;
                        $rootScope.appLoading = false;
                    }
                }
                
                $scope.showExtraOptions = true;
            }).error(function () {
            
            });
        }
        
        $scope.addItemOrConfirm = function (menuItem, item) {
        
            if (item.showMenuItemOptions && item.menuItemOptions == "Add") {
                item.quantity += 1;
                item.showMenuItemOptions = false;
                item.menuItemOptions = "none";
                $rootScope.$broadcast('menuItem-order-changed');
                $rootScope.finalMenuOrderObjCleanse($scope);
            }
            else if (item.showMenuItemOptions && item.menuItemOptions == "Delete") {
                $scope.deleteMenuItem(menuItem, item);
                item.showMenuItemOptions = false;
                item.menuItemOptions = "none";
                $rootScope.$broadcast('menuItem-order-changed');
                $rootScope.finalMenuOrderObjCleanse($scope);
            }
            else {
                item.showMenuItemOptions = true;
                item.menuItemOptions = "Add";
            }
        };
        $scope.deleteItemOrCancel = function (menuItem, item) {
            if (item.showMenuItemOptions) {
                item.showMenuItemOptions = false;
                item.menuItemOptions = "none";
            }
            else {
                item.showMenuItemOptions = true;
                item.menuItemOptions = "Delete";
            }
        };
        $scope.closeExtraOptions = function () {
            $scope.showExtraOptions = false;
            $scope.currentExtraOptions = [];
            $scope.currentExtraOptionsStage = 1;
        }
        
        $scope.selectOptionNext = function (option) {
            option.preselected = !option.preselected;
            $scope.currentExtraOptionsStage += 1;
        }
        
        $scope.selectOptionChoice = function (option, optionChoice) {
            if (optionChoice == null) {
                option.preselected = false;
                return false;
            }
            
            if (option.type == 'Only One') {
                optionChoice.preselected = !optionChoice.preselected;
                option.preselected = !option.preselected;
                $scope.currentExtraOptionsChosenOption = option;
                
                if (option.preselected) {
                    var allSelected = true;
                    for (a = 0; a < option.optionChoices.length; a++) {
                        if (!option.preselected) {
                            allSelected = false;
                        }
                    }
                    if (allSelected) {
                        $scope.currentExtraOptionsComplete = true;
                    }
                }
                else {
                    $scope.currentExtraOptionsComplete = false;
                }
                
                $scope.currentExtraOptionsStage += 1;
            }
            else if (option.type == 'Multi') {
                optionChoice.preselected = !optionChoice.preselected;
                $scope.currentExtraOptionsChosenOption = option;
            }
            
            if (option.priceRelevant
                && typeof(optionChoice.extraPrice) !== 'undefined'
                && optionChoice.extraPrice != null
                && option.preselected) {
                    $scope.currentExtraOptionsPrice = parseFloat($scope.currentExtraOptionsPrice) + parseFloat(optionChoice.extraPrice);
                    $scope.currentExtraOptionsPrice = ($scope.currentExtraOptionsPrice).formatMoney(2);
                }
            else if (option.priceRelevant
                && typeof(optionChoice.extraPrice) !== 'undefined'
                && optionChoice.extraPrice != null
                && !option.preselected) {
                    $scope.currentExtraOptionsPrice = parseFloat($scope.currentExtraOptionsPrice) - parseFloat(optionChoice.extraPrice);
                    $scope.currentExtraOptionsPrice = ($scope.currentExtraOptionsPrice).formatMoney(2);
            }
        }
    }])
    // See Business Menu Items//
    app.controller('SeeBusinessMenuItemsCtrl', ['$ionicHistory', '$rootScope', '$state','$scope', '$stateParams', 'MenuItems', function($ionicHistory, $rootScope, $state, $scope, $stateParams, MenuItems) {
        // Set Up Variables
        $scope.$on('$ionicView.enter', function() {
            $rootScope.currentTopRightState = 'app.addBusinessItem';
            $rootScope.topRightButtonFunction = function () {
                var menuType = ($stateParams._menuTypeId == 1) ? 'BusinessTakeawayMenuItemCats': 'BusinessCarteMenuItemCats';
                $state.go('app.addBusinessItem', {'itemType': menuType, '_secondaryItemTypeId': $stateParams._menuItemCategoryId});
            };
        })
        
        $scope.rootScope = $rootScope;
        $scope.itemType = 'OwnMenuItems';
        $scope.nextPageFunction = function (menuItem) {
            $state.go('app.businessItem', {'_id': menuItem._id, 'itemType': $scope.itemType});
        }
        
        $scope.showExtraOptions = false;
        $scope.currentExtraOptions = [];
        $scope.currentExtraOptionsStage = 1;
        $scope.currentExtraOptionsComplete = false;
        
        //Prepare Page Load Data
        $scope.getMenuItems = function () {
            $scope.menuItems = [];
            $scope.normalMenuItems = [];
            $scope.categorizedMenuItems = [];
            $scope.menuItemsAdded = [];
            
            MenuItems.getMenuItems($stateParams._businessId, $stateParams._menuItemCategoryId, $stateParams._menuTypeId).success(function (successData) {
                if (successData == 'null') {
                    console.log('getMenuItems in SeeBusinessMenuItems results: ', successData);
                    return false;
                }
                $scope.menuItemCategoryName = successData[0].menuItemCategoryName;
                for (a = 0; a < successData.length; a++) {
                    var tagsObj = {'tagName':successData[a].tagName, 'iconClass':successData[a].iconClass};
                    if ($scope.menuItemsAdded.indexOf(successData[a]._id) == -1) {
                        successData[a].tags = [tagsObj];
                        
                        //Check the rootScope order object to add already ordered items into this object
                        $rootScope.currentSavedFoodOrders = $rootScope.currentSavedFoodOrders || [];
                        for (b = 0; b < $rootScope.currentSavedFoodOrders.length; b++) {
                            if ($rootScope.currentSavedFoodOrders[b]._businessId == $stateParams._businessId) {
                                var thisTakeawaysOrderObject = $rootScope.currentSavedFoodOrders[b];
                                
                                newOrder = false;
                                var itemExistsInOrder = false;
                                for (c = 0; c < thisTakeawaysOrderObject.menuItems.length; c++) {
                                    if (thisTakeawaysOrderObject.menuItems[c].item._id == successData[a]._id) {
                                        successData[a].itemsAddedToBasket = thisTakeawaysOrderObject.menuItems[c].item.itemsAddedToBasket;
                                    }
                                }
                            }
                        }
                    
                        $scope.menuItems.push(successData[a]);
                        $scope.menuItemsAdded.push(successData[a]._id);
                    }
                    else {
                        for (b = 0; b < $scope.menuItems.length; b++) {
                            if ($scope.menuItems[b]._id == successData[a]._id) {
                                $scope.menuItems[b].tags.push(tagsObj);
                            }
                        }
                    }
                }

                for (a = 0; a < $scope.menuItems.length; a++) {
                    if ($scope.menuItems[a].menuItemSubCategoryName != null) {
                        var existingArrayFound = false;
                        for (b = 0; b < $scope.categorizedMenuItems.length; b++) {
                            if ($scope.categorizedMenuItems[b].subCatName == $scope.menuItems[a].menuItemSubCategoryName) {
                                $scope.categorizedMenuItems[b].items.push($scope.menuItems[a]);
                                existingArrayFound = true;
                            }
                        }
                        if (!existingArrayFound) {
                            $scope.categorizedMenuItems.push({subCatName: successData[a].menuItemSubCategoryName, items: [$scope.menuItems[a]]});
                        }
                    } else {
                        $scope.normalMenuItems.push($scope.menuItems[a]);
                    }
                }
                console.log("po", $scope.normalMenuItems);
                console.log("po", $scope.categorizedMenuItems);
            }).error(function () {
            
            });
        }
        
        $scope.getMenuItems();
        
        $rootScope.$on('menu-items-changed', function(event, args) {
            $scope.getMenuItems();
        })
        
    }])
    // See Menu Summary//
    app.controller('CompleteTakeawayOrderCtrl', ['$ionicHistory', '$rootScope', '$state','$scope', '$stateParams', 'MenuItems', function($ionicHistory, $rootScope, $state, $scope, $stateParams, MenuItems) {
        // Set Up Variables
        $scope.rootScope = $rootScope;
        $scope._businessId = $stateParams._businessId;
        $scope.showEnterAddressPanel = false;
        $scope.menuItemsOrdered = [];
        
        //Prepare Page Load Data
        //Check the rootScope order object to add already ordered items into this object
        $rootScope.currentSavedFoodOrders = $rootScope.currentSavedFoodOrders || [];
        for (b = 0; b < $rootScope.currentSavedFoodOrders.length; b++) {
            if ($rootScope.currentSavedFoodOrders[b]._businessId == $stateParams._businessId) {
                $scope.currentTakeawaysOrderObject = $rootScope.currentSavedFoodOrders[b];
                
                for (c = 0; c < $rootScope.currentSavedFoodOrders[b].menuItems.length; c++) {
                    if ($rootScope.currentSavedFoodOrders[b].menuItems[c].item.specificItem.length > 0) {
                        $rootScope.currentSavedFoodOrders[b].menuItems[c].quantity = 0;
                        $rootScope.currentSavedFoodOrders[b].menuItems[c].item.finalPrice = 0;
                        for (d = 0; d < $rootScope.currentSavedFoodOrders[b].menuItems[c].item.itemsAddedToBasket.length; d++) {
                            $rootScope.currentSavedFoodOrders[b].menuItems[c].quantity += $rootScope.currentSavedFoodOrders[b].menuItems[c].item.itemsAddedToBasket[d].quantity;
                            
                            var optionChoicesLength = $rootScope.currentSavedFoodOrders[b].menuItems[c].item.itemsAddedToBasket[d].specificItem.length;
                            $rootScope.currentSavedFoodOrders[b].menuItems[c].item.finalPrice += parseFloat($rootScope.currentSavedFoodOrders[b].menuItems[c].item.itemsAddedToBasket[d].specificItem[optionChoicesLength - 1].finalPrice) * $rootScope.currentSavedFoodOrders[b].menuItems[c].item.itemsAddedToBasket[d].quantity;
                            
                        }
                    }
                }
                for (c = 0; c < $rootScope.currentSavedFoodOrders[b].menuItems.length; c++) {
                    if ($rootScope.currentSavedFoodOrders[b].menuItems[c].quantity == 0) {
                        $rootScope.currentSavedFoodOrders[b].menuItems.splice(c, 1);
                    }
                }
                
                $scope.menuItemsOrdered = $rootScope.currentSavedFoodOrders[b].menuItems;
                
            }
        }
        
        
        // Complete order Functions //
        
        var completeOrder = function () {
            var _profileId = ($rootScope.userLoggedIn) ? $rootScope.user._id: null;
            MenuItems.createOrder(_profileId, $scope._businessId, $scope.currentTakeawaysOrderObject).success(function (successData) {
                $scope.showEnterPaymentDetailsPanel = false;
            }).error(function () {
            
            });
        };
        
        $scope.enterPaymentInfo = function (cardNumber, expiryDate, startDate, nameOnCard) {
            
            $scope.currentTakeawaysOrderObject.userObject.cardNumber = expiryDate;
            $scope.currentTakeawaysOrderObject.userObject.expiryDate = expiryDate;
            $scope.currentTakeawaysOrderObject.userObject.startDate = startDate;
            $scope.currentTakeawaysOrderObject.userObject.nameOnCard = nameOnCard;
            
            $scope.showEnterAddressPanel = false;
            completeOrder();
        }
        
        $scope.enterUserDetails = function (name, email, phone, addressLine1, addressLine2, postCode) {
            $scope.showEnterPaymentDetailsPanel = true;
            
            $scope.currentTakeawaysOrderObject.userObject = {};
            $scope.currentTakeawaysOrderObject.userObject.name = name;
            $scope.currentTakeawaysOrderObject.userObject.email = email;
            $scope.currentTakeawaysOrderObject.userObject.phone = phone;
            $scope.currentTakeawaysOrderObject.userObject.addressLine1 = addressLine1;
            $scope.currentTakeawaysOrderObject.userObject.addressLine2 = addressLine2;
            $scope.currentTakeawaysOrderObject.userObject.postCode = postCode;
        }
        
        $scope.submitOrder = function () {
            if ($rootScope.userLoggedIn) {
                completeOrder();
            } else {
                $scope.showEnterAddressPanel = true;
            }
        }
        
    }])
