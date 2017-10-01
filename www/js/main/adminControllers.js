// Admin //
app.controller('AdminCtrl', ['$rootScope', '$state', '$scope', '$ionicViewSwitcher', '$ionicConfig', '$ionicPopup', '$ionicScrollDelegate', 'Admin', function($rootScope, $state, $scope, $ionicViewSwitcher, $ionicConfig, $ionicPopup, $ionicScrollDelegate, Admin) {
	// Set Up Variables & Constants
    $scope.rootScope = $rootScope;
    $scope.$on('$ionicView.beforeEnter', function () {
        $rootScope.pageTitle = ($scope.pageTitle) ? $scope.pageTitle: $rootScope.pageTitle;
        $rootScope.hideSearch = true;
        $rootScope.showBackButton = false;
        $rootScope.showPlusButton = false;
    });
    
    $scope.$on('$ionicView.enter', function () {
        $rootScope.pageTitle = ($scope.pageTitle) ? $scope.pageTitle: $rootScope.pageTitle;
    });
    
    $scope.pageLoad = function () {
        console.log($rootScope.user.specialRole);
        $rootScope.pageTitle = $rootScope.user.displayName.split("-")[0] + "'s Main Control Panel";
        $scope.pageTitle = $rootScope.pageTitle;
        
        var params = {
            _profileId: $rootScope.user._profileId
        };
        Admin.getMyNyteItemCountForProfile(params).success(function (successData) {
            console.log(successData);
            var obj = JSON.parse(successData);
            obj = obj[0];
            
            $scope.pageObj = {
                outstandingTimeSheetCount: obj.outstandingTimeSheetCount,
                moviesToUpdateCount: obj.moviesToUpdateCount,
                unapprovedExpensesCount: obj.unapprovedExpensesCount,
                rejectedExpensesCount: obj.rejectedExpensesCount
            };
            
            $rootScope.outstandingMyNyteItemObj = $scope.pageObj;
            
        }).error(function (errorData) {
        
        });
    };
    
    $rootScope.checkForAppInit($scope);
}])

// Admin //
app.controller('MyNyteItemsCtrl', ['$rootScope', '$state', '$stateParams', '$scope', '$ionicViewSwitcher', '$ionicConfig', '$ionicPopup', '$ionicScrollDelegate', 'ionicDatePicker', 'ionicTimePicker', 'datesService', 'Admin', function($rootScope, $state, $stateParams, $scope, $ionicViewSwitcher, $ionicConfig, $ionicPopup, $ionicScrollDelegate, ionicDatePicker, ionicTimePicker, datesService, Admin) {
	// Set Up Variables & Constants
    $scope.rootScope = $rootScope;
    $scope.$on('$ionicView.beforeEnter', function () {
        $rootScope.pageTitle = ($scope.pageTitle) ? $scope.pageTitle: $rootScope.pageTitle;
        $rootScope.hideSearch = true;
        $rootScope.showBackButton = true;
        
        var addButtonArr = ['Expense Claim', 'External Contact'];
        var listViewArr = ['External Contact'];
        
        if (addButtonArr.indexOf($stateParams.itemType) > -1) {
            $rootScope.topRightButtonIsPlus = true;
            $rootScope.showPlusButton = true;
            
            $rootScope.topRightButtonFunction = function () {
                $state.go('app.myNyteItem', {'itemType': $stateParams.itemType, 'format': 'Create'});
            };
        }
        
        $scope.viewStyleClass = (listViewArr.indexOf($stateParams.itemType) == -1) ? "tile-view": "list-view";
    });
    
    $scope.$on('$ionicView.enter', function () {
        $rootScope.pageTitle = ($scope.pageTitle) ? $scope.pageTitle: $rootScope.pageTitle;
    });
    
    $scope.pageLoad = function () {
        var myNyteItemsParams;
        var itemTypeIconClassObj = {
            'Expense Claim': 'ion-cash',
            'Time Sheet': 'ion-ios-list-outline',
            'External Contact': 'ion-ios-bookmarks-outline',
            'MyNyte Account': 'ion-unlocked',
            'Useful Link': 'ion-link'
        };
        $scope.pageLoading = true;
        $rootScope.pageTitle = "Main Control Panel";
        $scope.pageTitle = $rootScope.pageTitle;
        $scope._parentId = $stateParams._parentId;
        $scope.itemType = $stateParams.itemType;
        $scope.itemTypeClass = $scope.itemType.replace(/ /g, "-").toLowerCase();
        $scope.itemTypeIconClass = itemTypeIconClassObj[$scope.itemType];
        console.log($scope.itemType);
        
        $scope.goToMyNyteItem = function (item) {
            if ($scope.itemType == 'Time Sheet' && $stateParams.extraFiltersString.indexOf('Outstanding') > -1) {
                $state.go('app.fillTimeSheet', {_profileId: $rootScope.user._profileId, relDate: item['Period Start Date_original']});
            }
            else if ($scope.itemType != 'MyNyte Account' && $scope.itemType != 'Useful Link') {
                $state.go('app.myNyteItem', {_parentId: $scope._parentId, itemType: $scope.itemType, _itemId: item['_id'], format: 'Read'});
            }
            else if ($scope.itemType == 'MyNyte Account') {
                window.open(item['Account Access URL']);
            }
            else if ($scope.itemType == 'Useful Link') {
                window.open(item['URL']);
            }
        }
        
        $scope.getMyNyteItems = function () {
            $scope.myNyteItems = [];
            $scope.myNyteItemsObj = {};
            
            myNyteItemsParams = {
                myNyteItemType: $stateParams.itemType,
                extraFiltersString: $stateParams.extraFiltersString
            };
            if ($stateParams._parentId != '' && $stateParams._parentId != '0') {
                myNyteItemsParams["_parentId"] = $stateParams._parentId;
            }
            else if ($stateParams._parentId == '') {
                myNyteItemsParams["_parentId"] = $rootScope.user._profileId;
            }
            Admin.getMyNyteItems(myNyteItemsParams).success(function (successData) {
                console.log(successData);
                if (successData != null && successData != 'null') {
                    successData = JSON.parse(successData);
                    for (var a = 0; a < successData.length; a++) {
                        if (!$scope.myNyteItemsObj[successData[a]["_id"]]) {
                            $scope.myNyteItemsObj[successData[a]["_id"]] = {};
                            $scope.myNyteItemsObj[successData[a]["_id"]]["_id"] = successData[a]["_id"];
                        };
                        
                        if (successData[a]["metaName"].indexOf('Date') > -1) {
                            $scope.myNyteItemsObj[successData[a]["_id"]][successData[a]["metaName"]+"_original"] = successData[a]["metaValue"];
                            
                            successData[a]["metaValue"] = datesService.convertToReadableDate($scope, successData[a]["metaValue"]);
                        }
                        
                        $scope.myNyteItemsObj[successData[a]["_id"]][successData[a]["metaName"]] = successData[a]["metaValue"];
                        
                        if (a == successData.length - 1) {
                            var len = Object.keys($scope.myNyteItemsObj);
                            var item;
                            for(i = 0; i < len.length; i++) {
                                var item = len[i];
                            
                                $scope.myNyteItems.push($scope.myNyteItemsObj[item]);
                                
                                if (i == len.length - 1) {
                                console.log($scope.myNyteItemsObj);
                                    console.log($scope.myNyteItems);
                                    $scope.pageLoading = false;
                                }
                            }
                        }
                    }
                }
            }).error(function (errorData) {
            
            });
        }
        
        $scope.getMyNyteItems();
        
        $rootScope.$on('updated-mynyte-item', function (event, args) {
            console.log(args, "happened");
            if (args.itemType == $scope.itemType) {
                $scope.getMyNyteItems();
            }
        });
    };
    
    $rootScope.checkForAppInit($scope);
}])

