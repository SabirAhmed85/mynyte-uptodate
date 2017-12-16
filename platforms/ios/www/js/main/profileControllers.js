/*  Profile page template */
app.controller('ProfileCtrl', ['$rootScope', '$scope', '$state', 'Messages', 'Profile', '$cordovaSQLite', 'userService', '$ionicScrollDelegate', 'ngFB', 'Notifications', function($rootScope, $scope, $state, Messages, Profile, $cordovaSQLite, userService, $ionicScrollDelegate, ngFB, Notifications) {
    //Variables & Constants
    //Cancel relListing in case someone has come back to profile page
    //after trying to attach a listing to a message.
    $rootScope.relListing = null;
    $scope.rootScope = $rootScope;
    $scope.messageGroups = [];
    $rootScope.appLoading = false;
    $scope.currentMonth = $rootScope.months[(new Date()).getMonth()];
    $scope.profileItemCount = {};
    console.log($scope.currentMonth);
    
    $scope.getProfileItemCount = function () {
        Profile.getProfileItemCountForProfile($rootScope.user._profileId).success(function (successData) {
            $scope.profileItemCount = successData[0];
        }).error(function (errorData) {
            window.setTimeout(function () {
                if ($rootScope.userLoggedIn) {
                    $scope.getProfileItemCount();
                }
            }, 150);
        });
    }
    
    //Page load function
    $scope.$on('$ionicView.enter', function() {
        if ($rootScope.userLoggedIn) {
            $scope.getProfileItemCount();
        }
    });
    
    $scope.connectProfileToOneSignal = function () {
        Notifications.createOneSignalId($rootScope.user._profileId, $rootScope._userOneSignalId, 0).success(function (successData) {
            $rootScope._userOneSignalId = successData[0]._oneSignalId;
        }).error(function (errorData) {

        });
    };

	//Functions based on User Interactions
    $scope.fbLogin = function () {
        ngFB.login({scope: 'email,user_about_me,email'}).then(
            function (response) {
                if (response.status === 'connected') {
                    //alert('Facebook login succeeded');
                    $scope.closeLogin();
                } else {
                    alert('Facebook login failed');
                }
            });
    };
    
    $scope.closeLogin = function () {
        ngFB.api({
            path: '/me',
            params: {fields: 'id,name,email'}
        }).then(
            function (user) {
                var savedUserId = user.id;
                $rootScope.user = user;
                alert($rootScope.user);
                
                $rootScope.appLoading = true;
                var finalProfileLogIn = function () {
                    Profile.logInThroughFb($rootScope.user.email, $rootScope.user.id).success(function (successData) {
                        alert(successData, "d");
                        if (successData != 'null' && successData != undefined) {
                            /*
                            var query = "INSERT INTO people (firstname, lastname) VALUES (?,?)";
                            db.executeSql(query, ['Simon', 'Smith'], function(res) {
                                console.log("INSERT ID -> " + res.insertId);
                            }, function (err) {
                                console.log('err', err);
                            });
                            */
                            $ionicScrollDelegate.scrollTop();
                            userService.model.user = successData[0];
                            $rootScope.$broadcast('savestate');
                            //console.log(userService.model, 'model2');
                            
                            //All Objects which are attached to the old object and now need to be reattached should be dealt with
                            var oldUserInteractionObject = $rootScope.user.userInteractionObject;
                            $rootScope.user = successData[0];
                            $rootScope.user.id = savedUserId;
                            $rootScope.createListingTypesObjForListing($rootScope.user);
                            $rootScope.prepareUsersData();
                            console.log($rootScope.user);
                            $rootScope.user.userInteractionObject = oldUserInteractionObject;
                            $rootScope.userLoggedIn = true;
                            $scope.connectProfileToOneSignal();
                            $rootScope.$broadcast('user-logged-in');
                            $rootScope.appLoading = false;
                        }
                        else {
                            Profile.createFBUserProfile($rootScope.user.name, $rootScope.user.name, $rootScope.user.email, $rootScope.user.id).success(function (successData) {
                                alert(successData);
                                $state.go('app.registerFinal', {profileType: 'person', _usersId: successData, usersEMail: $scope.email, usersPWord: $scope.password});
                            }).error(function () {
                            
                            });
                        }
                    }).error(function (error) {
                        console.log("error: " + error);
                        finalProfileLogIn();
                    });
                }
            },
            function (error) {
                alert('Facebook error: ' + error.error_description);
            });
    }

    $scope.logIn = function (email, word) {
        $rootScope.appLoading = true;
        Profile.logIn(email, word).success(function (successData) {
            console.log(successData);
            if (successData != 'null' && successData != undefined) {
                /*
                var query = "INSERT INTO people (firstname, lastname) VALUES (?,?)";
                db.executeSql(query, ['Simon', 'Smith'], function(res) {
                    console.log("INSERT ID -> " + res.insertId);
                }, function (err) {
                    console.log('err', err);
                });
                */
                $ionicScrollDelegate.scrollTop();
                userService.model.user = successData[0];
                $rootScope.$broadcast('savestate');
                //console.log(userService.model, 'model2');
                
                //All Objects which are attached to the old object and now need to be reattached should be dealt with
                var oldUserInteractionObject = $rootScope.user.userInteractionObject;
                $rootScope.user = successData[0];
                $rootScope.createListingTypesObjForListing($rootScope.user);
                $rootScope.prepareUsersData();
                console.log($rootScope.user);
                $rootScope.user.userInteractionObject = oldUserInteractionObject;
                $rootScope.userLoggedIn = true;
                $scope.connectProfileToOneSignal();
                $rootScope.$broadcast('user-logged-in');
                $rootScope.appLoading = false;
            }
            else {
                
            }
        }).error(function (error) {
            console.log("error: " + error);
            $scope.logIn(email, word);
        });
    }

    $scope.goToFirstMenuPage = function () {
        $state.go('app.businessItems', {itemType: 'BusinessMenuItemCats', timeScale: 'present'});
    }
    
    $rootScope.$on('new-profile-items-viewed', function() {
        $scope.getProfileItemCount();
    });
}])
    /*  Register Intro Control */
    app.controller('RegisterIntroCtrl', ['$rootScope', '$scope', 'Profile', function($rootScope, $scope, Profile) {
        //Variables & Constants
        $scope.userLoggedIn = false;

        //Functions based on User Interactions
        
    }])
    /*  Register Control */
    app.controller('RegisterCtrl', ['$rootScope', '$scope', '$state', '$stateParams', 'Profile', function($rootScope, $scope, $state, $stateParams, Profile) {
        //Variables & Constants
        $scope.name = "";
        $scope.displayName = "";
        $scope.email = "";
        $scope.password = "";
        $scope.showPasswordFieldEntered = false;
        $scope.showPasswordNote = false;
        $scope.displayNameTaken = false;
        $scope.existingEMailButPWordDifferent = false;
        $scope.formSubmitted = false;
        
        $scope.profileType = $stateParams.profileType;
        console.log($scope.profileType);
        $scope.pageHeader = ($scope.profileType == 'business') ? 'Sign your business up': 'Fill in your details';
        
        $scope.checkIfDisplayNameTaken = function (displayName) {
            Profile.checkIfDisplayNameTaken(displayName).success(function (result) {
                $scope.displayNameTaken = (parseInt(result["total"]) > 0) ? true: false;
            });
        }

        //Functions based on User Interactions
        $scope.doRegister = function (name, displayName, email, password) {
            $rootScope.appLoading = true;
            $scope.formSubmitted = true;
            $scope.name = name;
            $scope.displayName = displayName;
            $scope.email = email;
            $scope.password = password;
            console.log($scope.name, $scope.displayName, $scope.email, $scope.password);
            
            Profile.createProfile($scope.name, $scope.displayName, $scope.email, $scope.password, $scope.profileType).success(function (successData) {
                console.log(successData);
                $state.go('app.registerFinal', {profileType: $scope.profileType, _usersId: successData, usersEMail: $scope.email, usersPWord: $scope.password});
            }).error(function (error) {
                console.log(error);
            });;
            
            if (!$scope.existingEMailButPWordDifferent && !$scope.displayNameTaken) {
                //Complete Registration of this Account
            }
        }
        
    }])
    /*  Register Final Control */
    app.controller('RegisterFinalCtrl', ['$rootScope', '$scope', '$state', '$stateParams', 'Profile', 'Categories', function($rootScope, $scope, $state, $stateParams, Profile, Categories) {
        //Variables & Constants
        $scope.name = "";
        $scope.displayName = "";
        $scope.email = "";
        $scope.password = "";
        $scope.showPasswordFieldEntered = false;
        $scope.showPasswordNote = false;
        $scope.displayNameTaken = false;
        $scope.existingEMailButPWordDifferent = false;
        $scope.formSubmitted = false;
        $scope.showBusinessTypes = false;
        $scope.showTowns = false;
        $scope._businessTypeIds = [];
        $scope.availableBusinessTypes = [1];
        
        $scope.currentFoodStyleIndexToAdd = 0;
        $scope.chosenFoodStyleObjects = [{
            index: $scope.currentFoodStyleIndexToAdd,
            _id: null, 
            name: 'Select a Food Style',
            showFoodStyles: false}];
        $scope.chosenFoodStyleIds = [null];
        
        $scope.currentBusinessTypeIndexToAdd = 0;
        $scope.chosenBusinessTypeObjects = [{
            index: $scope.currentBusinessTypeIndexToAdd,
            _id: null, 
            name: 'Select a Business Type',
            showBusinessTypes: false}];
        $scope.chosenBusinessTypeIds = [null];
        
        $scope.profileType = $stateParams.profileType;
        $scope._usersId = $stateParams._usersId;
        $scope._usersId = $scope._usersId.replace(/\x22/g, '');
        
        $scope.businessRequiredString = ($stateParams.profileType == 'business') ? ' (Required)': ' (optional)';
        $scope.businessTypeSelectionDefaultText = 'Business\'s category';
        var townSelectionDefaultText = ($stateParams.profileType == 'business') ? 'Business\'s home town': 'Home town / favourite town';
        
        $scope.selectedTown = {_id: null, name: townSelectionDefaultText};
        $scope.selectedBusinessTypes = [];
        $scope.selectedBusinessTypes.push({_id: null, name: $scope.businessTypeSelectionDefaultText});
        
        $scope.availableTowns = ['Bedford', 'Luton', 'Milton'];
        
        Categories.getAvailableTowns().success(function (towns) {
            console.log($scope.selectedBusinessTypes);
            $scope.availableTowns = towns;
            console.log(towns);
            Categories.getAvailableBusinessTypes().success(function (businessTypes) {
                console.log("businessTypes");
                console.log(businessTypes);
                for (a = 0; a < businessTypes.length; a++) {
                    if (businessTypes[a].name == "Restaurant") {
                        $scope.restaurantBusinessTypeId = businessTypes[a]._id;
                    }
                    else if (businessTypes[a].name == "Takeaway") {
                        $scope.takeawayBusinessTypeId = businessTypes[a]._id;
                    }
                }
                $scope.businessTypes = businessTypes;
                Categories.getAllFoodStyles().success(function (foodStyles) {
                    console.log("businessTypes");
                    console.log(businessTypes);
                    $scope.foodStyles = foodStyles;
                });
            });
        });

        //Functions based on User Interactions
        $scope.toggleBusinessTypes = function (businessTypeIndex) {
            console.log("j: " + $scope.showBusinessTypes);
            $scope.currentBusinessTypeSelectingIndex = businessTypeIndex;
            $scope.showBusinessTypes = !$scope.showBusinessTypes;
        };
        
        $scope.toggleTowns = function () {
            console.log("i: " + $scope.showTowns);
            $scope.showTowns = !$scope.showTowns;
        };
        
        $scope.selectBusinessType = function (businessType) {
            $scope.selectedBusinessTypes.push(businessType);
            $scope._businessTypeIds.push(businessType._id);
            $scope.showBusinessTypes = !$scope.showBusinessTypes;
        }
        
        $scope.selectTown = function (town) {
            $scope.selectedTown = town;
            console.log($scope.selectedTown);
            $scope.showTowns = !$scope.showTowns;
        }
        
        $scope.toggleBusinessType = function (businessType) {
            $scope.currentBusinessTypeIndexBeingToggled = businessType.index;
            console.log("0", $scope.currentBusinessTypeIndexBeingToggled);
            for (a = 0; a < $scope.chosenBusinessTypeObjects.length; a++) {
                if ($scope.chosenBusinessTypeObjects[a].index != businessType.index) {
                    $scope.chosenBusinessTypeObjects[a].showFoodStyles = false;
                }
            }
            businessType.showBusinessTypes = !businessType.showBusinessTypes;
            $scope.showBusinessTypes = businessType.showBusinessTypes;
        }
        
        $scope.selectBusinessType = function (businessType) {
            $scope.chosenBusinessType = businessType;
            
            for (a = 0; a < $scope.chosenBusinessTypeObjects.length; a++) {
                if ($scope.chosenBusinessTypeObjects[a].index == $scope.currentBusinessTypeIndexBeingToggled) {
                    $scope.chosenBusinessTypeIds[a] = $scope.chosenBusinessType._id;
                    if ($scope.chosenBusinessTypeObjects[a]._id != null) {
                        $scope.businessTypes.push({_id: $scope.chosenBusinessTypeObjects[a]._id, name: $scope.chosenBusinessTypeObjects[a].name});
                    }
                    $scope.chosenBusinessTypeObjects[a]._id = businessType._id;
                    $scope.chosenBusinessTypeObjects[a].name = businessType.name;
                    $scope.chosenBusinessTypeObjects[a].showBusinessTypes = false;
                    for (b = 0; b < $scope.businessTypes.length; b++) {
                        if ($scope.businessTypes[b].name == businessType.name) {
                            $scope.businessTypes.splice(b, 1);
                        }
                    }
                }
            }
            console.log($scope.chosenBusinessTypeIds, $scope.currentBusinessTypeIndexBeingToggled);
            $scope.showBusinessTypes = false;
        }
        
        $scope.removeBusinessType = function (style) {
            var indexToRemove = null;
            for (a = 0; a < $scope.chosenBusinessTypeObjects.length; a++) {
                if ($scope.chosenBusinessTypeObjects[a].index == style.index) {
                    indexToRemove = a;
                    if ($scope.chosenBusinessTypeObjects[a]._id != null) {
                        $scope.businessTypes.push({_id: $scope.chosenBusinessTypeObjects[a]._id, name: $scope.chosenBusinessTypeObjects[a].name});
                    }
                }
                if ($scope.chosenBusinessTypeObjects[a].index > style.index) {
                    $scope.chosenBusinessTypeObjects[a].index = $scope.chosenBusinessTypeObjects[a].index - 1;
                }

                if (a == $scope.chosenBusinessTypeObjects.length - 1) {
                    $scope.chosenBusinessTypeIds.splice(indexToRemove, 1);
                    $scope.chosenBusinessTypeObjects.splice(indexToRemove, 1);
                }
            }
            $scope.currentBusinessTypeIndexToAdd = $scope.currentBusinessTypeIndexToAdd - 1;
        }

        $scope.newBusinessType = function () {
            if ($scope.currentBusinessTypeIndexToAdd == 3) {
                return false;
            }
            $scope.currentBusinessTypeIndexToAdd = $scope.currentBusinessTypeIndexToAdd + 1;
            $scope.chosenBusinessTypeObjects.push({
                index: $scope.currentBusinessTypeIndexToAdd,
                _id: null, 
                name: 'Select a Business Type',
                showBusinessTypes: false});
            $scope.chosenBusinessTypeIds.push(null);
            console.log($scope.chosenBusinessTypeObjects, $scope.currentBusinessTypeIndexToAdd);
        }
        
        /**/
        $scope.toggleFoodStyle = function (foodStyle) {
            $scope.currentFoodStyleIndexBeingToggled = foodStyle.index;
            console.log("0", $scope.currentFoodStyleIndexBeingToggled);
            for (a = 0; a < $scope.chosenFoodStyleObjects.length; a++) {
                if ($scope.chosenFoodStyleObjects[a].index != foodStyle.index) {
                    $scope.chosenFoodStyleObjects[a].showFoodStyles = false;
                }
            }
            foodStyle.showFoodStyles = !foodStyle.showFoodStyles;
            $scope.showFoodStyles = foodStyle.showFoodStyles;
        }
        
        $scope.selectFoodStyle = function (foodStyle) {
            $scope.chosenFoodStyle = foodStyle;
            
            for (a = 0; a < $scope.chosenFoodStyleObjects.length; a++) {
                if ($scope.chosenFoodStyleObjects[a].index == $scope.currentFoodStyleIndexBeingToggled) {
                    $scope.chosenFoodStyleIds[a] = $scope.chosenFoodStyle._id;
                    if ($scope.chosenFoodStyleObjects[a]._id != null) {
                        $scope.foodStyles.push({_id: $scope.chosenFoodStyleObjects[a]._id, name: $scope.chosenFoodStyleObjects[a].name});
                    }
                    $scope.chosenFoodStyleObjects[a]._id = foodStyle._id;
                    $scope.chosenFoodStyleObjects[a].name = foodStyle.name;
                    $scope.chosenFoodStyleObjects[a].showFoodStyles = false;
                    for (b = 0; b < $scope.foodStyles.length; b++) {
                        if ($scope.foodStyles[b].name == foodStyle.name) {
                            $scope.foodStyles.splice(b, 1);
                        }
                    }
                }
            }
            console.log($scope.chosenFoodStyleIds, $scope.currentFoodStyleIndexBeingToggled);
            $scope.showFoodStyles = false;
        }
        
        $scope.removeFoodStyle = function (style) {
            var indexToRemove = null;
            for (a = 0; a < $scope.chosenFoodStyleObjects.length; a++) {
                if ($scope.chosenFoodStyleObjects[a].index == style.index) {
                    indexToRemove = a;
                    if ($scope.chosenFoodStyleObjects[a]._id != null) {
                        $scope.foodStyles.push({_id: $scope.chosenFoodStyleObjects[a]._id, name: $scope.chosenFoodStyleObjects[a].name});
                    }
                }
                if ($scope.chosenFoodStyleObjects[a].index > style.index) {
                    $scope.chosenFoodStyleObjects[a].index = $scope.chosenFoodStyleObjects[a].index - 1;
                }

                if (a == $scope.chosenFoodStyleObjects.length - 1) {
                    $scope.chosenFoodStyleIds.splice(indexToRemove, 1);
                    $scope.chosenFoodStyleObjects.splice(indexToRemove, 1);
                }
            }
            $scope.currentFoodStyleIndexToAdd = $scope.currentFoodStyleIndexToAdd - 1;
        }

        $scope.newFoodStyle = function () {
            if ($scope.currentFoodStyleIndexToAdd == 3) {
                return false;
            }
            $scope.currentFoodStyleIndexToAdd = $scope.currentFoodStyleIndexToAdd + 1;
            $scope.chosenFoodStyleObjects.push({
                index: $scope.currentFoodStyleIndexToAdd,
                _id: null, 
                name: 'Select a Food Style',
                showFoodStyles: false});
            $scope.chosenFoodStyleIds.push(null);
            console.log($scope.chosenFoodStyleObjects, $scope.currentFoodStyleIndexToAdd);
        }

        console.log($stateParams);
        
        $scope.completeRegister = function (phone1, phone2, name, addressLine1, addressLine2, postCode) {
            if (typeof phone1 !== 'undefined') {
                phone1 = phone1.replace(/ /g, '');
            }
            if (typeof phone2 !== 'undefined') {
                phone2 = phone2.replace(/ /g, '');
            }
            
            console.log("PARAMETERS: " + $scope._usersId + " _ " + phone1 + " _ " + phone2 + " _ " + name + " _ " + addressLine1 + " _ " + addressLine2 + " _ " + $scope.selectedTown._id + " _ " + postCode + " _ " + $scope.profileType + " _ " + $scope._businessTypeIds);
            console.log($scope._businessTypeIds[0]);
            $rootScope.appLoading = true;
            Profile.completeRegistration($scope._usersId, phone1, phone2, name, addressLine1, addressLine2, $scope.selectedTown._id, postCode, $scope.profileType, $scope.chosenBusinessTypeIds, $scope.chosenFoodStyleIds).success(function (successData) {
                console.log(successData);
                //If Registration was successful
                if ($scope.profileType != 'myNyte') {
                    Profile.logIn($stateParams.usersEMail, $stateParams.usersPWord).success(function (successData) {
                        console.log(successData);
                        $rootScope.$broadcast('savestate');
                        
                        //All Objects which are attached to the old object and now need to be reattached should be dealt with
                        var oldUserInteractionObject = $rootScope.user.userInteractionObject;
                        $rootScope.user = successData[0];
                        console.log($rootScope.user);
                        //$rootScope.createListingTypesObjForListing($rootScope.user);
                        $rootScope.prepareUsersData();
                        $rootScope.user.userInteractionObject = oldUserInteractionObject;
                        $rootScope.userLoggedIn = true;
                        $rootScope.$broadcast('user-logged-in');
                        $state.go('app.profile');
                        $rootScope.appLoading = false;
                    }).error(function (error) {
                        console.log("error: " + error);
                    });
                } else {
                    $state.go('app.profile');
                    $rootScope.appLoading = false;
                }

            }).error(function (error) {
                console.log(error);
            });;
        }

        $rootScope.appLoading = false;
        
    }])

    app.controller('NotificationsSummaryCtrl', ['$rootScope', '$state','$scope', 'Notifications', 'Profile', function($rootScope, $state, $scope, Notifications, Profile) {
        //Variables & Constants
        $rootScope.hideSearch = true;
        
        $scope.notifications = [];

        //Load Page Data
        Notifications.getNotifications($rootScope.user._profileId).success(function (notifications) {
            $scope.notifications = notifications;
            $rootScope.$broadcast('new-profile-items-viewed');
        });
        
    }]);

    app.controller('NotificationCtrl', ['$rootScope', '$state','$scope', '$stateParams', 'Notifications', 'Profile', 'Followers', function($rootScope, $state, $scope, $stateParams, Notifications, Profile, Followers) {
        //Variables & Constants
        $scope.notificationId = $stateParams.id;
        $scope.alertType = $stateParams.type;
        $scope.followerEventFollowers = [];

        //Load Page Data
        if ($scope.alertType == 'Follower Event') {
            
            Followers.getFollowerEventFollowers().success(function (followerEventFollowers) {
                
                $scope.followerEventFollowers = followerEventFollowers;
            });
        }
    }]);

    app.controller('MessageGroupsCtrl', ['$rootScope', '$state', '$stateParams', '$scope', '$ionicHistory', 'Messages', 'Profile', function($rootScope, $state, $stateParams, $scope, $ionicHistory, Messages, Profile) {
        $scope.$on('$ionicView.enter', function() {
            $rootScope.topRightButtonFunction = function () {
                $state.go('app.messageGroup', {_id: null, relListing: null, _profileIds: [], groupType: $stateParams.groupType});
            };
            $rootScope.backButtonFunction = function () {
                $rootScope.relListing = null;
                $rootScope.currentMessageInputPlaceholder = "Type your message here ...";
                $ionicHistory.goBack();
                $rootScope.backButtonFunction = function () {
                    $ionicHistory.goBack();
                }
            }
        });

        //Variables & Constants
        $scope.rootScope = $rootScope;
        $scope.messageGroups = [];
        $scope.groupType = $stateParams.groupType;
        $rootScope.pageTitle = ($stateParams.groupType == 'Business') ? 'Enquiries': 'Messages';

        //Functions based on User Interactions
        var loadMessageGroups = function () {
            console.log('loading');
            Messages.getMessageGroups($rootScope.user._profileId, $stateParams.groupType).success(function (messageGroups) {
                messageGroups = messageGroups || [];
                for (a = 0; a < messageGroups.length; a++) {
                    messageGroups[a].multipleNames = false;
                    if (!messageGroups[a].name || messageGroups[a].name == "") {
                        var nameList = [];
                        var profilePhotoList = [];
                        var nameString = "";
                        if (messageGroups[a].participant1 != $rootScope.user._profileId) {
                            nameList.push(messageGroups[a].participant1Name);
                            profilePhotoList.push(messageGroups[a].participant1ProfilePhotoName);
                        }
                        if (messageGroups[a].participant2 != $rootScope.user._profileId) {
                            nameList.push(messageGroups[a].participant2Name);
                            profilePhotoList.push(messageGroups[a].participant2ProfilePhotoName);
                        }
                        if (messageGroups[a].participant3 != $rootScope.user._profileId) {
                            nameList.push(messageGroups[a].participant3Name);
                            profilePhotoList.push(messageGroups[a].participant3ProfilePhotoName);
                        }
                        if (messageGroups[a].participant4 != $rootScope.user._profileId) {
                            nameList.push(messageGroups[a].participant4Name);
                            profilePhotoList.push(messageGroups[a].participant4ProfilePhotoName);
                        }
                        if (messageGroups[a].participant5 != $rootScope.user._profileId) {
                            nameList.push(messageGroups[a].participant5Name);
                            profilePhotoList.push(messageGroups[a].participant5ProfilePhotoName);
                        }
                        
                        for (b = 0; b < nameList.length; b++) {
                            if (nameList[b] != null) {
                                if (b > 0) {
                                    messageGroups[a].multipleNames = true;
                                    nameString += ', ';
                                }
                                nameString += nameList[b];
                            }
                        }
                        messageGroups[a].mainPhoto = profilePhotoList[0];
                        messageGroups[a].name = nameString;
                    }
                    
                    if (messageGroups[a].lastMessageSentBy == $rootScope.user.displayName) {
                        messageGroups[a].lastMessageSentBy = 'Me';
                    }
                    messageGroups[a].lastMessageText = (messageGroups[a].lastMessageText == "" && messageGroups[a]._lastMessageItemId != null) ? 'Attached Listing': messageGroups[a].lastMessageText;
                }
                $scope.messageGroups = messageGroups;
            }).error(function () {
                loadMessageGroups();
            });
        }

        loadMessageGroups();

        $rootScope.$on('new-message-added', function () {
            loadMessageGroups();
        });
        $rootScope.$on('new-profile-items-viewed', function() {
            console.log("sihdfihi");
            loadMessageGroups();
        });
    }]);

    app.controller('MessageGroupCtrl', ['$rootScope', '$state','$scope', '$stateParams', '$ionicScrollDelegate', '$ionicHistory', 'Messages', 'Profile', '$http', 'Notifications', function($rootScope, $state, $scope, $stateParams, $ionicScrollDelegate, $ionicHistory, Messages, Profile, $http, Notifications) {
        $scope.$on('$ionicView.enter', function() {
            $rootScope.currentMessageGroupIdBeingViewed = $stateParams._id;
            
            $scope.messageGroupId = $stateParams._id;
            $scope.messageNameString = $stateParams.messageNameString;
        
            if ($stateParams.groupType == 'Business') {
               $rootScope.backButtonFunction = function () {
                    console.log('gone');
                    $rootScope.relListing = null;
                    $rootScope.currentMessageInputPlaceholder = "Type your message here ...";
                    $ionicHistory.goBack();
                    $rootScope.backButtonFunction = function () {
                        $ionicHistory.goBack();
                    }
                } 
            }
            else {
                $rootScope.backButtonFunction = function () {
                    $ionicHistory.goBack();
                }
            }
            
            $scope.showMessageGroup("initial");
            $rootScope.messageGroupTimer = window.setTimeout(function () {$scope.reloadMessageGroup()}, 10000);
        });
        //Variables & Constants
        $scope.rootScope = $rootScope;
        $scope.stateParams = $stateParams;
        $scope.messageGroupId = $stateParams._id;
        $scope.messageNameString = $stateParams.messageNameString;
        $scope.messages = [];
        $scope.chosenRecipients = [];
        $scope.possibleRecipients = [];
        $scope.currentRecipientSearch = {};
        $scope.currentRecipientSearch.search = "";
        $scope.messageRecipientInputPlaceholderMessage = ($stateParams.groupType == 'Business') ? "Select a business to make an enquiry": "Select follower(s) to message ...";
        $scope.newMsgGroup = false;
        $scope.newMsgGroupRecipientDecided = true;
        $scope.addNewMessage = false;
        $scope.groupHasMoreThan2People = null;
        $scope.currentMessageIndex = 30;
        $scope.datamessage = '';
        $scope.dates = [];
        console.log('params: ', $stateParams);
        
        //Functions used at different times in View
        // load more content function
        $scope.getPosts = function(state){
        
            var dates = [];
            $scope.postsCompleted = false;
            $scope.messageGroupId = $stateParams._id;
            $scope.messageNameString = $stateParams.messageNameString;
            
            Messages.getMessageGroup($stateParams._id, $rootScope.user._profileId, $scope.currentMessageIndex)
            .success(function (posts) {
                var getMessageGroupSummary = function () {
                    Messages.getMessageGroupSummary($rootScope.user._profileId, $scope.messageGroupId).success(function (successData) {
                        $rootScope.pageSubtitle = successData[0].headerMessage;
                        $scope.groupHasMoreThan2People = (successData[0].totalParticipants > 2) ? true: false;
                    }).error(function () {
                        getMessageGroupSummary();
                    });
                }
                
                getMessageGroupSummary();
            
                var messagesDatesArray = [];
                var completeMessageDisplay = function (state) {
                    $scope.dates = dates;
                    if ($scope.addNewMessage) {
                        $scope.finalAddMessage($scope.newMessage);
                    }
                    if (state == 'initial') {
                        $ionicScrollDelegate.scrollBottom();
                        $rootScope.$broadcast('new-profile-items-viewed');
                        window.setTimeout(function () {
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                            $scope.postsCompleted = true;
                        }, 350);
                    }
                }
                
                var loopThroughMessagesDates = function (state) {
                    
                    for (b = 0; b < messagesDatesArray.length; b++) {
                        dates[b] = {"date":messagesDatesArray[b], "posts":[]};
                    
                        for (c = 0; c < posts.length; c++) {
                            if (posts[c].dateString == dates[b].date) {
                                dates[b].posts.push(posts[c]);
                            }
                     
                            if (c == posts.length - 1 && b == messagesDatesArray.length - 1) {
                                completeMessageDisplay(state);
                            }
                        }
                    }
                }
                
                for (a = 0; a < posts.length; a++) {
                    posts[a].dateString = $rootScope.convertToReadableDate($scope, posts[a].dateTimeSent);
                    
                    if (messagesDatesArray.indexOf(posts[a].dateString) == -1) {
                        messagesDatesArray.push(posts[a].dateString);
                    }
                    
                    if ($rootScope.user._unreadMessageIds.indexOf(posts[a]._id) == -1) {
                        $rootScope.user._unreadMessageIdsGroupIds.splice($rootScope.user._unreadMessageIds.indexOf(posts[a]._messageGroupId), 1);
                        $rootScope.user._unreadMessageIds.splice($rootScope.user._unreadMessageIds.indexOf(posts[a]._id), 1);
                        $rootScope.user._unreadMessageIdsGroupIdsToDisplay.splice($rootScope.user._unreadMessageIdsGroupIdsToDisplay.indexOf(posts[a]._messageGroupId), 1);
                    }
                    if (posts[a]._messageSenderProfileId == $rootScope.user._profileId) {
                        posts[a].from = "self";
                    }
                    else {
                        posts[a].from = "other";
                    }
                    posts[a].timeString = $rootScope.getShortenedTimeString(posts[a].dateTimeSent);
                    
                    if (a == posts.length - 1) {
                        loopThroughMessagesDates(state);
                    }
                }
            })
            .error(function (error) {
                $scope.items = [];
                $scope.getPosts();
            });
        }

        //Load Initial Page Data
        $scope.showMessageGroup = function (state) {
            if ($scope.messageGroupId != null) {
                $rootScope.pageTitle = $scope.messageNameString;
                $scope.getPosts(state);
                console.log($scope.newMsgGroupRecipientDecided);
            }
            else if ($scope.messageGroupId == null && $stateParams._profileIds.length == 0) {
                $rootScope.pageTitle = "New Message";
                $scope.newMsgGroup = true;
                $scope.newMsgGroupRecipientDecided = false;
            }
            else if ($scope.messageGroupId == null && $stateParams._profileIds.length > 0) {
                $rootScope.pageTitle = "New Message";
                for (a = 0; a < $stateParams._profileIds.length; a++) {
                    if ($stateParams._profileIds[a] != $rootScope.user._profileId) {
                        Profile.getAllProfileDetails($stateParams._profileIds[a]).success(function (successData) {
                            $scope.chosenRecipients.push(successData[0]);
                            console.log("chosen: ", $scope.chosenRecipients);
                        }).error(function () {

                        });
                    }
                    if (a == $stateParams._profileIds.length - 1) {
                        $scope.newMsgGroup = true;
                        $scope.newMsgGroupRecipientDecided = true;
                    }
                }
            }
        }
        
        // pull to refresh buttons
        $scope.doRefresh = function() {
            alert("dj");
            $scope.currentMessageIndex += 30;
            $scope.showMessageGroup("subsequent");
        }
        
        $scope.cancelListingAttachment = function () {
            console.log("dfn");
            $rootScope.relListing = null;
            $rootScope.currentMessageInputPlaceholder = "Type your message here ...";
        }
        
        $scope.goToAttachedListing = function (message) {
            if (message.relatedItemType == "Offer") {
                $state.go('app.offers');
                var timer = window.setTimeout(function () {
                    $state.go('app.offerDetail', {'_id': message._relatedItemId});
                }, 220);
            } else {
                console.log(message.relatedItemType);
                $state.go('app.nlfeed');
                var timer = window.setTimeout(function () {
                    $state.go('app.nlfeedListing', {'_listingId': message._relatedItemId, 'listingType':message.relatedItemType});
                }, 220);
                var timer2 = null;
                if (message.relatedItemType == "BusinessesOffers") {
                    var timer2 = window.setTimeout(function () {
                        $state.go('app.seeBusinessesItems', {'_businessId': message._relatedItemId, 'itemType': 'Offers' });
                    }, 320);
                } else if (message.relatedItemType == "BusinessesEvents") {
                    var timer2 = window.setTimeout(function () {
                        $state.go('app.seeBusinessesItems', {'_businessId': message._relatedItemId, 'itemType': 'UpcomingEvents'});
                    }, 320);
                } else if (message.relatedItemType == "BusinessesTakeaway Menu") {
                    console.log('hono');
                    var timer2 = window.setTimeout(function () {
                        $state.go('app.seeMenu', {'_businessId': message._relatedItemId, '_menuTypeId': 1});
                    }, 320);
                } else if (message.relatedItemType == "BusinessesA la Carte Menu") {
                    var timer2 = window.setTimeout(function () {
                        $state.go('app.seeMenu', {'_businessId': message._relatedItemId, '_menuTypeId': 2});
                    }, 320);
                } else if (message.relatedItemType == "BusinessesPhotos") {
                    console.log("io");
                    var timer2 = window.setTimeout(function () {
                        $state.go('app.nlfeedListing-photos', {'_listingId': message._relatedItemProfileId, 'listingType': 'Profile'});
                    }, 320);
                }

            }
        }
        console.log($rootScope.relListing);
        $scope.addMesage = function(){

            var completeLoopingThroughRecipients  = function (newMessage) {
                if (newMessage._profileIds.indexOf($rootScope.user._profileId) == -1) {
                    newMessage._profileIds.push($rootScope.user._profileId);
                }
                Messages.checkIfMessageGroupExists(newMessage._profileIds).success(function (successData) {
                    if (successData != null) {
                        newMessage._groupId = successData[0]._id;
                        $stateParams._id = newMessage._groupId;
                        $scope.addNewMessage = true;
                        $scope.newMessage = newMessage;
                        $scope.showMessageGroup();
                    }
                    else {
                        $scope.finalAddMessage(newMessage);
                    }
                }).error(function () {
                    completeLoopingThroughRecipients(newMessage);
                });
            }
            $scope.finalAddMessage = function (newMessage) {
                $rootScope.appLoading = true;
                Messages.addMessage(newMessage).success(function (successData) {
                
                    var _groupId = (successData.indexOf('"') != -1) ? successData.substr(1, successData.length - 2) : successData;
                    var getMessageRecipientProfileIds = function () {
                        Messages.getMessageRecipientProfileIds(_groupId, $rootScope.user._profileId).success(function (_recipientIds) {
                            var messageText = (newMessage.text == "" || newMessage.text == null) ? "Attached Listing": newMessage.text
                            var contents = $rootScope.user.displayName + ": " + messageText;
                            var header = "New Message";
                            var dataObj = {
                                "actionFunction": "goToMessage",
                                "msgGroupType": "person",
                                "_msgGroupId": _groupId
                            };
                            
                            var recipientsArray = [];
                            for (a = 0; a < _recipientIds.length; a++) {
                                recipientsArray.push(_recipientIds[a]._participantProfileId);
                                if (a == _recipientIds.length - 1) {
                                    $rootScope.prepareMessageNotificationFinal(recipientsArray, contents, header, dataObj);
                                }
                            }
                            
                        }).error(function (errorData) {
                            getMessageRecipientProfileIds();
                        });
                    }
                    
                    getMessageRecipientProfileIds();
                    console.log(successData);
                    $scope.groupHasMoreThan2People = ($scope.chosenRecipients.length > 1 && scope.groupHasMoreThan2People == null) ? true: $scope.groupHasMoreThan2People;
                    $rootScope.$broadcast('new-message-added');
                    $scope.showMessageGroup("initial");
                    $scope.datamessage = "";
                    $rootScope.relListing = null;
                    $rootScope.currentMessageInputPlaceholder = "Type your message here ...";
                    $scope.addNewMessage = false;
                    $scope.newMessage = null;
                    $scope.newMsgGroup = false;
                    $ionicScrollDelegate.scrollBottom();
                    $rootScope.appLoading = false;
                }).error(function () {
                    $scope.finalAddMessage(newMessage);
                });
            }

            var newMessage = new function() {
                this._relatedItemId = ($rootScope.relListing) ? $rootScope.relListing.relListingId: null;
                this.relatedItemType = ($rootScope.relListing && $rootScope.relListing.relListingType) ? $rootScope.relListing.relListingType: null;
                this.relatedItemName = ($rootScope.relListing) ? $rootScope.relListing.name: null;
                this.relatedItemTown = ($rootScope.relListing) ? $rootScope.relListing.town: null;
                if (this.relatedItemType == 'Offer') {
                    this.relatedItemCoverPhotoName = $rootScope.relListing.currentOfferCoverPhotoName;
                } else {
                    this.relatedItemCoverPhotoName = ($rootScope.relListing) ? $rootScope.relListing.currentCoverPhotoName: null;
                }
                this.messageText = $scope.datamessage;
                this.text = $scope.datamessage;
                this.from = 'self';
                this._senderId = $rootScope.user._profileId;
                this._groupId = $stateParams._id;
                this.groupType = $stateParams.groupType;
                this._profileIds = (this._groupId != null) ? [] : $stateParams._profileIds;
                
                if (this._groupId == null && $stateParams._profileIds.length == 0) {
                    var loopThroughChosenRecipients = function (i, msg) {
                        msg._profileIds.push($scope.chosenRecipients[i]._profileId);

                        if (i < $scope.chosenRecipients.length - 1) {
                            i++;
                            loopThroughChosenRecipients(i, msg);
                        } else {
                            completeLoopingThroughRecipients(msg);
                        }
                    }
                    loopThroughChosenRecipients(0, this);
                    
                }
                else {
                    $scope.finalAddMessage(this);
                }
                console.log(this._profileIds);
            }
        }

        $scope.conductMessageRecipientSearch = function (searchString) {
            $scope.possibleRecipients = (searchString.length > 0) ? $scope.possibleRecipients: [];
            
            if ($stateParams.groupType == 'Person' && searchString != null && searchString != "") {
                Profile.getAllFollowersByName(searchString, $rootScope.user._profileId).success(function (successData) {
                    $scope.possibleRecipients = $rootScope.fillRecipientSearchResults(successData, $scope, $scope.chosenRecipients);
                }).error(function () {
                    $scope.conductMessageRecipientSearch(searchString);
                });
            } else if ($stateParams.groupType == 'Business' && searchString != null && searchString != "") {
                Profile.getAllBusinessesByName(searchString, "_", "_").success(function (successData) {
                    $scope.possibleRecipients = $rootScope.fillRecipientSearchResults(successData, $scope, $scope.chosenRecipients);
                }).error(function () {
                    $scope.conductMessageRecipientSearch(searchString);
                });
            }
        }

        $scope.addPossibleRecipientToChat = function (recipient) {
            $scope.currentRecipientSearch = {search: ""};
            $scope.chosenRecipients.push(recipient);
            $scope.possibleRecipients = [];
        }
        
        $scope.reloadMessageGroup = function () {
            if ($rootScope.currentViewName == 'app.messageGroup') {
                $scope.showMessageGroup("subsequent");
                $rootScope.messageGroupTimer = window.setTimeout(function () {$scope.reloadMessageGroup()}, 10000);
            }
        }
    }]);

    /* NL ADMIN Contacts */
    app.controller('ContactsCtrl', ['$ionicHistory', '$rootScope', '$state','$scope', 'Profile', 'Contacts', function($ionicHistory, $rootScope, $state, $scope, Profile, Contacts) {
        //Variables & Constants
        $scope.$on('$ionicView.enter', function() {
            $rootScope.topRightButtonFunction = function () {
                $state.go('app.addContact');
            };
        });
        
        $scope.contacts = [];
        
        //Functions used at Start and Throughout
        $scope.gridOptions = {};
        $scope.gridOptions.paginationPageSizes = [10, 15];
        $scope.gridOptions.paginationPageSize = 10;
        $scope.gridOptions.enableFiltering = true;
        //$scope.gridOptions.enablePaginationControls = false;
        $scope.gridOptions.columnDefs = [{
            name: 'Name',
            field: 'name',
        }
        , {
            name: 'Company Name',
            field: 'companyName'
        }, {
            name: 'Town',
            field: 'town'
        }
        , {
            name: 'Business Type',
            field: 'businessType'
        }
        , {
            name: 'Phone',
            field: 'phone'
        }
        , {
            name: 'e-mail',
            field: 'email',
            width: '20%'
        }
        , {
            name: ' ',
            cellTemplate: '<a class="btn primary" ui-sref="app.contactDetail({_id: row.entity._id})">Edit</a>',
            width: '12%'
        }
        /*, {
            name: 'Delete',
            cellTemplate: '<a class="btn primary" ng-click="grid.appScope.Delete(row)">Delete</a>'
        }*/
        ];
        
        function getContacts () {
            Contacts.getContacts().success(function (contacts) {
                $scope.contacts = contacts;
                $scope.gridOptions.data = contacts;
            });
        }
        //Functions based on User Interactions
        $scope.filterContacts = function(row) {
            Contacts.getContacts().success(function (contacts) {
                $scope.contacts = contacts;
                $scope.gridOptions.data = contacts;
            });
        };
        
        $scope.notWorking = function () {
            alert("This Function isn't finished just yet, pal");
        };
        
        $scope.Delete = function(row) {
            console.log(row);
            row.visible = false;
            var index = $scope.gridOptions.data.indexOf(row.entity);
            Contacts.getContacts().success(function (contacts) {
                $scope.contacts = contacts;
                $scope.gridOptions.data = contacts;
            });
            //$scope.gridOptions.data.splice(index, 1);
        };
        
        //Updates based on Outside events
        $rootScope.$on('new-contact', function(event, args) {
            getContacts();
            // do what you want to do
        })
        
        ////
        getContacts();
    }]);
    app.controller('AddContactCtrl', ['$rootScope', '$state','$scope', 'Profile', 'Contacts', function($rootScope, $state, $scope, Profile, Contacts) {
        //Variables & Constants
        
        $scope.addContact = function (businessType, town, companyName, name, role, phone, email, website, note) {
            Contacts.addContact(businessType, town, companyName, name, role, phone, email, website, note).success(function (response) {
                console.log("success");
                console.log(response);
                $rootScope.$broadcast('new-contact');
                $state.go('app.contacts');
            }).error(function (errorMessage) {
                console.log("error");
                console.log(errorMessage);
            });
        }
    }]);
    app.controller('ContactDetailCtrl', ['$rootScope', '$state', '$stateParams', '$scope', 'Profile', 'Contacts', function($rootScope, $state, $stateParams, $scope, Profile, Contacts) {
        //Variables & Constants
        $rootScope.topRightButtonFunction = function () {
            $scope.editing = !$scope.editing;
            $rootScope.currentlyEditing = !$rootScope.currentlyEditing;
        };
        $scope.contact = null;
        $scope._id = $stateParams._id;
        console.log($stateParams);
        console.log($scope._id + ' dd');
        $scope.editing = false;
        
        //Functions based on User Interactions
        Contacts.getContact($scope._id).success(function (contact) {
            $scope.contact = contact[0];
        });
        
        $scope.editContact = function (_contactId, businessType, town, companyName, name, role, phone, email, website, note) {
            Contacts.editContact(_contactId, businessType, town, companyName, name, role, phone, email, website, note).success(function (response) {
                console.log(response);
                $scope.editing = false;
                $rootScope.currentlyEditing = false;
                $rootScope.$broadcast('new-contact');
            }).error(function () {
                
            });
        }
    }]);
    /* Business Items Views Controller */
    app.controller('BusinessItemsCtrl', ['$rootScope', '$state', '$stateParams', '$scope', 'Offers', 'Profile', 'Events', 'Taxi', 'MenuItems', 'TableBooking', 'Movies', function($rootScope, $state, $stateParams, $scope, Offers, Profile, Events, Taxi, MenuItems, TableBooking, Movies) {
        //Variables & Constants
        $scope.businessItems = [];
        console.log($stateParams.itemType);
        $scope.itemType = $stateParams.itemType;
        $scope.timeScale = $stateParams.timeScale;
        $scope.$on('$ionicView.enter', function() {
        
            if ($stateParams.itemType == 'BusinessMenuItemCats') {
                $rootScope.topRightButtonShouldBeSettings = true;
                console.log("true");
                $rootScope.topRightButtonFunction = function () {
                    $state.go('app.businessItemSettings', {'itemType': $stateParams.itemType});
                };
            } else {
                $rootScope.topRightButtonShouldBeSettings = false;
                $rootScope.topRightButtonFunction = function () {
                    $state.go('app.addBusinessItem', {'itemType': $stateParams.itemType});
                };
            }
            
            var array = ['RequestedTableBookings', 'OwnTableBookings', 'myNYTEActivity', 'OwnTaxiBookings', 'RequestedTaxiBookings', 'OwnTakeawayOrders', 'RequestedTakeawayOrders'];
            if (array.indexOf($stateParams.itemType) != -1 || $stateParams.timeScale == 'past') {
                $rootScope.topRightButtonIsPlus = false;
            } else if ($stateParams.itemType != 'BusinessMenuItemCats') {
                $rootScope.topRightButtonIsPlus = true;
            }
        })
        
        if ($stateParams.itemType != 'BusinessCarteMenuItemCats' 
            && $stateParams.itemType != 'BusinessTakeawayMenuItemCats'
            && $stateParams.itemType != 'BusinessMenuItemCats'
            && $stateParams.itemType != 'myNYTEActivity') {
            $scope.nextPageFunction = function (item) {
                console.log($stateParams);
                $state.go('app.businessItem', {'_id': item.relListingId, 'itemType': $stateParams.itemType, 'timeScale': $stateParams.timeScale});
            };
        } else if ($stateParams.itemType == 'BusinessMenuItemCats') {
            $scope.nextPageFunction = function (item) {
                $state.go('app.businessItems', {'itemType': item.menuType, 'timeScale': 'present'});
            };
        } else if ($stateParams.itemType == 'BusinessCarteMenuItemCats' 
            || $stateParams.itemType == 'BusinessTakeawayMenuItemCats') {
            $scope.nextPageFunction = function (item) {
                var _menyTypeId = ($stateParams.itemType != 'BusinessCarteMenuItemCats') ? 1: 2;
                $state.go('app.seeBusinessMenuItems', {'_businessId': $rootScope.user._id, '_menuItemCategoryId': item._id, '_menuTypeId': _menuTypeId});
            };
        } else if ($stateParams.itemType == 'myNYTEActivity') {
            $scope.nextPageFunction = function (item) {
            };
        }
        
        var convertToReadableDate = function (dateProp) {
            var string = $rootScope.getShortenedDateString(dateProp);
            string = $rootScope.convertToDate($scope, new Date(string));
            return string;
        }
        
        var loopThroughBusinessItems = function (successData, i, businessItemType) {
            if (businessItemType == 'Table Booking') {
                successData[i].timeRequested = $rootScope.getShortenedTimeString(successData[i].dateTimeRequested);
                successData[i].dateRequested = convertToReadableDate(successData[i].dateTimeRequested);
            }
            else if (businessItemType == 'Event') {
                successData[i].DATE = convertToReadableDate(successData[i].DATE);
                successData[i].lastDate = convertToReadableDate(successData[i].lastDate);
            }
            else if (businessItemType == 'Offer') {
                successData[i].endDateTime = convertToReadableDate(successData[i].endDateTime);
                successData[i].startDateTime = convertToReadableDate(successData[i].startDateTime);
            }
            else if (businessItemType == 'Movie') {
                successData[i].earliestShowingStartDate = convertToReadableDate(successData[i].earliestShowingStartDate);
                successData[i].latestShowingEndDate = convertToReadableDate(successData[i].latestShowingEndDate);
            }

            if (i < (successData.length - 1)) {
                loopThroughBusinessItems(successData, i + 1, businessItemType);
            } else {
                $scope.businessItems = successData;
            }
        }
        
        switch($stateParams.itemType) {
            case 'Movies':
                $scope.getBusinessItems = function () {
                    Movies.getMoviesForMaintenance($stateParams.timeScale, 0).success(function (successData) {
                        console.log(successData);
                        if (successData != 'null') {
                            loopThroughBusinessItems(successData, 0, 'Movie')
                        }
                    }).error(function () {
                        $scope.getBusinessItems();
                    });
                }
                
                //Updates based on Outside events
                $rootScope.$on('new-movie', function(event, args) {
                    $scope.getBusinessItems();
                    // do what you want to do
                })
                break;
            case 'OwnOffers':
                $scope.getBusinessItems = function () {
                    $rootScope.pageTitle = ($stateParams.timeScale == 'present') ? "My Current Offers": "My Past Offers";
                    var _userId = ($rootScope.userLoggedIn) ? $rootScope.user._profileId: 0;
                    Offers.getOffersByBusinessId($rootScope.user._id, _userId, $stateParams.timeScale).success(function (successData) {
                        console.log(successData);
                        if (successData != 'null') {
                            loopThroughBusinessItems(successData, 0, 'Offer')
                        }
                    }).error(function () {
                        $scope.getBusinessItems();
                    });
                }
                
                //Updates based on Outside events
                $rootScope.$on('new-offer', function(event, args) {
                    $scope.getBusinessItems();
                    // do what you want to do
                })
                break;
            case 'OwnEvents':
                $rootScope.pageTitle = ($stateParams.timeScale == 'present') ? "My Current Events": "My Past Events";
                $scope.getBusinessItems = function () {
                    Events.getEventsByBusiness($rootScope.user._id, $stateParams.timeScale).success(function (successData) {
                        console.log(successData);
                        if (successData != 'null') {
                            loopThroughBusinessItems(successData, 0, 'Event')
                        }
                        }).error(function () {
                        $scope.getBusinessItems();
                    });
                }
                break;
            case 'RequestedTableBookings':
                $scope.getBusinessItems = function () {
                    $rootScope.pageTitle = "My Current Table Booking Requests";
                    TableBooking.getRequestedTableBookings($rootScope.user._id).success(function (successData) {
                        console.log(successData);
                        if (successData != null) {
                            loopThroughBusinessItems(successData, 0, 'Table Booking')
                        }
                    }).error(function () {
                        $scope.getBusinessItems();
                    });
                }

                //Updates based on Outside events
                $rootScope.$on('table-booking-updated', function(event, args) {
                    $scope.getBusinessItems();
                    // do what you want to do
                })
                break;
            case 'OwnTableBookings':
                $scope.getBusinessItems = function () {
                    $rootScope.pageTitle = ($stateParams.timeScale == 'present') ? "My Current Table Bookings": "My Past Table Bookings";
                    TableBooking.getAcceptedTableBookings($rootScope.user._id, $stateParams.timeScale).success(function (successData) {
                        console.log(successData);
                        if (successData != null) {
                            loopThroughBusinessItems(successData, 0, 'Table Booking')
                        }
                        console.log($scope.businessItems);
                    }).error(function () {
                        $scope.getBusinessItems();
                    });
                }
                $rootScope.$on('table-booking-updated', function(event, args) {
                    $scope.getBusinessItems();
                    // do what you want to do
                })
                break;
            case 'RequestedTakeawayOrders':
            case 'OwnTakeawayOrders':
                var requestType = ($stateParams.itemType == 'RequestedTakeawayOrders') ? 'allRequested': 'own';

                $scope.getBusinessItems = function () {
                    MenuItems.getMenuOrdersForBusiness($rootScope.user._id, requestType).success(function (successData) {
                        //$rootScope.pageTitle = ();
                        console.log(successData);
                        if (successData != 'null') {
                            $scope.businessItems = successData;
                        }
                    }).error(function () {
                    $scope.getBusinessItems();
                    });
                }
                
                //Updates based on Outside events
                $rootScope.$on('menu-order-updated', function(event, args) {
                    $scope.getBusinessItems();
                    // do what you want to do
                })
                break;
            case 'BusinessMenuItemCats':
                $scope.getBusinessItems = function () {
                    $rootScope.pageTitle = "My Menus";
                    $scope.businessItems = [];
                    if ($rootScope.user.listingTypes.indexOf('Takeaway') != -1) {
                        $scope.businessItems.push({name: 'Takeaway Menu', menuType: 'BusinessTakeawayMenuItemCats'});
                    }
                    if ($rootScope.user.listingTypes.indexOf('Restaurant') != -1) {
                        $scope.businessItems.push({name: 'A la Carte Menu', menuType: 'BusinessCarteMenuItemCats'});
                    }
                }
                break;
            case 'BusinessCarteMenuItemCats':
            case 'BusinessTakeawayMenuItemCats':
                var _menuTypeId = ($stateParams.itemType == 'BusinessCarteMenuItemCats') ? 2: 1;
                $scope.showTagOptions = true;
                $scope.showExtraOptionsOptions = true;

                $scope.getBusinessItems = function () {
                    $rootScope.pageTitle = ($stateParams.itemType == 'BusinessCarteMenuItemCats') ? "My a la Carte Menu": "My Takeaway Menu";
                    $scope.sortMenuItems = function () {
                        console.log("hi", $scope.menuItems);
                        for (z = 0; z < $scope.menuItems.length; z++) {
                            var relIndex = $scope.menuItemCategoriesAdded.indexOf($scope.menuItems[z]._menuItemCategoryId);
                            if (relIndex == -1) {
                                $scope.menuItemCategories.push({
                                    'name': $scope.menuItems[z].menuItemCategoryName,
                                    '_id': $scope.menuItems[z]._menuItemCategoryId,
                                    'count': 1
                                });
                                
                                $scope.menuItemCategoriesAdded.push($scope.menuItems[z]._menuItemCategoryId);
                            }
                            else {
                                $scope.menuItemCategories[relIndex].count += 1;
                            }
                            
                            if (z == $scope.menuItems.length - 1) {
                                $scope.businessItems = $scope.menuItemCategories;
                            }
                        }
                    }
                    
                    var getMenuItems = function () {
                        MenuItems.getMenuItems($rootScope.user._id, 0, _menuTypeId).success(function (successData) {
                            console.log("ko", successData);
                            $scope.menuItemCategories = [];
                            $scope.menuItemCategoriesAdded = [];
                            $scope.menuItems = [];
                            $scope.menuItemsAdded = [];
                            var successData = (successData != 'null') ? successData : [];
                            for (a = 0; a < successData.length; a++) {
                                tagsObj = {'tagName':successData[a].tagName, 'iconClass':successData[a].iconClass};
                                if ($scope.menuItemsAdded.indexOf(successData[a]._id) == -1) {
                                
                                    //Check the rootScope order object to add already ordered items into this object
                                    $rootScope.currentSavedFoodOrders = $rootScope.currentSavedFoodOrders || [];
                                    
                                    for (b = 0; b < $rootScope.currentSavedFoodOrders.length; b++) {
                                        if ($rootScope.currentSavedFoodOrders[b]._businessId == $stateParams._businessId) {
                                            var thisTakeawaysOrderObject = $rootScope.currentSavedFoodOrders[b];
                                            for (c = 0; c < thisTakeawaysOrderObject.menuItems.length; c++) {
                                                console.log(thisTakeawaysOrderObject.menuItems[c]);
                                                if (thisTakeawaysOrderObject.menuItems[c].item._id == successData[a]._id) {
                                                    successData[a].itemsAddedToBasket = thisTakeawaysOrderObject.menuItems[c].item.itemsAddedToBasket;
                                                }
                                            }
                                        }
                                    }
                                
                                    $scope.menuItems.push(successData[a]);
                                    $scope.menuItemsAdded.push(successData[a]._id);
                                }
                                
                                if (a == successData.length - 1) {
                                    $scope.sortMenuItems();
                                }
                            }
                        }).error(function () {
                            getMenuItems();
                        });
                    }
                    
                    getMenuItems();
                }
                
                //Updates based on Outside events
                $rootScope.$on('menu-items-changed', function(event, args) {
                    $scope.getBusinessItems();
                    // do what you want to do
                })
                
                break;
            case 'MenuItemCategories':
                $scope.getBusinessItems = function () {
                    $rootScope.pageTitle = "My Menu Categories";
                    MenuItems.getMenuItemCategoriesForBusiness($rootScope.user._id).success(function (successData) {
                        console.log(successData);
                        if (successData != 'null') {
                            $scope.businessItems = successData;
                        }
                    }).error(function () {
                        $scope.getBusinessItems();
                    });
                }
                
                //Updates based on Outside events
                $rootScope.$on('menu-item-categories-changed', function(event, args) {
                    $scope.getBusinessItems();
                    // do what you want to do
                })
                break;
            case 'MenuItemSubCategories':
                $scope.getBusinessItems = function () {
                    $rootScope.pageTitle = "My Menu Sub-categories";
                    MenuItems.getMenuItemSubCategoriesForBusiness($rootScope.user._id).success(function (successData) {
                        console.log(successData);
                        if (successData != 'null') {
                            $scope.businessItems = successData;
                        }
                    }).error(function () {
                        $scope.getBusinessItems();
                    });
                }
                
                //Updates based on Outside events
                $rootScope.$on('menu-item-sub-categories-changed', function(event, args) {
                    $scope.getBusinessItems();
                    // do what you want to do
                })
                break;
            case 'MenuItemTemplateOptions':
                $scope.getBusinessItems = function () {
                    $rootScope.pageTitle = "My Menu Template Options";
                    MenuItems.getAllMenuItemTemplateOptionsForBusiness($rootScope.user._id).success(function (successData) {
                        var businessItems = [];
                        var businessItemIds = [];
                        console.log(successData);
                        successData = (successData != 'null') ? successData: [];
                        for (a = 0; a < successData.length; a ++) {
                            if (businessItemIds.indexOf(successData[a]._id) == -1) {
                                businessItems.push({
                                    'name': successData[a].Name,
                                    'relListingId': successData[a]._id,
                                    '_id': successData[a]._id,
                                    'priceRelevant': successData[a].PriceRelevant,
                                    'quantityRelevant': successData[a].QuantityRelevant,
                                    'categoryName': successData[a].menuExtraOptionCategoryName,
                                    'optionType': successData[a].Type,
                                    'options': [{
                                        'name': successData[a].menuExtraOptionOptionName
                                    }]
                                });
                                businessItemIds.push(successData[a]._id);
                            } else {
                                businessItems[businessItemIds.indexOf(successData[a]._id)].options.push({'name': successData[a].menuExtraOptionOptionName});
                            }
                        }
                        $scope.businessItems = businessItems;
                        console.log(businessItems);
                        
                    }).error(function () {
                        $scope.getBusinessItems();
                    });
                }
                
                //Updates based on Outside events
                $rootScope.$on('menu-item-template-options-changed', function(event, args) {
                    $scope.getBusinessItems();
                    // do what you want to do
                })
                break;
            case 'RequestedTaxiBookings':
                $scope.getBusinessItems = function () {
                    $rootScope.pageTitle = "Current Taxi Booking Requests";
                    Taxi.getTaxiBookingsForBusiness('allRequested', $rootScope.user._id).success(function (successData) {
                        console.log(successData);
                        if (successData != 'null') {
                            $scope.businessItems = successData;
                        }
                    }).error(function () {
                        $scope.getBusinessItems();
                    });
                }
                
                //Updates based on Outside events
                $rootScope.$on('taxi-booking-response-sent', function(event, args) {
                    $scope.getBusinessItems();
                    // do what you want to do
                })
                break;
            case 'OwnTaxiBookings':
                $scope.getBusinessItems = function () {
                    var mode = ($stateParams.timeScale == 'present') ? 'own': 'ownPast';
                    $rootScope.pageTitle = ($stateParams.timeScale == 'present') ? "My Current Taxi Bookings": "My Past Taxi Bookings";
                    Taxi.getTaxiBookingsForBusiness(mode, $rootScope.user._id).success(function (successData) {
                        console.log(successData);
                        if (successData != 'null') {
                            $scope.businessItems = successData;
                        }
                    }).error(function () {
                        $scope.getBusinessItems();
                    });
                }
                break;
            case 'myNYTEActivity':
                $scope.getBusinessItems = function () {
                    $rootScope.pageTitle = ($stateParams.timeScale == 'present') ? "My Current myNyte Activity" : "My Past myNyte Activity";
                    Profile.getMyNyteActivityForPerson($rootScope.user._profileId, $stateParams.timeScale).success(function (successData) {
                        console.log(successData);
                        $scope.businessItems = [
                            {name: 'Table Bookings', dbName: 'Table Booking', icon: 'ion-fork', show: true, items: []}, 
                            {name: 'Taxi Bookings', dbName: 'Taxi Booking', icon: 'ion-android-car', show: true, items: []}, 
                            /*{name: 'Claimed Offers', dbName: 'Offer', icon: 'ion-social-usd', show: true, items: []},*/
                            {name: 'Event Entry', dbName: 'Event Entry', icon: 'ion-clipboard', show: true, items: []}
                        ];
                        if (successData != 'null') {
                            var loopThroughBusinessItems = function (i) {
                                var loopCompletionFunction = function (i) {
                                    if (i < $scope.businessItems.length - 1) {
                                        loopThroughBusinessItems(i + 1);
                                    } else {
                                        console.log($scope.businessItems);
                                    }
                                }
                                var loopThroughSuccessData = function (ind) {

                                    successData[ind].timeRequested = (successData[ind].dateTimeRequested != null) ? $rootScope.getShortenedTimeString(successData[ind].dateTimeRequested): null;
                                    successData[ind].dateRequested = (successData[ind].dateTimeRequested != null) ? $rootScope.getShortenedDateString(successData[ind].dateTimeRequested): null;
                                    successData[ind].dateRequested = (successData[ind].dateTimeRequested != null) ? $rootScope.convertToDate($scope, new Date(successData[ind].dateRequested)): null;
                                    successData[ind].endTime = (successData[ind].endDateTime != null) ? $rootScope.getShortenedTimeString(successData[ind].endDateTime): null;
                                    successData[ind].endDate = (successData[ind].endDateTime != null) ? $rootScope.getShortenedDateString(successData[ind].endDateTime): null;
                                    successData[ind].endDate = (successData[ind].endDateTime != null) ? $rootScope.convertToDate($scope, new Date(successData[ind].endDate)): null;

                                    if (successData[ind].itemType == $scope.businessItems[i].dbName) {
                                        $scope.businessItems[i].items.push(successData[ind]);
                                    }
                                    
                                    if (ind < successData.length - 1) {
                                        loopThroughSuccessData(ind + 1);
                                    } else {
                                        loopCompletionFunction(i);
                                    }
                                }
                                
                                loopThroughSuccessData(0);
                            }

                            loopThroughBusinessItems(0);
                        }
                    }).error(function () {
                        $scope.getBusinessItems();
                    });
                }

                $scope.toggleBusinessItemCatVisibility = function (item) {
                    item.show = !item.show;
                }

                $scope.goToMyNyteActivity = function (item) {
                    $state.go('app.businessItem', {_id: item._id, itemType: item.itemType});
                }
                
                $rootScope.$on('taxi-booking-updated', function (event, args) {
                    $scope.getBusinessItems();
                });
                $rootScope.$on('table-booking-updated', function (event, args) {
                    $scope.getBusinessItems();
                });
                $rootScope.$on('event-entry-booking-updated', function (event, args) {
                    $scope.getBusinessItems();
                });
                break;
        };
        
        $scope.getBusinessItems();
    }]);

    app.controller('BusinessItemCtrl', ['$rootScope', '$state', '$stateParams', '$scope', '$ionicHistory', 'ionicTimePicker', '$ionicPopup', 'Notifications', 'Profile', 'Events', 'Offers', 'Taxi', 'MenuItems', 'TableBooking', 'Categories', 'Movies', function($rootScope, $state, $stateParams, $scope, $ionicHistory, ionicTimePicker, $ionicPopup, Notifications, Profile, Events, Offers, Taxi, MenuItems, TableBooking, Categories, Movies) {
        //Variables & Constants
        $scope.storedBusinessItem = {};
        $rootScope.hideSearch = true;
        console.log($stateParams);
        $scope.itemType = $stateParams.itemType;
        $rootScope.topRightButtonFunction = function () {
            if ($scope.editing) {
                $scope.businessItem = $scope.storedBusinessItem;
            } else {
                $scope.storedBusinessItem = angular.copy($scope.businessItem);
                /*
                for (var property in $scope.businessItem) {
                    if ($scope.businessItem.hasOwnProperty(property)) {
                        if (isArray($scope.businessItem[property]) || isObject($scope.businessItem[property])) {
                            if
                        } else {
                            $scope.storedBusinessItem[property] = $scope.businessItem[property];
                        }
                    }
                }
                */
                console.log($scope.storedBusinessItem);
            }
            
            if ($scope.extraTopRightFunction) {
                $scope.extraTopRightFunction();
            }
            
            $rootScope.currentlyEditing = !$rootScope.currentlyEditing;
            $scope.editing = !$scope.editing;
        };
        $scope.$on('$ionicView.enter', function() {
            console.log($stateParams);
            $rootScope.topRightButtonIsEdit = ($stateParams.timeScale == 'past') ? false : true;
            if ($stateParams.itemType == 'OwnEvents') {
                $rootScope.showStatsButton = true;
            }
        })
        
        $rootScope.editing = false;
        $rootScope.currentlyEditing = false;
        $scope.editing = false;
        
        var convertToReadableDate = function (obj) {
            var conversion = function (prop) {
                var newProp = $rootScope.getShortenedDateString(prop);
                newProp = $rootScope.convertToDate($scope, new Date(newProp));
                return newProp;
            }
            if (obj.listingType == 'Offer') {
                obj.endDateTime = conversion(obj.endDateTime);
                obj.startDateTime = conversion(obj.startDateTime);
            }
            else if (obj.listingType == 'Event') {
                obj.lastDateString = conversion(obj.lastDate);
                obj.DATEString = conversion(obj.DATE);
            }
            else if (obj.listingType == 'Movie') {
                obj.earliestShowingStartDate = conversion(obj.earliestShowingStartDate);
                obj.latestShowingEndDate = conversion(obj.latestShowingEndDate);
            }
        }
        console.log($stateParams.itemType);
        switch($stateParams.itemType) {
            case 'Movies':
                $scope.getBusinessItem = function () {
                    Movies.getMoviesForMaintenance('', $stateParams._id).success(function (successData) {
                        console.log(successData);
                        if (successData != 'null') {
                            convertToReadableDate(successData[0]);
                        }
                        $scope.businessItem = (successData != 'null') ? successData[0]: [];
                    }).error(function () {
                        $scope.getBusinessItem();
                    });
                }
                
                break;
            case 'OwnOffers':
                $scope.getBusinessItem = function () {
                    var _userId = ($rootScope.userLoggedIn) ? $rootScope.user._profileId: 0;
                    Offers.getOffer($stateParams._id, _userId).success(function (successData) {
                        console.log(successData);
                        if (successData != 'null') {
                            convertToReadableDate(successData[0]);
                        }
                        $scope.businessItem = (successData != 'null') ? successData[0]: [];
                        $scope.pageTitle = (successData != 'null') ? successData[0]: "Offer Error";
                    }).error(function () {
                        $scope.getBusinessItem();
                    });
                }
                
                break;
            case 'OwnEvents':
                var ipObj1 = {
                  callback: function (val) {  //Mandatory
                    $scope.businessItem.selectedDate1 = new Date(val);
                    $scope.businessItem.dateInputHTML = $rootScope.convertToDate($scope, $scope.businessItem.selectedDate1);
                    ipObj1.inputDate = new Date(val);
                    $scope.businessItem.dateChosen = true;
                    console.log('Return value from the datepicker popup is : ' + new Date(val));
                  },
                  disabledDates: [            //Optional
                    new Date(2016, 2, 16),
                    new Date(2015, 3, 16),
                    new Date(2015, 4, 16),
                    new Date(2015, 5, 16),
                    new Date('Wednesday, August 12, 2015'),
                    new Date("08-16-2016"),
                    new Date(1439676000000)
                  ],
                  from: new Date(), //Optional
                  to: new Date(), //Optional
                  inputDate: new Date(),      //Optional
                  mondayFirst: true,          //Optional
                  disableWeekdays: [],       //Optional
                  closeOnSelect: true,       //Optional
                  templateType: 'popup'       //Optional
                };
                
                //User Response Functions
                $scope.toggleTownCategory= function () {
                    $scope.showTownCategories = !$scope.showTownCategories;
                }
                $scope.toggleMusicCategory = function (musicCat) {
                    $scope.businessItem.currentMusicCategoryIndexBeingToggled = musicCat.index;
                    console.log("0", $scope.businessItem.currentMusicCategoryIndexBeingToggled);
                    for (a = 0; a < $scope.businessItem.chosenMusicStyleObjects.length; a++) {
                        if ($scope.businessItem.chosenMusicStyleObjects[a].index != musicCat.index) {
                            $scope.businessItem.chosenMusicStyleObjects[a].showMusicCategories = false;
                        }
                    }
                    musicCat.showMusicCategories = !musicCat.showMusicCategories;
                    $scope.businessItem.showMusicCategories = musicCat.showMusicCategories;
                }

                $scope.selectMusicCategory = function (musicCategory) {
                    $scope.businessItem.chosenMusicStyle = musicCategory;
                    
                    for (a = 0; a < $scope.businessItem.chosenMusicStyleObjects.length; a++) {
                        if ($scope.businessItem.chosenMusicStyleObjects[a].index == $scope.businessItem.currentMusicCategoryIndexBeingToggled) {
                            $scope.businessItem.chosenMusicStyleIds[a] = $scope.chosenMusicStyle._id;
                            if ($scope.businessItem.chosenMusicStyleObjects[a]._id != null) {
                                $scope.businessItem.musicStyles.push({_id: $scope.businessItem.chosenMusicStyleObjects[a]._id, name: $scope.businessItem.chosenMusicStyleObjects[a].name});
                            }
                            $scope.businessItem.chosenMusicStyleObjects[a]._id = musicCategory._id;
                            $scope.businessItem.chosenMusicStyleObjects[a].name = musicCategory.name;
                            $scope.businessItem.chosenMusicStyleObjects[a].showMusicCategories = false;
                            for (b = 0; b < $scope.businessItem.musicStyles.length; b++) {
                                if ($scope.businessItem.musicStyles[b].name == musicCategory.name) {
                                    $scope.businessItem.musicStyles.splice(b, 1);
                                }
                            }
                        }
                    }
                    console.log($scope.businessItem.chosenMusicStyleIds, $scope.businessItem.currentMusicCategoryIndexBeingToggled);
                    $scope.businessItem.showMusicCategories = false;
                }

                $scope.removeMusicStyle = function (style) {
                    var indexToRemove = null;
                    for (a = 0; a < $scope.businessItem.chosenMusicStyleObjects.length; a++) {
                        if ($scope.businessItem.chosenMusicStyleObjects[a].index == style.index) {
                            indexToRemove = a;
                            if ($scope.businessItem.chosenMusicStyleObjects[a]._id != null) {
                                $scope.businessItem.musicStyles.push({_id: $scope.businessItem.chosenMusicStyleObjects[a]._id, name: $scope.businessItem.chosenMusicStyleObjects[a].name});
                            }
                        }
                        if ($scope.businessItem.chosenMusicStyleObjects[a].index > style.index) {
                            $scope.businessItem.chosenMusicStyleObjects[a].index = $scope.businessItem.chosenMusicStyleObjects[a].index - 1;
                        }

                        if (a == $scope.businessItem.chosenMusicStyleObjects.length - 1) {
                            $scope.businessItem.chosenMusicStyleIds.splice(indexToRemove, 1);
                            $scope.businessItem.chosenMusicStyleObjects.splice(indexToRemove, 1);
                        }
                    }
                    $scope.businessItem.currentMusicStyleIndexToAdd = $scope.businessItem.currentMusicStyleIndexToAdd - 1;
                }

                $scope.newMusicStyle = function () {
                    if ($scope.businessItem.currentMusicStyleIndexToAdd == 3) {
                        return false;
                    }
                    $scope.businessItem.currentMusicStyleIndexToAdd = $scope.businessItem.currentMusicStyleIndexToAdd + 1;
                    $scope.businessItem.chosenMusicStyleObjects.push({
                        index: $scope.businessItem.currentMusicStyleIndexToAdd, 
                        _id: null, 
                        name: 'Select a Music Style',
                        showMusicCategories: false});
                    $scope.businessItem.chosenMusicStyleIds.push(null);
                    console.log($scope.businessItem.chosenMusicStyleObjects, $scope.businessItem.currentMusicStyleIndexToAdd);
                }

                $scope.toggleEventDateArrangement = function (arrangement) {
                    if (arrangement == 'weekly') {
                        $scope.businessItem.eventIsOneOff = false;
                        $scope.businessItem.eventIsWeekly = true;
                    } else {
                        $scope.businessItem.eventIsOneOff = true;
                        $scope.businessItem.eventIsWeekly = false;
                    }
                }

                $scope.openDatePicker = function(){
                  ionicDatePicker.openDatePicker(ipObj1);
                };

                $scope.toggleWeeksAheadVisibility = function () {
                    $scope.businessItem.showWeeksAhead = !$scope.businessItem.showWeeksAhead;
                }

                $scope.selectWeeksAhead = function (weeksAhead) {
                    $scope.businessItem.chosenWeeksAhead = weeksAhead;
                    $scope.businessItem.showWeeksAhead = false;
                }

                $scope.getBusinessItem = function () {
                    Categories.getAvailableMusicStyles().success(function (musicStyles) {
                        Events.getEvent($stateParams._id).success(function (successData) {
                            console.log(successData);
                            if (successData != 'null') {
                                convertToReadableDate(successData[0]);
                                $scope.businessItem = successData[0];
                                $scope.businessItem.musicStyles = musicStyles;

                                $scope.businessItem.currentMusicStyleIndexToAdd = 0;
                                $scope.businessItem.chosenMusicStyleObjects = [];
                                $scope.businessItem.chosenMusicStyleIds = [];
                                $scope.businessItem.chosenWeeksAhead = {_id: 1, name: '1 week ahead'};
                                $scope.businessItem.chosenWeekday = {_id: null, name: '1 week ahead'};
                                $scope.businessItem.eventHasGuestList = false;
                                $scope.businessItem.showWeeksAhead = false;
                                $scope.businessItem.guestListMax = ($scope.businessItem.guestListMax != null) ? parseInt($scope.businessItem.guestListMax): null;
                                $scope.businessItem.availableWeeks = [
                                    {_id: 1, name: '1 week ahead'},
                                    {_id: 2, name: '2 weeks ahead'},
                                    {_id: 3, name: '3 weeks ahead'},
                                    {_id: 4, name: '4 weeks ahead'},
                                    {_id: 5, name: '5 weeks ahead'},
                                    {_id: 6, name: '6 weeks ahead'},
                                    {_id: 7, name: '7 weeks ahead'}
                                ];

                                $scope.businessItem.selectedDate1 = new Date();
                                $scope.businessItem.todaysDate = new Date();
                                $scope.businessItem.finalDate = new Date();
                                $scope.businessItem.dateChosen = false;
                                
                                $scope.businessItem.dateInputHTML = 'Select a date for this event';

                                $scope.businessItem.eventHasGuestList = ($scope.businessItem.guestListAllowed != null) ? true: false;
                                $scope.businessItem.guestListMax = parseInt($scope.businessItem.guestListMax);
                                $scope.businessItem.eventIsOneOff = ($scope.businessItem.weekdayIndexId == null) ? true: false;
                                $scope.businessItem.eventIsWeekly = ($scope.businessItem.weekdayIndexId == null) ? false: true;
                                $scope.businessItem.selectedDate1 = new Date($scope.businessItem.DATE.split(' ')[0]);
                                $scope.businessItem.dateInputHTML = $rootScope.convertToDate($scope, $scope.businessItem.selectedDate1);

                                if ($scope.businessItem.musicStyle1 != null) {
                                    $scope.businessItem.chosenMusicStyleObjects.push({
                                        index: $scope.businessItem.currentMusicStyleIndexToAdd, 
                                        _id: $scope.businessItem.musicStyle1Id, 
                                        name: $scope.businessItem.musicStyle1,
                                        showMusicCategories: false});
                                    $scope.businessItem.chosenMusicStyleIds.push($scope.businessItem.musicStyle1Id);
                                    for (b = 0; b < $scope.businessItem.musicStyles.length; b++) {
                                        if ($scope.businessItem.musicStyles[b].name == $scope.businessItem.musicStyle1) {
                                            $scope.businessItem.musicStyles.splice(b, 1);
                                        }
                                    }
                                    $scope.businessItem.currentMusicStyleIndexToAdd = $scope.businessItem.currentMusicStyleIndexToAdd + 1;
                                }
                                if ($scope.businessItem.musicStyle2 != null) {
                                    $scope.businessItem.chosenMusicStyleObjects.push({
                                        index: $scope.businessItem.currentMusicStyleIndexToAdd, 
                                        _id: $scope.businessItem.musicStyle2Id, 
                                        name: $scope.businessItem.musicStyle2,
                                        showMusicCategories: false});
                                    $scope.businessItem.chosenMusicStyleIds.push($scope.businessItem.musicStyle2Id);
                                    for (b = 0; b < $scope.businessItem.musicStyles.length; b++) {
                                        if ($scope.businessItem.musicStyles[b].name == $scope.businessItem.musicStyle2) {
                                            $scope.businessItem.musicStyles.splice(b, 1);
                                        }
                                    }
                                    $scope.businessItem.currentMusicStyleIndexToAdd = $scope.businessItem.currentMusicStyleIndexToAdd + 1;
                                }
                                if ($scope.businessItem.musicStyle3 != null) {
                                    $scope.businessItem.chosenMusicStyleObjects.push({
                                        index: $scope.businessItem.currentMusicStyleIndexToAdd, 
                                        _id: $scope.businessItem.musicStyle3Id, 
                                        name: $scope.businessItem.musicStyle3,
                                        showMusicCategories: false});
                                    $scope.businessItem.chosenMusicStyleIds.push($scope.businessItem.musicStyle3Id);
                                    for (b = 0; b < $scope.businessItem.musicStyles.length; b++) {
                                        if ($scope.businessItem.musicStyles[b].name == $scope.businessItem.musicStyle3) {
                                            $scope.businessItem.musicStyles.splice(b, 1);
                                        }
                                    }
                                    $scope.businessItem.currentMusicStyleIndexToAdd = $scope.businessItem.currentMusicStyleIndexToAdd + 1;
                                }
                                if ($scope.businessItem.musicStyle4 != null) {
                                    $scope.businessItem.chosenMusicStyleObjects.push({
                                        index: $scope.businessItem.currentMusicStyleIndexToAdd, 
                                        _id: $scope.businessItem.musicStyle4Id, 
                                        name: $scope.businessItem.musicStyle4,
                                        showMusicCategories: false});
                                    $scope.businessItem.chosenMusicStyleIds.push($scope.businessItem.musicStyle4Id);
                                    for (b = 0; b < $scope.businessItem.musicStyles.length; b++) {
                                        if ($scope.businessItem.musicStyles[b].name == $scope.businessItem.musicStyle4) {
                                            $scope.businessItem.musicStyles.splice(b, 1);
                                        }
                                    }
                                    $scope.businessItem.currentMusicStyleIndexToAdd = $scope.businessItem.currentMusicStyleIndexToAdd + 1;
                                }

                                console.log($scope.businessItem.musicStyle1);
                                console.log($scope.businessItem.musicStylesApplied);
                                console.log($scope.businessItem);
                            }
                        }).error(function () {
                            $scope.getBusinessItem();
                        });
                    });
                }

                $scope.updateEvent = function (eventTitle, description, dressCode, guestListMax, dealsOnTheNight, extraInfo) {
                    $rootScope.appLoading = true;

                    $rootScope.prepareEventData = function ($scope, event, relDate, item) {
                        event._businessPlaceId = null;
                        event.dateTimeString = relDate.getFullYear() + '-' + (relDate.getMonth() + 1) + '-' + relDate.getDate() + ' 00:00';
                        event.weekdayIndex = (relDate.getDay() == 0) ? 7 : relDate.getDay();
                        event.weekdayIndex = (item.eventIsWeekly) ? event.weekdayIndex: null;
                        
                        if ($rootScope.user.businessTypeName == 'Nightclub' || $rootScope.user.businessTypeName == 'Bar') {
                            event._businessPlaceId = $rootScope.user._businessPlaceId;
                        } else {
                            event._businessPlaceId = $rootScope.user._businessPlaceId;
                        }

                        event.guestListMax = (event.guestListMax == null) ? 0: event.guestListMax;
                        event.weeksAhead = (item.eventIsOneOff) ? 0: item.chosenWeeksAhead._id;
                        event.eventHasGuestList = (item.eventHasGuestList) ? 1: 0;
                        console.log(event);
                    }

                    var event = $scope.businessItem;
                    event.guestListMax = guestListMax;
                    $rootScope.prepareEventData($scope, event, $scope.businessItem.selectedDate1, $scope.businessItem);

                    console.log($stateParams._id, event._businessPlaceId, event.name, event.description, event.dateTimeString.split(' ')[0], event.dressCode, event.guestListMax, event.dealsOnTheNight, event.extraInfo, event.eventHasGuestList, event.weekdayIndex, event.weeksAhead, $scope.businessItem.chosenMusicStyleObjects);
                    
                    var updateEvent = function (eventBusinessPlaceId, eventName, eventDescription, eventDateTimeString, eventDressCode, eventGuestListMax, eventDealsOnTheNight, eventExtraInfo, eventEventHasGuestList, eventWeekdayIndex, eventWeeksAhead) {
                        Events.updateEvent($stateParams._id, eventBusinessPlaceId, eventName, eventDescription, eventDateTimeString, eventDressCode, eventGuestListMax, eventDealsOnTheNight, eventExtraInfo, eventEventHasGuestList, eventWeekdayIndex, eventWeeksAhead, $scope.businessItem.chosenMusicStyleObjects).success(function (successData) {
                            $rootScope.appLoading = false;
                            $rootScope.editing = false;
                            $rootScope.currentlyEditing = false;
                            $scope.editing = false;
                        }).error(function () {
                        updateEvent(eventBusinessPlaceId, eventName, eventDescription, eventDateTimeString, eventDressCode, eventGuestListMax, eventDealsOnTheNight, eventExtraInfo, eventEventHasGuestList, eventWeekdayIndex, eventWeeksAhead);
                        });
                    }
                    
                    updateEvent(event._businessPlaceId, event.name, event.description, event.dateTimeString.split(' ')[0], event.dressCode, event.guestListMax, event.dealsOnTheNight, event.extraInfo, event.eventHasGuestList, event.weekdayIndex, event.weeksAhead);
                }
                break;
            case 'RequestedTableBookings':
            case 'OwnTableBookings':
                $rootScope.topRightButtonIsEdit = false;
                $scope.getBusinessItem = function () {
                    TableBooking.getTableBookingById($stateParams._id).success(function (successData) {
                        $scope.businessItem = successData[0];
                        successData[0].timeString = $rootScope.getShortenedTimeString(successData[0].dateTimeRequested);
                        successData[0].timeIntegerString = $rootScope.getTimeInTotalSeconds(successData[0].dateTimeRequested);
                        successData[0].dateString = $rootScope.getShortenedDateString(successData[0].dateTimeRequested);
                        successData[0].convertedDateString = $rootScope.convertToDate($scope, new Date(successData[0].dateString));
                        if (ipObj2 != null) {
                            ipObj2.inputTime = successData[0].timeIntegerString;
                        }
                        console.log($scope.businessItem);
                    }).error(function () {
                    
                    });
                }

                $scope.finishUpdatingTableBooking = function (accepted, rejected, completed, alternateDate) {
                    TableBooking.updateTableBooking($stateParams._id, accepted, rejected, completed, alternateDate).success(function (successData) {
                        
                        if (accepted == 1 ||
                            rejected == 1 ||
                            (rejected == 0 && accepted == 0 && alternateDate != null)
                        ) {
                            var text = (accepted == 1) ? "accepted": "rejected";
                            if (alternateDate != null) {
                                text += ", but a different Time was suggested.";
                            } else {
                                text += ".";
                            }
                            var contents = "Your table booking request was " + text;
                            var header = "Table Booking Updated";
                            var dataObj = {
                                "actionFunction": "goToBusinessItem",
                                "businessItemType": "myNYTEActivity",
                                "_businessItemId": $stateParams._id
                            };
                            
                            var recipientsArray = [successData[0]._customerProfileId];
                            
                            $rootScope.prepareMessageNotificationFinal(recipientsArray, contents, header, dataObj);
                        }
                        
                        $rootScope.$broadcast('table-booking-updated');
                        $ionicHistory.goBack();
                        $rootScope.appLoading = false;
                    }).error(function () {

                    });
                }

                var ipObj2 = {
                    callback: function (val) {      //Mandatory
                      if (typeof (val) === 'undefined') {
                        console.log('Time not selected');
                      } else if (val == $scope.businessItem.timeIntegerString){
                        window.setTimeout(function () {
                            $ionicPopup.show({
                                title: 'Select a different time',
                                template: '<p>The booking time you have suggested is the same as the booking time originally requested. Please suggest a different time, or you can accept the booking.</p>',
                                //subTitle: 'Are you sure you want to Delete this item?',
                                scope: $scope,
                                buttons: [
                                    { 
                                        text: 'Close',
                                        onTap: function(e) {
                                            window.setTimeout(function () {$scope.openTimePicker()}, 50);
                                        } 
                                    }
                                ]
                            });
                        }, 10)
                         
                      } else {
                        $rootScope.appLoading = true;
                        $scope.selectedTime = new Date(val * 1000);
                        $scope.selectedHour = ($scope.selectedTime.getUTCHours() < 10) ? '0' + $scope.selectedTime.getUTCHours(): $scope.selectedTime.getUTCHours();
                        $scope.selectedMinutes = ($scope.selectedTime.getUTCMinutes() < 10) ? '0' + $scope.selectedTime.getUTCMinutes(): $scope.selectedTime.getUTCMinutes();
                        var altDateTime = $scope.businessItem.dateTimeRequested.substr(0, $scope.businessItem.dateTimeRequested.indexOf(' ')) + ' ' + $scope.selectedHour + ':' + $scope.selectedMinutes;
                        console.log(altDateTime);
                        
                        $scope.finishUpdatingTableBooking(0, 0, 0, altDateTime);
                        
                        console.log('Selected epoch is : ', ipObj2.inputTime, 'and the time is ', $scope.selectedTime.getUTCHours(), 'H :', $scope.selectedTime.getUTCMinutes(), 'M');
                      }
                    },
                    inputTime:64800,   //Optional
                    format: 12,         //Optional
                    step: 10,           //Optional
                    setLabel: 'Suggest'    //Optional
                };

                $scope.openTimePicker = function(){
                  ionicTimePicker.openTimePicker(ipObj2);
                };

                $scope.updateTableBooking = function (updateType) {
                    $rootScope.appLoading = true;
                    var accept = 0, reject = 0, alternateDate = null;

                    if (updateType == 'accept') {
                        accept = 1;
                    } else if (updateType == 'reject') {
                        reject = 1;
                    }
                    console.log($stateParams._id, accept, reject, 0, alternateDate);
                    $scope.finishUpdatingTableBooking(accept, reject, 0, alternateDate);
                }
                break;
            case 'RequestedTakeawayOrders':
                $rootScope.topRightButtonIsEdit = false;
                $scope.getBusinessItem = function () {
                    var menuOrderTotalPrice = 0;
                    MenuItems.getMenuOrderForBusiness($stateParams._id).success(function (successData) {
                        console.log(successData);
                        if (successData != 'null') {
                            $scope.businessItem = successData;
                            console.log($scope.businessItem);
                            for (a = 0; a < $scope.businessItem.length; a++) {
                                var totalPrice = $scope.businessItem[a].quantity * parseFloat($scope.businessItem[a].Price);
                                $scope.businessItem[a].totalPrice = (totalPrice).formatMoney(2);
                                menuOrderTotalPrice += parseFloat($scope.businessItem[a].Price) * $scope.businessItem[a].quantity;
                            }
                            $scope.menuOrderTotalPrice = (menuOrderTotalPrice).formatMoney(2);
                        }
                    }).error(function () {
                    
                    });
                }
                
                $scope.respondToMenuOrder = function (responseType) {
                    var responseString = '';
                    if (responseType == 'accept') {
                        responseString = 'acceptMenuOrder';
                    }
                    else if (responseType == 'reject') {
                        responseString = 'rejectMenuOrder';
                    }
                    else {
                        responseString = 'acceptMenuOrderWithConditions';
                    }
                    MenuItems.acceptOrRejectMenuOrder($stateParams._id, responseString).success(function (successData) {
                        $rootScope.$broadcast('menu-order-updated');
                        $state.go('app.businessItems', {'itemType': 'RequestedTakeawayOrders', 'timeScale': 'present'});
                        console.log(successData);
                    }).error(function () {
                    
                    });
                }
                break;
            case 'OwnTakeawayOrders':
                $rootScope.topRightButtonIsEdit = false;
                $scope.getBusinessItem = function () {
                    var menuOrderTotalPrice = 0;
                    MenuItems.getMenuOrderForBusiness($stateParams._id).success(function (successData) {
                        console.log(successData);
                        if (successData != 'null') {
                            $scope.businessItem = successData;
                            console.log($scope.businessItem);
                            for (a = 0; a < $scope.businessItem.length; a++) {
                                var totalPrice = $scope.businessItem[a].quantity * parseFloat($scope.businessItem[a].Price);
                                $scope.businessItem[a].totalPrice = (totalPrice).formatMoney(2);
                                menuOrderTotalPrice += parseFloat($scope.businessItem[a].Price) * $scope.businessItem[a].quantity;
                            }
                            $scope.menuOrderTotalPrice = (menuOrderTotalPrice).formatMoney(2);
                        }
                    }).error(function () {
                    
                    });
                }
                
                break;
            case 'MenuItemCategories':
                $scope.getBusinessItem = function () {
                    $scope.existingCatNames = [];
                    MenuItems.getMenuItemCategoriesForBusiness($rootScope.user._id).success(function (successData) {
                        if (successData != 'null') {
                            for (a = 0; a < successData.length; a++) {
                                $scope.existingCatNames.push(successData[a].name);
                            }
                        }
                        MenuItems.getMenuItemCategoryDetailsForBusiness($rootScope.user._id, $stateParams._id).success(function (successData2) {
                            if (successData2 != 'null') {
                                $scope.businessItem = successData2[0];
                                $scope.originalCatName = successData2[0].name;
                            }
                            
                            $scope.updateMenuCategory = function (catName, description) {
                                console.log(catName, description);
                                $rootScope.appLoading = true;
                                MenuItems.updateMenuItemCategoryDetailsForBusiness($rootScope.user._id, $stateParams._id, catName, description).success(function (successData2) {
                                    console.log(successData2);
                                    $rootScope.appLoading = false;
                                    $rootScope.editing = false;
                                    $rootScope.currentlyEditing = false;
                                    $scope.editing = false;
                                }).error(function () {
                                
                                });
                            }
                            
                        }).error(function () {
                        
                        });
                    }).error(function () {
                    
                    });
                }
                
                break;
            case 'MenuItemSubCategories':
                $scope.getBusinessItem = function () {
                    $scope.existingCatNames = [];
                    MenuItems.getMenuItemSubCategoriesForBusiness($rootScope.user._id).success(function (successData) {
                        if (successData != 'null') {
                            for (a = 0; a < successData.length; a++) {
                                $scope.existingCatNames.push(successData[a].name);
                            }
                        }
                        MenuItems.getMenuItemSubCategoryDetailsForBusiness($rootScope.user._id, $stateParams._id).success(function (successData2) {
                            if (successData2 != 'null') {
                                $scope.businessItem = successData2[0];
                                $scope.originalCatName = successData2[0].name;
                            }
                            
                    console.log("what the");
                            $scope.updateMenuSubCategory = function (catName, description) {
                                console.log(catName, description);
                                $rootScope.appLoading = true;
                                MenuItems.updateMenuItemSubCategoryDetailsForBusiness($rootScope.user._id, $stateParams._id, catName, description).success(function (successData2) {
                                    console.log('ko', successData2);
                                    $rootScope.appLoading = false;
                                    $rootScope.editing = false;
                                    $rootScope.currentlyEditing = false;
                                    $scope.editing = false;
                                }).error(function () {
                                
                                });
                            }
                            
                        }).error(function () {
                        
                        });
                    }).error(function () {
                    
                    });
                }
                
                break;
            case 'OwnMenuItems':
                $scope.showTagOptions = true;
                $scope.showExtraOptionsOptions = true;
                $scope.getBusinessItem = function () {
                    $scope.existingCatNames = [];
                    
                    $scope.appliedOptions = [];
                    $scope.appliedOptionsNames = [];
                    $scope.appliedTags = [];
                    $scope.appliedTagsNames = [];
                    $scope.preappliedTags = [];
                    $scope.preappliedTagsNames = [];
                    $scope.preappliedOptions = [];
                    $scope.preappliedOptionsNames = [];
                    
                    var applyPreappliedObjects = function () {
                        $scope.preappliedTags = $scope.appliedTags;
                        $scope.preappliedTagsNames = $scope.appliedTagsNames;
                        $scope.preappliedOptions = $scope.appliedOptions;
                        $scope.preappliedOptionsNames = $scope.appliedOptionsNames;
                    }
                    
                    var reconcilePreappliedObjects = function () {
                        $scope.appliedTags = $scope.preappliedTags;
                        $scope.appliedTagsNames = $scope.preappliedTagsNames;
                        $scope.appliedOptions = $scope.preappliedOptions;
                        $scope.appliedOptionsNames = $scope.preappliedOptionsNames;
                    }
                    
                    $scope.extraTopRightFunction = function () {
                        applyPreappliedObjects();
                    }
                    
                    MenuItems.getMenuItem($rootScope.user._id, $stateParams._id).success(function (successData) {
                        $scope.businessItem = successData[0];
                        $scope.selectedCategory = {'_id': $scope.businessItem._menuItemCategoryId, 'name': $scope.businessItem.menuItemCategoryName};
                        $scope.selectedSubCategory = ($scope.businessItem._menuItemSubCategoryId != null) ? {'_id': $scope.businessItem._menuItemSubCategoryId, 'name': $scope.businessItem.menuItemSubCategoryName} : {'_id': null, 'name': 'Select a Sub-Category'};
                        for (a = 0; a < successData.length; a++) {
                            var price = Math.round( parseFloat(successData[a].Price) * 1e2 ) / 1e2;
                            successData[a].Price = parseFloat(successData[a].Price);
                            if (successData[a]._menuItemTagId != null && $scope.appliedTagsNames.indexOf(successData[a].menuItemTagName) == -1) {
                                $scope.appliedTags.push({
                                    '_id': successData[a]._menuItemTagId,
                                    'name': successData[a].menuItemTagName,
                                    '_menuItemTagGroupId': successData[a]._menuItemTagGroupId});
                                $scope.appliedTagsNames.push(successData[a].menuItemTagName);
                            }
                            if (successData[a]._menuItemExtraOptionId != null && $scope.appliedOptionsNames.indexOf(successData[a].menuItemExtraOptionName) == -1) {
                                $scope.appliedOptions.push({
                                    '_id': successData[a]._menuItemExtraOptionId,
                                    'Name': successData[a].menuItemExtraOptionName});
                                $scope.appliedOptionsNames.push(successData[a].menuItemExtraOptionName);
                            }
                        }
                        
                        applyPreappliedObjects();
                            
                        $scope.availableTags = {};
                        $scope.availableTags.singularTags = [];
                        $scope.availableTags.groupTags = [];
                        MenuItems.getAllMenuItemTags().success(function (tags) {
                            console.log("ya", tags.length);
                            for (a = 0; a < tags.length; a++) {
                                console.log(tags.length);
                                if (tags[a]._menuItemTagGroupId == null) {
                                    $scope.availableTags.singularTags.push(tags[a]);
                                } else {
                                    console.log("blah");
                                    var tagAdded = false;
                                    for (b = 0; b < $scope.availableTags.groupTags.length; b++) {
                                        console.log($scope.availableTags.groupTags.length);
                                            $scope.availableTags.groupTags[b].array.push(tags[a]);
                                            tagAdded = true;
                                    }
                                    if (!tagAdded) {
                                        $scope.availableTags.groupTags.push(
                                            {_menuItemTagGroupId: tags[a]._menuItemTagGroupId,
                                             array: [tags[a]]});
                                    }
                                }
                            }
                        }).error(function () {
                        
                        });
                        MenuItems.getMenuItemCategoriesForBusiness($rootScope.user._id).success(function (successData) {
                            $scope.menuItemCategories = successData;
                        }).error(function () {
                        
                        });
                        MenuItems.getMenuItemSubCategoriesForBusiness($rootScope.user._id).success(function (successData) {
                            $scope.menuItemSubCategories = successData;
                            $scope.selectedSubCategory.name = ($scope.menuItemSubCategories.length == 0) ? 'No Sub-Categories to select': $scope.selectedSubCategory.name;
                        }).error(function () {
                        
                        });
                        MenuItems.getMenuItemOptionsForBusiness($rootScope.user._id).success(function (successData) {
                            $scope.menuItemOptions = successData || [];
                        }).error(function () {
                        
                        });
                            
                        
                    }).error(function () {
                    
                    });
                    
                    //User Response Functions
                    $scope.selectCategory = function (category) {
                        $scope.showMenuItemCategories = false;
                        $scope.selectedCategory = category;
                    }
                    $scope.toggleMenuCatDisplay = function () {
                        $scope.showMenuItemCategories = ($scope.editing) ? !$scope.showMenuItemCategories: $scope.showMenuItemCategories;
                    }

                    $scope.selectSubCategory = function (subcategory) {
                        $scope.showMenuItemSubCategories = false;
                        $scope.selectedSubCategory = subcategory;
                    }
                    $scope.toggleMenuSubCatDisplay = function () {
                        $scope.showMenuItemSubCategories = ($scope.editing) ? !$scope.showMenuItemSubCategories: $scope.showMenuItemSubCategories;
                    }
                    
                    $scope.addItemToMenu = function (itemName, price, description) {
                        console.log("hi");
                        console.log($scope.MenuItems);
                        completeAdd(itemName, price, description);
                    }
                    
                    $scope.applyOption = function (option) {
                        var optionNameIndex = $scope.preappliedOptionsNames.indexOf(option.Name);
                        if (optionNameIndex == -1) {
                            $scope.preappliedOptionsNames.push(option.Name);
                            $scope.preappliedOptions.push(option);
                        } else {
                            $scope.preappliedOptionsNames.splice(optionNameIndex, 1);
                            $scope.preappliedOptions.splice(optionNameIndex, 1);
                        }
                    }
                    $scope.applyTag = function (group, tag) {
                        console.log(tag);
                        var tagNameIndex = $scope.preappliedTagsNames.indexOf(tag.name);
                        if (tagNameIndex == -1) {
                            console.log(group);
                            
                            $scope.preappliedTags.push(tag);
                            $scope.preappliedTagsNames.push(tag.name);
                            
                            for (a = 0; a < $scope.preappliedTags.length; a++) {
                                console.log($scope.preappliedTags[a].name);
                                if ($scope.preappliedTags[a]._menuItemTagGroupId != null
                                    && $scope.preappliedTags[a]._menuItemTagGroupId == tag._menuItemTagGroupId
                                    && $scope.preappliedTags[a]._id != tag._id) {
                                    $scope.preappliedTags.splice(a, 1);
                                    $scope.preappliedTagsNames.splice(a, 1);
                                }
                            }
                        } else {
                            $scope.preappliedTags.splice(tagNameIndex, 1);
                            $scope.preappliedTagsNames.splice(tagNameIndex, 1);
                        }
                    }
                    
                    $scope.updateMenuItem = function (itemName, price, description) {
                        console.log(itemName, description);
                        $rootScope.appLoading = true;
                        var appliedOptionsFinal = [];
                        for (a = 0; a < $scope.appliedOptions.length; a++) {
                            appliedOptionsFinal.push({_id: $scope.appliedOptions[a]._id});
                        }
                        var appliedTagsFinal = [];
                        for (a = 0; a < $scope.appliedTags.length; a++) {
                            appliedTagsFinal.push({_id: $scope.appliedTags[a]._id});
                        }
                    
                        MenuItems.updateMenuItemDetails($rootScope.user._id, $stateParams._id, $scope.selectedCategory._id, $scope.selectedSubCategory._id, itemName, price, description, appliedOptionsFinal, appliedTagsFinal).success(function (successData2) {
                            reconcilePreappliedObjects();
                            $rootScope.$broadcast('menu-items-changed');
                            $rootScope.appLoading = false;
                            $rootScope.editing = false;
                            $rootScope.currentlyEditing = false;
                            $scope.editing = false;
                        }).error(function () {
                        
                        });
                    }
                }
                
                break;
            case 'MenuItemTemplateOptions':
                $scope.getBusinessItem = function () {
                    $scope.showChangeOrderButtons = false;
                
                    MenuItems.getMenuTemplateOptionCategories().success(function (successData) {
                        console.log("hy", successData);
                        $scope.menuItemTemplateOptionCategories = (successData != 'null') ? successData : [];
                    }).error(function () {
                    
                    });
                    MenuItems.getMenuItemTemplateOption($rootScope.user._id, $stateParams._id).success(function (successData) {
                        var businessItems = [];
                        var businessItemIds = [];
                        console.log(successData);
                        successData = (successData != 'null') ? successData: [];
                        for (a = 0; a < successData.length; a ++) {
                            if (businessItemIds.indexOf(successData[a]._id) == -1) {
                                businessItems.push({
                                    'name': successData[a].Name,
                                    'relListingId': successData[a]._id,
                                    '_id': successData[a]._id,
                                    'priceRelevant': (successData[a].PriceRelevant == '1') ? true: false,
                                    'quantityRelevant': (successData[a].QuantityRelevant == '1') ? true: false,
                                    'categoryName': successData[a].menuExtraOptionCategoryName,
                                    'type': successData[a].Type,
                                    'options': [{
                                        'name': successData[a].menuExtraOptionOptionName,
                                        'extraPrice': (successData[a].ExtraPrice != null) ? parseFloat(successData[a].ExtraPrice) : 0.00,
                                        '_id':  successData[a]._menuExtraOptionOptionId,
                                        'orderIndex':  successData[a].orderIndex
                                    }]
                                });
                                businessItemIds.push(successData[a]._id);
                            } else {
                                businessItems[businessItemIds.indexOf(successData[a]._id)].options.push({
                                    'name': successData[a].menuExtraOptionOptionName,
                                    'extraPrice': (successData[a].ExtraPrice != null) ? parseFloat(successData[a].ExtraPrice) : 0.00,
                                    '_id': successData[a]._menuExtraOptionOptionId,
                                    'orderIndex':  successData[a].orderIndex
                                });
                            }
                        }
                        $scope.selectedCategory = {'_id': successData[0]._menuExtraOptionCategoryId, 'Name': successData[0].menuExtraOptionCategoryName};
                        $scope.businessItem = businessItems[0];
                        
                        //User Based functions
                        
                        $scope.selectCategory = function (category) {
                            $scope.showMenuItemTemplateOptionCategories = false;
                            $scope.selectedCategory = category;
                        }
                        $scope.toggleMenuCatDisplay = function () {
                            $scope.showMenuItemTemplateOptionCategories = !$scope.showMenuItemTemplateOptionCategories;
                        }
                        $scope.togglePriceRel = function (item) {
                            item.priceRelevant = !item.priceRelevant;
                        }
                        $scope.toggleQuantityRel = function (item) {
                            console.log(item.quantityRelevant);
                            item.quantityRelevant = !item.quantityRelevant;
                            console.log(item.quantityRelevant);
                        }
                        
                        $scope.updateMenuItemTemplateOption = function (option) {
                            console.log(option);
                            MenuItems.updateMenuItemTemplateOption($rootScope.user._id, option, $scope.selectedCategory._id).success(function (successData) {
                                console.log(successData);
                                $rootScope.appLoading = false;
                                $rootScope.editing = false;
                                $rootScope.currentlyEditing = false;
                                $scope.editing = false;
                            }).error(function () {
                            
                            });
                        }
                        
                        $scope.moveOptionChoiceUp = function (choice) {
                            var orderIndexToApply = parseInt(choice.orderIndex) - 1;
                            
                            for (a = 0; a < $scope.businessItem.options.length; a++) {
                                if ($scope.businessItem.options[a].orderIndex == orderIndexToApply) {
                                    $scope.businessItem.options[a].orderIndex = orderIndexToApply + 1;
                                    var tempObject = $scope.businessItem.options[a];
                                    $scope.businessItem.options.splice(a, 1);
                                    $scope.businessItem.options.splice(a + 1, 0, tempObject);
                                }
                            }
                            
                            choice.orderIndex = orderIndexToApply;
                        }
                        
                        $scope.moveOptionChoiceDown = function (choice) {
                            var orderIndexToApply = parseInt(choice.orderIndex) + 1;
                            console.log(choice);
                            
                            for (a = 0; a < $scope.businessItem.options.length; a++) {
                                if ($scope.businessItem.options[a].orderIndex == orderIndexToApply) {
                                    $scope.businessItem.options[a].orderIndex = orderIndexToApply - 1;
                                    var tempObject = $scope.businessItem.options[a];
                                    $scope.businessItem.options.splice(a, 1);
                                    $scope.businessItem.options.splice(a - 1, 0, tempObject);
                                }
                            }
                            choice.orderIndex = orderIndexToApply;
                        }
                        
                        $scope.deleteOptionChoice = function (optionChoice) {
                            console.log(optionChoice);
                            $rootScope.appLoading = true;
                            MenuItems.deleteMenuItemTemplateOptionOption(optionChoice._id).success(function (successData) {
                                    console.log(optionChoice);
                                for (a = 0; a < $scope.businessItem.options.length; a++) {
                                    if ($scope.businessItem.options[a]._id == optionChoice._id) {
                                        $scope.businessItem.options.splice(a, 1);
                                        $scope.storedBusinessItem.options.splice(a, 1);
                                    }
                                    if ($scope.businessItem.options[a].orderIndex > optionChoice.orderIndex) {
                                        $scope.businessItem.options[a].orderIndex = parseInt($scope.businessItem.options[a].orderIndex) - 1;
                                        $scope.storedBusinessItem.options[a].orderIndex = parseInt($scope.storedBusinessItem.options[a].orderIndex) - 1;
                                    }
                                }
                                $scope.currentOptionBeingAdded.orderIndex = $scope.businessItem.options.length + 1;
                                $rootScope.appLoading = false;
                            }).error(function () {
                            
                            });
                        }
                        
                        $scope.currentOptionBeingAdded = {'name': '', 'extraPrice': 0.00, 'orderIndex': $scope.businessItem.options.length + 1};
                        $scope.createOptionChoice = function () {
                            console.log($scope.currentOptionBeingAdded);
                            $rootScope.appLoading = true;
                            MenuItems.createMenuItemTemplateOptionOption($stateParams._id, $scope.currentOptionBeingAdded).success(function (successData) {
                                $scope.businessItem.options.splice($scope.currentOptionBeingAdded.orderIndex - 1, 0, $scope.currentOptionBeingAdded);
                                for (a = $scope.currentOptionBeingAdded.orderIndex; a < $scope.businessItem.options.length; a++) {
                                    $scope.businessItem.options[a].orderIndex = parseInt($scope.businessItem.options[a].orderIndex) + 1;
                                    $scope.storedBusinessItem.options[a].orderIndex = parseInt($scope.storedBusinessItem.options[a].orderIndex) - 1;
                                }
                                
                                $scope.currentOptionBeingAdded = {'name': '', 'extraPrice': 0.00, 'orderIndex': $scope.businessItem.options.length + 1};
                                    console.log(successData);
                                
                                $rootScope.appLoading = false;
                            }).error(function () {
                            
                            });
                        }
                        
                        console.log(businessItems);
                        
                    }).error(function () {
                    
                    });
                }
                
                break;
            case 'RequestedTaxiBookings':
                $rootScope.topRightButtonIsEdit = false;
                $scope.getBusinessItem = function () {
                    Taxi.getTaxiBooking($stateParams._id, $rootScope.user._id).success(function (successData) {
                        console.log(successData);
                        if (successData != 'null') {
                            $scope.businessItem = successData[0];
                            
                            $scope.businessItem.newLowestPrice = 0;
                            $scope.businessItem.newQuickestTime = 0;
                        }
                    }).error(function () {
                    
                    });
                }
                
                $scope.respondToTaxiBookingRequest = function () {
                    
                    Taxi.respondToTaxiBooking($rootScope.user._id, $stateParams._id, $scope.businessItem.newLowestPrice, $scope.businessItem.newQuickestTime).success(function (successData) {
                        console.log(successData);
                        $rootScope.clearAllExpiredTransactions();
                        $rootScope.$broadcast('taxi-booking-response-sent');
                        $state.go('app.businessItems', {'itemType': 'RequestedTaxiBookings'});
                    }).error(function () {
                    
                    });
                }
                break;
            case 'OwnTaxiBookings':
                $rootScope.topRightButtonIsEdit = false;
                $scope.getBusinessItem = function () {
                    Taxi.getTaxiBooking($stateParams._id, $rootScope.user._id).success(function (successData) {
                        console.log(successData);
                        if (successData != 'null') {
                            $scope.businessItem = successData[0];
                            
                            if ($scope.businessItem.quickestIsRequired == '1') {
                                $scope.responseType = 'LowestPrice';
                                $scope.responseInputPlaceholder = "00.00";
                            } else {
                                $scope.responseType = 'QuickestTime';
                                $scope.responseInputPlaceholder = "00";
                            }
                        }
                    }).error(function () {
                    
                    });
                }
                
                $scope.updateTaxiBooking = function (response) {
                    console.log(response);
                    Taxi.updateTaxiBookingByPerson($stateParams._id, cancelled, completed).success(function (successData) {
                        console.log(successData);
                        if ($scope.businessItem.quickestIsRequired == '1') {
                                $scope.businessItem.quickestTime = response;
                            } else {
                                $scope.businessItem.lowestPrice = response;
                            }
                        $rootScope.$broadcast('taxi-booking-response-sent');
                        $state.go('app.businessItems', {'itemType': 'OwnTaxiBookings'});
                    }).error(function () {
                    
                    });
                }
                break;
            case 'Table Booking':
                $rootScope.topRightButtonIsEdit = false;
                $scope.getBusinessItem = function () {
                    TableBooking.getTableBookingById($stateParams._id).success(function (successData) {
                        $scope.businessItem = successData[0];
                        successData[0].timeString = $rootScope.getShortenedTimeString(successData[0].dateTimeRequested);
                        successData[0].suggestedTimeString = (successData[0].dateTimeSuggested == null) ? null : $rootScope.getShortenedTimeString(successData[0].dateTimeSuggested);
                        successData[0].dateString = $rootScope.getShortenedDateString(successData[0].dateTimeRequested);
                        successData[0].requestedTimeIntegerString = $rootScope.getTimeInTotalSeconds(successData[0].dateTimeRequested);
                        successData[0].suggestedTimeIntegerString = (successData[0].dateTimeSuggested != null) ? $rootScope.getTimeInTotalSeconds(successData[0].dateTimeSuggested) : null;
                        console.log($scope.businessItem);
                    }).error(function () {
                    
                    });
                }

                $scope.finishUpdatingTableBooking = function (accepted, rejected, completed, cancelled, alternateDate) {
                    TableBooking.updateTableBookingByPerson($stateParams._id, accepted, rejected, cancelled, completed, alternateDate).success(function (successData) {
                        var text = null;
                        if (accepted == 1) {
                            text = "confirmed";
                        }
                        if (rejected == 1) {
                            text = "rejected";
                        }
                        if (cancelled == 1) {
                            text = "cancelled";
                        }
                        if (completed == 1) {
                            text = "completed";
                        }
                        
                        if (alternateDate != null && rejected == 1) {
                            text += ", but a different Time was suggested.";
                        } else {
                            text += ".";
                        }
                        var contents = "Table booking request was " + text;
                        var header = "Table Booking Updated";
                        var dataObj = {
                            "actionFunction": "goToBusinessItem",
                            "businessItemType": "RequestedTableBookings",
                            "_businessItemId": $stateParams._id
                        };
                        
                        var recipientsArray = [successData[0]._businessId];
                        $rootScope.prepareMessageNotificationFinal(recipientsArray, contents, header, dataObj);
                    
                        $rootScope.$broadcast('table-booking-updated');
                        $ionicHistory.goBack();
                        $rootScope.appLoading = false;
                    }).error(function () {

                    });
                }

                var ipObj2 = {
                    callback: function (val) {      //Mandatory
                      if (typeof (val) === 'undefined') {
                        console.log('Time not selected');
                      } else if (val == $scope.businessItem.requestedTimeIntegerString
                            || val == $scope.businessItem.suggestedTimeIntegerString){
                        var message = (val == $scope.businessItem.suggestedTimeIntegerString) ? 
                            '<p>The booking time you have suggested is the same as the booking time the restaurant has suggested. Please suggest a different time, or you can accept the booking.</p>' :
                            '<p>The booking time you have suggested is the same as the booking time you originally requested, which was refused by the resaurant. Please suggest a different time.</p>' ;
                        window.setTimeout(function () {
                            $ionicPopup.show({
                                title: 'Select a different time',
                                template: message,
                                //subTitle: 'Are you sure you want to Delete this item?',
                                scope: $scope,
                                buttons: [
                                    { 
                                        text: 'Close',
                                        onTap: function(e) {
                                            window.setTimeout(function () {$scope.openTimePicker()}, 50);
                                        } 
                                    }
                                ]
                            });
                        }, 10)
                         
                      } else {
                        $rootScope.appLoading = true;
                        $scope.selectedTime = new Date(val * 1000);
                        $scope.selectedHour = ($scope.selectedTime.getUTCHours() < 10) ? '0' + $scope.selectedTime.getUTCHours(): $scope.selectedTime.getUTCHours();
                        $scope.selectedMinutes = ($scope.selectedTime.getUTCMinutes() < 10) ? '0' + $scope.selectedTime.getUTCMinutes(): $scope.selectedTime.getUTCMinutes();
                        var altDateTime = $scope.businessItem.dateTimeRequested.substr(0, $scope.businessItem.dateTimeRequested.indexOf(' ')) + ' ' + $scope.selectedHour + ':' + $scope.selectedMinutes;
                        
                        $scope.finishUpdatingTableBooking(0, 0, 0, 0, altDateTime);
                        
                        console.log('Selected epoch is : ', ipObj2.inputTime, 'and the time is ', $scope.selectedTime.getUTCHours(), 'H :', $scope.selectedTime.getUTCMinutes(), 'M');
                      }
                    },
                    inputTime:64800,   //Optional
                    format: 12,         //Optional
                    step: 10,           //Optional
                    setLabel: 'Suggest'    //Optional
                };

                $scope.updateTableBooking = function (updateType) {
                    $rootScope.appLoading = true;
                    var accepted = (updateType == 'accept') ? 1: $scope.businessItem.isAccepted;
                    var rejected = (updateType == 'reject') ? 1: $scope.businessItem.isRejected;
                    var cancelled = (updateType == 'cancel') ? 1: $scope.businessItem.isCancelled;
                    var completed = (updateType == 'complete') ? 1: $scope.businessItem.isCompleted;
                    console.log(accepted, rejected, completed, updateType);
                    $scope.finishUpdatingTableBooking(accepted, rejected, cancelled, completed, null);
                }

                $scope.openTimePicker = function () {
                    console.log("dh");
                    ionicTimePicker.openTimePicker(ipObj2);
                }
                break;
            case 'Taxi Booking':
                $rootScope.topRightButtonIsEdit = false;
                $scope.finishUpdatingTaxiBooking = function (cancelled, completed) {
                    Taxi.updateTaxiBookingByPerson($stateParams._id, cancelled, completed).success(function (successData) {
                        $rootScope.$broadcast('taxi-booking-updated');
                        $ionicHistory.goBack();
                        $rootScope.appLoading = false;
                    }).error(function () {

                    });
                }
                $scope.updateTaxiBooking = function (updateType) {
                    $rootScope.appLoading = true;
                    
                    var completed = (updateType == 'complete') ? 1: 0;
                    var cancelled = (updateType == 'cancel') ? 1: 0;
                    $scope.finishUpdatingTaxiBooking(cancelled, completed);
                }
                $scope.getBusinessItem = function () {
                    Taxi.getTaxiBookingForPerson($stateParams._id).success(function (successData) {
                        console.log(successData[0]);
                        if (successData != 'null') {
                            successData[0].timeRequested = (successData[0].bookingDateTime != null) ? $rootScope.getShortenedTimeString(successData[0].bookingDateTime): null;
                            successData[0].dateRequested = (successData[0].bookingDateTime != null) ? $rootScope.getShortenedDateString(successData[0].bookingDateTime): null;
                            successData[0].dateRequested = (successData[0].bookingDateTime != null) ? $rootScope.convertToDate($scope, new Date(successData[0].dateRequested)): null;
                            $scope.businessItem = successData[0];
                        }
                    }).error(function () {
                    
                    });
                }
                break;
            case 'Offer':
                $rootScope.topRightButtonIsEdit = false;
                $scope.getBusinessItem = function () {
                    var _userId = ($rootScope.userLoggedIn) ? $rootScope.user._profileId: 0;
                    Offers.getOffer($stateParams._id, _userId).success(function (successData) {
                        console.log(successData);
                        if (successData != 'null') {
                            $scope.businessItem = successData[0];
                        }
                    }).error(function () {
                    
                    });
                }
                break;
            case 'Event Entry':
                $rootScope.topRightButtonIsEdit = false;
                $scope.finishUpdatingEventEntryBooking = function (cancelled) {
                    Events.updateEventEntryBookingByPerson($stateParams._id, 0, 0, cancelled).success(function (successData) {
                        $rootScope.$broadcast('event-entry-booking-updated');
                        $ionicHistory.goBack();
                        $rootScope.appLoading = false;
                    }).error(function () {

                    });
                }
                $scope.updateEventEntryBooking = function (updateType) {
                    $rootScope.appLoading = true;
                    var cancelled = (updateType == 'cancel') ? 1: 0;
                    $scope.finishUpdatingEventEntryBooking(cancelled);
                }
                $scope.getBusinessItem = function () {
                    Events.getEventEntryBooking($stateParams._id).success(function (successData) {
                        console.log(successData);
                        if (successData != 'null') {
                            successData[0].endDate = $rootScope.getShortenedDateString(successData[0].endDateTime);
                            successData[0].endDate = $rootScope.convertToDate($scope, new Date(successData[0].endDate));
                            $scope.businessItem = successData[0];
                        }
                    }).error(function () {
                    
                    });
                }
                break;
        };
        
        $scope.getBusinessItem();
        
    }]);
    app.controller('AddBusinessItemCtrl', ['$ionicHistory', '$rootScope', '$state', '$stateParams', '$scope', 'ionicDatePicker', 'Offers', 'Profile', 'Events', 'MenuItems', 'Categories', 'Listings', 'Movies', function($ionicHistory, $rootScope, $state, $stateParams, $scope, ionicDatePicker, Offers, Profile, Events, MenuItems, Categories, Listings, Movies) {
        //Variables & Constants
        $scope.rootScope = $rootScope;
        $scope.itemType = $stateParams.itemType;
        console.log($stateParams);
        
        $scope.selectExtraOption = function (chosenOptionItem, $event) {
            $rootScope.selectExtraOption(chosenOptionItem, $event, $scope);
        }
        
        switch($stateParams.itemType) {
            case 'Movies':
                $scope.getAllMovieStyles = function () {
                    Categories.getAllMovieStyles().success(function (successData) {
                        $scope.multiSelect['Movies'].styles = successData;
                    }).error(function (errorData) {
                        window.setTimeout(function () {
                            $scope.getAllMovieStyles();
                        }, 100);
                    });
                }
                $scope.getAllMovieStyles();
                
                $scope.selectedDateFirst = new Date();
                $scope.selectedDateLast = new Date();
                $scope.todaysDate = new Date();
                $scope.finalDate = new Date();
                $scope.dateChosen = false;
                
                $scope.firstShowingDateInputHTML = 'Select a first showing date for this event';
                $scope.lastShowingDateInputHTML = 'Select a last showing date for this event';
                var ipObj = [];
                ipObj[0] = {
                  callback: function (val) {  //Mandatory
                    $scope.selectedDateFirst = new Date(val);
                    $scope.firstShowingDateInputHTML = $rootScope.convertToDate($scope, $scope.selectedDateFirst);
                    ipObj[0].inputDate = new Date(val);
                    console.log('Return value from the datepicker popup is : ' + new Date(val));
                  }
                };
                ipObj[1] = {
                  callback: function (val) {  //Mandatory
                    $scope.selectedDateLast = new Date(val);
                    $scope.lastShowingDateInputHTML = $rootScope.convertToDate($scope, $scope.selectedDateLast);
                    ipObj[1].inputDate = new Date(val);
                    console.log('Return value from the datepicker popup is : ' + new Date(val));
                  }
                };
                
                for (a = 0; a < 2; a++) {
                    ipObj[a].disabledDates = [            //Optional
                        new Date(2016, 2, 16),
                        new Date(2015, 3, 16),
                        new Date(2015, 4, 16),
                        new Date(2015, 5, 16),
                        new Date('Wednesday, August 12, 2015'),
                        new Date("08-16-2016"),
                        new Date(1439676000000)
                    ];
                    ipObj[a].from = new Date(), //Optional
                    ipObj[a].to = $scope.finalDate.setDate($scope.finalDate.getDate() + 90), //Optional
                    ipObj[a].inputDate = $scope.selectedDateLast,      //Optional
                    ipObj[a].mondayFirst = true,          //Optional
                    ipObj[a].disableWeekdays = [],       //Optional
                    ipObj[a].closeOnSelect = true,       //Optional
                    ipObj[a].templateType = 'popup'       //Optional
                }
                
                $scope.openDatePicker = function(i){
                  ionicDatePicker.openDatePicker(ipObj[i]);
                };
                
                /* MULTI SELECT CODING, MAKE THIS CODE GENERIC WHEN POSSIBLE */
                /**/
                $scope.multiSelect = {
                    'Movies': {}
                };
                $scope.multiSelect['Movies'].currentStyleIndexToAdd = 0;
                $scope.multiSelect['Movies'].chosenStyleObjects = [{
                    index: $scope.currentStyleIndexToAdd,
                    _id: null, 
                    name: 'Select a Style',
                    showStyles: false}];
                $scope.multiSelect['Movies'].chosenStyleIds = [null];
        
                $scope.toggleStyle = function (style, styleCategory) {
                    $scope.multiSelect[styleCategory].currentStyleIndexBeingToggled = style.index;
                    console.log("0", $scope.multiSelect[styleCategory].currentStyleIndexBeingToggled);
                    for (a = 0; a < $scope.multiSelect[styleCategory].chosenStyleObjects.length; a++) {
                        if ($scope.multiSelect[styleCategory].chosenStyleObjects[a].index != style.index) {
                            $scope.multiSelect[styleCategory].chosenStyleObjects[a].showStyles = false;
                        }
                    }
                    style.showStyles = !style.showStyles;
                    $scope.multiSelect[styleCategory].showStyles = style.showStyles;
                }
                
                $scope.selectStyle = function (style, styleCategory) {
                    var styleSection = $scope.multiSelect[styleCategory];
                    styleSection.chosenStyle = style;
                    
                    for (a = 0; a < styleSection.chosenStyleObjects.length; a++) {
                        if (styleSection.chosenStyleObjects[a].index == styleSection.currentStyleIndexBeingToggled) {
                            styleSection.chosenStyleIds[a] = styleSection.chosenStyle._id;
                            if (styleSection.chosenStyleObjects[a]._id != null) {
                                styleSection.styles.push({_id: styleSection.chosenStyleObjects[a]._id, name: styleSection.chosenStyleObjects[a].name});
                            }
                            styleSection.chosenStyleObjects[a]._id = style._id;
                            styleSection.chosenStyleObjects[a].name = style.name;
                            styleSection.chosenStyleObjects[a].showStyles = false;
                            for (b = 0; b < styleSection.styles.length; b++) {
                                if (styleSection.styles[b].name == style.name) {
                                    styleSection.styles.splice(b, 1);
                                }
                            }
                        }
                    }
                    console.log(styleSection.chosenStyleIds, styleSection.currentStyleIndexBeingToggled);
                    styleSection.showStyles = false;
                }
                
                $scope.removeStyle = function (style, styleCategory) {
                    var indexToRemove = null;
                    for (a = 0; a < $scope.multiSelect[styleCategory].chosenStyleObjects.length; a++) {
                        if ($scope.multiSelect[styleCategory].chosenStyleObjects[a].index == style.index) {
                            indexToRemove = a;
                            if ($scope.multiSelect[styleCategory].chosenStyleObjects[a]._id != null) {
                                $scope.multiSelect[styleCategory].styles.push({_id: $scope.multiSelect[styleCategory].chosenStyleObjects[a]._id, name: $scope.multiSelect[styleCategory].chosenStyleObjects[a].name});
                            }
                        }
                        if ($scope.multiSelect[styleCategory].chosenStyleObjects[a].index > style.index) {
                            $scope.multiSelect[styleCategory].chosenStyleObjects[a].index = $scope.multiSelect[styleCategory].chosenStyleObjects[a].index - 1;
                        }

                        if (a == $scope.multiSelect[styleCategory].chosenStyleObjects.length - 1) {
                            $scope.multiSelect[styleCategory].chosenStyleIds.splice(indexToRemove, 1);
                            $scope.multiSelect[styleCategory].chosenStyleObjects.splice(indexToRemove, 1);
                        }
                    }
                    console.log($scope.multiSelect[styleCategory].chosenStyleIds);
                    if ($scope.multiSelect[styleCategory].chosenStyleIds.indexOf(null) != -1) {
                        $scope.multiSelect[styleCategory].chosenStyleIds.splice($scope.multiSelect[styleCategory].chosenStyleIds.indexOf(null), 1);
                    };
                    console.log($scope.multiSelect[styleCategory].chosenStyleIds, $scope.multiSelect[styleCategory].chosenStyleIds.indexOf(null));
                    $scope.multiSelect[styleCategory].currentStyleIndexToAdd = $scope.multiSelect[styleCategory].currentStyleIndexToAdd - 1;
                }

                $scope.newStyle = function (styleCategory) {
                    if ($scope.multiSelect[styleCategory].currentStyleIndexToAdd == 3) {
                        return false;
                    }
                    $scope.multiSelect[styleCategory].currentStyleIndexToAdd = $scope.multiSelect[styleCategory].currentStyleIndexToAdd + 1;
                    $scope.multiSelect[styleCategory].chosenStyleObjects.push({
                        index: $scope.multiSelect[styleCategory].currentStyleIndexToAdd,
                        _id: null, 
                        name: 'Select a Style',
                        showStyles: false});
                    $scope.multiSelect[styleCategory].chosenStyleIds.push(null);
                    console.log($scope.multiSelect[styleCategory].chosenStyleObjects, $scope.multiSelect[styleCategory].currentStyleIndexToAdd);
                }
                
                $scope.addMovie = function (movieTitle, movieTrailerLink, description) {
                    var firstDateTimeString = $scope.selectedDateFirst.getFullYear() + '-' + ($scope.selectedDateFirst.getMonth() + 1) + '-' + $scope.selectedDateFirst.getDate() + ' 00:00';
                    var lastDateTimeString = $scope.selectedDateLast.getFullYear() + '-' + ($scope.selectedDateLast.getMonth() + 1) + '-' + $scope.selectedDateLast.getDate() + ' 00:00';
                    
                    console.log('Params: ', movieTitle, description, firstDateTimeString, lastDateTimeString, $scope.multiSelect['Movies'].chosenStyleIds, movieTrailerLink);
                    
                    Movies.addMovie(movieTitle, description, firstDateTimeString, lastDateTimeString, $scope.multiSelect['Movies'].chosenStyleIds, movieTrailerLink).success(function (successData) {
                        console.log(successData);
                    }).error(function () {
                    
                    });
                    
                }
            case 'OwnOffers':
                $scope.itemLabel = "Offer";
                $scope.currentSelectedOfferStartTimeScale = 'Present';
                $scope.offerTypes = [
                    {
                        name: 'Basic',
                        displayName: 'Standard Offer',
                        description: 'Standard Offer with information',
                        itemType: 'offerType',
                        _id: 1
                    },
                    {
                        name: 'WithManualPromoCode',
                        displayName: 'Detailed Offer with Enquiry Form & optional Cover Photo',
                        description: 'Create an Offer with detailed info, a built-in enquiry form and an optional photo.',
                        itemType: 'offerType',
                        _id: 2
                    },
                    {
                        name: 'WithAutoPromoCode',
                        displayName: 'Promo-Code Offer (auto-generated)',
                        description: 'Create an Offer with a Promo Code that MyNyte automatically generates. Quick & easy!',
                        itemType: 'offerType',
                        _id: 3
                    }];
                $scope.selectedOfferType = {
                        name: 'Basic',
                        displayName: 'Standard Offer',
                        description: 'Standard Offer with information',
                        itemType: 'offerType',
                        mustBeSelected: true,
                        _id: 1
                    };
                    
                $scope.offerStartPeriods = [
                    {
                        name: 'Now',
                        displayName: 'This Offer starts straight away',
                        itemType: 'offerStartPeriod'
                    },
                    {
                        name: 'Future',
                        displayName: 'This Offer starts in the future',
                        itemType: 'offerStartPeriod'
                    }];
                $scope.selectedOfferStartPeriod = {
                        name: 'Now',
                        displayName: 'This Offer starts straight away',
                        itemType: 'offerStartPeriod',
                        mustBeSelected: true
                    };
                    
                //Set up Date Picker
                $scope.selectedDate1 = new Date();
                $scope.selectedDate2 = new Date();
                $scope.todaysDate = new Date();
                $scope.finalDate = new Date();
                $scope.dateChosen = false;
                
                $scope.offerStartDateInputHTML = 'Select a start date for this offer';
                $scope.offerStartDateInputHTML = 'Select an end date for this offer';

                $scope.ipObj1 = {
                  callback: function (val) {  //Mandatory
                    $scope.selectedDate1 = new Date(val);
                    $scope.offerStartDateInputHTML = $rootScope.convertToDate($scope, $scope.selectedDate1);
                    $scope.ipObj1.inputDate = new Date(val);
                    $scope.dateChosen = true;
                    console.log('Return value from the datepicker popup is : ' + new Date(val));
                  },
                  disabledDates: [            //Optional
                    new Date(2016, 2, 16),
                    new Date(2015, 3, 16),
                    new Date(2015, 4, 16),
                    new Date(2015, 5, 16),
                    new Date('Wednesday, August 12, 2015'),
                    new Date("08-16-2016"),
                    new Date(1439676000000)
                  ],
                  from: new Date(), //Optional
                  to: $scope.finalDate.setDate($scope.finalDate.getDate() + 90), //Optional
                  inputDate: $scope.selectedDate1,      //Optional
                  mondayFirst: true,          //Optional
                  disableWeekdays: [],       //Optional
                  closeOnSelect: true,       //Optional
                  templateType: 'popup'       //Optional
                };
                
                $scope.ipObj2 = {
                  callback: function (val) {  //Mandatory
                    $scope.selectedDate2 = new Date(val);
                    $scope.offerEndDateInputHTML = $rootScope.convertToDate($scope, $scope.selectedDate2);
                    $scope.ipObj2.inputDate = new Date(val);
                    $scope.dateChosen = true;
                    console.log('Return value from the datepicker popup is : ' + new Date(val));
                  },
                  disabledDates: [            //Optional
                    new Date(2016, 2, 16),
                    new Date(2015, 3, 16),
                    new Date(2015, 4, 16),
                    new Date(2015, 5, 16),
                    new Date('Wednesday, August 12, 2015'),
                    new Date("08-16-2016"),
                    new Date(1439676000000)
                  ],
                  from: new Date(), //Optional
                  to: $scope.finalDate.setDate($scope.finalDate.getDate() + 90), //Optional
                  inputDate: $scope.selectedDate2,      //Optional
                  mondayFirst: true,          //Optional
                  disableWeekdays: [],       //Optional
                  closeOnSelect: true,       //Optional
                  templateType: 'popup'       //Optional
                };
                
                //User Response Functions
                $scope.openDatePicker = function (ipObj) {
                    ionicDatePicker.openDatePicker(ipObj);
                }
                
                $scope.addOffer = function (offerTitle, description, statedStartDateTime, endDateTime, totalAvailable) {
                    var _offerTypeId = $scope.selectedOfferType._id;
                    var startDateTime = null;
                    console.log('end: ', endDateTime);
                    endDateTime = (endDateTime == null) ? 0: new Date(endDateTime).toISOString().slice(0, 19).replace('T', ' ');
                    if (typeof totalAvailable === 'undefined') {
                        totalAvailable = 0;
                    }
                    if ($scope.currentSelectedOfferStartTimeScale == 'Present') {
                        startDateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
                    }
                    else {
                        startDateTime = new Date(statedStartDateTime).toISOString().slice(0, 19).replace('T', ' ');
                    }
                    
                    var createOffer = function (_offerTypeId, offerTitle, description, startDateTime, endDateTime, totalAvailable) {
                        Offers.createOffer($rootScope.user._id, _offerTypeId, 1, offerTitle, description, startDateTime, endDateTime, totalAvailable).success(function (successData) {
                            console.log(successData);
                            var _offerId = successData.replace(/\x22/g, '');
                            _offerId = parseInt(_offerId);
                            var getFollowerProfileIdsForBusiness = function (_offerId) {
                                Profile.getFollowerProfileIdsForBusiness($rootScope.user._id).success(function (successData) {
                                    var contents = $rootScope.user.displayName + " just created a new offer! " + offerTitle;
                                    var header = "New Offer Created";
                                    var dataObj = {
                                        "actionFunction": "goToOffer",
                                        "_businessItemId": _offerId
                                    };
                                    
                                    var recipientsArray = [];
                                    for (a = 0; a < successData.length; a++) {
                                        recipientsArray.push(successData[a]._actionerProfileId);
                                        if (a == successData.length - 1) {
                                            console.log(recipientsArray);
                                            $rootScope.prepareMessageNotificationFinal(recipientsArray, contents, header, dataObj);
                                        }
                                    }
                                }).error(function () {
                                    getFollowerProfileIdsForBusiness(_offerId);
                                });
                            }
                             
                            getFollowerProfileIdsForBusiness(_offerId);
                            $rootScope.$broadcast('new-offer');
                            $ionicHistory.goBack();
                        }).error(function () {
                            createOffer(_offerTypeId, offerTitle, description, startDateTime, endDateTime, totalAvailable);
                        });
                    }
                    
                    createOffer(_offerTypeId, offerTitle, description, startDateTime, endDateTime, totalAvailable);
                }
                break;
            case 'OwnEvents':
                Categories.getAvailableMusicStyles().success(function (musicStyles) {
                    $scope.musicStyles = musicStyles;
                });

                $scope.itemLabel = "Event";
                $scope.chosenMusicStyle = {_id: null, name: 'Select a Music Style'};
                $scope.currentMusicStyleIndexToAdd = 0;
                $scope.chosenMusicStyleObjects = [{
                    index: $scope.currentMusicStyleIndexToAdd, 
                    _id: null, 
                    name: 'Select a Music Style',
                    showMusicCategories: false}];
                $scope.chosenMusicStyleIds = [null];
                $scope.chosenWeeksAhead = {_id: 1, name: '1 week ahead'};
                $scope.chosenWeekday = {_id: null, name: ''};
                $scope.eventHasGuestList = false;
                $scope.showWeeksAhead = false;
                $scope.availableWeeks = [
                    {_id: 1, name: '1 week ahead'},
                    {_id: 2, name: '2 weeks ahead'},
                    {_id: 3, name: '3 weeks ahead'},
                    {_id: 4, name: '4 weeks ahead'},
                    {_id: 5, name: '5 weeks ahead'},
                    {_id: 6, name: '6 weeks ahead'},
                    {_id: 7, name: '7 weeks ahead'}
                ];
                
                $scope.eventRegularityTypes = [
                    {name: 'one-off', displayName: 'This is a one-off event'},
                    {name: 'weekly', displayName: 'This is a weekly event'}
                ];
                $scope.selectedEventRegularityType = {
                    name: 'one-off', displayName: 'This is a one-off event', mustBeSelected: true
                };

                $scope.selectedDate1 = new Date();
                $scope.todaysDate = new Date();
                $scope.finalDate = new Date();
                $scope.dateChosen = false;
                
                $scope.dateInputHTML = 'Select a date for this event';

                var ipObj1 = {
                  callback: function (val) {  //Mandatory
                    $scope.selectedDate1 = new Date(val);
                    $scope.dateInputHTML = $rootScope.convertToDate($scope, $scope.selectedDate1);
                    ipObj1.inputDate = new Date(val);
                    $scope.dateChosen = true;
                    console.log('Return value from the datepicker popup is : ' + new Date(val));
                  },
                  disabledDates: [            //Optional
                    new Date(2016, 2, 16),
                    new Date(2015, 3, 16),
                    new Date(2015, 4, 16),
                    new Date(2015, 5, 16),
                    new Date('Wednesday, August 12, 2015'),
                    new Date("08-16-2016"),
                    new Date(1439676000000)
                  ],
                  from: new Date(), //Optional
                  to: $scope.finalDate.setDate($scope.finalDate.getDate() + 90), //Optional
                  inputDate: $scope.selectedDate1,      //Optional
                  mondayFirst: true,          //Optional
                  disableWeekdays: [],       //Optional
                  closeOnSelect: true,       //Optional
                  templateType: 'popup'       //Optional
                };
                
                //User Response Functions
                $scope.toggleTownCategory= function () {
                    $scope.showTownCategories = !$scope.showTownCategories;
                }
                $scope.toggleMusicCategory = function (musicCat) {
                    $scope.currentMusicCategoryIndexBeingToggled = musicCat.index;
                    console.log("0", $scope.currentMusicCategoryIndexBeingToggled);
                    for (a = 0; a < $scope.chosenMusicStyleObjects.length; a++) {
                        if ($scope.chosenMusicStyleObjects[a].index != musicCat.index) {
                            $scope.chosenMusicStyleObjects[a].showMusicCategories = false;
                        }
                    }
                    musicCat.showMusicCategories = !musicCat.showMusicCategories;
                    $scope.showMusicCategories = musicCat.showMusicCategories;
                }

                $scope.selectMusicCategory = function (musicCategory) {
                    $scope.chosenMusicStyle = musicCategory;
                    
                    for (a = 0; a < $scope.chosenMusicStyleObjects.length; a++) {
                        if ($scope.chosenMusicStyleObjects[a].index == $scope.currentMusicCategoryIndexBeingToggled) {
                            $scope.chosenMusicStyleIds[a] = $scope.chosenMusicStyle._id;
                            if ($scope.chosenMusicStyleObjects[a]._id != null) {
                                $scope.musicStyles.push({_id: $scope.chosenMusicStyleObjects[a]._id, name: $scope.chosenMusicStyleObjects[a].name});
                            }
                            $scope.chosenMusicStyleObjects[a]._id = musicCategory._id;
                            $scope.chosenMusicStyleObjects[a].name = musicCategory.name;
                            $scope.chosenMusicStyleObjects[a].showMusicCategories = false;
                            for (b = 0; b < $scope.musicStyles.length; b++) {
                                if ($scope.musicStyles[b].name == musicCategory.name) {
                                    $scope.musicStyles.splice(b, 1);
                                }
                            }
                        }
                    }
                    console.log($scope.chosenMusicStyleIds, $scope.currentMusicCategoryIndexBeingToggled);
                    $scope.showMusicCategories = false;
                }

                $scope.removeMusicStyle = function (style) {
                    var indexToRemove = null;
                    for (a = 0; a < $scope.chosenMusicStyleObjects.length; a++) {
                        if ($scope.chosenMusicStyleObjects[a].index == style.index) {
                            indexToRemove = a;
                            if ($scope.chosenMusicStyleObjects[a]._id != null) {
                                $scope.musicStyles.push({_id: $scope.chosenMusicStyleObjects[a]._id, name: $scope.chosenMusicStyleObjects[a].name});
                            }
                        }
                        if ($scope.chosenMusicStyleObjects[a].index > style.index) {
                            $scope.chosenMusicStyleObjects[a].index = $scope.chosenMusicStyleObjects[a].index - 1;
                        }

                        if (a == $scope.chosenMusicStyleObjects.length - 1) {
                            $scope.chosenMusicStyleIds.splice(indexToRemove, 1);
                            $scope.chosenMusicStyleObjects.splice(indexToRemove, 1);
                        }
                    }
                    $scope.currentMusicStyleIndexToAdd = $scope.currentMusicStyleIndexToAdd - 1;
                }

                $scope.newMusicStyle = function () {
                    if ($scope.currentMusicStyleIndexToAdd == 3) {
                        return false;
                    }
                    $scope.currentMusicStyleIndexToAdd = $scope.currentMusicStyleIndexToAdd + 1;
                    $scope.chosenMusicStyleObjects.push({
                        index: $scope.currentMusicStyleIndexToAdd, 
                        _id: null, 
                        name: 'Select a Music Style',
                        showMusicCategories: false});
                    $scope.chosenMusicStyleIds.push(null);
                    console.log($scope.chosenMusicStyleObjects, $scope.currentMusicStyleIndexToAdd);
                }

                $scope.toggleEventDateArrangement = function (arrangement) {
                    if (arrangement == 'weekly') {
                        $scope.eventIsOneOff = false;
                        $scope.eventIsWeekly = true;
                    } else {
                        $scope.eventIsOneOff = true;
                        $scope.eventIsWeekly = false;
                    }
                }

                $scope.openDatePicker = function(){
                  ionicDatePicker.openDatePicker(ipObj1);
                };

                $scope.toggleWeeksAheadVisibility = function () {
                    $scope.showWeeksAhead = !$scope.showWeeksAhead;
                }

                $scope.selectWeeksAhead = function (weeksAhead) {
                    $scope.chosenWeeksAhead = weeksAhead;
                    $scope.showWeeksAhead = false;
                }

                $scope.addEvent = function (eventTitle, description, dressCode, guestListMax, dealsOnTheNight, extraInfo) {
                
                    var _businessPlaceId = null;
                    var dateTimeString = $scope.selectedDate1.getFullYear() + '-' + ($scope.selectedDate1.getMonth() + 1) + '-' + $scope.selectedDate1.getDate() + ' 00:00';
                    var weekdayIndex = ($scope.selectedDate1.getDay() == 0) ? 7 : $scope.selectedDate1.getDay();
                    weekdayIndex = ($scope.eventIsWeekly) ? weekdayIndex: null;
                    
                    if ($rootScope.user.businessTypeName == 'Nightclub' || $rootScope.user.businessTypeName == 'Bar') {
                        _businessPlaceId = $rootScope.user._businessPlaceId;
                    } else {
                        _businessPlaceId = $rootScope.user._businessPlaceId;
                    }

                    guestListMax = (guestListMax == null) ? 0: guestListMax;
                    weeksAhead = ($scope.eventIsOneOff) ? 0: $scope.chosenWeeksAhead._id;
                    $scope.eventHasGuestList = ($scope.eventHasGuestList) ? 1: 0;
                    console.log(weekdayIndex, weeksAhead, dateTimeString);
                    
                    var createEvent = function (_businessPlaceId, eventTitle, description, dateTimeString, dressCode, guestListMax, dealsOnTheNight, extraInfo, weekdayIndex, weeksAhead) {
                        Events.createEvent($rootScope.user._id, _businessPlaceId, eventTitle, description, dateTimeString, dressCode, guestListMax, dealsOnTheNight, extraInfo, $scope.eventHasGuestList, weekdayIndex, weeksAhead, $scope.chosenMusicStyleObjects).success(function (successData) {
                            console.log(successData);
                            
                            var _eventId = successData.replace(/\x22/g, '');
                            _eventId = parseInt(_eventId);
                            var getFollowerProfileIdsForBusiness = function (_eventId) {
                                Profile.getFollowerProfileIdsForBusiness($rootScope.user._id).success(function (successData) {
                                    var contents = $rootScope.user.displayName + " just created a new event! " + eventTitle;
                                    var header = "New Event Created";
                                    var dataObj = {
                                        "actionFunction": "goToFeedListingItem",
                                        "_businessItemId": _eventId,
                                        "businessItemType": "Event"
                                    };
                                    
                                    var recipientsArray = [];
                                    for (a = 0; a < successData.length; a++) {
                                        recipientsArray.push(successData[a]._actionerProfileId);
                                        if (a == successData.length - 1) {
                                            console.log(recipientsArray);
                                            $rootScope.prepareMessageNotificationFinal(recipientsArray, contents, header, dataObj);
                                        }
                                    }
                                }).error(function () {
                                    getFollowerProfileIdsForBusiness(_eventId);
                                });
                            }
                             
                            getFollowerProfileIdsForBusiness(_eventId);
                            
                            $rootScope.$broadcast('new-event');
                            $ionicHistory.goBack();
                        }).error(function () {
                            createEvent(_businessPlaceId, eventTitle, description, dateTimeString, dressCode, guestListMax, dealsOnTheNight, extraInfo, weekdayIndex, weeksAhead);
                        });
                    }
                    
                    createEvent(_businessPlaceId, eventTitle, description, dateTimeString, dressCode, guestListMax, dealsOnTheNight, extraInfo, weekdayIndex, weeksAhead);
                    
                }
                break;
            case 'BusinessCarteMenuItemCats':
            case 'BusinessTakeawayMenuItemCats':
                //PAGE LOAD
                $scope.MenuItems = MenuItems;
                $scope.showTagOptions = true;
                $scope.showExtraOptionsOptions = true;

                $scope.itemLabel = "Menu Item";
                $scope._menuTypeId = ($stateParams.itemType != "BusinessCarteMenuItemCats") ? 1: 2;
                $scope.itemShortName = ($stateParams.itemType != "BusinessCarteMenuItemCats") ? "Takeaway ": "A la carte ";
                $scope.itemLabel = $scope.itemShortName + $scope.itemLabel;
                $scope.showMenuItemCategories = false;
                $scope.showMenuItemSubCategories = false;
                $scope.menuItemCategories = [];
                $scope.menuItemSubCategories = [];
                $scope.availableTags = {};
                $scope.availableTags.singularTags = [];
                $scope.availableTags.groupTags = [];
                $scope.selectedCategory = {'name': 'Select a Menu Category', '_id': null};
                $scope.selectedSubCategory = {'name': 'Select an Optional Menu Sub-Category', '_id': null};
                
                $scope.pageLoadFunction = function () {
                    $scope.appliedOptions = [];
                    $scope.appliedOptionsNames = [];
                    $scope.appliedTags = [];
                    $scope.appliedTagsNames = [];
                    
                    MenuItems.getMenuItemOptionsForBusiness($rootScope.user._id).success(function (successData) {
                        $scope.menuItemOptions = (successData == 'null') ? [] : successData;
                        MenuItems.getAllMenuItemTags().success(function (tags) {
                            
                            for (a = 0; a < tags.length; a++) {
                                console.log(tags[a]._menuItemTagGroupId);
                                if (tags[a]._menuItemTagGroupId == null) {
                                    $scope.availableTags.singularTags.push(tags[a]);
                                } else {
                                    var tagAdded = false;
                                    for (b = 0; b < $scope.availableTags.groupTags.length; b++) {
                                        if ($scope.availableTags.groupTags[b]._menuItemGroupTagId == tags[a]._menuItemGroupTagId) {
                                            $scope.availableTags.groupTags[b].array.push(tags[a]);
                                            tagAdded = true;
                                        }
                                    }
                                    if (!tagAdded) {
                                        $scope.availableTags.groupTags.push(
                                            {_menuItemGroupTagId: tags[a]._menuItemGroupTagId,
                                             array: [tags[a]]});
                                    }
                                }
                            }
                            
                            MenuItems.getMenuItemCategoriesForBusiness($rootScope.user._id).success(function (successData2) {
                                console.log('getMenuItemCategoriesForBusiness for OwnMenuItems in AddbusinessItem results: ', successData2);
                                $scope.menuItemCategories = successData2;

                                if ($stateParams._secondaryItemTypeId != null) {
                                    for (a = 0; a < $scope.menuItemCategories.length; a++) {
                                        if ($scope.menuItemCategories[a]._id == $stateParams._secondaryItemTypeId) {
                                            $scope.selectedCategory = $scope.menuItemCategories[a];
                                            console.log($scope.selectedCategory, "mk");
                                        }
                                    }
                                }
                            }).error(function () {
                            
                            });
                            MenuItems.getMenuItemSubCategoriesForBusiness($rootScope.user._id).success(function (successData3) {
                                console.log('getMenuItemSubCategoriesForBusiness for OwnMenuItems in AddbusinessItem results: ', successData3);
                                $scope.menuItemSubCategories = successData3;
                            }).error(function () {
                            
                            });
                        }).error(function () {
                        
                        });
                    }).error(function () {
                    
                    });
                }
                
                $scope.pageLoadFunction();
                
                //GENERAL
                var completeAdd = function (itemName, price, description) {
                    if ($scope.selectedCategory._id != null) {
                        var appliedOptionsFinal = [];
                        for (a = 0; a < $scope.appliedOptions.length; a++) {
                            appliedOptionsFinal.push({_id: $scope.appliedOptions[a]._id});
                        }
                        var appliedTagsFinal = [];
                        for (a = 0; a < $scope.appliedTags.length; a++) {
                            appliedTagsFinal.push({_id: $scope.appliedTags[a]._id});
                        }
                        MenuItems.createMenuItem($rootScope.user._id, $scope._menuTypeId, $scope.selectedCategory._id, $scope.selectedSubCategory._id, itemName, price, description, appliedOptionsFinal, appliedTagsFinal).success(function (successData) {
                            console.log('createMenuItem for OwnMenuItems in AddBusinessItem results: ', successData);
                            $scope.appliedOptions = [];
                            $scope.appliedOptionsNames = [];
                            $scope.appliedTags = [];
                            $scope.appliedTagsNames = [];
                            
                            $rootScope.$broadcast('menu-items-changed');
                            $ionicHistory.goBack();
                            
                        }).error(function () {
                        
                        });
                    }
                }
                
                //User Response Functions
                $scope.selectCategory = function (category) {
                    $scope.showMenuItemCategories = false;
                    $scope.selectedCategory = category;
                }
                $scope.toggleMenuCatDisplay = function () {
                    $scope.showMenuItemCategories = !$scope.showMenuItemCategories;
                }
                $scope.selectSubCategory = function (subcategory) {
                    $scope.showMenuItemSubCategories = false;
                    $scope.selectedSubCategory = subcategory;
                }
                $scope.toggleMenuSubCatDisplay = function () {
                    $scope.showMenuItemSubCategories = !$scope.showMenuItemSubCategories;
                }
                
                $scope.addItemToMenu = function (itemName, price, description) {
                    completeAdd(itemName, price, description);
                }
                
                $scope.applyOption = function (option) {
                    var optionNameIndex = $scope.appliedOptionsNames.indexOf(option.Name);
                    if (optionNameIndex == -1) {
                        $scope.appliedOptionsNames.push(option.Name);
                        $scope.appliedOptions.push(option);
                    } else {
                        $scope.appliedOptionsNames.splice(optionNameIndex, 1);
                        $scope.appliedOptions.splice(optionNameIndex, 1);
                    }
                }
                $scope.applyTag = function (group, tag) {
                    var tagNameIndex = $scope.appliedTagsNames.indexOf(tag.name);
                    if (tagNameIndex == -1) {
                        
                        $scope.appliedTags.push(tag);
                        $scope.appliedTagsNames.push(tag.name);
                        
                        for (a = 0; a < $scope.appliedTags.length; a++) {
                            if ($scope.appliedTags[a]._menuItemTagGroupId != null
                                && $scope.appliedTags[a]._menuItemTagGroupId == tag._menuItemTagGroupId
                                && $scope.appliedTags[a]._id != tag._id) {
                                $scope.appliedTags.splice(a, 1);
                                $scope.appliedTagsNames.splice(a, 1);
                            }
                        }
                    } else {
                        $scope.appliedTags.splice(tagNameIndex, 1);
                        $scope.appliedTagsNames.splice(tagNameIndex, 1);
                    }
                }
                
                break;
            case 'MenuItemCategories':
                $scope.existingCatNames = [];
                MenuItems.getMenuItemCategoriesForBusiness($rootScope.user._id).success(function (successData) {
                    if (successData != 'null') {
                        for (a = 0; a < successData.length; a++) {
                            $scope.existingCatNames.push(successData[a].name);
                        }
                    }
                    
                    $scope.addItemToMenuItemCategories = function (itemName, description) {
                        $rootScope.appLoading = true;
                        MenuItems.createMenuItemCategory($rootScope.user._id, itemName, description).success(function (successData) {
                            $rootScope.$broadcast('menu-item-categories-changed');
                            $ionicHistory.goBack();
                            $rootScope.appLoading = false;
                        }).error(function () {
                        
                        });
                    }
                }).error(function () {
                
                });
                
                break;
            case 'MenuItemSubCategories':
                $scope.existingCatNames = [];
                MenuItems.getMenuItemSubCategoriesForBusiness($rootScope.user._id).success(function (successData) {
                    if (successData != 'null') {
                        for (a = 0; a < successData.length; a++) {
                            $scope.existingCatNames.push(successData[a].name);
                        }
                    }
                    
                    $scope.addItemToMenuItemCategories = function (itemName, description) {
                        $rootScope.appLoading = true;
                        MenuItems.createMenuItemSubCategory(itemName, description, $rootScope.user._id).success(function (successData) {
                            $rootScope.$broadcast('menu-item-sub-categories-changed');
                            $ionicHistory.goBack();
                            $rootScope.appLoading = false;
                        }).error(function () {
                        
                        });
                    }
                }).error(function () {
                
                });
                
                break;
            case 'MenuItemTemplateOptions':
                $scope.showChangeOrderButtons = false;
                $scope.businessItem = {'name': '', 'priceRelevant': false, 'quantityRelevant': false, 'options': [], 'type': null};
                
                MenuItems.getMenuTemplateOptionCategories().success(function (successData) {
                    $scope.menuItemTemplateOptionCategories = (successData != 'null') ? successData : [];
                    $scope.selectedCategory = {'_id': 0, 'Name': 'Select Category'};
                }).error(function () {
                
                });
                
                
                //User Based functions
                
                $scope.selectCategory = function (category) {
                    $scope.showMenuItemTemplateOptionCategories = false;
                    $scope.selectedCategory = category;
                }
                $scope.toggleMenuCatDisplay = function () {
                    $scope.showMenuItemTemplateOptionCategories = !$scope.showMenuItemTemplateOptionCategories;
                }
                $scope.togglePriceRel = function (item) {
                    item.priceRelevant = !item.priceRelevant;
                }
                $scope.toggleQuantityRel = function (item) {
                    item.quantityRelevant = !item.quantityRelevant;
                }
                
                $scope.moveOptionChoiceUp = function (choice) {
                    var orderIndexToApply = parseInt(choice.orderIndex) - 1;
                    
                    for (a = 0; a < $scope.businessItem.options.length; a++) {
                        if ($scope.businessItem.options[a].orderIndex == orderIndexToApply) {
                            $scope.businessItem.options[a].orderIndex = orderIndexToApply + 1;
                            var tempObject = $scope.businessItem.options[a];
                            $scope.businessItem.options.splice(a, 1);
                            $scope.businessItem.options.splice(a + 1, 0, tempObject);
                        }
                    }
                    
                    choice.orderIndex = orderIndexToApply;
                }
                
                $scope.moveOptionChoiceDown = function (choice) {
                    var orderIndexToApply = parseInt(choice.orderIndex) + 1;
                    
                    for (a = 0; a < $scope.businessItem.options.length; a++) {
                        if ($scope.businessItem.options[a].orderIndex == orderIndexToApply) {
                            $scope.businessItem.options[a].orderIndex = orderIndexToApply - 1;
                            var tempObject = $scope.businessItem.options[a];
                            $scope.businessItem.options.splice(a, 1);
                            $scope.businessItem.options.splice(a - 1, 0, tempObject);
                        }
                    }
                    choice.orderIndex = orderIndexToApply;
                }
                
                $scope.deleteOptionChoice = function (optionChoice) {
                    console.log(optionChoice);
                    
                    for (a = 0; a < $scope.businessItem.options.length; a++) {
                        if ($scope.businessItem.options[a].orderIndex > optionChoice.orderIndex) {
                            $scope.businessItem.options[a].orderIndex = parseInt($scope.businessItem.options[a].orderIndex) - 1;
                        }
                        if ($scope.businessItem.options[a]._id == optionChoice._id) {
                            $scope.businessItem.options.splice(a, 1);
                        }
                    }
                    $scope.currentOptionBeingAdded.orderIndex = $scope.businessItem.options.length + 1;
                }
                
                $scope.currentOptionBeingAdded = {'name': '', 'extraPrice': 0.00, 'orderIndex': $scope.businessItem.options.length + 1};
                $scope.createOptionChoice = function () {
                    console.log($scope.currentOptionBeingAdded);
                    
                    $scope.businessItem.options.splice($scope.currentOptionBeingAdded.orderIndex - 1, 0, $scope.currentOptionBeingAdded);
                    for (a = $scope.currentOptionBeingAdded.orderIndex; a < $scope.businessItem.options.length; a++) {
                        $scope.businessItem.options[a].orderIndex = parseInt($scope.businessItem.options[a].orderIndex) + 1;
                    }
                    
                    $scope.currentOptionBeingAdded = {'name': '', 'extraPrice': 0.00, 'orderIndex': $scope.businessItem.options.length + 1};
                }
            
                $scope.addTemplateOption = function () {
                    console.log($scope.businessItem);
                    $rootScope.appLoading = true;
                    MenuItems.createMenuItemTemplateOption($rootScope.user._id, $scope.selectedCategory._id, $scope.businessItem).success(function (successData) {
                        console.log(successData);
                        $rootScope.$broadcast('menu-item-template-options-changed');
                        $ionicHistory.goBack();
                        $rootScope.appLoading = false;
                    }).error(function () {
                    
                    });
                }
                
                break;
        };
    }]);
    app.controller('BusinessItemSettingsCtrl', ['$ionicHistory', '$rootScope', '$state', '$stateParams', '$scope', 'MenuItems', function($ionicHistory, $rootScope, $state, $stateParams, $scope, MenuItems) {
        //Variables & Constants
        $scope.rootScope = $rootScope;
        $scope.itemType = $stateParams.itemType;
        
        switch($stateParams.itemType) {
            case 'BusinessMenuItemCats':
                
                //User Response Functions
                
                break;
        };
    }]);

    /* Profile Items */
    app.controller('ProfileItemsCtrl', ['$rootScope', '$state', '$stateParams', '$scope', 'Offers', 'Profile', 'Events', 'Taxi', 'MenuItems', function($rootScope, $state, $stateParams, $scope, Offers, Profile, Events, Taxi, MenuItems) {
        //Variables & Constants
        $scope.profileItemCats = [];
        $scope.profileItems = [];
        $scope.rootScope = $rootScope;
        console.log($stateParams.itemType);
        $scope.itemType = $stateParams.itemType;
        $scope.$on('$ionicView.enter', function() {
            $rootScope.topRightButtonShouldBeSettings = false;
            $rootScope.topRightButtonFunction = function () {
                $state.go('app.addBusinessItem', {'itemType': $stateParams.itemType});
            };
        })
        
        $scope.nextPageFunction = function (item) {
            $state.go('app.seeBusinessMenuItems', {'_businessId': $rootScope.user._id, '_menuItemCategoryId': item._id});
        };

        $scope.windowWidth = (window.innerWidth/100) * 30;
        
        var sortThroughListingCats = function (data) {
            var filteredListingTypes = {};
            var listingTypes = {
                Business: {
                    items: [],
                    name: 'Businesses',
                    icon: 'ion-home',
                    itemTypes: ['Likes', 'Followed', 'FollowedBusiness'],
                    showing: true},
                Event: {
                    items: [],
                    name: 'Events',
                    icon: 'ion-calendar',
                    itemTypes: ['Likes', 'Watched'],
                    showing: true},
                Offer: {
                    items: [],
                    name: 'Offers',
                    icon: 'ion-social-usd',
                    itemTypes: ['Likes', 'Watched'],
                    showing: true},
                Movie: {
                    items: [],
                    name: 'Movies',
                    icon: 'ion-film-marker',
                    itemTypes: ['Likes', 'Watched'],
                    showing: true},
                Person: {
                    items: [],
                    name: 'People',
                    icon: 'ion-person',
                    itemTypes: ['Followed', 'Following', 'Liked'],
                    showing: true}
            }
            
            for (prop in listingTypes) {
                if (listingTypes[prop].itemTypes.indexOf($scope.itemType) != -1) {
                    filteredListingTypes[prop] = listingTypes[prop];
                }
            }
            console.log(filteredListingTypes);
            
            if (data != 'null') {
                for (a = 0; a < data.length; a++) {
                    filteredListingTypes[data[a].listingType].items.push(data[a]);
                    
                    if (a == data.length - 1) {
                        return filteredListingTypes;
                    }
                }
            } else {
                return filteredListingTypes;
            }
            
        }
        
        switch($scope.itemType) {
            case 'PhotosSummary':
                $scope.getProfileItems = function () {
                    Profile.getPhotoAlbumsSummaryForProfile($rootScope.user._profileId).success(function (successData) {
                        console.log(successData);
                        if (successData != 'null') {
                            $scope.profileItemCats = {All: {name: 'All', items: successData}};
                        }
                        console.log($scope.profileItemCats);
                    }).error(function () {
                    
                    });
                }
                //Updates based on Outside events
                $rootScope.$on('menu-order-updated', function(event, args) {
                    $scope.getProfileItems();
                    // do what you want to do
                })
                break;
            case 'SpecificPhotoFolderSummary':
                $scope.getProfileItems = function () {
                    Profile.getSpecificAlbumSummaryForListing($rootScope.user._profileId, $stateParams._albumId, $stateParams.albumType, 'Profile').success(function (successData) {
                        console.log(successData);
                        if (successData != 'null') {
                            $scope.profileItemCats = {All: {name: 'All', items: successData}};
                        }
                        console.log($scope.profileItemCats);
                    }).error(function () {
                    
                    });
                }

                //Updates based on Outside events
                $rootScope.$on('menu-order-updated', function(event, args) {
                    $scope.getProfileItems();
                    // do what you want to do
                })
                break;
            case 'Watched':
                $scope.noItemsMessage = 'You are not watching any ';
                $scope.getProfileItems = function () {
                    Profile.getWatchedListingsForProfile($rootScope.user._profileId).success(function (successData) {
                        console.log(successData);
                        $scope.profileItemCats = sortThroughListingCats(successData);
                    }).error(function () {
                    
                    });
                }

                //Updates based on Outside events
                $rootScope.$on('menu-order-updated', function(event, args) {
                    $scope.getProfileItems();
                    // do what you want to do
                })
                break;
            case 'Followed':
                if ($rootScope.user.isBusiness == '1') {
                    $scope.itemType = 'FollowedBusiness';
                }
                $scope.noItemsMessage = 'You are not following any ';
                $scope.getProfileItems = function () {
                    Profile.getFollowedListingsForProfile($rootScope.user._profileId).success(function (successData) {
                        console.log(successData);
                        $scope.profileItemCats = sortThroughListingCats(successData);
                    }).error(function () {
                    
                    });
                }
                //Updates based on Outside events
                $rootScope.$on('menu-order-updated', function(event, args) {
                    $scope.getProfileItems();
                    // do what you want to do
                })
                break;
            case 'Following':
                $scope.noItemsMessage = 'You are not being followed by any ';
                //
                $scope.getProfileItems = function () {
                    Profile.getFollowingProfilesForProfile($rootScope.user._profileId).success(function (successData) {
                        console.log(successData);
                        $scope.profileItemCats = sortThroughListingCats(successData);
                    }).error(function () {
                    
                    });
                }
                //Updates based on Outside events
                $rootScope.$on('menu-order-updated', function(event, args) {
                    $scope.getProfileItems();
                    // do what you want to do
                })
                break;
            case 'Likes':
                //
                if ($rootScope.user.isBusiness == '1') {
                    $scope.itemType = 'Liked';
                    $scope.noItemsMessage = 'Your business does not have any likes yet.';
                } else {
                    $scope.noItemsMessage = 'You have not liked any ';
                }
                $scope.getProfileItems = function () {
                    Profile.getLikedListingsForProfile($rootScope.user._profileId).success(function (successData) {
                        console.log(successData);
                        $scope.profileItemCats = sortThroughListingCats(successData);
                        console.log($scope.profileItemCats);
                    }).error(function () {
                    
                    });
                }
                //Updates based on Outside events
                $rootScope.$on('menu-order-updated', function(event, args) {
                    $scope.getProfileItems();
                    // do what you want to do
                })
                break;
        };

        switch($scope.itemType) {
            case 'PhotosSummary':
                $scope.nextPageFunction = function (item) {
                    $state.go('app.profileItems', {itemType:'SpecificPhotoFolderSummary', _albumId: item._albumId, albumType: item.picType});
                }
                break;
            case 'SpecificPhotoFolderSummary':
                $scope.nextPageFunction = function (item) {
                    $state.go('app.profileItems', {itemType:'SpecificPhotoFolderSummary', _albumId: null, albumType: item.picType});
                }
                break;
            case 'Watched':
                $scope.nextPageFunction = function (item) {
                    if (item.listingType == 'Event') {
                        $state.go('app.nlfeed');
                        var timer = window.setTimeout(function () {
                            $state.go('app.nlfeedListing', {'_listingId':item._actionedListingId, 'listingType': 'Event'});
                        }, 100);
                    }
                    else if (item.listingType == 'Offer') {
                        $state.go('app.offers');
                        var timer = window.setTimeout(function () {
                            $state.go('app.offerDetail', {'_id':item._actionedListingId});
                        }, 100);
                    }
                }
                break;
            case 'Likes':
            case 'Liked':
                $scope.nextPageFunction = function (item) {
                    if (item.listingType != 'Offer') {
                        $state.go('app.nlfeed');
                        var timer = window.setTimeout(function () {
                            $state.go('app.nlfeedListing', {'_listingId':item.relListingId, 'listingType': item.listingType});
                        }, 100);
                    }
                    else if (item.listingType == 'Offer') {
                        $state.go('app.offers');
                        var timer = window.setTimeout(function () {
                            $state.go('app.offerDetail', {'_id':item.relListingId});
                        }, 100);
                    }
                }
                break;
            case 'Followed':
            case 'FollowedBusiness':
            case 'Following':
                $scope.nextPageFunction = function (item) {
                    $state.go('app.nlfeed');
                    var timer = window.setTimeout(function () {
                        $state.go('app.nlfeedListing', {'_listingId':item.relListingId, 'listingType':item.listingType});
                    }, 100);
                }
                break;
        };
        
        $scope.getProfileItems();
    }]);

    /* Account Settings */
    app.controller('AccountSettingsCtrl', ['$rootScope', '$state', '$stateParams', '$scope', 'Offers', 'Profile', 'Events', 'Taxi', 'MenuItems', 'userService', '$ionicScrollDelegate', 'Notifications', function($rootScope, $state, $stateParams, $scope, Offers, Profile, Events, Taxi, MenuItems, userService, $ionicScrollDelegate, Notifications) {
        //Variables & Constants
        $scope.settings = {};
        var storedSettings = {};
        $scope.rootScope = $rootScope;
        console.log($stateParams.settingsType);
        $scope.settingsType = $stateParams.settingsType;
        $scope.$on('$ionicView.enter', function() {
            $rootScope.topRightButtonShouldBeSettings = false;
            $rootScope.topRightButtonFunction = function () {
                $state.go('app.addBusinessItem', {'itemType': $stateParams.itemType});
            };
        })
        
        $scope.editField = function (field) {
        
            if (field.editing) {
                field.editing = false;
                $scope.editing = false;
                $scope.settings = $scope.storedSettings;
                $scope.storedSettings = angular.copy($scope.settings);
                return false;
            }
            
            $scope.editing = true;
            field.editing = true;
        };
        
        $scope.submitFieldEdit = function (field) {
            if ($stateParams.settingsType == 'Profile') {
                var updateParamsArray = ['displayName', 'word', 'email', 'firstName', 'lastName', 'addressLine1', 'addressLine2', 'postcode', 'phone1', 'profileDescription', 'businessName'];

                $scope.updateParams = {
                    _profileId: $rootScope.user._profileId,
                    isBusiness: ($rootScope.user.isBusiness == "0") ? 0: 1,
                    displayName: $scope.settings[updateParamsArray[0]].value,
                    word: $scope.settings[updateParamsArray[1]].value,
                    email: $scope.settings[updateParamsArray[2]].value,
                    firstName: $scope.settings[updateParamsArray[3]].value,
                    lastName: $scope.settings[updateParamsArray[4]].value,
                    addressLine1: $scope.settings[updateParamsArray[5]].value,
                    addressLine2: $scope.settings[updateParamsArray[6]].value,
                    postcode: $scope.settings[updateParamsArray[7]].value,
                    phone1: $scope.settings[updateParamsArray[8]].value,
                    profileDescription: $scope.settings[updateParamsArray[9]].value,
                    businessName: $scope.settings[updateParamsArray[10]].value
                }
                console.log($scope.updateParams);
                Profile.updateAllProfileDetails($scope.updateParams).success(function (successData) {
                    console.log(successData);
                    field.editing = false;
                    $scope.editing = false;
                    $scope.storedSettings = angular.copy($scope.settings);
                }).error(function (errorData) {
                
                });
            }
            else if ($stateParams.settingsType == 'Business') {
                var updateParamsArray = ['isAcceptingOnlineOrders', 'showTakeawayMenu', 'isAcceptingTableBookings', 'showCarteMenu', 'isAcceptingTaxiBookings', 'isSearchable'];
                $scope.updateParams = {
                    _businessId: $rootScope.user._id
                }
                
                for (a = 0; a < $scope.settings.businessSettings.length; a++) {
                    var specificSettings = $scope.settings.businessSettings[a].specificSettings;
                    for (b = 0; b < specificSettings.length; b++) {
                        $scope.updateParams[specificSettings[b].key] = specificSettings[b].val;
                    }
                }

                
                console.log($scope.updateParams);
                Profile.updateAllBusinessSettingDetails($scope.updateParams).success(function (successData) {
                    console.log(successData);
                    field.editing = false;
                    $scope.editing = false;
                    $scope.storedSettings = angular.copy($scope.settings);
                }).error(function (errorData) {
                
                });
            }
        };

        switch($stateParams.settingsType) {
            case 'Business':
                var createBusinessSettings = function (data) {
                    $scope.settings.businessSettings = [];
                    /* RE-INTRODUCE THIS SOON
                    $scope.settings.businessSettings.push({
                        businessType: 'General',
                        specificSettings: [
                            { key: 'isSearchable'
                            , label: 'Make your business viewable'
                            , val: (data.isSearchable == '0') ? 0: 1
                            , optionStyle: 'binary'
                            , trueLabel: 'My business is viewable on the app'
                            , falseLabel: 'My business is not viewable the app'
                            , editing: false}
                        ]
                    });
                    */
                    var completeFillingBusinessSettings = function () {
                        for (a = 0; a < $rootScope.user.listingTypes.length; a++) {
                            switch($rootScope.user.listingTypes[a]) {
                                case 'Restaurant':
                                    $scope.settings.businessSettings.push({
                                        businessType: 'Restaurant',
                                        specificSettings: [
                                            { key: 'isAcceptingTableBookings'
                                            , label: 'Accept Table Bookings'
                                            , val: (data.isAcceptingTableBookings == '0') ? 0: 1
                                            , optionStyle: 'binary'
                                            , trueLabel: 'My business accepts Table Bookings through the app'
                                            , falseLabel: 'My business does not accept Table Bookings through the app'
                                            , editing: false},
                                            { key: 'showCarteMenu'
                                            , label: 'Show A la Carte Menu'
                                            , val: (data.showCarteMenu == '0') ? 0 : 1
                                            , optionStyle: 'binary'
                                            , trueLabel: 'Show my A la Carte Menu to users'
                                            , falseLabel: 'Do not show my A la Carte Menu to users'
                                            , editing: false}
                                        ]
                                    });
                                    break;
                                case 'Takeaway':
                                    $scope.settings.businessSettings.push({
                                        businessType: 'Takeaway',
                                        specificSettings: [
                                            /* RE-INTRODUCE THIS SOON
                                             { key: 'isAcceptingOnlineOrders'
                                            , label: 'Accept Online Orders'
                                            , val: (data.isAcceptingOnlineOrders == '0') ? 0: 1
                                            , optionStyle: 'binary'
                                            , trueLabel: 'My business accepts Online Orders through the app'
                                            , falseLabel: 'My business does not accept Online Orders through the app'
                                            , editing: false
                                            }, 
                                            */
                                            { key: 'showTakeawayMenu'
                                            , label: 'Show Takeaway Menu'
                                            , val: (data.showTakeawayMenu == '0') ? 0 : 1
                                            , optionStyle: 'binary'
                                            , trueLabel: 'Show my Takeaway Menu to users'
                                            , falseLabel: 'Do not show my Takeaway Menu to users'
                                            , editing: false
                                            }
                                        ]
                                    });
                                    break;
                                case 'Nightclub':
                                    $scope.settings.businessSettings.push({
                                        businessType: 'Nightclub'
                                    });
                                    break;
                                case 'Bar':
                                    $scope.settings.businessSettings.push({
                                        businessType: 'Bar'
                                    });
                                    break;
                                case 'Taxi':
                                    $scope.settings.businessSettings.push({
                                        businessType: 'Taxi',
                                        specificSettings: [
                                            {key: 'isAcceptingTableBookings'
                                            , label: 'Accept Taxi Bookings'
                                            , val: (data.isAcceptingTaxiBookings == '0') ? 0: 1
                                            , optionStyle: 'binary'
                                            , trueLabel: 'My business accepts Table Bookings through the app'
                                            , falseLabel: 'My business does not accept Table Bookings through the app'
                                            , editing: false}
                                        ]
                                    });
                                    break;
                            }
                            
                            if (a == $rootScope.user.listingTypes.length - 1) {
                                console.log($scope.settings);
                                $scope.storedSettings = angular.copy($scope.settings);
                            }
                        }
                    }
                        
                    $scope.getAllTonightsFeedOptionsForBusiness = function () {
                        Profile.getAllTonightsFeedOptionsForBusiness($rootScope.user._id).success(function (successData) {
                            $scope.settings.businessSettings.push({
                                businessType: 'General',
                                specificSettings: [
                                    { key: '_tonightsFeedButtonId'
                                    , label: 'Call to action in the MyNyte feed'
                                    , val: data._tonightsFeedButtonId
                                    , optionStyle: 'multiple'
                                    , labels: successData
                                    , editing: false}
                                ]
                            });
                            completeFillingBusinessSettings();
                        }).error(function (errorData) {
                            window.setTimeout(function () {
                                $scope.getAllTonightsFeedOptionsForBusiness();
                            });
                        });
                    }
                    $scope.getAllTonightsFeedOptionsForBusiness();
                    
                }
                
                Profile.getAllBusinessSettingsForBusiness($rootScope.user._id).success(function (successData) {
                    console.log('fuck sake:', successData[0]);
                    createBusinessSettings(successData[0]);
                }).
                error(function (errorMessage) {
                
                })
                
                break;
            case 'Profile':
                $scope.logOut = function () {
                    $rootScope.appLoading = true;
                    
                    var oldInteractionObject = $rootScope.user.userInteractionObject;
                    $rootScope.userLoggedIn = false;
                    $rootScope.user = {};
                    userService.model.user = {};
                    
                    var makeUserInactive = function () {
                        Profile.makeUserInactive($rootScope.user._profileId).success(function (successData) {
                            
                        }).error(function (errorData) {
                            makeUserInactive();
                        });
                    }
                    
                    var removeOneSignalIdForLogOut = function () {
                        Notifications.removeOneSignalIdForLogOut($rootScope._userOneSignalId).success(function (successData) {
                            
                        }).error(function (errorData) {
                            removeOneSignalIdForLogOut();
                        });
                    }
                    
                    makeUserInactive();
                    removeOneSignalIdForLogOut();
                    $rootScope.$broadcast('user-logged-in');
                    $rootScope.$broadcast('savestate');
                    $rootScope.user.userInteractionObject = oldInteractionObject;
                    $state.go('app.profile');
                    
                    setTimeout(function () {
                        $ionicScrollDelegate.scrollTop();
                        $rootScope.appLoading = false;
                    }, 200);
                }
                
                $scope.getAccountSettings = function () {
                    Profile.getAllProfileDetails($rootScope.user._profileId).success(function (successData) {
                        $scope.settings.displayName = {
                            value: successData[0].displayName, editing: false, name: 'displayName'};
                        $scope.settings.word = {
                            value: successData[0].word, editing: false, name: 'word'};
                        $scope.settings.firstName = {
                            value: successData[0].firstName, editing: false, name: 'firstName'};
                        $scope.settings.lastName = {
                            value: successData[0].lastName, editing: false, name: 'lastName'};
                        $scope.settings.email = {
                            value: successData[0].email, editing: false, name: 'email'};
                        $scope.settings.phone1 = {
                            value: successData[0].phone1, editing: false, name: 'phone1'};
                        $scope.settings.addressLine1 = {
                            value: successData[0].addressLine1, editing: false, name: 'addressLine1'};
                        $scope.settings.addressLine2 = {
                            value: successData[0].addressLine2, editing: false, name: 'addressLine2'};
                        $scope.settings.postcode = {
                            value: successData[0].postcode, editing: false, name: 'postcode'};
                        $scope.settings.profileDescription = {
                            value: successData[0].description, editing: false, name: 'profileDescription'};
                        $scope.settings.businessName = {
                            value: successData[0].businessName, editing: false, name: 'businessName'};
                            
                        //Alter Number fields so they're not null (for number input)
                        $scope.settings.phone1.value = ($scope.settings.phone1.value == null) ? '': $scope.settings.phone1.value;
                        $scope.storedSettings = angular.copy($scope.settings);
                            
                        console.log($scope.settings);
                    }).
                    error(function (errorMessage) {
                    
                    })
                }
                
                $scope.getAccountSettings();
                
                break;
        };
        
        console.log($scope.settings);
    }]);
