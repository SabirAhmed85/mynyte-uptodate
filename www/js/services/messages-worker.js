'use strict';

var functionsObject = {

    addPostsToScope: function addPostsToScope(data) {

        //strip any HTML tags
        var posts = data[0];
        var messagesIdsArray = data[1];
        var messagesDatesArray = data[2];
        var _userProfileId = data[3];
        var dates = data[4];

        var convertToReadableDate = function (dateProp) {
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
        }

        var getShortenedTimeString = function (dateTimeString) {
            var spaceIndex = dateTimeString.indexOf(' ') + 1;
            var colonIndex = dateTimeString.indexOf(':');
            var hourRequested = parseInt(dateTimeString.substr(spaceIndex, 2));
            var minRequested = dateTimeString.substr(colonIndex, 3);
            var amPmRequested = (hourRequested > 12) ? ' PM': ' AM';
            hourRequested = (hourRequested > 12) ? hourRequested - 12: hourRequested;
            return hourRequested + minRequested + amPmRequested;
        }

                        
        var loopThroughMessagesDates = function (state) {
            
            for (var b = messagesDatesArray.length - 1; b > -1; b--) {
                var datesInd = dates.length - 1 - (messagesDatesArray.length - 1 - b);
                
                if (dates.length == 0 || new Date(messagesDatesArray[b]) > new Date(dates[dates.length - 1]["date"]) ) {
                    dates.push({"date": messagesDatesArray[b], "posts": []});
                    datesInd = dates.length - 1;
                }
                else if (new Date(messagesDatesArray[b]) < new Date(dates[0]["date"])) {
                    dates.unshift({"date": messagesDatesArray[b], "posts": []});
                    datesInd = 0;
                }
                
             
                for (var c = posts.length - 1; c > -1; c--) {
                    if (posts[c].oldEntry && dates[datesInd].date == posts[c].dateString) {
                        for (var d = 0; d < dates[datesInd].posts.length; d++) {
                            dates[datesInd].posts[d].messageReadState = (dates[datesInd].posts[d]._id == posts[c]._id) ? posts[c].messageReadState: dates[datesInd].posts[d].messageReadState;
                            
                            if (d == dates[datesInd].posts.length - 1 && b == 0 && c == 0) {
                                postMessage({'messagesIdsArray': messagesIdsArray, 'messagesDatesArray': messagesDatesArray, 'dates': dates});
                            }
                        }
                    }
                    else {
                        if (posts[c].dateString == dates[datesInd].date && (dates[datesInd].posts.length == 0 || posts[c]._id > dates[datesInd].posts[0]._id)) {
                            dates[datesInd].posts.push(posts[c]);
                        }
                        else if (posts[c].dateString == dates[datesInd].date && posts[c]._id < dates[datesInd].posts[0]._id) {
                            dates[datesInd].posts.unshift(posts[c]);
                        }
                        
                        if (b == 0 && c == 0) {
                            postMessage({'messagesIdsArray': messagesIdsArray, 'messagesDatesArray': messagesDatesArray, 'dates': dates});
                        }
                    }
                    
                }
            }
        }

        for (var a = posts.length - 1; a > -1; a--) {
            posts[a].dateString = convertToReadableDate(posts[a].dateTimeSent);
            posts[a].oldEntry = true;
            
            if (messagesIdsArray.indexOf(posts[a]._id) == -1) {
                messagesIdsArray.push(posts[a]._id);
                posts[a].dateString = convertToReadableDate(posts[a].dateTimeSent);
                
                if (messagesDatesArray.length == 0 || (new Date(posts[a].dateString) > new Date(messagesDatesArray[messagesDatesArray.length - 1]) ) ) {
                    messagesDatesArray.push(posts[a].dateString);
                }
                else if (new Date(posts[a].dateString) < new Date(messagesDatesArray[0])) {
                    messagesDatesArray.unshift(posts[a].dateString);
                }
                
                if (posts[a]._messageSenderProfileId == _userProfileId) {
                    posts[a].from = "self";
                }
                else {
                    posts[a].from = "other";
                }
                posts[a].timeString = getShortenedTimeString(posts[a].dateTimeSent);
                posts[a].oldEntry = false;
            }
            
            if (a == 0) {
                // change the read receipt of messages
                loopThroughMessagesDates("initial");
            }
        }

    },

    insertMessageReadReceipts: function insertMessageReadReceipts(data) {
        var successData = data[0];
        var scope = data[1];
        var datesWorkerFS = data[2];
        
        for (var a = 0; a < successData.length; a++) {
            successData[a].date = datesWorkerFS.convertToReadableDate(scope, successData[a].dateTimeSent);
            if (a == successData.length - 1) {
                postMessage(successData);
            }
        }
    }

};

onmessage = function onmessage(oEvent) {

  if (oEvent.data instanceof Object &&
    oEvent.data.hasOwnProperty('functionName') &&
    oEvent.data.hasOwnProperty('functionArgs')) {
    functionsObject[oEvent.data.functionName].apply(self, oEvent.data.functionArgs);
  }

};
