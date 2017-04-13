'use strict';

var functionsObject = {

    convertToReadableDate: function convertToReadableDate(data) {
        var dateTimeString = data[0];
        var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
        var getShortenedDateString = function (dateTimeString) {
            return dateTimeString.substr(0, dateTimeString.indexOf(' '));
        }
        var convertToDate = function (date) {
            return days[date.getDay()] + ', ' + date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear();
        }
        var string = getShortenedDateString(dateProp);
        string = convertToDate(new Date(string));
        return string;
    },
    
    getShortenedTimeString: function getShortenedTimeString(data) {
        var dateTimeString = data[0];
        var spaceIndex = dateTimeString.indexOf(' ') + 1;
        var colonIndex = dateTimeString.indexOf(':');
        var hourRequested = parseInt(dateTimeString.substr(spaceIndex, 2));
        var minRequested = dateTimeString.substr(colonIndex, 3);
        var amPmRequested = (hourRequested > 12) ? ' PM': ' AM';
        hourRequested = (hourRequested > 12) ? hourRequested - 12: hourRequested;
        return hourRequested + minRequested + amPmRequested;
    }

};

onmessage = function onmessage(oEvent) {

  if (oEvent.data instanceof Object &&
    oEvent.data.hasOwnProperty('functionName') &&
    oEvent.data.hasOwnProperty('functionArgs')) {
    functionsObject[oEvent.data.functionName].apply(self, oEvent.data.functionArgs);
  }

};