// Admin //
app.controller('MyNyteItemCtrl', ['$rootScope', '$state', '$stateParams', '$scope', '$ionicViewSwitcher', '$ionicConfig', '$ionicPopup', '$ionicScrollDelegate', 'ionicDatePicker', 'ionicTimePicker', 'datesService', 'Admin', function($rootScope, $state, $stateParams, $scope, $ionicViewSwitcher, $ionicConfig, $ionicPopup, $ionicScrollDelegate, ionicDatePicker, ionicTimePicker, datesService, Admin) {
	// Set Up Variables & Constants
    $scope.rootScope = $rootScope;
    $scope.$on('$ionicView.beforeEnter', function () {
        $rootScope.pageTitle = ($scope.pageTitle) ? $scope.pageTitle: $rootScope.pageTitle;
        $rootScope.hideSearch = true;
        $rootScope.showBackButton = true;
        $rootScope.showPlusButton = false;
        
        var editButtonArr = ['External Contact'];
        
        if (editButtonArr.indexOf($stateParams.itemType) > -1 && $stateParams.format == 'Read') {
            $rootScope.topRightButtonIsEdit = true;
            
            $rootScope.topRightButtonFunction = function () {
                if (!$scope.currentlyEditing) {
                    $scope.originalMyNyteItem = angular.copy($scope.myNyteItem);
                    $scope.format = 'EditUpdate';
                    $scope.currentlyEditing = true;
                    $rootScope.currentlyEditing = true;
                } else {
                    $scope.myNyteItem = $scope.originalMyNyteItem;
                    $scope.format = 'Read';
                    $scope.currentlyEditing = false;
                    $rootScope.currentlyEditing = false;
                }
            };
        }
    });
    
    $scope.$on('$ionicView.enter', function () {
        $rootScope.pageTitle = ($scope.pageTitle) ? $scope.pageTitle: $rootScope.pageTitle;
    });
    
    $scope.pageLoad = function () {
        var myNyteItemParams;
        $rootScope.pageTitle = "Main Control Panel";
        $scope.pageTitle = $rootScope.pageTitle;
        $scope.pageLoading = true;
        $scope._itemId = $stateParams._itemId;
        $scope.itemType = $stateParams.itemType;
        $scope.format = $stateParams.format;
//        console.log($scope.itemType, $scope.format);
        $scope.myNyteItem = {};
        
        var finalPagePrep = function () {
            function createParamsFromLoopingProps (obj, joiner) {
                var params = {
                    'itemNameValueString': ''
                };
                var len = Object.keys(obj);
                var i = 0;
                
                for (var i = 0; i < len.length; i++) {
                    var prop = len[i];
                    
                    if (i > 0) {
                        params['itemNameValueString'] += ",";
                    }
                    
                    params['itemNameValueString'] += "[['"+prop+"'" + joiner + "'" + obj[prop] + "']]";
                    
                    if (i == len.length - 1) {
                        return params;
                    }
                }
            }
            
            function addMyNyteItem (params) {
                console.log(params);
                Admin.addMyNyteItem(params).success(function (successData) {
                    console.log(successData);
                    $rootScope.$broadcast('updated-mynyte-item', {itemType: $stateParams.itemType});
                    $rootScope.backButtonFunction();
                }).error(function (errorData) {
                
                });
            }
            
            function updateMyNyteItem (params) {
                Admin.updateMyNyteItem(params).success(function (successData) {
                    console.log(successData);
                    $rootScope.$broadcast('updated-mynyte-item', {itemType: $stateParams.itemType});
                    $rootScope.backButtonFunction();
                }).error(function (errorData) {
                
                });
            }
            
            
            if ($stateParams.itemType == 'Time Sheet') {
            
            }
            else if ($stateParams.itemType == 'External Contact') {
                if ($stateParams.format == 'Read') {
                    $scope.currentComment = {Text:''};
                    $scope.addComment = function () {
                        $ionicPopup.show({
                            title: 'Add a Comment',
                            template: '<textarea class="white nightlife-input nightlife-input-square" placeholder="Add Commment" ng-model="currentComment[\'Text\']"></textarea>',
                            //subTitle: 'Are you sure you want to Delete this item?',
                            scope: $scope,
                            buttons: [
                                { 
                                    text: 'Cancel',
                                    onTap: function() {
                                    } 
                                },
                                { 
                                    text: 'Add',
                                    onTap: function(e) {
                                    console.log(e);
                                        console.log($scope.currentComment);
                                        $scope.addMyNyteItem();
                                    } 
                                }
                            ]
                        });
                    }
                }
                $scope.updateMyNyteItem = function () {
                    var params = createParamsFromLoopingProps($scope.myNyteItem, ":");
                    
                    params['_myNyteItemId'] = $scope._itemId;
                    params['updateString'] = params['itemNameValueString'];
                    
                    updateMyNyteItem(params);
                }
                
                $scope.addMyNyteItem = function () {
                    var params = createParamsFromLoopingProps($scope.currentComment, ",");
                    
                    params['itemNameValueString'] += ",[['DateTime Created',NOW()]]";
                    params['itemNameValueString'] += ",[['_Creator Profile Id',"+ $rootScope.user._profileId +"]]";
                    params['itemNameValueString'] += ",[['Creator Name', '"+ $rootScope.user.name +"']]";
                    
                    params['_parentId'] = $stateParams._itemId;
                    params['itemName'] = 'External Contact Comment';
                    
                    Admin.addMyNyteItem(params).success(function(successData) {
                        console.log(successData);
                        $scope.myNyteItem['External Contact Comments'][0] = {
                            'Text': $scope.currentComment['Text'],
                            'DateTime Created': new Date(),
                            '_Creator Profile Id': $rootScope.user._profileId,
                            'Creator Name': $rootScope.user.name
                        };
                        $scope.currentComment = {Text: ''};
                    }).error(function (errorData) {
                    
                    });
                }
            }
            else if ($stateParams.itemType == 'Expense Claim') {
                $scope.dateInputHTML = "Date of Expense";
                $scope.ipObj = {
                  callback: function (val) {  //Mandatory
                    $scope.selectedDate = new Date(val);
                    $scope.dateInputHTML = datesService.convertToDate($scope, $scope.selectedDate);
                    $scope.ipObj.inputDate = new Date(val);
                    $scope.dateChosen = true;
                  },
                  disabledDates: [
                  ],
                  to: new Date(), //Optional
                  inputDate: new Date(),      //Optional
                  mondayFirst: true,          //Optional
                  disableWeekdays: [],       //Optional
                  closeOnSelect: true,       //Optional
                  templateType: 'popup'       //Optional
                };
                
                //User Response Functions
                $scope.openDatePicker = function () {
                    ionicDatePicker.openDatePicker($scope.ipObj);
                }
                
                $scope.addMyNyteItem = function () {
                    var params = createParamsFromLoopingProps($scope.myNyteItem, ",");
                    var dateString = datesService.convertToSQLDate($scope.selectedDate);
                    
                    params['itemNameValueString'] += ",[['Date Expense Incurred','" + dateString + "']]";
                    params['itemNameValueString'] += ",[['DateTime Created',NOW()]]";
                    params['itemNameValueString'] += ",[['Status','Pending Approval']]";
                    
                    params['_parentId'] = $rootScope.user._profileId;
                    params['itemName'] = 'Expense Claim';
                    
                    addMyNyteItem(params);
                }
            }
        }
        
        var getSubItemsForItem = function () {
            console.log($stateParams.itemType);
            if ($stateParams.itemType == 'Time Sheet') {
                var myNyteItemsParams = {
                    _parentId: $stateParams._itemId,
                    myNyteItemType: 'Time Sheet Entry'
                };
                
                $scope.myNyteItem["Period Start Date"] = datesService.convertToReadableDate($scope, $scope.myNyteItem["Period Start Date"]);
                
                $scope.myNyteItem["Time Sheet Entries"] = {};
                Admin.getMyNyteItems(myNyteItemsParams).success(function (successData) {
                    var entriesObj = {};
                    if (successData != null && successData != 'null') {
                        successData = JSON.parse(successData);
                    console.log(successData);
                        for (var b = 0; b < successData.length; b++) {
                        
                            if (!entriesObj[successData[b]["_id"]]) {
                                entriesObj[successData[b]["_id"]] = {};
                                entriesObj[successData[b]["_id"]]["_id"] = successData[b]["_id"];
                            };
                    
                            entriesObj[successData[b]["_id"]][successData[b]["metaName"]] = successData[b]["metaValue"];
                            
                            if (b == successData.length - 1) {
                                $scope.myNyteItem["Time Sheet Entries"] = entriesObj;
                                console.log($scope.myNyteItem);
                                finalPagePrep();
                                $scope.pageLoading = false;
                            }
                        }
                    }
                    else {
                        console.log($scope.myNyteItem);
                        finalPagePrep();
                        $scope.pageLoading = false;
                    }
                }).error(function (errorData) {
                
                });
            }
            else if ($stateParams.itemType == 'External Contact') {
                var myNyteItemsParams = {
                    _parentId: $stateParams._itemId,
                    myNyteItemType: 'External Contact Comment'
                };
                
                $scope.myNyteItem["External Contact Comments"] = {};
                Admin.getMyNyteItems(myNyteItemsParams).success(function (successData) {
                    var contactsObj = {};
                    if (successData != null && successData != 'null') {
                        successData = JSON.parse(successData);
                    console.log(successData);
                        for (var b = 0; b < successData.length; b++) {
                        
                            if (!contactsObj[successData[b]["_id"]]) {
                                contactsObj[successData[b]["_id"]] = {};
                                contactsObj[successData[b]["_id"]]["_id"] = successData[b]["_id"];
                            };
                    
                            contactsObj[successData[b]["_id"]][successData[b]["metaName"]] = successData[b]["metaValue"];
                            
                            if (b == successData.length - 1) {
                                $scope.myNyteItem["External Contact Comments"] = contactsObj;
                                console.log($scope.myNyteItem);
                                finalPagePrep();
                                $scope.pageLoading = false;
                            }
                        }
                    }
                    else {
                        console.log($scope.myNyteItem);
                        finalPagePrep();
                        $scope.pageLoading = false;
                    }
                }).error(function (errorData) {
                
                });
            }
            else {
                console.log($scope.myNyteItem);
                finalPagePrep();
                $scope.pageLoading = false;
            }
        }
        
        if ($scope.format == 'Read' || $scope.format == 'Update' || $scope.format == 'EditUpdate' || $scope.format == 'Delete') {
            myNyteItemParams = {
                _parentId: ($stateParams._parentId == '') ? $rootScope.user._profileId: $stateParams._parentId,
                _myNyteItemId: $stateParams._itemId
            };
            Admin.getMyNyteItem(myNyteItemParams).success(function (successData) {
                console.log(successData);
                if (successData != null && successData != 'null') {
                    successData = JSON.parse(successData);
                    for (var a = 0; a < successData.length; a++) {
                        $scope.myNyteItem[successData[a]["metaName"]] = successData[a]["metaValue"];
                        
                        if (a == successData.length - 1) {
                            getSubItemsForItem();
                        }
                    }
                }
            }).error(function (errorData) {
            
            });
        }
        else if ($scope.format == 'Create') {
            finalPagePrep();
        }
    };
    
    $rootScope.checkForAppInit($scope);
}])

