app.run(function ($state, $rootScope, $ionicHistory, $stateParams, $ionicConfig, userService, Profile) {
    $rootScope.$on('$stateChangeSuccess', function (evt, toState, $scope) {
        var currentViewName = toState.name;
        $rootScope.currentViewName = currentViewName;

        var allViewsObject = {
            "app.nlfeed" : {title: ''}
            , "app.profile" : {title: 'MyNyte'}
            , "app.resetPassword" : {title: 'Reset Password'}
            , "app.registerIntro" : {title: 'Sign-up'}
            , "app.register" : {title: 'Sign-up'}
            , "app.notificationsSummary" : {title: 'Notifications'}
            , "app.notification" : {title: 'Profile'}
            , "app.accountSettings" : {title: 'Profile Settings'}
            , "app.contactMyNyte" : {title: 'Contact the MyNyte Team'}
            , "app.offers" : {title: 'Offers'}
            , "app.nlfeedListings" : {title: 'Listings'}
            , "app.taxi" : {title: 'Taxi'}
            , "app.contacts" : {title: 'Contacts'}
            , "app.addContact" : {title: 'New Contact'}
            , "app.contactDetail" : {title: 'Profile'}
            , "app.businessItemSettings" : {title: 'Business Settings'}
            , "app.addBusinessItem" : {title: 'Profile'}
            , "app.completeTakeawayOrder" : {title: 'Profile'}
            , "app.more" : {title: 'Coming Soon ...'}
        };
        var showAssistantPanelViews = [
            "app.profile",
            "app.offers",
            "app.nlfeed",
            "app.taxi"
        ];
        var showSearchViews = [
            "app.nlfeed"
        ];
        var hideWhatsOpenFunctionViews = [
            "app.profile"
            , "app.registerIntro"
            , "app.register"
            , "app.notificationsSummary"
            , "app.notification"
            , "app.messageGroups"
            , "app.messageGroup"
            , "app.offers"
            , "app.offerDetail"
            , "app.nlfeedListings"
            , "app.nlfeedListing"
            , "app.taxi"
            , "app.contacts"
            , "app.addContact"
            , "app.contactDetail"
            , "app.businessItems"
            , "app.businessItem"
            , "app.businessItemSettings"
            , "app.addBusinessItem"
            , "app.seeMenu"
            , "app.seeMenuItems"
            , "app.seeBusinessMenuItems"
            , "app.completeTakeawayOrder"
            , "app.bookTable"
            , "app.more"
        ];
        var hideBackButtonViews = [
            "app.profile"
            ,"app.registerFinal"
            , "app.offers"
            , "app.nlfeed"
            , "app.taxi"
            , "app.more"
        ];
        var showTopRightButtonViews = [
            "app.messageGroups"
            , "app.contacts"
            , "app.contactDetail"
            , "app.businessItems"
            , "app.businessItem"
            , "app.seeBusinessMenuItems"
            , "app.accountSettingsAdvanced"
        ];
        var topRightButtonIsPlusViews = [
            , "app.messageGroups"
            , "app.contacts"
            , "app.seeBusinessMenuItems"
        ];
        var topRightButtonIsClockViews = [
            "app.nlfeed"
        ];
        var topRightButtonIsEditViews = [
            "app.contactDetail",
            "app.accountSettingsAdvanced"
        ];
        var topRightButtonIsSettingsViews = [
            "app.businessItems"
        ];
        var showTopRightMenuOrderTray = [
            "app.seeMenuItems"
        ];
        
        $rootScope.pageTitle = (typeof(allViewsObject[currentViewName]) !== 'undefined') ? allViewsObject[currentViewName]['title']: $rootScope.pageTitle;
        if (typeof(allViewsObject[currentViewName]) !== 'undefined') {
          $rootScope.$broadcast('view.enter', {viewName: currentViewName});
        }
        $rootScope.pageSubtitle = ($rootScope.currentViewName == "app.messageGroup") ? $rootScope.pageSubtitle: null;
        if ($rootScope.currentViewName != "app.messageGroup" && $rootScope.messageGroupTimer != null) {
            clearTimeout($rootScope.messageGroupTimer);
        }
        
        $rootScope.showAssistantButton = (showAssistantPanelViews.indexOf(currentViewName) == -1) ? false: true;
        $rootScope.showAssistantButton = (currentViewName == 'app.nlfeed' && ($rootScope.showHeaderButtons || $rootScope.showSearchPanel)) ? false: $rootScope.showAssistantButton;
        window.setTimeout(function () {
            $rootScope.assistantButtonActive = (showAssistantPanelViews.indexOf(currentViewName) == -1) ? false: true;
            }, 300);

        $rootScope.hideSearch = (showSearchViews.indexOf(currentViewName) != -1) ? false: true;
        $rootScope.hideSearch = (currentViewName == 'app.nlfeed' && $rootScope.showHeaderButtons) ? true: $rootScope.hideSearch;
        
        if (!$rootScope.hideSearch) {
            $('input#search-input').removeClass('isHidden').addClass('isVisible');
            $('.search-icon').addClass('isVisible');
        }

        $rootScope.searchActive = false;
        if (!$rootScope.hideSearch) {
            var timer = window.setTimeout(function () {
                $rootScope.searchActive = true;
            }, 500);
        }
        
        $rootScope.showStatsButton = false; /* This is only needed in one specific view, and so it is overwritten in that view*/
        
        $rootScope.hideTheWhatsOpenFunction = (hideWhatsOpenFunctionViews.indexOf(currentViewName) != -1) ? true: false;
        
        $rootScope.showBackButton = (hideBackButtonViews.indexOf(currentViewName) != -1) ? false: true;
        $ionicConfig.views.swipeBackEnabled(currentViewName != 'app.profile');
        
        $rootScope.showTopRightButton = (showTopRightButtonViews.indexOf(currentViewName) != -1) ? true: false;
        $rootScope.topRightButtonIsPlus = (topRightButtonIsPlusViews.indexOf(currentViewName) != -1) ? true: false;
        $rootScope.topRightButtonIsEdit = (topRightButtonIsEditViews.indexOf(currentViewName) != -1) ? true: false;
        $rootScope.topRightButtonIsClock = (topRightButtonIsClockViews.indexOf(currentViewName) != -1) ? true: false;
        $rootScope.topRightButtonIsSettings = ((topRightButtonIsSettingsViews.indexOf(currentViewName) != -1)
            && $stateParams.itemType == 'BusinessMenuItemCats') ? true: false;
        $rootScope.topRightButtonIsPlus = ($rootScope.topRightButtonIsSettings) ? false: $rootScope.topRightButtonIsPlus;
        $rootScope.showTopRightMenuOrderTray = (showTopRightMenuOrderTray.indexOf(currentViewName) != -1) ? true: false;
        
        if (currentViewName == "app.nlfeed") {
            $rootScope.topRightButtonFunction  = $rootScope.feedTopRightButtonFunction;
        }
        
        if (currentViewName == "app.messageGroup") {
            if (typeof(cordova) !== 'undefined') {
                if (cordova.plugins) {
                    cordova.plugins.Keyboard.disableScroll(false);
                }
            }
        } else if (typeof(cordova) !== 'undefined') {
            if (cordova.plugins) {
                cordova.plugins.Keyboard.disableScroll(true);
            }
        }
                
        $rootScope.goBackOne = function ($event) {
            $rootScope.currentlyEditing = false;
            $rootScope.editing = false;
            $rootScope.backButtonFunction();
            
            $rootScope.initialBackButtonFunction();
        }
        
        $rootScope.topRightTrayFunction = function () {}
        if ($rootScope.showTopRightMenuOrderTray) {
            $rootScope.topRightTrayFunction = function () {
                $rootScope.backButtonFunction();
                
                $rootScope.backButtonFunction = function () {
                    $ionicHistory.goBack();
                }
            }
        }
    });
    
    $rootScope.$on("$routeChangeStart", function (event, next, current) {
        if (sessionStorage.restorestate == "true") {
            alert('restoring');
            $rootScope.$broadcast('restorestate'); //let everything know we need to restore state
            sessionStorage.restorestate = false;
        }
    });
    
    //let everything know that we need to save state now.
    
    var appClosedCounter = 0;
    
    function handleBrowserCloseButton() {
        //$rootScope.$broadcast('savestate');
        //io.disconnect('http://localhost:3000/');
        if (appClosedCounter == 0) {
            appClosedCounter += 1;
            Profile.makeUserInactive($rootScope.user._profileId, $rootScope.user._oneSignalId).success(function () {
                    
            }).error(function () {
            
            });
            if ($rootScope.addBackActiveUserTimer == null) {
                $rootScope.addBackActiveUserTimer = window.setTimeout(function () {
                    $rootScope.makeUserActive();
                    $rootScope.addBackActiveUserTimer = null;
                }, 15000);
            }
            return 1+3;
        }
    }
    
    $(window).on('beforeunload', function() {
      return handleBrowserCloseButton();
    });
    
    document.addEventListener("pause", handleBrowserCloseButton, false);
    document.addEventListener("resign", handleBrowserCloseButton, false);
    window.onbeforeunload = function() {
      handleBrowserCloseButton();
    };
})
app.directive('menuCloseKeepHistory', ['$ionicHistory', function($ionicHistory) {
    return {
        restrict: 'AC',
        link: function($scope, $element) {
            $element.bind('click', function() {
                var sideMenuCtrl = $element.inheritedData('$ionSideMenusController');
                if (sideMenuCtrl) {
                    $ionicHistory.nextViewOptions({
                        historyRoot: false,
                        disableAnimate: true,
                        expire: 300
                    });
                    sideMenuCtrl.close();
                }
            });
        }
    };
}]);
app.directive('dir', function($compile, $parse) {
 return {
	restrict: 'E',
	link: function(scope, element, attr) {
	  scope.$watch(attr.content, function() {
		 element.html($parse(attr.content)(scope));
		 $compile(element.contents())(scope);
	  }, true);
	}
 }
});
app.directive('eatClickIf', ['$parse', '$rootScope',
  function($parse, $rootScope) {
    return {
      // this ensure eatClickIf is compiled before ngClick
      priority: 100,
      restrict: 'A',
      link: function($element, attr) {
        var fn = $parse(attr.eatClickIf);
        return {
          pre: function link(scope, element) {
            var eventName = 'click';
            element.on(eventName, function(event) {
              var callback = function() {
                if (fn(scope, {$event: event})) {
                  // prevents ng-click to be executed
                  event.stopImmediatePropagation();
                  // prevents href 
                  event.preventDefault();
                  return false;
                }
              };
              if ($rootScope.$$phase) {
                scope.$evalAsync(callback);
              } else {
                scope.$apply(callback);
              }
            });
          },
          post: function() {}
        }
      }
    }
  }
]);

