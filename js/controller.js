$(document).ready( function() {
	$('#preview-creation-story-header').click( function() {
		$('#preview-creation-story').slideDown();
	})
})

/**
 * Begin Angular Code
 */
var CleanSlateApp = angular.module('CatalystApp', []);
CleanSlateApp.controller('CatalystController', function ($scope) {

	/* ---- Scope Variable Declaration ---- */
	$scope.story_creation_input = {};
	$scope.current_view = '';
	$scope.card_types = [];
	$scope.regions = [];
	$scope.groups = [];
	$scope.all_stories = {};
	$scope.all_stories_selected_story = {};	
	$scope.featured_stories = {};
	$scope.map;


	/* ---- Methods ---- */
	/**
	 * Called at the bottom of the controller, this initializes all $scope variables. 
	 * The bottom portion of variables are initialized via prioritized asynchronous 
	 * calls to optimize the end user experience.
	 */
	$scope.initializeScopeVariables = function() {
		$scope.story_creation_input = { first_name : '', last_name : '', email : '', region : '', group : '', catalyst_commitment : '', story : '', photo_url : '' };
		$scope.possible_views = ['featured', 'all', 'map', 'create', 'admin'];
		$scope.current_view = 'featured',
		$scope.card_types = window.catalyst_objects.card_types;
		$scope.regions = window.catalyst_objects.regions;
		$scope.groups = window.catalyst_objects.groups;

		$scope.featured_stories = $scope.populateFeaturedStories();
		$scope.all_stories = $scope.populateAllStories();
		$scope.initializeMapView();
	}

	/**
	 * Called when a user clicks "submit" after creating a Catalyst Story.
	 * First we make sure the necessary fields were filled out, then this
	 * function calls an AJAX function to do the creation in the database.
	 */
	$scope.createStoryInDatabase = function() {
		console.log($scope.story_creation_input)
		$.ajax({
		    url : "server/create_story.php",
		    type: "POST",
		    data : $scope.story_creation_input,
		    success: function(data) {
		        $scope.current_view ='successful_story_creation'
		    }
		});
	};

	/**
	 * Called whenever a user clicks on a navigation component or the create
	 * button. Changes the current_view and the markup responds accordingly.
	 */
	$scope.changeViews = function(view) {
		$scope.current_view = view;
		if($scope.current_view === 'map') 
			$scope.initializeMapView();
	};

	/**
	 * Assigns a CSS class to change text color based on the catalyst card type
	 */
	$scope.assignTextColor = function(card_type) {
		switch(card_type) {
			case 0 : return 'catalyst-netapp-blue';
			case 1 : return 'catalyst-netapp-orange';
			case 2 : return 'catalyst-netapp-purple';
			case 3 : return 'catalyst-netapp-green';
		}
	}

	/**
	 * Pulls the featured stories from the database on document load and returns them in a 
	 * Format that is interpreted by the view to dipslay them under the 'Featured' tab
	 */
	$scope.populateFeaturedStories = function() {
		// $.ajax({
		//     url : "server/pull_featured_stories.php",
		//     type: "POST",
		//     data : "",
		//     success: function(data) {
		//     		// PLEASE RETURN DATA IN FOLLOWING JSON FORMAT 
		//   		//  sample_featured_stories : [
		// 			// 		{ id: 0000, first_name : 'Alek', last_name: 'Hurst', group : 0000, region : 0000, card_type : 0000, story : 'asdfasdfasdfasdfasdfasdf', photo_url : ''},
		// 			// 		{ id: 0001, first_name : 'Alek', last_name: 'Hurst', group : 0000, region : 0000, card_type : 0000, story : 'asdfasdfasdfasdfasdfasdf', photo_url : ''},
		// 			// 		{ id: 0002, first_name : 'Alek', last_name: 'Hurst', group : 0000, region : 0000, card_type : 0000, story : 'asdfasdfasdfasdfasdfasdf', photo_url : ''}
		// 			//  ]
		//         return parseSuccessData(data);
		//     }
		// });

		// Test case
		return parseSuccessData(window.catalyst_objects.sample_featured_stories);
		// End test case

		function parseSuccessData(data) {
			var featured_stories = [];
			var story = {};
			var i;

			for( i=0; i<data.length; i++) {
				story = {
					name : data[i].first_name + ' ' + data[i].last_name,
					group : $scope.groups[ data[i].group ].title,
					region : $scope.regions[ data[i].region ].title,
					card_type_img : $scope.card_types[ data[i].card_type ].img_url,
					card_type_id : data[i].card_type,
					story : data[i].story,
					photo_url : data[i].photo_url
				}
				featured_stories.push(story);
			}

			return featured_stories;
		}
	};	

	/**
	 * Pulls all of the stories from the database and stores them into the scope variable
	 * $scope.all_stories to be used in the 'All' view
	 */
	$scope.populateAllStories = function() {
		// $.ajax({
		//     url : "server/pull_all_stories.php",
		//     type: "POST",
		//     data : "",
		//     success: function(data) {
		//     		// PLEASE RETURN DATA IN FOLLOWING JSON FORMAT (same as featured stories)
		//   		//  sample_featured_stories : [
		// 			// 		{ id: 0000, first_name : 'Alek', last_name: 'Hurst', group : 0000, region : 0000, card_type : 0000, story : 'asdfasdfasdfasdfasdfasdf', photo_url : ''},
		// 			// 		{ id: 0001, first_name : 'Alek', last_name: 'Hurst', group : 0000, region : 0000, card_type : 0000, story : 'asdfasdfasdfasdfasdfasdf', photo_url : ''},
		// 			// 		{ id: 0002, first_name : 'Alek', last_name: 'Hurst', group : 0000, region : 0000, card_type : 0000, story : 'asdfasdfasdfasdfasdfasdf', photo_url : ''}
		// 			//  ]
		//         return parseSuccessData(data);
		//     }
		// });

		// Test case
		return parseSuccessData(window.catalyst_objects.sample_featured_stories);
		// End test case

		function parseSuccessData(data) {
			var all_stories = [];
			var story = {};
			var i;

			for( i=0; i<data.length; i++) {
				story = {
					name : data[i].first_name + ' ' + data[i].last_name,
					group : $scope.groups[ data[i].group ].title,
					group_id : data[i].group,
					region : $scope.regions[ data[i].region ].title,
					region_id : data[i].region,
					card_type_img : $scope.card_types[ data[i].card_type ].img_url,
					card_type_id : data[i].card_type,
					story : data[i].story,
					photo_url : data[i].photo_url
				}
				all_stories.push(story);
			}

			return all_stories;
		}
	};

	/**
	 * In all view when a user clicks on a story in the table on the right hand side, this
	 * function takes the data from that table row and creates a detailed story view underneath
	 * the table. 
	 */
	$scope.createSelectedStory = function(story) {
		console.log(story);
		$scope.all_stories_selected_story = {
			name : story.name,
			group : story.group,
			region : story.region,
			card_type_img : story.card_type_img,
			card_type_id : story.card_type_id,
			photo_url : story.photo_url,
			story : story.story,
		}
		console.log($scope.all_stories_selected_story)
	}

	/**
	 * When the map view is selected, this initializes the map data, charts, and statistics
	 */
	$scope.initializeMapView = function() {
		var marker_clusters;
		var markers = [];
		var mapOptions = {};

		if($scope.map) { 
			// Put this onto the event queue and resize/recenter the map 
			// when the user re-enters the map view
			setTimeout(function() {
				google.maps.event.trigger($scope.map, 'resize')
				$scope.map.setCenter(new google.maps.LatLng(25, 0));
			}, 0);	
		} else {
			var mapOptions = {
			    center: { lat: 25.00, lng: 0},
			    zoom: 2,
			};

			function addMarkers(address, i) {
				var geocoder = new google.maps.Geocoder();
				geocoder.geocode( { 'address': address}, function(results, status) {
				    if (status == google.maps.GeocoderStatus.OK) {
				        markers[i] = new google.maps.Marker({
				            map: $scope.map,
				            position: results[0].geometry.location
				        });
				    } else {
				        console.log('Geocode was not successful for the following reason: ' + status);
				    }
				});
			}

			$scope.map = new google.maps.Map(document.getElementById('catalyst-map-canvas'), mapOptions);
			
			for(i=0; i<$scope.all_stories.length; i++) {
				var latLng = new google.maps.LatLng( 
					$scope.regions[ $scope.all_stories[i].region_id ].location.lat, 
					$scope.regions[ $scope.all_stories[i].region_id ].location.lng);
				markers[i] = new google.maps.Marker({
		            map: $scope.map,
		            position: latLng
		        });
		    }

			marker_clusters = new MarkerClusterer($scope.map, markers);
		}
	}

	$scope.initializeScopeVariables(); // called when controller code is finished loading
});