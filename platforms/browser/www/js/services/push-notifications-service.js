app.factory('pushNotificationsService', ['$q', 'Notifications', '$http', function($q, Notifications, $http) {

    'use strict';
    //Variables to use in return Functions and standalone
    
    //Functions
    
    return {
        //Variables
        
        //Functions
        sendNotificationFinal: function (appId, deviceTokens, contents, heading, dataObj) {
            $http({
                method: 'POST',
                url: 'https://onesignal.com/api/v1/notifications',
                headers: {"Content-Type":"application/json"},
                port: 443,
                data: {
                  "app_id": appId,
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

    };

}]);
