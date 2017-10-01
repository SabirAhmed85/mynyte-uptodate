app.factory('listingsService', ['$q', 'datesService', function($q, datesService) {

    'use strict';

    var _getWorker;

    _getWorker = function _getWorker(functionName, functionParams) {

        var deferred;
        var myWorker = new Worker('js/services/dates-worker.js');

        deferred = $q.defer();

        myWorker.onmessage = function onmessage(oEvent) {
          deferred.resolve(oEvent.data);
        };

        myWorker.postMessage({
          'functionName': functionName,
          'functionArgs': functionParams
        });

        return deferred.promise;

    };
    

    //Variables to use in return Functions and standalone
    var createListingTypesObjForListing = function (listing) {
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
    };

    var createListingTypesCatObjForListing = function (listing) {
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
    };
    
    var createListingReadableDateProps = function (scope, listing) {
        if (listing.lastDate != null) {
            listing.lastDate_readable = datesService.convertToReadableDate(scope, listing.lastDate);
        }
    };
    
    var sortThroughListingsResults = function (scope, data, index, obj) {
        createListingTypesObjForListing(data[index]);
        createListingTypesCatObjForListing(data[index]);
        createListingReadableDateProps(scope, data[index]);

        if (index < data.length - 1) {
            sortThroughListingsResults(scope, data, index + 1, obj);
        }
        else {
            if (obj == 'features') {
                scope.features = data;
            } else if (obj == 'listings') {
                scope.listings = data;
            }
            setTimeout(function () {
                scope.pageLoading = false;
                scope.$apply();
            }, 150);
        }
    };
    
    return {
        //Worker Set-Up Function
        f: function f(functionName, functionParams) {

          if (arguments.length < 2) {
            throw new TypeError('Not enough arguments. ' +
              'The first param is a function name as string. ' +
              'The second is an array of data types');
          }

          if (typeof arguments[0] !== 'string') {
            throw new TypeError('First parameter must be a string. ' +
              'This is the name of the function');
          }

          if (!Array.isArray(arguments[1])) {
            throw new TypeError('Second parameter must be an array. ' +
              'This is an array of data to be processed');
          }
            
          return _getWorker(functionName, functionParams);

        },

        //Variables

        //Functions
        createListingTypesObjForListing: createListingTypesObjForListing,
        createListingTypesCatObjForListing: createListingTypesCatObjForListing,
        sortThroughListingsResults: sortThroughListingsResults,
        processListingBusinessOpeningTimes: function processListingBusinessOpeningTimes(listing) {
            if (listing.listingType == 'Business') {
                var processTime = function (time) {
                    return (time != null) ? time.substr(0, time.length - 3): time;
                }
                
                listing.openingTimes = [];
                
                listing.mondayOpeningTime = processTime(listing.mondayOpeningTime);
                listing.mondayClosingTime = processTime(listing.mondayClosingTime);
                listing.openingTimes.push(['Monday', listing.mondayOpeningTime, listing.mondayClosingTime]);
                listing.tuesdayOpeningTime = processTime(listing.tuesdayOpeningTime);
                listing.tuesdayClosingTime = processTime(listing.tuesdayClosingTime);
                listing.openingTimes.push(['Tuesday', listing.tuesdayOpeningTime, listing.tuesdayClosingTime]);
                listing.wednesdayOpeningTime = processTime(listing.wednesdayOpeningTime);
                listing.wednesdayClosingTime = processTime(listing.wednesdayClosingTime);
                listing.openingTimes.push(['Wednesday', listing.wednesdayOpeningTime, listing.wednesdayClosingTime]);
                listing.thursdayOpeningTime = processTime(listing.thursdayOpeningTime);
                listing.thursdayClosingTime = processTime(listing.thursdayClosingTime);
                listing.openingTimes.push(['Thursday', listing.thursdayOpeningTime, listing.thursdayClosingTime]);
                listing.fridayOpeningTime = processTime(listing.fridayOpeningTime);
                listing.fridayClosingTime = processTime(listing.fridayClosingTime);
                listing.openingTimes.push(['Friday', listing.fridayOpeningTime, listing.fridayClosingTime]);
                listing.saturdayOpeningTime = processTime(listing.saturdayOpeningTime);
                listing.saturdayClosingTime = processTime(listing.saturdayClosingTime);
                listing.openingTimes.push(['Saturday', listing.saturdayOpeningTime, listing.saturdayClosingTime]);
                listing.sundayOpeningTime = processTime(listing.sundayOpeningTime);
                listing.sundayClosingTime = processTime(listing.sundayClosingTime);
                listing.openingTimes.push(['Sunday', listing.sundayOpeningTime, listing.sundayClosingTime]);
            }
        }

    };

}]);
