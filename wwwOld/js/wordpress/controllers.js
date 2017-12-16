// wordpress controller // 
app.controller('WpCtrl', ['$scope', '$state', '$ionicSlideBoxDelegate', function($scope, $state, $ionicSlideBoxDelegate) {
  // Toggle left function for app sidebar
  	$scope.toggleLeft = function() {
    	$ionicSideMenuDelegate.toggleLeft();
  	};
	// sharing plugin
	$scope.shareArticle = function(title,url){
		window.plugins.socialsharing.share(title, null, null, url)
	}
	$scope.openLinkArticle = function(url){
		window.open(url, '_system');
	}
}])
/* 
another cool app function -- so we can call it directly from view page
*/
app.run(function($rootScope, globalFactory) {
	$rootScope.globalFunction = globalFactory;
});
/* Blog controller */
app.controller('WordpressBlogCtrl', ['$scope', 'WordPress', '$state', function($scope, WordPress, $state) {	

	$scope.heading = "WordPress";
	$scope.items = [];
	$scope.times = 1 ;
	$scope.postsCompleted = false;
	// load more content function
	$scope.getPosts = function(){
		WordPress.getPosts($scope.times)
		.success(function (posts) {
			$scope.items = $scope.items.concat(posts.posts);
			$scope.$broadcast('scroll.infiniteScrollComplete');
			$scope.times = $scope.times + 1;
			if(posts.posts.length == 0) {
				$scope.postsCompleted = true;
			}
		})
		.error(function (error) {
			$scope.items = [];
		});
	}
	// pull to refresh buttons
	$scope.doRefresh = function(){
		$scope.times = 1 ;
		$scope.items = [];
		$scope.postsCompleted = false;
		$scope.getPosts();
		$scope.$broadcast('scroll.refreshComplete');
	}
	$scope.showFullPost = function(index){
		WordPress.postSelected = $scope.items[index];
		$state.go('wordpress.post');
	}
}])
/* post controller */
app.controller('WordpressPostCtrl', ['$scope', 'WordPress', '$stateParams', '$sce', function($scope, WordPress, $stateParams, $sce) {	
	$scope.post = WordPress.postSelected;
	$scope.allContent = $sce.trustAsHtml($scope.post.content);
}])
/* category and tags controller */
app.controller('WordpressTagCtrl', ['$scope', '$state', 'WordPress', '$stateParams', function($scope, $state, WordPress, $stateParams) {
	
	$scope.type = $stateParams.type;	
	$scope.slug = $stateParams.slug;
	
	$scope.items = [];
	$scope.times = 1 ;
	$scope.postsCompleted = false;
	// load more content function
	$scope.getPosts = function(){
		WordPress.getPostsTaxonamy($scope.type, $scope.slug, $scope.times)
		.success(function (posts) {
			if($scope.type == 'tag'){
				$scope.heading = posts.tag.title;
			} else if($scope.type == 'category') {
				$scope.heading = posts.category.title;
			}
			$scope.items = $scope.items.concat(posts.posts);
			$scope.$broadcast('scroll.infiniteScrollComplete');
			$scope.times = $scope.times + 1;
			if(posts.posts.length == 0) {
				$scope.postsCompleted = true;
			}
		})
		.error(function (error) {
			$scope.items = [];
		});
	}
	// pull to refresh buttons
	$scope.doRefresh = function(){
		$scope.times = 1 ;
		$scope.items = [];
		$scope.postsCompleted = false;
		$scope.getPosts();
		$scope.$broadcast('scroll.refreshComplete');
	}
	$scope.showFullPost = function(index){
		WordPress.postSelected = $scope.items[index];
		$state.go('wordpress.post');
	}
}])
/* category and tags controller */
app.controller('WordpressCategoriesCtrl', ['$scope', 'WordPress', '$stateParams', function($scope, WordPress, $stateParams) {
		
	$scope.items = [];
	$scope.postsCompleted = false;
	// load more content function
	$scope.getPosts = function(){
		WordPress.getCategories()
		.success(function (posts) {
			$scope.items = $scope.items.concat(posts.categories);
			$scope.$broadcast('scroll.infiniteScrollComplete');
			$scope.postsCompleted = true;
		})
		.error(function (error) {
			$scope.items = [];
		});
	}
	// pull to refresh buttons
	$scope.doRefresh = function(){
		$scope.times = 1 ;
		$scope.items = [];
		$scope.getPosts();
		$scope.$broadcast('scroll.refreshComplete');
	}
}])
/* category and tags controller */
app.controller('WordpressTagsCtrl', ['$scope', 'WordPress', '$stateParams', function($scope, WordPress, $stateParams) {
		
	$scope.items = [];
	$scope.postsCompleted = false;
	// load more content function
	$scope.getPosts = function(){
		WordPress.getTags()
		.success(function (posts) {
			$scope.items = $scope.items.concat(posts.tags);
			$scope.$broadcast('scroll.infiniteScrollComplete');
			$scope.postsCompleted = true;
		})
		.error(function (error) {
			$scope.items = [];
		});
	}
	// pull to refresh buttons
	$scope.doRefresh = function(){
		$scope.times = 1 ;
		$scope.items = [];
		$scope.getPosts();
		$scope.$broadcast('scroll.refreshComplete');
	}
}])