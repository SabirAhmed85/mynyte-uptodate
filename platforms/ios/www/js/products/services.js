angular.module('mobsocial.products')
.factory('Products', ['$http', 'Config', function($http, Config) {
	var data = {};
	data.getPosts = function () {
		return $http(
			{
				method: 'GET', url:Config.ProductUrl
			}
		);
	}
  	return data;
}]);