$(document).ready(function() {

})

/**
 * Begin Angular Code
 */
var CleanSlateApp = angular.module('CatalystApp', []);
CleanSlateApp.controller('CatalystController', function ($scope) {

	/* Scope Variable Declaration */
	$scope.story_creation_input = {},
	$scope.current_view = 'featured'


	/* Scope Variable Initialization */
	$scope.story_creation_input = {
		first_name : '',
		last_name : '',
		email : '',
		region : '',
		group : '',
		catalyst_commitment : '',
		story : '',
		photo_url : ''
	},

	$scope.possible_views = ['featured', 'all', 'map', 'create', 'admin'],


	/**
	 * Called when a user clicks "submit" after creating a Catalyst Story.
	 * First we make sure the necessary fields were filled out, then this
	 * function calls an AJAX function to do the creation in the database.
	 */
	$scope.createStoryInDatabase = function() {
		$.ajax({
		    url : "create_story.php",
		    type: "POST",
		    data : $scope.story_creation_input,
		    success: function(data) {
		        $scope.current_view ='successful_story_creation'
		    }
		});
	}

	/**
	 * Called whenever a user clicks on a navigation component or the create
	 * button. Changes the current_view and the markup responds accordingly.
	 */
	$scope.changeViews = function(view) {
		$scope.current_view = view;
	}
});