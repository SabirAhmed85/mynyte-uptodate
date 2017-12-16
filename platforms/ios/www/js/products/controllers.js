angular.module('mobsocial.products')
// all products controller
.controller('ProductsController', [
	'$scope', '$state','Products', function(
	$scope, $state, Products) {
		$scope.items = [];
		$scope.times = 0 ;
		$scope.postsCompleted = false;
		// load more content function
		$scope.getPosts = function(){
			Products.getPosts()
			.success(function (posts) {
				$scope.items = $scope.items.concat(posts);
				$scope.$broadcast('scroll.infiniteScrollComplete');
				$scope.times = $scope.times + 1;
				$scope.postsCompleted = true;
			})
			.error(function (error) {
				$scope.items = [];
			});
		}
		// pull to refresh buttons
		$scope.doRefresh = function(){
			$scope.times = 0 ;
			$scope.items = [];
			$scope.postsCompleted = false;
			$scope.getPosts();
			$scope.$broadcast('scroll.refreshComplete');
		}
	}
])
/*   product controller  */
.controller('ProductController', [
	'$scope', '$stateParams', 'Products', function(
	$scope, $stateParams, Products) {	
		var product_id = $stateParams.productId;
		$scope.selected_ = {};
		$scope.items = [];
		$scope.details = true;
		// looping though all data and get particular product
		$scope.selectProduct = function(p){
			p.forEach(function(data) {
			    if(data._id == product_id){
			    	$scope.selected_ = data;

			    }
			});
		}
		// get all posts // try some function to get a single produt from server
		$scope.getPosts = function(){
			Products.getPosts()
			.success(function (posts) {
				$scope.items = $scope.items.concat(posts);
				$scope.selectProduct($scope.items);
			})
			.error(function (error) {
				$scope.items = [];
			});
		}
		$scope.getPosts();
		$scope.changeRev = function(){
			if($scope.details == true){
				$scope.details = false;
			} else {
				$scope.details = true;
			}
		}
	}

])