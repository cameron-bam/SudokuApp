(function() {
	
	var app = angular.module('SudokuApp', ['sudokuboard']);

	app.config(function($locationProvider) {
		$locationProvider.html5Mode({
									  enabled: true,
									  requireBase: false
									});
	});


	app.controller('GlobalController', ['$scope', 
										'$location', 
										'sudokuBoardFactory', 
	function($scope, $location, sudokuBoardFactory) {

		this.board = sudokuBoardFactory.board;

		console.log($location.path());
	
	}]);

	app.controller('WelcomePageController', function() {
		
		var newPuzzleToday = false;

		if (newPuzzleToday) {
				this.puzzleMessage = "There's a new puzzle today!  Go checkout the featured puzzle page.";
			} 
		else {
				this.puzzleMessage = "No new puzzles today.  Check again tomorrow!";
			}
	});

	app.controller('SudokuController', ['$scope', 'sudokuBoardFactory', function($scope, sudokuBoardFactory) {
		
		this.board = sudokuBoardFactory.board;

	}]);

})();