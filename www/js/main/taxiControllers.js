// Taxi //
app.controller('TaxiCtrl', ['$rootScope', '$state','$scope', '$ionicPopup', '$ionicConfig', 'Places', 'Taxi', '$timeout', '$ionicScrollDelegate', function($rootScope, $state, $scope, $ionicPopup, $ionicConfig, Places, Taxi, $timeout, $ionicScrollDelegate) {
	// Set Up Variables & Constants
    $rootScope.hideSearch = true;
    $scope.ionicScrollDelegate = $ionicScrollDelegate;
    $scope.rootScope = $rootScope;
    $scope.currentTotalPassengers = 0;
    $scope.quickestIsRequired = 0;
    $scope.pickUpManuallyEntered = false;
    $scope.dropOffManuallyEntered = false;
    $scope.lookedUpPickUpLocation = null;
    $scope.lookedUpDropOffLocation = null;
    
    $scope.pageLoad = function () {
        
        $scope.bookTaxi = function (state) {
            
            if (!$rootScope.userLoggedIn || ($rootScope.appLoading && state != "subsequent") || $('input#pickup-input').val() == '' || $('input#dropoff-input').val() == '' || $scope.currentTotalPassengers == 0) {return false};
            
            if (
                ($rootScope.user.phone1 == '' || $rootScope.user.phone1 == null)
                && ($rootScope.user.phone2 == '' || $rootScope.user.phone2 == null)
            ) {
                $ionicPopup.show({
                    title: 'No Phone Number',
                    template: '<i class="ion-ios-telephone main-icon"></i><p>You cannot request a Taxi Booking unless you have a Phone Number associated with your account. Please register your Phone Number to proceed.</p>',
                    //subTitle: 'Are you sure you want to Delete this item?',
                    scope: $scope,
                    buttons: [
                        { 
                            text: 'Close',
                            onTap: function(e) {
                            } 
                        },
                        { 
                            text: 'Enter No.',
                            type: 'button-positive',
                            onTap: function(e) {
                                $state.go('app.profile');
                                $timeout(function () {
                                    $state.go('app.accountSettings', {settingsType: 'Profile'});
                                }, 50);
                            } 
                        }
                    ]
                });
                return false;
            }
            $rootScope.appLoading = true;
            var relContactName = null;
            var relContactEmail = null;
            var _relContactId = null;
            
            $scope._pickUpPlaceId = $('input#pickup-placeId').val();
            $scope.lookedUpPickUpLocation = $('input#pickup-input').val();
            $scope.pickUpAddressLine1 = $('input#pickup-address-line-1').val();
            $scope.pickUpTown = $('input#pickup-town').val();
            $scope.pickUpPostCode = $('input#pickup-postcode').val();
            
            $scope._dropOffPlaceId = $('input#dropoff-placeId').val();
            $scope.lookedUpDropOffLocation = $('input#dropoff-input').val();
            $scope.dropOffAddressLine1 = $('input#dropoff-address-line-1').val();
            $scope.dropOffTown = $('input#dropoff-town').val();
            $scope.dropOffPostCode = $('input#dropoff-postcode').val();
            
            $rootScope.debugModeLog({'msg': 'TaxiCtrl bookTaxi paramsPassed', 'data': {
                'pickUpPlaceId': $scope._pickUpPlaceId,
                'lookedUpPickUpLocation': $scope.lookedUpPickUpLocation,
                'pickUpAddressLine1': $scope.pickUpAddressLine1,
                'pickUpTown': $scope.pickUpTown,
                'pickUpPostCode': $scope.pickUpPostCode,
                '_dropOffPlaceId': $scope._dropOffPlaceId,
                'lookedUpDropOffLocation': $scope.lookedUpDropOffLocation,
                'dropOffAddressLine1': $scope.dropOffAddressLine1,
                'dropOffTown': $scope.dropOffTown,
                'dropOffPostCode': $scope.dropOffPostCode,
                'currentTotalPassengers': $scope.currentTotalPassengers,
                'quickestIsRequired': $scope.quickestIsRequired,
                '$rootScope.user._id': $rootScope.user._id
            }});
            
            Taxi.bookTaxi($scope._pickUpPlaceId, $scope.lookedUpPickUpLocation, $scope.pickUpAddressLine1, $scope.pickUpTown, $scope.pickUpPostCode, $scope._dropOffPlaceId, $scope.lookedUpDropOffLocation, $scope.dropOffAddressLine1, $scope.dropOffTown, $scope.dropOffPostCode, $scope.currentTotalPassengers, $scope.quickestIsRequired, relContactName, relContactEmail, $rootScope.user._id).success(function (successData) {
                $rootScope.debugModeLog({'msg': 'TaxiCtrl bookTaxi successData', 'data': successData});
                
                if (successData != null && successData != 'null') {
                    var contents = "New Taxi Booking Request received.";
                    var header = "Taxi Booking Requested";
                    var dataObj = {
                        "actionFunction": "goToBusinessItem",
                        "businessItemType": "RequestedTaxiBookings",
                        "_businessItemId": successData[0]._taxiBookingId
                    };
                    
                    var recipientsArray = [];
                    
                    for (a = 0; a < successData.length; a++) {
                        recipientsArray.push(successData[a]._profileId);
                        if (a == successData.length - 1) {
                            $rootScope.prepareMessageNotificationFinal(recipientsArray, contents, header, dataObj);
                        }
                    }
                    
                    $rootScope.appLoading = false;
                    
                    $scope.lookedUpPickUpLocation = null;
                    $scope.lookedUpDropOffLocation = null;
                    $scope.pickUpManuallyEntered = false;
                    $scope.dropOffManuallyEntered = false;
                    
                    $scope.currentTotalPassengers = 0;
                    $('input#pickup-placeId').val("");
                    $('input#pickup-input').val("");
                    $('input#pickup-address-line-1').val("");
                    $('input#pickup-town').val("");
                    $('input#pickup-postcode').val("");
                    $('input#dropoff-placeId').val("");
                    $('input#dropoff-input').val("");
                    $('input#dropoff-address-line-1').val("");
                    $('input#dropoff-town').val("");
                    $('input#dropoff-postcode').val("");
                    $('.taxi-form-hidden').removeClass("show");
                    
                    $ionicPopup.show({
                        title: 'Taxi Booking Requested',
                        template: '<i class="ion-checkmark main-icon"></i><p>Your Taxi Booking has been requested. We\'ll update you once the taxi firms have responded.</p>',
                        //subTitle: 'Are you sure you want to Delete this item?',
                        scope: $scope,
                        buttons: [
                            { 
                                text: 'Close',
                                onTap: function(e) {
                                } 
                            }
                        ]
                    });
                }
                else {
                    $ionicPopup.show({
                        title: 'An Error Occured',
                        template: '<i class="ion-close main-icon"></i><p>Your Taxi Booking could not be processed. Please try again later.</p>',
                        //subTitle: 'Are you sure you want to Delete this item?',
                        scope: $scope,
                        buttons: [
                            { 
                                text: 'Close',
                                onTap: function(e) {
                                } 
                            }
                        ]
                    });
                }
            }).error(function () {
                $scope.bookTaxi("subsequent");
            });
        };
        
        //Events Triggers by User
        $scope.updateTotalPassengers = function (val) {
            $scope.currentTotalPassengers = ( ($scope.currentTotalPassengers < 2 && val == -1) || ($scope.currentTotalPassengers == 99 && val == 1) ) ? $scope.currentTotalPassengers: $scope.currentTotalPassengers += val;
        }
        
        $scope.arrangeInputs = function (data) {
            var postCodeRegex = /^[A-Z]{1,2}[0-9]{1,2} ?[0-9][A-Z]{2}$/i;
                                        
            var postCodeTest = postCodeRegex.test(innerH);
            var townArray = ['Bedford', 'Luton', 'Northampton', 'Milton Keynes'];
            var townTest = townArray.indexOf(innerH) == -1;
            
            if (postCodeTest) {
                o[objIndex].description += ', ' + innerH;
            }
            else if (townTest) {
                town = innerH;
            }
            
            
        }
        
        $rootScope.$on('no-taxi-search-results', function (event, data) {
            if (data.inputType == "pickup-input") {
                $scope.pickUpManuallyEntered = true;
            }
            else if (data.inputType == "dropoff-input") {
                $scope.dropOffManuallyEntered = true;
            }
        });
        
        $rootScope.$on('taxi-search-results', function (event, data) {
            if (data.inputType == "pickup-input") {
                $scope.pickUpManuallyEntered = false;
            }
            else if (data.inputType == "dropoff-input") {
                $scope.dropOffManuallyEntered = false;
            }
        });
    }
    
    $rootScope.checkForAppInit($scope);
        
    this.updateTaxiType = function (data) {
        $scope.quickestIsRequired = data;
    }
}])