app.controller('MovieMaintenanceCtrl', ['$rootScope', '$state', '$scope', '$stateParams', '$ionicViewSwitcher', '$ionicConfig', '$ionicPopup', '$ionicScrollDelegate', 'Movies', function($rootScope, $state, $scope, $stateParams, $ionicViewSwitcher, $ionicConfig, $ionicPopup, $ionicScrollDelegate, Movies) {
	// Set Up Variables & Constants
    $scope.rootScope = $rootScope;
    $scope.pageLoading = true;
    console.log($ionicScrollDelegate);
    
    $scope.$on('$ionicView.beforeEnter', function () {
        $rootScope.pageTitle = ($scope.pageTitle) ? $scope.pageTitle: $rootScope.pageTitle;
        $rootScope.hideSearch = true;
        $rootScope.showBackButton = true;
        $rootScope.showPlusButton = false;
    });
    
    $scope.$on('$ionicView.enter', function () {
        $rootScope.pageTitle = ($scope.pageTitle) ? $scope.pageTitle: $rootScope.pageTitle;
    });
    
    $scope.pageLoad = function () {
        $rootScope.pageTitle = ($stateParams._movieId != null) ? "": "Movie Maintenance";
        
        if ($stateParams._movieId != null) {
            var params = {_movieId: $stateParams._movieId};
            var imgWidth;
            $scope._movieId = $stateParams._movieId;
            $scope.movieToUpdate = {};
            
            Movies.getMovieToUpdatePhotoPos(params).success(function (successData) {
                console.log(successData);
                if (successData != null) {
                    $rootScope.pageTitle = successData[0]["movieTitle"];
                    $scope.pageTitle = $rootScope.pageTitle;
                }
                else {
                    successData = [{}];
                }
                
                $scope.movieToUpdate = successData[0];
                
                $('#movie-poster').load(function(){
                    imgWidth = $(this).width();
                    $scope.sliderHeight = imgWidth * (2/3);
                    $scope.pageLoading = false;
                });
                
                $scope.selectMoviePosterPos = function () {
                    element = $('.movie-poster-slider')[0];
                    currentTop = $(element).css('transform');
                    currentTop = currentTop.split(", ");
                    currentTop = currentTop[currentTop.length - 1].replace(")", "");
                    console.log(currentTop);
                    currentTop = (640/($scope.sliderHeight+48)) * currentTop;
                    currentTop = (isNaN(currentTop)) ? 0: currentTop;
                    console.log(currentTop);
                    $scope.currentTop = currentTop;
                    
                    $ionicPopup.show({
                        template: '<span><img style="margin-top:'+(currentTop*-1)+'px;" src="https://www.cineworld.co.uk/'+$scope.movieToUpdate.posterUrl+'" /></span>',
                        //subTitle: 'Are you sure you want to Delete this item?',
                        scope: $scope,
                        cssClass: 'movie-cover-photo-pop',
                        buttons: [
                            { 
                                text: 'Cancel',
                                type: 'button-cancel',
                                onTap: function() {
                                } 
                            },
                            { 
                                text: 'Up',
                                onTap: function(e) {
                                    e.preventDefault();
                                    $scope.currentTop += 2;
                                    $(".popup-body img").css("margin-top", ($scope.currentTop*-1)+"px");
                                    console.log($scope.currentTop);
                                } 
                            },
                            { 
                                text: 'Down',
                                onTap: function(e) {
                                    e.preventDefault();
                                    $scope.currentTop -= 2;
                                    $(".popup-body img").css("margin-top", ($scope.currentTop*-1)+"px");
                                } 
                            }
                            ,
                            { 
                                text: 'Submit',
                                type: 'button-submit',
                                onTap: function() {
                                    var params, element, currentTop;
                    
                                    params = {_movieId: $scope._movieId, posterTopPos: $scope.currentTop};
                                    Movies.applyMoviePosterPos(params).success(function (successData) {
                                        $rootScope.$broadcast('movie-photo-pos-added');
                                        $rootScope.backButtonFunction();
                                    }).error(function (errorData) {
                                    
                                    });
                                }
                            }
                        ]
                    });
                }
            }).error(function (errorData) {
            
            });
        }
        else {
            $scope.pageTitle = $rootScope.pageTitle;
            
            var params = {format: 'Cover Photo Pos Update'};
            $scope.getMoviesToUpdate = function () {
                $scope.moviesToUpdate = [];
                Movies.getMoviesToUpdate(params).success(function (successData) {
                    console.log(successData);
                    successData =  (successData != null) ? successData: [];
                    
                    for (var a = 0; a < successData.length; a++) {
                        if (successData[a]["_id"] != null) {
                            $scope.moviesToUpdate.push(successData[a]);
                            
                            if (a == successData.length - 1) {
                                $scope.pageLoading = false;
                            }
                        }
                    }
                }).error(function (errorData) {
                
                });
            }
            
            $scope.getMoviesToUpdate();
            
            $rootScope.$on('movie-photo-pos-added', function() {
                $scope.getMoviesToUpdate();
            });
        }
    };
    
    $rootScope.checkForAppInit($scope);
}])

