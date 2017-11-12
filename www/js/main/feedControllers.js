// NL Feed //
app.controller('NLFeedCtrl', ['$rootScope', '$ionicViewSwitcher', '$ionicScrollDelegate', '$ionicConfig', '$cordovaSocialSharing', '$state','$scope', 'Categories', 'Places', 'Events', 'NgMap', 'Profile', 'location', 'Offers', 'fileReader', 'userService', '$cordovaSQLite', '$cordovaFileTransfer', 'listingsService', 'categoriesService', '$timeout', function($rootScope, $ionicViewSwitcher, $ionicScrollDelegate, $ionicConfig, $cordovaSocialSharing, $state, $scope, Categories, Places, Events, NgMap, Profile, location, Offers, fileReader, userService, $cordovaSQLite, $cordovaFileTransfer, listingsService, categoriesService, $timeout) {
    //location.get(angular.noop, angular.noop);
    $scope.pageLoading = true;
    
    $scope.pageLoad = function () {
        $scope.rootScope = $rootScope;
        
        //Root Functions that Apply heavily to this page
        $rootScope.changeFeedHeader = function (newItem) {
            $rootScope.showNightLifeSearch = (newItem == 'closed') ? $rootScope.showNightLifeSearch: false;
            $scope.feedType = (newItem == 'closed') ? 'Main': newItem;
            $rootScope.appLoading = true;
            $scope.reloadingCentralContent = true;

            
            $scope.features = [];
            window.setTimeout(function () {
                $scope.getListingsFunction(newItem);
            }, 30);
            

            /*
            window.setTimeout(function () {
                $rootScope.feedHeaderItem = newItem;
                $rootScope.appLoading = false;
                $scope.reloadingCentralContent = false;
            }, 200);
            */
        }

        $rootScope.toggleNightLifeSearch = function () {
            $rootScope.showNightLifeSearch = !$rootScope.showNightLifeSearch;
            $rootScope.showNightFind2ndSelect = false;
            $rootScope.showTownSelect = false;
        }
        
        $rootScope.showTownSelectFunc = function () {
            $rootScope.showTownSelect = !$rootScope.showTownSelect;
            $rootScope.showNightFind2ndSelect = false;
        };
        
        $rootScope.showNightFind2ndSelectFunc = function () {
            $rootScope.showNightFind2ndSelect = !$rootScope.showNightFind2ndSelect;
            $rootScope.showTownSelect = false;
        }
        
        $rootScope.selectTown = function (town) {
            $rootScope.currentSearchTown = town;
            $rootScope.showTownSelect = !$rootScope.showTownSelect;
            for (a = 0; a < categoriesService.townCategories.length; a++) {
                categoriesService.townCategories[a].selected = (categoriesService.townCategories[a]._id == town._id) ? true: false;
            }
        };
        
        $rootScope.select2ndSelectCat = function (cat) {
            var currentName = $rootScope.currentSelectedListingTypeToFind;
            $ionicScrollDelegate.scrollTop();
            
            if (currentName == 'restaurant') {
                $rootScope.currentSearchRestaurantFoodCat = cat;
                for (a = 0; a < $rootScope.restaurantFoodCategories.length; a++) {
                    $rootScope.restaurantFoodCategories[a].active = ($rootScope.restaurantFoodCategories[a]._id == cat._id) ? true: false;
                    $rootScope.restaurantFoodCategories[a].selected = ($rootScope.restaurantFoodCategories[a]._id == cat._id) ? true: false;
                }
            }
            else if (currentName == 'takeaway') {
                $rootScope.currentSearchTakeawayFoodCat = cat;
                for (a = 0; a < $rootScope.takeawayFoodCategories.length; a++) {
                    $rootScope.takeawayFoodCategories[a].active = ($rootScope.takeawayFoodCategories[a]._id == cat._id) ? true: false;
                    $rootScope.takeawayFoodCategories[a].selected = ($rootScope.takeawayFoodCategories[a]._id == cat._id) ? true: false;
                }
            }
            else if (currentName == 'cinema') {
                $rootScope.currentSearchMovieCat = cat;
                for (a = 0; a < $rootScope.movieCategories.length; a++) {
                    $rootScope.movieCategories[a].active = ($rootScope.movieCategories[a]._id == cat._id) ? true: false;
                    $rootScope.movieCategories[a].selected = ($rootScope.movieCategories[a]._id == cat._id) ? true: false;
                }
            }
            else if (currentName == 'clubnight') {
                $rootScope.currentSearchMusic = cat;
                for (a = 0; a < categoriesService.musicCategories(Categories, $rootScope.currentSearchMusic.name).length; a++) {
                    categoriesService.musicCategories(Categories, $rootScope.currentSearchMusic.name)[a].active = (categoriesService.musicCategories(Categories, $rootScope.currentSearchMusic.name)[a]._id == cat._id) ? true: false;
                    categoriesService.musicCategories(Categories, $rootScope.currentSearchMusic.name)[a].selected = (categoriesService.musicCategories(Categories, $rootScope.currentSearchMusic.name)[a]._id == cat._id) ? true: false;
                }
            }
            else if (currentName == 'cluborbar') {
                $rootScope.currentSearchClubOrBarCat = cat;
                for (a = 0; a < $rootScope.clubOrBarCategories.length; a++) {
                    $rootScope.clubOrBarCategories[a].active = ($rootScope.clubOrBarCategories[a]._id == cat._id) ? true: false;
                    $rootScope.clubOrBarCategories[a].selected = ($rootScope.clubOrBarCategories[a]._id == cat._id) ? true: false;
                }
            }
            
            for (a = 0; a < $scope.nightFind2ndSelect.length; a++) {
                $rootScope.nightFind2ndSelect[a].active = ($rootScope.nightFind2ndSelect[a]._id == cat._id) ? true: false;
                $rootScope.nightFind2ndSelect[a].selected = ($rootScope.nightFind2ndSelect[a]._id == cat._id) ? true: false;
            }
            
            $rootScope.showNightFind2ndSelect = false;
        }
        
        $rootScope.selectMusic = function (music) {
            $rootScope.currentSearchMusic = music;
            $rootScope.showMusicSelect = !$rootScope.showMusicSelect;
            for (a = 0; a < $scope.musicCategories.length; a++) {
                categoriesService.musicCategories(Categories, $rootScope.currentSearchMusic.name)[a].selected = (categoriesService.musicCategories(Categories, $rootScope.currentSearchMusic.name)[a]._id == music._id) ? true: false;
            }
        };
        $rootScope.activateMusic = function (music) {
            $rootScope.currentSearchMusic = music;
            $rootScope.showMusicSelect = !$rootScope.showMusicSelect;
            for (a = 0; a < $scope.musicCategories.length; a++) {
                categoriesService.musicCategories(Categories, $rootScope.currentSearchMusic.name)[a].active = (categoriesService.musicCategories(Categories, $rootScope.currentSearchMusic.name)[a]._id == music._id) ? true: false;
                categoriesService.musicCategories(Categories, $rootScope.currentSearchMusic.name)[a].selected = (categoriesService.musicCategories(Categories, $rootScope.currentSearchMusic.name)[a]._id == music._id) ? true: false;
            }
        };
        

        // Set Up Variables Actual Scope variables
        
        
        $scope.isModalVisible = false;
        $scope.reloadingCentralContent = false;
        $scope.ionicScrollDelegate = $ionicScrollDelegate;
        $scope.feedType = 'Main';
        
        $scope.nightFindSlideLocked = false;
        
        $scope.getListingsFunction = function (newItem, stateToChange) {
            var completeListingsCompilation = function (successData) {
                if (successData != null) {
                    listingsService.sortThroughListingsResults($scope, successData, 0, 'features');
                } else {
                    $scope.features = [];
                }

                $rootScope.feedHeaderItem = newItem;
                $rootScope.appLoading = false;
                $scope.reloadingCentralContent = false;

                if (stateToChange == 'globalTownSelect') {
                    $rootScope.showGlobalTownSelect = false;
                }
            }
            
            Profile.getListingsForFeed($rootScope.currentSearchTown._id, $rootScope.user._profileId || 0, $scope.feedType).success(function (successData) {
                if (newItem != 'movies') {
                    completeListingsCompilation(successData);
                } else {
                    var moviesObj = {};
                    var movieTitlesObj = {};
                    
                    var insertMoviesObjIntoPageObj = function () {
                        var finalMoviesArray = [];
                        var len5 = Object.keys(moviesObj);
                        var movie2;
                        
                        for (movie2 = 0; movie2 < len5.length; movie2++) {
                            var movieItem = len5[movie2];
                            
                            var len6 = Object.keys(moviesObj[movieItem]["finalMovieShowing"]);
                            var showingType;
                            for (showingType = 0; showingType < len6.length; showingType++) {
                                var showingTypeItem = len6[showingType];
                                console.log("blsh");
                                moviesObj[movieItem]["finalMovieShowing"][showingTypeItem]["name"] = movieTitlesObj[movieItem]["title"];
                                moviesObj[movieItem]["finalMovieShowing"][showingTypeItem]["classification"] = movieTitlesObj[movieItem]["rating"];
                                moviesObj[movieItem]["finalMovieShowing"][showingTypeItem]["currentCoverPhotoName"] = "https://www.cineworld.co.uk" + movieTitlesObj[movieItem]["currentCoverPhotoName"];
                                moviesObj[movieItem]["finalMovieShowing"][showingTypeItem]["releaseYear"] = movieTitlesObj[movieItem]["releaseYear"];
                                moviesObj[movieItem]["finalMovieShowing"][showingTypeItem]["_tonightsFeedButtonOptionId"] = movieTitlesObj[movieItem]["_tonightsFeedButtonOptionId"];
                                moviesObj[movieItem]["finalMovieShowing"][showingTypeItem]["tonightsFeedButtonOption"] = movieTitlesObj[movieItem]["tonightsFeedButtonOption"];
                                moviesObj[movieItem]["finalMovieShowing"][showingTypeItem]["tonightsFeedButtonIconClass"] = movieTitlesObj[movieItem]["tonightsFeedButtonIconClass"];
                                moviesObj[movieItem]["finalMovieShowing"][showingTypeItem]["listingType"] = "Movie";
                                moviesObj[movieItem]["finalMovieShowing"][showingTypeItem]["listingType1"] = "Movie";
                                
                                moviesObj[movieItem]["finalMovieShowing"][showingTypeItem]["listingTypeCat1"] = movieTitlesObj[movieItem]["listingTypeCat1"];
                                moviesObj[movieItem]["finalMovieShowing"][showingTypeItem]["listingTypeCat2"] = movieTitlesObj[movieItem]["listingTypeCat2"];
                                moviesObj[movieItem]["finalMovieShowing"][showingTypeItem]["listingTypeCat3"] = movieTitlesObj[movieItem]["listingTypeCat3"];
                                moviesObj[movieItem]["finalMovieShowing"][showingTypeItem]["listingTypeCat4"] = movieTitlesObj[movieItem]["listingTypeCat4"];
                                
                                moviesObj[movieItem]["finalMovieShowing"][showingTypeItem]["relListingId"] = movieTitlesObj[movieItem]["relListingId"];
                                moviesObj[movieItem]["finalMovieShowing"][showingTypeItem]["isFeatured"] = movieTitlesObj[movieItem]["isFeatured"];
                                
                                
                                finalMoviesArray.push(moviesObj[movieItem]["finalMovieShowing"][showingTypeItem]);
                                
                                if (showingType == len6.length - 1 && movie2 == len5.length - 1) {
                                    console.log(finalMoviesArray);
                                    completeListingsCompilation(finalMoviesArray);
                                }
                            }
                        }
                    }
                    
                    var finalCreateShowingTimesArray = function () {
                        var len3 = Object.keys(moviesObj);
                        var mov;
                        for (mov = 0; mov < len3.length; mov++) {
                            var movie = len3[mov];
                            var len4 = Object.keys(moviesObj[movie]["finalMovieShowing"]);
                            var movieS;
                            for (movieS = 0; movieS < len4.length; movieS++) {
                                var movieShowing = len4[movieS];
                                var jsDatesLabelsArray = [];
                                moviesObj[movie]["finalMovieShowing"][movieShowing]["showingTimesArray"] = moviesObj[movie]["finalMovieShowing"][movieShowing]["showingTimesArray"] || [];
                                for (var y = 0; y < moviesObj[movie]["finalMovieShowing"][movieShowing]["Showing Dates Labels Array"].length; y++) {
                                    jsDatesLabelsArray.push(new Date(moviesObj[movie]["finalMovieShowing"][movieShowing]["Showing Dates Labels Array"][y].replace(/-/g, "/")));
                                    
                                    if (y == moviesObj[movie]["finalMovieShowing"][movieShowing]["Showing Dates Labels Array"].length - 1) {
                                        var date_sort_asc = function (date1, date2) {
                                          // This is a comparison function that will result in dates being sorted in ASC order
                                          if (date1 > date2) return 1;
                                          if (date1 < date2) return -1;
                                          return 0;
                                        };
                                        
                                        var jsDatesLabelsArraySorted = jsDatesLabelsArray.sort(date_sort_asc);
                                        
                                        for (var x = 0; x < jsDatesLabelsArraySorted.length; x++) {
                                            var monthConvertedBack = jsDatesLabelsArraySorted[x].getMonth() + 1;
                                            monthConvertedBack = (monthConvertedBack < 10) ? '0' + monthConvertedBack: monthConvertedBack;
                                            var dateConvertedBack = jsDatesLabelsArraySorted[x].getFullYear() + '-' + monthConvertedBack + '-' + jsDatesLabelsArraySorted[x].getDate();
                                            var timesArr = moviesObj[movie]["finalMovieShowing"][movieShowing][dateConvertedBack].split(" ");
                                            var newTimesArr = [];
                                            
                                            for (var timesI = 0; timesI < timesArr.length; timesI++) {
                                                var timeConv = timesArr[timesI].replace(":", "");
                                                if (parseInt(timeConv) > 1600) {
                                                    newTimesArr.push(timesArr[timesI]);
                                                }
                                                
                                                if (timesI == timesArr.length - 1) {
                                                    
                                                    if (newTimesArr.length > 7) {
                                                        newTimesArr = newTimesArr.slice(0, 7);
                                                    }
                                            
                                                    moviesObj[movie]["finalMovieShowing"][movieShowing]["showingTimesArray"].push({date: dateConvertedBack, times: newTimesArr});
                                            
                                                    if (x == jsDatesLabelsArraySorted.length - 1 && movieS == len4.length - 1 && mov == len3.length - 1) {
                                                        insertMoviesObjIntoPageObj();
                                                    }
                                                }
                                            }
                                            
                                        }
                                    }
                                }
                            }
                        }
                    }
                    
                    var finalLoopThroughMoviesToCombineShowingTimes = function () {
                        var len1 = Object.keys(moviesObj);
                        var mov;
                        for(mov = 0; mov < len1.length; mov++) {
                            var movie = len1[mov];
                            var len = Object.keys(moviesObj[movie]);
                            
                            moviesObj[movie]["finalMovieShowing"] = {};
                            
                            var loopMovieShowings = function (movieShowing, len) {
                                var movieShowingItem = len[movieShowing];
                                
                                if (movieShowingItem != 'finalMovieShowing') {
                                    var movieShowingType = moviesObj[movie][movieShowingItem]["Showing Type"];
                                    var movieShowingTypeJustAdded = false;
                                    moviesObj[movie][movieShowingItem]["Showing Dates Labels Array"] = moviesObj[movie][movieShowingItem]["Showing Dates Labels Array"] || [];
                                    
                                    if (!moviesObj[movie]["finalMovieShowing"][movieShowingType]) {
                                        moviesObj[movie]["finalMovieShowing"][movieShowingType] = moviesObj[movie][movieShowingItem];
                                        moviesObj[movie]["finalMovieShowing"][movieShowingType]["Showing Dates Labels Array"] = [];
                                        movieShowingTypeJustAdded = true;
                                        }
                                    
                                    var loopShowingTimes = function (z) {
                                        console.log(z, moviesObj);
                                        var thisShowingLabel = moviesObj[movie][movieShowingItem]["Showing Labels Array"][z];
                                        var thisShowingDate = moviesObj[movie][movieShowingItem][thisShowingLabel]["ShowingDate"];
                                        var thisShowingDateJSFormat = new Date(thisShowingDate.replace(/-/g, ", "));
                                        
                                        if (!moviesObj[movie][movieShowingItem][thisShowingDate]) {
                                            moviesObj[movie][movieShowingItem][thisShowingDate] = moviesObj[movie][movieShowingItem][thisShowingLabel]["ShowingTime"];
                                            moviesObj[movie][movieShowingItem]["Showing Dates Labels Array"].push(thisShowingDate);
                                        }
                                        else {
                                            moviesObj[movie][movieShowingItem][thisShowingDate] += moviesObj[movie][movieShowingItem][thisShowingLabel]["ShowingTime"];
                                        }
                                        
                                        if (!moviesObj[movie]["finalMovieShowing"][movieShowingType][thisShowingDate]) {
                                            moviesObj[movie]["finalMovieShowing"][movieShowingType][thisShowingDate] = moviesObj[movie][movieShowingItem][thisShowingLabel]["ShowingTime"];
                                        }
                                        else if(!movieShowingTypeJustAdded) {
                                            moviesObj[movie]["finalMovieShowing"][movieShowingType][thisShowingDate] += " " + moviesObj[movie][movieShowingItem][thisShowingLabel]["ShowingTime"];
                                            
                                            var makeShowingDateTimesSequential = function (currentString) {
                                                var string = "";
                                                var stringArr = currentString.split(" ");
                                                
                                                var time_sort_asc = function (time1, time2) {
                                                // This is a comparison function that will result in dates being sorted in
                                                    if (time1 > time2) return 1;
                                                    if (time1 < time2) return -1;
                                                    return 0;
                                                };
                                                
                                                var arrSorted = JSON.stringify(stringArr.sort(time_sort_asc));
                                                arrSorted = arrSorted.replace('[', '');
                                                arrSorted = arrSorted.replace(']', '');
                                                arrSorted = arrSorted.replace(/,/g, ' ');
                                                arrSorted = arrSorted.replace(/"/g, '');

                                                return arrSorted;
                                            }
                                            
                                            moviesObj[movie]["finalMovieShowing"][movieShowingType][thisShowingDate] = makeShowingDateTimesSequential(moviesObj[movie]["finalMovieShowing"][movieShowingType][thisShowingDate]);
                                        }
                                        
                                        if (moviesObj[movie]["finalMovieShowing"][movieShowingType]["Showing Dates Labels Array"].indexOf(thisShowingDate) == -1) {
                                            moviesObj[movie]["finalMovieShowing"][movieShowingType]["Showing Dates Labels Array"].push(thisShowingDate)
                                        };
                                            
                                        if (z == moviesObj[movie][movieShowingItem]["Showing Labels Array"].length - 1 && movieShowing == len.length - 1 && mov == len1.length - 1) {
                                            finalCreateShowingTimesArray();
                                        }
                                        else if (z == moviesObj[movie][movieShowingItem]["Showing Labels Array"].length - 1 && movieShowing < len.length - 1) {
                                            loopMovieShowings(movieShowing + 1, len);
                                        }
                                        else if (z < moviesObj[movie][movieShowingItem]["Showing Labels Array"].length - 1) {
                                            loopShowingTimes(z + 1);
                                        }
                                    }
                                    
                                    if (moviesObj[movie][movieShowingItem]["Showing Labels Array"]) {
                                        loopShowingTimes(0);
                                    }
                                    else if (movieShowing == len.length - 1 && mov == len1.length - 1) {
                                        finalCreateShowingTimesArray();
                                        }
                                    else if (movieShowing < len.length - 1) {
                                        loopMovieShowings(movieShowing + 1, len);
                                    }
                                }
                                else if (movieShowing < len.length - 1) {
                                    loopMovieShowings(movieShowing + 1)
                                }
                                else if (movieShowing == len.length - 1) {
                                    finalCreateShowingTimesArray();
                                }
                            }
                            
                            loopMovieShowings(0, len);
                        }
                    }
                    
                    var addMoviePropertiesToMovies = function () {
                        for (var b = 0; b < successData.length; b++) {
                            var len = Object.keys(moviesObj);
                            var movie;
                            
                            for(movie = 0; movie < len.length; movie++) {
                                var movieItem = len[movie];
                                if (moviesObj[movieItem][successData[b]._businessEntityItemId] && successData[b].metaName.indexOf('ShowingDate') == -1 && successData[b].metaName.indexOf('ShowingTime') == -1) {
                                    moviesObj[movieItem][successData[b]._businessEntityItemId][successData[b].metaName] = successData[b].metaValue;
                                }
                                else if (moviesObj[movieItem][successData[b]._businessEntityItemId] && (successData[b].metaName.indexOf('ShowingDate') > -1 || successData[b].metaName.indexOf('ShowingTime') > -1)) {
                                    moviesObj[movieItem][successData[b]._businessEntityItemId]["Showing Labels Array"] = moviesObj[movieItem][successData[b]._businessEntityItemId]["Showing Labels Array"] || [];
                                    var showingIndex = successData[b].metaName.substr(11, successData[b].metaName.length - 11);
                                    if (!moviesObj[movieItem][successData[b]._businessEntityItemId]['Showing'+showingIndex]) {
                                        moviesObj[movieItem][successData[b]._businessEntityItemId]['Showing'+showingIndex] = {};
                                        moviesObj[movieItem][successData[b]._businessEntityItemId]["Showing Labels Array"].push('Showing'+showingIndex);
                                    }
                                    moviesObj[movieItem][successData[b]._businessEntityItemId]['Showing'+showingIndex][successData[b].metaName.substr(0, 11)] = successData[b].metaValue;
                                }
                                
                                if (b == successData.length - 1 && movie == len.length - 1) {
                                    console.log("finalLoopThroughMoviesToCombineShowingTimes");
                                    finalLoopThroughMoviesToCombineShowingTimes();
                                }
                            }
                        }
                    }
                    for (var a = 0; a < successData.length; a++) {
                    
                                console.log("blsh");
                        if (successData[a].metaName == '_Movie Id' && !moviesObj[successData[a].metaValue]) {
                            console.log(successData[a]);
                            moviesObj[successData[a].metaValue] = {};
                            movieTitlesObj[successData[a].metaValue] = {
                                title: successData[a].movieTitle
                                ,rating: successData[a].rating
                                ,releaseYear: successData[a].releaseYear
                                ,currentCoverPhotoName: successData[a].currentCoverPhotoName
                                ,_tonightsFeedButtonOptionId: successData[a]._tonightsFeedButtonOptionId
                                ,tonightsFeedButtonOption: successData[a].tonightsFeedButtonOption
                                ,tonightsFeedButtonIconClass: successData[a].tonightsFeedButtonIconClass
                                ,listingType: successData[a].listingType
                                ,listingType1: successData[a].listingType1
                                ,listingTypeCat1: successData[a].listingTypeCat1
                                ,listingTypeCat2: successData[a].listingTypeCat2
                                ,listingTypeCat3: successData[a].listingTypeCat3
                                ,listingTypeCat4: successData[a].listingTypeCat4
                                ,relListingId: successData[a].relListingId
                                ,isFeatured: successData[a].isFeatured
                            };
                        }
                        
                        if (successData[a].metaName == '_Movie Id' && !moviesObj[successData[a].metaValue][successData[a]._businessEntityItemId]) {
                            moviesObj[successData[a].metaValue][successData[a]._businessEntityItemId] = {};
                        }
                        
                        if (a == successData.length - 1) {
                            addMoviePropertiesToMovies();
                        }
                    }
                    
                }
            }).error(function () {
                $scope.getListingsFunction(newItem, stateToChange);
            });
        }

        $scope.arrangeGlobalTownSelectFunction  = function (state) {
            if (state == 'feedSearch') {
                $rootScope.activateTown = function (town) {

                };
            }
            else if (state == 'feedHeader') {
                $rootScope.activateTown = function (town) {
                    $rootScope.appLoading = true;
                    $rootScope.currentSearchTown = town;
                    for (a = 0; a < categoriesService.townCategories.length; a++) {
                        categoriesService.townCategories[a].active = (categoriesService.townCategories[a]._id == town._id) ? true: false;
                        categoriesService.townCategories[a].selected = (categoriesService.townCategories[a]._id == town._id) ? true: false;
                    }
                    var newItem = ($scope.feedType == 'Main') ? 'closed': $scope.feedType;
                    $scope.getListingsFunction(newItem, 'globalTownSelect');
                };
            }
            $rootScope.showGlobalTownSelect = true;
        };
        
        $scope.findNight = function () {
                $state.go('app.feed.nlfeedListings', {'_townId': $rootScope.currentSearchTown._id, '_musicStyleId': $rootScope.currentSearchMusic._id});
            };
        //

        $scope.shareAnywhere = function() {
            $cordovaSocialSharing.share("This is your message", "This is your subject", "www/imagefile.png", "https://www.thepolyglotdeveloper.com");
        }
     
        $scope.shareViaTwitter = function(message, image, link) {
            $cordovaSocialSharing.canShareVia("twitter", message, image, link).then(function(result) {
                $cordovaSocialSharing.shareViaTwitter(message, image, link);
            }, function(error) {
                alert("Cannot share on Twitter");
            });
        }
        
        /*
        NgMap.getMap().then(function(map) {
        if ($rootScope.debugMode) {
            console.log(map.getCenter());
            console.log('markers', map.markers);
            console.log('shapes', map.shapes);
        }
      });
      */
        
        //Prepare Features
        $scope.getOriginalListings = function () {
            Profile.getListingsForFeed($rootScope.currentSearchTown._id, $rootScope.user._profileId || 0, $scope.feedType).success(function (successData) {
                if ($rootScope.debugMode) {console.log('getListingsforFeed in NlFeed results: ', successData);}
                for (a = 0; a < successData.length; a++) {
                    if (successData[a].listingType == 'Movie') {
                        successData[a].cinemas = [
                            {'name': "Aspects Cinema",
                            'showingTimes': [{'time': "6:30", 'active':false}, {'time': "7:30", 'active':false}, {'time': "8:30", 'active':false}]},
                            {'name': "Another Cinema",
                            'showingTimes': [{'time': "5:30", 'active':false}, {'time': "8:25", 'active':false}]}
                        ];
                    }
                }

                listingsService.sortThroughListingsResults($scope, successData, 0, 'features');
                if ($rootScope.debugMode) {console.log('Scope features: ', $scope.features);}

            }).error(function () {
                $scope.getOriginalListings();
            });
        }
        
        $rootScope.updateCurrentListingTypeToFindProxy = function (name, $event, eventType) {
            setTimeout(function () {$rootScope.updateCurrentListingTypeToFind(name, $event, eventType);}, 100);
        }
        
        //User Based Functions
        $rootScope.updateCurrentListingTypeToFind = function (name, $event, eventType) {
            //$scope.pageLoading = true;
            if (eventType == 'click') {
                //if ($($event.target).hasClass('index-1')) {return false};
            }
            
            $rootScope.currentSelectedListingTypeToFind = name;
            
            var incrementVal = 0;
            
            for (a = 0; a < $rootScope.nightFinderListingTypes.length; a++) {
                $rootScope.nightFinderListingTypes[a].displayIndex += incrementVal;
                $rootScope.nightFinderListingTypes[a].displayIndex = ($rootScope.nightFinderListingTypes[a].displayIndex == 4) ? -1: $rootScope.nightFinderListingTypes[a].displayIndex;
                $rootScope.nightFinderListingTypes[a].displayIndex = ($rootScope.nightFinderListingTypes[a].displayIndex == -2) ? 3: $rootScope.nightFinderListingTypes[a].displayIndex;
            }
            
            if (name == 'restaurant') {
                if ($rootScope.restaurantFoodCategories) {
                    $rootScope.nightFind2ndSelect = $rootScope.restaurantFoodCategories;
                    $scope.$apply();
                    $scope.pageLoading = false;
                } else {
                    var getAvailableFoodStyles = function () {
                        Categories.getAvailableFoodStyles($rootScope.currentSearchTown._id, 'Restaurant').success(function (foodStyles) {
                            foodStyles = (foodStyles == 'null' || foodStyles == null) ? []: foodStyles;
                            foodStyles.unshift($rootScope.currentSearchRestaurantFoodCat);
                            for (a = 0; a < foodStyles.length; a++) {
                                foodStyles[a].active = (foodStyles[a].name == $rootScope.currentSearchRestaurantFoodCat.name) ? true: false;
                                foodStyles[a].selected = (foodStyles[a].name == $rootScope.currentSearchRestaurantFoodCat.name) ? true : false;
                            }
                            $rootScope.restaurantFoodCategories = foodStyles;
                            $rootScope.nightFind2ndSelect = $rootScope.restaurantFoodCategories;
                            $scope.pageLoading = false;
                        }).error(function () {
                            getAvailableFoodStyles();
                        });
                    }
                    getAvailableFoodStyles();
                }
            }
            else if (name == 'takeaway') {
                if ($rootScope.takeawayFoodCategories) {
                    $rootScope.nightFind2ndSelect = $rootScope.takeawayFoodCategories;
                    $scope.$apply();
                    $scope.pageLoading = false;
                } else {
                    var getAvailableFoodStyles = function () {
                        Categories.getAvailableFoodStyles($rootScope.currentSearchTown._id, 'Takeaway').success(function (foodStyles) {
                            foodStyles = (foodStyles == 'null' || foodStyles == null) ? []: foodStyles;
                            foodStyles.unshift($rootScope.currentSearchTakeawayFoodCat);
                            for (a = 0; a < foodStyles.length; a++) {
                                foodStyles[a].active = (foodStyles[a].name == $rootScope.currentSearchTakeawayFoodCat.name) ? true: false;
                                foodStyles[a].selected = (foodStyles[a].name == $rootScope.currentSearchTakeawayFoodCat.name) ? true : false;
                            }
                            $rootScope.takeawayFoodCategories = foodStyles;
                            $rootScope.nightFind2ndSelect = $rootScope.takeawayFoodCategories;
                            $scope.pageLoading = false;
                        }).error(function () {
                            getAvailableFoodStyles();
                        });
                    }
                    getAvailableFoodStyles();
                }
            }
            else if (name == 'cinema') {
                if ($rootScope.movieCategories) {
                    $rootScope.nightFind2ndSelect = $rootScope.movieCategories;
                    $scope.$apply();
                    $scope.pageLoading = false;
                } else {
                    var getAvailableMovieStyles = function () {
                        Categories.getAvailableMovieStyles().success(function (movieStyles) {
                            movieStyles = (movieStyles == 'null' || movieStyles == null) ? []: movieStyles;
                            movieStyles.unshift($rootScope.currentSearchMovieCat);
                            for (a = 0; a < movieStyles.length; a++) {
                                movieStyles[a].active = (movieStyles[a].name == $rootScope.currentSearchMovieCat.name) ? true: false;
                                movieStyles[a].selected = (movieStyles[a].name == $rootScope.currentSearchMovieCat.name) ? true : false;
                            }
                            $rootScope.movieCategories = movieStyles;
                            $rootScope.nightFind2ndSelect = $rootScope.movieCategories;
                            $scope.pageLoading = false;
                        }).error(function () {
                            getAvailableMovieStyles();
                        });
                    }
                    getAvailableMovieStyles();
                }
            }
            else if (name == 'cluborbar') {
                if ($rootScope.clubOrBarCategories) {
                    $rootScope.nightFind2ndSelect = $rootScope.clubOrBarCategories;
                    $scope.$apply();
                    $scope.pageLoading = false;
                } else {
                    clubOrBarCategories = [
                        {name: 'Clubs', _id: 2},
                        {name: 'Bars', _id: 3}
                    ];
                    clubOrBarCategories.unshift($rootScope.currentSearchClubOrBarCat);
                    for (a = 0; a < clubOrBarCategories.length; a++) {
                        clubOrBarCategories[a].active = (clubOrBarCategories[a].name == $rootScope.currentSearchClubOrBarCat.name) ? true: false;
                        clubOrBarCategories[a].selected = (clubOrBarCategories[a].name == $rootScope.currentSearchClubOrBarCat.name) ? true : false;
                    }
                    $rootScope.clubOrBarCategories = clubOrBarCategories;
                    $rootScope.nightFind2ndSelect = $rootScope.clubOrBarCategories;
                    $scope.$apply();
                    $scope.pageLoading = false;
                }
            }
            else if (name == 'clubnight') {
                $rootScope.nightFind2ndSelect = categoriesService.musicCategories(Categories, $rootScope.currentSearchMusic.name);
                $scope.$apply();
                $scope.pageLoading = false;
            }
        }

        
        $scope.findNight = function () {
            var searchTypes = {
                clubnight: {searchName: 'searchEventsByMusic'},
                cinema: {searchName: 'searchMoviesByMovieStyle'},
                restaurant: {searchName: 'searchRestaurantsByFoodStyle'},
                takeaway: {searchName: 'searchTakeawaysByFoodStyle'},
                cluborbar: {searchName: 'searchClubsOrBars'}
            }
            var searchTypeName = searchTypes[$rootScope.currentSelectedListingTypeToFind]['searchName'];
            
            if ($rootScope.currentSelectedListingTypeToFind == 'cluborbar') {
                if ($rootScope.currentSearchClubOrBarCat.name == 'Bars') {
                    searchTypeName = 'searchBars';
                }
                else if ($rootScope.currentSearchClubOrBarCat.name == 'Clubs') {
                    searchTypeName = 'searchClubs';
                }
                else if ($rootScope.currentSearchClubOrBarCat.name == 'Bars & Clubs') {
                    searchTypeName = 'searchBarsAndClubs';
                }
            }
        
            $rootScope.user.userInteractionObject.searchesConducted.clubNightSearches = $rootScope.user.userInteractionObject.searchesConducted.clubNightSearches || [];
            $rootScope.user.userInteractionObject.searchesConducted.clubNightSearches.push({'_townId': $rootScope.currentSearchTown._id, '_musicStyleId': $rootScope.currentSearchMusic._id});
            $state.go('app.feed.nlfeedListings', {'searchType': searchTypeName});
        };
        
        $scope.postUpdateToFeed = function () {
            $rootScope.updateButtonDisabled = true;
            $rootScope.selectedUpdateBusiness = "";
            $rootScope.selectedUpdateFollower = "";
            $rootScope.chosenUpdateBusinesses = $rootScope.chosenUpdateBusinesses || [];
            $rootScope.possibleUpdateBusinesses = $rootScope.possibleUpdateBusinesses || [];
            $rootScope.chosenUpdateFollowers = $rootScope.chosenUpdateFollowers || [];
            $rootScope.possibleUpdateFollowers = $rootScope.possibleUpdateFollowers || [];
            $ionicScrollDelegate.getScrollView().options.scrollingY = !$ionicScrollDelegate.getScrollView().options.scrollingY;
            $rootScope.showUpdatePost = !$rootScope.showUpdatePost;
            $rootScope.showFeedUpdateScreenCover = !$rootScope.showFeedUpdateScreenCover;
        }

        $rootScope.goToLogin = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $rootScope.showUpdatePost = false;
            $rootScope.showFeedUpdateScreenCover = false;
            $ionicScrollDelegate.getScrollView().options.scrollingY = true;
            $state.go('app.profile');
        }

        $scope.prepareUpdateType = function (updateType) {
            var updateTypeNotes = {
                Night: {coverNote: 'Upload Photos of a night', buttonMsg: 'Post My Photos', i: 'ion-images'},
                Meal: {coverNote: 'Upload Photos of a meal', buttonMsg: 'Post My Photos', i: 'ion-images'},
                Approval: {coverNote: 'Give a business your approval', buttonMsg: 'Give your Seal of Approval', i:'ion-ribbon-b'},
                CheckIn: {coverNote: 'Checkin somewhere in town', buttonMsg: 'Check In', i:'ion-location'}
            }

            $rootScope.frontScreenCoverNote = updateTypeNotes[updateType].coverNote;
            $rootScope.showFrontScreenType = 'Update';
            $rootScope.updateMessage = updateTypeNotes[updateType].buttonMsg;
            $rootScope.updateIcon = updateTypeNotes[updateType].i;
            $rootScope.updateType = updateType;
            $rootScope.showFrontScreenCover = true;
            for (a = 0; a < categoriesService.userEngagementTypes.length; a++) {
                if (categoriesService.userEngagementTypes[a].name == $rootScope.updateType) {
                    $rootScope.updateTypeId = categoriesService.userEngagementTypes[a]._id;
                }
            }
        }

        $rootScope.closeUpdatePanel = function () {
            $rootScope.chosenUpdateBusinesses = [];
            $rootScope.possibleUpdateBusinesses = [];
            $rootScope.chosenUpdateFollowers = [];
            $rootScope.possibleUpdateFollowers = [];
            $rootScope.selectedUpdateFollower = "";
            $rootScope.selectedUpdateBusiness = "";
            $rootScope.updateButtonDisabled = true;
            $rootScope.showFrontScreenCover = false;
        }

        $rootScope.getAllBusinessesByName = function (searchString) {
            if (searchString == '') {
                $rootScope.possibleUpdateBusinesses = [];
                return false;
            }
            var businessType1 = '_', businessType2 = '_';
            if ($rootScope.updateType == 'Night') {
                businessType1 = 'Nightclub';
                businessType2 = 'Bar';
            } else if ($rootScope.updateType == 'Meal') {
                businessType1 = 'Restaurant';
                businessType2 = 'Takeaway';
            } 
            Profile.getAllBusinessesByName(searchString, businessType1, businessType2).success(function (successData) {
                $rootScope.possibleUpdateBusinesses = (searchString.length > 0) ? $rootScope.possibleUpdateBusinesses: [];
                $rootScope.possibleUpdateBusinesses = $rootScope.fillRecipientSearchResults(successData, $scope, $rootScope.chosenUpdateBusinesses);
            }).error(function () {
                $rootScope.getAllBusinessesByName(searchString);
            });
        }

        $rootScope.getAllFollowersByName = function (searchString) {
            if (searchString == '') {
                $rootScope.possibleUpdateFollowers = [];
                return false;
            }
            Profile.getAllFollowersByName(searchString, $rootScope.user._profileId || 0).success(function (successData) {
                $rootScope.possibleUpdateFollowers = $rootScope.fillRecipientSearchResults(successData, $scope, $scope.chosenUpdateFollowers);
            }).error(function () {
                $rootScope.getAllFollowersByName(searchString);
            });
        }

        $rootScope.addPossibleUpdateBusiness = function (business) {
            $rootScope.selectedUpdateBusiness = "";
            $rootScope.chosenUpdateBusinesses.push(business);
            $rootScope.possibleUpdateBusinesses = [];

            if ($scope.updateType == 'CheckIn' || $scope.updateType == 'Approval') {
                $rootScope.updateButtonDisabled = false;
            }
            else if ( $rootScope.files.length > 0 && 
                ($scope.updateType == 'Meal' || $scope.updateType == 'Night') ) {
                $rootScope.updateButtonDisabled = false;
            }
        }

        $rootScope.addPossibleUpdateFollower = function (follower) {
            $rootScope.selectedUpdateFollower = "";
            $rootScope.chosenUpdateFollowers.push(follower);
            $rootScope.possibleUpdateFollowers = [];
        }

        $rootScope.getFile = function (paramsObj) {
            $rootScope.progress = 0;
            $rootScope.imageSrcs = [];

            if (!ionic.Platform.isAndroid()) {
                for (a = 0; a < $rootScope.files.length; a++) {
                    fileReader.readAsDataUrl($rootScope.files[a], $rootScope)
                      .then(function(result) {
                          $rootScope.imageSrcs.push({'imageSrc': result});
                      });
                }
            }
            else {
                console.log($rootScope.file);
                var myImg = $rootScope.file;

                window.resolveLocalFileSystemURL(myImg, function(entry){
                    var fileName = entry.name;
                    entry.file(function(fileObject){
                        // Create a function to process the file once it's read
                        fileReader.onloadend = function(evt) {
                            var image = new Image()
                            image.onload = function(evt) {
                                // The image has been loaded and the data is ready
                                var image_width = this.width
                                var image_height = this.height
                                console.log("IMAGE HEIGHT: " + image_height)
                                console.log("IMAGE WIDTH: " + image_width)

                                image = null
                            }
                            // Load the read data into the image source. It's base64 data
                            image.src = evt.target.result
                        }

                        fileReader.readAsDataUrl(fileObject, $rootScope)
                          .then(function(result) {
                              $rootScope.imageSrcs.push({'imageSrc': result});
                              $rootScope.fileName = fileName;
                              console.log(paramsObj);
                              $timeout(paramsObj.onComplete({fileName: fileName}), 2000);
                          });
                    }, function(){
                        console.log("There was an error reading or processing this file.")
                    });
                    
                }, function(e){
                    console.log(e);
                });
            }
            if ($rootScope.files.length > 0) {
                $rootScope.updateButtonDisabled = false;
            }
        };

        $rootScope.imgUploadPrepare = function () {
            if (!ionic.Platform.isAndroid()) {
                document.getElementById('img-upload').click();
            }
            else {
                $rootScope.getAndroidImage({imgEntryType: 'cover_photo', onComplete: function () {}});
            }
        }
     
        $rootScope.$on("fileProgress", function(e, progress) {
            $rootScope.progress = progress.loaded / progress.total;
        });

        $rootScope.finishPostingUpdate = function (business) {
            if ($rootScope.debugMode) { console.log($rootScope.files);}
            //return false;
            if (!$rootScope.updateButtonDisabled) {
                $rootScope.appLoading = true;
                
                var url = "http://www.mynyte.co.uk/sneak-preview/data/functions/image-upload.php";
                
                for (a = 0; a < $rootScope.files.length; a++) {
                     // File name only
                     var filename = $rootScope.user._profileId + '_' + $rootScope.files[a].name;
                     //File for Upload
                     var targetPath = "http://www.mynyte.co.uk/sneak-preview/img/user_images/general_photo/" + filename;
                     var options = {
                          fileKey: "file",
                          fileName: filename,
                          chunkedMode: false,
                          mimeType: $rootScope.files[a].type,
                          params : {'directory':'upload', 'fileName':filename}
                      };
                      //var t = new FileTransfer();
                      if (!ionic.Platform.isWebView) {
                          $cordovaFileTransfer.upload(url, filename, options).then(function(result) {
                            // Success!
                          }, function(err) {
                            // Error
                          }, function (progress) {
                            // constant progress updates
                          });
                      } else {
                        if (a == 0) {
                            var formData = new FormData();
                            formData.append("targetUrl", targetPath);
                        }
                        formData.append("file"+(a+1), $rootScope.files[a]);
                        formData.append("fileName"+(a+1), filename);
                        
                        if (a == $rootScope.files.length - 1) {
                            $.ajax({
                              url: url,
                              type: "POST",
                              data: formData,
                              processData: false,  // tell jQuery not to process the data
                              contentType: false,   // tell jQuery not to set contentType
                              success: function (sucessData) {
                                if ($rootScope.debugMode) {console.log(sucessData);}
                              },
                              error: function (errorData) {
                                if ($rootScope.debugMode) {console.log(errorData);}
                              }
                            });
                        }
                      }
                 }
                Profile.createUserEngagement($rootScope.updateTypeId, $rootScope.user._profileId, $rootScope.chosenUpdateBusinesses[0].relListingId, $rootScope.chosenUpdateBusinesses[0].listingType, $rootScope.chosenUpdateFollowers, $rootScope.files).success(function (successData) {
                    if ($rootScope.debugMode) {console.log('Create User Engagement successData: ', successData);}
                    $rootScope.updateButtonDisabled = true;
                    $rootScope.possibleUpdateBusinesses = [];
                    $rootScope.chosenUpdateBusinesses = [];
                    $rootScope.showUpdatePost = false;
                    $rootScope.showFrontScreenCover = false;
                    $rootScope.showFeedUpdateScreenCover = false;
                    $rootScope.appLoading = false;
                }).error(function () {
                    $rootScope.finishPostingUpdate(business);
                });
            }
        }

        $scope.pinListingToMsg = function (listing, $event) {
            $rootScope.pinListingToMessage($event, listing, listing.listingType, null, $scope);
        }
        
        $scope.showShowingTimeButtons = function (feature, cinema, showingTime, $event) {
            $event.stopPropagation();
            $event.preventDefault();
            
            if (showingTime.active) {
                $scope.hideShowingTimeButtons(feature, $event);
                return false;
            }
            
            var scrollVal = $event.y;
            if (scrollVal < 100) {
                scrollVal = 100;
            } else if (scrollVal > 380) {
                scrollVal = -100;
            } else {
                scrollVal = 0;
            }
            
            $ionicScrollDelegate.scrollTo($ionicScrollDelegate.getScrollPosition().left, $ionicScrollDelegate.getScrollPosition().top - scrollVal, true);
            
            var relIndex = 0;
            for (a = 0; a < feature.cinemas.length; a++) {
                if (feature.cinemas[a] == cinema) {
                    relCinemaIndex = a;
                }
                feature.cinemas[a].active = (feature.cinemas[a] == cinema) ? true: false;
                
                for (b = 0; b < feature.cinemas[a].showingTimes.length; b++) {
                    feature.cinemas[a].showingTimes[b].active = (feature.cinemas[a].showingTimes[b] == showingTime) ? true : false;
                    relIndex = (feature.cinemas[a].showingTimes[b] == showingTime) ? b: relIndex;
                }
            }
            
            $scope.currentScrollTop = $ionicScrollDelegate.getScrollPosition().top;
            $scope.currentShowingTimePopUpTriangleXVal = relIndex * 90;
            $scope.currentShowingTimePopUpTopVal = (relCinemaIndex + 1) * 68;
            feature.showShowingTimeButtons = true;
            window.setTimeout(function () { $ionicScrollDelegate.getScrollView().options.scrollingY = false; }, 100);
        };
        $scope.hideShowingTimeButtons = function (feature, $event) {
            $event.stopPropagation();
            $event.preventDefault();
            if (!$scope.showShowingTimeButtons) {
                return false;
            }
            
            $ionicScrollDelegate.getScrollView().options.scrollingY = true;
            feature.showShowingTimeButtons = false;
            for (a = 0; a < feature.cinemas.length; a++) {
                feature.cinemas[a].active = false;
                for (b = 0; b < feature.cinemas[a].showingTimes.length; b++) {
                    feature.cinemas[a].showingTimes[b].active = false;
                }
            }
        };

        $scope.seeListingDetail = function (feature) {
            if (feature.listingType == 'Offer') {
                $state.go('app.offers');
                var timer = window.setTimeout(function () {
                    $state.go('app.offers.offerDetail', {'_id': feature.relListingId});
                }, 100);
            } else {
                $state.go('app.feed.nlfeedListing', {_listingId:feature.relListingId, listingType:feature.listingType});
            }
        }
        
        $scope.feedButtonPressed = function (feature, $event) {
            $event.preventDefault();
            $event.stopPropagation();
            
            switch(feature.tonightsFeedButtonOption) {
                case 'Book Table':
                    if (!$rootScope.userLoggedIn) {
                        $rootScope.showPopUp($scope, 'BookTable');
                        return false;
                    }
                break;
            };
            
            var listingId = (feature.listingType == 'Business') ? feature._profileId: feature.relListingId;
            $state.go('app.feed.nlfeedListing', {'_listingId': feature.relListingId, 'listingType':feature.listingType});
            
            switch(feature.tonightsFeedButtonOption) {
                case 'See Photos':
                    var listingType = (feature.listingType == 'Business') ? 'Profile': feature.listingType;
                    
                    var timer = window.setTimeout(function () {
                        $state.go('app.feedListing-photos', {_listingId: feature.relListingId, listingType: listingType, _id: listingId, listingName: feature.name});
                    }, 120);
                    break;
                case 'See Takeaway Menu':
                    var timer = window.setTimeout(function () {
                        $state.go('app.seeMenu', {'_listingId': feature.relListingId, 'listingType': listingType, 'listingName': feature.name, '_businessId': feature.relListingId, '_menuTypeId': 1});
                    }, 120);
                    break;
                case 'Book Table':
                    var timer = window.setTimeout(function () {
                        $state.go('app.bookTable', {'_listingId': feature.relListingId, 'listingType': listingType, '_id': listingId, 'listingName': feature.name});
                    }, 120);
                    break;
                case 'See A la Carte Menu':
                    var timer = window.setTimeout(function () {
                        $state.go('app.seeMenu', {'_listingId': feature.relListingId, 'listingType': listingType, 'listingName': feature.name, '_businessId': feature.relListingId, '_menuTypeId': 2});
                    }, 120);
                    break;
            };
        }

        $scope.getOriginalListings();
        $rootScope.$on('user-logged-in', function (event, args) {
            $scope.getOriginalListings();
        });
        
        /*
        setTimeout(function() {
            alert(window);
            alert(window.statusbar);
            console.log(window);
            console.log(window.statusbar);
            if (window.statusbar) {
                statusbar.styleLightContent();
            }
            else {
                $rootScope.headerHasStatusBar = false;
            }
        }, 5000); */
    }
    
    
    $rootScope.checkForAppInit($scope);
    
    $rootScope.$on('interacted-with-feed-listing', function (event, args) {
        $rootScope.handleListingsToUpdateInteractions($scope.features, args);
    });
}])

    // NL Feed Listings //
    app.controller('NLFeedListingsCtrl', ['$state','$scope', '$rootScope', '$stateParams', 'Categories', 'Places', 'Events', 'Profile', 'Listings', '$ionicViewSwitcher', 'listingsService', function($state, $scope, $rootScope, $stateParams, Categories, Places, Events, Profile, Listings, $ionicViewSwitcher, listingsService) {
        // Set Up Variables
        $scope.rootScope = $rootScope;
        $scope.pageLoading = true;
        $scope.searchOnRight = true;
        
        $scope.searchType = $stateParams.searchType;
        $scope.listings = [];
        $scope.features = [];
        
        $scope.pageLoad = function () {
                
            var addListingsToFeaturedListings = function (listings) {
                for (a = 0; a < listings.length; a++) {
                    if (listings[a].isFeatured == "1") {
                        $scope.features.push(listings[a]);
                    }
                }
            }
            
            //Prepare Page Load Data
            var getListingsByBusinessType = function (_townId, _businessTypeId) {
                Profile.getListingsByBusinessType(_townId, _businessTypeId, $rootScope.user._profileId || 0).success(function (listings) {
                    addListingsToFeaturedListings(listings);
                    
                    if (listings != 'null' && listings != null) {
                        listingsService.sortThroughListingsResults($scope, listings, 0, 'listings');
                    }
                    window.setTimeout(function () { $scope.pageLoading = false;}, 150);
                    if ($rootScope.debugMode) {
                        console.log('getListingsByBusinessType in NLFeedListings results: ', $scope.listings);
                    }
                }).error(function () {
                    getListingsByBusinessType(_townId, _businessTypeId);
                });
            }
            
            var getBarsAndClubsByTown = function (_townId) {
                Listings.getBarsAndClubsByTown(_townId, $rootScope.user._profileId || 0).success(function (listings) {
                    addListingsToFeaturedListings(listings);
                    
                    if (listings != 'null' && listings != null) {
                        listingsService.sortThroughListingsResults($scope, listings, 0, 'listings');
                    }
                    window.setTimeout(function () { $scope.pageLoading = false;}, 150);
                    if ($rootScope.debugMode) {
                        console.log('getBarsAndClubsByTown in NLFeedListings results: ', $scope.listings);
                    }
                }).error(function () {
                    getBarsAndClubsByTown(_townId);
                });
            }

            $scope.pinListingToMsg = function (listing, $event) {
                $rootScope.pinListingToMessage($event, listing, listing.listingType, null, $scope);
            }
        
            $scope.findNight = function () {
                Events.getEventsByTown($rootScope.currentSearchTown._id, $rootScope.currentSearchMusic._id, $rootScope.user._profileId || 0).success(function (listings) {
                    if ($rootScope.debugMode) {
                        console.log('getEventsbytown in NLFeedListings results: ', listings);
                    }
                    if (listings != 'null' && listings != null) {
                        addListingsToFeaturedListings(listings);
                        listingsService.sortThroughListingsResults($scope, listings, 0, 'listings');
                    }
                    window.setTimeout(function () { $scope.pageLoading = false;}, 150);
                }).error(function () {
                    $scope.findNight();
                });
            };
            
            $scope.findMovies = function () {
                Listings.getMoviesByTownAndMovieStyle($rootScope.currentSearchTown._id, $rootScope.currentSearchMovieCat._id, $rootScope.user._profileId || 0).success(function (listings) {
                    addListingsToFeaturedListings(listings);
                    console.log(listings);
                    if (listings != 'null' && listings != null) {
                        listingsService.sortThroughListingsResults($scope, listings, 0, 'listings');
                    }
                    window.setTimeout(function () { $scope.pageLoading = false;}, 150);
                }).error(function () {
                    $scope.findMovies();
                });
            };
            
            $scope.findRestaurants = function () {
                Listings.getRestaurantsOrTakeawaysByTownAndFoodStyle($rootScope.currentSearchTown._id, $rootScope.currentSearchRestaurantFoodCat._id, 'Restaurant', $rootScope.user._profileId || 0).success(function (listings) {
                    addListingsToFeaturedListings(listings);
                    if (listings != 'null' && listings != null) {
                        listingsService.sortThroughListingsResults($scope, listings, 0, 'listings');
                    }
                    window.setTimeout(function () { $scope.pageLoading = false;}, 150);
                }).error(function () {
                    $scope.findRestaurants();
                });
            };
            
            $scope.findTakeaways = function () {
                Listings.getRestaurantsOrTakeawaysByTownAndFoodStyle($rootScope.currentSearchTown._id, $rootScope.currentSearchTakeawayFoodCat._id, 'Takeaway', $rootScope.user._profileId || 0).success(function (listings) {
                    addListingsToFeaturedListings(listings);
                    if (listings != 'null' && listings != null) {
                        listingsService.sortThroughListingsResults($scope, listings, 0, 'listings');
                    }
                    
                    window.setTimeout(function () { $scope.pageLoading = false;}, 150);
                }).error(function () {
                    $scope.findTakeaways();
                });
            };
            
            $scope.seeListingDetail = function (feature) {
                $state.go('app.feed.nlfeedListing', {_listingId:feature.relListingId, listingType:feature.listingType, searchType: $stateParams.searchType, _businessTypeId: $stateParams._businessTypeId});
            }
            
            switch($scope.searchType) {
                case 'searchBusinessByCategory':
                case 'searchBars':
                case 'searchClubs':
                case 'searchBarsAndClubs':
                    var _businessTypeId = $stateParams._businessTypeId;
                    
                    switch($scope.searchType) {
                        case 'searchBusinessByCategory':
                            $rootScope.currentSearchStyleTerm = $stateParams._businessTypeId;
                            $rootScope.currentSearchTypeTerm = 'Businesses';
                            break;
                        case 'searchBars':
                            $rootScope.currentSearchStyleTerm = "";
                            $rootScope.currentSearchTypeTerm = 'Bars';
                            _businessTypeId = 3;
                            break;
                        case 'searchClubs':
                            $rootScope.currentSearchStyleTerm = "";
                            $rootScope.currentSearchTypeTerm = 'Clubs';
                            _businessTypeId = 2;
                            break;
                        case 'searchBarsAndClubs':
                            $rootScope.currentSearchStyleTerm = "";
                            $rootScope.currentSearchTypeTerm = 'Bars & Clubs';
                            break;
                    };
                    
                    if ($scope.searchType == 'searchBarsAndClubs') {
                        getBarsAndClubsByTown($rootScope.currentSearchTown._id);
                    } else {
                        getListingsByBusinessType($rootScope.currentSearchTown._id, _businessTypeId);
                    }
                    break;
                case 'searchEventsByMusic':
                    $rootScope.currentSearchStyleTerm = $rootScope.currentSearchMusic.name;
                    $rootScope.currentSearchTypeTerm = 'Nights';
                    $scope.findNight();
                    break;
                case 'searchMoviesByMovieStyle':
                    $rootScope.currentSearchStyleTerm = $rootScope.currentSearchMovieCat.name;
                    $rootScope.currentSearchTypeTerm = 'Movies';
                    $scope.findMovies();
                    break;
                case 'searchRestaurantsByFoodStyle':
                    $rootScope.currentSearchStyleTerm = $rootScope.currentSearchRestaurantFoodCat.name;
                    $rootScope.currentSearchTypeTerm = 'Restaurants';
                    $scope.findRestaurants();
                    break;
                case 'searchTakeawaysByFoodStyle':
                    $rootScope.currentSearchStyleTerm = $rootScope.currentSearchTakeawayFoodCat.name;
                    $rootScope.currentSearchTypeTerm = 'Takeaways';
                    $scope.findTakeaways();
                    break;
            };
        
            $rootScope.$on('interacted-with-feed-listing', function (event, args) {
                $rootScope.handleListingsToUpdateInteractions($scope.features, args);
            });
        }
        
        $rootScope.checkForAppInit($scope);
        
    }])

    // NL Feed Listing //
    app.controller('NLFeedListingCtrl', ['$rootScope', '$state','$scope', '$stateParams', '$ionicPopup', 'Categories', 'Places', 'Events', 'Profile', 'Messages', '$ionicViewSwitcher', 'datesService', 'listingsService', function($rootScope, $state, $scope, $stateParams, $ionicPopup, Categories, Places, Events, Profile, Messages, $ionicViewSwitcher, datesService, listingsService) {
        // Set Up Variables
        $scope.rootScope = $rootScope;
        $scope.listing = {};
        $scope.pageLoading = true;
        
        $scope.searchType = $stateParams.searchType,
        $scope._businessTypeId = $stateParams._businessTypeId,
        $scope._listingId = $stateParams._listingId,
        $scope.listingType = $stateParams.listingType
        
        $scope.$on('$ionicView.beforeEnter', function() {
            $rootScope.pageTitle = ($scope.pageTitle) ? $scope.pageTitle: $rootScope.pageTitle;
            
            $rootScope.allPopoverImages = $scope.popoverImages || $rootScope.allPopoverImages;
        });
        
        $scope.$on('$ionicView.enter', function() {
            
        });
        
        $scope.pageLoad = function () {
            //Prepare Page Load Data
            var prepareListingData = function () {
                Profile.getListingById($stateParams._listingId, $stateParams.listingType, $rootScope.user._profileId || 0).success(function (successData) {
                    if ($rootScope.debugMode) {console.log('NLFeedListing getListingById successData: ', successData[0]);}
                    $scope.listing = successData[0];
                    $rootScope.pageTitle = $scope.listing.name;
                    $scope.pageTitle = $rootScope.pageTitle;
                    $scope.listing.follow = successData[0].follow;
                    
                    listingsService.createListingTypesObjForListing($scope.listing);
                    listingsService.processListingBusinessOpeningTimes($scope.listing);

                    $scope.listing.isAcceptingTaxiBookings = ($scope.listing.isAcceptingTaxiBookings == '1') ? true : false;
                    $scope.listing.isAcceptingTableBookings = ($scope.listing.isAcceptingTableBookings == '1') ? true : false;
                    $scope.listing.isAcceptingOnlineOrders = ($scope.listing.isAcceptingOnlineOrders == '1') ? true : false;
                    $scope.listing.phoneIsRequiredForBooking = ($scope.listing.showUsersEmailAndPhoneInTableBookingResponse == '1') ? true : false;
                    $scope.listing.allowCommentInTableBooking = ($scope.listing.allowCommentInTableBooking == '1') ? true : false;
                    $scope.listing.showTakeawayMenu = ($scope.listing.showTakeawayMenu == '1' && $scope.listing.hasTakeawayMenuItem) ? true: false;
                    $scope.listing.showCarteMenu = ($scope.listing.showCarteMenu == '1' && $scope.listing.hasCarteMenuItem) ? true: false;
                    $scope.listing.currentCoverPhotoName = ($scope.listing.listingType == 'Movie') ? 'https://www.cineworld.co.uk' + $scope.listing.currentCoverPhotoName: $scope.listing.currentCoverPhotoName;

                    if ($scope.listing.listingType == 'Event' && $scope.listing.weekday == null) {
                        $scope.listing.dateString = $scope.listing.date.split(' ');
                        //$scope.listing.dateString = $scope.listing.dateString[0].split('-');
                        $scope.selectedDate1 = new Date($scope.listing.dateString[0]);
                        $scope.listing.dateDisplay = datesService.convertToDate($scope, $scope.selectedDate1);
                        $scope.listing.isPastEvent = (new Date() > $scope.selectedDate1) ? true: false;

                        $scope.listing.isGuestListAllowed = ($scope.listing.isGuestListAllowed != null) ? true : false;
                        $scope.listing.isGuestListMaxReached = ($scope.listing.guestListMax != null && parseInt($scope.listing.guestListCurrentTotal) >= parseInt($scope.listing.guestListMax)) ? true : false;
                        //console.log(new Date($scope.listing.dateString[0], $scope.listing.dateString[1] - 1, $scope.listing.dateString[2]));
                    }
                    else if ($scope.listing.listingType == 'Event' && $scope.listing.weekday != null) {
                        $scope.listing.lastDate = ($scope.listing.lastDate != null) ? datesService.getShortenedDateString($scope.listing.lastDate): null;
                        $scope.listing.lastDate = ($scope.listing.lastDate != null) ? datesService.convertToDateWithoutComma($scope, new Date($scope.listing.lastDate)): null;
                    }

                    if ($rootScope.debugMode) {
                        console.log('getListingById in NLFeedListing results: ', $scope.listing);
                    }
                    $scope.messageDisabled = ($rootScope.user.isBusiness == '1' || $scope.listing.listingType == 'Movie' || ($scope.listing.listingType == 'Business' && $scope.listing.isAcceptingEnquiries == '0') ||
                            ($rootScope.userLoggedIn && $scope.listing.following != '1' && $scope.listing.listingType == 'Person' && $rootScope.user.isBusiness == '0')
                        ) ? true : false;
                    
                    window.setTimeout(function () { $scope.pageLoading = false;}, 150);
                }).error(function () {
                    prepareListingData();
                });
            }
        
            prepareListingData();
            
            $scope.attemptToLikeOrFollowListing = function (engagementType, listing, $event) {
                if ($rootScope.userLoggedIn) {
                    $rootScope.toggleUserEngagement(engagementType, listing, $event);
                } else {
                    //show pop-up
                    $rootScope.showPopUp($scope, 'Like');
                }
            }

            $scope.sendMessage = function () {
                if ($rootScope.userLoggedIn
                    && $rootScope.user.isBusiness == '0'
                    && ( (($scope.listing.isBusiness == '1' && $scope.listing.isAcceptingEnquiries == '1') || $scope.listing.listingType == 'Event') || ($scope.listing.following == '1' && $scope.listing.isBusiness != '1') )
                    ) {
                    //Go to message Screen
                    $state.go('app.profile');
                    var relListing = ($scope.listing.listingType == 'Event') ? $scope.listing: null;
                    var relListingName = ($scope.listing.listingType == 'Event') ? $scope.listing.businessName: $scope.listing.name;
                    
                    $rootScope.relListing = relListing;
                    if ($scope.listing.listingType == 'Event') {
                        $rootScope.relListing.relListingTypeAlias = "Event";
                        $rootScope.relListing.date = (!$rootScope.relListing.weekday) ?
                            datesService.convertToDate($scope, new Date($rootScope.relListing.date.split(' ')[0] ) ) :
                            $rootScope.relListing.weekday + ', weekly';
                    }
                    if ($rootScope.relListing) {
                        $rootScope.relListing.relListingType = (relListing != null) ? relListing.listingType: null;
                        $rootScope.relListing.relListingSpecItemId = (relListing != null) ? relListing.relListingId : null;
                    }
                    
                    var groupType = ($scope.listing.isBusiness == '1' || $scope.listing.listingType == 'Event') ? 'Business' : 'Person';
                    var timer = window.setTimeout(function () {$state.go('app.profile.messageGroups', {'relListing': null, 'groupType': groupType});}, 60);
                    var timer2 = window.setTimeout(function () {
                        var checkIfMessageGroupExists = function () {
                            Messages.checkIfMessageGroupExists([$rootScope.user._profileId, $scope.listing._profileId]).success(function (successData) {
                                if ($rootScope.debugMode) {
                                    console.log("checkIfMessageGroupExists successData: ", successData);
                                }
                                if (successData == null) {
                                    $state.go('app.profile.messageGroups.messageGroup', {'_id': null, 'relListing': null, '_profileIds': [$rootScope.user._profileId, $scope.listing._profileId], 'groupType': groupType, 'messageNameString': 'New Message to ' + relListingName});
                                } else {
                                    $state.go('app.profile.messageGroups.messageGroup', {'_id': successData[0]._id, 'relListing': null, '_profileIds': [], 'groupType': groupType, 'messageNameString': relListingName});
                                }
                            }).error(function () {
                                checkIfMessageGroupExists();
                            });
                        }
                        checkIfMessageGroupExists();
                    }, 230);
                } else if (!$rootScope.userLoggedIn) {
                    if ($scope.listing.isBusiness == '1' || $scope.listing.listingType == 'Event') {
                        $rootScope.showPopUp($scope, 'Enquiry');
                    } else {
                        //Pop up -- you can only message people when logged in
                        $rootScope.showPopUp($scope, 'Message');
                    }
                }
            }
            
            $scope.seePhoto = function (photoName) {
                if (photoName == 'CoverPhoto' && $scope.listing.listingType != 'Movie') {
                    $scope.popoverImages = [{'src': $rootScope.assetsFolderUrl + '/img/user_images/cover_photo/'+$scope.listing.currentCoverPhotoName}];
                }
                else if (photoName == 'CoverPhoto' && $scope.listing.listingType == 'Movie') {
                    $scope.popoverImages = [{'src': $scope.listing.currentCoverPhotoName}];
                }
                else if (photoName == 'ProfilePhoto') {
                    $scope.popoverImages = [{'src': $rootScope.assetsFolderUrl + '/img/user_images/profile_photo/'+$scope.listing.currentProfilePhotoName}];
                }
                $rootScope.allPopoverImages = $scope.popoverImages;
                $rootScope.showPopoverImages(0);
            }

            $scope.seePhotos = function (listing) {
                var relId = null, relType = null;
                if (listing.listingType == 'Movie' || listing.listingType == 'Event') {
                    relId = listing.relListingId;
                    relType = listing.listingType;
                } else {
                    relId = listing._profileId;
                    relType = 'Profile';
                }
                $state.go('app.feedListing-photos', {searchType: $stateParams.searchType, _businessTypeId: $stateParams._businessTypeId, _listingId: $stateParams._listingId, listingType: listing.listingType, _id: relId, specificListingType: relType, listingName: $scope.listing.name});
            }
            
            $scope.goToSeeTrailer = function () {
                $state.go('app.seeTrailer', {searchType: $stateParams.searchType, _businessTypeId: $stateParams._businessTypeId, _listingId: $stateParams._listingId, listingType: $scope.listing.listingType, _id: $scope.listing.relListingId, movieTitle: $scope.listing.name});
            }

            $scope.goToBookTable = function () {
                if ($scope.listing.isAcceptingTableBookings && $rootScope.userLoggedIn) {
                    $state.go('app.bookTable', {
                        searchType: $stateParams.searchType
                        , _businessTypeId: $stateParams._businessTypeId
                        , _listingId: $stateParams._listingId
                        , listingType: $stateParams.listingType
                        , _id: $scope.listing.relListingId
                        , listingName: $scope.listing.name
                        , tableForMax: $scope.listing.maxTableBookingGuests
                        , phoneIsRequiredForBooking: $scope.listing.phoneIsRequiredForBooking
                        , commentAllowed: $scope.listing.allowCommentInTableBooking});
                }
                else if ($scope.listing.isAcceptingTableBookings && !$rootScope.userLoggedIn) {
                    $rootScope.showPopUp($scope, 'BookTable');
                }
            }

            $scope.goToBookTickets = function () {
                if ($scope.listing.isGuestListAllowed && !$scope.listing.isGuestListMaxReached && $rootScope.userLoggedIn) {
                    $state.go('app.bookTickets', {searchType: $stateParams.searchType, _businessTypeId: $stateParams._businessTypeId, _listingId: $stateParams._listingId, listingType: $stateParams.listingType, _id: $scope.listing.relListingId, listingName: $scope.listing.name});
                }
                else if ($scope.listing.isGuestListAllowed && !$scope.listing.isGuestListMaxReached && !$rootScope.userLoggedIn) {
                    $rootScope.showPopUp($scope, 'Guestlist');
                }
            }

            $scope.goToSeeMenu = function (menuType) {
                if ($scope.listing.showCarteMenu && menuType == 'Carte') {
                    $state.go('app.seeMenu', {searchType: $stateParams.searchType, _businessTypeId: $stateParams._businessTypeId, _listingId: $stateParams._listingId, listingType: $stateParams.listingType, listingName: $scope.listing.name, '_businessId': $scope.listing.relListingId, '_menuTypeId': 2});
                }
                else if ($scope.listing.showTakeawayMenu && menuType == 'Takeaway') {
                    $state.go('app.seeMenu', {searchType: $stateParams.searchType, _businessTypeId: $stateParams._businessTypeId, _listingId: $stateParams._listingId, listingType: $stateParams.listingType, listingName: $scope.listing.name, '_businessId': $scope.listing.relListingId, '_menuTypeId': 1});
                }
            }

            $scope.pinListingToMsg = function (listing, $event) {
                $rootScope.pinListingToMessage($event, listing, listing.listingType, null, $scope);
            }

            $scope.goToBookTaxi = function () {
                
            }
        }
        
        $rootScope.checkForAppInit($scope);
        
        $rootScope.$on('interacted-with-feed-listing', function (event, args) {
            $rootScope.handleListingsToUpdateInteractions([$scope.listing], args);
        });
    }])

    app.controller('NLFeedListingPhotosCtrl', ['$ionicHistory', '$rootScope', '$state','$scope', '$stateParams', 'Categories', 'Places', 'Events', 'Profile', '$ionicViewSwitcher', function($ionicHistory, $rootScope, $state, $scope, $stateParams, Categories, Places, Events, Profile, $ionicViewSwitcher) {
        // Set Up Variables
        $scope.rootScope = $rootScope;
        $scope.photoAlbums = [];
        $scope.windowWidth = (window.innerWidth/100) * 30;
        $scope._listingId = $stateParams._listingId;
        $scope.listingType = $stateParams.listingType;
        $scope.listingName = $stateParams.listingName;
        $scope._paramsId = $stateParams._id;
        
        $scope.$on('$ionicView.beforeEnter', function() {
            $rootScope.pageTitle = ($scope.pageTitle) ? $scope.pageTitle: $rootScope.pageTitle;
        });
        
        $scope.pageLoad = function () {
            //Prepare Page Load Data
            $rootScope.pageTitle = $stateParams.listingName + ' Photos'
            $scope.pageTitle = $rootScope.pageTitle;
            
            var getPhotoAlbumsSummaryForListing = function () {
                Profile.getPhotoAlbumsSummaryForListing($stateParams._id, $stateParams.specificListingType).success(function (successData) {
                    if ($rootScope.debugMode) {
                        console.log('getPhotoAlbumsSummaryForListing successData: ', successData);
                    }
                    if (successData != 'null') {
                        $scope.photoAlbums = successData;
                    }
                }).error(function () {
                    getPhotoAlbumsSummaryForListing();
                });
            }
            
            getPhotoAlbumsSummaryForListing();
        }
        
        $rootScope.checkForAppInit($scope);
    }])

    app.controller('NLFeedListingSpecificPhotosCtrl', ['$ionicHistory', '$rootScope', '$state','$scope', '$stateParams', 'Categories', 'Places', 'Events', 'Profile', '$ionicViewSwitcher', function($ionicHistory, $rootScope, $state, $scope, $stateParams, Categories, Places, Events, Profile, $ionicViewSwitcher) {
        // Set Up Variables
        $scope.rootScope = $rootScope;
        $scope.photos = [];
        $scope.windowWidth = (window.innerWidth/100) * 28.5;
        $scope._listingProfileId = $stateParams._listingId;
        
        $scope.$on('$ionicView.beforeEnter', function () {
            $rootScope.allPopoverImages = $scope.popoverImages || [];
            $rootScope.pageTitle = $scope.pageTitle || $rootScope.pageTitle;
        });
        
        $scope.pageLoad = function () {
            $rootScope.pageTitle = $stateParams.listingName;
            $rootScope.pageTitle += ($stateParams.albumType == 'Cover Photo') ? ' Cover Photos': ' Profile Photos';
            $scope.pageTitle = $rootScope.pageTitle;
            $scope.listingType = $stateParams.listingType;
            //Prepare Page Load Data
            var getSpecificAlbumSummaryForListing = function () {
                var listingType = ($stateParams.listingType == 'Business' || $stateParams.listingType == 'Person') ? 'Profile' : $stateParams.listingType;
                Profile.getSpecificAlbumSummaryForListing($stateParams._id, $stateParams._albumId, $stateParams.albumType, listingType).success(function (successData) {
                    if ($rootScope.debugMode) {
                        console.log('getSpecificAlbumSummaryForListing successData: ', successData);
                    }
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
                            
                            successData[a].index = a;
                            successData[a].evenIndex = (relModulus) ? 'even': 'odd';
                            if ($stateParams.listingType == 'Movie') {
                                popoverImages.push({'src': successData[a].name});
                            }
                            else {
                                popoverImages.push({'src': $rootScope.assetsFolderUrl + '/img/user_images/'+albumName+'/' + successData[a].name});
                            }
                            
                            if (a == successData.length - 1) {
                                $scope.popoverImages = popoverImages;
                                $rootScope.allPopoverImages = popoverImages;
                                $scope.photos = successData;
                            }
                        }
                    }
                    
                }).error(function () {
                    getSpecificAlbumSummaryForListing();
                });
            }

            getSpecificAlbumSummaryForListing();
        }
        
        $rootScope.checkForAppInit($scope);
    }])

    /* See Businesses Items Views Controller */
    app.controller('SeeBusinessesItemsCtrl', ['$rootScope', '$state', '$stateParams', '$scope', 'Offers', 'Profile', 'Events', 'Taxi', 'MenuItems', '$ionicScrollDelegate', '$ionicViewSwitcher', 'datesService', '$timeout', function($rootScope, $state, $stateParams, $scope, Offers, Profile, Events, Taxi, MenuItems, $ionicScrollDelegate, $ionicViewSwitcher, datesService, $timeout) {
        //Variables & Constants
        $scope.rootScope = $rootScope;
        $scope.businessesItems = [];
        $scope.itemType = $stateParams.itemType;
        $scope.windowWidth = window.innerWidth;
        
        $scope.$on('$ionicView.enter', function() {
        
            if ($stateParams.itemType == 'Offers') {
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
            
            $rootScope.pageTitle = $scope.pageTitle || $rootScope.pageTitle;
        });
        
        $scope.pageLoad = function () {
            if ($stateParams.itemType != 'Offers') {
                $scope.nextPageFunction = function (item) {
                    $state.go('app.businessItem', {'_id': item.relListingId, 'itemType': $stateParams.itemType});
                };
            } else {
                $scope.nextPageFunction = function (item) {
                    $state.go('app.seeBusinessMenuItems', {'_businessId': $rootScope.user._id, '_menuItemCategoryId': item._id, 'viewType': 'listing'});
                };
            }
            
            $scope.pinListingToMsg = function (listing, $event) {
                $rootScope.pinListingToMessage($event, listing, listing.listingType, null, $scope);
            }
            
            switch($stateParams.itemType) {
                case 'Offers':
                    $rootScope.pageTitle = 'Offers at ' + $stateParams.listingName;
                    $scope.pageTitle = $rootScope.pageTitle;
                    $scope.pageSubTitle = ($stateParams.listingType != 'Event') ? 'Current/Upcoming Offers' : 'Deals on the Night';
                    $scope.getBusinessItems = function () {
                        var listingType = ($stateParams.listingType == 'Event') ? 'Event': 'Business';
                        Offers.getOffers($stateParams._businessId, listingType, $rootScope.user._profileId || 0).success(function (offers) {
                            if ($rootScope.debugMode) {
                                console.log('SeeBusinessesItemsCtrl getOffers successData: ', offers);
                            }

                            var allCategoryLabels = [];
                            var allCategories = [];
                            var loopCategoryLabels, finalOffersDisplay;
                            $scope.offers = [];
                            //Loop Through all offers and rceive relevant Cat names
                            
                            finalOffersDisplay = function (allCategories) {
                                $scope.businessesItems = allCategories;
                            }
                            
                            loopCategoryLabels = function (allCategoryLabels) {
                                for (b = 0; b < allCategoryLabels.length; b++) {
                                    allCategories[b] = []
                                    allCategories[b].name = allCategoryLabels[b];
                                    allCategories[b].offers = [];
                                    
                                    for (c = 0; c < offers.length; c++) {
                                        var stringToCheck = offers[c].offerSubCategoryName;
                                        if (stringToCheck == allCategoryLabels[b]) {
                                            offers[c].index = allCategories[b].offers.length + 1;
                                            allCategories[b].offers.push(offers[c]);
                                        }
                                        
                                        if (c == offers.length - 1 && b == allCategoryLabels.length - 1) {
                                            finalOffersDisplay(allCategories);
                                        }
                                    }
                                }
                            }
                            
                            if (offers != null) {
                                for (a = 0; a < offers.length; a++) {
                                    var stringToCheck = offers[a].offerSubCategoryName;
                                    if (allCategoryLabels.indexOf(stringToCheck) == -1) {
                                        allCategoryLabels.push(stringToCheck);
                                        allCategories.showFull = false;
                                    }
                                    offers[a].startDateTimeString = datesService.convertToDate($scope, new Date(offers[a].relevantStartDateTime.split(' ')[0] ) );
                                    offers[a].endDateTimeString = datesService.convertToDate($scope, new Date(offers[a].relevantEndDateTime.split(' ')[0] ) );
                                    $scope.offers.push(offers[a]);
                                    
                                    if (a == offers.length - 1) {
                                        loopCategoryLabels(allCategoryLabels);
                                    }
                                }
                            }
                            else {
                                $scope.businessesItems = [];
                            }
                        }).error(function () {
                            $scope.getBusinessItems();
                        });
                    }

                    // Updated from User
                    $scope.goToOffer = function (offer) {
                        $state.go('app.offers');
                        var timer =window.setTimeout(function () {
                            $state.go('app.offers.offerDetail', {_id: offer._id});
                        }, 200);
                    }
                    
                    $scope.toggleCategoryShow = function (category) {
                        category.showFull = !category.showFull;
                        $timeout(function () {$ionicScrollDelegate.resize();}, 500);
                    }
                    
                    //Updates based on Outside events
                    $rootScope.$on('new-offer', function(event, args) {
                        $scope.getBusinessItems();
                        // do what you want to do
                    })
                    break;
                case 'UpcomingEvents':
                    $rootScope.pageTitle = 'Upcoming Events at ' + $stateParams.listingName;
                    $scope.pageTitle = $rootScope.pageTitle;
                    $scope.getBusinessItems = function () {
                    
                        Events.getEventsByBusiness($stateParams._businessId, 'present', $rootScope.user._profileId || 0).success(function (successData) {
                            if ($rootScope.debugMode) {
                                console.log('SeeBusinessesItemsCtrl getEventsByBusiness successData: ', successData);
                            }
                            
                            $scope.businessesItems = (successData != 'null') ? successData: [];
                        }).error(function () {
                            $scope.getBusinessItems();
                        });
                    }
                    break;
                
            };
            
            $scope.getBusinessItems();
            
            $rootScope.$on('interacted-with-feed-listing', function (event, args) {
                if ($stateParams.itemType == 'Offers') {
                    $rootScope.handleListingsToUpdateInteractions($scope.offers, args);
                }
                else if ($stateParams.itemType == 'UpcomingEvents') {
                    $rootScope.handleListingsToUpdateInteractions($scope.businessesItems, args);
                }
            });
        }
        
        $rootScope.checkForAppInit($scope);
    }]);

    // See Trailer //
    app.controller('SeeTrailerCtrl', ['$ionicHistory', '$rootScope', '$state', '$scope', '$stateParams', 'Movies', '$sce', '$ionicViewSwitcher', function($ionicHistory, $rootScope, $state, $scope, $stateParams, Movies, $sce, $ionicViewSwitcher) {
        // Set Up Variables
        $scope.pageLoading = true;
        $scope.rootScope = $rootScope;
        $scope.movieTitle = $stateParams.movieTitle;
        
        $scope.$on('$ionicView.beforeEnter', function() {
            $rootScope.pageTitle = ($scope.pageTitle) ? $scope.pageTitle: $rootScope.pageTitle;
        });
        
        $scope.pageLoad = function () {
            $rootScope.pageTitle = $scope.movieTitle + ' Trailer';
            $scope.pageTitle = $rootScope.pageTitle;
            var getMoviesTrailerLink = function () {
                Movies.getMoviesTrailerLink($stateParams._id).success(function (successData) {
                    $scope.movieTrailerLink = $sce.trustAsResourceUrl(successData[0].trailerLink);
                    $scope.pageLoading = false;
                }).error(function (errorData) {
                    getMoviesTrailerLink();
                });
            }
            getMoviesTrailerLink();
        }
        
        $rootScope.checkForAppInit($scope);
        
    }])

    // Book Table //
    app.controller('BookTableCtrl', ['$ionicHistory', 'ionicDatePicker', 'ionicTimePicker', '$rootScope', '$state', '$scope', '$stateParams', 'TableBooking', '$ionicPopup', '$ionicViewSwitcher', '$timeout', 'datesService', function($ionicHistory, ionicDatePicker, ionicTimePicker, $rootScope, $state, $scope, $stateParams, TableBooking, $ionicPopup, $ionicViewSwitcher, $timeout, datesService) {
        // Set Up Variables
        $scope.rootScope = $rootScope;
        $scope.listing = [];
        $scope.tableFor = 2;
		$scope.commentAllowed = false;
		$scope.textareaShort = true;
        $scope.name = null;
        $scope.email = null;
        $scope.comment = null;
        $scope.selectedDate1 = new Date();
        $scope.selectedTime = (new Date().getHours() < 18) ?
            new Date(64800 * 1000) :
            new Date();
        $scope.todaysDate = new Date();
        $scope.finalDate = new Date();
        $scope.days = datesService.days;
        $scope.months = datesService.months;
        
        $scope.$on('$ionicView.beforeEnter', function () {
            $rootScope.pageTitle = $scope.pageTitle || $rootScope.pageTitle;
        });
        
        $scope.pageLoad = function () {
            $rootScope.pageTitle = 'Book a Table at ' + $stateParams.listingName;
            $scope.pageTitle = $rootScope.pageTitle;

            $scope.tableForMax = $stateParams.tableForMax;
            $scope.commentAllowed = $stateParams.commentAllowed;
            console.log($scope.commentAllowed);
			$scope.textareaShort = true;
            $scope.phoneIsRequiredForBooking = $stateParams.phoneIsRequiredForBooking;
            $scope.tableBookingDisallowed = [];

            if ($scope.phoneIsRequiredForBooking && ($rootScope.user.phone1 == null || $rootScope.user.phone1 == '') ) {
                var displayNote = '<i class="ion-alert-circled"></i>The restaurant required you to provide a phone number to make a booking. Please add a phone number to your Account Details.</b>.';
                $scope.tableBookingDisallowed.push({reason: 'Phone Number Required', note: displayNote});
            }
            
            $scope.convertToDate = function () {
                return $scope.days[$scope.selectedDate1.getDay()] + ', ' + $scope.selectedDate1.getDate() + ' ' + $scope.months[$scope.selectedDate1.getMonth()] + ' ' + $scope.selectedDate1.getFullYear();
            }
            $scope.convertToTime = function () {
                $scope.selectedHour = ($scope.selectedTime.getUTCHours()+1 < 10) ? '0' + $scope.selectedTime.getUTCHours(): $scope.selectedTime.getUTCHours();
                $scope.selectedMinutes = ($scope.selectedTime.getUTCMinutes() < 10) ? '0' + $scope.selectedTime.getUTCMinutes(): $scope.selectedTime.getUTCMinutes();
                return $scope.selectedHour + ':' + $scope.selectedMinutes;
            }
            $scope.dateInputHTML = $scope.convertToDate();
            $scope.timeInputHTML = $scope.convertToTime();
            $scope.form = {
                name: '',
                email: '',
                comment: ''
            }
            
            var getCurrentInputTime = function () {
                var d = new Date();
                
                return (d.getMinutes() < 30) ?
                    ((d.getHours())*60*60)+(d.getMinutes()*60):
                    ((d.getHours()-1)*60*60)+(d.getMinutes()*60);
            }

            var d = new Date();
            var inputTime = (d.getHours() < 18) ?
                64800:
                getCurrentInputTime();
                
            var showPastTimePopup = function (params) {
                $ionicPopup.show({
                    title: 'Past time chosen',
                    template: '<i class="ion-close main-icon"></i><p>The time you selected has already passed.</p>',
                    //subTitle: 'Are you sure you want to Delete this item?',
                    scope: $scope,
                    buttons: [
                        { 
                            text: 'Close',
                            onTap: function(e) {
                                if (params.callback) {
                                    $timeout(function () {
                                        ionicTimePicker.openTimePicker(ipObj2)
                                    }, 10);
                                }
                            } 
                        }
                    ]
                });
            }
            
            var ipObj1 = {
              callback: function (val) {  //Mandatory
                $scope.selectedDate1 = new Date(val);
                $scope.dateInputHTML = $scope.convertToDate();
                ipObj1.inputDate = new Date(val);

                $scope.findOutIfRestaurantBookingPossible();

                if ($rootScope.debugMode) {
                    console.log('Return value from the datepicker popup is : ' + new Date(val));
                }
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
              to: $scope.finalDate.setDate($scope.finalDate.getDate() + 30), //Optional
              inputDate: $scope.selectedDate1,      //Optional
              mondayFirst: true,          //Optional
              disableWeekdays: [],       //Optional
              closeOnSelect: true,       //Optional
              templateType: 'popup'       //Optional
            };

            var ipObj2 = {
                callback: function (val) {      //Mandatory
                  if (typeof (val) === 'undefined') {
                    if ($rootScope.debugMode) {
                        console.log('Time not selected');
                    }
                  } else {
                    var d = new Date();
                    var bookingIsToday = ($scope.selectedDate1.toDateString() === d.toDateString()); 

                    var currentTimeAsEpoch = (d.getHours()*60*60)+(d.getMinutes()*60);
                    
                    if (bookingIsToday && new Date(val * 1000) < new Date(currentTimeAsEpoch*1000)) {
                        $timeout(function () {
                            showPastTimePopup({callback: 'showTimePicker'});
                        }, 5);
                    }
                    else {
                        $scope.selectedTime = new Date(val * 1000);
                        $scope.timeInputHTML = $scope.convertToTime();
                        ipObj2.inputTime = ($scope.selectedTime.getUTCMinutes() < 30) ? val: val - 3600;
                        $scope.findOutIfRestaurantBookingPossible();
                    }
                    if ($rootScope.debugMode) {
                        console.log('Selected epoch is : ', ipObj2.inputTime, 'and the time is ', $scope.selectedTime.getUTCHours(), 'H :', $scope.selectedTime.getUTCMinutes(), 'M');
                    }
                  }
                },
                inputTime: inputTime,   //Optional
                format: 12,         //Optional
                step: 10,           //Optional
                setLabel: 'Set'    //Optional
              };

            $scope.updateTableFor = function (val) {
                $scope.tableFor = ( ($scope.tableFor == 1 && val == -1) || ($scope.tableFor == 99 && val == 1) || ($scope.tableForMax != 0 && $scope.tableForMax == $scope.tableFor && val == 1) ) ? $scope.tableFor: $scope.tableFor += val;
                $scope.tableForIsMax = ($scope.tableForMax != 0 && $scope.tableForMax == $scope.tableFor) || $scope.tableFor == 99;
            }

            $scope.openTimePicker = function(){
              ionicTimePicker.openTimePicker(ipObj2);
            };

            $scope.openDatePicker = function(){
              ionicDatePicker.openDatePicker(ipObj1);
            };

            $scope.findOutIfRestaurantBookingPossible = function () {
                var params = {
                    _businessId: $stateParams._id
                    , requestedBookingDate: $scope.selectedDate1.getFullYear() + '-' + ($scope.selectedDate1.getMonth() + 1) + '-' + $scope.selectedDate1.getDate()
                    , requestedBookingTime: $scope.selectedHour + ':' + $scope.selectedMinutes + ':00'
                };
                TableBooking.findOutIfRestaurantBookingPossible(params).success(function (successData) {
                    $scope.tableBookingDisallowed = [];
                    if (parseInt(successData[0].blockedCount) > 0) {
                        var displayNote = '<i class="ion-alert-circled"></i>The restaurant is not accepting table bookings between the dates of <b>' + datesService.convertToReadableDate($scope, successData[0].blockedIntervalStart) + '</b> and <b>' + datesService.convertToReadableDate($scope, successData[0].blockedIntervalEnd) + '</b>.';
                        $scope.tableBookingDisallowed.push({reason: 'Blocked', note: displayNote});
                    }
                    else if (successData[0].openCount == '0') {
                        var displayNote = (successData[0].openingTime != null && successData[0].closingTime != null) ? 
                            '<i class="ion-alert-circled"></i>The restaurant is closed at the time selected. On ' + datesService.days[$scope.selectedDate1.getDay()] + '\'s, the restaurant opens at <b>' + successData[0].openingTime.substr(0, successData[0].openingTime.length - 3) + '</b> and closes at <b>' + successData[0].closingTime.substr(0, successData[0].closingTime.length - 3) + '</b>.': 
                            '<i class="ion-alert-circled"></i>The restaurant is closed on the date selected.';

                        $scope.tableBookingDisallowed.push({reason: 'Closed', note: displayNote});
                    }
                }).error(function (errorData) {

                });
            }

            $scope.completeTableBooking = function (name, email) {
                $scope.dateTimeString = $scope.selectedDate1.getFullYear() + '-' + ($scope.selectedDate1.getMonth() + 1) + '-' + $scope.selectedDate1.getDate() + ' ' + $scope.selectedHour + ':' + $scope.selectedMinutes;
                
                var newDateString = ($scope.dateTimeString+':00').replace(/-/g, '/');
                
                if (new Date(newDateString) < new Date()) {
                    showPastTimePopup({});
                    return false;
                }
                console.log($scope.form.comment);
                var _profId = ($rootScope.userLoggedIn) ? $rootScope.user._profileId: null;
				var comment  = ($scope.commentAllowed) ? $scope.form.comment: "";
                
                TableBooking.createTableBooking($rootScope.user._profileId || 0, $stateParams._id, name, email, $scope.tableFor, $scope.dateTimeString, comment).success(function (successData) {
                    var contents = "You've received a Table Booking Request.";
                    var header = "Table Booking Requested";
                    var dataObj = {
                        "actionFunction": "goToBusinessItem",
                        "businessItemType": "RequestedTableBookings",
                        "_businessItemId": successData._id
                    };
                    
                    var recipientsArray = [successData._profileId];
                    
                    $rootScope.prepareMessageNotificationFinal(recipientsArray, contents, header, dataObj);
                    
                    $ionicPopup.show({
                        title: 'Table Booking Requested',
                        template: '<i class="ion-checkmark main-icon"></i><p>Your Table Booking has been requested. We\'ll update you once the restaurant has responded.</p>',
                        //subTitle: 'Are you sure you want to Delete this item?',
                        scope: $scope,
                        buttons: [
                            { 
                                text: 'Close',
                                onTap: function(e) {
                                    $rootScope.backButtonFunction();
                                } 
                            }
                        ]
                    });
                }).error(function (errorData) {
                    $scope.completeTableBooking(name, email);
                });
            }
        }
        
        $rootScope.checkForAppInit($scope);
    }])

// Book Tickets //
    app.controller('BookTicketsCtrl', ['$ionicHistory', '$rootScope', '$state', '$scope', '$stateParams', '$ionicPopup', 'Events', '$ionicViewSwitcher', 'datesService', function($ionicHistory, $rootScope, $state, $scope, $stateParams, $ionicPopup, Events, $ionicViewSwitcher, datesService) {
        // Set Up Variables
        $scope.rootScope = $rootScope;
        $scope.listing = [];
        $scope.additionalGuests = 0;
        $scope.maxGuestsPerBooking = 9;
        $scope.showEventDates = false;
        $scope.bookingAllowed = true;
        $scope.maxGuestListAllowed = null;
        
        $scope.$on('$ionicView.beforeEnter', function () {
            $rootScope.pageTitle = ($scope.pageTitle) ? $scope.pageTitle: $rootScope.pageTitle;
        });
        
        $scope.pageLoad = function () {
            $scope.updateAdditionalGuests = function (val) {
                $scope.additionalGuests = (!$scope.bookingAllowed || ($scope.additionalGuests == 0 && val == -1) || ($scope.additionalGuests == $scope.maxGuestsPerBooking && val == 1) || ($scope.additionalGuests + 1 == $scope.maxGuestListAllowed && val == 1) ) ? $scope.additionalGuests: $scope.additionalGuests += val;
            }

            $scope.getEventDetails = function () {
                Events.getEventDateDetails($stateParams._id, $rootScope.user._profileId).success(function (successData) {
                    if ($rootScope.debugMode) {
                        console.log('BookTicketsCtrl getEventDateDetails successData: ', successData);
                    }
                    $rootScope.pageTitle = 'Book entry at ' + successData[0].name;
                    $scope.pageTitle = $rootScope.pageTitle;
                    $scope.listing = successData[0];
                    $scope.listing.guestListMax = ($scope.listing.guestListMax == null) ? null: parseInt($scope.listing.guestListMax);
                    $scope.listing.guestListCurrentTotal = ($scope.listing.guestListCurrentTotal == null) ? 0: parseInt($scope.listing.guestListCurrentTotal);
                    
                    if ($scope.listing.weekday == null) {
                        $scope.chosenDate = $scope.listing.date;
                        $scope.listing.dateString = $scope.listing.date.split(' ');
                        //$scope.listing.dateString = $scope.listing.dateString[0].split('-');
                        $scope.selectedDate1 = new Date($scope.listing.dateString[0]);
                        $scope.dateDisplay = datesService.convertToDate($scope, $scope.selectedDate1);
                        $scope.bookingAllowed = ($scope.listing._week1DateBooked != null || ($scope.listing.guestListMax != null && ($scope.listing.guestListMax - $scope.listing.guestListCurrentTotal) < 1) ) ? false: true;
                        if ($scope.listing.guestListMax != null) {
                            $scope.maxGuestListAllowed = parseInt($scope.listing.guestListMax) - parseInt($scope.listing.guestListCurrentTotal);
                        }
                    } else {
                        $scope.listing.guestListWeek2Total = ($scope.listing.guestListWeek2Total == null) ? 0: parseInt($scope.listing.guestListWeek2Total);
                        $scope.listing.guestListWeek3Total = ($scope.listing.guestListWeek3Total == null) ? 0: parseInt($scope.listing.guestListWeek3Total);
                        $scope.listing.guestListWeek4Total = ($scope.listing.guestListWeek4Total == null) ? 0: parseInt($scope.listing.guestListWeek4Total);
                        $scope.listing.guestListWeek5Total = ($scope.listing.guestListWeek5Total == null) ? 0: parseInt($scope.listing.guestListWeek5Total);
                        $scope.listing.guestListWeek6Total = ($scope.listing.guestListWeek6Total == null) ? 0: parseInt($scope.listing.guestListWeek6Total);
                        $scope.listing.guestListWeek7Total = ($scope.listing.guestListWeek7Total == null) ? 0: parseInt($scope.listing.guestListWeek7Total);
                        $scope.listing.guestListWeek8Total = ($scope.listing.guestListWeek8Total == null) ? 0: parseInt($scope.listing.guestListWeek8Total);
                        
                        if ($scope.listing.guestListMax != null) {
                            $scope.maxGuestListAllowed = $scope.listing.guestListMax - $scope.listing.guestListCurrentTotal;
                        }
                        $scope.eventDates = [];
                        $scope.eventDatesBooked = [];

                        $scope.eventDates.push([$scope.listing.week1Date, $scope.listing.guestListCurrentTotal, $scope.listing._week1DateBooked]);
                        $scope.eventDatesBooked[0] = ($scope.listing._week1DateBooked == null) ? null: $scope.listing.week1Date.split(' ')[0];
                        
                        $scope.bookingAllowed = ($scope.listing._week1DateBooked != null || ($scope.listing.guestListMax != null && ($scope.listing.guestListMax - $scope.listing.guestListCurrentTotal) < 1)) ? false: true;
                        $scope.chosenDate = $scope.listing.week1Date.split(' ')[0];
                        
                        if ($scope.listing.week2Date != null) {
                            $scope.eventDates.push([$scope.listing.week2Date, $scope.listing.guestListWeek2Total, $scope.listing._week2DateBooked]);
                            $scope.eventDatesBooked[1] = ($scope.listing._week2DateBooked == null) ? null: $scope.listing.week2Date.split(' ')[0];
                        }
                        if ($scope.listing.week3Date != null) {
                            $scope.eventDates.push([$scope.listing.week3Date, $scope.listing.guestListWeek3Total, $scope.listing._week3DateBooked]);
                            $scope.eventDatesBooked[2] = ($scope.listing._week3DateBooked == null) ? null: $scope.listing.week3Date.split(' ')[0];
                        }
                        if ($scope.listing.week4Date != null) {
                            $scope.eventDates.push([$scope.listing.week4Date, $scope.listing.guestListWeek4Total, $scope.listing._week4DateBooked]);
                            $scope.eventDatesBooked[3] = ($scope.listing._week4DateBooked == null) ? null: $scope.listing.week4Date.split(' ')[0];
                        }
                        if ($scope.listing.week5Date != null) {
                            $scope.eventDates.push([$scope.listing.week5Date, $scope.listing.guestListWeek5Total, $scope.listing._week5DateBooked]);
                            $scope.eventDatesBooked[4] = ($scope.listing._week5DateBooked == null) ? null: $scope.listing.week5Date.split(' ')[0];
                        }
                        if ($scope.listing.week6Date != null) {
                            $scope.eventDates.push([$scope.listing.week6Date, $scope.listing.guestListWeek6Total, $scope.listing._week6DateBooked]);
                            $scope.eventDatesBooked[5] = ($scope.listing._week6DateBooked == null) ? null: $scope.listing.week6Date.split(' ')[0];
                        }
                        if ($scope.listing.week7Date != null) {
                            $scope.eventDates.push([$scope.listing.week7Date, $scope.listing.guestListWeek7Total, $scope.listing._week7DateBooked]);
                            $scope.eventDatesBooked[6] = ($scope.listing._week7DateBooked == null) ? null: $scope.listing.week7Date.split(' ')[0];
                        }
                        if ($scope.listing.week8Date != null) {
                            $scope.eventDates.push([$scope.listing.week8Date, $scope.listing.guestListWeek8Total, $scope.listing._week8DateBooked]);
                            $scope.eventDatesBooked[7] = ($scope.listing._week8DateBooked == null) ? null: $scope.listing.week8Date.split(' ')[0];
                        }

                        $scope.eventDatesStrings = [];
                        for (a = 0; a < $scope.eventDates.length; a++) {
                            $scope.eventDates[a][0] = $scope.eventDates[a][0].split(' ')[0];
                            $scope.eventDates[a][3] = new Date($scope.eventDates[a][0]);
                            $scope.eventDates[a][3] = datesService.days[$scope.eventDates[a][3].getDay()] + ', ' + $scope.eventDates[a][3].getDate() + ' ' + datesService.months[$scope.eventDates[a][3].getMonth()] + ' ' + $scope.eventDates[a][3].getFullYear();
                        }
                        $scope.chosenEventDate = $scope.eventDates[0][3];
                    }
                    
                }).error(function () {
                    $scope.getEventDetails();
                });
            }

            $scope.toggleEventDateVisibility = function () {
                $scope.showEventDates = !$scope.showEventDates;
            }

            $scope.selectEventDate = function (date) {
                $scope.chosenEventDate = date[3];
                $scope.chosenDate = date[0];
                $scope.showEventDates = false;
                var relIndex = 0;
                for (a = 0; a < $scope.eventDates.length; a++) {
                    relIndex = ($scope.eventDates[a][0] == date[0]) ? a: relIndex;
                }
                $scope.bookingAllowed = ($scope.eventDatesBooked.indexOf($scope.eventDates[relIndex][0]) == -1) ?
                    (($scope.listing.guestListMax - $scope.eventDates[relIndex][1]) > 0) ? true: false:
                    false;
                $scope.chosenEventDate = $scope.eventDates[relIndex][3];
                $scope.maxGuestListAllowed = $scope.listing.guestListMax - $scope.eventDates[relIndex][1];
                $scope.additionalGuests = ($scope.additionalGuests > $scope.guestListMax) ? $scope.guestListMax: $scope.additionalGuests;
            }

            $scope.completeTicketBooking = function () {
                var _profId = ($rootScope.userLoggedIn) ? $rootScope.user._profileId: 2;
                
                Events.createEventEntryBooking($stateParams._id, $rootScope.user._profileId || 0,
                 $scope.chosenDate, $scope.additionalGuests, 'Guestlist').success(function (successData) {
                    //Update sope variables so maxGuestList and current booking status alter
                    if ($scope.listing.weekday == null) {
                        $scope.maxGuestListAllowed -= ($scope.additionalGuests + 1);
                        $scope.bookingAllowed = false;
                        $scope.listing._week1DateBooked = $scope.listing.relListingId;
                    } else {
                        for (a = 0; a < $scope.eventDates.length; a++) {
                            if ($scope.eventDates[a][0] == $scope.chosenDate) {
                                $scope.eventDates[a][1] = $scope.eventDates[a][1] + 1 + $scope.additionalGuests;
                                $scope.eventDatesBooked[a] = $scope.eventDates[a][0];
                                $scope.maxGuestListAllowed -= ($scope.additionalGuests + 1);
                            }
                        }
                    }
                 
                    var contents = "You've received an Event Booking for " + $scope.chosenDate + "(" + $scope.additionalGuests + " guests)";
                    var header = "Event Entry Booking Received";
                    var dataObj = {
                        "actionFunction": "goToBusinessItem",
                        "businessItemType": "OwnEvents",
                        "_businessItemId": $stateParams._id
                    };
                    
                    var recipientsArray = [successData[0]._profileId];
                    
                    $rootScope.prepareMessageNotificationFinal(recipientsArray, contents, header, dataObj);
                    
                    $ionicPopup.show({
                        title: 'Guestlist Booking Complete',
                        template: '<i class="ion-checkmark main-icon"></i><p>Your Guestlist Booking for this event has been completed.</p>',
                        //subTitle: 'Are you sure you want to Delete this item?',
                        scope: $scope,
                        buttons: [
                            { 
                                text: 'Close',
                                onTap: function(e) {
                                    $rootScope.backButtonFunction();
                                } 
                            }
                        ]
                    });
                }).error(function (errorData) {
                    $scope.completeTicketBooking();
                });
            }

            $scope.getEventDetails();
        }
        
        $rootScope.checkForAppInit($scope);
    }])

    // See Menu Summary//
    app.controller('SeeMenuCtrl', ['$ionicHistory', '$rootScope', '$state','$scope', '$stateParams', 'MenuItems', 'Listings', '$ionicViewSwitcher', function($ionicHistory, $rootScope, $state, $scope, $stateParams, MenuItems, Listings, $ionicViewSwitcher) {
        // Set Up Variables
        $scope.rootScope = $rootScope;
        $scope.pageLoading = true;
        
        $scope.$on('$ionicView.beforeEnter', function () {
            $rootScope.pageTitle = ($scope.pageTitle) ? $scope.pageTitle: $rootScope.pageTitle;
        });
        
        $scope.pageLoad = function () {
            $scope.phone1 = null;
            $scope.menuItemCategories = [];
            $scope.menuItemCategoriesAdded = [];
            $scope.menuItems = [];
            $scope.menuItemsAdded = [];
            $scope.currentOrderMethod = 'Collection';
            $scope.currentOrderReadyToSubmit = false;
            $scope._listingId = $stateParams._listingId;
            $scope.listingType = $stateParams.listingType;
            $scope._businessId = $stateParams._businessId;
            $scope._menuTypeId = $stateParams._menuTypeId;
            $scope.listingName = $stateParams.listingName;
            var menuLabel = ($scope._menuTypeId == 1) ? 'Takeaway': 'A la Carte';
            $rootScope.pageTitle = $scope.listingName + ' Menu ('+menuLabel+')';
            $scope.pageTitle = $rootScope.pageTitle;
            
            //Method Set up Here but can now be accessed globally
            
            $rootScope.finalMenuOrderObjCleanse = function ($scope) {
                var menuItemsToRemove = [];
                
                function calculateOrderTotal () {
                    //$rootScope.$broadcast('menuItem-order-changed');
                    var currentOrderTrayTotal = 0;
                    if ($rootScope.currentSavedFoodOrders) {
                        for (a = 0; a < $rootScope.currentSavedFoodOrders.length; a++) {
                            if ($rootScope.currentSavedFoodOrders[a]._businessId == $stateParams._businessId) {
                                for (b = 0; b < $rootScope.currentSavedFoodOrders[a].menuItems.length; b++) {
                                    for (c = 0; c < $rootScope.currentSavedFoodOrders[a].menuItems[b].item.itemsAddedToBasket.length; c++) {
                                    
                                        if ($rootScope.currentSavedFoodOrders[a].menuItems[b].item.itemsAddedToBasket[c].specificItem.length > 0) {
                                            var optChoicesLength = $rootScope.currentSavedFoodOrders[a].menuItems[b].item.itemsAddedToBasket[c].specificItem.length;
                                            currentOrderTrayTotal += ($rootScope.currentSavedFoodOrders[a].menuItems[b].item.itemsAddedToBasket[c].quantity * parseFloat($rootScope.currentSavedFoodOrders[a].menuItems[b].item.itemsAddedToBasket[c].specificItem[optChoicesLength - 1].finalPrice) );
                                        } else {
                                            currentOrderTrayTotal += ($rootScope.currentSavedFoodOrders[a].menuItems[b].item.itemsAddedToBasket[c].quantity * parseFloat($rootScope.currentSavedFoodOrders[a].menuItems[b].item.itemsAddedToBasket[c].finalPrice) );
                                        }
                                    }
                                }
                            }
                        }
                        
                        $rootScope.currentOrderTrayTotal = (currentOrderTrayTotal).formatMoney(2);
                        $scope.currentOrderReadyToSubmit = (currentOrderTrayTotal > parseFloat(10.00) || ($scope.currentOrderMethod == 'Collection' && currentOrderTrayTotal > parseFloat(0.00))) ? true: false;
                    }
                }
                
                function removeMenuItems () {
                    for (a = menuItemsToRemove.length - 1; a > 0; a--) {
                        $scope.thisTakeawaysOrderObject.splice(menuItemsToRemove[a], 0);
                        if (a == 1) {
                            calculateOrderTotal();
                        }
                    }
                }
                
                function loopMenuItems (a) {
                    if ($scope.thisTakeawaysOrderObject.menuItems[a].quantity == 0) {
                        menuItemsToRemove.push(a);
                    }
                    
                    if (a < $scope.thisTakeawaysOrderObject.menuItems - 1) {
                        loopMenuItems(a + 1);
                    }
                    else if (menuItemsToRemove.length > 0) {
                        removeMenuItems();
                    }
                    else {
                        calculateOrderTotal();
                    }
                }
                
                if ($scope.thisTakeawaysOrderObject && $scope.thisTakeawaysOrderObject.menuItems) {
                    loopMenuItems(0);
                }
                else {
                    if ($rootScope.debugMode) {
                        console.log("finalMenuOrderObjCleansed: ", $rootScope.finalMenuOrderObjCleanse);
                    }
                    
                    calculateOrderTotal();
                }
            }
            
            $scope.sortMenuItems = function () {
                var addMenuItemsToCat = function (i, catI) {
                    if ($scope.menuItems[i].itemsAddedToBasket) {
                        for (ind = 0; ind < $scope.menuItems[i].itemsAddedToBasket.length; ind++) {
                            if ($scope.menuItems[i].itemsAddedToBasket[ind].specificItem.length == 0) {
                                $scope.menuItemCategories[catI].count += $scope.menuItems[i].itemsAddedToBasket[ind].quantity;
                            } else {
                                $scope.menuItemCategories[catI].count += $scope.menuItems[i].itemsAddedToBasket[ind].quantity;
                            }
                        }
                    }
                }
                for (z = 0; z < $scope.menuItems.length; z++) {
                    if ($scope.menuItemCategoriesAdded.indexOf($scope.menuItems[z]._menuItemCategoryId) == -1) {
                        $scope.menuItemCategories.push({
                            'name': $scope.menuItems[z].menuItemCategoryName,
                            '_id': $scope.menuItems[z]._menuItemCategoryId,
                            'count': 0
                        });
                        
                        var currentCategoriesIndex = $scope.menuItemCategories.length - 1;
                        
                        addMenuItemsToCat(z, currentCategoriesIndex);
                        
                        $scope.menuItemCategoriesAdded.push($scope.menuItems[z]._menuItemCategoryId);
                    }
                    else {
                        addMenuItemsToCat(z, $scope.menuItemCategoriesAdded.indexOf($scope.menuItems[z]._menuItemCategoryId));
                    }
                    
                    if (z == $scope.menuItems.length - 1) {
                        $scope.pageLoading = false;
                    }
                }
            }
            
            var getMenuItems = function () {
                MenuItems.getMenuItems($stateParams._businessId, 0, $stateParams._menuTypeId).success(function (successData) {
                    $scope.menuItemCategories = [];
                    $scope.menuItemCategoriesAdded = [];
                    $scope.menuItems = [];
                    $scope.menuItemsAdded = [];
                    
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
                        
                        if (a == successData.length - 1) {
                            $scope.sortMenuItems();
                        }
                    }
                }).error(function () {
                    getMenuItems();
                });
            }
            
            var getBusinessPhoneNumber = function () {
                var paramsString = '_listingId='+$stateParams._businessId+'&listingType=Business';
                Listings.getPhoneNumberForListing(paramsString).success(function (successData) {
                    $scope.phone1 = (successData != null) ? successData[0].phone1: null;
                    console.log($scope.phone1);
                }).error(function (errorData) {
                    getBusinessPhoneNumber();
                });
            }
            
            $scope.changeOrderMethod = function (method) {
                $scope.currentOrderReadyToSubmit = (parseFloat($rootScope.currentOrderTrayTotal) > parseFloat(10.00) || (method == 'Collection' && parseFloat($rootScope.currentOrderTrayTotal) > parseFloat(0.00))) ? true: false;
                $scope.currentOrderMethod = method;
            }
            
            $scope.completeOrder = function () {
                if ($scope.currentOrderReadyToSubmit) {
                    $state.go('app.completeTakeawayOrder', {'_businessId': $stateParams._businessId});
                }
            }
            
            getMenuItems();
            if ($rootScope.callingEnabled && $scope._menuTypeId == 1) {
                getBusinessPhoneNumber();
            }
            $rootScope.finalMenuOrderObjCleanse($scope);
        }
        
        $rootScope.checkForAppInit($scope);
        
        //Updates based on Outside events
        $rootScope.$on('menuItem-order-changed', function(event, args) {
            $rootScope.finalMenuOrderObjCleanse($scope);
            getMenuItems();
            // do what you want to do
        })
        
    }])
    // See Menu Items//
    app.controller('SeeMenuItemsCtrl', ['$ionicHistory', '$rootScope', '$state','$scope', '$stateParams', 'MenuItems', '$ionicViewSwitcher', function($ionicHistory, $rootScope, $state, $scope, $stateParams, MenuItems, $ionicViewSwitcher) {
        // Set Up Variables
        $scope.rootScope = $rootScope;
        $scope.pageLoading = true;
        
        $scope.showExtraOptions = false;
        $scope.menuItems = [];
        $scope.normalMenuItems = [];
        $scope.categorizedMenuItems = [];
        $scope.menuItemsAdded = [];
        $scope.currentExtraOptions = [];
        $scope.currentExtraOptionsStage = 1;
        $scope.currentExtraOptionsComplete = false;
        
        $scope.$on('$ionicView.beforeEnter', function () {
            $rootScope.pageTitle = ($scope.pageTitle) ? $scope.pageTitle: $rootScope.pageTitle;
            
            $scope.windowHeight = (window.innerHeight-90);
        });
        
        $scope.pageLoad = function () {
            //Prepare Page Load Data
            var getMenuItems = function () {
                MenuItems.getMenuItems($stateParams._businessId, $stateParams._menuItemCategoryId, $stateParams._menuTypeId).success(function (successData) {
                    
                    if (successData == 'null') {
                        if ($rootScope.debugMode) {
                            console.log('getMenuItems in SeeBusinessMenuItems results are null: ');
                        }
                        return false;
                    }
                    
                    var menuLabel = ($stateParams._menuTypeId == 1) ? 'Takeaway': 'A la Carte';
                    $rootScope.pageTitle = $stateParams.listingName + ' '+successData[0].menuItemCategoryName+' ('+menuLabel+')';
                    $scope.pageTitle = $rootScope.pageTitle;
                    
                    var sortCategorizedAndNormalMenuItems = function () {
                        for (a = 0; a < $scope.menuItems.length; a++) {
                            if ($scope.menuItems[a].menuItemSubCategoryName != null) {
                                var existingArrayFound = false;
                                for (b = 0; b < $scope.categorizedMenuItems.length; b++) {
                                    if ($scope.categorizedMenuItems[b].subCatName == $scope.menuItems[a].menuItemSubCategoryName) {
                                        $scope.categorizedMenuItems[b].items.push($scope.menuItems[a]);
                                        existingArrayFound = true;
                                    }
                                }
                                if (!existingArrayFound) {
                                    $scope.categorizedMenuItems.push({subCatName: successData[a].menuItemSubCategoryName, items: [$scope.menuItems[a]]});
                                }
                            } else {
                                $scope.normalMenuItems.push($scope.menuItems[a]);
                            }
                            
                            if (a == $scope.menuItems.length - 1) {
                                window.setTimeout(function () {$scope.pageLoading = false;}, 150);
                            }
                        }
                    }
                    
                    $scope.menuItemCategoryName = successData[0].menuItemCategoryName;
                    for (a = 0; a < successData.length; a++) {
                        var tagsObj = {'tagName':successData[a].tagName, 'iconClass':successData[a].iconClass};
                        if ($scope.menuItemsAdded.indexOf(successData[a]._id) == -1) {
                            successData[a].tags = [tagsObj];
                            
                            //Check the rootScope order object to add already ordered items into this object
                            $rootScope.currentSavedFoodOrders = $rootScope.currentSavedFoodOrders || [];
                            for (b = 0; b < $rootScope.currentSavedFoodOrders.length; b++) {
                                if ($rootScope.currentSavedFoodOrders[b]._businessId == $stateParams._businessId) {
                                    var thisTakeawaysOrderObject = $rootScope.currentSavedFoodOrders[b];
                                    
                                    newOrder = false;
                                    var itemExistsInOrder = false;
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
                        else {
                            for (b = 0; b < $scope.menuItems.length; b++) {
                                if ($scope.menuItems[b]._id == successData[a]._id) {
                                    $scope.menuItems[b].tags.push(tagsObj);
                                }
                            }
                        }
                        
                        if (a == successData.length - 1) {
                            sortCategorizedAndNormalMenuItems();
                        }
                    }
                    
                }).error(function () {
                    getMenuItems();
                });
            }
            
            var specificItemsObjectMatch = function (obj1, obj2) {
                var returnBool = false;
                
                if(Object.prototype.toString.call( obj1.chosenOption ) === '[object Array]' ) {
                    var arrayCount1 = obj1.chosenOption.length;
                    var arrayCount2 = obj2.chosenOption.length;
                    var counter = 0;
                    
                    if (arrayCount1 == arrayCount2) {
                        for (a = 0; a < arrayCount1; a++) {
                            if (obj1.chosenOption[a].name == obj2.chosenOption[a].name) {
                                if (obj1.quantityRelevant && obj1.chosenOption[a].quantity == obj2.chosenOption[a].quantity) {
                                    counter += 1;
                                }
                                else if (!obj1.quantityRelevant) {
                                    counter += 1;
                                }
                            }
                        }
                        
                        if (counter == arrayCount1) {
                            returnBool = true;
                        }
                    }
                } else {
                    if (obj1._id == obj2._id && obj1.chosenOption.name == obj2.chosenOption.name) {
                        if (obj1.quantityRelevant && obj1.chosenOption.quantity == obj2.chosenOption.quantity) {
                            returnbool = true;
                        }
                        else if (!obj1.quantityRelevant) {
                            returnBool = true;
                        }
                    }
                }
                
                return returnBool;
            }
            
            $scope.deleteMenuItem = function (menuItem, item) {
                if (item.showMenuItemOptions == true) {
                    var relMenuItem;
                    
                    function finishDeletingSavedFoodOrder (relMenuItem) {
                        if (relMenuItem.quantity > 0) {
                            relMenuItem.quantity -= 1;
                        } else {
                            //$rootScope.currentSavedFoodOrders[relFoodOrderI].menuItems.splice(relMenuItemI, 1);
                        }
                        
                        $rootScope.$broadcast('menuItem-order-changed');
                        window.setTimeout(200, function () {$rootScope.finalMenuOrderObjCleanse($scope)});
                        item.showMenuItemDeleteOptions = false;
                    }
                    
                    function loopThroughSpecificItemsToDel (relMenuItem, b, c, specItemMatchCounter) {
                        if (specificItemsObjectMatch(relMenuItem.item.itemsAddedToBasket[b].specificItem[c], item.specificItem[c])) {
                            specItemMatchCounter += 1;
                        }
                        
                        if (c == (relMenuItem.item.itemsAddedToBasket[b].specificItem.length - 1)
                            && specItemMatchCounter == relMenuItem.item.itemsAddedToBasket[b].specificItem.length) {
                            finishDeletingSavedFoodOrder(relMenuItem);
                        }
                        else if (c == (relMenuItem.item.itemsAddedToBasket[b].specificItem.length - 1)
                            && specItemMatchCounter != relMenuItem.item.itemsAddedToBasket[b].specificItem.length
                            && b < relMenuItem.item.itemsAddedToBasket.length - 1) {
                            loopThroughBasketItemsToDel(relMenuItem, b+1);
                        }
                        else if (c < relMenuItem.item.itemsAddedToBasket[b].specificItem.length - 1) {
                            loopThroughSpecificItemsToDel(relMenuItem, b, c + 1, specItemMatchCounter);
                        }
                    }
                    
                    function loopThroughBasketItemsToDel (relMenuItem, b) {
                        if (relMenuItem.item.itemsAddedToBasket[b].specificItem.length > 0) {
                            loopThroughSpecificItemsToDel(relMenuItem, b, 0, 0);
                        }
                        else {
                            finishDeletingSavedFoodOrder(relMenuItem);
                        }
                    }
                    
                    function loopSavedFoodOrdersMenuItems (a, z) {
                        if ($rootScope.currentSavedFoodOrders[a].menuItems[z].item._id == menuItem._id) {
                            relMenuItem = $rootScope.currentSavedFoodOrders[a].menuItems[z];
                            relFoodOrderI = z;
                            relMenuItemI = a;
                            loopThroughBasketItemsToDel(relMenuItem, 0);
                        }
                        else if (z < $rootScope.currentSavedFoodOrders[a].menuItems.length - 1) {
                            loopSavedFoodOrdersMenuItems(a, z+1);
                        }
                    }
                    
                    function loopSavedFoodOrders(a) {
                        if ($rootScope.currentSavedFoodOrders[a]._businessId == $stateParams._businessId) {
                            loopSavedFoodOrdersMenuItems(a, 0);
                        }
                        else if (a < $rootScope.currentSavedFoodOrders.length - 1) {
                            loopSavedFoodOrders(a+1);
                        }
                    };
                    
                    //remove from main Food Orders Array
                    loopSavedFoodOrders(0);
                    
                    //remove from the page Scopes MenuItem array
                    function loopThroughBasketSpecificItemsToDel(a, b, d, c, allOptionsSame) {
                        var allOptionsSame = specificItemsObjectMatch(item.specificItem[d], $scope.menuItems[a].itemsAddedToBasket[b].specificItem[c]);
                        if (c == $scope.menuItems[a].itemsAddedToBasket[b].specificItem.length - 1
                            && d == item.specificItem.length - 1) {
                            if (allOptionsSame) {
                                $scope.menuItems[a].itemsAddedToBasket[b].quantity -= 1;
                                item.showMenuItemDeleteOptions = false;
                            }
                            if (d == item.specificItem.length - 1 && $scope.menuItems[a].itemsAddedToBasket[b].quantity == 0) {
                                $scope.menuItems[a].itemsAddedToBasket.splice(b, 1);
                            }
                        }
                        else if (d < item.specificItem.length - 1) {
                            loopThroughItemSpecificItemsToDel(a, b, d+1, c)
                        }
                        else if (c < $scope.menuItems[a].itemsAddedToBasket[b].specificItem.length - 1) {
                            loopThroughBasketSpecificItemsToDel(a, b, d, c+1, allOptionsSame);
                        }
                    }
                    
                    function loopThroughItemSpecificItemsToDel(a, b, d, c) {
                        var allOptionsSame = true;
                        loopThroughBasketSpecificItemsToDel(a, b, d, c, allOptionsSame);
                    }
                    
                    function loopThroughMenuBasketItemsToDel (a, b) {
                        if ($scope.menuItems[a].itemsAddedToBasket[b].specificItem.length > 0) {
                            loopThroughItemSpecificItemsToDel(a, b, 0, 0);
                        }
                        else {
                            if ($scope.menuItems[a].itemsAddedToBasket[b].quantity > 1) {
                                $scope.menuItems[a].itemsAddedToBasket[b].quantity -= 1;
                            }
                            else {
                                $scope.menuItems[a].itemsAddedToBasket.splice(b, 1);
                            }
                            
                            /* Shouldnt need
                            if (b < $scope.menuItems[a].itemsAddedToBasket.length - 1) {
                                loopThroughMenuBasketItemsToDel(a, b+1);
                            }
                            */
                        }
                    }
                    for (a = 0; a < $scope.menuItems.length; a++) {
                        if ($scope.menuItems[a]._id == menuItem._id) {
                            loopThroughMenuBasketItemsToDel(a, 0);
                        }
                    }
                }
                else {
                    item.showMenuItemOptions = true;
                }
            }
            
            $scope.completeAddingItemToOrder = function () {
                if (!$scope.currentExtraOptionsComplete) {
                    return false;
                }
                
                var newOrder = true;
                var itemHasNoOptions;
                
                $scope.showExtraOptions = false;
                $scope.currentItemBeingOrdered.oldSpecificItem = (!$scope.currentItemBeingAddedIsNew) ? $scope.currentItemBeingOrdered.specificItem: null;
                $scope.currentItemBeingOrdered.specificItem = $scope.currentExtraOptions;
                
                itemHasNoOptions = ($scope.currentItemBeingOrdered.specificItem.length == 0) ? true: false;
                
                $rootScope.currentSavedFoodOrders = $rootScope.currentSavedFoodOrders || [];
                
                $scope.currentItemBeingOrdered.showMenuItemOptions = false;
                $scope.currentItemBeingOrdered.menuItemOptions = "none";
                $scope.currentItemBeingOrderedQuantity = $scope.currentItemBeingOrdered.quantity;
                
                if ($scope.currentExtraOptionsChosenOption) {
                    $scope.currentExtraOptionsChosenOption.finalPrice = $scope.currentExtraOptionsPrice;
                }
                
                //process the optionChoices array and add the selected Option as a new property
                for (a = 0; a < $scope.currentItemBeingOrdered.specificItem.length; a++) {
                    if ($scope.currentItemBeingOrdered.specificItem[a].optionChoices != null) {
                        $scope.currentItemBeingOrdered.specificItem[a].chosenOption = ($scope.currentItemBeingOrdered.specificItem[a].type == 'Multi') ? []: $scope.currentItemBeingOrdered.specificItem[a].chosenOption;
                        for (b = 0; b < $scope.currentItemBeingOrdered.specificItem[a].optionChoices.length; b++) {
                            if ($scope.currentItemBeingOrdered.specificItem[a].optionChoices[b].preselected) {
                                $scope.currentItemBeingOrdered.specificItem[a].optionChoices[b].selected = true;
                                $scope.currentItemBeingOrdered.specificItem[a].selected = true;
                                if ($scope.currentItemBeingOrdered.specificItem[a].type == 'Only One') {
                                    $scope.currentItemBeingOrdered.specificItem[a].chosenOption = $scope.currentItemBeingOrdered.specificItem[a].optionChoices[b];
                                }
                                else if ($scope.currentItemBeingOrdered.specificItem[a].type == 'Multi') {
                                    $scope.currentItemBeingOrdered.specificItem[a].chosenOption = (isArray($scope.currentItemBeingOrdered.specificItem[a].chosenOption)) ? $scope.currentItemBeingOrdered.specificItem[a].chosenOption : [] ;
                                    $scope.currentItemBeingOrdered.specificItem[a].chosenOption.push($scope.currentItemBeingOrdered.specificItem[a].optionChoices[b]);
                                }
                            }
                        }
                    }
                }
                
                //add order to the rootScope order object
                for (a = 0; a < $rootScope.currentSavedFoodOrders.length; a++) {
                    if ($rootScope.currentSavedFoodOrders[a]._businessId == $stateParams._businessId) {
                        newOrder = false;
                        var itemExistsInOrder = false;
                        for (b = 0; b < $rootScope.currentSavedFoodOrders[a].menuItems.length; b++) {
                            if ($rootScope.currentSavedFoodOrders[a].menuItems[b].item._id == $scope.currentItemBeingOrdered._id) {
                                if ($scope.currentItemBeingAddedIsNew) {
                                    $rootScope.currentSavedFoodOrders[a].menuItems[b].quantity += 1;
                                }
                                itemExistsInOrder = true;
                            }
                        }
                        
                        if (!itemExistsInOrder) {
                            $rootScope.currentSavedFoodOrders[a].menuItems.push({'quantity': 1, 'item': $scope.currentItemBeingOrdered});
                        }
                    }
                }
                
                if (newOrder) {
                    $rootScope.currentSavedFoodOrders.push({
                        '_businessId': $stateParams._businessId,
                        'menuItems': [{'quantity': 1, 'item': $scope.currentItemBeingOrdered}]
                    });
                    $scope.thisTakeawaysOrderObject = $rootScope.currentSavedFoodOrders[0];
                }
                
                //add the item to the pages menu items
                
                function completeAddingItemIntoBasket (a, b, itemAlreadyInBasket, itemIsAnEditButNewItemNotInBasket) {
                    if (!itemAlreadyInBasket && itemHasNoOptions) {
                        $scope.menuItems[a].itemsAddedToBasket.push({'quantity': 1, 'specificItem': $scope.currentItemBeingOrdered.specificItem, 'finalPrice': $scope.currentItemBeingOrdered.Price});
                    }
                    else if (!itemAlreadyInBasket && !itemHasNoOptions && $scope.currentItemBeingAddedIsNew) {
                        //$scope.currentItemBeingOrdered.specificItem has the
                        // 'FinalPrice' property attached to it
                        $scope.menuItems[a].itemsAddedToBasket.push({'quantity': 1, 'specificItem': $scope.currentItemBeingOrdered.specificItem});
                    }
                    else if (!itemAlreadyInBasket && !itemHasNoOptions && !$scope.currentItemBeingAddedIsNew) {
                        itemIsAnEditButNewItemNotInBasket = true;
                    }
                    
                    if (!itemHasNoOptions && !$scope.currentItemBeingAddedIsNew) {
                        //Check if this is an item change, and if so, then remove the old item that it used to be
                        var indexToRemove = null;
                        for (d = 0; d < $scope.menuItems[a].itemsAddedToBasket.length; d++) {
                            indexToRemove = ($scope.menuItems[a].itemsAddedToBasket[d].isBeingEdited) ? d: indexToRemove;
                        }
                        if (indexToRemove != null && !itemIsAnEditButNewItemNotInBasket) {
                            $scope.menuItems[a].itemsAddedToBasket.splice(indexToRemove, 1);
                        }
                    }
                }
                
                function loopThroughSpecificItems (a, b, c, itemAlreadyInBasket, itemIsAnEditButNewItemNotInBasket, specItemMatchCounter) {
                    var addQuantityToSpecificItem = function () {
                        itemAlreadyInBasket = true;
                        if ($scope.currentItemBeingAddedIsNew) {
                            $scope.menuItems[a].itemsAddedToBasket[b].quantity += 1;
                        } else {
                            $scope.menuItems[a].itemsAddedToBasket[b].quantity += $scope.currentItemBeingOrderedQuantity;
                        }
                    }
                    
                    var objectMatchBool = specificItemsObjectMatch($scope.menuItems[a].itemsAddedToBasket[b].specificItem[c], $scope.currentItemBeingOrdered.specificItem[c]);
                    
                    if (objectMatchBool && !$scope.menuItems[a].itemsAddedToBasket[b].isBeingEdited) {
                        specItemMatchCounter += 1;
                    }
                    
                    if (specItemMatchCounter == $scope.menuItems[a].itemsAddedToBasket[b].specificItem.length) {
                        addQuantityToSpecificItem();
                    }
                    
                    if (c == $scope.menuItems[a].itemsAddedToBasket[b].specificItem.length - 1 && b < $scope.menuItems[a].itemsAddedToBasket.length - 1) {
                        loopItemsAddedToBasket(a, b + 1, itemAlreadyInBasket, itemIsAnEditButNewItemNotInBasket);
                    }
                    else if (c == $scope.menuItems[a].itemsAddedToBasket[b].specificItem.length - 1 && b == $scope.menuItems[a].itemsAddedToBasket.length - 1) {
                        completeAddingItemIntoBasket(a, b, itemAlreadyInBasket, itemIsAnEditButNewItemNotInBasket);
                    }
                    else if (c < $scope.menuItems[a].itemsAddedToBasket[b].specificItem.length - 1){
                        loopThroughSpecificItems(a, b, c + 1, itemAlreadyInBasket, itemIsAnEditButNewItemNotInBasket, specItemMatchCounter);
                    }
                }
                
                function loopItemsAddedToBasket (a, b, itemAlreadyInBasket, itemIsAnEditButNewItemNotInBasket) {
                    if ($scope.menuItems[a].itemsAddedToBasket[b].specificItem.length == 0 && itemHasNoOptions) {
                        //item already been ordered and has no options
                        $scope.menuItems[a].itemsAddedToBasket[b].quantity += 1;
                        itemAlreadyInBasket = true;
                        
                        completeAddingItemIntoBasket(a, b, itemAlreadyInBasket, itemIsAnEditButNewItemNotInBasket);
                    }
                    else if (!itemHasNoOptions) {
                        if ($scope.menuItems[a].itemsAddedToBasket[b].specificItem.length == $scope.currentItemBeingOrdered.specificItem.length) {
                            loopThroughSpecificItems(a, b, 0, itemAlreadyInBasket, itemIsAnEditButNewItemNotInBasket, 0);
                        } else {
                            if (b < $scope.menuItems[a].itemsAddedToBasket.length) {
                                loopItemsAddedToBasket(a, b + 1, itemAlreadyInBasket, itemIsAnEditButNewItemNotInBasket);
                            }
                            else {
                                completeAddingItemIntoBasket(a, b, itemAlreadyInBasket, itemIsAnEditButNewItemNotInBasket)
                            }
                        }
                        
                        if ($rootScope.debugMode) {console.log("ORDERS", $rootScope.currentSavedFoodOrders[0]);}
                        
                    }
                }
                
                function loopMenuItems (a, itemAlreadyInBasket, itemIsAnEditButNewItemNotInBasket) {
                    if ($scope.menuItems[a]._id == $scope.currentItemBeingOrdered._id) {
                        $scope.menuItems[a].itemsAddedToBasket = $scope.menuItems[a].itemsAddedToBasket || [];
                        
                        if ($scope.menuItems[a].itemsAddedToBasket.length > 0) {
                            loopItemsAddedToBasket(a, 0, itemAlreadyInBasket, itemIsAnEditButNewItemNotInBasket);
                        } else {
                            completeAddingItemIntoBasket(a, 0, itemAlreadyInBasket, itemIsAnEditButNewItemNotInBasket);
                        }
                    } else {
                        if (a < $scope.menuItems.length) {
                            loopMenuItems(a + 1);
                        }
                    }
                }
                
                loopMenuItems(0, false, false);
                
                window.setTimeout(function () {
                    //process the optionChoices array and remove unselected option choices
                    for (a = 0; a < $scope.currentItemBeingOrdered.specificItem.length; a++) {
                        $scope.currentItemBeingOrdered.specificItem[a].optionChoices = null;
                    }
                    
                    $scope.currentExtraOptions = [];
                    $scope.currentExtraOptionsStage = 1;
                }, 300);
                
                $rootScope.$broadcast('menuItem-order-changed');
                $rootScope.finalMenuOrderObjCleanse($scope);
                if ($rootScope.debugMode) {
                    console.log($rootScope.currentSavedFoodOrders);
                    console.log($scope.menuItems);
                }
                $scope.currentItemBeingOrdered.isBeingEdited = false;
            }
            
            $scope.addMenuItemToOrder = function (item) {
                $scope.currentItemBeingAddedIsNew = true;
                $scope.currentItemBeingOrdered = item;
                if (item._menuExtraOptionId == null) {
                    $scope.currentItemBeingOrdered.optionChoices = [];
                    $scope.currentItemBeingOrdered.finalPrice = item.Price;
                    $scope.currentExtraOptionsComplete = true;
                    $scope.completeAddingItemToOrder();
                }
                else {
                    $rootScope.appLoading = true;
                    $scope.currentExtraOptions = [];
                    $scope.currentExtraOptionsStage = 1;
                    $scope.currentExtraOptionsComplete = false;
                    $scope.currentExtraOptionsPrice = item.Price;
                    
                    var getMenuItemsExtraOptions = function () {
                        MenuItems.getMenuItemsExtraOptions($stateParams._businessId, item._id).success(function (successData) {
                            var menuExtraOptionsProcessed = [];
                            if ($rootScope.debugMode) {console.log(successData);}
                            for (a = 0; a < successData.length; a++) {
                                if (menuExtraOptionsProcessed.indexOf(successData[a]._menuExtraOptionId) == -1) {
                                    $scope.currentExtraOptions.push({
                                        'index': $scope.currentExtraOptions.length,
                                        '_id': successData[a]._menuExtraOptionId,
                                        'name': successData[a].menuExtraOptionName,
                                        'extraChargeIsPerUnit': (successData[a].extraChargeIsPerUnit == '1') ? true: false,
                                        'type': successData[a].Type,
                                        'priceRelevant': (successData[a].PriceRelevant == '1') ? true: false,
                                        'quantityRelevant': (successData[a].QuantityRelevant == '1') ? true: false,
                                        'selected': false,
                                        'preselected': false,
                                        'optionChoices': [{
                                            '_id': successData[a]._id,
                                            'name': successData[a].Name,
                                            'extraPrice': (successData[a].ExtraPrice == null) ? null : (parseFloat(successData[a].ExtraPrice)).formatMoney(2),
                                            'totalExtraPrice': (successData[a].totalExtraPrice == null) ? null: (parseFloat(successData[a].totalExtraPrice)).formatMoney(2),
                                            'selected': false,
                                            'preselected': false
                                        }]
                                    });
                                    menuExtraOptionsProcessed.push(successData[a]._menuExtraOptionId);
                                }
                                else {
                                    for (b = 0; b < $scope.currentExtraOptions.length; b++) {
                                        if ($scope.currentExtraOptions[b]._id == successData[a]._menuExtraOptionId) {
                                            $scope.currentExtraOptions[b].optionChoices.push({
                                                '_id': successData[a]._id,
                                                'name': successData[a].Name,
                                                'extraPrice': (successData[a].ExtraPrice == null) ? null: (parseFloat(successData[a].ExtraPrice)).formatMoney(2),
                                                'totalExtraPrice': (successData[a].totalExtraPrice == null) ? null : (parseFloat(successData[a].totalExtraPrice)).formatMoney(2),
                                                'selected': false,
                                                'preselected': false
                                            });
                                        }
                                    }
                                }
                                
                                if (a == successData.length - 1) {
                                    $rootScope.appLoading = false;
                                }
                            }
                            
                            $scope.showExtraOptions = true;
                        }).error(function () {
                            getMenuItemsExtraOptions();
                        });
                    }
                    getMenuItemsExtraOptions();
                }
            };
            
            $scope.changeMenuItemOptions = function (menuItem, item) {
                $rootScope.appLoading = true;
                
                $scope.currentItemBeingAddedIsNew = false;
                $scope.currentExtraOptionsPrice = parseFloat(item.specificItem[item.specificItem.length - 1].finalPrice);
                $scope.currentExtraOptionsPrice  = ($scope.currentExtraOptionsPrice).formatMoney(2);
                
                item.isBeingEdited = true;
                $scope.currentItemBeingOrdered = item;
                $scope.currentItemBeingOrdered._id = menuItem._id;
                $scope.currentExtraOptions = [];
                $scope.currentExtraOptionsComplete = false;
                
                var getMenuItemsExtraOptions = function () {
                    MenuItems.getMenuItemsExtraOptions($stateParams._businessId, menuItem._id).success(function (successData) {
                        var menuExtraOptionsProcessed = [];
                        for (a = 0; a < successData.length; a++) {
                            if (menuExtraOptionsProcessed.indexOf(successData[a]._menuExtraOptionId) == -1) {
                                var optionsIndex = $scope.currentExtraOptions.length;
                                var selectedVal = false;
                                if (isArray(item.specificItem[optionsIndex].chosenOption)) {
                                    for (z = 0; z < item.specificItem[optionsIndex].chosenOption.length; z++) {
                                        selectedVal = (item.specificItem[optionsIndex].chosenOption[z]._id == successData[a]._id) ? true: selectedVal;
                                    }
                                }
                                else {
                                    selectedVal = (item.specificItem[optionsIndex].chosenOption._id == successData[a]._id) ? true : selectedVal;
                                }
                                $scope.currentExtraOptions.push({
                                    'index': optionsIndex,
                                    '_id': successData[a]._menuExtraOptionId,
                                    'name': successData[a].menuExtraOptionName,
                                    'extraChargeIsPerUnit': (successData[a].extraChargeIsPerUnit == '1') ? true: false,
                                    'type': successData[a].Type,
                                    'priceRelevant': (successData[a].PriceRelevant == '1') ? true: false,
                                    'quantityRelevant': (successData[a].QuantityRelevant == '1') ? true: false,
                                    'selected': true,
                                    'preselected': true,
                                    'optionChoices': [{
                                        '_id': successData[a]._id,
                                        'name': successData[a].Name,
                                        'extraPrice': (successData[a].ExtraPrice == null) ? null : (parseFloat(successData[a].ExtraPrice)).formatMoney(2),
                                        'totalExtraPrice': (successData[a].totalExtraPrice == null) ? null: (parseFloat(successData[a].totalExtraPrice)).formatMoney(2),
                                        'selected': selectedVal,
                                        'preselected': selectedVal
                                    }],
                                    'chosenOption': item.specificItem[optionsIndex].chosenOption
                                });
                                menuExtraOptionsProcessed.push(successData[a]._menuExtraOptionId);
                            }
                            else {
                                for (b = 0; b < $scope.currentExtraOptions.length; b++) {
                                    if ($scope.currentExtraOptions[b]._id == successData[a]._menuExtraOptionId) {
                                        var selectedVal = false;
                                        if (isArray(item.specificItem[b].chosenOption)) {
                                            for (z = 0; z < item.specificItem[b].chosenOption.length; z++) {
                                                selectedVal = (item.specificItem[b].chosenOption[z]._id == successData[a]._id) ? true: selectedVal;
                                            }
                                        }
                                        else {
                                            selectedVal = (item.specificItem[b].chosenOption._id == successData[a]._id) ? true : selectedVal;
                                        }
                                        
                                        $scope.currentExtraOptions[b].optionChoices.push({
                                            '_id': successData[a]._id,
                                            'name': successData[a].Name,
                                            'extraPrice': (successData[a].ExtraPrice == null) ? null: (parseFloat(successData[a].ExtraPrice)).formatMoney(2),
                                            'totalExtraPrice': (successData[a].totalExtraPrice == null) ? null : (parseFloat(successData[a].totalExtraPrice)).formatMoney(2),
                                            'selected': selectedVal,
                                            'preselected': selectedVal
                                        });
                                    }
                                }
                            }
                            
                            if (a == successData.length - 1) {
                                $scope.currentExtraOptionsComplete = true;
                                $rootScope.appLoading = false;
                            }
                        }
                        
                        $scope.showExtraOptions = true;
                    }).error(function () {
                        getMenuItemsExtraOptions();
                    });
                }
                getMenuItemsExtraOptions();
            }
            
            $scope.addItemOrConfirm = function (menuItem, item) {
            
                if (item.showMenuItemOptions && item.menuItemOptions == "Add") {
                    item.quantity += 1;
                    item.showMenuItemOptions = false;
                    item.menuItemOptions = "none";
                    $rootScope.$broadcast('menuItem-order-changed');
                    $rootScope.finalMenuOrderObjCleanse($scope);
                }
                else if (item.showMenuItemOptions && item.menuItemOptions == "Delete") {
                    $scope.deleteMenuItem(menuItem, item);
                    item.showMenuItemOptions = false;
                    item.menuItemOptions = "none";
                    $rootScope.$broadcast('menuItem-order-changed');
                    $rootScope.finalMenuOrderObjCleanse($scope);
                }
                else {
                    item.showMenuItemOptions = true;
                    item.menuItemOptions = "Add";
                }
            };
            $scope.deleteItemOrCancel = function (menuItem, item) {
                if (item.showMenuItemOptions) {
                    item.showMenuItemOptions = false;
                    item.menuItemOptions = "none";
                }
                else {
                    item.showMenuItemOptions = true;
                    item.menuItemOptions = "Delete";
                }
            };
            $scope.closeExtraOptions = function () {
                $scope.showExtraOptions = false;
                $scope.currentExtraOptions = [];
                $scope.currentExtraOptionsStage = 1;
            }
            
            $scope.selectOptionNext = function (option) {
                option.preselected = !option.preselected;
                $scope.currentExtraOptionsStage += 1;
            }
            
            $scope.selectOptionChoice = function (option, optionChoice) {
                if (optionChoice == null) {
                    option.preselected = false;
                    return false;
                }
                
                if (option.type == 'Only One') {
                    optionChoice.preselected = !optionChoice.preselected;
                    option.preselected = !option.preselected;
                    $scope.currentExtraOptionsChosenOption = option;
                    
                    if (option.preselected) {
                        var allSelected = true;
                        for (a = 0; a < option.optionChoices.length; a++) {
                            if (!option.preselected) {
                                allSelected = false;
                            }
                        }
                        if (allSelected) {
                            $scope.currentExtraOptionsComplete = true;
                        }
                    }
                    else {
                        $scope.currentExtraOptionsComplete = false;
                    }
                    
                    $scope.currentExtraOptionsStage += 1;
                }
                else if (option.type == 'Multi') {
                    optionChoice.preselected = !optionChoice.preselected;
                    $scope.currentExtraOptionsChosenOption = option;
                }
                
                if (option.priceRelevant
                    && typeof(optionChoice.extraPrice) !== 'undefined'
                    && optionChoice.extraPrice != null
                    && option.preselected) {
                        $scope.currentExtraOptionsPrice = parseFloat($scope.currentExtraOptionsPrice) + parseFloat(optionChoice.extraPrice);
                        $scope.currentExtraOptionsPrice = ($scope.currentExtraOptionsPrice).formatMoney(2);
                    }
                else if (option.priceRelevant
                    && typeof(optionChoice.extraPrice) !== 'undefined'
                    && optionChoice.extraPrice != null
                    && !option.preselected) {
                        $scope.currentExtraOptionsPrice = parseFloat($scope.currentExtraOptionsPrice) - parseFloat(optionChoice.extraPrice);
                        $scope.currentExtraOptionsPrice = ($scope.currentExtraOptionsPrice).formatMoney(2);
                }
            }
            
            // Load Functions
            getMenuItems();
        }
        
        $rootScope.checkForAppInit($scope);
    }])
    // See Business Menu Items//
    app.controller('SeeBusinessMenuItemsCtrl', ['$ionicHistory', '$rootScope', '$state','$scope', '$stateParams', 'MenuItems', '$ionicViewSwitcher', function($ionicHistory, $rootScope, $state, $scope, $stateParams, MenuItems, $ionicViewSwitcher) {
        // Set Up Variables
        $scope.$on('$ionicView.enter', function() {
            var menuType = ($stateParams._menuTypeId == 1) ? 'BusinessTakeawayMenuItemCats': 'BusinessCarteMenuItemCats';
            $rootScope.currentTopRightState = 'app.addBusinessItem';
            $rootScope.topRightButtonFunction = function () {
                $state.go('app.addBusinessItem', {'itemType': menuType, '_secondaryItemTypeId': $stateParams._menuItemCategoryId});
            };
        })
        
        $scope.rootScope = $rootScope;
        $scope.itemType = 'OwnMenuItems';
        
        $scope.pageLoad = function () {
            $scope.nextPageFunction = function (menuItem) {
                $state.go('app.businessItem', {'_id': menuItem._id, 'itemType': $scope.itemType});
            }
            $scope.showExtraOptions = false;
            $scope.currentExtraOptions = [];
            $scope.currentExtraOptionsStage = 1;
            $scope.currentExtraOptionsComplete = false;
            
            //Prepare Page Load Data
            $scope.getMenuItems = function () {
                $scope.menuItems = [];
                $scope.normalMenuItems = [];
                $scope.categorizedMenuItems = [];
                $scope.menuItemsAdded = [];
                
                MenuItems.getMenuItems($stateParams._businessId, $stateParams._menuItemCategoryId, $stateParams._menuTypeId).success(function (successData) {
                    if (successData == 'null') {
                        if ($rootScope.debugMode) {console.log('getMenuItems in SeeBusinessMenuItems results: ', successData);}
                        return false;
                    }
                    $scope.menuItemCategoryName = successData[0].menuItemCategoryName;
                    for (a = 0; a < successData.length; a++) {
                        var tagsObj = {'tagName':successData[a].tagName, 'iconClass':successData[a].iconClass};
                        if ($scope.menuItemsAdded.indexOf(successData[a]._id) == -1) {
                            successData[a].tags = [tagsObj];
                            
                            //Check the rootScope order object to add already ordered items into this object
                            $rootScope.currentSavedFoodOrders = $rootScope.currentSavedFoodOrders || [];
                            for (b = 0; b < $rootScope.currentSavedFoodOrders.length; b++) {
                                if ($rootScope.currentSavedFoodOrders[b]._businessId == $stateParams._businessId) {
                                    var thisTakeawaysOrderObject = $rootScope.currentSavedFoodOrders[b];
                                    
                                    newOrder = false;
                                    var itemExistsInOrder = false;
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
                        else {
                            for (b = 0; b < $scope.menuItems.length; b++) {
                                if ($scope.menuItems[b]._id == successData[a]._id) {
                                    $scope.menuItems[b].tags.push(tagsObj);
                                }
                            }
                        }
                    }

                    for (a = 0; a < $scope.menuItems.length; a++) {
                        if ($scope.menuItems[a].menuItemSubCategoryName != null) {
                            var existingArrayFound = false;
                            for (b = 0; b < $scope.categorizedMenuItems.length; b++) {
                                if ($scope.categorizedMenuItems[b].subCatName == $scope.menuItems[a].menuItemSubCategoryName) {
                                    $scope.categorizedMenuItems[b].items.push($scope.menuItems[a]);
                                    existingArrayFound = true;
                                }
                            }
                            if (!existingArrayFound) {
                                $scope.categorizedMenuItems.push({subCatName: successData[a].menuItemSubCategoryName, items: [$scope.menuItems[a]]});
                            }
                        } else {
                            $scope.normalMenuItems.push($scope.menuItems[a]);
                        }
                    }
                    if ($rootScope.debugMode) {
                        console.log("po", $scope.normalMenuItems);
                        console.log("po", $scope.categorizedMenuItems);
                    }
                }).error(function () {
                    $scope.getMenuItems();
                });
            }
            
            $scope.getMenuItems();
        }
        
        $rootScope.checkForAppInit($scope);
        
        $rootScope.$on('menu-items-changed', function(event, args) {
            $scope.getMenuItems();
        })
        
    }])
    // See Menu Summary//
    app.controller('CompleteTakeawayOrderCtrl', ['$ionicHistory', '$rootScope', '$state','$scope', '$stateParams', 'MenuItems', '$ionicViewSwitcher', function($ionicHistory, $rootScope, $state, $scope, $stateParams, MenuItems, $ionicViewSwitcher) {
        // Set Up Variables
        $scope.rootScope = $rootScope;
        $scope._businessId = $stateParams._businessId;
        $scope.showEnterAddressPanel = false;
        $scope.menuItemsOrdered = [];
        
        
        $scope.pageLoad = function () {
            //Prepare Page Load Data
            //Check the rootScope order object to add already ordered items into this object
            $rootScope.currentSavedFoodOrders = $rootScope.currentSavedFoodOrders || [];
            for (b = 0; b < $rootScope.currentSavedFoodOrders.length; b++) {
                if ($rootScope.currentSavedFoodOrders[b]._businessId == $stateParams._businessId) {
                    $scope.currentTakeawaysOrderObject = $rootScope.currentSavedFoodOrders[b];
                    
                    for (c = 0; c < $rootScope.currentSavedFoodOrders[b].menuItems.length; c++) {
                        if ($rootScope.currentSavedFoodOrders[b].menuItems[c].item.specificItem.length > 0) {
                            $rootScope.currentSavedFoodOrders[b].menuItems[c].quantity = 0;
                            $rootScope.currentSavedFoodOrders[b].menuItems[c].item.finalPrice = 0;
                            for (d = 0; d < $rootScope.currentSavedFoodOrders[b].menuItems[c].item.itemsAddedToBasket.length; d++) {
                                $rootScope.currentSavedFoodOrders[b].menuItems[c].quantity += $rootScope.currentSavedFoodOrders[b].menuItems[c].item.itemsAddedToBasket[d].quantity;
                                
                                var optionChoicesLength = $rootScope.currentSavedFoodOrders[b].menuItems[c].item.itemsAddedToBasket[d].specificItem.length;
                                $rootScope.currentSavedFoodOrders[b].menuItems[c].item.finalPrice += parseFloat($rootScope.currentSavedFoodOrders[b].menuItems[c].item.itemsAddedToBasket[d].specificItem[optionChoicesLength - 1].finalPrice) * $rootScope.currentSavedFoodOrders[b].menuItems[c].item.itemsAddedToBasket[d].quantity;
                                
                            }
                        }
                    }
                    for (c = 0; c < $rootScope.currentSavedFoodOrders[b].menuItems.length; c++) {
                        if ($rootScope.currentSavedFoodOrders[b].menuItems[c].quantity == 0) {
                            $rootScope.currentSavedFoodOrders[b].menuItems.splice(c, 1);
                        }
                    }
                    
                    $scope.menuItemsOrdered = $rootScope.currentSavedFoodOrders[b].menuItems;
                    
                }
            }
            
            
            // Complete order Functions //
            
            var completeOrder = function () {
                var _profileId = ($rootScope.userLoggedIn) ? $rootScope.user._id: null;
                MenuItems.createOrder(_profileId, $scope._businessId, $scope.currentTakeawaysOrderObject).success(function (successData) {
                    $scope.showEnterPaymentDetailsPanel = false;
                }).error(function () {
                    completeOrder();
                });
            };
            
            $scope.enterPaymentInfo = function (cardNumber, expiryDate, startDate, nameOnCard) {
                
                $scope.currentTakeawaysOrderObject.userObject.cardNumber = expiryDate;
                $scope.currentTakeawaysOrderObject.userObject.expiryDate = expiryDate;
                $scope.currentTakeawaysOrderObject.userObject.startDate = startDate;
                $scope.currentTakeawaysOrderObject.userObject.nameOnCard = nameOnCard;
                
                $scope.showEnterAddressPanel = false;
                completeOrder();
            }
            
            $scope.enterUserDetails = function (name, email, phone, addressLine1, addressLine2, postCode) {
                $scope.showEnterPaymentDetailsPanel = true;
                
                $scope.currentTakeawaysOrderObject.userObject = {};
                $scope.currentTakeawaysOrderObject.userObject.name = name;
                $scope.currentTakeawaysOrderObject.userObject.email = email;
                $scope.currentTakeawaysOrderObject.userObject.phone = phone;
                $scope.currentTakeawaysOrderObject.userObject.addressLine1 = addressLine1;
                $scope.currentTakeawaysOrderObject.userObject.addressLine2 = addressLine2;
                $scope.currentTakeawaysOrderObject.userObject.postCode = postCode;
            }
            
            $scope.submitOrder = function () {
                if ($rootScope.userLoggedIn) {
                    completeOrder();
                } else {
                    $scope.showEnterAddressPanel = true;
                }
            }
        }
        
        $rootScope.checkForAppInit($scope);
    }])
