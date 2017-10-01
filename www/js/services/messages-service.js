app.factory('messagesWorkerFS', ['$q', function($q) {

  'use strict';

  var _getWorker;

  _getWorker = function _getWorker(functionName, functionParams) {

    var deferred;
    var myWorker = new Worker('js/services/messages-worker.js');

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

  return {

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
    
    getNameStringForGroup: function getNameStringForGroup(messageGroup, user) {
        var nameList = [];
        var nameString = "";
        if (messageGroup.participant1 != user._profileId) {
            nameList.push(messageGroup.participant1Name);
        }
        if (messageGroup.participant2 != user._profileId) {
            nameList.push(messageGroup.participant2Name);
        }
        if (messageGroup.participant3 != user._profileId) {
            nameList.push(messageGroup.participant3Name);
        }
        if (messageGroup.participant4 != user._profileId) {
            nameList.push(messageGroup.participant4Name);
        }
        if (messageGroup.participant5 != user._profileId) {
            nameList.push(messageGroup.participant5Name);
        }
        
        for (var b = 0; b < nameList.length; b++) {
            if (nameList[b] != null) {
                if (b > 0) {
                    messageGroup.multipleNames = true;
                    nameString += ', ';
                }
                nameString += nameList[b];
            }
            if (b == nameList.length - 1) {
                return nameString;
            }
        }
    },
    
    getProfilePhotoListForGroup: function getProfilePhotoListForGroup (messageGroup, user) {
        var profilePhotoList = [];
        if (messageGroup.participant1 != user._profileId) {
            profilePhotoList.push(messageGroup.participant1ProfilePhotoName);
        }
        if (messageGroup.participant2 != user._profileId) {
            profilePhotoList.push(messageGroup.participant2ProfilePhotoName);
        }
        if (messageGroup.participant3 != user._profileId) {
            profilePhotoList.push(messageGroup.participant3ProfilePhotoName);
        }
        if (messageGroup.participant4 != user._profileId) {
            profilePhotoList.push(messageGroup.participant4ProfilePhotoName);
        }
        if (messageGroup.participant5 != user._profileId) {
            profilePhotoList.push(messageGroup.participant5ProfilePhotoName);
        }
        
        return profilePhotoList;
    }

  };

}]);
