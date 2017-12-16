// Taxi //
app.controller('TaxiCtrl', ['$rootScope', '$state','$scope', '$ionicPopup', 'Places', 'Taxi', function($rootScope, $state, $scope, $ionicPopup, Places, Taxi) {
	// Set Up Variables & Constants
    $rootScope.hideSearch = true;
    $scope.rootScope = $rootScope;
    $scope.currentTotalPassengers = 2;
    
    /* INitital Address Lookup Function that was used
    //Initial Functions to Set up Page
    var API_KEY = 'ak_ijni7l7ufWHUCJXsQrvYm8gU5tDiy';
    
    $('#address_lookup_field').setupPostcodeLookup({
      api_key: API_KEY,
      // Enable address search
      address_search: true,
      // Add a custom label
      input_label: "Search for a postcode or address",
      output_fields: {
        line_1: '#taxi-from',
        line_2: '#taxi-to'
        //,
        //line_3: '#third_line',
        //post_town: '#post_town',
        //postcode: '#postcode'
      }
    });
    
    */
    $scope.bookTaxi = function () {
        if (!$rootScope.userLoggedIn || $rootScope.appLoading || $('input#pickup-input').val() == '' || $('input#dropoff-input').val() == '') {return false};
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
        
        console.log($scope._pickUpPlaceId, $scope.lookedUpPickUpLocation, $scope.pickUpAddressLine1, $scope.pickUpTown, $scope.pickUpPostCode, $scope._dropOffPlaceId, $scope.lookedUpDropOffLocation, $scope.dropOffAddressLine1, $scope.dropOffTown, $scope.dropOffPostCode, $scope.currentTotalPassengers, relContactName, relContactEmail, _relContactId);
        
        Taxi.bookTaxi($scope._pickUpPlaceId, $scope.lookedUpPickUpLocation, $scope.pickUpAddressLine1, $scope.pickUpTown, $scope.pickUpPostCode, $scope._dropOffPlaceId, $scope.lookedUpDropOffLocation, $scope.dropOffAddressLine1, $scope.dropOffTown, $scope.dropOffPostCode, $scope.currentTotalPassengers, relContactName, relContactEmail, $rootScope.user._id).success(function (successData) {
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
            console.log(successData);
            $scope.currentTotalPassengers = 2;
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
        }).error(function () {
        
        });
    };
    
    //Events Triggers by User
    $scope.updateTotalPassengers = function (val) {
        $scope.currentTotalPassengers = ( ($scope.currentTotalPassengers == 1 && val == -1) || ($scope.currentTotalPassengers == 99 && val == 1) ) ? $scope.currentTotalPassengers: $scope.currentTotalPassengers += val; 
    }
}])
