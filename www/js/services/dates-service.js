app.factory('datesService', ['$q', function($q) {

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
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    var convertToDate = function (scope, date) {
        scope.chosenWeekday = {index: date.getDay(), name: days[date.getDay()]};
        return days[date.getDay()] + ', ' + date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear();
    };
    var convertToDateWithoutComma = function (scope, date) {
        scope.chosenWeekday = {index: date.getDay(), name: days[date.getDay()]};
        return days[date.getDay()] + ' ' + date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear();
    };
    var getShortenedDateString = function (dateTimeString) {
        return dateTimeString.substr(0, dateTimeString.indexOf(' '));
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
        days: days,
        months: months,

        //Functions
        convertToDate: convertToDate,
        convertToDateWithoutComma: convertToDateWithoutComma,
        convertToReadableDate: function (scope, dateProp) {
            var string = getShortenedDateString(dateProp);
            string = convertToDate(scope, new Date(string));
            return string;
        },
        convertSelectedTimeToShortTimeString: function (selectedTime) {
            var selectedHour = (selectedTime.getUTCHours() < 10) ? '0' + selectedTime.getUTCHours(): selectedTime.getUTCHours();
            var selectedMinutes = (selectedTime.getUTCMinutes() < 10) ? '0' + selectedTime.getUTCMinutes(): selectedTime.getUTCMinutes();
            return obj.selectedHour + ':' + obj.selectedMinutes;
        },
        getTimeInTotalSeconds: function (dateTimeString) {
            var spaceIndex = dateTimeString.indexOf(' ') + 1;
            var colonIndex = dateTimeString.indexOf(':') + 1;
            var hourRequested = parseInt(dateTimeString.substr(spaceIndex, 2));
            var minRequested = dateTimeString.substr(colonIndex, 2);
            return ((hourRequested*3600) + (minRequested*60));
        },
        getShortenedDateString: getShortenedDateString,
        getShortenedTimeString: function (dateTimeString) {
            var spaceIndex = dateTimeString.indexOf(' ') + 1;
            var colonIndex = dateTimeString.indexOf(':');
            var hourRequested = parseInt(dateTimeString.substr(spaceIndex, 2));
            var minRequested = dateTimeString.substr(colonIndex, 3);
            var amPmRequested = (hourRequested > 12) ? ' PM': ' AM';
            hourRequested = (hourRequested > 12) ? hourRequested - 12: hourRequested;
            return hourRequested + minRequested + amPmRequested;
        }

    };

}]);