app.directive('horizontalSlider', function ($ionicGesture, $rootScope) {
    
  return {
    link: function(scope, $element, attr) {
        $element.currentLeft = 0;
        var width;
        $element.isMainSearchSlider = $element.hasClass('nightfinder-horizontal-slider');
        $element.gestureRequired = 15;
        $element.negativeGestureRequired = -15;
        $element[0].slideLocked = false;

        if ($element.isMainSearchSlider) {
          $element.gestureRequired = 2;
          $element.negativeGestureRequired = -2;
        }

        /*
        $element.addClass('horizontal-slider');

        if (attr.$attr.imgSlider) {
            width = parseInt( ($element.children.length * 240) + 30);
        } else if (attr.$attr.feedShowingTimes) {
            width = parseInt( ($element.children.length * 90) + 5);
         } else {
            width = parseInt(attr.width) || 500;
        }
        */

        //$element[0].style.width = 'calc(100% - 36px)';
        // 100% - 35px

        var autoDragClickFn = function (e, val) {
            var direction = (val > 0) ? 1: -1;
            var elemLength = $('.nightfinder-horizontal-slider').find('.slider-option').length;
            var elements = $('.nightfinder-horizontal-slider').find('.slider-option');
            
            elements.each(function (index) {
                var dataInd = $(this).attr('data-index');
                var currentLeft = $(this).css('left');
                
                $(this).removeClass('index-' + dataInd);
                
                $(this).css({left: (currentLeft + (33.33*direction)) + '%'});
                
                dataInd = parseInt(dataInd) + direction;
                dataInd = (dataInd == 4) ? -1: dataInd;
                dataInd = (dataInd == -2) ? 3: dataInd;
                $(this).attr('data-index', dataInd);
                $(this).addClass('index-' + dataInd);
                if ($(this).attr('data-index') == 1) {
                    $rootScope.updateCurrentListingTypeToFind($(this).attr('data-name'), e, 'drag');
                }
                if (index == elemLength - 1) {
                    window.setTimeout(function () {
                        e.gesture.deltaX = 0;
                        scope.nightFindSlideLocked = false;
                    }, 400);
                }
            });
        }

        var clickFn = function (e) {
            if ($($element[0]).hasClass('index-1')) {return false};
            
            var val = 1;
            var name = $($element[0]).attr('data-name');
            
            if ($($element[0]).hasClass('index-2')) {
                val = - 1
            }
            
            var elements = $('.nightfinder-horizontal-slider').find('.slider-option');
            elements.each(function (index) {
                var dataInd = $(this).attr('data-index');
                var currentLeft = $(this).css('left');
                
                $(this).removeClass('index-' + dataInd);
                
                $(this).css({left: (currentLeft + (33.33*val)) + '%'});
                
                dataInd = parseInt(dataInd) + val;
                dataInd = (dataInd == 4) ? -1: dataInd;
                dataInd = (dataInd == -2) ? 3: dataInd;
                $(this).attr('data-index', dataInd);
                $(this).addClass('index-' + dataInd);
                
                if ($(this).attr('data-index') == 1) {
                    $rootScope.updateCurrentListingTypeToFind($(this).attr('data-name'), e, 'click');
                }
                
            });
            scope.nightFindSlideLocked = false;
        }

        var handleClickDrag = function (e) {
            scope.ionicScrollDelegate.getScrollView().options.scrollingY = false;
            
            if (
                (
                    e.gesture.deltaX > 5 || e.gesture.deltaX < -5
                )
                && scope.nightFindSlideLocked == false) {
                var elements = $('.nightfinder-horizontal-slider').find('.slider-option');
                elements.each(function (index) {
                    this.style[ionic.CSS.TRANSFORM] = 'translate3d(' + (Math.round(e.gesture.deltaX)) +'px, 0, 0)'
                });
                
                if ( ((e.gesture.deltaX < -10 || e.gesture.deltaX > 10) && !scope.nightFindSlideLocked) || !$element.isMainSearchSlider ) {
                    scope.nightFindSlideLocked = true;
                    var val = e.gesture.deltaX;
                    e.gesture.deltaX = 0;
                    elements.each(function (index) {
                        this.style[ionic.CSS.TRANSFORM] = 'translate3d(0, 0, 0)'
                    });
                    autoDragClickFn(e, val);
                }
            }
        }
        
        var releaseFn = function(e) {
          scope.ionicScrollDelegate.getScrollView().options.scrollingY = true;
        };

        /* These Functions may be needed for the movie showing times slider, not sure
        var handleDrag = function(e) {
          if ( (e.gesture.deltaX > 15 || e.gesture.deltaX < -15 ) || (e.gesture.deltaY == 0)) {
            if ( (e.gesture.deltaX > -40 || e.gesture.deltaX < 40) || !$element.isMainSearchSlider ) {
              $element[0].style[ionic.CSS.TRANSFORM] = 'translate3d(' + ($element.currentLeft + Math.round(e.gesture.deltaX)) +'px, 0, 0)'
            }
            if ($element.hasClass('slider-bounce')) { $element.removeClass('slider-bounce'); }
            scope.ionicScrollDelegate.getScrollView().options.scrollingY = false;

            if ($element.isMainSearchSlider && $element[0].slideLocked == false) {
              if (e.gesture.deltaX > 40) {
                $element.currentLeft += ( (window.screen.availWidth / 100) * 33.33);
                console.log("nup");
                $element[0].slideLocked = true;
              }
              else if (e.gesture.deltaX < -40) {
                $element.currentLeft -= ( (window.screen.availWidth / 100) * 33.33);
                console.log("ndown");
                $element[0].slideLocked = true;
              }

              if (e.gesture.deltaX > 40 || e.gesture.deltaX < -40) {console.log("nho");
                $element[0].style[ionic.CSS.TRANSFORM] = 'translate3d('+$element.currentLeft+'px, 0, 0)'
                var Timer = window.setTimeout(function () {
                  console.log("unlocked");
                  $element[0].slideLocked = false;
                }, 500);
              }
            }
          }
        };

        var releaseFn = function(e) {
          scope.ionicScrollDelegate.getScrollView().options.scrollingY = true;
          var pattern = new RegExp('translate3d\\((-?[0-9]*)px, 0px, 0px\\)');
          var transformMatches = pattern.exec($element.css(ionic.CSS.TRANSFORM));
          
          if (transformMatches == null) {
            return false;
          }

          left = Math.round(transformMatches[1]);

          if(left < (320 - width)) left = 320 - width;
          if(left > 0) left = 0;
          $element.addClass('slider-bounce');
        console.log("unlockdded");
          if ($element.isMainSearchSlider) {console.log("unlo;;;cked");
            var Timer = window.setTimeout(function () {
              console.log("unlocked");
              $element[0].slideLocked = false;
            }, 500);
            $element[0].style[ionic.CSS.TRANSFORM] = 'translate3d(' + $element.currentLeft + '%, 0, 0)';
          }
          else if (!$element.isMainSearchSlider) {
            $element[0].style[ionic.CSS.TRANSFORM] = 'translate3d(' + left + 'px, 0, 0)';
          }
        };
        */

        var click = $ionicGesture.on('click', clickFn, $element);
        var dragGesture = $ionicGesture.on('drag', handleClickDrag, $element);
        var releaseGesture = $ionicGesture.on('release', releaseFn, $element);
        //var dragGesture = $ionicGesture.on('drag', handleDrag, $element);
        scope.$on('$destroy', function() {
          $ionicGesture.off(click, 'click', clickFn);
          $ionicGesture.off(dragGesture, 'drag', handleClickDrag);
          $ionicGesture.off(releaseGesture, 'release', releaseFn);
        });
    }
  }
});