app.controller('FillTimeSheetCtrl', ['$rootScope', '$state', '$stateParams', '$scope', '$ionicViewSwitcher', '$ionicConfig', '$ionicPopup', '$ionicScrollDelegate', 'Profile', 'Admin', 'datesService', function($rootScope, $state, $stateParams, $scope, $ionicViewSwitcher, $ionicConfig, $ionicPopup, $ionicScrollDelegate, Profile, Admin, datesService) {
	// Set Up Variables & Constants
    $scope.rootScope = $rootScope;
    $scope.$on('$ionicView.beforeEnter', function () {
        $rootScope.hideSearch = true;
        $rootScope.showBackButton = true;
        $rootScope.showPlusButton = false;
        $rootScope.adminView = true;
        $rootScope.pageTitle = ($scope.pageTitle) ? $scope.pageTitle: $rootScope.pageTitle;
    });
    
    $scope.pageLoad = function () {
        $rootScope.pageTitle = "Complete Timesheet"
        $scope.pageTitle = $rootScope.pageTitle;
        $scope.relDate = $stateParams.relDate;
        
        var params = {_profileId: $rootScope.user._profileId};
        if ($scope.relDate != null) {
            params['relDate'] = $scope.relDate;
        }
        Profile.getTimeSheetToFill(params).success(function (successData) {
            var now = new Date();
            var sunday = ($stateParams.relDate == null) ?
                lastSunday(now.getFullYear() + '/' + (now.getMonth()+1) + '/' + now.getDate())
                : new Date($stateParams.relDate);
            var currentDay = sunday;
            console.log(currentDay);
            successData = (successData != 'null') ? successData : [];
            
            $scope.timeSheetDaysEntered = [];
            $scope.timeSheetDays = [];
            $scope.timeSheetDaysObj = {
                Sunday: {
                    dayName: 'Sunday',
                    intervals: {
                        1: {
                            'Interval Name': 'Sunday 1',
                            'NotApplicable': false,
                            'Interval Description': null
                        },
                        2:  {
                            'Interval Name': 'Sunday 2',
                            'NotApplicable': false,
                            'Interval Description': null
                        },
                        3:  {
                            'Interval Name': 'Sunday 3',
                            'NotApplicable': false,
                            'Interval Description': null
                        },
                        4:  {
                            'Interval Name': 'Sunday 4',
                            'NotApplicable': false,
                            'Interval Description': null
                        }
                    }
                },
                Monday: {
                    dayName: 'Monday',
                    intervals: {
                        1: {
                            'Interval Name': 'Monday 1',
                            'NotApplicable': false,
                            'Interval Description': null
                        },
                        2:  {
                            'Interval Name': 'Monday 2',
                            'NotApplicable': false,
                            'Interval Description': null
                        },
                        3:  {
                            'Interval Name': 'Monday 3',
                            'NotApplicable': false,
                            'Interval Description': null
                        },
                        4:  {
                            'Interval Name': 'Monday 4',
                            'NotApplicable': false,
                            'Interval Description': null
                        }
                    }
                },
                Tuesday: {
                    dayName: 'Tuesday',
                    intervals: {
                        1: {
                            'Interval Name': 'Tuesday 1',
                            'NotApplicable': false,
                            'Interval Description': null
                        },
                        2:  {
                            'Interval Name': 'Tuesday 2',
                            'NotApplicable': false,
                            'Interval Description': null
                        },
                        3:  {
                            'Interval Name': 'Tuesday 3',
                            'NotApplicable': false,
                            'Interval Description': null
                        },
                        4:  {
                            'Interval Name': 'Tuesday 4',
                            'NotApplicable': false,
                            'Interval Description': null
                        }
                    }
                },
                Wednesday: {
                    dayName: 'Wednesday',
                    intervals: {
                        1: {
                            'Interval Name': 'Wednesday 1',
                            'NotApplicable': false,
                            'Interval Description': null
                        },
                        2:  {
                            'Interval Name': 'Wednesday 2',
                            'NotApplicable': false,
                            'Interval Description': null
                        },
                        3:  {
                            'Interval Name': 'Wednesday 3',
                            'NotApplicable': false,
                            'Interval Description': null
                        },
                        4:  {
                            'Interval Name': 'Wednesday 4',
                            'NotApplicable': false,
                            'Interval Description': null
                        }
                    }
                },
                Thursday: {
                    dayName: 'Thursday',
                    intervals: {
                        1: {
                            'Interval Name': 'Thursday 1',
                            'NotApplicable': false,
                            'Interval Description': null
                        },
                        2:  {
                            'Interval Name': 'Thursday 2',
                            'NotApplicable': false,
                            'Interval Description': null
                        },
                        3:  {
                            'Interval Name': 'Thursday 3',
                            'NotApplicable': false,
                            'Interval Description': null
                        },
                        4:  {
                            'Interval Name': 'Thursday 4',
                            'NotApplicable': false,
                            'Interval Description': null
                        }
                    }
                },
                Friday: {
                    dayName: 'Friday',
                    intervals: {
                        1: {
                            'Interval Name': 'Friday 1',
                            'NotApplicable': false,
                            'Interval Description': null
                        },
                        2:  {
                            'Interval Name': 'Friday 2',
                            'NotApplicable': false,
                            'Interval Description': null
                        },
                        3:  {
                            'Interval Name': 'Friday 3',
                            'NotApplicable': false,
                            'Interval Description': null
                        },
                        4:  {
                            'Interval Name': 'Friday 4',
                            'NotApplicable': false,
                            'Interval Description': null
                        }
                    }
                },
                Saturday: {
                    dayName: 'Saturday',
                    intervals: {
                        1: {
                            'Interval Name': 'Saturday 1',
                            'NotApplicable': false,
                            'Interval Description': null
                        },
                        2:  {
                            'Interval Name': 'Saturday 2',
                            'NotApplicable': false,
                            'Interval Description': null
                        },
                        3:  {
                            'Interval Name': 'Saturday 3',
                            'NotApplicable': false,
                            'Interval Description': null
                        },
                        4:  {
                            'Interval Name': 'Saturday 4',
                            'NotApplicable': false,
                            'Interval Description': null
                        }
                    }
                }
            };
            
            function lastSunday(d) {
                var t = new Date(d);
                t.setDate(t.getDate() - t.getDay());
                return t;
            }
            function addDay(d) {
                var t;
                if ($stateParams.relDate) {
                    t = new Date($stateParams.relDate);
                } else {
                    t = new Date();
                }
                t.setDate(d.getDate() + 1);
                return t;
            }
            
            $scope.submitTimeSheet = function (day) {
                var intArray = $scope.timeSheetDaysObj[day]["intervalArray"];
                
                $rootScope.appLoading = true;
                
                for (var a = 0; a < intArray.length; a++) {
                    if (!intArray[a]["NotApplicable"] && intArray[a]["Interval Description Unsaved"] == null && intArray[a]["Interval Description"] == null) {
                        $rootScope.appLoading = false;
                        $ionicPopup.show({
                            title: 'Not all Intervals are complete.',
                            template: '<p>You have not completed the details of all the intervals for this day. For each interval, please fill in the description or mark the interval as "Not Applicable".</p>',
                            //subTitle: 'Are you sure you want to Delete this item?',
                            scope: $scope,
                            buttons: [
                                { 
                                    text: 'Close',
                                    onTap: function() {
                                    } 
                                }
                            ]
                        });
                        return false;
                    }
                    else if (!intArray[a]["NotApplicable"]) {
                        intArray[a]["Interval Description"] = intArray[a]["Interval Description Unsaved"];
                    }
                    
                    if (a == intArray.length - 1) {
                        for (var b = 0; b < intArray.length; b++) {
                            var nameValStr = "[['DateTime Created', NOW()]],[['Interval Name', '" + intArray[b]["Interval Name"] + "']]";
                            var params = {
                                _parentId: $scope._timeSheetId,
                                itemName: "Time Sheet Entry"
                            };
                            nameValStr += (intArray[b].NotApplicable) ? ",[['Not Applicable', 'true']]": ",[['Interval Description', '" + intArray[b]["Interval Description"] + "']]";
                            params["itemNameValueString"] = nameValStr;
                            
                            Admin.addMyNyteItem(params).success(function (successData) {
                                $scope.timeSheetDaysEntered.push(day);
                                $rootScope.appLoading = false;
                            }).error(function(errorData) {
                                $rootScope.appLoading = false;
                            });
                        }
                        console.log($scope.timeSheetDaysObj[day]);
                    }
                }
            }
            
            var completeTimeSheetObjCompilation = function () {
                for (var day in $scope.timeSheetDaysObj) {
                    for (var a = 0; a < $scope.timeSheetDaysObj[day].intervalArray.length; a++) {
                        if ($scope.timeSheetDaysObj[day].intervalArray[a]['Interval Description'] == null && $scope.timeSheetDaysEntered.indexOf(day) > -1) {
                            $scope.timeSheetDaysObj[day].intervalArray[a]["NotApplicable"] = true;
                        }
                    }
                }
            }
            
            var compileTimeSheetObj = function () {
                for (var day in $scope.timeSheetDaysObj) {
                    $scope.timeSheetDaysObj[day].dayDateUnformatted = currentDay;
                    console.log(currentDay);
                    console.log(datesService.convertToDate($scope, currentDay));
                    $scope.timeSheetDaysObj[day].dayDate = datesService.convertToDate($scope, currentDay);
                    currentDay = addDay(currentDay);
                    
                    if (day == 'Saturday') {
                        console.log($scope.timeSheetDaysObj);
                        for (var day2 in $scope.timeSheetDaysObj) {
                            $scope.timeSheetDaysObj[day2].intervalArray = [];
                            for (var int in $scope.timeSheetDaysObj[day2].intervals) {
                                $scope.timeSheetDaysObj[day2].intervalArray.push($scope.timeSheetDaysObj[day2].intervals[int]);
                            }
                            $scope.timeSheetDays.push( $scope.timeSheetDaysObj[day2]);
                            
                            if (day2 == 'Saturday') {
                                completeTimeSheetObjCompilation();
                                console.log($scope.timeSheetDays);
                            }
                        }
                    }
                }
            }
            
            for (var a = 0; a < successData.length; a++) {
                if (successData[a].name == null || successData[a].name == 'null') {
                    $scope._timeSheetId = successData[a]._itemId;
                    console.log($scope._timeSheetId);
                }
                else {
                    var dayName = successData[a].name.split(" ")[0];
                    var dayNameInterval = successData[a].name.split(" ")[1];
                    
                    if ($scope.timeSheetDaysEntered.indexOf(dayName) == -1) {$scope.timeSheetDaysEntered.push(dayName);}
                    $scope.timeSheetDaysObj[dayName]["intervals"][dayNameInterval][successData[a]["metaName"]] = successData[a]["metaValue"];
                }
                
                if (a == successData.length - 1) {
                    compileTimeSheetObj();
                }
            }
        }).error(function (errorData) {
        
        });
    };
    
    $rootScope.checkForAppInit($scope);
}])

