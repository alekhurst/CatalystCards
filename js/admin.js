
var CatalystAdminApp = angular.module('CatalystAdminApp', []);
CatalystAdminApp.controller('CatalystAdminController', function ($scope) {
	$scope.card_types = [];
	$scope.regions = [];
	$scope.groups = [];
	$scope.all_stories = {};
	$scope.featured_stories = {};
	$scope.stats_view = {};

	/* ---- Methods ---- */
	/**
	 * Called at the bottom of the controller, this initializes all $scope variables. 
	 * The bottom portion of variables are initialized via prioritized asynchronous 
	 * calls to optimize the end user experience.
	 */
	$scope.initializeScopeVariables = function() {
		$scope.card_types = window.catalyst_objects.card_types;
		$scope.regions = window.catalyst_objects.regions;
		$scope.groups = window.catalyst_objects.groups;

		$scope.featured_stories = $scope.populateFeaturedStories(); 
		$scope.all_stories = $scope.populateAllStories();
	};

	/**
	 * Pulls all of the stories from the database and stores them into the scope variable
	 * $scope.all_stories to be used in the 'All' view
	 */
	$scope.populateAllStories = function() {
		$.ajax({
		    url : "server/pull_all_stories.php",
		    type: "POST",
		    data : "",
		    success: function(data) {
		        $scope.all_stories = parseSuccessData(JSON.parse(data));
		        $scope.$apply()
		    }
		});

		function parseSuccessData(data) {
			var all_stories = [];
			var story = {};
			var i;

			for( i=0; i<data.length; i++) {
				story = {
					id : data[i].uid,
					first_name : data[i].first_name,
					last_name : data[i].last_name,
					name : data[i].first_name + ' ' + data[i].last_name,
					manager : data[i].manager,
					group : $scope.groups[ data[i].group ].title,
					group_id : data[i].group,
					region : $scope.regions[ data[i].region ].title,
					region_id : data[i].region,
					card_type_img : $scope.card_types[ data[i].commitment ].img_url,
					card_type_id : data[i].commitment,
					story : data[i].story,
					photo_url : data[i].photo_url
				}
				all_stories.push(story);
			}

			return all_stories;
		}
	};

	/**
	 * Pulls the featured stories from the database on document load and returns them in a 
	 * Format that is interpreted by the view to dipslay them under the 'Featured' tab
	 */
	$scope.populateFeaturedStories = function() {
		$.ajax({
		    url : "server/pull_featured_stories.php",
		    type: "POST",
		    data : "",
		    success: function(data) {
		        $scope.featured_stories = parseSuccessData(JSON.parse(data));
		        $scope.$apply();
		    }
		});

		function parseSuccessData(data) {
			var featured_stories = [];
			var story = {};
			var i;

			for( i=0; i<data.length; i++) {
				story = {
					id : data[i].uid,
					first_name : data[i].first_name,
					manager : data[i].manager,
					name : data[i].first_name + ' ' + data[i].last_name,
					group : $scope.groups[ data[i].group ].title,
					region : $scope.regions[ data[i].region ].title,
					card_type_img : $scope.card_types[ data[i].commitment ].img_url,
					card_type_id : data[i].commitment,
					story : data[i].story,
					photo_url : data[i].photo_url
				}
				featured_stories.push(story);
			}

			return featured_stories;
		}
	};	

	$scope.deleteFeaturedStory = function(id) {
		$.ajax({
		    url : "server/delete_featured_story.php",
		    type: "POST",
		    data : { featured_id: id },
		    success: function(data) {
		    	$scope.populateFeaturedStories();    
		    }
		});
	}

	$scope.createFeaturedStory = function(story) {
		$.ajax({
		    url : "server/create_featured_story.php",
		    type: "POST",
		    data : { 
		    			time : story.id,
						first_name : story.first_name,
						last_name : story.last_name,
						manager : story.manager,
						group : story.group_id,
						region : story.region_id,
						commitment : story.card_type_id,
						story : story.story,
						photo_url : story.photo_url
				   },
		    success: function(data) {
		    	$scope.populateFeaturedStories();    
		    }
		});
	}

	$scope.updateRegionStats = function() {
		var i;
		$scope.stats_view.current_region_num_commitments = 0;
		$scope.stats_view.current_region_participation_percentage = 0;
		$scope.stats_view.current_region_candor_commitments = 0;
		$scope.stats_view.current_region_clarity_commitments = 0;
		$scope.stats_view.current_region_ownership_commitments = 0;
		$scope.stats_view.current_region_speed_commitments = 0;
		
		for(i=0; i<$scope.all_stories.length; i++) {
			if( $scope.stats_view.current_region == $scope.all_stories[i].region_id) {

				switch($scope.all_stories[i].card_type_id) {
					case '0' :
						$scope.stats_view.current_region_candor_commitments++;
						break;
					case '1' :
						$scope.stats_view.current_region_clarity_commitments++;
						break;
					case '2' : 
						$scope.stats_view.current_region_ownership_commitments++;
						break;
					case '3' :
						$scope.stats_view.current_region_speed_commitments++;
						break;
				}	
				$scope.stats_view.current_region_num_commitments++;
			}
			// need numbers for total employees in each location before this works
			// $scope.stats_view.current_region_participation_percentage = $scope.stats_view.current_region_num_commitments / TOTAL
		}
	}

	$scope.initializeScopeVariables();
});