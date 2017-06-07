/*  Profile page template */
app.controller('ProfileCtrl', ['$rootScope', '$scope', '$state', '$stateParams', 'Messages', 'Profile', '$cordovaSQLite', 'userService', '$ionicConfig', '$ionicScrollDelegate', 'ngFB', 'Notifications', '$ionicPopup', 'datesService', 'listingsService', 'userObjectService', function($rootScope, $scope, $state, $stateParams, Messages, Profile, $cordovaSQLite, userService, $ionicConfig, $ionicScrollDelegate, ngFB, Notifications, $ionicPopup, datesService, listingsService, userObjectService) {
    //Variables & Constants
    //Cancel relListing in case someone has come back to profile page
    //after trying to attach a listing to a message.
    $scope.rootScope = $rootScope;
    $scope.messageGroups = [];
    $rootScope.appLoading = false;
    $scope.currentMonth = datesService.months[(new Date()).getMonth()];
    $scope.profileItemCount = {};
    $scope.togglePasswordViewButtonText = "Show";
    $scope.showPassword = false;
    $scope.passwordInputType = 'password';
    $scope.showFinalProfileLogInWindow = false;
    
    $scope.pageLoad = function () {
        $scope.getProfileItemCount = function () {
            Profile.getProfileItemCountForProfile($rootScope.user._profileId).success(function (successData) {
                $scope.profileItemCount = successData[0];
                if (successData[0].notificationCountType == 'outstanding') {
                    var array = [];
                    for (a = 0; a < successData[0].notificationCount; a++) {
                        array.push(0);
                        if (a == successData[0].notificationCount - 1) {
                            $rootScope.user.currentUnreadNotifications = array;
                            $rootScope.$broadcast('savestate');
                        }
                    }
                }
            }).error(function (errorData) {
                window.setTimeout(function () {
                    if ($rootScope.userLoggedIn) {
                        $scope.getProfileItemCount();
                    }
                }, 150);
            });
        }
        
        //Page load function
        $scope.$on('$ionicView.beforeEnter', function() {
            if ($rootScope.userLoggedIn) {
                $scope.getProfileItemCount();

                if ($stateParams.action != null) {
                    switch ($stateParams.action) {
                        case 'businessHelpPage':
                            $state.go('app.articles');
                        break;
                    }
                }
            }
        });
        
        $rootScope.connectProfileToOneSignal = function () {
            Notifications.createOneSignalId($rootScope.user._profileId, $rootScope._userOneSignalId, 0).success(function (successData) {
                $rootScope.debugModeLog({'msg': 'ProfileCtrl createOneSignalId successData', 'data': successData});
            
                $rootScope._userOneSignalId = successData[0]._oneSignalId;
                if ($rootScope._userOneSignalId == 0 || typeof($rootScope._userOneSignalId) == 'undefined') {
                    $rootScope.user = userObjectService.startUsersMessagesAndNotificationsUpdateTimer($rootScope.user);
                }
            }).error(function (errorData) {
                $rootScope.connectProfileToOneSignal();
            });
        };

        //Functions based on User Interactions
        $scope.fbLogin = function () {
            ngFB.login({scope: 'email,user_about_me,email'}).then(
                function (response) {
                    if (response.status === 'connected') {
                        $scope.closeLogin();
                    } else {
                        $rootScope.debugModeLog({'msg': 'Facebook Login Failed', 'data': []});
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
                    
                    $rootScope.debugModeLog({'msg': 'ProfileCtrl closeLogin $rootScope.user', 'data': $rootScope.user});
                    
                    $rootScope.appLoading = true;
                    var finalProfileLogIn = function () {
                        Profile.logInThroughFb($rootScope.user.email, $rootScope.user.id).success(function (successData) {
                            if (successData != 'null' && successData != undefined && successData != '' && successData != null) {
                                $ionicScrollDelegate.scrollTop();
                                userService.model.user = successData[0];
                                userService.model.user.id = savedUserId;
                                $rootScope.$broadcast('savestate');
                                
                                //All Objects which are attached to the old object and now need to be reattached should be dealt with
                                var oldUserInteractionObject = $rootScope.user.userInteractionObject || {};
                                userService.model.user._oneSignalId = $rootScope._userOneSignalId;
                                userService.model.user._oneSignalDeviceToken = $rootScope._userOneSignalDeviceToken;
                                $rootScope.user = userObjectService.createUserObject(userService.model.user);
                                listingsService.createListingTypesObjForListing($rootScope.user);
                                $rootScope.user.userInteractionObject = oldUserInteractionObject;
                                $rootScope.userLoggedIn = true;
                                if (ionic.Platform.isAndroid() || ionic.Platform.isIOS() || ionic.Platform.isIPad()) {
                                    $rootScope.connectProfileToOneSignal();
                                } else {
                                    $rootScope.user = userObjectService.startUsersMessagesAndNotificationsUpdateTimer($rootScope.user);
                                }
                                $rootScope.$broadcast('user-logged-in');
                                $rootScope.appLoading = false;
                                
                                $rootScope.debugModeLog({'msg': 'ProfileCtrl logInThroughFb $rootScope.user: ', 'data': $rootScope.user});
                            }
                            else {
                                $scope.showDisplayNameNote = false;
                                $scope.displayNameTaken = false;
                                $scope.showFinalProfileLogInWindow = true;
                                
                                $scope.checkIfDisplayNameTaken = function (displayName) {
                                    if (displayName.length > 4) {
                                        Profile.checkIfDisplayNameTaken(displayName).success(function (result) {
                                            $scope.displayNameTaken = (parseInt(result["total"]) > 0) ? true: false;
                                        }).error(function () {
                                            $scope.checkIfDisplayNameTaken(displayName);
                                        });
                                    }
                                }
                                
                                $scope.showDisplayNameNoteFunc = function (bool) {
                                    $scope.showDisplayNameNote = bool;
                                }
                                
                                $scope.createFBUserProfile = function (displayName) {
                                    Profile.createFBUserProfile($rootScope.user.name, displayName, $rootScope.user.email, $rootScope.user.id).success(function (successData) {
                                        $rootScope.debugModeLog({'msg': 'ProfileCtrl createFBUserProfile successData: ', 'data': successData});
                                        
                                        $state.go('app.registerFinal', {profileType: 'person', _usersId: successData, usersEMail: $rootScope.user.email, usersPWord: $scope.password});
                                        $scope.showFinalProfileLogInWindow = false;
                                    }).error(function () {
                                        $scope.createFBUserProfile();
                                    });
                                }
                                
                                $rootScope.appLoading = false;
                            }
                        }).error(function (error) {
                            $rootScope.debugModeLog({'msg': 'ProfileCtrl createFBUserProfile errorData: ', 'data': error});
                            
                            finalProfileLogIn();
                        });
                    }
                    finalProfileLogIn();
                },
                function (error) {
                    $rootScope.debugModeLog({'msg': 'Facebook Error', 'data': error.error_description});
                });
        }

        $scope.logIn = function (email, word) {
            $rootScope.appLoading = true;
            Profile.logIn(email, word).success(function (successData) {
                $rootScope.debugModeLog({'msg': 'ProfileCtrl logIn successData: ', 'data': successData});
                if (successData != 'null' && successData != undefined && successData != '' && successData != null) {
                    $ionicScrollDelegate.scrollTop();
                    userService.model.user = successData[0];
                    $rootScope.$broadcast('savestate');
                    
                    //All Objects which are attached to the old object and now need to be reattached should be dealt with
                    var oldUserInteractionObject = $rootScope.user.userInteractionObject;
                    userService.model.user._oneSignalId = $rootScope._userOneSignalId;
                    userService.model.user._oneSignalDeviceToken = $rootScope._userOneSignalDeviceToken;
                    $rootScope.user = userObjectService.createUserObject(userService.model.user);
                    listingsService.createListingTypesObjForListing($rootScope.user);
                    $rootScope.user.userInteractionObject = oldUserInteractionObject;
                    $rootScope.userLoggedIn = true;
                    if (ionic.Platform.isAndroid() || ionic.Platform.isIOS() || ionic.Platform.isIPad()) {
                        $rootScope.connectProfileToOneSignal();
                    }
                    else {
                        $rootScope.user = userObjectService.startUsersMessagesAndNotificationsUpdateTimer($rootScope.user);
                    }
                    $rootScope.$broadcast('user-logged-in');
                    $rootScope.appLoading = false;
                }
                else {
                    $ionicPopup.show({
                        title: 'Couldn\'t Log In',
                        template: '<p>The log-in details you provided did not work. Please check them and try again.</p>',
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
                    $rootScope.appLoading = false;
                }
            }).error(function (error) {
                $rootScope.debugModeLog({'msg': 'ProfileCtrl logIn errorData: ', 'data': error});
                $scope.logIn(email, word);
            });
        }
        
        $scope.togglePasswordView = function () {
            $scope.showPassword = !$scope.showPassword;
            $scope.togglePasswordViewButtonText = ($scope.showPassword) ? "Hide": "Show";
            $scope.passwordInputType = ($scope.showPassword) ? 'text': 'password';
        }

        $scope.goToFirstMenuPage = function () {
            $state.go('app.businessItems', {itemType: 'BusinessMenuItemCats', timeScale: 'present'});
        }
    }
    
    $rootScope.checkForAppInit($scope);
    
    $rootScope.$on('new-profile-items-viewed', function() {
        $scope.getProfileItemCount();
    });
}])
    /*  Reset Password Control */
    app.controller('ResetPasswordCtrl', ['$rootScope', '$scope', '$state', '$stateParams', 'Profile', '$ionicPopup', '$ionicScrollDelegate', 'listingsService', 'userService', 'userObjectService', function($rootScope, $scope, $state, $stateParams, Profile, $ionicPopup, $ionicScrollDelegate, listingsService, userService, userObjectService) {
        //Variables & Constants
        $scope.userLoggedIn = false;
        $scope.stage = $stateParams.stage;
        $scope.pageLoading = true;

        $scope.pageLoad = function () {
            $scope.requestCode = function (requestType, email) {
                $rootScope.appLoading = true;
                
                var relEmail = null;
                if (requestType == 'initial') {
                    relEmail = $scope.form.email;
                }
                else if (requestType == 're-request') {
                    relEmail = email;
                }
                
                Profile.createResetCodeForProfileEmail(relEmail).success(function (successData) {
                    $rootScope.appLoading = false;
                    if (successData == 'Success') {
                        $ionicPopup.show({
                            title: 'Password Reset Link Sent',
                            template: '<p>We\'ve just sent a Password Reset email to the email address which you just entered. Please click on the reset link inside this email to continue with your password reset.</p>',
                            scope: $scope,
                            buttons: [
                                { 
                                    text: 'Close',
                                    onTap: function(e) {
                                    } 
                                }
                            ]
                        });
                        $scope.form = {'email': ''};
                    }
                    else if (successData == 'Email not found') {
                        $ionicPopup.show({
                            title: 'Email Not Found',
                            template: '<p>Sorry, that email address is not associated with a MyNyte account. Please check the spelling of the address and any punctuation it may contain.</p>',
                            scope: $scope,
                            buttons: [
                                { 
                                    text: 'Close',
                                    onTap: function(e) {
                                    } 
                                }
                            ]
                        });
                    }
                    else if (successData == 'Couldn\'t send email') {
                        $ionicPopup.show({
                            title: 'Couldn\'t Send Mail',
                            template: '<p>We were not able to the send an email to the specified email address at this time. Please try again shortly.</p>',
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
                    }
                    
                }).error(function (errorData) {
                    $scope.requestCode(email);
                });
            }
            
            if ($stateParams.stage == 1) {
                $scope.form = {'email': ''};
                $scope.showEmailNote = false;
                $scope.pageLoading = false;
            }
            else if ($stateParams.stage == 2) {
                $rootScope.showBackButton = false;
                
                $scope.backToHomepage = function () {
                    $state.go('app.feed');
                }
                
                $scope.updateProfilePasswordDetails = function () {
                    if ($scope.form.password != $scope.form.confirmPassword) { return false; };
                    
                    $rootScope.appLoading = true;
                    
                    $scope.updateParams = {
                        _profileId: $stateParams._profileId,
                        word: $scope.form.password,
                        resetCode: $stateParams.code,
                        withResetCode: 1
                    }
                        
                    Profile.updateProfilePasswordDetails($scope.updateParams).success(function (successData) {
                        $rootScope.debugModeLog({'msg': 'ProfileCtrl updateProfilePasswordDetails successData: ', 'data': successData});
                        
                        $scope.logIn = function (email, word) {
                            Profile.logIn(email, word).success(function (successData) {
                                if (successData != 'null' && successData != undefined && successData != '' && successData != null) {
                                
                                    $ionicScrollDelegate.scrollTop();
                                    userService.model.user = successData[0];
                                    $rootScope.$broadcast('savestate');
                                    
                                    //All Objects which are attached to the old object and now need to be reattached should be dealt with
                                    var oldUserInteractionObject = $rootScope.user.userInteractionObject;
                                    userService.model.user._userOneSignalId = $rootScope._userOneSignalId;
                                    $rootScope.user = userObjectService.createUserObject(userService.model.user);
                                    listingsService.createListingTypesObjForListing($rootScope.user);
                                    $rootScope.user.userInteractionObject = oldUserInteractionObject;
                                    $rootScope.userLoggedIn = true;
                                    if (ionic.Platform.isAndroid() || ionic.Platform.isIOS() || ionic.Platform.isIPad()) {
                                        $rootScope.connectProfileToOneSignal();
                                    }
                                    else {
                                        $rootScope.user = userObjectService.startUsersMessagesAndNotificationsUpdateTimer($rootScope.user);
                                    }
                                    $rootScope.$broadcast('user-logged-in');
                                    
                                    $state.go('app.profile');
                                    $rootScope.appLoading = false;
                                }
                                else {
                                    $ionicPopup.show({
                                        title: 'Couldn\'t Log In',
                                        template: '<p>The log-in details you provided did not work. Please check them and try again.</p>',
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
                                    $rootScope.appLoading = false;
                                }
                            }).error(function (error) {
                                $scope.logIn(email, word);
                            });
                        }
                        
                        $scope.logIn($scope.relEmail, $scope.form.password);
                        
                    }).error(function (errorData) {
                        $scope.updateProfilePasswordDetails();
                    });
                }
                
                if (!$rootScope.userLoggedIn) {
                    Profile.checkPasswordResetCodeValidity($stateParams._profileId, $stateParams.code).success(function (successData) {
                        $rootScope.debugModeLog({'msg': 'ProfileCtrl checkPasswordResetCodeValidity successData', 'data': successData});
                        
                        if (successData == 'Password Check Query Failed') {
                            $scope.queryUnsuccessful = true;
                        }
                        else if (successData.totalMatchingCodes == 0) {
                            $scope.codeUnrecognized = true;
                        }
                        else if (successData.totalMatchingCodes > 0 && successData.totalMatchingValidCodes == 0) {
                            $scope.codeInvalid = true;
                        }
                        else if (successData.totalMatchingCodes > 0 && successData.totalMatchingValidCodes > 0) {
                            $scope.form = {'password': '', 'confirmPassword': ''};
                            $scope.showPWordNote = false;
                            $scope.relEmail = successData.email;
                        }
                        
                        $scope.pageLoading = false;
                         
                    }).error(function (errorData) {
                    
                    });
                } else {
                    $ionicPopup.show({
                        title: 'Cannot reset password',
                        template: '<p>You cannot complete this password reset request because you are currently logged into MyNyte. You will now be redirected to the profile page.</p>',
                        //subTitle: 'Are you sure you want to Delete this item?',
                        scope: $scope,
                        buttons: [
                            { 
                                text: 'Close',
                                onTap: function(e) {
                                    $state.go('app.profile');
                                } 
                            }
                        ]
                    });
                }
            }
        };
        
        $rootScope.checkForAppInit($scope);
    }])
    /*  Register Intro Control */
    app.controller('RegisterIntroCtrl', ['$rootScope', '$scope', '$state', 'Profile', function($rootScope, $scope, $state, Profile) {
        //Variables & Constants
        $scope.userLoggedIn = false;

        //Functions based on User Interactions
        
    }])
    /*  Register Control */
    app.controller('RegisterCtrl', ['$rootScope', '$scope', '$state', '$stateParams', 'Profile', 'listingsService', 'userObjectService', function($rootScope, $scope, $state, $stateParams, Profile, listingsService, userObjectService) {
        
        $scope.pageLoad = function () {
            //Variables & Constants
            $scope.name = "";
            $scope.displayName = "";
            $scope.email = "";
            $scope.password = "";
            $scope.showPasswordFieldEntered = false;
            $scope.showPasswordNote = false;
            $scope.displayNameTaken = false;
            $scope.emailTaken = false;
            $scope.existingEMailButPWordDifferent = false;
            $scope.formSubmitted = false;
            $scope.formIsValidating = false;
            $scope.profileType = $stateParams.profileType;
            $scope.pageHeader = ($scope.profileType == 'business') ? 'Sign your business up': 'Fill in your details';
            
            $scope.checkIfDisplayNameTaken = function (displayName) {
                if (displayName.length > 4) {
                    $scope.formIsValidating = true;
                    Profile.checkIfDisplayNameTaken(displayName).success(function (result) {
                        $scope.displayNameTaken = (parseInt(result["total"]) > 0) ? true: false;
                        $scope.formIsValidating = false;
                    }).error(function () {
                        $scope.checkIfDisplayNameTaken();
                    });
                }
            }
            
            $scope.checkIfEmailTaken = function (email) {
                if (email.length > 4) {
                    $scope.formIsValidating = true;
                    Profile.checkIfEmailTaken(email).success(function (result) {
                        $rootScope.debugModeLog({'msg': 'RegisterCtrl checkIfEmailTaken successData', 'data': result});
                        $scope.emailTaken = (parseInt(result["total"]) > 0) ? true: false;
                        $scope.formIsValidating = false;
                    }).error(function () {
                        $scope.checkIfEmailTaken(email);
                    });
                }
            }

            //Functions based on User Interactions
            $scope.doRegister = function (name, displayName, email, password) {
                $rootScope.appLoading = true;
                $scope.formSubmitted = true;
                $scope.name = name;
                $scope.displayName = displayName;
                $scope.email = email;
                $scope.password = password;
                
                Profile.createProfile($scope.name, $scope.displayName, $scope.email, $scope.password, $scope.profileType).success(function (successData) {
                    $rootScope.debugModeLog({'msg': 'RegisterCtrl createProfile successData', 'data': successData});
                    
                    if (successData == 'emailTaken') {
                        $ionicPopup.show({
                            title: 'Email already registered',
                            template: '<p>Look\'s like there is already an account associated with this email address. Please try logging in directly instead, or try using an alternative email address.</p>',
                            scope: $scope,
                            buttons: [
                                { 
                                    text: 'Close',
                                    onTap: function(e) {
                                    } 
                                }
                            ]
                        });
                        $scope.emailTaken = true;
                    }
                    else if (successData == 'displayNameTaken') {
                        $ionicPopup.show({
                            title: 'Display Name taken',
                            template: '<p>Look\'s like that Display Name has already been taken. Please try another one.</p>',
                            scope: $scope,
                            buttons: [
                                { 
                                    text: 'Close',
                                    onTap: function(e) {
                                    } 
                                }
                            ]
                        });
                        $scope.displayNameTaken = true;
                    }
                    else {
                        console.log(successData);
                        $state.go('app.registerFinal', {profileType: $scope.profileType, _usersId: successData, usersEMail: $scope.email, usersPWord: $scope.password});
                    }
                }).error(function (error) {
                    $rootScope.debugModeLog({'msg': 'RegisterCtrl checkIfEmailTaken errorData', 'data': error});
                    $scope.doRegister(name, displayName, email, password);
                });
                
                if (!$scope.existingEMailButPWordDifferent && !$scope.displayNameTaken) {
                    //Complete Registration of this Account
                }
            }
        }
        
        $rootScope.checkForAppInit($scope);
    }])
    /*  Register Final Control */
    app.controller('RegisterFinalCtrl', ['$rootScope', '$scope', '$state', '$stateParams', 'Profile', 'Categories', '$ionicScrollDelegate', 'userService', 'userObjectService', 'listingsService', function($rootScope, $scope, $state, $stateParams, Profile, Categories, $ionicScrollDelegate, userService, userObjectService, listingsService) {
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
        
        $scope.pageLoad = function () {
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
            
            var getAvailableTowns = function () {
                Categories.getAvailableTowns().success(function (towns) {
                    $rootScope.debugModeLog({'msg': 'RegisterFinalCtrl getAvailableTowns successData', 'data': towns});
                    $scope.availableTowns = towns;
                    var getAvailableBusinessTypes = function () {
                        Categories.getAvailableBusinessTypes().success(function (businessTypes) {
                            $rootScope.debugModeLog({'msg': 'RegisterFinalCtrl getAvailableBusinessTypes successData', 'data': businessTypes});
                            for (a = 0; a < businessTypes.length; a++) {
                                if (businessTypes[a].name == "Restaurant") {
                                    $scope.restaurantBusinessTypeId = businessTypes[a]._id;
                                }
                                else if (businessTypes[a].name == "Takeaway") {
                                    $scope.takeawayBusinessTypeId = businessTypes[a]._id;
                                }
                            }
                            $scope.businessTypes = businessTypes;
                            var getAllFoodStyles = function () {
                                Categories.getAllFoodStyles().success(function (foodStyles) {
                                    $rootScope.debugModeLog({'msg': 'RegisterFinalCtrl getAllFoodStyles successData', 'data': foodStyles});
                                    $scope.foodStyles = foodStyles;
                                }).error(function () {
                                    getAllFoodStyles();
                                });
                            }
                            
                            getAllFoodStyles();
                        }).error(function () {
                            getAvailableBusinessTypes();
                        });
                    }
                    getAvailableBusinessTypes();
                }).error(function () {
                    getAvailableTowns();
                });
            }
            getAvailableTowns();

            //Functions based on User Interactions
            $scope.toggleBusinessTypes = function (businessTypeIndex) {
                $scope.currentBusinessTypeSelectingIndex = businessTypeIndex;
                $scope.showBusinessTypes = !$scope.showBusinessTypes;
            };
            
            $scope.toggleTowns = function () {
                $scope.showTowns = !$scope.showTowns;
            };
            
            $scope.selectBusinessType = function (businessType) {
                $scope.selectedBusinessTypes.push(businessType);
                $scope._businessTypeIds.push(businessType._id);
                $scope.showBusinessTypes = !$scope.showBusinessTypes;
            }
            
            $scope.selectTown = function (town) {
                $scope.selectedTown = town;
                $scope.showTowns = !$scope.showTowns;
            }
            
            $scope.toggleBusinessType = function (businessType) {
                $scope.currentBusinessTypeIndexBeingToggled = businessType.index;
                for (a = 0; a < $scope.chosenBusinessTypeObjects.length; a++) {
                    if ($scope.chosenBusinessTypeObjects[a].index != businessType.index) {
                        $scope.chosenBusinessTypeObjects[a].showBusinessTypes = false;
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
            }
            
            /**/
            $scope.toggleFoodStyle = function (foodStyle) {
                $scope.currentFoodStyleIndexBeingToggled = foodStyle.index;
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
            }
            
            $scope.completeRegister = function (phone1, phone2, name, addressLine1, addressLine2, postCode) {
                if (typeof phone1 !== 'undefined') {
                    phone1 = phone1.replace(/ /g, '');
                }
                if (typeof phone2 !== 'undefined') {
                    phone2 = phone2.replace(/ /g, '');
                }
                
                $rootScope.appLoading = true;
                
                Profile.completeRegistration($scope._usersId, phone1, phone2, name, addressLine1, addressLine2, $scope.selectedTown._id, postCode, $scope.profileType, $scope.chosenBusinessTypeIds, $scope.chosenFoodStyleIds).success(function (successData) {
                    $rootScope.debugModeLog({'msg': 'RegisterFinalCtrl completeRegistration successData', 'data': successData});
                    //If Registration was successful
                    if ($scope.profileType != 'myNyte') {
                        var logIn = function () {
                            if ($stateParams.usersPWord != null) {
                                Profile.logIn($stateParams.usersEMail, $stateParams.usersPWord).success(function (successData) {
                                    $rootScope.debugModeLog({'msg': 'RegisterFinalCtrl comleteRegistration logIn successData', 'data': successData});
                                    
                                    $rootScope.$broadcast('savestate');
                                    
                                    //All Objects which are attached to the old object and now need to be reattached should be dealt with
                                    var oldUserInteractionObject = $rootScope.user.userInteractionObject;
                                    userService.model.user = successData[0];
                                    userService.model.user._userOneSignalId = $rootScope._userOneSignalId;
                                    $rootScope.user = userObjectService.createUserObject(userService.model.user);
                                    $rootScope.user.userInteractionObject = oldUserInteractionObject;
                                    $rootScope.userLoggedIn = true;
                                    $rootScope.$broadcast('user-logged-in');
                                    $state.go('app.profile');
                                    $rootScope.appLoading = false;
                                }).error(function (error) {
                                    $rootScope.debugModeLog({'msg': 'RegisterFinalCtrl completeRegistration logIn errorData', 'data': error});
                                    logIn();
                                });
                            } else {
                                Profile.logInThroughFb($stateParams.usersEMail, $rootScope.user.id).success(function (successData) {
                                    if (successData != 'null' && successData != undefined) {
                                        $ionicScrollDelegate.scrollTop();
                                        userService.model.user = successData[0];
                                        $rootScope.$broadcast('savestate');
                                        
                                        //All Objects which are attached to the old object and now need to be reattached should be dealt with
                                        var oldUserInteractionObject = $rootScope.user.userInteractionObject;
                                        var savedUserId = $rootScope.user.id;
                                        userService.model.user._userOneSignalId = $rootScope._userOneSignalId;
                                        $rootScope.user = userObjectService.createUserObject(userService.model.user);
                                        $rootScope.user.id = savedUserId;
                                        listingsService.createListingTypesObjForListing($rootScope.user);
                                        $rootScope.user.userInteractionObject = oldUserInteractionObject;
                                        $rootScope.userLoggedIn = true;
                                        $rootScope.$broadcast('user-logged-in');
                                        if (ionic.Platform.isAndroid() || ionic.Platform.isIOS() || ionic.Platform.isIPad()) {
                                            $rootScope.connectProfileToOneSignal();
                                        }
                                        $state.go('app.profile');
                                        $rootScope.appLoading = false;
                                    }
                                    else {
                                        
                                        $rootScope.appLoading = false;
                                    }
                                }).error(function (error) {
                                    $rootScope.debugModeLog({'msg': 'RegisterFinalCtrl completeRegistration logInThroughFb errorData', 'data': error});
                                    logIn();
                                });
                            }
                        }
                        
                        logIn();
                    } else {
                        $state.go('app.profile');
                        $rootScope.appLoading = false;
                    }

                }).error(function (error) {
                    $rootScope.debugModeLog({'msg': 'RegisterFinalCtrl completeRegistration errorData', 'data': error});
                    $scope.completeRegister(phone1, phone2, name, addressLine1, addressLine2, postCode);
                });;
            }

            $rootScope.appLoading = false;
        }
        
        $rootScope.checkForAppInit($scope);
    }])

    app.controller('NotificationsSummaryCtrl', ['$rootScope', '$state','$scope', 'Notifications', 'Profile', 'datesService', '$ionicViewSwitcher', 'userObjectService', function($rootScope, $state, $scope, Notifications, Profile, datesService, $ionicViewSwitcher, userObjectService) {
        //Variables & Constants
        $scope.rootScope = $rootScope;
        
        $scope.pageLoad = function () {
            $scope.notifications = [];

            //Load Page Data
            $scope.loadPageData = function () {
                Notifications.getNotifications($rootScope.user._profileId).success(function (notifications) {
                    $rootScope.debugModeLog({'msg': 'NotificationsSummaryCtrl getNotifications successData', 'data': notifications});
                    userObjectService.removeUnreadNotifications($rootScope.user);
                    if (notifications != null && notifications != []) {
                        for (a = 0; a < notifications.length; a++) {
                            notifications[a].timeString = datesService.getShortenedTimeString(notifications[a].dateTimeCreated);
                            notifications[a].dateString = datesService.convertToReadableDate($scope, notifications[a].dateTimeCreated);
                            
                            if (a == notifications.length - 1) {
                                $scope.notifications = notifications;
                                $rootScope.$broadcast('new-profile-items-viewed');
                                $scope.pageLoading = false;
                            }
                        }
                        
                    } else {
                        $scope.notifications = [];
                        $scope.pageLoading = false;
                    }
                }).error(function () {
                    $scope.loadPageData();
                });
            }
            
            $scope.loadPageData();
            
            $rootScope.$on('new-notification-to-get', function () {
                $scope.loadPageData();
            });
        }
        
        $rootScope.checkForAppInit($scope);
    }]);

    /*  Privacy Policy Control */
    app.controller('PrivacyPolicyCtrl', ['$rootScope', '$scope', '$state', function($rootScope, $scope, $state) {
        $scope.$on('$ionicView.beforeEnter', function() {
            $rootScope.pageTitle = ($scope.pageTitle) ? $scope.pageTitle: $rootScope.pageTitle;
        });
        $scope.pageLoad = function () {
            $rootScope.pageTitle = 'Privacy Policy';
            $scope.pageTitle = $rootScope.pageTitle;
        }

        $rootScope.checkForAppInit($scope);
    }]);
    /*  Download the App Control */
    app.controller('DownloadTheAppCtrl', ['$rootScope', '$scope', '$state', function($rootScope, $scope, $state) {
        $scope.$on('$ionicView.beforeEnter', function() {
            $rootScope.pageTitle = ($scope.pageTitle) ? $scope.pageTitle: $rootScope.pageTitle;
        });
        $scope.pageLoad = function () {
            $scope.rootScope = $rootScope;
            $rootScope.pageTitle = 'Download the MyNyte App';
            $scope.pageTitle = $rootScope.pageTitle;
        }
        
        $rootScope.checkForAppInit($scope);
    }]);
    /*  External Api Control */
    app.controller('ExternalApiCtrl', ['$rootScope', '$scope', '$state', function($rootScope, $scope, $state) {
        $scope.$on('$ionicView.beforeEnter', function() {
            $rootScope.pageTitle = ($scope.pageTitle) ? $scope.pageTitle: $rootScope.pageTitle;
        });
        $scope.pageLoad = function () {
            $scope.rootScope = $rootScope;
            $rootScope.pageTitle = 'Download the MyNyte App';
            $scope.pageTitle = $rootScope.pageTitle;
        }
        
        $rootScope.checkForAppInit($scope);
    }]);

    app.controller('NotificationCtrl', ['$rootScope', '$state','$scope', '$stateParams', 'Notifications', 'Profile', 'Followers', function($rootScope, $state, $scope, $stateParams, Notifications, Profile, Followers) {
        //Variables & Constants
        $scope.notificationId = $stateParams.id;
        $scope.alertType = $stateParams.type;
        $scope.followerEventFollowers = [];

        //Load Page Data
        $scope.pageLoad = function () {
            if ($scope.alertType == 'Follower Event') {
                
                Followers.getFollowerEventFollowers().success(function (followerEventFollowers) {
                    
                    $scope.followerEventFollowers = followerEventFollowers;
                });
            }
        }
        
        $rootScope.checkForAppInit($scope);
    }]);

    app.controller('MessageGroupsCtrl', ['$rootScope', '$state', '$stateParams', '$scope', 'Messages', 'Profile', '$ionicViewSwitcher', /*'socket', */'datesService', 'messagesWorkerFS', function($rootScope, $state, $stateParams, $scope, Messages, Profile, $ionicViewSwitcher, /*socket, */datesService, messagesWorkerFS) {
        var socketMessagesReadFunction = function (data) {
        
        }
        var socketNewMessageFunction = function (data) {
            if (data.newMessage._senderId == $rootScope.user._profileId || $scope.groupIdsArray.indexOf(data.newMessage._groupId) == -1) {
                return false;
            }
            
            $scope.messagesIdsArray.push(data.newMessage._id);
            
            msgDateString = datesService.convertToReadableDate($scope, data.newMessage.dateTimeSent);
            
            if ($scope.messagesDatesArray.indexOf(msgDateString) == -1) {
                $scope.messagesDatesArray.push(msgDateString);
            }
            
            if ($scope.dates[$scope.dates.length - 1].date == msgDateString) {
                $scope.dates[$scope.dates.length - 1].posts.push(data.newMessage);
            }
            else {
                $scope.dates.push({"date": msgDateString, "posts": [data.newMessage]});
            }
        }
        
        $scope.$on('$ionicView.beforeEnter', function() {
            $rootScope.pageTitle = ($stateParams.groupType == 'Business' || $stateParams.groupType == 'Person') ? ($stateParams.groupType == 'Business') ? 'Enquiries': 'Messages': $rootScope.pageTitle;
            
            if ($rootScope.user.isBusiness != '1') {
                $rootScope.topRightButtonFunction = function () {
                    $state.go('app.profile.messageGroups.messageGroup', {_id: null, relListing: null, _profileIds: [], groupType: $stateParams.groupType});
                };
            } else {
                $rootScope.topRightButtonIsPlus = false;
            }
            
            $rootScope.backButtonFunction = function () {
                $rootScope.relListing = null;
                $rootScope.currentMessageInputPlaceholder = "Type your message here ...";
                $ionicViewSwitcher.nextDirection('back');
                $state.go('app.profile');
            }
        });

        //Variables & Constants
        $scope.rootScope = $rootScope;
        $scope.groupType = $stateParams.groupType;
        $scope.pageLoading = true;

        //Functions based on User Interactions
        $scope.pageLoad = function () {
            $scope.relListing = $stateParams.relListing;
            /* SOCKET FUNCTION
            socket.on('new-message', socketNewMessageFunction);*/
            
            $scope.loadMessageGroups = function () {
                Messages.getMessageGroups($rootScope.user._profileId, $stateParams.groupType).success(function (messageGroups) {
                    messageGroups = messageGroups || [];
                    for (a = 0; a < messageGroups.length; a++) {
                    
                        messageGroups[a].multipleNames = false;
                        if (!messageGroups[a].name || messageGroups[a].name == "") {
                            var profilePhotoList = messagesWorkerFS.getProfilePhotoListForGroup(messageGroups[a], $rootScope.user);
                            
                            messageGroups[a].mainPhoto = profilePhotoList[0];
                            messageGroups[a].name = messagesWorkerFS.getNameStringForGroup(messageGroups[a], $rootScope.user);
                        }
                        
                        if (messageGroups[a].lastMessageSentBy == $rootScope.user.displayName) {
                            messageGroups[a].lastMessageSentBy = 'Me';
                        }
                        messageGroups[a].lastMessageText = (messageGroups[a].lastMessageText == "" && messageGroups[a]._lastMessageItemId != null) ? 'Attached Listing': messageGroups[a].lastMessageText;
                    }
                    $scope.messageGroups = messageGroups;
                    $scope.pageLoading = false;
                }).error(function () {
                    $scope.loadMessageGroups();
                });
            }

            $scope.loadMessageGroups();
            
            var newMessageAddedFn = $rootScope.$on('new-message-added', function () {
                $scope.loadMessageGroups();
            });
            
            var newGroupUpdatedFn = $rootScope.$on('message-group-updated', function (event, args) {
                $scope.loadMessageGroups();
            });
            
            var newProfileItemViewedFn = $rootScope.$on('new-profile-items-viewed', function() {
                $scope.loadMessageGroups();
            });
            
            $scope.$on('$destroy', function() {
                newMessageAddedFn();
                newGroupUpdatedFn();
                newProfileItemViewedFn();
            });
            
            $rootScope.$on('new-message-to-get-for-groups', function () {
                $scope.loadMessageGroups();
            });
        }
        
        $rootScope.checkForAppInit($scope);

    }]);

    app.controller('MessageGroupCtrl', ['$rootScope', '$state','$scope', '$stateParams', '$ionicScrollDelegate', '$ionicHistory', 'Messages', 'Profile', '$http', 'Notifications', '$ionicViewSwitcher', /*'socket', */'messagesWorkerFS', 'datesService', '$timeout', 'userObjectService', function($rootScope, $state, $scope, $stateParams, $ionicScrollDelegate, $ionicHistory, Messages, Profile, $http, Notifications, $ionicViewSwitcher, /*socket, */messagesWorkerFS, datesService, $timeout, userObjectService) {
    
        var socketMessagesReadFunction = function (data) {
            alert("messages ...");
            if (data._groupId == $stateParams._id && $rootScope.user._profileId != data._profileId) {
                for (a = 0; a < data.messagesJustReadArray.length; a++) {
                    for (b = 0; b < $scope.dates.length; b++) {
                        if ($scope.dates[b].date == data.messagesJustReadArray[a].date) {
                            for (c = 0; c < $scope.dates[b].posts.length; c++) {
                                if (data.messagesJustReadArray[a]._id == $scope.dates[b].posts[c]._id && $scope.dates[b].posts[c].messageReadState != 'ReadByAll') {
                                    $scope.dates[b].posts[c].messageReadState = 'ReadBySome';
                  
                                    $scope.dates[a].posts[b].messageReadByParticipantsCounter += 1;
                                    if ($scope.dates[a].posts[b].messageReadByParticipantsCounter == $scope.dates[a].posts[b].totalParticipants || $scope.dates[a].posts[b].messageReadByParticipantsCounter > $scope.dates[a].posts[b].totalParticipants) {
                                        $scope.dates[a].posts[b].messageReadState = 'ReadByAll';
                                    }
                                }
                            }
                        }
                  
                    }
                }
                
            }
        }
        var socketNewMessageFunction = function (data) {
            if (data._groupId == $scope._messageGroupId) {
                if ($scope.messagesIdsArray.indexOf(data.newMessage._id) != -1) {
                    return false;
                }
                $scope.messagesIdsArray.push(data.newMessage._id);
                
                data.newMessage.from = (data.newMessage._senderId == $rootScope.user._profileId) ? 'self': 'other';
                msgDateString = datesService.convertToReadableDate($scope, data.newMessage.dateTimeSent);
                
                if ($scope.messagesDatesArray.indexOf(msgDateString) == -1) {
                    $scope.messagesDatesArray.push(msgDateString);
                }
                
                if ($scope.dates.length > 0) {
                    if ($scope.dates[$scope.dates.length - 1].date == msgDateString) {
                        $scope.dates[$scope.dates.length - 1].posts.push(data.newMessage);
                    }
                    else {
                        $scope.dates.push({"date": msgDateString, "posts": [data.newMessage]});
                    }
                }
                else {
                    $scope.dates.push({"date": msgDateString, "posts": [data.newMessage]});
                }
                
                if (data.newMessage.from != 'self') {
                    var insertIndividualMessageReadReceipt = function () {
                        Messages.insertMessageReadReceipts($stateParams._id, $rootScope.user._profileId, data.newMessage._id).success(function (successData) {
                            if (successData != null) {
                                for (a = 0; a < successData.length; a++) {
                                    successData[a].date = datesService.convertToReadableDate($scope, successData[a].dateTimeSent);
                                    
                                    if (a == successData.length - 1) {
                                        /* SOCKET FUNCTION
                                        socket.emit('messages-read', {
                                            '_profileId': $rootScope.user._profileId,
                                            '_groupId': $stateParams._id,
                                            //get Ids and MessageDates of messages just read
                                            'messagesJustReadArray': successData
                                        });
                                        */
                                    }
                                }
                            }
                        }).error(function (errorData) {
                            insertIndividualMessageReadReceipts();
                        });
                    }
                
                    insertIndividualMessageReadReceipt();
                }
            }
        }
            
        $scope.$on('$ionicView.beforeEnter', function() {
            $rootScope.pageTitle = ($scope.pageTitle) ? $scope.pageTitle: $rootScope.pageTitle;
            
            $rootScope.currentMessageGroupIdBeingViewed = $stateParams._id;
            
            $scope.messageGroupId = $stateParams._id;
            $scope.messageNameString = $stateParams.messageNameString;
            
            if ($stateParams.groupType == 'Business') {
               $rootScope.backButtonFunction = function () {
                    /* SOCKET FUNCTION
                    socket.removeListener('messages-read', socketMessagesReadFunction);
                    socket.removeListener('new-message', socketNewMessageFunction);
                    */
                   
                    $rootScope.relListing = null;
                    $rootScope.currentMessageInputPlaceholder = "Type your message here ...";
                    $ionicViewSwitcher.nextDirection('back');
                    $state.go('app.profile.messageGroups', {groupType: $stateParams.groupType});
                }
            }
            else {
                $rootScope.backButtonFunction = function () {
                    $ionicViewSwitcher.nextDirection('back');
                    $state.go('app.profile.messageGroups', {groupType: $stateParams.groupType});
                    
                    //$rootScope.initialBackButtonFunction();
                }
            }
            
            $rootScope.messageGroupTimer = ($rootScope.messageGroupTimer == null) ?
                $timeout(function () {
                    if ($scope.messageGroupId != null) {
                        $scope.reloadMessageGroup()
                    }
                }, 10000):
                $rootScope.messageGroupTimer;
        });
        //Variables & Constants
        
        $scope.rootScope = $rootScope;
        $scope.stateParams = $stateParams;
        $scope.pageLoading = true;
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
        $scope.messagesIdsArray = [];
        $scope.messagesDatesArray = [];
        
        //Functions used at different times in View
        // load more content function
        $scope.pageLoad = function () {
            /* SOCKET FUNCTION
            socket.on('messages-read', function (data) { socketMessagesReadFunction(data); });
            
            socket.on('new-message', function (data) { socketNewMessageFunction(data); } );
            */
            
            Messages.currentMessageGroupIdBeingViewed = $stateParams._id;
      
            $scope.getPosts = function(state){
                
                if (state == 'initial') {
                    $scope.pageLoading = true;
                    $scope._firstMessageId = 0;
                }
                var dates = [];
                var messageIndex = $scope.currentMessageIndex;
                var _firstMessageId = $scope._firstMessageId;
                
                $scope.messageGroupId = $stateParams._id;
                $scope.messageNameString = $stateParams.messageNameString;
                if (state == 'subsequent') {
                    messageIndex = 0;
                } else if (state == 'earlierMessages') {
                    _firstMessageId = 0;
                }
                
                Messages.getMessageGroup($stateParams._id, $rootScope.user._profileId, messageIndex, _firstMessageId)
                .success(function (posts) {
                    var insertMessageReadReceipts = function () {
                        userObjectService.removeUnreadMessageGroup($rootScope.user, $stateParams._id);
                        Messages.insertMessageReadReceipts($stateParams._id, $rootScope.user._profileId, null).success(function (successData) {
                            $rootScope.debugModeLog({'msg': 'insertMessageReadReceipts successData', 'data': successData});
                            /* Not Needed Until Socket INncluded
                            if (successData != null) {
                                
                                messagesWorkerFS.f('insertMessageReadReceipts', [[successData, $scope, datesService], 0]).then(
                                    function (successDataProcessed) {
                                        alert("boo");
                                        socket.emit('messages-read', {
                                            '_profileId': $rootScope.user._profileId,
                                            '_groupId': $stateParams._id,
                                            //get Ids and MessageDates of messages just read
                                            'messagesJustReadArray': successDataProcessed
                                        });
                                    }, function (errorData) {
                                        $rootScope.debugModeLog({'msg': 'Messages Worker Error: '', 'data': errorData});
                                    }
                                );
                            }
                            */
                        }).error(function (errorData) {
                            insertMessageReadReceipts();
                        });
                    }
                    insertMessageReadReceipts();
                    
                    if (state == 'initial') {
                        var getMessageGroupSummary = function () {
                            Messages.getMessageGroupSummary($rootScope.user._profileId, $scope.messageGroupId).success(function (successData) {
                                $rootScope.pageSubtitle = successData[0].headerMessage;
                                $scope.groupHasMoreThan2People = (successData[0].totalParticipants > 2) ? true: false;
                            }).error(function () {
                                getMessageGroupSummary();
                            });
                        }
                        getMessageGroupSummary();
                    }
                    
                    var completeMessageDisplay = function (state, dates) {
                        var scrollBottom = $ionicScrollDelegate.$getByHandle('message-group').getScrollView().__maxScrollTop - $ionicScrollDelegate.$getByHandle('message-group').getScrollPosition().top;
                        
                        $scope.dates = dates;
                        if ($scope.addNewMessage) {
                            $scope.finalAddMessage($scope.newMessage);
                        }
                        if (state == 'initial') {
                            $rootScope.$broadcast('new-profile-items-viewed');
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                            window.setTimeout(function () {
                                $ionicScrollDelegate.$getByHandle('message-group').scrollBottom();
                                $scope.pageLoading = false;
                            }, 100);
                        }
                        else if (state == 'subsequent' && scrollBottom < 75) {
                            $ionicScrollDelegate.$getByHandle('message-group').scrollBottom(true);
                        }
                        if (state == 'earlierMessages') {
                            $scope.$broadcast('scroll.refreshComplete');
                            $rootScope.appLoading = false;
                        }
                    }
                    
                    $scope._firstMessageId = posts[0]._id;
                    
                    
                    messagesWorkerFS.f('addPostsToScope', [[posts, $scope.messagesIdsArray, $scope.messagesDatesArray, $rootScope.user._profileId, $scope.dates], 0]).then(
                        function (returnPosts) {
                            $rootScope.debugModeLog({'msg': 'Messages Worker', 'data': returnPosts});
                            
                            $scope.messagesIdsArray = returnPosts.messagesIdsArray;
                            $scope.messagesDatesArray = returnPosts.messagesDatesArray;
                            dates = returnPosts.dates;
                            
                            completeMessageDisplay(state, dates);
                        }, function (errorData) {
                            $rootScope.debugModeLog({'msg': 'Messages Worker Error', 'data': errorData});
                        }
                    );
                    
                })
                .error(function (error) {
                    $scope.items = [];
                    $scope.getPosts(state);
                });
            }

            //Load Initial Page Data
            $scope.showMessageGroup = function (state) {
                if ($scope.messageGroupId != null) {
                    $rootScope.pageTitle = $scope.messageNameString;
                    $scope.pageTitle = $rootScope.pageTitle;
                    $scope.getPosts(state);
                }
                else if ($scope.messageGroupId == null && $stateParams._profileIds.length == 0) {
                    $rootScope.pageTitle = "New Message";
                    $scope.pageTitle = $rootScope.pageTitle;
                    $scope.newMsgGroup = true;
                    $scope.newMsgGroupRecipientDecided = false;
                    $scope.pageLoading = false;
                }
                else if ($scope.messageGroupId == null && $stateParams._profileIds.length > 0) {
                    $rootScope.pageTitle = $stateParams.messageNameString;
                    $scope.pageTitle = $rootScope.pageTitle;
                    $stateParams._profileIds = $stateParams._profileIds.split(',');
                    
                    for (a = 0; a < $stateParams._profileIds.length; a++) {
                        if ($stateParams._profileIds[a] != $rootScope.user._profileId) {
                            var getAllProfileDetails = function () {
                                Profile.getAllProfileDetails($stateParams._profileIds[a]).success(function (successData) {
                                    $scope.chosenRecipients.push(successData[0]);
                                }).error(function () {
                                    getAllProfileDetails();
                                });
                            }
                            getAllProfileDetails();
                        }
                        if (a == $stateParams._profileIds.length - 1) {
                            $scope.newMsgGroup = true;
                            $scope.newMsgGroupRecipientDecided = true;
                        }
                    }
                    
                    $scope.pageLoading = false;
                }
            }
            
            // pull to refresh buttons
            $scope.doRefresh = function() {
                $rootScope.appLoading = true;
                $scope.currentMessageIndex += 30;
                $scope.showMessageGroup("earlierMessages");
            }
            
            $scope.cancelListingAttachment = function () {
                $rootScope.relListing = null;
                $rootScope.currentMessageInputPlaceholder = "Type your message here ...";
                $ionicScrollDelegate.$getByHandle('message-group').scrollBottom();
            }
            
            $scope.goToAttachedListing = function (message) {
                if (message.relatedItemType == "Offer") {
                    $state.go('app.offers');
                    var timer = window.setTimeout(function () {
                        $state.go('app.offers.offerDetail', {'_id': message._relatedItemId});
                    }, 220);
                } else {
                    $state.go('app.feed');
                    var timer = null;
                    if (message.relatedItemType == "BusinessesOffers") {
                        timer = $timeout(function () {
                            $state.go('app.seeBusinessesItems', {'_businessId': message._relatedItemId, '_listingId': message._relatedItemId, 'listingType': 'Business', 'itemType': 'Offers', 'listingName': message.relatedItemsListingName});
                        }, 320);
                    } else if (message.relatedItemType == "BusinessesEvents") {
                        timer = $timeout(function () {
                            $state.go('app.seeBusinessesItems', {'_businessId': message._relatedItemId, '_listingId': message._relatedItemId, 'listingType': 'Business', 'itemType': 'UpcomingEvents', 'listingName': message.relatedItemsListingName});
                        }, 320);
                    } else if (message.relatedItemType == "BusinessesTakeaway Menu") {
                        timer = $timeout(function () {
                            /*$state.go('app.seeMenu', {'_businessId': message._relatedItemId, '_menuTypeId': 1});*/
                            $state.go('app.seeMenu', {'_listingId': message._relatedItemId, 'listingType': 'Business', 'listingName': message.relatedItemsListingName, '_businessId': message._relatedItemId, '_menuTypeId': 1});
                        }, 320);
                    } else if (message.relatedItemType == "BusinessesA la Carte Menu") {
                        timer = $timeout(function () {
                            /*$state.go('app.seeMenu', {'_businessId': message._relatedItemId, '_menuTypeId': 2});*/
                            $state.go('app.seeMenu', {'_listingId': message._relatedItemId, 'listingType': 'Business', 'listingName': message.relatedItemsListingName, '_businessId': message._relatedItemId, '_menuTypeId': 2});
                        }, 320);
                    } else if (message.relatedItemType == "BusinessesPhotos") {
                        timer = $timeout(function () {
                            $state.go('app.feedListing-photos', {'_listingId': message._relatedItemProfileId, 'listingType': 'Business', '_id': message._relatedItemProfileId, 'listingName': message.relatedItemsListingName});
                        }, 320);
                    }
                    else if (message.relatedItemType == "EventsOffers") {
                        timer = $timeout(function () {
                            $state.go('app.seeBusinessesItems', {'_listingId': message._relatedItemId, 'listingType': 'Event', 'listingName': message.relatedItemName, _businessId: message._relatedItemId, itemType: 'Offers'});
                        }, 320);
                    }
                    else {
                        timer = $timeout(function () {
                            $state.go('app.feed.nlfeedListing', {'_listingId': message._relatedItemId, 'listingType':message.relatedItemType});
                        }, 220);
                    }

                }
            }
            
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
                        $rootScope.debugModeLog({'msg': 'addMessage successData', 'data': successData});
                        if ($scope._messageGroupId == null) {
                            $scope._messageGroupId = successData[0]._groupId;
                            if ($stateParams.messageNameString == null) {
                                $scope.messageNameString = '';
                                for (a = 0; a < $scope.chosenRecipients.length; a++) {
                                    if ($scope.chosenRecipients[a]._profileId != $rootScope.user._profileId) {
                                        $scope.messageNameString += $scope.chosenRecipients[a].name;
                                    }
                                    if (a < $scope.chosenRecipients.length - 1) {
                                        $scope.messageNameString += ', ';
                                    }
                                    if (a == $scope.chosenRecipients.length - 1) {
                                        $rootScope.pageTitle = $scope.messageNameString;
                                        $scope.pageTitle = $rootScope.pageTitle;
                                    }
                                }
                            }
                        }
                        
                        var getMessageRecipientProfileIds = function () {
                            Messages.getMessageRecipientProfileIds($scope._messageGroupId, $rootScope.user._profileId).success(function (_recipientIds) {
                                var messageText = (newMessage.text == "" || newMessage.text == null) ? "Attached Listing": newMessage.text
                                var contents = $rootScope.user.displayName + ": " + messageText;
                                var header = "New Message";
                                var dataObj = {
                                    "actionFunction": "goToMessage",
                                    "msgGroupType": newMessage.groupType,
                                    "_msgGroupId": $scope._messageGroupId
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
                        var twoDigits = function (d) {
                            if(0 <= d && d < 10) return "0" + d.toString();
                            if(-10 < d && d < 0) return "-0" + (-1*d).toString();
                            return d.toString();
                        }

                        Date.prototype.toMysqlFormat = function() {
                            return this.getUTCFullYear() + "-" + twoDigits(1 + this.getUTCMonth()) + "-" + twoDigits(this.getUTCDate()) + " " + twoDigits(this.getUTCHours()) + ":" + twoDigits(this.getUTCMinutes()) + ":" + twoDigits(this.getUTCSeconds());
                        };
                        newMessage.dateTimeSent = new Date().toMysqlFormat();
                        newMessage.timeString = datesService.getShortenedTimeString(newMessage.dateTimeSent);
                        newMessage._id = successData[0]._newMessageId;
                        
                        getMessageRecipientProfileIds();
                        $scope.groupHasMoreThan2People = ($scope.chosenRecipients.length > 1 && $scope.groupHasMoreThan2People == null) ? true: $scope.groupHasMoreThan2People;
                        $rootScope.$broadcast('new-message-added');
                        
                        //This socket function is the bit that actually updates the view
                        socketNewMessageFunction({'newMessage': newMessage, '_groupId': $scope._messageGroupId});
                        //Socket stuff
                        //socket.emit('new-message', {'_groupId': $stateParams._id, 'newMessage': newMessage});
                        $scope.datamessage = "";
                        $rootScope.relListing = null;
                        $rootScope.currentMessageInputPlaceholder = "Type your message here ...";
                        $scope.addNewMessage = false;
                        $scope.newMessage = null;
                        $scope.newMsgGroup = false;
                        $ionicScrollDelegate.$getByHandle('message-group').scrollBottom();
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
                    if (this.relatedItemType == 'Offer' && $rootScope.relListing.currentOfferCoverPhotoName != null) {
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
                    this._profileIds = (this._groupId != null || $stateParams._profileIds == null || $stateParams._profileIds == '') ? [] : $stateParams._profileIds;
                    this.messageReadState = 'Not Read';
                    
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
                if ($rootScope.currentViewName == 'app.profile.messageGroups.messageGroup') {
                    $scope.showMessageGroup("subsequent");
                    
                        $rootScope.messageGroupTimer = ($rootScope.messageGroupTimer == null) ?
                            $timeout(function () {
                                if ($scope.messageGroupId != null) {
                                    $scope.reloadMessageGroup()
                                }
                            }, 15000):
                            $rootScope.messageGroupTimer;
                }
            }
            
            $scope.showMessageGroup("initial");
            
            $rootScope.$on('new-message-to-get-for-group', function () {
                $scope.showMessageGroup("subsequent");
            });
            
            $scope.$on(
            "$destroy",
                function( event ) {
                    $timeout.cancel( $rootScope.messageGroupTimer );
                    $rootScope.messageGroupTimer = null;
                }
            );
        }
        
        $rootScope.checkForAppInit($scope);
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
            Contacts.addContact(businessType, town, companyName, name, role, phone, email, website, note).success(function (successData) {
                $rootScope.debugModeLog({'msg': 'addContact successData', 'data': successData});
                $rootScope.$broadcast('new-contact');
                $state.go('app.contacts');
            }).error(function (errorData) {
                $rootScope.debugModeLog({'msg': 'addMessage errorData', 'data': errorData});
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
        $scope.editing = false;
        
        //Functions based on User Interactions
        Contacts.getContact($scope._id).success(function (contact) {
            $scope.contact = contact[0];
        });
        
        $scope.editContact = function (_contactId, businessType, town, companyName, name, role, phone, email, website, note) {
            Contacts.editContact(_contactId, businessType, town, companyName, name, role, phone, email, website, note).success(function (successData) {
                $rootScope.debugModeLog({'msg': 'editContact successData', 'data': successData});
                $scope.editing = false;
                $rootScope.currentlyEditing = false;
                $rootScope.$broadcast('new-contact');
            }).error(function () {
                $scope.editContact(_contactId, businessType, town, companyName, name, role, phone, email, website, note);
            });
        }
    }]);
    /* Business Items Views Controller */
    app.controller('BusinessItemsCtrl', ['$rootScope', '$state', '$stateParams', '$scope', 'Offers', 'Profile', 'Events', 'Taxi', 'MenuItems', 'TableBooking', 'Movies', '$ionicViewSwitcher', 'datesService', function($rootScope, $state, $stateParams, $scope, Offers, Profile, Events, Taxi, MenuItems, TableBooking, Movies, $ionicViewSwitcher, datesService) {
        //Variables & Constants
        $scope.businessItems = [];
        $scope.itemType = $stateParams.itemType;
        $scope.timeScale = $stateParams.timeScale;
        
        $scope.$on('$ionicView.beforeEnter', function() {
            $rootScope.pageTitle = ($scope.pageTitle) ? $scope.pageTitle: $rootScope.pageTitle;
            
            $scope.timeScale = $stateParams.timeScale;
            
            if ($stateParams.itemType == 'BusinessMenuItemCats') {
                $rootScope.topRightButtonShouldBeSettings = true;
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
        });
        
        if ($stateParams.itemType != 'BusinessCarteMenuItemCats' 
            && $stateParams.itemType != 'BusinessTakeawayMenuItemCats'
            && $stateParams.itemType != 'BusinessMenuItemCats'
            && $stateParams.itemType != 'myNYTEActivity') {
            $scope.nextPageFunction = function (item) {
                $state.go('app.businessItem', {'_id': item.relListingId, 'itemType': $stateParams.itemType, 'timeScale': $stateParams.timeScale});
            };
        } else if ($stateParams.itemType == 'BusinessMenuItemCats') {
            $scope.nextPageFunction = function (item) {
                $state.go('app.businessItems', {'itemType': item.menuType, 'timeScale': 'present'});
            };
        } else if ($stateParams.itemType == 'BusinessCarteMenuItemCats' 
            || $stateParams.itemType == 'BusinessTakeawayMenuItemCats') {
            $scope.nextPageFunction = function (item) {
                var _menuTypeId = ($stateParams.itemType != 'BusinessCarteMenuItemCats') ? 1: 2;
                $state.go('app.seeBusinessMenuItems', {'_businessId': $rootScope.user._id, '_menuItemCategoryId': item._id, '_menuTypeId': _menuTypeId, 'viewType': 'profile'});
            };
        } else if ($stateParams.itemType == 'myNYTEActivity') {
            $scope.nextPageFunction = function (item) {
            };
        }
        
        $scope.pageLoad = function () {
            var convertToReadableDate = function (dateProp) {
                var string = datesService.getShortenedDateString(dateProp);
                string = datesService.convertToDate($scope, new Date(string));
                return string;
            }
            
            var loopThroughBusinessItems = function (successData, i, businessItemType) {
                if (businessItemType == 'Table Booking') {
                    successData[i].timeRequested = datesService.getShortenedTimeString(successData[i].dateTimeRequested);
                    successData[i].dateRequested = convertToReadableDate(successData[i].dateTimeRequested);
                    if (successData[i].dateTimeSuggested != null) {
                        successData[i].timeSuggested = datesService.getShortenedTimeString(successData[i].dateTimeSuggested);
                    }
                }
                else if (businessItemType == 'Event') {
                    successData[i].DATE = convertToReadableDate(successData[i].DATE);
                    successData[i].lastDate = convertToReadableDate(successData[i].lastDate);
                    
                    successData[i].guestListMax = (successData[i].guestListMax == null) ? 'unlimited': parseInt(successData[i].guestListMax);
                    
                    successData[i].guestListCurrentTotal = (successData[i].guestListCurrentTotal == null) ? 0: successData[i].guestListCurrentTotal;
                }
                else if (businessItemType == 'Offer') {
                    successData[i].endDateTime = (successData[i]._relatedEventId == null) ? convertToReadableDate(successData[i].endDateTime) : convertToReadableDate(successData[i].relatedEventLastDate);
                    successData[i].startDateTime = (successData[i]._relatedEventId == null) ? convertToReadableDate(successData[i].startDateTime) : convertToReadableDate(successData[i].relatedEventStartDate);
                }
                else if (businessItemType == 'Movie') {
                    successData[i].earliestShowingStartDate = convertToReadableDate(successData[i].earliestShowingStartDate);
                    successData[i].latestShowingEndDate = convertToReadableDate(successData[i].latestShowingEndDate);
                }

                if (i < (successData.length - 1)) {
                    loopThroughBusinessItems(successData, i + 1, businessItemType);
                } else {
                    $scope.businessItems = successData;
                    $scope.pageLoading = false;
                }
            }
            
            switch($stateParams.itemType) {
                case 'Movies':
                    $scope.getBusinessItems = function () {
                        Movies.getMoviesForMaintenance($stateParams.timeScale, 0).success(function (successData) {
                            $rootScope.debugModeLog({'msg': 'getMoviesForMaintenance successData', 'data': successData});
                            
                            if (successData != 'null' && successData != null) {
                                loopThroughBusinessItems(successData, 0, 'Movie')
                            } else {
                                $scope.businessItems = [];
                                $scope.pageLoading = false;
                            }
                        }).error(function () {
                            $scope.getBusinessItems();
                        });
                    }
                    
                    //Updates based on Outside events
                    var businessItemAddedFn = $rootScope.$on('new-movie', function(event, args) {
                        $scope.getBusinessItems();
                        // do what you want to do
                    });
                    
                    $scope.$on('$destroy', function() {
                        businessItemAddedFn();
                    });
                    break;
                case 'OwnOffers':
                    $scope.getBusinessItems = function () {
                        $rootScope.pageTitle = ($stateParams.timeScale == 'present') ? "My Current Offers": "My Past Offers";
                        $scope.pageTitle = $rootScope.pageTitle;
                        var _userId = ($rootScope.userLoggedIn) ? $rootScope.user._profileId: 0;
                        Offers.getOffersByBusinessId($rootScope.user._id, _userId, $stateParams.timeScale).success(function (successData) {
                            $rootScope.debugModeLog({'msg': 'BusinessItemsCtrl getOffersByBusinessId successData', 'data': successData});
                            
                            if (successData != 'null' && successData != null) {
                                loopThroughBusinessItems(successData, 0, 'Offer')
                            } else {
                                $scope.businessItems = [];
                                $scope.pageLoading = false;
                            }
                        }).error(function () {
                            $scope.getBusinessItems();
                        });
                    }
                    
                    //Updates based on Outside events
                    var businessItemAddedFn = $rootScope.$on('new-offer', function(event, args) {
                        $scope.getBusinessItems();
                        // do what you want to do
                    });
                    
                    $scope.$on('$destroy', function() {
                        businessItemAddedFn();
                    });
                    break;
                case 'OwnEvents':
                    $rootScope.pageTitle = ($stateParams.timeScale == 'present') ? "My Current Events": "My Past Events";
                    $scope.pageTitle = $rootScope.pageTitle;
                    $scope.getBusinessItems = function () {
                        Events.getEventsByBusiness($rootScope.user._id, $stateParams.timeScale, $rootScope.user._profileId).success(function (successData) {
                            $rootScope.debugModeLog({'msg': 'BusinessItemsCtrl getEventsByBusiness successData', 'data': successData});
                            
                            if (successData != 'null' && successData != null) {
                                loopThroughBusinessItems(successData, 0, 'Event')
                            } else {
                                $scope.businessItems = [];
                                $scope.pageLoading = false;
                            }
                        }).error(function () {
                            $scope.getBusinessItems();
                        });
                    }
                    break;
                case 'RequestedTableBookings':
                    $scope.getBusinessItems = function () {
                        $rootScope.pageTitle = "My Current Table Booking Requests";
                        $scope.pageTitle = $rootScope.pageTitle;
                        TableBooking.getRequestedTableBookings($rootScope.user._id).success(function (successData) {
                            $rootScope.debugModeLog({'msg': 'BusinessItemsCtrl getRequestedTableBookings successData', 'data': successData});
                            
                            if (successData != null) {
                                loopThroughBusinessItems(successData, 0, 'Table Booking')
                            } else {
                                $scope.businessItems = [];
                                $scope.pageLoading = false;
                            }
                        }).error(function () {
                            $scope.getBusinessItems();
                        });
                    }

                    //Updates based on Outside events
                    var businessItemAddedFn = $rootScope.$on('table-booking-updated', function(event, args) {
                        $scope.getBusinessItems();
                        // do what you want to do
                    });
                    
                    $scope.$on('$destroy', function() {
                        businessItemAddedFn();
                    });
                    break;
                case 'OwnTableBookings':
                    $scope.getBusinessItems = function () {
                        $rootScope.pageTitle = ($stateParams.timeScale == 'present') ? "My Current Table Bookings": "My Past Table Bookings";
                        $scope.pageTitle = $rootScope.pageTitle;
                        TableBooking.getAcceptedTableBookings($rootScope.user._id, $stateParams.timeScale).success(function (successData) {
                            $rootScope.debugModeLog({'msg': 'BusinessItemsCtrl getAcceptedTableBookings successData', 'data': successData});
                            
                            if (successData != null) {
                                loopThroughBusinessItems(successData, 0, 'Table Booking')
                            } else {
                                $scope.businessItems = [];
                                $scope.pageLoading = false;
                            }
                        }).error(function () {
                            $scope.getBusinessItems();
                        });
                    }
                    var businessItemAddedFn = $rootScope.$on('table-booking-updated', function(event, args) {
                        $scope.getBusinessItems();
                        // do what you want to do
                    });
                    
                    $scope.$on('$destroy', function() {
                        businessItemAddedFn();
                    });
                    break;
                case 'RequestedTakeawayOrders':
                case 'OwnTakeawayOrders':
                    var requestType = ($stateParams.itemType == 'RequestedTakeawayOrders') ? 'allRequested': 'own';

                    $scope.getBusinessItems = function () {
                        MenuItems.getMenuOrdersForBusiness($rootScope.user._id, requestType).success(function (successData) {
                            $rootScope.debugModeLog({'msg': 'BusinessItemsCtrl getMenuOrdersForBusiness successData', 'data': successData});
                            
                            if (successData != 'null' && successData != null) {
                                $scope.businessItems = successData;
                            } else {
                                $scope.businessItems = [];
                                $scope.pageLoading = false;
                            }
                        }).error(function () {
                        $scope.getBusinessItems();
                        });
                    }
                    
                    //Updates based on Outside events
                    var businessItemAddedFn = $rootScope.$on('menu-order-updated', function(event, args) {
                        $scope.getBusinessItems();
                        // do what you want to do
                    });
                    
                    $scope.$on('$destroy', function() {
                        businessItemAddedFn();
                    });
                    break;
                case 'BusinessMenuItemCats':
                    $scope.getBusinessItems = function () {
                        $rootScope.pageTitle = "My Menus";
                        $scope.pageTitle = $rootScope.pageTitle;
                        $scope.businessItems = [];
                        if ($rootScope.user.listingTypes.indexOf('Takeaway') != -1) {
                            $scope.businessItems.push({name: 'Takeaway Menu', menuType: 'BusinessTakeawayMenuItemCats'});
                        }
                        if ($rootScope.user.listingTypes.indexOf('Restaurant') != -1) {
                            $scope.businessItems.push({name: 'A la Carte Menu', menuType: 'BusinessCarteMenuItemCats'});
                        }
                        $scope.pageLoading = false;
                    }
                    break;
                case 'BusinessCarteMenuItemCats':
                case 'BusinessTakeawayMenuItemCats':
                    var _menuTypeId = ($stateParams.itemType == 'BusinessCarteMenuItemCats') ? 2: 1;
                    $scope.showTagOptions = true;
                    $scope.showExtraOptionsOptions = true;

                    $scope.getBusinessItems = function () {
                        $rootScope.pageTitle = ($stateParams.itemType == 'BusinessCarteMenuItemCats') ? "My a la Carte Menu": "My Takeaway Menu";
                        $scope.pageTitle = $rootScope.pageTitle;
                        $scope.sortMenuItems = function () {
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
                                    $scope.pageLoading = false;
                                }
                            }
                        }
                        
                        var getMenuItems = function () {
                            MenuItems.getMenuItems($rootScope.user._id, 0, _menuTypeId).success(function (successData) {
                                $rootScope.debugModeLog({'msg': 'BusinessItemsCtrl getMenuItems successData', 'data': successData});
                                
                                $scope.menuItemCategories = [];
                                $scope.menuItemCategoriesAdded = [];
                                $scope.menuItems = [];
                                $scope.menuItemsAdded = [];
                                var successData = (successData != 'null' && successData != null) ? successData : [];
                                for (a = 0; a < successData.length; a++) {
                                    tagsObj = {'tagName':successData[a].tagName, 'iconClass':successData[a].iconClass};
                                    if ($scope.menuItemsAdded.indexOf(successData[a]._id) == -1) {
                                    
                                        //Check the rootScope order object to add already ordered items into this object
                                        $rootScope.currentSavedFoodOrders = $rootScope.currentSavedFoodOrders || [];
                                        
                                        for (b = 0; b < $rootScope.currentSavedFoodOrders.length; b++) {
                                            if ($rootScope.currentSavedFoodOrders[b]._businessId == $stateParams._businessId) {
                                                var thisTakeawaysOrderObject = $rootScope.currentSavedFoodOrders[b];
                                                for (c = 0; c < thisTakeawaysOrderObject.menuItems.length; c++) {
                                                    if (thisTakeawaysOrderObject.menuItems[c].item._id == successData[a]._id) {
                                                        successData[a].itemsAddedToBasket = thisTakeawaysOrderObject.menuItems[c].item.itemsAddedToBasket;
                                                    }
                                                }
                                            }
                                        }
                                    
                                        $scope.menuItems.push(successData[a]);
                                        $scope.menuItemsAdded.push(successData[a]._id);
                                    }
                                    
                                    if (a == successData.length - 1 && successData.length > 0) {
                                        $scope.sortMenuItems();
                                    }
                                }
                                if (successData.length == 0) {
                                    $scope.businessItems = [];
                                    $scope.pageLoading = false;
                                }
                            }).error(function () {
                                getMenuItems();
                            });
                        }
                        
                        getMenuItems();
                    }
                    
                    //Updates based on Outside events
                    var businessItemAddedFn = $rootScope.$on('menu-items-changed', function(event, args) {
                        $scope.getBusinessItems();
                        // do what you want to do
                    });
                    
                    $scope.$on('$destroy', function() {
                        businessItemAddedFn();
                    });
                    break;
                case 'MenuItemCategories':
                    $scope.getBusinessItems = function () {
                        $rootScope.pageTitle = "My Menu Categories";
                        $scope.pageTitle = $rootScope.pageTitle;
                        MenuItems.getMenuItemCategoriesForBusiness($rootScope.user._id).success(function (successData) {
                            $rootScope.debugModeLog({'msg': 'BusinessItemsCtrl getMenuItemCategoriesForBusiness successData', 'data': successData});
                            
                            if (successData != 'null' && successData != null) {
                                $scope.businessItems = successData;
                            } else {
                                $scope.businessItems = [];
                                $scope.pageLoading = false;
                            }
                        }).error(function () {
                            $scope.getBusinessItems();
                        });
                    }
                    
                    //Updates based on Outside events
                    var businessItemAddedFn = $rootScope.$on('menu-item-categories-changed', function(event, args) {
                        $scope.getBusinessItems();
                        // do what you want to do
                    });
                    
                    $scope.$on('$destroy', function() {
                        businessItemAddedFn();
                    });
                    break;
                case 'MenuItemSubCategories':
                    $scope.getBusinessItems = function () {
                        $rootScope.pageTitle = "My Menu Sub-categories";
                        $scope.pageTitle = $rootScope.pageTitle;
                        MenuItems.getMenuItemSubCategoriesForBusiness($rootScope.user._id).success(function (successData) {
                            $rootScope.debugModeLog({'msg': 'BusinessItemsCtrl getMenuItemSubCategoriesForBusiness successData', 'data': successData});
                            
                            if (successData != 'null' && successData != null) {
                                $scope.businessItems = successData;
                            } else {
                                $scope.businessItems = [];
                                $scope.pageLoading = false;
                            }
                        }).error(function () {
                            $scope.getBusinessItems();
                        });
                    }
                    
                    //Updates based on Outside events
                    var businessItemAddedFn = $rootScope.$on('menu-item-sub-categories-changed', function(event, args) {
                        $scope.getBusinessItems();
                        // do what you want to do
                    });
                    
                    $scope.$on('$destroy', function() {
                        businessItemAddedFn();
                    });
                    break;
                case 'MenuItemTemplateOptions':
                    $scope.getBusinessItems = function () {
                        $rootScope.pageTitle = "My Menu Template Options";
                        $scope.pageTitle = $rootScope.pageTitle;
                        MenuItems.getAllMenuItemTemplateOptionsForBusiness($rootScope.user._id).success(function (successData) {
                            $rootScope.debugModeLog({'msg': 'BusinessItemsCtrl getAllMenuItemTemplateOptionsForBusiness successData', 'data': successData});
                            
                            var businessItems = [];
                            var businessItemIds = [];
                            
                            successData = (successData != 'null' && successData != null) ? successData: [];
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
                            $scope.pageLoading = false;
                            
                        }).error(function () {
                            $scope.getBusinessItems();
                        });
                    }
                    
                    //Updates based on Outside events
                    var businessItemAddedFn = $rootScope.$on('menu-item-template-options-changed', function(event, args) {
                        $scope.getBusinessItems();
                        // do what you want to do
                    });
                    
                    $scope.$on('$destroy', function() {
                        businessItemAddedFn();
                    });
                    break;
                case 'RequestedTaxiBookings':
                    $scope.getBusinessItems = function () {
                        $rootScope.pageTitle = "Current Taxi Booking Requests";
                        $scope.pageTitle = $rootScope.pageTitle;
                        Taxi.getTaxiBookingsForBusiness('allRequested', $rootScope.user._id).success(function (successData) {
                            $rootScope.debugModeLog({'msg': 'BusinessItemsCtrl getTaxiBookingsForBusiness successData', 'data': successData});
                            
                            if (successData != 'null' && successData != null) {
                                $scope.businessItems = successData;
                            } else {
                                $scope.businessItems = [];
                                $scope.pageLoading = false;
                            }
                        }).error(function () {
                            $scope.getBusinessItems();
                        });
                    }
                    
                    //Updates based on Outside events
                    var businessItemAddedFn = $rootScope.$on('taxi-booking-response-sent', function(event, args) {
                        $scope.getBusinessItems();
                        // do what you want to do
                    });
                    
                    $scope.$on('$destroy', function() {
                        businessItemAddedFn();
                    });
                    break;
                case 'OwnTaxiBookings':
                    $scope.getBusinessItems = function () {
                        var mode = ($stateParams.timeScale == 'present') ? 'own': 'ownPast';
                        $rootScope.pageTitle = ($stateParams.timeScale == 'present') ? "My Current Taxi Bookings": "My Past Taxi Bookings";
                        $scope.pageTitle = $rootScope.pageTitle;
                        Taxi.getTaxiBookingsForBusiness(mode, $rootScope.user._id).success(function (successData) {
                            $rootScope.debugModeLog({'msg': 'BusinessItemsCtrl getTaxiBookingsForBusiness successData', 'data': successData});
                            
                            if (successData != 'null' && successData != null) {
                                $scope.businessItems = successData;
                            } else {
                                $scope.businessItems = [];
                                $scope.pageLoading = false;
                            }
                        }).error(function () {
                            $scope.getBusinessItems();
                        });
                    }
                    break;
                case 'myNYTEActivity':
                    $scope.getBusinessItems = function () {
                        $scope.timeScale == $stateParams.timeScale;
                        $rootScope.pageTitle = ($stateParams.timeScale == 'present') ? "My Current MyNyte Activity" : "My Past MyNyte Activity";
                        $scope.pageTitle = $rootScope.pageTitle;
                        Profile.getMyNyteActivityForPerson($rootScope.user._profileId, $stateParams.timeScale).success(function (successData) {
                            $rootScope.debugModeLog({'msg': 'BusinessItemsCtrl getMyNyteActivityForPerson successData', 'data': successData});
                            
                            $scope.businessItems = [
                                {name: 'Table Bookings', dbName: 'Table Booking', icon: 'ion-fork', show: $stateParams.timeScale == 'present', items: []},
                                {name: 'Taxi Bookings', dbName: 'Taxi Booking', icon: 'ion-android-car', show: $stateParams.timeScale == 'present', items: []},
                                /*{name: 'Claimed Offers', dbName: 'Offer', icon: 'ion-social-usd', show: $stateParams.timeScale == 'present', items: []},*/
                                {name: 'Event Entry', dbName: 'Event Entry', icon: 'ion-clipboard', show: $stateParams.timeScale == 'present', items: []}
                            ];
                            if (successData != 'null' && successData != null) {
                                var loopThroughBusinessItems = function (i) {
                                    var loopCompletionFunction = function (i) {
                                        if (i < $scope.businessItems.length - 1) {
                                            loopThroughBusinessItems(i + 1);
                                        } else {
                                            $scope.pageLoading = false;
                                        }
                                    }
                                    var loopThroughSuccessData = function (ind) {

                                        successData[ind].timeRequested = (successData[ind].dateTimeRequested != null) ? datesService.getShortenedTimeString(successData[ind].dateTimeRequested): null;
                                        successData[ind].dateRequested = (successData[ind].dateTimeRequested != null) ? datesService.getShortenedDateString(successData[ind].dateTimeRequested): null;
                                        successData[ind].dateRequested = (successData[ind].dateTimeRequested != null) ? datesService.convertToDate($scope, new Date(successData[ind].dateRequested)): null;
                                        successData[ind].endTime = (successData[ind].endDateTime != null) ? datesService.getShortenedTimeString(successData[ind].endDateTime): null;
                                        successData[ind].endDate = (successData[ind].endDateTime != null) ? datesService.getShortenedDateString(successData[ind].endDateTime): null;
                                        successData[ind].endDate = (successData[ind].endDateTime != null) ? datesService.convertToDate($scope, new Date(successData[ind].endDate)): null;

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
                        $state.go('app.businessItem', {_id: item._id, itemType: item.itemType, timeScale: $stateParams.timeScale});
                    }
                    
                    var businessItemUpdatedFn = $rootScope.$on('taxi-booking-updated', function (event, args) {
                        $scope.getBusinessItems();
                    });
                    
                    var businessItemUpdatedFn2 = $rootScope.$on('table-booking-updated', function (event, args) {
                        $scope.getBusinessItems();
                    });
                    var businessItemUpdatedFn3 = $rootScope.$on('event-entry-booking-updated', function (event, args) {
                        $scope.getBusinessItems();
                    });
                    
                    $scope.$on('$destroy', function() {
                        businessItemUpdatedFn();
                        businessItemUpdatedFn2();
                        businessItemUpdatedFn3();
                    });
                    break;
            };
            
            $scope.getBusinessItems();
        }
        
        $rootScope.checkForAppInit($scope);
    }]);

    app.controller('BusinessItemCtrl', ['$rootScope', '$state', '$stateParams', '$scope', '$ionicHistory', 'ionicTimePicker', '$ionicPopup', 'Notifications', 'Profile', 'Events', 'Offers', 'Taxi', 'MenuItems', 'TableBooking', 'Categories', 'Movies', 'ionicDatePicker', '$ionicScrollDelegate', '$ionicViewSwitcher', 'datesService', function($rootScope, $state, $stateParams, $scope, $ionicHistory, ionicTimePicker, $ionicPopup, Notifications, Profile, Events, Offers, Taxi, MenuItems, TableBooking, Categories, Movies, ionicDatePicker, $ionicScrollDelegate, $ionicViewSwitcher, datesService) {
        //Variables & Constants
        $scope.storedBusinessItem = {};
        $rootScope.hideSearch = true;
        $scope.rootScope = $rootScope;
        $scope.itemType = $stateParams.itemType;
        
        $scope.selectExtraOption = function (chosenOptionItem, $event) {
            $rootScope.selectExtraOption(chosenOptionItem, $event, $scope.businessItem);
        }
        
        $scope.$on('$ionicView.beforeEnter', function() {
            $rootScope.pageTitle = ($scope.pageTitle) ? $scope.pageTitle: $rootScope.pageTitle;
            
            $rootScope.topRightButtonFunction = function () {
                if ($scope.editing) {
                    $scope.businessItem = $scope.storedBusinessItem;
                } else {
                    $scope.storedBusinessItem = angular.copy($scope.businessItem);
                }
                
                if ($scope.extraTopRightFunction) {
                    $scope.extraTopRightFunction();
                }
                if ($scope.editing) {
                    $ionicScrollDelegate.scrollTop();
                }
                
                $rootScope.currentlyEditing = !$rootScope.currentlyEditing;
                $scope.editing = !$scope.editing;
            };
            
            var array = ['RequestedTableBookings', 'OwnTableBookings', 'myNYTEActivity', 'OwnTaxiBookings', 'RequestedTaxiBookings', 'OwnTakeawayOrders', 'RequestedTakeawayOrders', 'Event Entry', 'Taxi Booking', 'Table Booking'];
            if (array.indexOf($stateParams.itemType) != -1 || $stateParams.timeScale == 'past') {
                $rootScope.topRightButtonIsEdit = false;
            }
            else {
                $rootScope.topRightButtonIsEdit = true;
            }
            
            if ($stateParams.itemType == 'OwnEvents') {
                //$rootScope.showStatsButton = true;
            }
        });
        
        $scope.pageLoad = function () {
            $rootScope.editing = false;
            $rootScope.currentlyEditing = false;
            $scope.editing = false;
            
            var convertToReadableDate = function (obj) {
                var conversion = function (prop) {
                    var newProp = datesService.getShortenedDateString(prop);
                    newProp = datesService.convertToDate($scope, new Date(newProp));
                    return newProp;
                }
                if (obj.listingType == 'Offer') {
                    obj.endDateTimeString = (obj._relatedEventId == null) ? conversion(obj.endDateTime) : conversion(obj.relatedEventLastDate);
                    obj.startDateTimeString = (obj._relatedEventId == null) ? conversion(obj.startDateTime) : conversion(obj.relatedEventLastDate);
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
            
            switch($stateParams.itemType) {
                case 'Movies':
                    $scope.getBusinessItem = function () {
                        Movies.getMoviesForMaintenance('', $stateParams._id).success(function (successData) {
                            $rootScope.debugModeLog({'msg': 'BusinessItemCtrl getMoviesForMaintenance successData', 'data': successData});
                            
                            if (successData != 'null' && successData != null) {
                                convertToReadableDate(successData[0]);
                            }
                            $scope.businessItem = (successData != 'null' && successData != null) ? successData[0]: [];
                        }).error(function () {
                            $scope.getBusinessItem();
                        });
                    }
                    
                    break;
                case 'OwnOffers':
                    $scope.getBusinessItem = function () {
                        var _userId = ($rootScope.userLoggedIn) ? $rootScope.user._profileId: 0;
                        Offers.getOffer($stateParams._id, _userId).success(function (successData) {
                            $rootScope.debugModeLog({'msg': 'BusinessItemCtrl getOffer successData', 'data': successData});
                            
                            if (successData != 'null' && successData != null) {
                                convertToReadableDate(successData[0]);
                            }
                            $scope.businessItem = (successData != 'null' && successData != null) ? successData[0]: [];
                            $rootScope.pageTitle = (successData != 'null' && successData != null) ? successData[0].title: "Offer Error";
                            $scope.pageTitle = $rootScope.pageTitle;
                            
                            $scope.getAllOfferCategoriesForBusiness = function () {
                                Categories.getAllOfferCategoriesForBusiness($rootScope.user._id).success(function (successData) {
                                    $rootScope.debugModeLog({'msg': 'BusinessItemCtrl getAllOfferCategoriesForBusiness successData', 'data': successData});
                                    
                                    $scope.businessItem.offerCategories = successData;
                                    
                                    for (b = 0; b < $scope.businessItem.offerCategories.length; b++) {
                                        if ($scope.businessItem.offerCategories[b]._id == $scope.businessItem._offerSubCategoryId) {
                                            $scope.businessItem.chosenOfferCat = $scope.businessItem.offerCategories[b];
                                        }
                                    }
                                }).error(function (errorData) {
                                    window.setTimeout(function () {
                                        $scope.getAllOfferCategoriesForBusiness();
                                    }, 100);
                                });
                            }
                            $scope.getAllOfferCategoriesForBusiness();
                            
                            $scope.businessItem.offerTypes = [
                                {
                                    name: 'Basic',
                                    displayName: 'Standard Offer',
                                    description: 'Standard Offer with information',
                                    itemType: 'offerType',
                                    _id: 1
                                },
                                {
                                    name: 'WithManualPromoCode',
                                    displayName: 'Detailed Offer with Enquiry Form',
                                    description: 'Create an Offer with detailed info, a built-in enquiry form and an optional photo.',
                                    itemType: 'offerType',
                                    _id: 2
                                },
                                {
                                    name: 'WithAutoPromoCode',
                                    displayName: 'MyNyte Exclusive Offer',
                                    description: 'Create an Offer that\'s exclusive to MyNyte. Get a priority listing in the Offers Display!',
                                    itemType: 'offerType',
                                    _id: 3
                                }
                                /*{
                                    name: 'WithAutoPromoCode',
                                    displayName: 'Promo-Code Offer (auto-generated)',
                                    description: 'Create an Offer with a Promo Code that MyNyte automatically generates. Quick & easy!',
                                    itemType: 'offerType',
                                    _id: 3
                                }*/];
                            for (a = 0; a < $scope.businessItem.offerTypes.length; a++) {
                                if ($scope.businessItem.offerTypes[a]._id == $scope.businessItem._offerTypeId) {
                                    var relType = $scope.businessItem.offerTypes[a];
                                    $scope.businessItem.selectedOfferType = {
                                        name: relType.name,
                                        displayName: relType.displayName,
                                        description: relType.description,
                                        itemType: relType.itemType,
                                        mustBeSelected: true,
                                        _id: relType._id
                                    }
                                }
                            }
                            
                            $scope.businessItem.availableWeeks = [
                                {_id: 1, name: '1 week ahead'},
                                {_id: 2, name: '2 weeks ahead'},
                                {_id: 3, name: '3 weeks ahead'},
                                {_id: 4, name: '4 weeks ahead'},
                                {_id: 5, name: '5 weeks ahead'},
                                {_id: 6, name: '6 weeks ahead'},
                                {_id: 7, name: '7 weeks ahead'}
                            ];
                            
                            $scope.businessItem.offerRegularityTypes = [
                                {name: 'one-off', displayName: 'This is an offer that runs everyday for a certain period of time.', itemType: 'offerRegularityType', mustBeSelected: true},
                                {name: 'weekly', displayName: 'This is a weekly offer that occurs on a certain day every week.', itemType: 'offerRegularityType', mustBeSelected: true}
                            ];
                            
                            if ($scope.businessItem.weekdayName == null) {
                                $scope.businessItem.selectedOfferRegularityType = {
                                    name: 'one-off', displayName: 'This is an offer that runs everyday for a certain period of time.', mustBeSelected: true
                                };
                            } else {
                                $scope.businessItem.selectedOfferRegularityType = {
                                    name: 'weekly', displayName: 'This is a weekly offer that occurs on a certain day every week.', mustBeSelected: true
                                };
                            }
                            
                            $scope.businessItem.chosenWeeksAhead = {_id: 1, name: '1 week ahead'};
                            $scope.businessItem.showWeeksAhead = false;
                            //Set up Date Picker
                            $scope.businessItem.selectedDate1 = new Date($scope.businessItem.officialStartDate);
                            $scope.businessItem.selectedDate2 = new Date($scope.businessItem.officialEndDate);
                            $scope.todaysDate = new Date();
                            $scope.finalDate = new Date();
                            $scope.businessItem.dateChosen = false;
                            var newEndDate = new Date($scope.businessItem.officialStartDate);
                            newEndDate = newEndDate.setDate(newEndDate.getDate() + 60);
                            
                            for (a = 0; a < $scope.businessItem.availableWeeks.length; a++) {
                                if ($scope.businessItem.availableWeeks[a]._id == $scope.businessItem.weeksAhead) {
                                    var ind = a;
                                    $scope.businessItem.chosenWeeksAhead = {_id: $scope.businessItem.availableWeeks[ind]._id};
                                    $scope.businessItem.chosenWeeksAhead.name = $scope.businessItem.availableWeeks[ind].name;
                                }
                            }
                
                            $scope.ipObj1 = {
                              callback: function (val) {  //Mandatory
                                $scope.businessItem.selectedDate1 = new Date(val);
                                $scope.businessItem.weekdayName = datesService.days[$scope.businessItem.selectedDate1.getDay()];
                                $scope.businessItem.startDateTimeString = datesService.convertToDate($scope, $scope.businessItem.selectedDate1);
                                $scope.ipObj1.inputDate = new Date(val);
                                
                                var result = angular.copy($scope.businessItem.selectedDate1);
                                $scope.ipObj2.from = angular.copy($scope.businessItem.selectedDate1);
                                $scope.ipObj2.to = angular.copy(new Date(result.setDate(result.getDate() + 60)));
                                
                                $scope.businessItem.dateChosen = true;
                              },
                              disabledDates: [],
                              from: new Date(), //Optional
                              to: ( new Date($scope.businessItem.officialEndDate) < new Date($scope.finalDate.getDate() + 30) )
                                    ? new Date($scope.businessItem.officialEndDate)
                                    : $scope.finalDate.setDate($scope.finalDate.getDate() + 30), //Optional
                              inputDate: new Date($scope.businessItem.officialStartDate),      //Optional
                              mondayFirst: true,          //Optional
                              disableWeekdays: [],       //Optional
                              closeOnSelect: true,       //Optional
                              templateType: 'popup'       //Optional
                            };
                            
                            $scope.ipObj2 = {
                              callback: function (val) {  //Mandatory
                                $scope.businessItem.selectedDate2 = new Date(val);
                                $scope.businessItem.endDateTimeString = datesService.convertToDate($scope, $scope.businessItem.selectedDate2);
                                $scope.ipObj2.inputDate = new Date(val);
                                var today = new Date();
                                var newDate = today.setDate(today.getDate() + 30);
                                
                                $scope.ipObj1.to = (new Date(val) > new Date(newDate)) ? angular.copy(new Date(newDate)): angular.copy(new Date(val));
                              },
                              disabledDates: [],
                              from: new Date($scope.businessItem.officialStartDate), //Optional
                              to: newEndDate, //Optional
                              inputDate: new Date($scope.businessItem.officialEndDate),      //Optional
                              mondayFirst: true,          //Optional
                              disableWeekdays: [],       //Optional
                              closeOnSelect: true,       //Optional
                              templateType: 'popup'       //Optional
                            };
                            
                            //User Action function
                            $scope.openDatePicker = function (ipObj) {
                                ionicDatePicker.openDatePicker(ipObj);
                            }
                            
                            $scope.toggleOfferCategory = function (cat) {
                                $scope.businessItem.showOfferCategories = !$scope.businessItem.showOfferCategories;
                            }
                            
                            $scope.selectOfferCategory = function (cat) {
                                $scope.businessItem.chosenOfferCat = cat;
                                $scope.businessItem.showOfferCategories = !$scope.businessItem.showOfferCategories;
                            }
                            
                            $scope.toggleWeeksAheadVisibility = function () {
                                $scope.businessItem.showWeeksAhead = !$scope.businessItem.showWeeksAhead;
                            }

                            $scope.selectWeeksAhead = function (weeksAhead) {
                                $scope.businessItem.chosenWeeksAhead = weeksAhead;
                                $scope.businessItem.showWeeksAhead = false;
                            }
                            
                            $scope.updateOffer = function () {
                                //$rootScope.appLoading = true;

                                $rootScope.prepareEventData = function ($scope, offer, relStartDate, relEndDate, item) {
                                    offer.startDateTimeStringToSubmit = relStartDate.getFullYear() + '-' + (relStartDate.getMonth() + 1) + '-' + relStartDate.getDate() + ' 00:00';
                                    offer.endDateTimeStringToSubmit = ($scope.businessItem.selectedDate2 == null || $scope.businessItem.selectedOfferRegularityType.name == 'weekly') ? null: relEndDate.getFullYear() + '-' + (relEndDate.getMonth() + 1) + '-' + relEndDate.getDate() + ' 00:00';
                                    offer.weekdayIndex = (relStartDate.getDay() == 0) ? 7 : relStartDate.getDay();
                                    offer.weekdayIndex = ($scope.businessItem.selectedOfferRegularityType.name == 'weekly') ? offer.weekdayIndex: null;

                                    offer.weeksAhead = ($scope.businessItem.selectedOfferRegularityType.name == 'one-off') ? 0: $scope.businessItem.chosenWeeksAhead._id;
                                }

                                var offer = $scope.businessItem;
                                
                                $rootScope.prepareEventData($scope, offer, $scope.businessItem.selectedDate1, $scope.businessItem.selectedDate2, $scope.businessItem);
                                
                                var updateOffer = function (offer) {
                                    Offers.updateOffer(offer._id, $rootScope.user._id, offer.selectedOfferType._id, offer.chosenOfferCat._id, offer.title, offer.description, offer.startDateTimeStringToSubmit, offer.endDateTimeStringToSubmit, offer.weeksAhead, offer.weekdayIndex).success(function (successData) {
                                        $rootScope.backButtonFunction();
                                        $rootScope.appLoading = false;
                                        $rootScope.editing = false;
                                        $rootScope.currentlyEditing = false;
                                        $scope.editing = false;
                                    }).error(function () {
                                        updateOffer(offer);
                                    });
                                }
                                
                                updateOffer(offer);
                            }
                        }).error(function () {
                            $scope.getBusinessItem();
                        });
                    }
                    
                    break;
                case 'OwnEvents':
                    $scope.finalDate = new Date();
                    var ipObj1 = {
                      callback: function (val) {  //Mandatory
                        $scope.businessItem.selectedDate1 = new Date(val);
                        $scope.businessItem.dateInputHTML = datesService.convertToDate($scope, $scope.businessItem.selectedDate1);
                        ipObj1.inputDate = new Date(val);
                        $scope.businessItem.dateChosen = true;
                      },
                      disabledDates: [],
                      from: new Date(), //Optional
                      to: $scope.finalDate.setDate($scope.finalDate.getDate() + 90), //Optional
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
                                $scope.businessItem.chosenMusicStyleIds[a] = musicCategory._id;
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
                        
                        $scope.businessItem.showMusicCategories = false;
                    }

                    $scope.removeMusicStyle = function (style) {
                        var indexToRemove = null;
                        $scope.businessItem.showMusicCategories = false;
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
                        $scope.businessItem.chosenMusicStyleObjects.push({
                            index: $scope.businessItem.currentMusicStyleIndexToAdd, 
                            _id: null, 
                            name: 'Select a Music Style',
                            showMusicCategories: false});
                        $scope.businessItem.chosenMusicStyleIds.push(null);
                        
                        $scope.businessItem.currentMusicStyleIndexToAdd = $scope.businessItem.currentMusicStyleIndexToAdd + 1;
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
                        
                            var getEvent = function () {
                                Events.getEvent($stateParams._id).success(function (successData) {
                                    $rootScope.debugModeLog({'msg': 'BusinessItemCtrl getEvent successData', 'data': successData});
                                    $rootScope.pageTitle = "Event Error";
                                    $scope.pageTitle = $rootScope.pageTitle;
                                    if (successData != 'null' && successData != null) {
                                        convertToReadableDate(successData[0]);
                                        $scope.businessItem = successData[0];
                                        $rootScope.pageTitle = $scope.businessItem.name;
                                        $scope.pageTitle = $rootScope.pageTitle;
                                        $scope.businessItem.musicStyles = musicStyles;
                                        
                                        ipObj1.inputDate = new Date($scope.businessItem.DATE);

                                        $scope.businessItem.currentMusicStyleIndexToAdd = 0;
                                        $scope.businessItem.chosenMusicStyleObjects = [];
                                        $scope.businessItem.chosenMusicStyleIds = [];
                                        $scope.businessItem.chosenWeekday = {_id: null, name: '1 week ahead'};
                                        $scope.businessItem.chosenWeeksAhead = {_id: 1, name: '1 week ahead'};
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
                                        
                                        for (a = 0; a < $scope.businessItem.availableWeeks.length; a++) {
                                            if ($scope.businessItem.availableWeeks[a]._id == $scope.businessItem.weeksAhead) {
                                                var ind = a;
                                                $scope.businessItem.chosenWeeksAhead = {_id: $scope.businessItem.availableWeeks[ind]._id};
                                                $scope.businessItem.chosenWeeksAhead.name = $scope.businessItem.availableWeeks[ind].name;
                                            }
                                        }
                                        
                                        $scope.eventRegularityTypes = [
                                            {   name: 'one-off',
                                                displayName: 'This is a one-off event',
                                                itemType: 'eventRegularityType'
                                            },
                                            {   name: 'weekly',
                                                displayName: 'This is a weekly event',
                                                itemType: 'eventRegularityType'
                                            }
                                        ];
                                        $scope.businessItem.selectedEventRegularityType = {
                                            name: '',
                                            displayName: '',
                                            mustBeSelected: true
                                        };
                                        $scope.businessItem.selectedEventRegularityType.name = ($scope.businessItem.weekdayIndexId != null) ? 'weekly': 'one-off';
                                        $scope.businessItem.selectedEventRegularityType.displayName = ($scope.businessItem.weekdayIndexId != null) ? 'This is a weekly event': 'This is a one-off event';
                                        
                                        $scope.eventGuestListOptions = [
                                            {name: 'false',
                                            displayName: 'There is no event guestlist for users',
                                            mustBeSelected: true,
                                            itemType: 'eventGuestListOption'},
                                            {name: 'true',
                                            displayName: 'There is an event guestlist for users',
                                            mustBeSelected: true,
                                            itemType: 'eventGuestListOption'}
                                        ];
                                        $scope.businessItem.selectedEventGuestListOption = {
                                            name: '',
                                            displayName: '',
                                            mustBeSelected: true
                                        };
                                        $scope.businessItem.selectedEventGuestListOption.name = ($scope.businessItem.isGuestListAllowed != null) ? 'true': 'false';
                                        $scope.businessItem.selectedEventGuestListOption.displayName = ($scope.businessItem.isGuestListAllowed != null) ? 'There is an event guestlist for users': 'There is no event guestlist for users';
                                        
                                        $scope.guestListMaxInput = [{_id: 1}];
                                        if ($scope.businessItem.guestListMax != null) {
                                            $scope.guestListMaxInput[0].val = $scope.businessItem.guestListMax;
                                        }
                                        

                                        $scope.businessItem.selectedDate1 = new Date();
                                        $scope.businessItem.todaysDate = new Date();
                                        $scope.businessItem.finalDate = new Date();
                                        $scope.businessItem.dateChosen = false;
                                        
                                        $scope.businessItem.dateInputHTML = 'Select a date for this event';

                                        $scope.businessItem.eventHasGuestList = ($scope.businessItem.isGuestListAllowed != null) ? true: false;
                                        $scope.businessItem.guestListMax = ($scope.businessItem.guestListMax == null) ? ($scope.businessItem.eventHasGuestList) ? 'unlimited': null: parseInt($scope.businessItem.guestListMax);
                                        $scope.businessItem.guestListCurrentTotal = ($scope.businessItem.guestListCurrentTotal == 'null') ? 0: $scope.businessItem.guestListCurrentTotal;
                                        $scope.businessItem.eventIsOneOff = ($scope.businessItem.weekdayIndexId == null) ? true: false;
                                        $scope.businessItem.eventIsWeekly = ($scope.businessItem.weekdayIndexId == null) ? false: true;
                                        $scope.businessItem.selectedDate1 = new Date($scope.businessItem.DATE.split(' ')[0]);
                                        $scope.businessItem.dateInputHTML = datesService.convertToDate($scope, $scope.businessItem.selectedDate1);

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
                                    }
                                }).error(function () {
                                    getEvent();
                                });

                            }
                            
                            getEvent();
                        }).error(function () {
                            $scope.getBusinessItem();
                        });
                    }

                    $scope.updateEvent = function (eventTitle, description, dressCode, dealsOnTheNight, extraInfo) {
                        $rootScope.appLoading = true;

                        $rootScope.prepareEventData = function ($scope, event, relDate, item) {
                            event._businessPlaceId = null;
                            event.dateTimeString = relDate.getFullYear() + '-' + (relDate.getMonth() + 1) + '-' + relDate.getDate() + ' 00:00';
                            event.weekdayIndex = (relDate.getDay() == 0) ? 7 : relDate.getDay();
                            event.weekdayIndex = ($scope.businessItem.selectedEventRegularityType.name == 'weekly') ? event.weekdayIndex: null;
                            
                            if ($rootScope.user.businessTypeName == 'Nightclub' || $rootScope.user.businessTypeName == 'Bar') {
                                event._businessPlaceId = $rootScope.user._businessPlaceId;
                            } else {
                                event._businessPlaceId = $rootScope.user._businessPlaceId;
                            }

                            event.guestListMax = ($scope.guestListMaxInput[0].val == null) ? 0: $scope.guestListMaxInput[0].val;
                            event.weeksAhead = ($scope.businessItem.selectedEventRegularityType.name == 'one-off') ? 0: $scope.businessItem.chosenWeeksAhead._id;
                            event.eventHasGuestList = ($scope.businessItem.selectedEventGuestListOption.name == 'true') ? 1: 0;
                        }

                        var event = $scope.businessItem;
                        event.guestListMax = ($scope.guestListMaxInput[0].val == null) ? 0: $scope.guestListMaxInput[0].val;
                        $rootScope.prepareEventData($scope, event, $scope.businessItem.selectedDate1, $scope.businessItem);
                        
                        var updateEvent = function (eventBusinessPlaceId, eventName, eventDescription, eventDateTimeString, eventDressCode, eventGuestListMax, eventDealsOnTheNight, eventExtraInfo, eventEventHasGuestList, eventWeekdayIndex, eventWeeksAhead) {
                            Events.updateEvent($stateParams._id, eventBusinessPlaceId, eventName, eventDescription, eventDateTimeString, eventDressCode, eventGuestListMax, eventDealsOnTheNight, eventExtraInfo, eventEventHasGuestList, eventWeekdayIndex, eventWeeksAhead, $scope.businessItem.chosenMusicStyleObjects).success(function (successData) {
                                $rootScope.debugModeLog({'msg': 'BusinessItemCtrl updateEvent successData', 'data': successData});
                                
                                var eventUpdateNotificationsArray = ["Event Date Cancelled", "Event Cancelled", "Event Date Changed"];
                                var eventUpdateNotificationsObject =
                                {
                                    "Event Date Cancelled": {
                                        "contents": "An event which you booked entry for has been cancelled.",
                                        "headings": "Event Booking Cancelled",
                                        "dataObj": {"actionFunction":"goToMyNyteActivity", "_businessItemId": $stateParams._id},
                                        "items": []
                                    },
                                    "Event Cancelled": {
                                        "contents": "An event which you booked entry for has been cancelled.",
                                        "headings": "Event Booking Cancelled",
                                        "dataObj": {"actionFunction":"goToMyNyteActivity", "_businessItemId": $stateParams._id},
                                        "items": []
                                    },
                                    "Event Date Changed": {
                                        "contents": "An event which you booked entry for has been cancelled as the event datehas changed.",
                                        "headings": "Event Date Changed and Booking Cancelled",
                                        "dataObj": {"actionFunction":"goToMyNyteActivity", "_businessItemId": $stateParams._id},
                                        "items": []
                                    }
                                };
                                    
                                if (successData != null) {
                                    var prepareNotif = function (obj) {
                                        if (obj["items"] != null && obj["items"].length > 0) {
                                            $rootScope.prepareMessageNotificationFinal(obj["items"], obj["headings"], obj["contents"], obj["dataObj"]);
                                        }
                                    }
                                    for (a = 0; a < successData.length; a++) {
                                        fullNotificationsObject[successData[a].alertType]["items"].push(successData[a]._recipientProfileId);
                                        
                                        if (a == successData.length - 1) {
                                            var obj = null;
                                            for (b = 0; b < fullNotificationsArray.length; b++) {
                                                obj = fullNotificationsObject[fullNotificationsArray[b]];
                                                if (obj.items.length > 0) {
                                                    prepareNotif(obj);
                                                }
                                            }
                                        }
                                    }
                                }
                                
                                $rootScope.backButtonFunction();
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
                        $rootScope.pageTitle = ($stateParams.itemType) ? 'Accepted Table Booking': 'Requested Table Booking';
                        $scope.pageTitle = $rootScope.pageTitle;
                        
                        TableBooking.getTableBookingById($stateParams._id).success(function (successData) {
                            $scope.businessItem = successData[0];
                            successData[0].timeString = datesService.getShortenedTimeString(successData[0].dateTimeRequested);
                            successData[0].timeIntegerString = datesService.getTimeInTotalSeconds(successData[0].dateTimeRequested);
                            successData[0].dateString = datesService.getShortenedDateString(successData[0].dateTimeRequested);
                            successData[0].convertedDateString = datesService.convertToDate($scope, new Date(successData[0].dateString));
                            if (ipObj2 != null) {
                                ipObj2.inputTime = successData[0].timeIntegerString;
                            }
                        }).error(function () {
                            $scope.getBusinessItem();
                        });
                    }

                    $scope.finishUpdatingTableBooking = function (accepted, rejected, cancelled, completed, alternateDate) {
                        TableBooking.updateTableBooking($stateParams._id, accepted, rejected, cancelled, completed, alternateDate).success(function (successData) {
                            
                            if (accepted == 1 ||
                                rejected == 1 ||
                                cancelled == 1 ||
                                (rejected == 0 && accepted == 0 && cancelled == 0 && alternateDate != null)
                            ) {
                                var text = "accepted";
                                if (rejected == 1) {
                                    text = "rejected";
                                } else if (cancelled == 1){
                                    text = "cancelled";
                                }
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
                                    "businessItemTypeDetailed": "Table Booking",
                                    "_businessItemId": $stateParams._id
                                };
                                
                                var recipientsArray = [successData[0]._customerProfileId];
                                
                                $rootScope.prepareMessageNotificationFinal(recipientsArray, contents, header, dataObj);
                            }
                            
                            $rootScope.$broadcast('table-booking-updated');
                            $rootScope.backButtonFunction();
                            $rootScope.appLoading = false;
                        }).error(function () {
                            $scope.finishUpdatingTableBooking(accepted, rejected, cancelled, completed, alternateDate);
                        });
                    }

                    var ipObj2 = {
                        callback: function (val) {      //Mandatory
                          if (typeof (val) === 'undefined') {
                          
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
                            
                            $scope.finishUpdatingTableBooking(0, 0, 0, 0, altDateTime);
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
                        var accept = 0, reject = 0, cancel = 0, alternateDate = null;

                        if (updateType == 'accept') {
                            accept = 1;
                        } else if (updateType == 'reject') {
                            reject = 1;
                        } else if (updateType == 'cancel') {
                            accept = $scope.businessItem.isAccepted;
                            cancel = 1;
                        }
                        $scope.finishUpdatingTableBooking(accept, reject, cancel, 0, alternateDate);
                    }
                    break;
                case 'RequestedTakeawayOrders':
                    $rootScope.pageTitle = 'Requested Takeaway Order';
                    $scope.pageTitle = $rootScope.pageTitle;
                    $rootScope.topRightButtonIsEdit = false;
                    $scope.getBusinessItem = function () {
                        var menuOrderTotalPrice = 0;
                        MenuItems.getMenuOrderForBusiness($stateParams._id).success(function (successData) {
                            $rootScope.debugModeLog({'msg': 'BusinessItemCtrl getMenuOrderForBusiness successData', 'data': successData});
                            
                            if (successData != 'null' && successData != null) {
                                $scope.businessItem = successData;
                                for (a = 0; a < $scope.businessItem.length; a++) {
                                    var totalPrice = $scope.businessItem[a].quantity * parseFloat($scope.businessItem[a].Price);
                                    $scope.businessItem[a].totalPrice = (totalPrice).formatMoney(2);
                                    menuOrderTotalPrice += parseFloat($scope.businessItem[a].Price) * $scope.businessItem[a].quantity;
                                }
                                $scope.menuOrderTotalPrice = (menuOrderTotalPrice).formatMoney(2);
                            }
                        }).error(function () {
                            $scope.getBusinessItem();
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
                            $rootScope.debugModeLog({'msg': 'BusinessItemCtrl acceptOrRejectMenuOrder successData', 'data': successData});
                        
                            $rootScope.$broadcast('menu-order-updated');
                            $state.go('app.businessItems', {'itemType': 'RequestedTakeawayOrders', 'timeScale': 'present'});
                        }).error(function () {
                            $scope.respondToMenuOrder(responseType);
                        });
                    }
                    break;
                case 'OwnTakeawayOrders':
                    $rootScope.pageTitle = 'Accepted Takeaway Order';
                    $scope.pageTitle = $rootScope.pageTitle;
                    $rootScope.topRightButtonIsEdit = false;
                    $scope.getBusinessItem = function () {
                        var menuOrderTotalPrice = 0;
                        MenuItems.getMenuOrderForBusiness($stateParams._id).success(function (successData) {
                            $rootScope.debugModeLog({'msg': 'BusinessItemCtrl getMenuOrderForBusiness successData', 'data': successData});
                            
                            if (successData != 'null' && successData != null) {
                                $scope.businessItem = successData;
                                for (a = 0; a < $scope.businessItem.length; a++) {
                                    var totalPrice = $scope.businessItem[a].quantity * parseFloat($scope.businessItem[a].Price);
                                    $scope.businessItem[a].totalPrice = (totalPrice).formatMoney(2);
                                    menuOrderTotalPrice += parseFloat($scope.businessItem[a].Price) * $scope.businessItem[a].quantity;
                                }
                                $scope.menuOrderTotalPrice = (menuOrderTotalPrice).formatMoney(2);
                            }
                        }).error(function () {
                            $scope.getBusinessItem();
                        });
                    }
                    
                    break;
                case 'MenuItemCategories':
                    $scope.getBusinessItem = function () {
                        $scope.existingCatNames = [];
                        MenuItems.getMenuItemCategoriesForBusiness($rootScope.user._id).success(function (successData) {
                            if (successData != 'null' && successData != null) {
                                for (a = 0; a < successData.length; a++) {
                                    $scope.existingCatNames.push(successData[a].name);
                                }
                            }
                            var getMenuItemCategoryDetailsForBusiness = function () {
                                MenuItems.getMenuItemCategoryDetailsForBusiness($rootScope.user._id, $stateParams._id).success(function (successData2) {
                                    if (successData2 != 'null') {
                                        $scope.businessItem = successData2[0];
                                        $scope.originalCatName = successData2[0].name;
                                    }
                                    
                                    $scope.updateMenuCategory = function (catName, description) {
                                        $rootScope.appLoading = true;
                                        MenuItems.updateMenuItemCategoryDetailsForBusiness($rootScope.user._id, $stateParams._id, catName, description).success(function (successData2) {
                                            $rootScope.debugModeLog({'msg': 'BusinessItemCtrl updateMenuItemCategoryDetailsForBusiness successData', 'data': successData2});
                                            
                                            $rootScope.appLoading = false;
                                            $rootScope.editing = false;
                                            $rootScope.currentlyEditing = false;
                                            $scope.editing = false;
                                        }).error(function () {
                                            $scope.updateMenuCategory(catName, description);
                                        });
                                    }
                                    
                                }).error(function () {
                                    getMenuItemCategoryDetailsForBusiness();
                                });
                            }
                            getMenuItemCategoryDetailsForBusiness();
                        }).error(function () {
                            $scope.getBusinessItem();
                        });
                    }
                    
                    break;
                case 'MenuItemSubCategories':
                    $scope.getBusinessItem = function () {
                        $scope.existingCatNames = [];
                        MenuItems.getMenuItemSubCategoriesForBusiness($rootScope.user._id).success(function (successData) {
                            if (successData != 'null' && successData != null) {
                                for (a = 0; a < successData.length; a++) {
                                    $scope.existingCatNames.push(successData[a].name);
                                }
                            }
                            var getMenuItemSubCategoryDetailsForBusiness = function () {
                            
                                MenuItems.getMenuItemSubCategoryDetailsForBusiness($rootScope.user._id, $stateParams._id).success(function (successData2) {
                                    if (successData2 != 'null') {
                                        $scope.businessItem = successData2[0];
                                        $scope.originalCatName = successData2[0].name;
                                    }
                                    
                                    $scope.updateMenuSubCategory = function (catName, description) {
                                        $rootScope.appLoading = true;
                                        MenuItems.updateMenuItemSubCategoryDetailsForBusiness($rootScope.user._id, $stateParams._id, catName, description).success(function (successData2) {
                                            $rootScope.debugModeLog({'msg': 'BusinessItemCtrl updateMenuItemSubCategoryDetailsForBusiness successData', 'data': successData2});
                                            
                                            $rootScope.appLoading = false;
                                            $rootScope.editing = false;
                                            $rootScope.currentlyEditing = false;
                                            $scope.editing = false;
                                        }).error(function () {
                                            $scope.updateMenuSubCategory(catName, description);
                                        });
                                    }
                                    
                                }).error(function () {
                                    getMenuItemSubCategoryDetailsForBusiness();
                                });
                            }
                            getMenuItemSubCategoryDetailsForBusiness();
                        }).error(function () {
                            $scope.getBusinessItem();
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
                        
                        var getMenuItem = function () {
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
                                var getAllMenuItemTags = function () {
                                    MenuItems.getAllMenuItemTags().success(function (tags) {
                                        $rootScope.debugModeLog({'msg': 'BusinessItemCtrl getAllMenuItemTags successData', 'data': tags});
                                        
                                        for (a = 0; a < tags.length; a++) {
                                            if (tags[a]._menuItemTagGroupId == null) {
                                                $scope.availableTags.singularTags.push(tags[a]);
                                            } else {
                                                var tagAdded = false;
                                                for (b = 0; b < $scope.availableTags.groupTags.length; b++) {
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
                                        getAllMenuItemTags();
                                    });
                                }
                                getAllMenuItemTags();
                                
                                var getMenuItemCategoriesForBusiness = function () {
                                    MenuItems.getMenuItemCategoriesForBusiness($rootScope.user._id).success(function (successData) {
                                        $scope.menuItemCategories = successData;
                                    }).error(function () {
                                        getMenuItemCategoriesForBusiness();
                                    });
                                }
                                getMenuItemCategoriesForBusiness();
                                
                                var getMenuItemSubCategoriesForBusiness = function () {
                                    MenuItems.getMenuItemSubCategoriesForBusiness($rootScope.user._id).success(function (successData) {
                                        $scope.menuItemSubCategories = successData;
                                        $scope.selectedSubCategory.name = ($scope.menuItemSubCategories.length == 0) ? 'No Sub-Categories to select': $scope.selectedSubCategory.name;
                                    }).error(function () {
                                        getMenuItemSubCategoriesForBusiness();
                                    });
                                }
                                getMenuItemSubCategoriesForBusiness();
                                
                                var getMenuItemOptionsForBusiness = function () {
                                    MenuItems.getMenuItemOptionsForBusiness($rootScope.user._id).success(function (successData) {
                                        $scope.menuItemOptions = successData || [];
                                    }).error(function () {
                                        getMenuItemOptionsForBusiness();
                                    });
                                }
                                getMenuItemOptionsForBusiness();
                                    
                                
                            }).error(function () {
                                getMenuItem();
                            });
                        }
                        getMenuItem();
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
                            var tagNameIndex = $scope.preappliedTagsNames.indexOf(tag.name);
                            if (tagNameIndex == -1) {
                                
                                $scope.preappliedTags.push(tag);
                                $scope.preappliedTagsNames.push(tag.name);
                                
                                for (a = 0; a < $scope.preappliedTags.length; a++) {
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
                                $scope.updateMenuItem(itemName, price, description);
                            });
                        }
                    }
                    
                    break;
                case 'MenuItemTemplateOptions':
                    $scope.getBusinessItem = function () {
                        $scope.showChangeOrderButtons = false;
                    
                        var getMenuTemplateOptionCategories = function () {
                            MenuItems.getMenuTemplateOptionCategories().success(function (successData) {
                                $rootScope.debugModeLog({'msg': 'BusinessItemCtrl getMenuTemplateOptionCategories successData', 'data': successData});
                                
                                $scope.menuItemTemplateOptionCategories = (successData != 'null' && successData != null) ? successData : [];
                            }).error(function () {
                                getMenuTemplateOptionCategories();
                            });
                        }
                        getMenuTemplateOptionCategories();
                        
                        var getMenuItemTemplateOption = function () {
                            MenuItems.getMenuItemTemplateOption($rootScope.user._id, $stateParams._id).success(function (successData) {
                                $rootScope.debugModeLog({'msg': 'BusinessItemCtrl getMenuItemTemplateOption successData', 'data': successData});
                                
                                var businessItems = [];
                                var businessItemIds = [];
                                
                                successData = (successData != 'null' && successData != null) ? successData: [];
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
                                    item.quantityRelevant = !item.quantityRelevant;
                                }
                                
                                $scope.updateMenuItemTemplateOption = function (option) {
                                    MenuItems.updateMenuItemTemplateOption($rootScope.user._id, option, $scope.selectedCategory._id).success(function (successData) {
                                        $rootScope.debugModeLog({'msg': 'BusinessItemCtrl updateMenuItemTemplateOption successData', 'data': successData});
                                        
                                        $rootScope.appLoading = false;
                                        $rootScope.editing = false;
                                        $rootScope.currentlyEditing = false;
                                        $scope.editing = false;
                                    }).error(function () {
                                        $scope.updateMenuItemTemplateOption(option);
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
                                    $rootScope.appLoading = true;
                                    MenuItems.deleteMenuItemTemplateOptionOption(optionChoice._id).success(function (successData) {
                                        $rootScope.debugModeLog({'msg': 'BusinessItemCtrl deleteMenuItemTemplateOptionOption successData', 'data': successData});
                                        
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
                                        $scope.deleteOptionChoice(optionChoice);
                                    });
                                }
                                
                                $scope.currentOptionBeingAdded = {'name': '', 'extraPrice': 0.00, 'orderIndex': $scope.businessItem.options.length + 1};
                                $scope.createOptionChoice = function () {
                                    $rootScope.appLoading = true;
                                    MenuItems.createMenuItemTemplateOptionOption($stateParams._id, $scope.currentOptionBeingAdded).success(function (successData) {
                                        $rootScope.debugModeLog({'msg': 'BusinessItemCtrl createMenuItemTemplateOptionOption successData', 'data': successData});
                                        
                                        $scope.businessItem.options.splice($scope.currentOptionBeingAdded.orderIndex - 1, 0, $scope.currentOptionBeingAdded);
                                        for (a = $scope.currentOptionBeingAdded.orderIndex; a < $scope.businessItem.options.length; a++) {
                                            $scope.businessItem.options[a].orderIndex = parseInt($scope.businessItem.options[a].orderIndex) + 1;
                                            $scope.storedBusinessItem.options[a].orderIndex = parseInt($scope.storedBusinessItem.options[a].orderIndex) - 1;
                                        }
                                        
                                        $scope.currentOptionBeingAdded = {'name': '', 'extraPrice': 0.00, 'orderIndex': $scope.businessItem.options.length + 1};
                                        
                                        $rootScope.appLoading = false;
                                    }).error(function () {
                                        $scope.createOptionChoice();
                                    });
                                }
                                
                            }).error(function () {
                                getMenuItemTemplateOption();
                            });
                        }
                        getMenuItemTemplateOption();
                    }
                    
                    break;
                case 'RequestedTaxiBookings':
                    $rootScope.topRightButtonIsEdit = false;
                    $scope.getBusinessItem = function () {
                        Taxi.getTaxiBookingForBusiness($stateParams._id, $rootScope.user._id).success(function (successData) {
                            $rootScope.debugModeLog({'msg': 'BusinessItemCtrl getTaxiBookingForBusiness successData', 'data': successData});
                            
                            if (successData != 'null' && successData != null) {
                                $scope.businessItem = successData[0];
                                
                                $scope.businessItem.newLowestPrice = 0;
                                $scope.businessItem.newQuickestTime = 0;
                            }
                        }).error(function () {
                            $scope.getBusinessItem();
                        });
                    }
                    
                    $scope.respondToTaxiBookingRequest = function () {
                        
                        Taxi.respondToTaxiBooking($rootScope.user._id, $stateParams._id, $scope.businessItem.newLowestPrice, $scope.businessItem.newQuickestTime).success(function (successData) {
                            $rootScope.debugModeLog({'msg': 'BusinessItemCtrl respondToTaxiBooking successData', 'data': successData});
                            
                            if (successData != 'null' && successData != null) {
                                var contents = "Your recent Taxi Booking Request has been accepted by " + successData[0]._claimedByBusinessBusinessName;
                                var header = "Taxi Booking Accepted";
                                var dataObj = {
                                    "actionFunction": "goToBusinessItem",
                                    "businessItemType": "myNYTEActivity",
                                    "businessItemTypeDetailed": "Taxi Booking",
                                    "_businessItemId": $stateParams._id
                                };
                                
                                $rootScope.prepareMessageNotificationFinal([successData[0]._requestedByPersonProfileId], contents, header, dataObj);
                                        
                                if (successData[0]._claimedByBusinessProfileId == $rootScope.user._profileId) {
                                    // Create Pop-up to show
                                    $ionicPopup.show({
                                        title: 'Taxi Booking Won!',
                                        template: '<p>You\'ve won this Taxi Booking, and it should now appear in the My Claimed Taxi Bookings page.</p>',
                                        scope: $scope,
                                        buttons: [
                                            { 
                                                text: 'Close',
                                                onTap: function(e) {
                                                } 
                                            }
                                        ]
                                    });
                                } else {
                                    var contents2 = "You've just won a recent Taxi Booking.";
                                    var header2 = "Taxi Booking Won";
                                    var dataObj2 = {
                                        "actionFunction": "goToBusinessItem",
                                        "businessItemType": "OwnTaxiBookings",
                                        "_businessItemId": $stateParams._id
                                    };
                                    
                                    $rootScope.prepareMessageNotificationFinal([successData[0]._claimedByBusinessProfileId], contents2, header2, dataObj2);
                                }
                                
                            }
                            $rootScope.clearAllExpiredTransactions();
                            $rootScope.$broadcast('taxi-booking-response-sent');
                            $state.go('app.businessItems', {'itemType': 'RequestedTaxiBookings'});
                        }).error(function () {
                            $scope.respondToTaxiBookingRequest();
                        });
                    }
                    break;
                case 'OwnTaxiBookings':
                    $rootScope.topRightButtonIsEdit = false;
                    $scope.getBusinessItem = function () {
                        Taxi.getTaxiBookingForBusiness($stateParams._id, $rootScope.user._id).success(function (successData) {
                            $rootScope.debugModeLog({'msg': 'BusinessItemCtrl getTaxiBookingForBusiness successData', 'data': successData});
                            
                            if (successData != 'null' && successData != null) {
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
                            $scope.getBusinessItem();
                        });
                    }
                    
                    $scope.updateTaxiBooking = function (response) {
                        Taxi.updateTaxiBookingByPerson($stateParams._id, cancelled, completed).success(function (successData) {
                            $rootScope.debugModeLog({'msg': 'BusinessItemCtrl updateTaxiBookingByPerson successData', 'data': successData});
                            
                            if ($scope.businessItem.quickestIsRequired == '1') {
                                    $scope.businessItem.quickestTime = response;
                                } else {
                                    $scope.businessItem.lowestPrice = response;
                                }
                            $rootScope.$broadcast('taxi-booking-response-sent');
                            $state.go('app.businessItems', {'itemType': 'OwnTaxiBookings'});
                        }).error(function () {
                            $scope.updateTaxiBooking(response);
                        });
                    }
                    break;
                case 'Table Booking':
                    $rootScope.topRightButtonIsEdit = false;
                    $scope.getBusinessItem = function () {
                        TableBooking.getTableBookingById($stateParams._id).success(function (successData) {
                            $scope.businessItem = successData[0];
                            successData[0].timeString = datesService.getShortenedTimeString(successData[0].dateTimeRequested);
                            successData[0].suggestedTimeString = (successData[0].dateTimeSuggested == null) ? null : datesService.getShortenedTimeString(successData[0].dateTimeSuggested);
                            successData[0].dateString = datesService.getShortenedDateString(successData[0].dateTimeRequested);
                            successData[0].requestedTimeIntegerString = datesService.getTimeInTotalSeconds(successData[0].dateTimeRequested);
                            successData[0].suggestedTimeIntegerString = (successData[0].dateTimeSuggested != null) ? datesService.getTimeInTotalSeconds(successData[0].dateTimeSuggested) : null;
                        }).error(function () {
                            $scope.getBusinessItem();
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
                            
                            var recipientsArray = [successData[0]._profileId];
                            $rootScope.prepareMessageNotificationFinal(recipientsArray, contents, header, dataObj);
                        
                            $rootScope.$broadcast('table-booking-updated');
                            $rootScope.backButtonFunction();
                            $rootScope.appLoading = false;
                        }).error(function () {
                            $scope.finishUpdatingTableBooking(accepted, rejected, completed, cancelled, alternateDate);
                        });
                    }

                    var ipObj2 = {
                        callback: function (val) {      //Mandatory
                          if (typeof (val) === 'undefined') {
                          
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
                        $scope.finishUpdatingTableBooking(accepted, rejected, cancelled, completed, null);
                    }

                    $scope.openTimePicker = function () {
                        ionicTimePicker.openTimePicker(ipObj2);
                    }
                    break;
                case 'Taxi Booking':
                    $rootScope.topRightButtonIsEdit = false;
                    $scope.finishUpdatingTaxiBooking = function (cancelled, completed) {
                        Taxi.updateTaxiBookingByPerson($stateParams._id, cancelled, completed).success(function (successData) {
                            $rootScope.$broadcast('taxi-booking-updated');
                            $rootScope.backButtonFunction();
                            $rootScope.appLoading = false;
                        }).error(function () {
                            $scope.finishUpdatingTaxiBooking(cancelled, completed);
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
                            $rootScope.debugModeLog({'msg': 'BusinessItemCtrl getTaxiBookingForPerson successData', 'data': successData});
                            
                            if (successData != 'null') {
                                successData[0].timeRequested = (successData[0].bookingDateTime != null) ? datesService.getShortenedTimeString(successData[0].bookingDateTime): null;
                                successData[0].dateRequested = (successData[0].bookingDateTime != null) ? datesService.getShortenedDateString(successData[0].bookingDateTime): null;
                                successData[0].dateRequested = (successData[0].bookingDateTime != null) ? datesService.convertToDate($scope, new Date(successData[0].dateRequested)): null;
                                $scope.businessItem = successData[0];
                            }
                        }).error(function () {
                            $scope.getBusinessItem();
                        });
                    }
                    break;
                case 'Offer':
                    $rootScope.topRightButtonIsEdit = false;
                    $scope.getBusinessItem = function () {
                        var _userId = ($rootScope.userLoggedIn) ? $rootScope.user._profileId: 0;
                        Offers.getOffer($stateParams._id, _userId).success(function (successData) {
                            $rootScope.debugModeLog({'msg': 'BusinessItemCtrl getOffer successData', 'data': successData});
                            
                            if (successData != 'null') {
                                $scope.businessItem = successData[0];
                            }
                        }).error(function () {
                            $scope.getBusinessItem();
                        });
                    }
                    break;
                case 'Event Entry':
                    $rootScope.topRightButtonIsEdit = false;
                    $scope.finishUpdatingEventEntryBooking = function (cancelled) {
                        Events.updateEventEntryBookingByPerson($stateParams._id, 0, 0, cancelled).success(function (successData) {
                            $rootScope.$broadcast('event-entry-booking-updated');
                            $rootScope.backButtonFunction();
                            $rootScope.appLoading = false;
                        }).error(function () {
                            $scope.finishUpdatingEventEntryBooking(cancelled);
                        });
                    }
                    $scope.updateEventEntryBooking = function (updateType) {
                        $rootScope.appLoading = true;
                        var cancelled = (updateType == 'cancel') ? 1: 0;
                        $scope.finishUpdatingEventEntryBooking(cancelled);
                    }
                    $scope.getBusinessItem = function () {
                        Events.getEventEntryBooking($stateParams._id).success(function (successData) {
                            $rootScope.debugModeLog({'msg': 'BusinessItemCtrl getEventEntryBooking successData', 'data': successData});
                            
                            if (successData != 'null') {
                                successData[0].endDate = datesService.getShortenedDateString(successData[0].endDateTime);
                                successData[0].endDate = datesService.convertToDate($scope, new Date(successData[0].endDate));
                                $scope.businessItem = successData[0];
                            }
                        }).error(function () {
                            $scope.getBusinessItem();
                        });
                    }
                    break;
            };
            
            $scope.getBusinessItem();
        }
        
        $rootScope.checkForAppInit($scope);
        
    }]);
    app.controller('AddBusinessItemCtrl', ['$ionicHistory', '$rootScope', '$state', '$stateParams', '$scope', 'ionicDatePicker', 'ionicTimePicker', 'Offers', 'Profile', 'Events', 'MenuItems', 'Categories', 'Listings', 'Movies', 'TableBooking', '$ionicScrollDelegate', '$ionicPopup', '$ionicViewSwitcher', 'Images', 'datesService', '$timeout', function($ionicHistory, $rootScope, $state, $stateParams, $scope, ionicDatePicker, ionicTimePicker, Offers, Profile, Events, MenuItems, Categories, Listings, Movies, TableBooking, $ionicScrollDelegate, $ionicPopup, $ionicViewSwitcher, Images, datesService, $timeout) {
        //Variables & Constants
        $scope.rootScope = $rootScope;
        $scope.itemType = $stateParams.itemType;
        
        $scope.pageLoad = function () {
            $rootScope.$broadcast('reset-image-crop');
            
            $rootScope.files = [];
            $rootScope.imageSrcs = [];
            
            $scope.selectExtraOption = function (chosenOptionItem, $event) {
                $rootScope.selectExtraOption(chosenOptionItem, $event, $scope);
            }
            
            var idealImgW, idealImgH ,idealImgWPercent;
                idealImgW = 960;
                idealImgH = 640;
                idealImgWPercent = 90;
                
            switch($stateParams.itemType) {
                case 'Movies':
                    $rootScope.pageTitle = 'Create New Movie';
                    $scope.pageTitle = $rootScope.pageTitle;
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
                    
                    $scope.imgEntryType = "movie_cover_photo";
                    $scope.dataWidth = (window.innerWidth > 830) ? 600 : (window.innerWidth/100) * idealImgWPercent;
                    $scope.dataHeight = (idealImgH/idealImgW) * $scope.dataWidth;
                    $rootScope.dataScale = ($scope.dataWidth/idealImgW);
                    
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
                        $scope.firstShowingDateInputHTML = datesService.convertToDate($scope, $scope.selectedDateFirst);
                        ipObj[0].inputDate = new Date(val);
                      }
                    };
                    ipObj[1] = {
                      callback: function (val) {  //Mandatory
                        $scope.selectedDateLast = new Date(val);
                        $scope.lastShowingDateInputHTML = datesService.convertToDate($scope, $scope.selectedDateLast);
                        ipObj[1].inputDate = new Date(val);
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
                        
                        if ($scope.multiSelect[styleCategory].chosenStyleIds.indexOf(null) != -1) {
                            $scope.multiSelect[styleCategory].chosenStyleIds.splice($scope.multiSelect[styleCategory].chosenStyleIds.indexOf(null), 1);
                        };
                        
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
                    }
                    
                    $scope.createMovie = function (movieTitle, movieTrailerLink, description) {
                        movieTitle = movieTitle.replace(/'/g, "\'");
                        description = (description != null) ? description.replace(/'/g, "\'") : "";
                        var firstDateTimeString = $scope.selectedDateFirst.getFullYear() + '-' + ($scope.selectedDateFirst.getMonth() + 1) + '-' + $scope.selectedDateFirst.getDate() + ' 00:00';
                        var lastDateTimeString = $scope.selectedDateLast.getFullYear() + '-' + ($scope.selectedDateLast.getMonth() + 1) + '-' + $scope.selectedDateLast.getDate() + ' 00:00';
                        
                        var uploadComplete = function (successData) {
                            $rootScope.files = [];
                            $rootScope.imageSrcs = [];
                            $rootScope.progress = 0;
                            
                            $rootScope.$broadcast('new-movie');
                            $rootScope.appLoading = false;
                            $rootScope.backButtonFunction();
                        };
                        
                        var uploadImage = function () {
                            function isInt(value) {
                              return !isNaN(value) && (function(x) { return (x | 0) === x; })(parseFloat(value))
                            }

                            var movieStyleIdString = "";
                            if ($scope.multiSelect['Movies'].chosenStyleIds.length > 0) {
                                for (a = 0; a < $scope.multiSelect['Movies'].chosenStyleIds.length; a++) {
                                    if (a > 0 && $scope.multiSelect['Movies'].chosenStyleIds[a] != null) {
                                        movieStyleIdString += ', ' + $scope.multiSelect['Movies'].chosenStyleIds[a];
                                    }
                                    if ($scope.multiSelect['Movies'].chosenStyleIds[a] != null) {
                                        movieStyleIdString += $scope.multiSelect['Movies'].chosenStyleIds[a];
                                    }
                                }
                            }
                            
                            if (ionic.Platform.isAndroid()) {
                                var myImg = $rootScope.file,
                                options = new FileUploadOptions(),
                                ft = new FileTransfer(),
                                params = {};
                                
                                options.fileName = $rootScope.fileName;
                                options.fileKey="fileUpload";
                                options.httpMethod="POST";
                                options.chunkedMode = false;
                                options.mimeType = "image/jpeg";

                                params.user_token = localStorage.getItem('auth_token');
                                params.user_email = localStorage.getItem('email');
                                params._profileId = $rootScope.user._profileId;
                                params.imgEntryType = "movie_cover_photo";
                                params.startX = $scope.startX;
                                params.xDist = $scope.xDist;
                                params.startY = $scope.startY;
                                params.yDist = $scope.yDist;

                                params.movieTitle = movieTitle;
                                params.description = description;
                                params.firstDateTimeString = firstDateTimeString;
                                params.lastDateTimeString = lastDateTimeString;
                                params.movieTrailerLink = movieTrailerLink;
                                params.movieStyleIdString = movieStyleIdString;

                                options.params = params;

                                var onUploadSuccess = function (successData) {
                                    $rootScope.debugModeLog({'msg': 'ProfileController AddBusinessItemCtrl uploadImageForMovieCreation() successData', 'data': successData});
                                    successData = successData.response.replace(/"/g, '');
                                    if (isInt(successData)) {
                                        uploadComplete(successData);
                                    }
                                }
                                var onUploadFail = function (errorData) {
                                    $rootScope.debugModeLog({'msg': 'ProfileController AddBusinessItemCtrl uploadImageForMovieCreation() errorData', 'data': errorData});
                                    errorData = errorData.response.replace(/"/g, '');
                                    if (isInt(errorData)) {
                                        uploadComplete(errorData);
                                    }
                                    else {
                                        uploadImage();
                                    }
                                }
                                
                                ft.upload(myImg, encodeURI($rootScope.assetsFolderUrl + "/data/functions/image-upload.php?action=uploadImage&platform=android"), onUploadSuccess, onUploadFail, options);
                            } else {
                                var formData = new FormData();
                        
                                formData.append("_profileId", $rootScope.user._profileId);
                                formData.append("imgEntryType", "movie_cover_photo");
                                formData.append("files[]", $rootScope.files[0]);
                                formData.append("startX", $scope.startX);
                                formData.append("startY", $scope.startY);
                                formData.append("xDist", $scope.xDist);
                                formData.append("yDist", $scope.yDist);
                                
                                formData.append("movieTitle", movieTitle);
                                formData.append("description", description);
                                formData.append("firstShowingDate", firstDateTimeString);
                                formData.append("lastShowingDate", lastDateTimeString);
                                formData.append("movieTrailerLink", movieTrailerLink);
                                formData.append("movieStyleIdString", movieStyleIdString);
                                
                                Images.uploadImageForMovieCreation(formData).success(function (successData) {
                                    $rootScope.debugModeLog({'msg': 'ProfileController AddBusinessItemCtrl uploadImageForMovieCreation() successData', 'data': successData});
                                    
                                    if (isInt(successData)) {
                                        uploadComplete(successData);
                                    }
                                }).error(function (errorData) {
                                    $rootScope.debugModeLog({'msg': 'ProfileController AddBusinessItemCtrl uploadImageForMovieCreation() errorData', 'data': errorData});
                                    
                                    if (isInt(errorData)) {
                                        uploadComplete();
                                    }
                                    else {
                                        uploadImage();
                                    }
                                });
                            }
                        }
                        
                        uploadImage();
                    }
                    break;
                case 'OwnOffers':
                    $rootScope.pageTitle = 'Create New Offer';
                    $scope.pageTitle = $rootScope.pageTitle;
                    
                    $scope.getAllOfferCategoriesForBusiness = function () {
                        Categories.getAllOfferCategoriesForBusiness($rootScope.user._id).success(function (successData) {
                            $scope.offerCategories = successData;
                            $scope.chosenOfferCat = $scope.offerCategories[0];
                        }).error(function (errorData) {
                            window.setTimeout(function () {
                                $scope.getAllOfferCategoriesForBusiness();
                            }, 100);
                        });
                    }
                    $scope.getAllOfferCategoriesForBusiness();
                    
                    $scope.getAllUpcomingBusinessEvents = function () {
                        $scope.availableEvents = [];
                        var isClubOrBar = ($rootScope.user.listingTypes.indexOf('Nightclub') != -1 || $rootScope.user.listingTypes.indexOf('Bar') != -1) ? true : false;
                        if (isClubOrBar) {
                            Events.getEventsByBusiness($rootScope.user._id, 'present', $rootScope.user._profileId).success(function (successData) {
                                $rootScope.debugModeLog({'msg': 'AddBusinessItemController getEventsByBusiness getEventsByBusiness() successData', 'data': successData});
                                
                                if (successData != null) {successData.unshift({_id: null, name: 'No event selected'})};
                                $scope.availableEvents = (successData != 'null') ? successData: [];
                            }).error(function () {
                                $scope.getAllUpcomingBusinessEvents();
                            });
                        }
                    }
                    $scope.getAllUpcomingBusinessEvents();
                    
                    $scope.imgEntryType = "offer_cover_photo";
                    $scope.dataWidth = (window.innerWidth > 830) ? 600 : (window.innerWidth/100) * idealImgWPercent;
                    $scope.dataHeight = (idealImgH/idealImgW) * $scope.dataWidth;
                    $rootScope.dataScale = ($scope.dataWidth/idealImgW);
                    
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
                            displayName: 'Detailed Offer with Enquiry Form',
                            description: 'Create an Offer with detailed info, a built-in enquiry form and an optional photo.',
                            itemType: 'offerType',
                            _id: 2
                        },
                        {
                            name: 'WithAutoPromoCode',
                            displayName: 'MyNyte Exclusive Offer',
                            description: 'Create an Offer that\'s exclusive to MyNyte. Get a priority listing in the Offers Display!',
                            itemType: 'offerType',
                            _id: 3
                        }
                        /*{
                            name: 'WithAutoPromoCode',
                            displayName: 'Promo-Code Offer (auto-generated)',
                            description: 'Create an Offer with a Promo Code that MyNyte automatically generates. Quick & easy!',
                            itemType: 'offerType',
                            _id: 3
                        }*/];
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
                    $scope.availableWeeks = [
                        {_id: 1, name: '1 week ahead'},
                        {_id: 2, name: '2 weeks ahead'},
                        {_id: 3, name: '3 weeks ahead'},
                        {_id: 4, name: '4 weeks ahead'},
                        {_id: 5, name: '5 weeks ahead'},
                        {_id: 6, name: '6 weeks ahead'},
                        {_id: 7, name: '7 weeks ahead'}
                    ];
                    
                    $scope.offerRegularityTypes = [
                        {name: 'one-off', displayName: 'This is an offer that runs everyday for a certain period of time.', itemType: 'offerRegularityType', mustBeSelected: true},
                        {name: 'weekly', displayName: 'This is a weekly event that occurs on a certain day every week.', itemType: 'offerRegularityType', mustBeSelected: true}
                    ];
                    $scope.selectedOfferRegularityType = {
                        name: 'one-off', displayName: 'This is an offer that runs everyday for a certain period of time.', mustBeSelected: true
                    };
                    
                    $scope.chosenOfferEvent = {_id: null, name: 'No event selected'};
                    $scope.chosenWeeksAhead = {_id: 1, name: '1 week ahead'};
                    $scope.chosenWeekday = {_id: null, name: ''};
                    $scope.showWeeksAhead = false;
                        
                    //Set up Date Picker
                    $scope.selectedDate1 = new Date();
                    $scope.selectedDate2 = null;
                    $scope.todaysDate = new Date();
                    $scope.finalDate = new Date();
                    $scope.dateChosen = false;
                    
                    $scope.dateInputHTML = datesService.convertToDate($scope, new Date());

                    $scope.ipObj1 = {
                      callback: function (val) {  //Mandatory
                        $scope.selectedDate1 = new Date(val);
                        $scope.dateInputHTML = datesService.convertToDate($scope, $scope.selectedDate1);
                        $scope.ipObj1.inputDate = new Date(val);
                        
                        var result = angular.copy($scope.selectedDate1);
                        $scope.ipObj2.from = angular.copy($scope.selectedDate1);
                        $scope.ipObj2.to = angular.copy(new Date(result.setDate(result.getDate() + 60)));
                        
                        $scope.dateChosen = true;
                      },
                      disabledDates: [],
                      from: new Date(), //Optional
                      to: $scope.finalDate.setDate($scope.finalDate.getDate() + 30), //Optional
                      inputDate: $scope.selectedDate1,      //Optional
                      mondayFirst: true,          //Optional
                      disableWeekdays: [],       //Optional
                      closeOnSelect: true,       //Optional
                      templateType: 'popup'       //Optional
                    };
                    
                    $scope.ipObj2 = {
                      callback: function (val) {  //Mandatory
                        $scope.selectedDate2 = new Date(val);
                        $scope.offerEndDateInputHTML = datesService.convertToDate($scope, $scope.selectedDate2);
                        $scope.ipObj2.inputDate = new Date(val);
                        var today = new Date();
                        var newDate = today.setDate(today.getDate() + 30);
                                
                        $scope.ipObj1.to = (new Date(val) > new Date(newDate)) ? angular.copy(new Date(newDate)): angular.copy(new Date(val));
                        $scope.dateChosen = true;
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
                      inputDate: new Date(),      //Optional
                      mondayFirst: true,          //Optional
                      disableWeekdays: [],       //Optional
                      closeOnSelect: true,       //Optional
                      templateType: 'popup'       //Optional
                    };
                    
                    //User Response Functions
                    $scope.openDatePicker = function (ipObj) {
                        ionicDatePicker.openDatePicker(ipObj);
                    }
                    
                    $scope.toggleOfferCategory = function (obj) {
                        $scope.showOfferCategories = !$scope.showOfferCategories;
                    }
                    
                    $scope.selectOfferCategory = function (cat) {
                        $scope.chosenOfferCat = cat;
                        $scope.showOfferCategories = !$scope.showOfferCategories;
                    }
                    
                    $scope.toggleChosenEvent = function () {
                        $scope.showEvents = !$scope.showEvents;
                    }
                    
                    $scope.selectOfferEvent = function (event) {
                        $scope.chosenOfferEvent.name = event.name;
                        $scope.chosenOfferEvent._id = event.relListingId;
                        $scope.showEvents = !$scope.showEvents;
                        $timeout(function () {
                            $ionicScrollDelegate.resize();
                        }, 500);
                    }
                    
                    $scope.toggleWeeksAheadVisibility = function () {
                        $scope.showWeeksAhead = !$scope.showWeeksAhead;
                    }

                    $scope.selectWeeksAhead = function (weeksAhead) {
                        $scope.chosenWeeksAhead = weeksAhead;
                        $scope.showWeeksAhead = false;
                    }
                    
                    $scope.addOffer = function (offerTitle, description, endDateTime) {
                        offerTitle = offerTitle.replace(/'/g, "\'");
                        description = description.replace(/'/g, "\'");
                        $rootScope.appLoading = true;
                        
                        var _offerTypeId = $scope.selectedOfferType._id;
                        var startDateTime = $scope.selectedDate1.getFullYear() + '-' + ($scope.selectedDate1.getMonth() + 1) + '-' + $scope.selectedDate1.getDate() + ' 00:00';
                        var weekdayIndex = ($scope.selectedDate1.getDay() == 0) ? 7 : $scope.selectedDate1.getDay();
                        weekdayIndex = ($scope.selectedOfferRegularityType.name == 'weekly') ? weekdayIndex: null;
                        
                        var weeksAhead = ($scope.selectedOfferRegularityType.name == 'one-off') ? 0: $scope.chosenWeeksAhead._id;
                        
                        var endDateTime = ($scope.selectedDate2 == null) ? 0: $scope.selectedDate2.getFullYear() + '-' + ($scope.selectedDate2.getMonth() + 1) + '-' + $scope.selectedDate2.getDate() + ' 00:00';
                        
                        var uploadComplete = function (successData) {
                            $rootScope.files = [];
                            $rootScope.imageSrcs = [];
                            $rootScope.progress = 0;
                            
                            var _offerId = successData;
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
                                            $rootScope.prepareMessageNotificationFinal(recipientsArray, contents, header, dataObj);
                                        }
                                    }
                                }).error(function () {
                                    getFollowerProfileIdsForBusiness(_offerId);
                                });
                            }
                             
                            getFollowerProfileIdsForBusiness(_offerId);
                            $rootScope.$broadcast('new-offer');
                            $rootScope.appLoading = false;
                            $rootScope.backButtonFunction();
                        };
                        
                        var uploadImage = function () {
                            function isInt(value) {
                              return !isNaN(value) && (function(x) { return (x | 0) === x; })(parseFloat(value))
                            }
                            
                            if (ionic.Platform.isAndroid()) {
                                var myImg = $rootScope.file,
                                options = new FileUploadOptions(),
                                ft = new FileTransfer(),
                                params = {};
                                
                                options.fileName = $rootScope.fileName;
                                options.fileKey="fileUpload";
                                options.httpMethod="POST";
                                options.chunkedMode = false;
                                options.mimeType = "image/jpeg";

                                params.user_token = localStorage.getItem('auth_token');
                                params.user_email = localStorage.getItem('email');
                                params._profileId = $rootScope.user._profileId;
                                params.imgEntryType = "offer_cover_photo";
                                params.startX = $scope.startX;
                                params.xDist = $scope.xDist;
                                params.startY = $scope.startY;
                                params.yDist = $scope.yDist;

                                params._businessId = $rootScope.user._id;
                                params._offerTypeId = _offerTypeId;
                                params._offerSubCategoryId = $scope.chosenOfferCat._id;
                                params.offerTitle = offerTitle;
                                params.description = description;
                                params.startDateTime = startDateTime;
                                params.endDateTime = endDateTime;
                                params.weeksAhead = weeksAhead;
                                params.weekdayIndex = weekdayIndex;
                                params._eventId = $scope.chosenOfferEvent._id;

                                options.params = params;

                                var onUploadSuccess = function (successData) {
                                    $rootScope.debugModeLog({'msg': 'ProfileController AddBusinessItemCtrl uploadImageForOfferCreation() successData', 'data': successData});
                                    successData = successData.response.replace(/"/g, '');
                                    
                                    if (isInt(successData)) {
                                        uploadComplete(successData);
                                    }
                                }
                                var onUploadFail = function (errorData) {
                                    $rootScope.debugModeLog({'msg': 'ProfileController AddBusinessItemCtrl uploadImageForOfferCreation() errorData', 'data': errorData});
                                    errorData = errorData.response.replace(/"/g, '');
                                    if (isInt(errorData)) {
                                        uploadComplete();
                                    }
                                    else {
                                        uploadImage();
                                    }
                                }
                                
                                ft.upload(myImg, encodeURI($rootScope.assetsFolderUrl + "/data/functions/image-upload.php?action=uploadImage&platform=android"), onUploadSuccess, onUploadFail, options);
                            } else {
                                var formData = new FormData();
                        
                                formData.append("_profileId", $rootScope.user._profileId);
                                formData.append("imgEntryType", "offer_cover_photo");
                                formData.append("files[]", $rootScope.files[0]);
                                formData.append("startX", $scope.startX);
                                formData.append("startY", $scope.startY);
                                formData.append("xDist", $scope.xDist);
                                formData.append("yDist", $scope.yDist);
                                
                                formData.append("_businessId", $rootScope.user._id);
                                formData.append("_offerTypeId", _offerTypeId);
                                formData.append("_offerSubCategoryId", $scope.chosenOfferCat._id);
                                formData.append("offerTitle", offerTitle);
                                formData.append("description", description);
                                formData.append("startDateTime", startDateTime);
                                formData.append("endDateTime", endDateTime);
                                formData.append("weeksAhead", weeksAhead);
                                formData.append("weekdayIndex", weekdayIndex);
                                formData.append("_eventId", $scope.chosenOfferEvent._id);
                                
                                Images.uploadImageForOfferCreation(formData).success(function (successData) {
                                    $rootScope.debugModeLog({'msg': 'ProfileController AddBusinessItemCtrl uploadImageForOfferCreation() successData', 'data': successData});
                                    
                                    if (isInt(successData)) {
                                        uploadComplete(successData);
                                    }
                                }).error(function (errorData) {
                                    $rootScope.debugModeLog({'msg': 'ProfileController AddBusinessItemCtrl uploadImageForOfferCreation() errorData', 'data': errorData});
                                    
                                    if (isInt(errorData)) {
                                        uploadComplete();
                                    }
                                    else {
                                        uploadImage();
                                    }
                                });
                            }
                        }
                        
                        uploadImage();
                    }
                    break;
                case 'OwnEvents':
                    var idealImgW, idealImgH ,idealImgWPercent;
                    var getAvailableMusicStyles = function () {
                        Categories.getAvailableMusicStyles().success(function (musicStyles) {
                            $scope.musicStyles = musicStyles;
                        }).error(function () {
                            getAvailableMusicStyles();
                        });
                    }
                    
                    $rootScope.pageTitle = 'Create New Event';
                    $scope.pageTitle = $rootScope.pageTitle;
                    
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
                    $scope.imgEntryType = "event_cover_photo";
                    
                    idealImgW = 960;
                    idealImgH = 640;
                    idealImgWPercent = 90;
                    
                    $scope.dataWidth = (window.innerWidth > 830) ? 600 : (window.innerWidth/100) * idealImgWPercent;
                    $scope.dataHeight = (idealImgH/idealImgW) * $scope.dataWidth;
                    $rootScope.dataScale = ($scope.dataWidth/idealImgW);
                        
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
                    
                    getAvailableMusicStyles();
                    
                    $scope.eventRegularityTypes = [
                        {name: 'one-off', displayName: 'This is a one-off event', itemType: 'eventRegularityType', mustBeSelected: true},
                        {name: 'weekly', displayName: 'This is a weekly event', itemType: 'eventRegularityType', mustBeSelected: true}
                    ];
                    $scope.selectedEventRegularityType = {
                        name: 'one-off', displayName: 'This is a one-off event', mustBeSelected: true
                    };
                    
                    $scope.eventGuestListOptions = [
                        {name: 'false', displayName: 'There is no event guestlist for users', mustBeSelected: true, itemType: 'eventGuestListOption'},
                        {name: 'true', displayName: 'There is an event guestlist for users', mustBeSelected: true, itemType: 'eventGuestListOption'}
                    ];
                    $scope.selectedEventGuestListOption = {
                        name: 'false', displayName: 'There is no event guestlist for users', mustBeSelected: true
                    };

                    $scope.selectedDate1 = new Date();
                    $scope.todaysDate = new Date();
                    $scope.finalDate = new Date();
                    $scope.dateChosen = false;
                    
                    $scope.dateInputHTML = 'Select a date for this event';

                    var ipObj1 = {
                      callback: function (val) {  //Mandatory
                        $scope.selectedDate1 = new Date(val);
                        $scope.dateInputHTML = datesService.convertToDate($scope, $scope.selectedDate1);
                        ipObj1.inputDate = new Date(val);
                        $scope.dateChosen = true;
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
                        
                        $scope.showMusicCategories = false;
                    }

                    $scope.removeMusicStyle = function (style) {
                        var indexToRemove = null;
                        $scope.showMusicCategories = false;
                        for (a = 0; a < $scope.chosenMusicStyleObjects.length; a++) {
                            $scope.chosenMusicStyleObjects[a].showMusicCategories = false;
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
                    }
                    
                    $scope.imgUploadPrepare = function () {
                        document.getElementById('img-upload').multiple = false;
                        if (!ionic.Platform.isAndroid()) {
                            document.getElementById('img-upload').click();
                        }
                        else {
                            $rootScope.getAndroidImage({imgEntryType: "cover_photo", onComplete: function () {}});
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
                    
                    $scope.guestListMaxInput = [{_id: 1}];
                    
                    $scope.addOffer = function () {
                        $ionicPopup.show({
                            title: 'Add an Offer',
                            template: '<p>You can add an Offer to this Event by adding an Offer into your \'My Current Offers\' panel after creating this event.</p>',
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
                    }

                    $scope.addEvent = function (eventTitle, description, dressCode, dealsOnTheNight, extraInfo) {
                        $rootScope.appLoading = true;
                        
                        var _businessPlaceId = null;
                        var dateTimeString = $scope.selectedDate1.getFullYear() + '-' + ($scope.selectedDate1.getMonth() + 1) + '-' + $scope.selectedDate1.getDate() + ' 00:00';
                        var weekdayIndex = ($scope.selectedDate1.getDay() == 0) ? 7 : $scope.selectedDate1.getDay();
                        weekdayIndex = ($scope.selectedEventRegularityType.name == 'weekly') ? weekdayIndex: null;
                        
                        if ($rootScope.user.businessTypeName == 'Nightclub' || $rootScope.user.businessTypeName == 'Bar') {
                            _businessPlaceId = $rootScope.user._businessPlaceId;
                        } else {
                            _businessPlaceId = $rootScope.user._businessPlaceId;
                        }
                        
                        guestListMax = ($scope.guestListMaxInput[0].val == null) ? 0: $scope.guestListMaxInput[0].val;
                        weeksAhead = ($scope.selectedEventRegularityType.name == 'one-off') ? 0: $scope.chosenWeeksAhead._id;
                        $scope.eventHasGuestList = ($scope.selectedEventGuestListOption.name == 'true') ? 1: 0;

                        var musicStyleIdString = "";
                        if ($scope.chosenMusicStyleIds.length > 0) {
                            for (a = 0; a < $scope.chosenMusicStyleIds.length; a++) {
                                if (a > 0 && $scope.chosenMusicStyleIds[a] != null) {
                                    musicStyleIdString += ', ' + $scope.chosenMusicStyleIds[a];
                                }
                                if ($scope.chosenMusicStyleIds[a] != null) {
                                    musicStyleIdString += $scope.chosenMusicStyleIds[a];
                                }
                            }
                        }
                        
                        var uploadComplete = function (successData) {
                            $rootScope.files = [];
                            $rootScope.imageSrcs = [];
                            $rootScope.progress = 0;
                            
                            var _eventId = successData;
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
                                            $rootScope.prepareMessageNotificationFinal(recipientsArray, contents, header, dataObj);
                                        }
                                    }
                                }).error(function () {
                                    getFollowerProfileIdsForBusiness(_eventId);
                                });
                            }
                             
                            getFollowerProfileIdsForBusiness(_eventId);
                            
                            $rootScope.$broadcast('new-event');
                            $rootScope.backButtonFunction();
                            $rootScope.appLoading = false;
                        };
                        
                        var uploadImage = function () {
                            function isInt(value) {
                              return !isNaN(value) && (function(x) { return (x | 0) === x; })(parseFloat(value))
                            }
                            
                            if (ionic.Platform.isAndroid()) {
                                var myImg = $rootScope.file,
                                options = new FileUploadOptions(),
                                ft = new FileTransfer(),
                                params = {};
                                
                                options.fileName = $rootScope.fileName;
                                options.fileKey="fileUpload";
                                options.httpMethod="POST";
                                options.chunkedMode = false;
                                options.mimeType = "image/jpeg";

                                params.user_token = localStorage.getItem('auth_token');
                                params.user_email = localStorage.getItem('email');
                                params._profileId = $rootScope.user._profileId;
                                params.imgEntryType = "offer_cover_photo";
                                params.startX = $scope.startX;
                                params.xDist = $scope.xDist;
                                params.startY = $scope.startY;
                                params.yDist = $scope.yDist;

                                params._businessPlaceId = _businessPlaceId
                                params.eventTitle = eventTitle;
                                params.description = description;
                                params.eventDateTime = dateTimeString;
                                params.dressCode = dressCode;
                                params.guestListMax = guestListMax;
                                params.dealsOnTheNight = dealsOnTheNight;
                                params.extraInfo = extraInfo;
                                params.weekdayIndex = weekdayIndex;
                                params.weeksAhead = weeksAhead;
                                params._businessId = $rootScope.user._id;
                                params.eventHasGuestList = $scope.eventHasGuestList;
                                params.musicStyleIdString = musicStyleIdString;

                                options.params = params;

                                var onUploadSuccess = function (successData) {
                                    $rootScope.debugModeLog({'msg': 'ProfileController AddBusinessItemCtrl uploadImageForEventCreation() successData', 'data': successData});
                                    successData = successData.response.replace(/"/g, '');
                                    if (isInt(successData)) {
                                        uploadComplete(successData);
                                    }
                                }
                                var onUploadFail = function (errorData) {
                                    $rootScope.debugModeLog({'msg': 'ProfileController AddBusinessItemCtrl uploadImageForEventCreation() errorData', 'data': errorData});
                                    errorData = errorData.response.replace(/"/g, '');
                                    if (isInt(errorData)) {
                                        uploadComplete();
                                    }
                                    else {
                                        uploadImage();
                                    }
                                }

                                ft.upload(myImg, encodeURI($rootScope.assetsFolderUrl + "/data/functions/image-upload.php?action=uploadImage&platform=android"), onUploadSuccess, onUploadFail, options);
                            } else {
                                var formData = new FormData();
                        
                                formData.append("_profileId", $rootScope.user._profileId);
                                formData.append("imgEntryType", "event_cover_photo");
                                formData.append("files[]", $rootScope.files[0]);
                                formData.append("startX", $scope.startX);
                                formData.append("startY", $scope.startY);
                                formData.append("xDist", $scope.xDist);
                                formData.append("yDist", $scope.yDist);
                                
                                formData.append("_businessPlaceId", _businessPlaceId);
                                formData.append("eventTitle", eventTitle);
                                formData.append("description", description);
                                formData.append("eventDateTime", dateTimeString);
                                formData.append("dressCode", dressCode);
                                formData.append("guestListMax", guestListMax);
                                formData.append("dealsOnTheNight", dealsOnTheNight);
                                formData.append("extraInfo", extraInfo);
                                formData.append("weekdayIndex", weekdayIndex);
                                formData.append("weeksAhead", weeksAhead);
                                formData.append("_businessId", $rootScope.user._id);
                                formData.append("eventHasGuestList", $scope.eventHasGuestList);
                                formData.append("musicStyleIdString", musicStyleIdString);
                                
                                Images.uploadImageForEventCreation(formData).success(function (successData) {
                                    $rootScope.debugModeLog({'msg': 'ProfileController AddBusinessItemCtrl uploadImageForEventCreation() successData', 'data': successData});
                                    
                                    if (isInt(successData)) {
                                        uploadComplete(successData);
                                    }
                                }).error(function (errorData) {
                                    $rootScope.debugModeLog({'msg': 'ProfileController AddBusinessItemCtrl uploadImageForEventCreation() errorData', 'data': errorData});
                                    
                                    if (isInt(errorData)) {
                                        uploadComplete();
                                    }
                                    else {
                                        uploadImage();
                                    }
                                });
                            }
                        }
                        
                        uploadImage();
                        
                    }
                    break;
                case 'BusinessCarteMenuItemCats':
                case 'BusinessTakeawayMenuItemCats':
                    //PAGE LOAD
                    $rootScope.pageTitle = ($stateParams.itemType == 'BusinessCarteMenuItemCats') ? 'A la Carte Menu Item': 'Takeaway Menu Item';
                    $scope.pageTitle = $rootScope.pageTitle;
                    
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
                            
                            var getAllMenuItemTags = function () {
                                MenuItems.getAllMenuItemTags().success(function (tags) {
                                    
                                    for (a = 0; a < tags.length; a++) {
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
                                    
                                    var getMenuItemCategoriesForBusiness = function () {
                                        MenuItems.getMenuItemCategoriesForBusiness($rootScope.user._id).success(function (successData2) {
                                            $rootScope.debugModeLog({'msg': 'getMenuItemCategoriesForBusiness for OwnMenuItems in AddbusinessItem results', 'data': successData2});
                                            
                                            $scope.menuItemCategories = successData2;

                                            if ($stateParams._secondaryItemTypeId != null) {
                                                for (a = 0; a < $scope.menuItemCategories.length; a++) {
                                                    if ($scope.menuItemCategories[a]._id == $stateParams._secondaryItemTypeId) {
                                                        $scope.selectedCategory = $scope.menuItemCategories[a];
                                                    }
                                                }
                                            }
                                        }).error(function () {
                                            getMenuItemCategoriesForBusiness();
                                        });
                                    }
                                    getMenuItemCategoriesForBusiness();
                                    
                                    var getMenuItemSubCategoriesForBusiness = function () {
                                        MenuItems.getMenuItemSubCategoriesForBusiness($rootScope.user._id).success(function (successData3) {
                                            $rootScope.debugModeLog({'msg': 'getMenuItemCategoriesForBusiness for OwnMenuItems in AddbusinessItem results', 'data': successData3});
                                            
                                            $scope.menuItemSubCategories = successData3;
                                        }).error(function () {
                                            getMenuItemSubCategoriesForBusiness();
                                        });
                                    }
                                    getMenuItemSubCategoriesForBusiness();
                                }).error(function () {
                                    getAllMenuItemTags();
                                });
                            }
                            getAllMenuItemTags();
                        }).error(function () {
                            $scope.pageLoadFunction();
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
                            
                            var createMenuItem = function () {
                                MenuItems.createMenuItem($rootScope.user._id, $scope._menuTypeId, $scope.selectedCategory._id, $scope.selectedSubCategory._id, itemName, price, description, appliedOptionsFinal, appliedTagsFinal).success(function (successData) {
                                    $rootScope.debugModeLog({'msg': 'createMenuItem for OwnMenuItems in AddBusinessItem results', 'data': successData});
                                    
                                    $scope.appliedOptions = [];
                                    $scope.appliedOptionsNames = [];
                                    $scope.appliedTags = [];
                                    $scope.appliedTagsNames = [];
                                    
                                    $rootScope.$broadcast('menu-items-changed');
                                    $rootScope.backButtonFunction();
                                    
                                }).error(function () {
                                    createMenuItem();
                                });
                            }
                            createMenuItem();
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
                    $rootScope.pageTitle = 'Create New Menu Category';
                    $scope.pageTitle = $rootScope.pageTitle;
                    $scope.existingCatNames = [];
                    var getMenuItemCategoriesForBusiness = function () {
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
                                    $rootScope.backButtonFunction();
                                    $rootScope.appLoading = false;
                                }).error(function () {
                                    $scope.addItemToMenuItemCategories();
                                });
                            }
                        }).error(function () {
                            getMenuItemCategoriesForBusiness();
                        });
                    }
                    
                    getMenuItemCategoriesForBusiness();
                    break;
                case 'MenuItemSubCategories':
                    $rootScope.pageTitle = 'Create New Menu Sub-category';
                    $scope.pageTitle = $rootScope.pageTitle;
                    $scope.existingCatNames = [];
                    var getMenuItemSubCategoriesForBusiness = function () {
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
                                    $rootScope.backButtonFunction();
                                    $rootScope.appLoading = false;
                                }).error(function () {
                                
                                });
                            }
                        }).error(function () {
                            getMenuItemSubCategoriesForBusiness();
                        });
                    }
                    
                    break;
                case 'MenuItemTemplateOptions':
                    $rootScope.pageTitle = 'Create New Menu Template Option';
                    $scope.pageTitle = $rootScope.pageTitle;
                    $scope.showChangeOrderButtons = false;
                    $scope.businessItem = {'name': '', 'priceRelevant': false, 'quantityRelevant': false, 'options': [], 'type': null};
                    
                    var getMenuTemplateOptionCategories = function () {
                        MenuItems.getMenuTemplateOptionCategories().success(function (successData) {
                            $scope.menuItemTemplateOptionCategories = (successData != 'null') ? successData : [];
                            $scope.selectedCategory = {'_id': 0, 'Name': 'Select Category'};
                        }).error(function () {
                            getMenuTemplateOptionCategories();
                        });
                    }
                    getMenuTemplateOptionCategories();
                    
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
                        
                        $scope.businessItem.options.splice($scope.currentOptionBeingAdded.orderIndex - 1, 0, $scope.currentOptionBeingAdded);
                        for (a = $scope.currentOptionBeingAdded.orderIndex; a < $scope.businessItem.options.length; a++) {
                            $scope.businessItem.options[a].orderIndex = parseInt($scope.businessItem.options[a].orderIndex) + 1;
                        }
                        
                        $scope.currentOptionBeingAdded = {'name': '', 'extraPrice': 0.00, 'orderIndex': $scope.businessItem.options.length + 1};
                    }
                
                    $scope.addTemplateOption = function () {
                        $rootScope.appLoading = true;
                        
                        MenuItems.createMenuItemTemplateOption($rootScope.user._id, $scope.selectedCategory._id, $scope.businessItem).success(function (successData) {
                            $rootScope.debugModeLog({'msg': 'createMenuItemTemplateOption for OwnMenuItems in AddBusinessItem results', 'data': successData});
                            
                            $rootScope.$broadcast('menu-item-template-options-changed');
                            $rootScope.backButtonFunction();
                            $rootScope.appLoading = false;
                        }).error(function () {
                            $scope.addTemplateOption();
                        });
                        
                    }
                    
                    break;
                case 'BlockedTableBookingIntervals':
                    $scope.showStartTimeSelect = false;
                    $scope.showEndTimeSelect = false;
                    $scope.startDateInputString = "Enter Start Date";
                    $scope.endDateInputString = "Enter End Date";
                    $scope.startTimeInputString = "00:00";
                    $scope.endTimeInputString = "11:59";
                    $scope.selectedStartTime = "00:00";
                    $scope.selectedEndTime = "11:59";

                    $scope.ipObj1 = {
                      callback: function (val) {  //Mandatory
                        $scope.selectedIntervalStartDate = new Date(val);
                        $scope.startDateInputString = datesService.convertToDate($scope, $scope.selectedIntervalStartDate);
                        $scope.ipObj1.inputDate = new Date(val);
                        
                        $scope.ipObj2.from = angular.copy($scope.selectedIntervalStartDate);
                      },
                      disabledDates: [],
                      from: new Date(), //Optional
                      inputDate: new Date(),      //Optional
                      mondayFirst: true,          //Optional
                      disableWeekdays: [],       //Optional
                      closeOnSelect: true,       //Optional
                      templateType: 'popup'       //Optional
                    };
                    
                    $scope.ipObj2 = {
                      callback: function (val) {  //Mandatory
                        $scope.selectedIntervalEndDate = new Date(val);
                        $scope.endDateInputString = datesService.convertToDate($scope, $scope.selectedIntervalEndDate);
                        $scope.ipObj2.inputDate = new Date(val);
                        
                        $scope.ipObj1.to = angular.copy($scope.selectedIntervalEndDate);
                      },
                      disabledDates: [],
                      from: new Date(), //Optional
                      to: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
                      inputDate: new Date(),      //Optional
                      mondayFirst: true,          //Optional
                      disableWeekdays: [],       //Optional
                      closeOnSelect: true,       //Optional
                      templateType: 'popup'       //Optional
                    };

                    $scope.startTimeIpObj = {
                        callback: function (val) {      //Mandatory
                            var timeVal = new Date(val * 1000);
                            var timeValHours = (timeVal.getUTCHours() < 10) ? '0' + timeVal.getUTCHours(): timeVal.getUTCHours();
                            var timeValMinutes = (timeVal.getUTCMinutes() < 10) ? '0' + timeVal.getUTCMinutes(): timeVal.getUTCMinutes();
                            
                            $scope.selectedStartTime = timeValHours + ':' + timeValMinutes;
                            $scope.startTimeInputString = timeValHours + ':' + timeValMinutes;

                            $scope.startTimeIpObj.inputTime = (timeValMinutes < 30) ? val: val - 3600;
                        },
                        inputTime:00000,   //Optional
                        format: 12,         //Optional
                        step: 5,           //Optional
                        setLabel: 'Select'    //Optional
                    }

                    $scope.endTimeIpObj = {
                        callback: function (val) {      //Mandatory
                            var timeVal = new Date(val * 1000);
                            var timeValHours = (timeVal.getUTCHours() < 10) ? '0' + timeVal.getUTCHours(): timeVal.getUTCHours();
                            var timeValMinutes = (timeVal.getUTCMinutes() < 10) ? '0' + timeVal.getUTCMinutes(): timeVal.getUTCMinutes();
                            
                            $scope.selectedEndTime = timeValHours + ':' + timeValMinutes;
                            $scope.endTimeInputString = timeValHours + ':' + timeValMinutes;

                            $scope.endTimeIpObj.inputTime = (timeValMinutes < 30) ? val: val - 3600;
                        },
                        inputTime:82740,   //Optional
                        format: 12,         //Optional
                        step: 5,           //Optional
                        setLabel: 'Select'    //Optional
                    }
                    
                    //User Action function
                    $scope.openDatePicker = function (ipObj) {
                        ionicDatePicker.openDatePicker(ipObj);
                    }
                    $scope.openTimePicker = function(ipObj){
                        ionicTimePicker.openTimePicker(ipObj);
                    };

                    $scope.showTimeSelect = function (state) {
                        if (state == 'start') {
                            $scope.showStartTimeSelect = true;
                        } else {
                            $scope.showEndTimeSelect = true;
                        }
                    }

                    $scope.addBlockedTableBookingInterval = function () {
                        var startDateSqlTimeString = $scope.selectedIntervalStartDate.getFullYear() + '-' + ($scope.selectedIntervalStartDate.getMonth() + 1) + '-' + $scope.selectedIntervalStartDate.getDate() + ' ' + $scope.selectedStartTime;
                        var endDateSqlTimeString = $scope.selectedIntervalEndDate.getFullYear() + '-' + ($scope.selectedIntervalEndDate.getMonth() + 1) + '-' + $scope.selectedIntervalEndDate.getDate() + ' ' + $scope.selectedEndTime;
 
                        var params = {_businessId: $rootScope.user._id, startDateTime: startDateSqlTimeString, endDateTime: endDateSqlTimeString};
                        TableBooking.createBlockedTableBookingInterval(params).success(function (successData) {
                            successData = parseInt(successData.replace(/"/g, ''));

                            if (successData == 0) {
                                $rootScope.backButtonFunction();
                            }
                            else {
                                $ionicPopup.show({
                                    title: "Error with this Interval",
                                    template: "<p>It looks like you already have an existing interval which overlaps with some of the dates of this interval. Overlapping intervals are not allowed. Please check the errors, and try again.</p>",
                                    scope: $scope,
                                    buttons: [
                                        { 
                                            text: 'Close',
                                            onTap: function(e) {
                                              
                                            } 
                                        }
                                    ]
                                });
                            }
                        }).error(function (errorData) {
                            $scope.addBlockedTableBookingInterval();
                        });
                    }

                    break;
            };
            
            $scope.prepareImageUpload = function (data) {
                $scope.startX = Math.floor((data.imageX*-1) * (1/data.imageZoom));
                $scope.xDist = Math.ceil($scope.dataWidth * (1/data.imageZoom));
                $scope.startY = Math.floor((data.imageY*-1) * (1/data.imageZoom));
                $scope.yDist = Math.ceil($scope.dataHeight * (1/data.imageZoom));
                
                $timeout(function () {$ionicScrollDelegate.resize()}, 1000);
            };
            
            var coverPhotoUploadedBroadcastFn = $rootScope.$on('cover-photo-uploaded', function (event, data) {
                if (data.currentViewName == 'app.addBusinessItem') {
                    $scope.prepareImageUpload(data);
                }
            });
            
            $scope.$on('$destroy', function() {
                coverPhotoUploadedBroadcastFn();
            });
        }
        
        $rootScope.checkForAppInit($scope);
    }]);
    app.controller('BusinessItemSettingsCtrl', ['$ionicHistory', '$rootScope', '$state', '$stateParams', '$scope', 'MenuItems', '$ionicViewSwitcher', function($ionicHistory, $rootScope, $state, $stateParams, $scope, MenuItems, $ionicViewSwitcher) {
        //Variables & Constants
        $scope.rootScope = $rootScope;
        $scope.itemType = $stateParams.itemType;
        
        $scope.pageLoad = function () {
            switch($stateParams.itemType) {
                case 'BusinessMenuItemCats':
                    
                    //User Response Functions
                    
                    break;
            };
        }
        
        $rootScope.checkForAppInit($scope);
    }]);

    /* Profile Items */
    app.controller('ProfileItemsCtrl', ['$rootScope', '$state', '$stateParams', '$scope', 'Offers', 'Profile', 'Events', 'Taxi', 'MenuItems', '$ionicViewSwitcher', '$ionicHistory', '$ionicModal', '$ionicPopup', 'Images', '$timeout', function($rootScope, $state, $stateParams, $scope, Offers, Profile, Events, Taxi, MenuItems, $ionicViewSwitcher, $ionicHistory, $ionicModal, $ionicPopup, Images, $timeout) {
        //Variables & Constants
        $scope.profileItemCats = [];
        $scope.profileItems = [];
        $scope.rootScope = $rootScope;
        $scope.itemType = $stateParams.itemType;
        $scope.specificItemType = $stateParams.specificItemType;
        
        $scope.$on('$ionicView.beforeEnter', function() {
            $rootScope.pageTitle = ($scope.pageTitle) ? $scope.pageTitle: $rootScope.pageTitle;
        });
        
        $scope.$on('$ionicView.enter', function () {
            //Over-ride default page top-right button settings && image settings
            
            $rootScope.topRightButtonShouldBeSettings = false;
            
            if ($stateParams.specificItemType == 'SpecificPhotoFolderSummary' &&
                    ($stateParams.albumType == 'Cover Photo' || $stateParams.albumType == 'Profile Photo')
                ) {
                $rootScope.showTopRightButton = true;
                $rootScope.topRightButtonIsPlus = true;
                
                $rootScope.topRightButtonFunction = function () {
                    $state.go('app.addProfileItem', {'itemType': $stateParams.itemType, 'specificItemType': $stateParams.specificItemType, 'albumType': $stateParams.albumType});
                };
                
                $rootScope.allPopoverImages = $scope.popoverImages || [];
            }
        });
        
        $scope.pageLoad = function () {
            $scope.nextPageFunction = function (item) {
                $state.go('app.seeBusinessMenuItems', {'_businessId': $rootScope.user._id, '_menuItemCategoryId': item._id});
            };

            $scope.windowWidth = (window.innerWidth/100) * 28.5;
            
            var sortThroughListingCats = function (data) {
                var filteredListingTypes = {};
                var listingTypes = {
                    Business: {
                        items: [],
                        name: 'Businesses',
                        icon: 'ion-home',
                        itemTypes: ['Likes', 'Followed', 'FollowedBusiness', 'Following'],
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
                        itemTypes: ['Followed', 'Following', 'Liked', 'FollowedBusiness'],
                        showing: true}
                }
                
                for (prop in listingTypes) {
                    if (listingTypes[prop].itemTypes.indexOf($scope.itemType) != -1) {
                        //Special rule because past Liked items should not show Businesses
                        if (prop != 'Business' || $scope.itemType != 'Likes' || $stateParams.timeScale != 'past') {
                            filteredListingTypes[prop] = listingTypes[prop];
                        }
                    }
                    if (prop == 'Person') {
                        if (data != 'null' && data != null) {
                            for (a = 0; a < data.length; a++) {
                                filteredListingTypes[data[a].listingType].items.push(data[a]);
                                
                                if (a == data.length - 1) {
                                    for (prop in listingTypes) {
                                        if (filteredListingTypes[prop] && filteredListingTypes[prop].items.length > 0) {
                                            for (b = 0; b < filteredListingTypes[prop].items.length; b++) {
                                                filteredListingTypes[prop].items[b].evenIndex = ((b+1)%2 == 0) ? 'even': 'odd';
                                                if (b == filteredListingTypes[prop].items.length - 1 && prop == 'Person') {
                                                    return filteredListingTypes;
                                                }
                                            }
                                        }
                                        else if (prop == 'Person') {
                                            return filteredListingTypes;
                                        }
                                    }
                                }
                            }
                        } else {
                            return filteredListingTypes;
                        }
                    }
                }
                
            }
            
            switch($scope.itemType) {
                case 'PhotosSummary':
                    if ($scope.specificItemType == 'SpecificPhotoFolderSummary') {
                        $rootScope.pageTitle = ($stateParams.albumType == 'Profile Photo') ? 'My Profile Pictures': 'My Cover Photos';
                        $scope.pageTitle = $rootScope.pageTitle;
                        $scope.itemLabel = ($stateParams.albumType == 'Profile Photo') ? 'Profile Pictures': 'Cover Photos';
                        $scope.currentDefaultPhotoId = null;
                        
                        $scope.getProfileItems = function () {
                            Profile.getSpecificAlbumSummaryForListing($rootScope.user._profileId, $stateParams._albumId, $stateParams.albumType, 'Profile').success(function (successData) {
                                $rootScope.debugModeLog({'msg': 'ProfileItemsCtrl getSpecificAlbumSummaryForListing successData', 'data': successData});
                                
                                if (successData != 'null') {
                                    var popoverImages = [];
                                    var albumName = '';
                                    if ($stateParams.albumType == 'Profile Photo') {
                                        albumName = 'profile_photo';
                                    }
                                    else if ($stateParams.albumType == 'Cover Photo') {
                                        albumName = 'cover_photo';
                                    }
                                    else {
                                        albumName = 'general_photo';
                                    }
                                    
                                    for (a = 0; a < successData.length; a++) {
                                        var relModulus = ($stateParams.albumType == 'Profile Photo') ? ((a+3)%3 != 0): ((a+1)%2 == 0);
                                        
                                        successData[a].evenIndex = (relModulus) ? 'even': 'odd';
                                        successData[a].index = a;
                                        
                                        popoverImages.push({'src': $rootScope.assetsFolderUrl + '/img/user_images/'+albumName+'/' + successData[a].name});
                                        $scope.currentDefaultPhotoId = (successData[a].isCurrent == '1') ? successData[a]._id: $scope.currentDefaultPhotoId;
                                        
                                        if (a == successData.length - 1) {
                                            $scope.popoverImages = popoverImages;
                                            $rootScope.allPopoverImages = popoverImages;
                                            $scope.profileItemCats = {All: {name: 'All', items: successData}};
                                        }
                                    }
                                }
                            }).error(function () {
                                $scope.getProfileItems();
                            });
                        }
                            
                        //User Action Functions
                        $scope.updateUsersDefaultPhoto = function () {
                            $rootScope.appLoading = true;
                            if ($scope.currentImageSelectedId == null) { return false; };
                            var params = {
                                '_profileId': $rootScope.user._profileId,
                                '_photoId' : $scope.currentImageSelectedId,
                                'photoType' : $stateParams.albumType
                            };
                            
                            Profile.updateUsersDefaultPhoto(params).success(function (successData) {
                                $scope.currentDefaultPhotoId = $scope.currentImageSelectedId;
                                $scope.currentImageSelectedId = null;
                                $scope.currentImageSelectedName = null;
                                $rootScope.$broadcast('default-photo-update');
                                $rootScope.appLoading = false;
                            }).error(function (errorData) {
                                $scope.updateUsersDefaultPhoto();
                            });
                        }
                        
                        $scope.removeImage = function () {
                            $rootScope.appLoading = true;
                            if ($scope.currentImageSelectedId == null) { return false; };
                            var params = {
                                '_profileId': $rootScope.user._profileId,
                                '_photoId' : $scope.currentImageSelectedId,
                                'photoType' : $stateParams.albumType,
                                'photoName' : $scope.currentImageSelectedName
                            };
                            
                            Profile.deleteUsersImage(params).success(function (successData) {
                                $rootScope.debugModeLog({'msg': 'ProfileItemsCtrl deleteUsersImage successData', 'data': successData});
                                
                                $scope.currentDefaultPhotoId = ($scope.currentDefaultPhotoId == $scope.currentImageSelectedId) ? null : $scope.currentDefaultPhotoId;
                                $scope.currentImageSelectedId = null;
                                $scope.currentImageSelectedName = null;
                                $rootScope.$broadcast('photo-uploaded');
                                $rootScope.appLoading = false;
                            }).error(function (errorData) {
                                $rootScope.debugModeLog({'msg': 'ProfileItemsCtrl deleteUsersImage errorData', 'data': errorData});
                                
                                $scope.removeImage;
                            });
                        }
                        
                        $scope.confirmImageRemoval = function () {
                            $scope.mainPopup.close();
                            
                            $timeout(function () {
                                $scope.deleteImagePopup = $ionicPopup.confirm({
                                    title: 'Delete Photo',
                                    template: '<p>Are you sure you want to delete this photo? This action cannot be undone.</p>',
                                    cssClass: 'image-options',
                                    okText: 'Delete Photo',
                                    button: [
                                        {
                                            text: 'Delete Photo',
                                            type: 'button-positive',
                                            onTap: function(e) {
                                                $scope.deleteImagePopup.close();
                                            } 
                                        },
                                        { 
                                            text: 'Cancel',
                                            onTap: function(e) {
                                                $scope.deleteImagePopup.close();
                                            } 
                                        }
                                    ]
                                }).then(function (val) {
                                    if (!val) {
                                        $scope.currentImageSelectedId = null;
                                        $scope.currentImageSelectedName = null;
                                    } else {
                                        $scope.removeImage();
                                    }
                                });
                            }, 200);
                            
                        }
                        
                        $scope.showImageOptions = function (imageId, imageName) {
                            var buttonsArr = [
                                { 
                                    text: 'Delete Photo',
                                    type: 'button-positive',
                                    onTap: function(e) {
                                        $scope.confirmImageRemoval();
                                    } 
                                },
                                { 
                                    text: 'Close',
                                    onTap: function(e) {
                                        $scope.currentImageSelectedId = null;
                                        $scope.currentImageSelectedName = null;
                                    } 
                                }
                            ];
                            $scope.currentImageSelectedId = imageId;
                            $scope.currentImageSelectedName = imageName;
                            
                            if ($stateParams.albumType == 'Profile Photo' || $stateParams.albumType == 'Cover Photo') {
                                var photoDescript = ($stateParams.albumType == 'Profile Photo') ? 'Profile': 'Cover';
                                buttonsArr.unshift({
                                    text: 'Make ' + photoDescript + ' Photo',
                                    onTap: function(e) {
                                        $scope.updateUsersDefaultPhoto();
                                    } 
                                });
                            }
                            
                            $scope.mainPopup = $ionicPopup.show({
                                title: 'Image Options',
                                cssClass: 'image-options',
                                scope: $scope,
                                buttons: buttonsArr
                            });
                        }

                        //Updates based on Outside events
                        $rootScope.$on('photo-uploaded', function(event, args) {
                            $scope.getProfileItems();
                            // do what you want to do
                        })
                    }
                    else {
                        $rootScope.pageTitle = 'My Pictures';
                        $scope.pageTitle = $rootScope.pageTitle;
                        $scope.getProfileItems = function () {
                            Profile.getPhotoAlbumsSummaryForProfile($rootScope.user._profileId).success(function (successData) {
                                $rootScope.debugModeLog({'msg': 'ProfileItemsCtrl getPhotoAlbumSummaryForProfile successData', 'data': successData});
                                
                                if (successData != 'null') {
                                    $scope.profileItemCats = {All: {name: 'All', items: successData}};
                                }
                            }).error(function () {
                                $scope.getProfileItems();
                            });
                        }
                        //Updates based on Outside events
                        $rootScope.$on('photo-uploaded', function(event, args) {
                            $scope.getProfileItems();
                        });
                        $rootScope.$on('default-photo-update', function(event, args) {
                            $scope.getProfileItems();
                        });
                    }
                    
                    break;
                case 'Watched':
                    $rootScope.pageTitle = ($stateParams.timeScale) ? 'My Watched Items' : 'My Past Watched Items';
                    $scope.pageTitle = $rootScope.pageTitle;
                    $scope.noItemsMessage = ($stateParams.timeScale == 'present') ? 'You are not watching any ': 'You do not have any past watched ';
                    $scope.getProfileItems = function () {
                        Profile.getWatchedListingsForProfile($rootScope.user._profileId, $stateParams.timeScale).success(function (successData) {
                            $rootScope.debugModeLog({'msg': 'ProfileItemsCtrl getWatchedListingsForProfile successData', 'data': successData});
                            
                            $scope.profileItemCats = sortThroughListingCats(successData);
                        }).error(function () {
                            $scope.getProfileItems();
                        });
                    }

                    //Updates based on Outside events
                    $rootScope.$on('menu-order-updated', function(event, args) {
                        $scope.getProfileItems();
                        // do what you want to do
                    })
                    break;
                case 'Followed':
                    $rootScope.pageTitle = 'My Followed Items';
                    $scope.pageTitle = $rootScope.pageTitle;
                    if ($rootScope.user.isBusiness == '1') {
                        $scope.itemType = 'FollowedBusiness';
                    }
                    $scope.noItemsMessage = 'You are not following any ';
                    $scope.getProfileItems = function () {
                        Profile.getFollowedListingsForProfile($rootScope.user._profileId).success(function (successData) {
                            $rootScope.debugModeLog({'msg': 'ProfileItemsCtrl getFollowedListingsForProfile successData', 'data': successData});
                            
                            $scope.profileItemCats = sortThroughListingCats(successData);
                        }).error(function () {
                            $scope.getProfileItems();
                        });
                    }
                    //Updates based on Outside events
                    $rootScope.$on('menu-order-updated', function(event, args) {
                        $scope.getProfileItems();
                        // do what you want to do
                    })
                    break;
                case 'Following':
                    $rootScope.pageTitle = 'My Followers';
                    $scope.pageTitle = $rootScope.pageTitle;
                    $scope.noItemsMessage = 'You are not being followed by any ';
                    //
                    $scope.getProfileItems = function () {
                        Profile.getFollowingProfilesForProfile($rootScope.user._profileId).success(function (successData) {
                            $rootScope.debugModeLog({'msg': 'ProfileItemsCtrl getFollowingProfilesForProfile successData', 'data': successData});
                            
                            $scope.profileItemCats = sortThroughListingCats(successData);
                            
                        }).error(function () {
                            $scope.getProfileItems();
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
                        $rootScope.pageTitle = 'My Likes';
                        $scope.pageTitle = $rootScope.pageTitle;
                        $scope.itemType = 'Liked';
                        $scope.noItemsMessage = 'Your business does not have any likes yet.';
                    } else {
                        $rootScope.pageTitle = ($stateParams.timeScale) ? 'My Liked items' : 'My Past Liked Items';
                        $scope.pageTitle = $rootScope.pageTitle;
                        $scope.noItemsMessage = ($stateParams.timeScale) ? 'You have not liked any current ': 'You do not have any past liked ';
                    }
                    $scope.getProfileItems = function () {
                        Profile.getLikedListingsForProfile($rootScope.user._profileId, $stateParams.timeScale).success(function (successData) {
                            $rootScope.debugModeLog({'msg': 'ProfileItemsCtrl getLikedListingsForProfile successData', 'data': successData});
                            
                            $scope.profileItemCats = sortThroughListingCats(successData);
                        }).error(function () {
                            $scope.getProfileItems();
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
                        $state.go('app.profileItems', {itemType:'PhotosSummary', specificItemType: 'SpecificPhotoFolderSummary', _albumId: item._albumId, albumType: item.picType});
                    }
                    break;
                case 'Watched':
                    $scope.nextPageFunction = function (item) {
                        if (item.listingType == 'Event' || item.listingType == 'Movie') {
                            $state.go('app.feed');
                            var timer = window.setTimeout(function () {
                                $state.go('app.feed.nlfeedListing', {'_listingId':item._actionedListingId, 'listingType': item.listingType});
                            }, 100);
                        }
                        else if (item.listingType == 'Offer') {
                            $state.go('app.offers');
                            var timer = window.setTimeout(function () {
                                $state.go('app.offers.offerDetail', {'_id':item._actionedListingId});
                            }, 100);
                        }
                    }
                    break;
                case 'Likes':
                case 'Liked':
                    $scope.nextPageFunction = function (item) {
                        if (item.listingType != 'Offer') {
                            $state.go('app.feed');
                            var timer = window.setTimeout(function () {
                                $state.go('app.feed.nlfeedListing', {'_listingId':item.relListingId, 'listingType': item.listingType});
                            }, 100);
                        }
                        else if (item.listingType == 'Offer') {
                            $state.go('app.offers');
                            var timer = window.setTimeout(function () {
                                $state.go('app.offers.offerDetail', {'_id':item.relListingId});
                            }, 100);
                        }
                    }
                    break;
                case 'Followed':
                case 'FollowedBusiness':
                case 'Following':
                    $scope.nextPageFunction = function (item) {
                        $state.go('app.feed');
                        var timer = window.setTimeout(function () {
                            $state.go('app.feed.nlfeedListing', {'_listingId':item.relListingId, 'listingType':item.listingType});
                        }, 100);
                    }
                    break;
            };
            
            $scope.getProfileItems();
        }
        
        $rootScope.checkForAppInit($scope);
    }]);
    app.controller('AddProfileItemCtrl', ['$ionicHistory', '$rootScope', '$state', '$stateParams', '$scope', 'Profile', '$ionicViewSwitcher', 'Images', function($ionicHistory, $rootScope, $state, $stateParams, $scope, Profile, $ionicViewSwitcher, Images) {
        //Variables & Constants
        $scope.rootScope = $rootScope;
        $scope.itemType = $stateParams.itemType;
        $scope.specificItemType = $stateParams.specificItemType;
        
        $scope.$on('$ionicView.beforeEnter', function() {
            $rootScope.backButtonFunction = function () {
                $rootScope.files = [];
                $rootScope.imageSrcs = [];
                $rootScope.progress = 0;
                var idealImgW, idealImgH, idealImgWPercent = null;
                
                $rootScope.$broadcast('reset-image-crop');
                
                $rootScope.initialBackButtonFunction();
            }
        });
        
        $scope.pageLoad = function () {
            
            switch($stateParams.itemType) {
                case 'PhotosSummary':
                    
                    /* SINGLE SELECT CODING, MAKE THIS CODE GENERIC WHEN POSSIBLE */
                    /**/
                    $scope.select = {
                        'ImgEntryType': {
                            show: false,
                            chosenStyles: [
                                {
                                    _id: null, 
                                    name: 'Select Image Folder'
                                }
                            ],
                            availableStyles: [
                                {
                                    _id: 1,
                                    name: 'Cover Photos',
                                    coding_name: 'cover_photo'
                                },
                                {
                                    _id: 2,
                                    name: 'Profile Photos',
                                    coding_name: 'profile_photo'
                                }
                            ]
                        }
                    };
            
                    $scope.toggleStyle = function (styleObj) {
                        styleObj.show = !styleObj.show;
                    }
                    
                    $scope.selectStyle = function (style, chosenOption) {
                        style.chosenStyles[0] = chosenOption;
                        style.show = false;
                        
                        // After
                        $scope.imgEntryType = style.chosenStyles[0].coding_name;
                        $scope.recalculateIdealImgDimensions();
                    }
                case 'SpecificPhotoFolderSummary':
                    switch ($stateParams.albumType) {
                        case 'Cover Photo':
                            idealImgW = 960;
                            idealImgH = 640;
                            idealImgWPercent = 90;
                            $scope.imgEntryType = 'cover_photo';
                            $scope.itemLabel = 'Cover Photo';
                        break;
                        case 'Profile Photo':
                            idealImgW = 320;
                            idealImgH = 320;
                            idealImgWPercent = 40;
                            $scope.imgEntryType = 'profile_photo';
                            $scope.itemLabel = 'Profile Photo';
                        break;
                    }
                break;
            };
            
            $scope.imgUploadPrepare = function () {
                /* Bring this back in after finding out about fileReader Cancel function */
                //$rootScope.appLoading = true;
                document.getElementById('img-upload').multiple = false;
                if (!ionic.Platform.isAndroid()) {
                    document.getElementById('img-upload').click();
                }
                else {
                    var completeFunc = ($scope.imgEntryType == 'cover_photo') ? function () {}: $scope.uploadImage;
                    $rootScope.getAndroidImage({imgEntryType: $scope.imgEntryType, onComplete: completeFunc});
                }
            }
            
            $scope.recalculateIdealImgDimensions = function () {
                idealImgW = ($scope.imgEntryType == "cover_photo") ? 960: 320;
                idealImgH = ($scope.imgEntryType == "cover_photo") ? 640: 320;
                idealImgWPercent = ($scope.imgEntryType == "cover_photo") ? 90: 40;
                
                $scope.dataWidth = (window.innerWidth > 830) ? 600 : (window.innerWidth/100) * idealImgWPercent;
                $scope.dataHeight = (idealImgH/idealImgW) * $scope.dataWidth;
                $rootScope.dataScale = ($scope.dataWidth/idealImgW);
            }


            var imageUploadComplete = function (data) {                
                $rootScope.debugModeLog({'msg': 'AddProfileItemCtrl uploadImage successData/errorData', 'data': data});

                if ((data == 'Successfully uploaded' && !ionic.Platform.isAndroid()) || (data.response == '"Successfully uploaded"' && ionic.Platform.isAndroid())) {
                    $rootScope.$broadcast('photo-uploaded');
                    $rootScope.files = [];
                    $rootScope.imageSrcs = [];
                    $rootScope.progress = 0;
                    $rootScope.backButtonFunction();
                    $rootScope.appLoading = false;
                }
            };

            if (ionic.Platform.isAndroid()) {
                $scope.uploadImage = function (data) {

                    var myImg = $rootScope.file,
                    options = new FileUploadOptions(),
                    ft = new FileTransfer(),
                    params = {},
                    imgEntryType = ($stateParams.albumType != 'Profile Photo' && $stateParams.albumType != 'Cover Photo') ? $scope.select['ImgEntryType'].chosenStyles[0].coding_name: $scope.imgEntryType;
                    ;
                    
                    options.fileName = $rootScope.file.fileName;
                    options.fileKey="fileUpload";
                    options.httpMethod="POST";
                    options.chunkedMode = false;
                    options.mimeType = "image/jpeg";

                    params.user_token = localStorage.getItem('auth_token');
                    params.user_email = localStorage.getItem('email');
                    params._profileId = $rootScope.user._profileId;
                    params.imgEntryType = imgEntryType;
                    if ($stateParams.albumType == 'Profile Photo') {
                        params.startX = 0;
                        params.startY = 0;
                        params.xDist = idealImgW;
                        params.yDist = idealImgH;
                    } else {
                        params.startX = Math.floor((data.imageX*-1) * (1/data.imageZoom));
                        params.xDist = Math.ceil($scope.dataWidth * (1/data.imageZoom));
                        params.startY = Math.floor((data.imageY*-1) * (1/data.imageZoom));
                        params.yDist = Math.ceil($scope.dataHeight * (1/data.imageZoom));
                    }

                    options.params = params;

                    var onUploadSuccess = function (successData) {
                        imageUploadComplete(successData);
                    }
                    var onUploadFail = function (errorData) {
                        imageUploadComplete(errorData);
                    }
                    
                    ft.upload(myImg, encodeURI($rootScope.assetsFolderUrl + "/data/functions/image-upload.php?action=uploadImage&platform=android"), onUploadSuccess, onUploadFail, options);
                }
            } else {
                $scope.uploadImage = function (data) {
                    //$rootScope.appLoading = true;

                    var formData = new FormData();
                    
                    var startX = Math.floor((data.imageX*-1) * (1/data.imageZoom));
                    var xDist = Math.ceil($scope.dataWidth * (1/data.imageZoom));
                    var startY = Math.floor((data.imageY*-1) * (1/data.imageZoom));
                    var yDist = Math.ceil($scope.dataHeight * (1/data.imageZoom));
                    var imgEntryType = ($stateParams.albumType != 'Profile Photo' && $stateParams.albumType != 'Cover Photo') ? $scope.select['ImgEntryType'].chosenStyles[0].coding_name: $scope.imgEntryType;
                    
                    formData.append("_profileId", $rootScope.user._profileId);
                    formData.append("imgEntryType", imgEntryType);
                    formData.append("files[]", $rootScope.files[0]);
                    formData.append("startX", startX);
                    formData.append("startY", startY);
                    formData.append("xDist", xDist);
                    formData.append("yDist", yDist);
                    
                    Images.uploadImage(formData).success(function (successData) {
                        imageUploadComplete(successData);
                    }).error(function (errorData) {
                        imageUploadComplete(errorData);
                    });
                }
            }
            
            $scope.recalculateIdealImgDimensions();
            
            var coverPhotoUploadedBroadcastFn = $rootScope.$on('cover-photo-uploaded', function (event, data) {
                if (data.currentViewName == 'app.addProfileItem') {
                    $scope.uploadImage(data);
                }
            });
            
            $scope.$on('$destroy', function() {
                coverPhotoUploadedBroadcastFn();
            });
        }
        
        $rootScope.checkForAppInit($scope);
    }]);

    /* Account Settings */
    app.controller('AccountSettingsCtrl', ['$rootScope', '$state', '$stateParams', '$scope', 'Offers', 'Profile', 'Events', 'Taxi', 'MenuItems', 'userService', '$ionicScrollDelegate', 'Notifications', '$ionicViewSwitcher', '$ionicHistory', '$timeout', function($rootScope, $state, $stateParams, $scope, Offers, Profile, Events, Taxi, MenuItems, userService, $ionicScrollDelegate, Notifications, $ionicViewSwitcher, $ionicHistory, $timeout) {
        //Variables & Constants
        $scope.settings = {};
        var storedSettings = {};
        $scope.rootScope = $rootScope;
        $scope.settingsType = $stateParams.settingsType;
        $scope.$on('$ionicView.enter', function() {
            $rootScope.topRightButtonShouldBeSettings = false;
            $rootScope.topRightButtonFunction = function () {
                $state.go('app.addBusinessItem', {'itemType': $stateParams.itemType});
            };
        })
        
        $scope.pageLoad = function () {
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
                    
                    if (field != $scope.settings.word) {
                        $scope.updateParams = {
                            _profileId: $rootScope.user._profileId,
                            isBusiness: ($rootScope.user.isBusiness == "0") ? 0: 1,
                            displayName: $scope.settings[updateParamsArray[0]].value,
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
                    } else {
                        $scope.updateParams = {
                            _profileId: $rootScope.user._profileId,
                            word: $scope.settings[updateParamsArray[1]].value,
                            resetCode: null,
                            withResetCode: 0
                        }
                    }
                    
                    var updateAllProfileDetails = function () {
                        Profile.updateAllProfileDetails($scope.updateParams).success(function (successData) {
                            $rootScope.debugModeLog({'msg': 'AccountSettingsCtrl updateAllProfileDetails successData', 'data': successData});
                            
                            $scope.originalDisplayName = $scope.updateParams.displayName;
                            field.editing = false;
                            $scope.editing = false;
                            $scope.storedSettings = angular.copy($scope.settings);
                            
                            $rootScope.user.displayName = $scope.updateParams.displayName;
                            $rootScope.user.email = $scope.updateParams.email;
                            //$rootScope.user.addressLine1 = $scope.updateParams.addressLine1;
                            //$rootScope.user.addressLine2 = $scope.updateParams.addressLine2;
                            //$rootScope.user.postcode = $scope.updateParams.postcode;
                            $rootScope.user.phone1 = $scope.updateParams.phone1;
                            //$rootScope.user.postcode = $scope.updateParams.postcode;
                            //$rootScope.user.description = $scope.updateParams.descriptions;
                            if ($rootScope.user.isBusiness == '1') {
                                $rootScope.user.name = $scope.updateParams.businessName;
                            } else {
                                $rootScope.user.name = $scope.updateParams.firstName + ' ' + $scope.updateParams.lastName;
                            }
                            
                            $rootScope.$broadcast('savestate');
                        }).error(function (errorData) {
                            updateAllProfileDetails();
                        });
                    }
                    var updateProfilePasswordDetails = function () {
                        Profile.updateProfilePasswordDetails($scope.updateParams).success(function (successData) {
                            $rootScope.debugModeLog({'msg': 'AccountSettingsCtrl updateProfilePasswordDetails errorData', 'data': successData});
                            
                            field.editing = false;
                            $scope.editing = false;
                            $scope.storedSettings = angular.copy($scope.settings);
                        }).error(function (errorData) {
                            updateProfilePasswordDetails();
                        });
                    }
                    
                    if (field == $scope.settings.word) {
                        updateProfilePasswordDetails();
                    } else {
                        updateAllProfileDetails();
                    }
                }
                else if ($stateParams.settingsType == 'Business') {
                    var updateParamsArray = ['isAcceptingOnlineOrders', 'showTakeawayMenu', 'isAcceptingTableBookings', 'showCarteMenu', 'maxTableBookingGuests', 'isAcceptingTaxiBookings', 'isSearchable', 'isAcceptingEnquiries'];
                    $scope.updateParams = {
                        _businessId: $rootScope.user._id
                    }

                    var updateAllBusinessSettingDetails = function () {
                            Profile.updateAllBusinessSettingDetails($scope.updateParams).success(function (successData) {
                            $rootScope.debugModeLog({'msg': 'AccountSettingsCtrl updateAllBusinessSettingDetails successData', 'data': successData});
                            
                            field.editing = false;
                            $scope.editing = false;
                            $scope.storedSettings = angular.copy($scope.settings);
                        }).error(function (errorData) {
                            updateAllBusinessSettingDetails();
                        });
                    }
                    
                    var loopThroughBusinessSettings = function () { 
                        for (var a = 0; a < $scope.settings.businessSettings.length; a++) {
                            var specificSettings = $scope.settings.businessSettings[a].specificSettings || [];
                            for (b = 0; b < specificSettings.length; b++) {
                                if (specificSettings[b].optionStyle == 'binary' || specificSettings[b].optionStyle == 'number') {
                                    $scope.updateParams[specificSettings[b].key] = specificSettings[b].val;
                                }
                                else if (specificSettings[b].optionStyle == 'multiple') {
                                    $scope.updateParams[specificSettings[b].key] = specificSettings[b].labels[specificSettings[b].val]._id;
                                }

                                if (a == $scope.settings.businessSettings.length - 1 && b == specificSettings.length - 1) {
                                    updateAllBusinessSettingDetails();
                                }
                            }
                        }
                    }

                    var loopThroughUpdateParamsArray = function () {
                        $scope.updateParams["_tonightsFeedButtonOptionId"] = 0;
                        for (var a = 0; a < updateParamsArray.length; a++) {
                            $scope.updateParams[updateParamsArray[a]] = 0;

                            if (a == updateParamsArray.length - 1) {
                                loopThroughBusinessSettings();
                            }
                        }
                    }

                    loopThroughUpdateParamsArray();
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
                        $scope.settings.businessSettings.push({
                            businessType: 'General',
                            specificSettings: [
                                { key: 'isAcceptingEnquiries'
                                , label: 'Accept Enquiries through the App'
                                , val: (data.isAcceptingEnquiries == '0') ? 0: 1
                                , optionStyle: 'binary'
                                , trueLabel: 'I want to accept enquiries through the app'
                                , falseLabel: 'I do not want to accept enquiries through the app'
                                , editing: false}
                            ]
                        });
                        
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
                                                , editing: false},
                                                { key: 'maxTableBookingGuests'
                                                , label: 'Max Number of Guests per Booking'
                                                , val: parseInt(data.maxTableBookingGuests)
                                                , optionStyle: 'number'
                                                , trueLabel: ''
                                                , falseLabel: ''
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
                                    case 'Taxi Firm':
                                        $scope.settings.businessSettings.push({
                                            businessType: 'Taxi Firm',
                                            specificSettings: [
                                                {key: 'isAcceptingTaxiBookings'
                                                , label: 'Accept Taxi Bookings'
                                                , val: (data.isAcceptingTaxiBookings == '0') ? 0: 1
                                                , optionStyle: 'binary'
                                                , trueLabel: 'My business accepts Taxi Bookings through the app'
                                                , falseLabel: 'My business does not accept Taxi Bookings through the app'
                                                , editing: false}
                                            ]
                                        });
                                        break;
                                }
                                
                                if (a == $rootScope.user.listingTypes.length - 1) {
                                    $scope.storedSettings = angular.copy($scope.settings);
                                }
                            }
                        }
                            
                        $scope.getAllTonightsFeedOptionsForBusiness = function () {
                            Profile.getAllTonightsFeedOptionsForBusiness($rootScope.user._id).success(function (successData) {
                                $rootScope.debugModeLog({'msg': 'AccountSettingsCtrl getAllTonightsFeedOptionsForBusiness successData', 'data': successData});
                                
                                var relVal = 0;
                                for (b = 0; b < successData.length; b++) {
                                    successData[b].index = b;
                                    if (successData[b]._id == data._tonightsFeedButtonOptionId) {
                                        relVal = b;
                                    }
                                    
                                    if (b == successData.length - 1) {
                                        for (a = 0; a < $scope.settings.businessSettings.length; a++) {
                                            if ($scope.settings.businessSettings[a].businessType == 'General') {
                                                $scope.settings.businessSettings[a].specificSettings.push({
                                                    key: '_tonightsFeedButtonOptionId'
                                                    , label: 'Call to action in the MyNyte feed'
                                                    , val: relVal
                                                    , optionStyle: 'multiple'
                                                    , labels: successData
                                                    , editing: false
                                                });
                                                completeFillingBusinessSettings();
                                            }
                                        }
                                    }
                                }
                            }).error(function (errorData) {
                                $scope.getAllTonightsFeedOptionsForBusiness();
                            });
                        }

                        if ($rootScope.user.listingTypes.indexOf('Taxi Firm') != -1 && $rootScope.user.listingTypes.length == 1) {
                            completeFillingBusinessSettings();
                        } else {
                            $scope.getAllTonightsFeedOptionsForBusiness();
                        }
                        
                    }
                    
                    var getAllBusinessSettingsForBusiness = function () {
                        Profile.getAllBusinessSettingsForBusiness($rootScope.user._id).success(function (successData) {
                            createBusinessSettings(successData[0]);
                        }).
                        error(function (errorMessage) {
                            getAllBusinessSettingsForBusiness();
                        })
                    }
                    getAllBusinessSettingsForBusiness();
                    
                    break;
                case 'Profile':
                    $scope.formIsValidating = false;
                    $scope.showDisplayNameNote = false;
                    $scope.showPasswordNote = false;
                    $scope.checkIfDisplayNameTaken = function (displayName) {
                        $rootScope.checkIfDisplayNameTaken(displayName, $scope);
                    }
                    
                    $scope.checkIfEmailTaken = function (email) {
                        if (email.length > 4 && email != $scope.originalEmail) {
                            $scope.formIsValidating = true;
                            Profile.checkIfEmailTaken(email).success(function (result) {
                                $scope.emailTaken = (parseInt(result["total"]) > 0) ? true: false;
                                $scope.formIsValidating = false;
                            }).error(function () {
                                $scope.checkIfEmailTaken(email);
                            });
                        }
                    }
                    
                    $scope.logOut = function () {
                        $rootScope.appLoading = true;
                        
                        if ($rootScope.userUpdateTimer != null) {
                            $timeout.cancel($rootScope.userUpdateTimer);
                            $rootScope.userUpdateTimer = null;
                        }
                        
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
                        
                        if (ionic.Platform.isAndroid() || ionic.Platform.isIOS() || ionic.Platform.isIPad()) {
                            removeOneSignalIdForLogOut();
                        }
                        
                        $rootScope.$broadcast('user-logged-in');
                        $rootScope.$broadcast('savestate');
                        $rootScope.user.userInteractionObject = oldInteractionObject;
                        $state.go('app.profile');
                        $ionicHistory.clearCache();
                        
                        setTimeout(function () {
                            $rootScope.appLoading = false;
                            $timeout(function() {
                                $ionicScrollDelegate.scrollTop();
                            }, 0);
                        }, 200);
                    }
                    
                    $scope.getAccountSettings = function () {
                        Profile.getAllProfileDetails($rootScope.user._profileId).success(function (successData) {
                            var wordString = "";
                            if (successData[0].wordLength != null) {
                                for (a = 0; a < successData[0].wordLength; a++) {
                                    wordString += "*";
                                }
                            }
                            
                            $scope.originalDisplayName = successData[0].displayName;
                            $scope.originalEmail = successData[0].email;
                            $scope.settings.displayName = {
                                value: successData[0].displayName, editing: false, name: 'displayName'};
                            $scope.settings.word = {
                                value: null, editing: false, name: 'word', displayValue: wordString};
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
                        }).
                        error(function (errorMessage) {
                            $scope.getAccountSettings();
                        })
                    }
                    
                    $scope.getAccountSettings();
                    
                    break;
            };
        
            var userBusinessTypeChangedFn = $rootScope.$on('user-business-type-changed', function () {
                getAllBusinessSettingsForBusiness();
            });
            
            $scope.$on('$destroy', function() {
                userBusinessTypeChangedFn();
            });
        };
        
        $rootScope.checkForAppInit($scope);
    }]);

    app.controller('AccountSettingsAdvancedCtrl', ['$rootScope', '$state', '$stateParams', '$scope', 'Profile', 'userService', 'datesService', '$ionicScrollDelegate', '$ionicPopup', 'ionicTimePicker', 'Categories', 'userService', 'TableBooking', function($rootScope, $state, $stateParams, $scope, Profile, userService, datesService, $ionicScrollDelegate, $ionicPopup, ionicTimePicker, Categories, userService, TableBooking) {
        //Variables & Constants
        $scope.settings = {};
        var storedSettings = {};
        $scope.rootScope = $rootScope;
        $scope.settingsType = $stateParams.settingsType;
        $scope.setting = $stateParams.setting;
        $scope.editing = false;
        $scope.pageLoading = true;

        $scope.$on('$ionicView.beforeEnter', function() {
            $rootScope.topRightButtonIsPlus = ($stateParams.setting == 'BlockedTableBookingIntervals') ? true: $rootScope.topRightButtonIsPlus;
            $rootScope.topRightButtonIsEdit = ($stateParams.setting == 'BlockedTableBookingIntervals') ? false: $rootScope.topRightButtonIsPlus;
        });
        
        $scope.pageLoad = function () {
            $scope.$on('$ionicView.enter', function() {

                $rootScope.topRightButtonFunction = function () {
                    if ($scope.editing) {
                        switch ($stateParams.setting) {
                            case 'OpeningTimes':
                                $scope.weekdayModel = $scope.storedWeekdayModel;
                            break;
                            case 'BusinessType':
                                $scope.appliedBusinessTypes = $scope.storedAppliedBusinessTypes;
                            break;
                        }
                    } else {
                        switch ($stateParams.setting) {
                            case 'OpeningTimes':
                                $scope.storedWeekdayModel = angular.copy($scope.weekdayModel);
                            break;
                            case 'BusinessType':
                                $scope.storedAppliedBusinessTypes = angular.copy($scope.appliedBusinessTypes);
                            break;
                        }
                    }
                    
                    if ($scope.editing) {
                        $ionicScrollDelegate.scrollTop();
                    }

                    if ($stateParams.setting == 'BlockedTableBookingIntervals') {
                        $state.go('app.addBusinessItem', {itemType: 'BlockedTableBookingIntervals'});
                        /*
                        $ionicPopup.show({
                            title: "Add a Blocked Table Booking Interval",
                            template: mainMessage,
                            scope: $scope,
                            buttons: [
                                { 
                                    text: 'Add',
                                    onTap: function(e) {
                                        var params = {_businessId: $rootScope.user._id, };
                                        TableBooking.createBlockedTableBookingInterval(params).
                                        $scope.editing = !$scope.editing;
                                        $rootScope.currentlyEditing = !$rootScope.currentlyEditing;
                                    } 
                                },
                                { 
                                    text: 'Close',
                                    onTap: function(e) {
                                      
                                    } 
                                }
                            ]
                        });
                        */
                    }
                    
                    $scope.editing = !$scope.editing;
                    $rootScope.currentlyEditing = !$rootScope.currentlyEditing;
                };
            })

            switch($stateParams.settingsType) {
                case 'Business':
                    switch($stateParams.setting) {
                        case 'OpeningTimes':
                            $scope.weekdayModel = [
                                {name:'Monday', opening: 'Closed', closing: 'Closed', index: 0},
                                {name:'Tuesday', opening: 'Closed', closing: 'Closed', index: 1},
                                {name:'Wednesday', opening: 'Closed', closing: 'Closed', index: 2},
                                {name:'Thursday', opening: 'Closed', closing: 'Closed', index: 3},
                                {name:'Friday', opening: 'Closed', closing: 'Closed', index: 4},
                                {name:'Saturday', opening: 'Closed', closing: 'Closed', index: 5},
                                {name:'Sunday', opening: 'Closed', closing: 'Closed', index: 6}
                            ];
                            
                            for (a = 0; a < $scope.weekdayModel.length; a++) {
                                $scope.weekdayModel[a].openingIpObj = {
                                    callback: function (val) {      //Mandatory
                                        var modelIndex = $scope.currentWeekdayIndexBeingEdited;
                                        var timeVal = new Date(val * 1000);
                                        var timeValHours = (timeVal.getUTCHours() < 10) ? '0' + timeVal.getUTCHours(): timeVal.getUTCHours();
                                        var timeValMinutes = (timeVal.getUTCMinutes() < 10) ? '0' + timeVal.getUTCMinutes(): timeVal.getUTCMinutes();
                                        
                                        $scope.weekdayModel[modelIndex].opening = timeValHours + ':' + timeValMinutes;
                                        $scope.formInvalid = ($scope.weekdayModel[modelIndex].closing == 'Closed') ? true: false;
                                        $scope.weekdayModel[modelIndex].openingIpObj.inputTime = (timeValMinutes < 30) ? val: val - 3600;
                                    },
                                    inputTime:64800,   //Optional
                                    format: 12,         //Optional
                                    step: 5,           //Optional
                                    setLabel: 'Select'    //Optional
                                }
                                $scope.weekdayModel[a].closingIpObj = {
                                    callback: function (val) {      //Mandatory
                                        var modelIndex = $scope.currentWeekdayIndexBeingEdited;
                                        var timeVal = new Date(val * 1000);
                                        var timeValHours = (timeVal.getUTCHours() < 10) ? '0' + timeVal.getUTCHours(): timeVal.getUTCHours();
                                        var timeValMinutes = (timeVal.getUTCMinutes() < 10) ? '0' + timeVal.getUTCMinutes(): timeVal.getUTCMinutes();
                                        
                                        $scope.weekdayModel[modelIndex].closing = timeValHours + ':' + timeValMinutes;
                                        $scope.formInvalid = ($scope.weekdayModel[modelIndex].opening == 'Closed') ? true: false;
                                        $scope.weekdayModel[modelIndex].closingIpObj.inputTime = (timeValMinutes < 30) ? val: val - 3600;
                                    },
                                    inputTime:64800,   //Optional
                                    format: 12,         //Optional
                                    step: 5,           //Optional
                                    setLabel: 'Select'    //Optional
                                }
                            };
                            
                            $scope.getBusinessOpeningTimesForBusiness = function () {
                                Profile.getBusinessOpeningTimesForBusiness($rootScope.user._id).success(function (successData) {
                                    $rootScope.debugModeLog({'msg': 'AccountSettingsAdvancedCtrl getBusinessOpeningTimesForBusiness successData', 'data': successData});
                                    for (a = 0; a < $scope.weekdayModel.length; a++) {
                                        for (b = 0; b < successData.length; b++) {
                                            if ($scope.weekdayModel[a].name == successData[b].name) {
                                                var openingTimeHours = successData[b].openingTime.substr(0, 2);
                                                var openingTimeMinutes = successData[b].openingTime.substr(3, 2);
                                                var openingEpochVal = (openingTimeMinutes*60)+(openingTimeHours*3600);
                                                
                                                var closingTimeHours = successData[b].closingTime.substr(0, 2);
                                                var closingTimeMinutes = successData[b].closingTime.substr(3, 2);
                                                var closingEpochVal = (closingTimeMinutes*60)+(closingTimeHours*3600);
                                                
                                                $scope.weekdayModel[a].opening = successData[b].openingTime.substr(0, 5);
                                                $scope.weekdayModel[a].openingIpObj.inputTime = (openingTimeMinutes < 30) ? openingEpochVal: openingEpochVal - 3600;
                                        
                                                $scope.weekdayModel[a].closing = successData[b].closingTime.substr(0, 5);
                                                $scope.weekdayModel[a].closingIpObj.inputTime = (closingTimeMinutes < 30) ? closingEpochVal: closingEpochVal - 3600;
                                            }
                                            if (a == $scope.weekdayModel.length - 1 && b == successData.length - 1) {
                                                $scope.pageLoading = false;
                                            }
                                        }
                                    }
                                }).error(function () {
                                    $scope.getBusinessOpeningTimesForBusiness();
                                });
                            }
                            
                            $scope.getBusinessOpeningTimesForBusiness();
                            
                            // User Action Functions
                            $scope.markWeekdayAsClosed = function(weekday){
                                weekday.opening = 'Closed';
                                weekday.closing = 'Closed';
                            };

                            $scope.openTimePicker = function(ipObj, index){
                                $scope.currentWeekdayIndexBeingEdited = index;
                                ionicTimePicker.openTimePicker(ipObj);
                            };
                            
                            $scope.applyChanges = function () {
                                Profile.updateOrInsertBusinessOpeningTimesForBusiness(
                                    $rootScope.user._id,
                                    ($scope.weekdayModel[0].opening == 'Closed') ? null: $scope.weekdayModel[0].opening,
                                    ($scope.weekdayModel[0].closing == 'Closed') ? null: $scope.weekdayModel[0].closing,
                                    ($scope.weekdayModel[1].opening == 'Closed') ? null: $scope.weekdayModel[1].opening,
                                    ($scope.weekdayModel[1].closing == 'Closed') ? null: $scope.weekdayModel[1].closing,
                                    ($scope.weekdayModel[2].opening == 'Closed') ? null: $scope.weekdayModel[2].opening,
                                    ($scope.weekdayModel[2].closing == 'Closed') ? null: $scope.weekdayModel[2].closing,
                                    ($scope.weekdayModel[3].opening == 'Closed') ? null: $scope.weekdayModel[3].opening,
                                    ($scope.weekdayModel[3].closing == 'Closed') ? null: $scope.weekdayModel[3].closing,
                                    ($scope.weekdayModel[4].opening == 'Closed') ? null: $scope.weekdayModel[4].opening,
                                    ($scope.weekdayModel[4].closing == 'Closed') ? null: $scope.weekdayModel[4].closing,
                                    ($scope.weekdayModel[5].opening == 'Closed') ? null: $scope.weekdayModel[5].opening,
                                    ($scope.weekdayModel[5].closing == 'Closed') ? null: $scope.weekdayModel[5].closing,
                                    ($scope.weekdayModel[6].opening == 'Closed') ? null: $scope.weekdayModel[6].opening,
                                    ($scope.weekdayModel[6].closing == 'Closed') ? null: $scope.weekdayModel[6].closing
                                ).success(function (successData) {
                                    $ionicScrollDelegate.scrollTop();
                                    $scope.editing = false;
                                    $rootScope.currentlyEditing = false;
                                }).error(function () {
                                    $scope.applyChanges();
                                });
                            };
                        break;
                        case 'BusinessType':
                            
                            /* Set up for Food Style and Business Type Categories */
                            $scope.currentBusinessTypeIndexToAdd = 0;
                            $scope.chosenBusinessTypeObjects = [{
                                index: $scope.currentBusinessTypeIndexToAdd,
                                _id: null, 
                                name: 'Select a Business Type',
                                showBusinessTypes: false}];
                            $scope.chosenBusinessTypeIds = [null];
                            
                            $scope.currentFoodStyleIndexToAdd = 0;
                            $scope.chosenFoodStyleObjects = [{
                                index: $scope.currentFoodStyleIndexToAdd,
                                _id: null, 
                                name: 'Select a Food Style',
                                showFoodStyles: false}];
                            $scope.chosenFoodStyleIds = [null];
                            
                            $scope.prepareAllAvailableAndAppliedFoodStyles = function () {
                                Categories.getAllFoodStyles().success(function (foodStyles) {
                                    $rootScope.debugModeLog({'msg': 'AccountSettingsAdvancedCtrl prepareAllAvailableAndAppliedFoodStyles successData', 'data': foodStyles});
                                    $scope.foodStyles = foodStyles;
                                    
                                    var getFoodStylesForBusiness = function () {
                                        Profile.getFoodStylesForBusiness($rootScope.user._id).success(function (successData) {
                                            $rootScope.debugModeLog({'msg': 'AccountSettingsAdvancedCtrl getFoodStylesForBusiness successData', 'data': successData});
                                            for (a = 0; a < successData.length; a++) {
                                                if (a == 0) {
                                                    $scope.chosenFoodStyleObjects[a].index = a;
                                                    $scope.chosenFoodStyleObjects[a]._id = successData[a]._id;
                                                    $scope.chosenFoodStyleObjects[a].name = successData[a].name;
                                                    $scope.chosenFoodStyleIds[a] = successData[a]._id;
                                                } else {
                                                    $scope.currentFoodStyleIndexToAdd += 1;
                                                    $scope.chosenFoodStyleObjects.push({
                                                        index: $scope.currentFoodStyleIndexToAdd,
                                                        _id: successData[a]._id,
                                                        name: successData[a].name,
                                                        showFoodStyles: false
                                                    });
                                                    $scope.chosenFoodStyleIds.push(successData[a]._id);
                                                }
                                                
                                                for (b = 0; b < $scope.foodStyles.length; b++) {
                                                    if ($scope.foodStyles[b].name == successData[a].name) {
                                                        $scope.foodStyles.splice(b, 1);
                                                    }
                                                }
                                            }
                                            $scope.appliedFoodStyles = successData;
                                        }).error(function () {
                                            getFoodStylesForBusiness();
                                        });
                                    }
                                    
                                    getFoodStylesForBusiness();
                                }).error(function () {
                                    $scope.prepareAllAvailableAndAppliedFoodStyles();
                                });
                            }
                            $scope.prepareAllAvailableAndAppliedFoodStyles();
            
                            $scope.getAvailableBusinessTypes = function () {
                                Categories.getAvailableBusinessTypes().success(function (successData) {
                                    $scope.businessTypes = [];
                                    for (z = 0; z < successData.length; z++) {
                                        if (successData[z].name != 'myNyte') {
                                            $scope.businessTypes.push(successData[z]);
                                        }
                                    }
                                    
                                    var getBusinessTypesForBusiness = function () {
                                        Profile.getBusinessTypesForBusiness($rootScope.user._id).success(function (successData) {
                                            $rootScope.debugModeLog({'msg': 'AccountSettingsAdvancedCtrl getBusinessTypesForBusiness successData', 'data': successData});
                                            
                                            for (a = 0; a < successData.length; a++) {
                                                if (a == 0) {
                                                    $scope.chosenBusinessTypeObjects[a].index = a;
                                                    $scope.chosenBusinessTypeObjects[a]._id = successData[a]._id;
                                                    $scope.chosenBusinessTypeObjects[a].name = successData[a].name;
                                                    $scope.chosenBusinessTypeIds[a] = successData[a]._id;
                                                } else {
                                                    $scope.currentBusinessTypeIndexToAdd += 1;
                                                    $scope.chosenBusinessTypeObjects.push({
                                                        index: $scope.currentBusinessTypeIndexToAdd,
                                                        _id: successData[a]._id,
                                                        name: successData[a].name,
                                                        showBusinessTypes: false
                                                    });
                                                    $scope.chosenBusinessTypeIds.push(successData[a]._id);
                                                }
                                                
                                                for (b = 0; b < $scope.businessTypes.length; b++) {
                                                    if ($scope.businessTypes[b].name == successData[a].name) {
                                                        $scope.businessTypes.splice(b, 1);
                                                    }
                                                }
                                            }
                                            $scope.appliedBusinessTypes = successData;
                                            $scope.pageLoading;
                                        }).error(function () {
                                            getBusinessTypesForBusiness();
                                        });
                                    }
                                    
                                    getBusinessTypesForBusiness();
                                }).error(function () {
                                    $scope.getAvailableBusinessTypes();
                                });
                            }
                            
                            $scope.getAvailableBusinessTypes();
                            
                            //User Based Functions
                            $scope.toggleBusinessType = function (businessType) {
                                $scope.currentBusinessTypeIndexBeingToggled = businessType.index;
                                
                                for (a = 0; a < $scope.chosenBusinessTypeObjects.length; a++) {
                                    if ($scope.chosenBusinessTypeObjects[a].index != businessType.index) {
                                        $scope.chosenBusinessTypeObjects[a].showBusinessTypes = false;
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
                            }
                            
                            /*Food Styles*/
                            $scope.toggleFoodStyle = function (foodStyle) {
                                $scope.currentFoodStyleIndexBeingToggled = foodStyle.index;
                                
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
                            }
                            
                            $scope.applyChanges = function () {
                                $rootScope.appLoading = true;
                                $scope.chosenFoodStyleIds = ($scope.chosenBusinessTypeIds.indexOf('4') == -1 && $scope.chosenBusinessTypeIds.indexOf('5') == -1) ? []: $scope.chosenFoodStyleIds;
                                
                                Profile.updateBusinessTypesForBusiness($rootScope.user._id, $scope.chosenBusinessTypeIds, $scope.chosenFoodStyleIds).success(function (successData) {
                                    $scope.appliedBusinessTypes = [];
                                    $scope.appliedFoodStyles = [];
                                    $rootScope.user.listingTypes = []
                                    $rootScope.user.listingTypes[0] = null;
                                    $rootScope.user.listingType1= null;
                                    $rootScope.user.listingType2 = null;
                                    $rootScope.user.listingType3 = null;
                                    
                                    for (a = 0; a < $scope.chosenBusinessTypeObjects.length; a++) {
                                        $scope.appliedBusinessTypes[a] = {};
                                        $scope.appliedBusinessTypes[a]._id = $scope.chosenBusinessTypeObjects[a]._id;
                                        $scope.appliedBusinessTypes[a].name = $scope.chosenBusinessTypeObjects[a].name;
                                        
                                        $rootScope.user.listingTypes[a] = $scope.chosenBusinessTypeObjects[a].name;
                                        if (a == 0) {
                                            $rootScope.user.listingType1 = $scope.chosenBusinessTypeObjects[a].name;
                                        } else if (a == 1) {
                                            $rootScope.user.listingType2 = $scope.chosenBusinessTypeObjects[a].name;
                                        } else {
                                            $rootScope.user.listingType3 = $scope.chosenBusinessTypeObjects[a].name;
                                        }
                                        
                                        if (a == $scope.chosenBusinessTypeObjects.length - 1) {
                                            for (b = 0; b < $scope.chosenFoodStyleObjects.length; b++) {
                                                
                                                $scope.appliedFoodStyles[b] = {};
                                                $scope.appliedFoodStyles[b]._id = $scope.chosenFoodStyleObjects[b]._id;
                                                $scope.appliedFoodStyles[b].name = $scope.chosenFoodStyleObjects[b].name;
                                        
                                                if (b == $scope.chosenFoodStyleIds.length - 1) {
                                                    userService.model.user = $rootScope.user;
                                                    $rootScope.$broadcast('savestate');
                                                    $rootScope.$broadcast('user-business-type-changed');
                                
                                                    $scope.editing = false;
                                                    $rootScope.currentlyEditing = false;
                                                    $rootScope.appLoading = false;
                                                }
                                            }
                                        }
                                    }
                                }).error(function () {
                                    $scope.applyChanges();
                                });
                            }
                        break;
                        case 'BlockedTableBookingIntervals':
                            $scope.getBlockedTableBookingIntervals = function () {
                                var params = {_businessId: $rootScope.user._id};
                                TableBooking.getBlockedTableBookingIntervals(params).success(function (successData) {
                                    $scope.blockedTableBookingIntervals = (successData != null) ? successData: [];
                                    for (a = 0; a < $scope.blockedTableBookingIntervals.length; a++) {
                                        $scope.blockedTableBookingIntervals[a].startDate = datesService.convertToReadableDate($scope, $scope.blockedTableBookingIntervals[a].startDateTime);
                                        $scope.blockedTableBookingIntervals[a].endDate = datesService.convertToReadableDate($scope, $scope.blockedTableBookingIntervals[a].endDateTime);
                                        $scope.blockedTableBookingIntervals[a].startTime = datesService.getShortenedTimeString($scope.blockedTableBookingIntervals[a].startDateTime);
                                        $scope.blockedTableBookingIntervals[a].endTime = datesService.getShortenedTimeString($scope.blockedTableBookingIntervals[a].endDateTime);
                                    }
                                }).error(function (errorData) {
                                    $scope.getBlockedTableBookingIntervals();
                                });
                            }

                            $scope.getBlockedTableBookingIntervals();

                            $scope.showIntervalDeleteOptions = function (interval) {
                                $ionicPopup.show({
                                    title: "Delete Interval",
                                    template: "<p>Are you sure you want to delete this Blocked Table Booking Interval? You won't be able to undo this action.</p>",
                                    scope: $scope,
                                    buttons: [
                                        { 
                                            text: 'Cancel',
                                            onTap: function(e) {
                                              
                                            } 
                                        },
                                        { 
                                            text: 'Delete',
                                            type: 'button-positive',
                                            onTap: function(e) {
                                                var params = {_intervalId: interval._id};
                                                TableBooking.deleteBlockedTableBookingInterval(params).success(function (successData) {
                                                    for (a = 0; a < $scope.blockedTableBookingIntervals.length; a++) {
                                                        if ($scope.blockedTableBookingIntervals[a]._id == interval._id) {
                                                            $scope.blockedTableBookingIntervals.splice(a, 1);
                                                        }
                                                    }
                                                }).error(function (errorData) {

                                                });
                                            } 
                                        }
                                    ]
                                });
                            }
                        break;
                        case 'AdvancedSettingsGeneral':
                        
                        break;
                    }
                break;
                case 'Profile':
                    switch($stateParams.setting) {
                        case 'AdvancedSettingsGeneral':
                        
                        break;
                    }
                break;
            }
        }
        
        $rootScope.checkForAppInit($scope);
    }])

    app.controller('ContactMyNyteCtrl', ['$ionicHistory', '$rootScope', '$state','$scope', 'Profile', '$ionicPopup', function($ionicHistory, $rootScope, $state, $scope, Profile, $ionicPopup) {
        // Set Up Variables
        $scope.rootScope = $rootScope;
        
        $scope.pageLoad = function () {
            //Prepare Page Load Data
            $scope.form = {'subject':'', 'message': ''};
            $scope.submitContactForm = function () {
            
                var params = {
                    '_profileId': $rootScope.user._profileId,
                    'subject': $scope.form.subject,
                    'message': $scope.form.message
                };
                Profile.contactMyNyteTeam(params).success(function (successData) {
                
                    var mainTitle = (successData == '"MyNyte Contact Success"') ? 'Message Sent': 'Message failed to send';
                    var mainMessage = (successData == '"MyNyte Contact Success"') ? '<p>Your message to the MyNyte Team has been sent.</p>': '<p>Your message to the MyNyte Team was not sent. Please try again shortly.</p>';
                    
                    $scope.form = (successData == '"MyNyte Contact Success"') ? {'subject': '', 'message': ''}: $scope.form;
                    
                    $ionicPopup.show({
                        title: mainTitle,
                        template: mainMessage,
                        scope: $scope,
                        buttons: [
                            { 
                                text: 'Close',
                                onTap: function(e) {
                                  
                                } 
                            }
                        ]
                    });
                }).error(function (errorData) {
                    $scope.submitContactForm();
                });
            }
        }
        
        $rootScope.checkForAppInit($scope);
    }]);

    app.controller('ArticlesCtrl', ['$ionicHistory', '$rootScope', '$state', '$stateParams', '$scope', 'Profile', '$ionicPopup', function($ionicHistory, $rootScope, $state, $stateParams, $scope, Profile, $ionicPopup) {
        // Set Up Variables
        $scope.rootScope = $rootScope;
        
        $scope.pageLoad = function () {
            //Prepare Page Load Data
            $scope.articleType = $stateParams.articleType;
            $scope.categories = $stateParams.categories;
            $scope.subCategories = $stateParams.subCategories;

            // Replace this with real Articles / Blog system
            $rootScope.pageTitle = "Business Help Articles";
            $scope.pageTitle = $rootScope.pageTitle;

            $scope.businessArticles = {
                restaurant: {
                    title: "Managing Table Bookings",
                    icon: "ion-fork",
                    articles: [
                        {
                            show: false,
                            title: "How to Check Table Bookings that have been Requested",
                            text: "<ul><li>When you’re logged in, go to the ‘MyNyte’ page.</li><li>In your Business Tools section, click ‘Requested Table Bookings’.</li></ul>"
                        },
                        {
                            show: false,
                            title: "How to Respond to Table Bookings that have been Requested",
                            text: "<ul><li>When you’re in the ‘Requested Table Bookings’ page, click on one of the Table Bookings in the option list.</li><li>Once you’re in the Table Booking page, you can see all the details of the booking, and you can go to the bottom to press either ‘Accept Booking’, ‘Reject Booking’ or ‘Reject Booking but suggest a different time’</li><li>If you press ‘Reject Booking but suggest a different time’, then a pop-up will come up and you should enter the time for your suggested booking time, and press set.</li></ul>"
                        },
                        {
                            show: false,
                            title: "How to Check the Current Table Bookings that you've Accepted",
                            text: "<ul><li>When you’re logged in, go to the ‘MyNyte’ page.</li><li>In your Business Tools section, click ‘Current Table Bookings’.</li><li>To see full details of a Table Booking, just click on it in the list, and here you can also ‘Cancel’ the Table Booking if you wish to.</li></ul>"
                        }
                    ]
                },
                nightclub: {
                    title: "Managing Events / Entry Booking",
                    icon: "ion-clipboard",
                    articles: [
                        {
                            show: false,
                            title: "How to Create a New Event",
                            text: "<ul><li>When you’re logged in, go to the ‘MyNyte’ page.</li><li>Under your ‘Business Tools’ section, click ‘My Current Events’.</li><li>In this page, click the ‘+ Add’ button (or the ‘+’ button if you are on a mobile device).</li><li>Fill in the details of your event into the form, and then press ‘Add Event’ at the bottom.</li></ul>"
                        }
                    ]

                },
                taxi: {
                    title: "Managing Taxi Bookings",
                    icon: "ion-android-car",
                    articles: [
                        {
                            show: false,
                            title: "How to Check Taxi Bookings that have been Requested",
                            text: "<ul><li>When you’re logged in, go to the ‘MyNyte’ page.</li><li>In your Business Tools section, click ‘Requested Taxi Bookings’.</li></ul>"
                        },
                        {
                            show: false,
                            title: "How to Respond to Taxi Bookings that have been Requested",
                            text: "<ul><li>When you’re in the ‘Requested Taxi Bookings’ page, click on one of the Taxi Bookings in the option list.</li><li>Once you’re in the Taxi Booking page, you can see all the details of the booking, and you can go to the bottom to enter an amount for your 'Lowest Price' and 'Quickest Time', and then press 'Respond'.</li><li>After you've responded to the Booking Request, you will be notified in the app by MyNyte after a few minutes about whether or not you've won the job.</li></ul>"
                        },
                        {
                            show: false,
                            title: "How to Check the Current Taxi Bookings that you've Won",
                            text: "<ul><li>When you’re logged in, go to the ‘MyNyte’ page.</li><li>In your Business Tools section, click ‘Current Taxi Bookings’.</li><li>To see full details of a Taxi Booking, just click on it in the list, and here you can also ‘Cancel’ the Taxi Booking if you wish to.</li></ul>"
                        }
                    ]

                }
            };

            $scope.articleCategories = [
                {   
                    title: "General",
                    articles: [
                        {
                            show: false,
                            title: "How to Log into your Account",
                            text: "<ul><li>Go to the ‘MyNyte’ page (left side of the page menu).</li><li>In the boxes, type in your e-mail address and password and press enter.</li></ul>"
                        },
                        {
                            show: false,
                            title: "How to Check your Enquiries & Respond",
                            text: "<ul><li>When you’re logged in, go to the ‘MyNyte’ page.</li><li>Near the top, click on the Enquiries option. You will see a list of all your enquiries, and you can click them to see them, and respond like a normal messaging app.</li></ul>"
                        },
                        {
                            show: false,
                            title: "How to Create a New Offer",
                            text: "<ul><li>When you’re logged in, go to the ‘MyNyte’ page.</li><li>Under your ‘Business Tools’ section, click ‘My Current Offers’.</li><li>In this page, click the ‘+ Add’ button (or the ‘+’ button if you are on a mobile device).</li><li>Fill in the details of your offer into the form, and then press ‘Add Offer’ at the bottom.</li></ul>"
                        },
                        {
                            show: false,
                            title: "How to Change Business Settings",
                            text: "<ul><li>When you’re logged in, go to the ‘MyNyte’ page.</li></ul>"
                        },
                        {
                            show: false,
                            title: "How to Log out of your Account",
                            text: "<ul><li>When you’re logged in, go to the ‘MyNyte’ page.</li></ul>"
                        }
                    ]
                }
            ];

            if ($scope.categories != null) {
                $scope.categories = $scope.categories.split("&");
                for (var a = 0; a < $scope.categories.length; a++) {
                    if ($scope.businessArticles[$scope.categories[a]] != null && $scope.businessArticles[$scope.categories[a]]["articles"].length > 0 ) {
                        $scope.articleCategories.push($scope.businessArticles[$scope.categories[a]]);
                    }
                }
            }
        }
        
        $rootScope.checkForAppInit($scope);
    }]);

    app.controller('ArticleCtrl', ['$ionicHistory', '$rootScope', '$state', '$stateParams', '$scope', 'Profile', '$ionicPopup', function($ionicHistory, $rootScope, $state, $stateParams, $scope, Profile, $ionicPopup) {
        // Set Up Variables
        $scope.rootScope = $rootScope;
        
        $scope.pageLoad = function () {
            //Prepare Page Load Data
            $scope.articleType = $stateParams.articleType;
            $scope.articleId = $stateParams.articleId;
            
        }
        
        $rootScope.checkForAppInit($scope);
    }]);