app.controller('ContactsCtrl', ['$rootScope', '$state', '$scope', '$ionicViewSwitcher', '$ionicConfig', '$ionicPopup', '$ionicScrollDelegate', 'Profile', 'datesService', function($rootScope, $state, $scope, $ionicViewSwitcher, $ionicConfig, $ionicPopup, $ionicScrollDelegate, Profile, datesService) {
	// Set Up Variables & Constants
    $scope.rootScope = $rootScope;
    $scope.$on('$ionicView.beforeEnter', function () {
        $rootScope.hideSearch = true;
        $rootScope.showBackButton = true;
        $rootScope.showPlusButton = true;
        $rootScope.adminView = true;
        $rootScope.pageTitle = ($scope.pageTitle) ? $scope.pageTitle: $rootScope.pageTitle;
    });
    
    $scope.pageLoad = function () {
        $rootScope.pageTitle = "My Contacts";
        $scope.pageTitle = $rootScope.pageTitle;
    console.log($rootScope.user._profileId);
        var params = {'format': 'Own', '_profileId': $rootScope.user._profileId};
        Profile.getMyNyteExternalContacts(params).success(function (successData) {
            console.log(successData);
            successData = (successData != 'null') ? successData : [];
            $scope.contacts = [];
            $scope.contactsObj = {};
            
            var finalAddContactObjsToPage = function () {
                for (var prop in $scope.contactsObj) {
                    $scope.contactsObj[prop]["lastComment"]["Created Date"] = datesService.convertToReadableDate($scope, $scope.contactsObj[prop]["lastComment"]["Created DateTime"]);
                    $scope.contactsObj[prop]["lastComment"]["Created Time"] = $scope.contactsObj[prop]["lastComment"]["Created DateTime"].split(" ")[1].substr(0, 5);
                    $scope.contacts.push($scope.contactsObj[prop]);
                    console.log($scope.contacts);
                }
            }
            
            if (successData.length > 0) {
                for (var a = 0; a < successData.length; a++) {
                    if (successData[a]["_parentId"] == null && !$scope.contactsObj[successData[a]["_id"]]) {
                        $scope.contactsObj[successData[a]["_id"]] = {};
                        $scope.contactsObj[successData[a]["_id"]][successData[a]["metaName"]] = successData[a]["metaValue"];
                    }
                    else if (successData[a]["_parentId"] == null && $scope.contactsObj[successData[a]["_id"]]) {
                        console.log(successData[a]["metaName"]);
                        $scope.contactsObj[successData[a]["_id"]][successData[a]["metaName"]] = successData[a]["metaValue"];
                    }
                    else if (successData[a]["_parentId"] != null && !$scope.contactsObj[successData[a]["_parentId"]]) {
                        $scope.contactsObj[successData[a]["_parentId"]] = {};
                        $scope.contactsObj[successData[a]["_parentId"]]["lastComment"] = {};
                        $scope.contactsObj[successData[a]["_parentId"]]["lastComment"][successData[a]["metaName"]] = successData[a]["metaValue"];
                    }
                    else if (successData[a]["_parentId"] != null && $scope.contactsObj[successData[a]["_parentId"]] && !$scope.contactsObj[successData[a]["_parentId"]]["lastComment"]) {
                        $scope.contactsObj[successData[a]["_parentId"]]["lastComment"] = {};
                        $scope.contactsObj[successData[a]["_parentId"]]["lastComment"][successData[a]["metaName"]] = successData[a]["metaValue"];
                    }
                    else if (successData[a]["_parentId"] != null && $scope.contactsObj[successData[a]["_parentId"]] && $scope.contactsObj[successData[a]["_parentId"]]["lastComment"]) {
                        $scope.contactsObj[successData[a]["_parentId"]]["lastComment"][successData[a]["metaName"]] = successData[a]["metaValue"];
                    }
                    
                    if (a == successData.length - 1) {
                        console.log($scope.contactsObj);
                        finalAddContactObjsToPage();
                    }
                }
            }
            else {
                finalAddContactObjsToPage();
            }
        }).error(function (errorData) {
        
        });
    };
    
    $rootScope.checkForAppInit($scope);
}])

