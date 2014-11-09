
var CatalystAdminApp = angular.module('CatalystAdminApp', []);
CatalystAdminApp.controller('CatalystAdminController', function ($scope) {
	$scope.card_types = [];
	$scope.regions = [];
	$scope.groups = [];
	$scope.all_stories = {};
	$scope.featured_stories = {};
	$scope.all_commitments = {};

	$scope.stats_view = {};
	$scope.stats_view_commitments = {};
	$scope.stats_viewg = {};
	$scope.stats_viewcg = {};
	$scope.geo_stats_viewc = {};
	$scope.geo_stats_view = {};



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
		$scope.geos = window.catalyst_objects.geos;

		$scope.featured_stories = $scope.populateFeaturedStories(); 
		$scope.all_stories = $scope.populateAllStories();
		$scope.all_commitments = $scope.populateAllCatalysts();
	};

	/**
	 * Pulls all of the stories from the database and stores them into the scope variable
	 * $scope.all_stories to be used in the 'All' view
	 */
	$scope.populateAllCatalysts = function() {
		$.ajax({
		    url : "server/pull_all_commitments.php",
		    type: "POST",
		    data : "",
		    success: function(data) {
		        $scope.all_commitments = parseSuccessData(JSON.parse(data));
		        $scope.$apply()
		        $scope.updateTotalCompanyStatsC();
		        $scope.$apply();
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
					group : $scope.groups[ data[i].group ].title,
					group_id : data[i].group,
					region : $scope.regions[ data[i].region ].title,
					geo : $scope.regions[ data[i].region ].geo,
					region_id : data[i].region,
					card_type_img : $scope.card_types[ data[i].commitment ].img_url,
					card_type_id : data[i].commitment,
				}
				all_stories.push(story);
			}
			return all_stories;
		}
	};

	$scope.populateAllStories = function() {
		$.ajax({
		    url : "server/pull_all_stories.php",
		    type: "POST",
		    data : "",
		    success: function(data) {
		        $scope.all_stories = parseSuccessData(JSON.parse(data));
		        $scope.$apply();
		        $scope.updateTotalCompanyStats();
		        $scope.$apply();
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
					geo : $scope.regions[ data[i].region ].geo,
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

			if(data) {
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


	$scope.updateTotalCompanyStats = function() {
		$scope.total_company_candor_commitments = 0;
		$scope.total_company_clarity_commitments = 0;
		$scope.total_company_ownership_commitments = 0;
		$scope.total_company_speed_commitments = 0;
		for(i=0; i<$scope.all_stories.length; i++) {
			switch($scope.all_stories[i].card_type_id) {
				case '0' :
					$scope.total_company_candor_commitments++;
					break;
				case '1' :
					$scope.total_company_clarity_commitments++;
					break;
				case '2' : 
					$scope.total_company_ownership_commitments++;
					break;
				case '3' :
					$scope.total_company_speed_commitments++;
					break;
			}
		}	
		$scope.total_company_participation = (( $scope.all_stories.length / 12185 ) * 100).toFixed(2);
	}

	$scope.updateTotalCompanyStatsC = function() {
		$scope.total_company_candor_commitmentsc = 0;
		$scope.total_company_clarity_commitmentsc = 0;
		$scope.total_company_ownership_commitmentsc = 0;
		$scope.total_company_speed_commitmentsc = 0;
		for(i=0; i<$scope.all_commitments.length; i++) {
			switch($scope.all_commitments[i].card_type_id) {
				case '0' :
					$scope.total_company_candor_commitmentsc++;
					break;
				case '1' :
					$scope.total_company_clarity_commitmentsc++;
					break;
				case '2' : 
					$scope.total_company_ownership_commitmentsc++;
					break;
				case '3' :
					$scope.total_company_speed_commitmentsc++;
					break;
			}
		}	
		$scope.total_company_participationc = (( $scope.all_commitments.length / 12185 ) * 100).toFixed(2);
	}

	$scope.updateGeoStats = function() {
		var i;
		$scope.geo_stats_view.current_geo_num_commitments = 0;
		$scope.geo_stats_view.current_geo_participation_percentage = 0;
		$scope.geo_stats_view.current_geo_candor_commitments = 0;
		$scope.geo_stats_view.current_geo_clarity_commitments = 0;
		$scope.geo_stats_view.current_geo_ownership_commitments = 0;
		$scope.geo_stats_view.current_geo_speed_commitments = 0;

		for(i=0; i<$scope.all_stories.length; i++) {
			if( $scope.geo_stats_view.current_geo.title == $scope.all_stories[i].geo) {
				switch($scope.all_stories[i].card_type_id) {
					case '0' :
						$scope.geo_stats_view.current_geo_candor_commitments++;
						break;
					case '1' :
						$scope.geo_stats_view.current_geo_clarity_commitments++;
						break;
					case '2' : 
						$scope.geo_stats_view.current_geo_ownership_commitments++;
						break;
					case '3' :
						$scope.geo_stats_view.current_geo_speed_commitments++;
						break;
				}	
				$scope.geo_stats_view.current_geo_num_commitments++;
			}
		}
		$scope.geo_stats_view.current_geo_participation_percentage = (( $scope.geo_stats_view.current_geo_num_commitments / $scope.geos[ $scope.geo_stats_view.current_geo.id ] .employees ) * 100).toFixed(2); 
	}

	$scope.updateGeoStatsC = function() {
		var i;
		$scope.geo_stats_viewc.current_geo_num_commitments = 0;
		$scope.geo_stats_viewc.current_geo_participation_percentage = 0;
		$scope.geo_stats_viewc.current_geo_candor_commitments = 0;
		$scope.geo_stats_viewc.current_geo_clarity_commitments = 0;
		$scope.geo_stats_viewc.current_geo_ownership_commitments = 0;
		$scope.geo_stats_viewc.current_geo_speed_commitments = 0;

		for(i=0; i<$scope.all_commitments.length; i++) {
			if( $scope.geo_stats_viewc.current_geo.title == $scope.all_commitments[i].geo) {

				switch($scope.all_commitments[i].card_type_id) {
					case '0' :
						$scope.geo_stats_viewc.current_geo_candor_commitments++;
						break;
					case '1' :
						$scope.geo_stats_viewc.current_geo_clarity_commitments++;
						break;
					case '2' : 
						$scope.geo_stats_viewc.current_geo_ownership_commitments++;
						break;
					case '3' :
						$scope.geo_stats_viewc.current_geo_speed_commitments++;
						break;
				}	
				$scope.geo_stats_viewc.current_geo_num_commitments++;
			}
		}
		$scope.geo_stats_viewc.current_geo_participation_percentage = (( $scope.geo_stats_viewc.current_geo_num_commitments / $scope.regions[$scope.geo_stats_viewc.current_geo.id].employees ) * 100).toFixed(2);	
    }

	$scope.updateRegionStats = function() {
		var i;
		$scope.stats_view.current_region_num_commitments = 0;
		$scope.stats_view.current_region_participation_percentage = 0;
		$scope.stats_view.current_region_candor_commitments = 0;
		$scope.stats_view.current_region_clarity_commitments = 0;
		$scope.stats_view.current_region_ownership_commitments = 0;
		$scope.stats_view.current_region_speed_commitments = 0;

		for(i=0; i<$scope.all_commitments.length; i++) {
			if( $scope.stats_view.current_region == $scope.all_commitments[i].region_id) {

				switch($scope.all_commitments[i].card_type_id) {
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
		}
		$scope.stats_view.current_region_participation_percentage = (( $scope.stats_view.current_region_num_commitments / $scope.regions[$scope.stats_view.current_region].employees ) * 100).toFixed(2);
	}

	$scope.updateRegionStatsC = function() {
		var i;
		$scope.stats_view_commitments.current_region_num_commitments = 0;
		$scope.stats_view_commitments.current_region_participation_percentage = 0;
		$scope.stats_view_commitments.current_region_candor_commitments = 0;
		$scope.stats_view_commitments.current_region_clarity_commitments = 0;
		$scope.stats_view_commitments.current_region_ownership_commitments = 0;
		$scope.stats_view_commitments.current_region_speed_commitments = 0;
		
		for(i=0; i<$scope.all_commitments.length; i++) {
			if( $scope.stats_view_commitments.current_region == $scope.all_commitments[i].region_id) {

				switch($scope.all_commitments[i].card_type_id) {
					case '0' :
						$scope.stats_view_commitments.current_region_candor_commitments++;
						break;
					case '1' :
						$scope.stats_view_commitments.current_region_clarity_commitments++;
						break;
					case '2' : 
						$scope.stats_view_commitments.current_region_ownership_commitments++;
						break;
					case '3' :
						$scope.stats_view_commitments.current_region_speed_commitments++;
						break;
				}	
				$scope.stats_view_commitments.current_region_num_commitments++;
			}
		}
		$scope.stats_view_commitments.current_region_participation_percentage = (( $scope.stats_view_commitments.current_region_num_commitments / $scope.regions[$scope.stats_view_commitments.current_region].employees ) * 100).toFixed(2);
	}

	$scope.updateGroupStats = function() {
		var i;
		$scope.stats_viewg.current_group_num_commitments = 0;
		$scope.stats_viewg.current_group_participation_percentage = 0;
		$scope.stats_viewg.current_group_candor_commitments = 0;
		$scope.stats_viewg.current_group_clarity_commitments = 0;
		$scope.stats_viewg.current_group_ownership_commitments = 0;
		$scope.stats_viewg.current_group_speed_commitments = 0;
		
		for(i=0; i<$scope.all_stories.length; i++) {
			if( $scope.stats_viewg.current_group == $scope.all_stories[i].group_id) {

				switch($scope.all_stories[i].card_type_id) {
					case '0' :
						$scope.stats_viewg.current_group_candor_commitments++;
						break;
					case '1' :
						$scope.stats_viewg.current_group_clarity_commitments++;
						break;
					case '2' : 
						$scope.stats_viewg.current_group_ownership_commitments++;
						break;
					case '3' :
						$scope.stats_viewg.current_group_speed_commitments++;
						break;
				}	
				$scope.stats_viewg.current_group_num_commitments++;
			}
		}
		$scope.stats_viewg.current_group_participation_percentage = (( $scope.stats_viewg.current_group_num_commitments / $scope.groups[$scope.stats_viewg.current_group].employees ) * 100).toFixed(2);
	}

	$scope.updateGroupStatsC = function() {
		var i;
		$scope.stats_viewgc.current_group_num_commitments = 0;
		$scope.stats_viewgc.current_group_participation_percentage = 0;
		$scope.stats_viewgc.current_group_candor_commitments = 0;
		$scope.stats_viewgc.current_group_clarity_commitments = 0;
		$scope.stats_viewgc.current_group_ownership_commitments = 0;
		$scope.stats_viewgc.current_group_speed_commitments = 0;
		
		for(i=0; i<$scope.all_commitments.length; i++) {
			if( $scope.stats_viewgc.current_group == $scope.all_commitments[i].group_id) {

				switch($scope.all_commitments[i].card_type_id) {
					case '0' :
						$scope.stats_viewgc.current_group_candor_commitments++;
						break;
					case '1' :
						$scope.stats_viewgc.current_group_clarity_commitments++;
						break;
					case '2' : 
						$scope.stats_viewgc.current_group_ownership_commitments++;
						break;
					case '3' :
						$scope.stats_viewgc.current_group_speed_commitments++;
						break;
				}	
				$scope.stats_viewgc.current_group_num_commitments++;
			}
		}
		$scope.stats_viewgc.current_group_participation_percentage = (( $scope.stats_viewgc.current_group_num_commitments / $scope.groups[$scope.stats_viewgc.current_group].employees ) * 100).toFixed(2); 
	}

	$scope.initializeScopeVariables();
});