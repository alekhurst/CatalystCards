var AddCommitmentApp = angular.module('AddCommitmentApp', []);
AddCommitmentApp.controller('AddCommitmentController', function ($scope) {
	$scope.card_types = [];
	$scope.regions = [];
	$scope.groups = [];
	$scope.commitment_creation_input = {};

	$scope.initializeScopeVariables = function() {
		$scope.card_types = window.catalyst_objects.card_types;
		$scope.regions = window.catalyst_objects.regions;
		$scope.groups = window.catalyst_objects.groups;
	}

	/**
	 * Called after a user is finished adding a commitment to the database
	 */
	$scope.createCommitmentInDatabase = function() {

		console.log($scope.commitment_creation_input)
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
		    success: function() { 
		    	window.location = 'index.html';
		    }
		});
	}

	$scope.initializeScopeVariables();
});