// More //
app.controller('MoreCtrl', ['$rootScope', '$state', '$scope', '$ionicConfig', '$ionicPopup', '$ionicScrollDelegate', function($rootScope, $state, $scope, $ionicConfig, $ionicPopup, $ionicScrollDelegate) {
	// Set Up Variables & Constants
    $rootScope.hideSearch = true;
    $scope.rootScope = $rootScope;
    
    $scope.pageLoad = function () {};
    
    $rootScope.checkForAppInit($scope);
}])
