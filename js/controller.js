$(document).ready( function() {
	$('#preview-creation-story-header').click( function() {
		$('#preview-creation-story').slideDown();
	});

	$("#create-story-photo-upload").PictureCut({
        InputOfImageDirectory       : "uploaded-image",
        PluginFolderOnServer        : "/CatalystCards/lib/jquery.picture.cut/",
        FolderOnServer              : "/CatalystCards/images/story_images/",
        EnableCrop                  : true,
        CropWindowStyle             : "Bootstrap",
        CropModes				    : { widescreen: false, letterbox: true, free: false },
        CropOrientation			    : false,
        ImageButtonCSS			    : { border: "1px #CCC solid", width: 400, height: 300},
        UploadedCallback			: function(data) {
        	var scope = angular.element($("#create-story-photo-upload")).scope();
		    scope.$apply(function(){
		        scope.story_creation_input.photo_url = $("#uploaded-image").val();
		    })
        }
    });
})

/**
 * Begin Angular Code
 */
var CatalystApp = angular.module('CatalystApp', []);
CatalystApp.controller('CatalystController', function ($scope) {

	/* ---- Scope Variable Declaration ---- */
	$scope.story_creation_input = {};
	$scope.commitment_creation_input = {};
	$scope.current_view = '';
	$scope.card_types = [];
	$scope.regions = [];
	$scope.groups = [];
	$scope.all_stories = {};
	$scope.all_stories_selected_story = {};	
	$scope.all_commitments = {};
	$scope.featured_stories = {};
	$scope.current_story = {};
	$scope.map;


	/* ---- Methods ---- */
	/**
	 * Called at the bottom of the controller, this initializes all $scope variables. 
	 * The bottom portion of variables are initialized via prioritized asynchronous 
	 * calls to optimize the end user experience.
	 */
	$scope.initializeScopeVariables = function() {
		$scope.story_creation_input = { first_name : '', last_name : '', manager : '', region : '', group : '', catalyst_commitment : '', story : '', photo_url : '' };
		$scope.commitment_creation_input = { first_name : '', last_name : '', region : '', group : '', catalyst_commitment : '' };
		$scope.possible_views = ['featured', 'all', 'map', 'create', 'admin'];
		$scope.current_view = 'featured',
		$scope.card_types = window.catalyst_objects.card_types;
		$scope.regions = window.catalyst_objects.regions;
		$scope.groups = window.catalyst_objects.groups;

		$scope.featured_stories = $scope.populateFeaturedStories();
		$scope.all_stories = $scope.populateAllStories();
		$scope.all_commitments = $scope.populateAllCommitments();
	}

	/**
	 * Called when a user clicks "submit" after creating a Catalyst Story.
	 * First we make sure the necessary fields were filled out, then this
	 * function calls an AJAX function to do the creation in the database.
	 */
	$scope.createStoryInDatabase = function() {
		$.ajax({
		    url : "server/create_story.php",
		    type: "POST",
		    data : { 
		    			first_name : $scope.story_creation_input.first_name,
		    			last_name : $scope.story_creation_input.last_name,
		    			region : $scope.story_creation_input.region,
		    			group : $scope.story_creation_input.group,
		    			commitment : $scope.story_creation_input.catalyst_commitment,
		    			manager : $scope.story_creation_input.manager,
		    			photo_url : $scope.story_creation_input.photo_url,
		    			story : $scope.story_creation_input.story
		    		},
		    success: function(data) {
		        $scope.current_view ='featured';
		        $scope.populateAllStories();
		    }
		});
	};

	/**
	 * Called after a user is finished adding a commitment to the database
	 */
	$scope.createCommitmentInDatabase = function() {
		$.ajax({
		    url : "server/create_commitment.php",
		    type: "POST",
		    data : { 
		    			first_name : $scope.commitment_creation_input.first_name,
		    			last_name : $scope.commitment_creation_input.last_name,
		    			region : $scope.commitment_creation_input.region,
		    			group : $scope.commitment_creation_input.group,
		    			commitment : $scope.commitment_creation_input.catalyst_commitment,
		    		},
		    success: function(data) {
		        $scope.current_view ='map';
		        $scope.initializeMapView();
		        $scope.$apply();
		    }
		});
	}

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
		        $scope.current_story = $scope.featured_stories[0];
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

	/**
	 * Pulls all of the stories from the database and stores them into the scope variable
	 * $scope.all_stories to be used in the 'Stories' view
	 */
	$scope.populateAllStories = function() {
		$.ajax({
		    url : "server/pull_all_stories.php",
		    type: "POST",
		    data : "",
		    success: function(data) {
		        $scope.all_stories = parseSuccessData(JSON.parse(data));
		        $scope.all_stories_selected_story = $scope.all_stories[0];
		        $scope.$apply();
		    }
		});

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
	 * Pulls all of the commitments from the database and stores them into the scope variable
	 * $scope.all_commitments to be used in the 'Commitments' view
	 */
	$scope.populateAllCommitments = function() {
		$.ajax({
		    url : "server/pull_all_commitments.php",
		    type: "POST",
		    data : "",
		    success: function(data) {
		        $scope.all_commitments = parseSuccessData(JSON.parse(data));
		        $scope.$apply();
		        $scope.initializeMapView();
		    }
		});

		function parseSuccessData(data) {
			var all_commitments = [];
			var story = {};
			var i;
			for( i=0; i<data.length; i++) {
				story = {
					name : data[i].first_name + ' ' + data[i].last_name,
					group : $scope.groups[ data[i].group ].title,
					group_id : data[i].group,
					region : $scope.regions[ data[i].region ].title,
					region_id : data[i].region,
					card_type_img : $scope.card_types[ data[i].commitment ].img_url,
					card_type_id : data[i].commitment,
				}
				all_commitments.push(story);
			}

			return all_commitments;
		}
	}

	/**
	 * In all view when a user clicks on a story in the table on the right hand side, this
	 * function takes the data from that table row and creates a detailed story view underneath
	 * the table. 
	 */
	$scope.setCurrentStory = function(story) {
		$scope.current_story = {
			name : story.name,
			group : story.group,
			region : story.region,
			card_type_img : story.card_type_img,
			card_type_id : story.card_type_id,
			photo_url : story.photo_url,
			story : story.story,
		}
	}

	$scope.setCurrentlyViewingAllStory = function(story) {
		$scope.all_stories_selected_story = {
			name : story.name,
			group : story.group,
			region : story.region,
			card_type_img : story.card_type_img,
			card_type_id : story.card_type_id,
			photo_url : story.photo_url,
			story : story.story,
		}
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
			
			for(i=0; i<$scope.all_commitments.length; i++) {
				var latLng = new google.maps.LatLng( 
					$scope.regions[ $scope.all_commitments[i].region_id ].location.lat, 
					$scope.regions[ $scope.all_commitments[i].region_id ].location.lng);
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