app.controller('MarketingEmailsCtrl', ['$rootScope', '$state', '$scope', '$ionicViewSwitcher', '$ionicConfig', '$ionicPopup', '$ionicScrollDelegate', 'Admin', '$window', function($rootScope, $state, $scope, $ionicViewSwitcher, $ionicConfig, $ionicPopup, $ionicScrollDelegate, Admin, $window) {
	// Set Up Variables & Constants
    $scope.rootScope = $rootScope;
    $scope.$on('$ionicView.beforeEnter', function () {
        $rootScope.hideSearch = true;
        $rootScope.showBackButton = true;
        $rootScope.pageTitle = ($scope.pageTitle) ? $scope.pageTitle: $rootScope.pageTitle;
    });
    
    $scope.pageLoad = function () {
        $rootScope.pageTitle = "Marketing Emails";
        $scope.pageTitle = $rootScope.pageTitle;
        
        Admin.scanFilesInDirectory('templates/email-views').success(function (successData) {
            console.log(successData);
            successData = JSON.parse(successData) || [];
            $scope.emailViews = [];
            for (var a = 0; a < successData.length; a++) {
                if (successData[a].match(/[a-z]/i)) {
                    // alphabet letters found
                    var viewArr = successData[a].replace(".html", "").replace(/-/g, " ").replace("mynyte", "MyNyte");
                    $scope.emailViews.push({'displayLabel': viewArr, 'filePath': successData[a]});
                }
                if (a == successData.length - 1) {
                    console.log($scope.emailViews);
                }
            }
        }).error(function (errorData) {
        
        });
    };
    
    $scope.newWindow = function (path) {
        $window.open(path, 'newWindow', 'width=600,height=900');
    };
    
    $rootScope.checkForAppInit($scope);
}])

