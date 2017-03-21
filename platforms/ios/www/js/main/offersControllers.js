// Offers //
app.controller('OffersCtrl', ['$rootScope', '$state', '$stateParams', '$scope', '$ionicConfig', '$ionicScrollDelegate', 'Categories', 'Places', 'Offers', 'datesService', '$timeout', function($rootScope, $state, $stateParams, $scope, $ionicConfig, $ionicScrollDelegate, Categories, Places, Offers, datesService, $timeout) {
	// Set Up Variables
    $scope.rootScope = $rootScope;
    $scope.currentSearchTown = null;
    $scope.showTownSelect = false;
    $scope.pageLoading = true;
    $scope.windowWidth = window.innerWidth;
    
    //Function to Sort Categories for Today and Future
    $scope.pageLoad = function () {
        $scope.sortCategories = function () {
            var _userId = ($rootScope.userLoggedIn) ? $rootScope.user._profileId: 0;
            Offers.getOffersByTownId($rootScope.currentSearchTown._id, _userId, 'present').success(function (offers) {
                $rootScope.debugModeLog({'msg': 'OffersCtrl getOffersByTownId successData', 'data': offers});
                
                var todaysCategoryLabels = [];
                var futureCategoryLabels = [];
                var todaysCategories = [];
                var futureCategories = [];
                offers = offers || [];
                $scope.offers = offers;
                
                
                var loopThroughCats = function () {
                    //Loop through Categories now and insert the offers into them
                    //(by Looping through the offers again and seeing if they match)
                    var pageIsReady = function () {
                        if (todaysCategoriesFilled && futureCategoriesFilled) {
                            $scope.pageLoading = false;
                        }
                    }
                    var todaysCategoriesFilled = false;
                    var futureCategoriesFilled = false;
                    
                    if (todaysCategoryLabels.length == 0) {
                        todaysCategoriesFilled = true;
                        pageIsReady();
                    } else {
                        for (a = 0; a < todaysCategoryLabels.length; a++) {
                            todaysCategories[a] = []
                            todaysCategories[a].name = todaysCategoryLabels[a];
                            todaysCategories[a].offers = [];
                            
                            for (b = 0; b < offers.length; b++) {
                                var stringToCheck = offers[b].offerSubCategoryName;
                                if (offers[b].description.length > 110) {
                                    offers[b].description = offers[b].description.substr(0, 110) + '...';
                                }
                                if (offers[b].todayOrFuture == "today" && stringToCheck == todaysCategoryLabels[a]) {
                                    offers[b].index = todaysCategories[a].offers.length + 1;
                                    todaysCategories[a].offers.push(offers[b]);
                                }
                                if (b == offers.length - 1) {
                                    $scope.todaysCategories = todaysCategories;
                                    todaysCategoriesFilled = true;
                                    pageIsReady();
                                }
                            }
                        }
                    }
                    
                    if (futureCategoryLabels.length == 0) {
                        futureCategoriesFilled = true;
                        pageIsReady();
                    } else {
                        for (c = 0; c < futureCategoryLabels.length; c++) {
                            futureCategories[c] = []
                            futureCategories[c].name = futureCategoryLabels[c];
                            futureCategories[c].offers = [];
                            for (d = 0; d < offers.length; d++) {
                                var stringToCheck = offers[d].offerSubCategoryName;
                                if (offers[d].todayOrFuture == "future" && stringToCheck == futureCategoryLabels[c]) {
                                    offers[d].index = futureCategories[c].offers.length + 1;
                                    futureCategories[c].offers.push(offers[d]);
                                }
                                if (d == offers.length - 1) {
                                    $scope.futureCategories = futureCategories;
                                    futureCategoriesFilled = true;
                                    pageIsReady();
                                }
                            }
                        }
                    }
                }
                
                //Loop Through all offers and rceive relevant Cat names
                for (z = 0; z < offers.length; z++) {
                    var stringToCheck = offers[z].offerSubCategoryName;
                    if (offers[z].todayOrFuture == "today" && todaysCategoryLabels.indexOf(stringToCheck) == -1) {
                        todaysCategoryLabels.push(stringToCheck);
                        todaysCategories.showFull = false;
                    }
                    else if (offers[z].todayOrFuture == "future" && futureCategoryLabels.indexOf(stringToCheck) == -1) {
                        futureCategoryLabels.push(stringToCheck);
                        futureCategories.showFull = false;
                    }
                    offers[z].startDateTimeString = datesService.convertToDate($scope, new Date(offers[z].officialStartDate.split(' ')[0] ) );
                    offers[z].endDateTimeString = datesService.convertToDate($scope, new Date(offers[z].officialEndDate.split(' ')[0] ) );
                    
                    if (z == offers.length - 1) {
                        loopThroughCats();
                    }
                }
            }).error(function () {
                $scope.sortCategories();
            });
        }
        
        $scope.sortCategories();

        /*--- */
        $scope.toggleCategoryShow = function (category) {
            category.showFull = !category.showFull;
            $timeout(function () {$ionicScrollDelegate.resize();}, 500);
        }
        
        $scope.goToOffer = function (offer) {
            $state.go('app.offers.offerDetail', {_id: offer._id});
        }

        $scope.pinListingToMsg = function (listing, $event) {
            $rootScope.pinListingToMessage($event, listing, listing.listingType, null, $scope);
        }
    }
    
    $rootScope.checkForAppInit($scope);
    
    $rootScope.$on('interacted-with-feed-listing', function (event, args) {
        $rootScope.handleListingsToUpdateInteractions($scope.offers, args);
    });
}])
app.controller('OfferDetailCtrl', ['$rootScope', '$state', '$stateParams', '$scope', 'Categories', 'Places', 'Offers', 'Messages', '$ionicViewSwitcher', 'datesService', function($rootScope, $state, $stateParams, $scope, Categories, Places, Offers, Messages, $ionicViewSwitcher, datesService) {
    // Set Up Variables
    $scope.rootScope = $rootScope;
    $scope.currentSearchTown = null;
    $scope.showTownSelect = false;
    $scope._id = $stateParams._id;
    $scope.pageLoading = true;
    
    $scope.$on('$ionicView.beforeEnter', function() {
        $rootScope.pageTitle = ($scope.pageTitle) ? $scope.pageTitle: $rootScope.pageTitle;
    });
    
    $scope.pageLoad = function () {
        //Function to Sort Categories for Today and Future
        $scope.getOffer = function () {
            var _userId = ($rootScope.userLoggedIn) ? $rootScope.user._profileId: 0;
            Offers.getOffer($scope._id, _userId).success(function (offer) {
                $rootScope.debugModeLog({'msg': 'OfferDetailCtrl getOffer successData', 'data': offer});
                
                if (offer != null) {
                    $scope.offer = offer[0];
                    $scope.offer.startDateTimeString = datesService.convertToDate($scope, new Date($scope.offer.relevantStartDateTime.split(' ')[0]));
                    $scope.offer.endDateTimeString = datesService.convertToDate($scope, new Date($scope.offer.relevantEndDateTime.split(' ')[0]));
                    $rootScope.pageTitle = $scope.offer.title;
                    $scope.pageTitle = $rootScope.pageTitle;
                } else {
                    $rootScope.pageTitle = 'Invalid Offer';
                    $scope.pageTitle = $rootScope.pageTitle;
                }
                $scope.pageLoading = false;
            }).error(function () {
                $scope.getOffer();
            });
        }
        
        $scope.getOffer();
        
        //Events Triggers by User
        $scope.showOfferCat = function (category) {
            category.showFull = !category.showFull;
        }
        
        $scope.offerEnquire = function () {
            if ($rootScope.userLoggedIn
                && $rootScope.user.isBusiness == '0') {
                //Go to message Screen
                $state.go('app.profile');
                var relListing = $scope.offer;
                $rootScope.relListing = relListing;
                $rootScope.relListing.date = relListing.endDateTimeString;
                $rootScope.relListing.relListingType = relListing.listingType;
                $rootScope.relListing.relListingTypeAlias = "Offer";
                $rootScope.relListing.relListingSpecItemId = relListing.relListingId;
                var groupType = 'Business';
                var timer = window.setTimeout(function () {$state.go('app.profile.messageGroups', {'relListing': null, 'groupType': groupType});}, 60);
                var timer2 = window.setTimeout(function () {
                    Messages.checkIfMessageGroupExists([$rootScope.user._profileId, $scope.offer._profileId]).success(function (successData) {
                        if (successData == null) {
                            $state.go('app.profile.messageGroups.messageGroup', {'_id': null, 'relListing': null, '_profileIds': [$rootScope.user._profileId, $scope.offer._profileId], 'groupType': groupType, 'messageNameString': 'New Message to ' + $rootScope.relListing.businessName});
                        } else {
                            $state.go('app.profile.messageGroups.messageGroup', {'_id': successData[0]._id, 'relListing': null, '_profileIds': [], 'groupType': groupType, 'messageNameString': $rootScope.relListing.businessName});
                        }
                    }).error(function () {


                    });
                }, 230);
            } else if (!$rootScope.userLoggedIn) {
                //Pop up -- you can only message people when logged in
                $rootScope.showPopUp($scope, 'Enquiry');
            }
        }
    }
    
    $rootScope.checkForAppInit($scope);
}])
