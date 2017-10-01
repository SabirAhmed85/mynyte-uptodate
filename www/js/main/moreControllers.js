// More //
app.controller('MoreCtrl', ['$rootScope', '$state', '$scope', '$ionicConfig', '$ionicPopup', '$ionicScrollDelegate', function($rootScope, $state, $scope, $ionicConfig, $ionicPopup, $ionicScrollDelegate) {
	// Set Up Variables & Constants
    $rootScope.hideSearch = true;
    $scope.rootScope = $rootScope;
    
    $scope.pageLoad = function () {};
    
    $rootScope.checkForAppInit($scope);
}])

// More //
app.controller('ExternalApiCtrl', ['$rootScope', '$state', '$scope', '$stateParams', '$ionicConfig', '$ionicPopup', '$ionicScrollDelegate', function($rootScope, $state, $scope, $stateParams, $ionicConfig, $ionicPopup, $ionicScrollDelegate) {
	// Set Up Variables & Constants
    $rootScope.hideSearch = true;
    $rootScope.externalView = true;
    $scope.rootScope = $rootScope;
    
    $scope.pageLoad = function () {
    	$scope.format = $stateParams.format;
    	$scope.isLightColourScheme = $stateParams.colorScheme == 'light';
    	$scope.widgetColourScheme = $stateParams.colorScheme + '-widget';
    };
    
    $rootScope.checkForAppInit($scope);
}])