app.directive('taxiTypeSlider', function ($ionicGesture, $rootScope) {
    
  return {
    require: "^ngController",
    link: function(scope, $element, attr, ngCtrl) {
        var element = $('#taxi-type #taxi-type-slider')[0];
        var autoDragClickFn = function (e, val) {
            scope.ionicScrollDelegate.getScrollView().options.scrollingY = false;
            var direction = (val > 0) ? 1: -1;
            
            if (direction < 0 && $(element).hasClass("on-right")) {
                $(element).removeClass("on-right");
                ngCtrl.updateTaxiType(0);
                scope.$apply();
            }
            else if (direction > 0 && !$(element).hasClass("on-right")) {
                $(element).addClass("on-right");
                ngCtrl.updateTaxiType(1);
                scope.$apply();
            };
            
            window.setTimeout(function () {
                e.gesture.deltaX = 0;
            }, 400);
        }

        var handleClickDrag = function (e) {
            scope.ionicScrollDelegate.getScrollView().options.scrollingY = false;
            if ((e.gesture.deltaX > 0 && !$(element).hasClass("on-right")) || (e.gesture.deltaX < 0 && $(element).hasClass("on-right"))) {
                element.style[ionic.CSS.TRANSFORM] = 'translate3d(' + (Math.round(e.gesture.deltaX)) +'px, 0, 0)';
                
                if (e.gesture.deltaX < -15 || e.gesture.deltaX > 15) {
                    var val = e.gesture.deltaX;
                    element.style[ionic.CSS.TRANSFORM] = 'translate3d(0, 0, 0)';
                    autoDragClickFn(e, val);
                }
            }
        }
        
        var releaseFn = function (e) {
            element.style[ionic.CSS.TRANSFORM] = 'translate3d(0, 0, 0)';
            scope.ionicScrollDelegate.getScrollView().options.scrollingY = true;
        }
        
        var dragGesture = $ionicGesture.on('drag', handleClickDrag, $element);
        var releaseGesture = $ionicGesture.on('release', releaseFn, $element);
        
        scope.$on('$destroy', function() {
          $ionicGesture.off(dragGesture, 'drag', handleClickDrag);
          $ionicGesture.off(releaseGesture, 'release', releaseFn);
        });
    }
  }
});

