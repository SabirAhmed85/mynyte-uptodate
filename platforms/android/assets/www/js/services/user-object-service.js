app.factory('userObjectService', ['$q', 'listingsService', '$rootScope', 'Profile', 'Notifications', 'Messages', '$timeout', '$state', function($q, listingsService, $rootScope, Profile, Notifications, Messages, $timeout, $state) {

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
    var user = {};
    
    //Functions
    var makeUserActive = function (user) {
        user._oneSignalId = user._oneSignalId || 0;
        if (user._oneSignalId != 0) {
            Profile.makeUserActive(user._profileId, user._oneSignalId).success(function () {
                
            }).error(function () {
                makeUserActive();
            });
        }
    }
    
    var prepareUsersData = function (user) {
        makeUserActive(user);
        //socket.emit('join:app', $rootScope.user);
        user._unreadMessageIds = user._unreadMessageIds || [];
        user._unreadMessageIdsGroupIdsToDisplay = user._unreadMessageIdsGroupIdsToDisplay || [];
        user.unreadUserUpdates = [];
    }
    
    var showUsersMessageOrNotificationUpdate = function (user) {
        var finishShowingUserUpdate, checkIfUpdateShouldShow;
        
        checkIfUpdateShouldShow = function () {
            var updateSkipped = false;
            
            var skipUpdate = function () {
                user.unreadUserUpdatesShown.push($rootScope.currentUnreadUpdate);
                user.unreadUserUpdatesIdsShown.push($rootScope.currentUnreadUpdate.updateIdString);
                user.unreadUserUpdates.splice(0, 1);
                updateSkipped = true;
            }
            
            $rootScope.currentUnreadUpdate = user.unreadUserUpdates[0];
            
            if (
                ($rootScope.currentViewName == 'app.notificationsSummary' && $rootScope.currentUnreadUpdate.type == 'Notification') ||
                ($rootScope.currentViewName == 'app.messageGroups' && $rootScope.currentUnreadUpdate.type == 'Message') ||
                ($rootScope.currentViewName == 'app.messageGroup' && $rootScope.currentUnreadUpdate.type == 'Message' && Messages.currentMessageGroupIdBeingViewed == $rootScope.currentUnreadUpdate._msgGroupId)
                ) {
                skipUpdate();
            }
            
            if (user.unreadUserUpdates.length > 0 && !updateSkipped) {
                finishShowingUserUpdate();
            }
            else if (user.unreadUserUpdates.length > 0 && updateSkipped) {
                checkIfUpdateShouldShow();
            }
        }
        
        finishShowingUserUpdate = function () {
            $rootScope.showUserUpdate = true;
            $timeout(function () {
                $rootScope.showUserUpdate = false;
                
                user.unreadUserUpdatesShown.push(user.unreadUserUpdates[0]);
                user.unreadUserUpdatesIdsShown.push(user.unreadUserUpdates[0].updateIdString);
                user.unreadUserUpdates.splice(0, 1);
                
                if (user.unreadUserUpdates.length > 0) {
                    $timeout(function () {
                        showUsersMessageOrNotificationUpdate(user);
                    }, 200);
                }
                else {
                    $rootScope.$broadcast('savestate');
                }
                
            }, 4000);
        }
        
        checkIfUpdateShouldShow();
    }
    
    var getUsersMessagesAndNotificationsUpdate = function (user, counter) {
        if (counter > 5) {return false};
        
        Notifications.getUnreadUserMessagesAndNotificationsSummaryForUpdate(user._profileId).success(function (successData) {
            var res = [];
            if (successData != null) {
                var notificationsRetrieved = false;
                var messageGroupsRetrieved = false;
                var messageGroupMessagesRetrieved = [];
                for (var a = 0; a < successData.length; a++) {
                    if (user.unreadUserUpdatesIdsShown.indexOf(successData[a].updateIdString) == -1) {
                        res.push(successData[a]);
                        
                        if (successData[a].type == 'Notification') {
                            if ($rootScope.currentViewName != 'app.notificationsSummary') {
                                user.currentUnreadNotifications.push(successData[a]);
                            }
                            else if (!notificationsRetrieved) {
                                $rootScope.$broadcast('new-notification-to-get');
                                notificationsRetrieved = true;
                            }
                        }
                        else if (successData[a].type == 'Message') {
                            if ($rootScope.currentViewName == 'app.messageGroups' && !messageGroupsRetrieved) {
                                $rootScope.$broadcast('new-message-to-get-for-groups');
                                messageGroupsRetrieved = true;
                            } else if ($rootScope.currentViewName == 'app.messageGroup' && Messages.currentMessageGroupIdBeingViewed == successData[a]._msgGroupId && messageGroupMessagesRetrieved.indexOf(successData[a]._msgGroupId) == -1) {
                                $rootScope.$broadcast('new-message-to-get-for-group');
                                messageGroupMessagesRetrieved.push(successData[a]._msgGroupId);
                            } else if (user.currentUnreadMsgGroups.indexOf(successData[a]._msgGroupId) == -1) {
                                user.currentUnreadMsgGroups.push(successData[a]._msgGroupId);
                            }
                        }
                    }
                    
                    if (a == successData.length - 1 && res.length > 0) {
                        user.unreadUserUpdates = res;
                        showUsersMessageOrNotificationUpdate(user);
                    }
                }
            }
            else {
                user.unreadUserUpdates = res;
            };
            
        }).error(function (errorData) {
            getUsersMessagesAndNotificationsUpdate(user, counter+1);
        });
    }
    
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
        user: user,
        
        //Functions
        createUserObject: function (userObj) {
            user = userObj;
            //$rootScope.user._unreadMessageIds = [];
            
            user.unreadUserUpdates = user.unreadUserUpdates || [];
            user.unreadUserUpdatesShown = user.unreadUserUpdatesShown || [];
            user.unreadUserUpdatesIdsShown = user.unreadUserUpdatesIdsShown || [];
            user.currentUnreadNotifications = user.currentUnreadNotifications || [];
            user.currentUnreadMsgGroups = user.currentUnreadMsgGroups || [];
            
            user.userInteractionObject = user.userInteractionObject || {};
            user.userInteractionObject = (typeof(user.userInteractionObject) !== undefined) ? user.userInteractionObject: {};
            user.userInteractionObject.searchesConducted = user.userInteractionObject.searchesConducted || {};
            
            if (typeof(user._id) !== 'undefined') {
                listingsService.createListingTypesObjForListing(user);
                $rootScope.userLoggedIn = true;
                
                //PREPARE USERS DATA
                //Make User Active on oneSignal
                prepareUsersData(user);
            }
            
            return user;
        },
        
        prepareUsersData: function prepareUsersData(user) {
            //socket.emit('join:app', $rootScope.user);
            prepareUsersData(user);
            
            return user;
        },
        
        startUsersMessagesAndNotificationsUpdateTimer: function startUsersMessagesAndNotificationsUpdateTimer(user) {
            if ($rootScope.userLoggedIn && $rootScope.online) {
                getUsersMessagesAndNotificationsUpdate(user, 0);
                $rootScope.userUpdateTimer = $timeout(function () {
                    startUsersMessagesAndNotificationsUpdateTimer(user);
                }, 15000);
            }
            else {
                $rootScope.userUpdateTimer = null;
            }
            return user;
        },
        
        getUsersMessagesAndNotificationsUpdateDirectly: function getUsersMessagesAndNotificationsUpdateDirectly(user) {
            getUsersMessagesAndNotificationsUpdate(user, 0);
            
            return user;
        },
        
        goToUpdate: function goToUpdate(update) {
            if (update.type == 'Message') {
                $rootScope.currentNotificationType = null;
                if ($rootScope.currentViewName != 'app.profile'
                    && $rootScope.currentViewName != 'app.messageGroups'
                    && $rootScope.currentViewName != 'app.messageGroup') {
                    $state.go('app.profile');
                }
                $timeout(function () {
                    if ($rootScope.currentViewName != 'app.messageGroups') {
                        $state.go('app.messageGroups', {'relListing': null, 'groupType': update.msgGroupType});
                    }
                    
                    $timeout(function () {
                        $state.go('app.messageGroup', {'_id': update._msgGroupId, 'groupType': update.msgGroupType});
                    }, 50);
                }
                , 50);
            }
            else if (update.type == 'Notification') {
                if ($rootScope.currentViewName != 'app.profile'
                    && $rootScope.currentViewName != 'app.notifications') {
                    $state.go('app.profile');
                }
                $timeout(function () {
                    if ($rootScope.currentViewName != 'app.notifications') {
                        $state.go('app.notifications');
                    }
                }
                , 50);
            }
        },
        
        removeUnreadMessageGroup: function removeUnreadMessageGroup (user, _groupId) {
            if (user.currentUnreadMsgGroups.indexOf(_groupId) != -1) {
                user.currentUnreadMsgGroups.splice(user.currentUnreadMsgGroups.indexOf(_groupId), 1);
            }
            
            if (user.unreadUserUpdates.length > 0) {
                for (var a = user.unreadUserUpdates.length - 1; a > -1; a--) {
                    if (user.unreadUserUpdates[a]._msgGroupId == _groupId) {
                        user.unreadUserUpdates.splice(a, 0);
                    }
                    
                    if (a == 0) {
                        $rootScope.$broadcast('savestate');
                    }
                }
            } else {
                $rootScope.$broadcast('savestate');
            }
            
            return user;
        },
        
        removeUnreadNotifications: function removeUnreadNotifications (user) {
            user.currentUnreadNotifications = [];
            if (user.unreadUserUpdates.length > 0) {
                for (var a = user.unreadUserUpdates.length - 1; a > -1; a--) {
                    if (user.unreadUserUpdates[a].type == 'Notification') {
                        user.unreadUserUpdates.splice(a, 0);
                    }
                    
                    if (a == 0) {
                        $rootScope.$broadcast('savestate');
                    }
                }
            }
            else {
                $rootScope.$broadcast('savestate');
            }
            
            return user;
        }

    };

}]);
