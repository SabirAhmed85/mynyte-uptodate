app.factory('categoriesService', ['$q', 'Categories', 'Profile', function($q, Categories, Profile) {

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
    var musicCategories = [];
    var townCategories = [];
    var userEngagementTypes = [];
    
    var getAvailableTowns = function (currentSearchTownName) {
        var promise = Categories.getAvailableTowns().then(function (response) {
            var towns = response.data;
            for (var a = 0; a < towns.length; a++) {
                towns[a].active = false;
                towns[a].selected = false;
                if (towns[a].name == currentSearchTownName) {
                    towns[a].active = true;
                    towns[a].selected = true;
                }
                if (a == towns.length - 1) {
                    townCategories = towns;
                }
            }
        }, function () {
            getAvailableTowns();
        });
        
        return promise;
    };
      
    var getAvailableMusicStyles = function () {
        
        var promise = Categories.getAvailableMusicStyles().then(function (response) {
            console.log(response);
            var musicStyles = response.data;
            musicStyles.unshift({name: 'All Music Styles', _id: 0});
            for (var a = 0; a < musicStyles.length; a++) {
                musicStyles[a].active = false;
                musicStyles[a].selected = false;
                if (musicStyles[a].name == 'All Music Styles') {
                    musicStyles[a].active = true;
                    musicStyles[a].selected = true;
                }
                if (a == musicStyles.length - 1) {
                    musicCategories = musicStyles;
                }
            }
        }, function () {
            getAvailableMusicStyles();
        });
        
        return promise;
    };
      
    var getAvailableUserEngagementTypes = function () {
        var promise = Profile.getAllUserEngagementTypes().then(function (response) {
            userEngagementTypes = response.data;
        }, function () {
            getAvailableUserEngagementTypes();
        });
        
        return promise;
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
        townCategories: function () {
            return townCategories;
        },
        musicCategories: function () {
            return musicCategories;
        },
        userEngagementTypes: function () {
            return userEngagementTypes;
        },
        
        //Functions
        addTownCategories: function (currentSearchTownName) {
            return getAvailableTowns(currentSearchTownName);
        },
        addMusicCategories: function (currentSearchMusicName) {
            return getAvailableMusicStyles(currentSearchMusicName);
        },
        addUserEngagementTypes: function () {
            return getAvailableUserEngagementTypes();
        }

    };

}]);