app.directive('imgSlider', function ($ionicGesture, $rootScope) {
    
  return {
    link: function(scope, $element, attr) {
        $element.currentLeft = 0;

        var autoDragClickFn = function (e, val) {
            var direction = (val > 0) ? 1: -1;
            var elemLength = $('.mynyte-assistant-screen .detail-img').find('img').length;
            var elements = $('.mynyte-assistant-screen .detail-img').find('img');
            
            elements.each(function (index) {
                var dataInd = $(this).attr('data-index');
                var currentLeft = $(this).css('left');
                
                $(this).removeClass('index-' + dataInd);
                
                $(this).css({left: (currentLeft + (100*direction)) + '%'});
                
                dataInd = parseInt(dataInd) + direction;
                dataInd = (dataInd == 4) ? -1: dataInd;
                dataInd = (dataInd == -2) ? 3: dataInd;
                $(this).attr('data-index', dataInd);
                $(this).addClass('index-' + dataInd);
                if ($(this).attr('data-index') == 1) {
                    $rootScope.switchAssistantDetailImg(direction);
                }
                if (index == elemLength - 1) {
                    window.setTimeout(function () {
                        e.gesture.deltaX = 0;
                        $rootScope.assistantImgSlideLocked = false;
                    }, 400);
                }
            });
        }

        var handleClickDrag = function (e) {
            if (
                (
                    (e.gesture.deltaX > 5 && $rootScope.currentDetailImgIndex > 1)
                    || (e.gesture.deltaX < -5 && $rootScope.currentDetailImgIndex < $rootScope.currentDetailImgCount)
                )
                && $rootScope.assistantImgSlideLocked == false) {
                var elements = $('.mynyte-assistant-screen .detail-img').find('img');
                elements.each(function (index) {
                    this.style[ionic.CSS.TRANSFORM] = 'translate3d(' + (Math.round(e.gesture.deltaX)) +'px, 0, 0)'
                });
                
                if (
                    (e.gesture.deltaX < -10 || e.gesture.deltaX > 10)
                    && !$rootScope.assistantImgSlideLocked
                ) {
                    $rootScope.assistantImgSlideLocked = true;
                    var val = e.gesture.deltaX;
                    e.gesture.deltaX = 0;
                    elements.each(function (index) {
                        this.style[ionic.CSS.TRANSFORM] = 'translate3d(0, 0, 0)'
                    });
                    autoDragClickFn(e, val);
                }
            }
        }
        
        var dragGesture = $ionicGesture.on('drag', handleClickDrag, $element);
        
        scope.$on('$destroy', function() {
          $ionicGesture.off(dragGesture, 'drag', handleClickDrag);
        });
    }
  }
});

app.directive("ngFileSelect",function(){    
  return {
    link: function($scope,el){          
      el.bind("change", function(e){
        if (!e.srcElement.multiple) {
            $scope.files = [];
            $scope.file = null;
        }
        $scope.file = (e.srcElement || e.target).files[0];
        $scope.files = (e.srcElement || e.target).files;
        $scope.getFile();
      });          
    }
  }        
});
