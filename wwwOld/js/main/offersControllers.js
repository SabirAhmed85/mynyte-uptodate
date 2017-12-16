// Offers //
app.controller('OffersCtrl', ['$rootScope', '$state', '$stateParams', '$scope', 'Categories', 'Places', 'Offers', function($rootScope, $state, $stateParams, $scope, Categories, Places, Offers) {
	// Set Up Variables
    $scope.rootScope = $rootScope;
    $scope.currentSearchTown = null;
    $scope.showTownSelect = false;
    $scope.pageLoading = true;
    
    //Function to Sort Categories for Today and Future
    $scope.sortCategories = function () {
        var _userId = ($rootScope.userLoggedIn) ? $rootScope.user._profileId: 0;
        Offers.getOffersByTownId($rootScope.currentSearchTown._id, _userId).success(function (offers) {
            
            var todaysCategoryLabels = [];
            var futureCategoryLabels = [];
            var todaysCategories = [];
            var futureCategories = [];
            offers = offers || [];
            
            
            var loopThroughCats = function () {
                //Loop through Categories now and insert the offers into them
                //(by Looping through the offers again and seeing if they match)
                console.log(todaysCategoryLabels);
                console.log(futureCategoryLabels);
                var pageIsReady = function () {
                    if (todaysCategoriesFilled && futureCategoriesFilled) {
                        $scope.pageLoading = false;
                    }
                }
                var todaysCategoriesFilled = false;
                var futureCategoriesFilled = false;
                
                for (a = 0; a < todaysCategoryLabels.length; a++) {
                    todaysCategories[a] = []
                    todaysCategories[a].name = todaysCategoryLabels[a];
                    todaysCategories[a].offers = [];
                    
                    for (b = 0; b < offers.length; b++) {
                        var stringToCheck = offers[b].offerSubCategoryName;
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
                offers[z].startDateTimeString = $rootScope.convertToDate($scope, new Date(offers[z].startDateTime.split(' ')[0] ) );
                offers[z].endDateTimeString = $rootScope.convertToDate($scope, new Date(offers[z].endDateTime.split(' ')[0] ) );
                
                if (z == offers.length - 1) {
                    loopThroughCats();
                }
            }
            
            console.log(offers);
        }).error(function () {
            $scope.sortCategories();
        });
    }
    
    $scope.sortCategories();

    /*--- */
    $scope.goToOffer = function (offer) {
        $state.go('app.offerDetail', {_id: offer._id});
    }

    $scope.pinListingToMsg = function (listing, $event) {
        $rootScope.pinListingToMessage($event, listing, listing.listingType, null, $scope);
    }
}])
app.controller('OfferDetailCtrl', ['$rootScope', '$state', '$stateParams', '$scope', 'Categories', 'Places', 'Offers', 'Messages', function($rootScope, $state, $stateParams, $scope, Categories, Places, Offers, Messages) {
    // Set Up Variables
    $scope.rootScope = $rootScope;
    $scope.currentSearchTown = null;
    $scope.showTownSelect = false;
    $scope._id = $stateParams._id;
    
    //Function to Sort Categories for Today and Future
    $scope.getOffer = function () {
        var _userId = ($rootScope.userLoggedIn) ? $rootScope.user._profileId: 0;
        Offers.getOffer($scope._id, _userId).success(function (offer) {
            $scope.offer = offer[0];
            $scope.offer.startDateTimeString = $rootScope.convertToDate($scope, new Date($scope.offer.startDateTime.split(' ')[0]));
            $scope.offer.endDateTimeString = $rootScope.convertToDate($scope, new Date($scope.offer.endDateTime.split(' ')[0]));
            $rootScope.pageTitle = $scope.offer.title;
            console.log($scope.offer);
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
            $rootScope.relListing.relListingType = relListing.listingType;
            $rootScope.relListing.relListingTypeAlias = "Offer";
            $rootScope.relListing.relListingSpecItemId = relListing.relListingId;
            var groupType = 'Business';
            var timer = window.setTimeout(function () {$state.go('app.messageGroups', {'relListing': null, 'groupType': groupType});}, 60);
            var timer2 = window.setTimeout(function () {
                Messages.checkIfMessageGroupExists([$rootScope.user._profileId, $scope.offer._profileId]).success(function (successData) {
                    console.log("dat", successData);
                    if (successData == null) {
                        $state.go('app.messageGroup', {'_id': null, 'relListing': null, '_profileIds': [$rootScope.user._profileId, $scope.offer._profileId], 'groupType': groupType});
                    } else {
                        $state.go('app.messageGroup', {'_id': successData[0]._id, 'relListing': null, '_profileIds': [], 'groupType': groupType});
                    }
                }).error(function () {


                });
            }, 230);
        } else if (!$rootScope.userLoggedIn) {
            //Pop up -- you can only message people when logged in
            $rootScope.showPopUp($scope, 'Enquiry');
        }
    }
}])