app.controller('HelpDocumentationCtrl', ['$rootScope', '$state', '$stateParams', '$scope', '$ionicViewSwitcher', '$ionicConfig', '$ionicPopup', '$ionicScrollDelegate', 'Admin', '$window', function($rootScope, $state, $stateParams, $scope, $ionicViewSwitcher, $ionicConfig, $ionicPopup, $ionicScrollDelegate, Admin, $window) {
	// Set Up Variables & Constants
    $scope.rootScope = $rootScope;
    $scope.$on('$ionicView.beforeEnter', function () {
        $rootScope.hideSearch = true;
        $rootScope.showBackButton = true;
        $rootScope.pageTitle = ($scope.pageTitle) ? $scope.pageTitle: $rootScope.pageTitle;
    });
    
    $scope.pageLoad = function () {
        $rootScope.pageTitle = "Help Documentation";
        $scope.pageTitle = $rootScope.pageTitle;
        
        $scope.docType = $stateParams.docType;
        $scope.docTypeTopics = [
            {
                title: 'MyNyte Social',
                folderPath: 'mynyte-social'
            },
            {
                title: 'Product',
                folderPath: 'product'
            },
            {
                title: 'Resourcing',
                folderPath: 'resourcing'
            },
            {
                title: 'Sales',
                folderPath: 'sales'
            }
        ];
        
        if ($stateParams.docType != null) {
            for (var top in $scope.docTypeTopics) {
                if ($scope.docTypeTopics[top]["title"] == $stateParams.docType) {
                    Admin.scanFilesInDirectory('sneak-preview/docs/' + $scope.docTypeTopics[top]["folderPath"] + "/").success(function (successData) {
                        console.log(successData);
                        successData = JSON.parse(successData) || [];
                        $scope.docs = [];
                        for (var a = 0; a < successData.length; a++) {
                            if (successData[a].match(/[a-z]/i)) {
                                // alphabet letters found
                                $scope.docs.push({'title': successData[a], 'filePath': successData[a], 'fullFilePath': $rootScope.assetsFolderUrl + '/docs/resourcing/' + successData[a]});
                            }
                            if (a == successData.length - 1) {
                                console.log($scope.docs);
                            }
                        }
                    }).error(function (errorData) {
                    
                    });
                }
            }
        }
        else {
        
        }
    };
    
    $scope.newWindow = function (path) {
        $window.open(path, 'newWindow', 'width=600,height=900');
    };
    
    $rootScope.checkForAppInit($scope);
}])
