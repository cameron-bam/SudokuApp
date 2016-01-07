(function() {
	
	var app = angular.module('SudokuApp', ['sudokuboard', 'puzzlelist', 'ngRoute']);

	app.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.when('/allpuzzles', {
				templateUrl: '/partials/allpuzzles',
				controller: 'PuzzleListController',
				resolve: {
					requestStatus: function($http, puzzleList) {
						return puzzleList.setPuzzleInfo($http);
					}
				}
		}).when('/index', {
			templateUrl: '/partials/index',
			controller: 'WelcomePageController'
		}).when('/puzzles/:puzzleId', {
			templateUrl: 'partials/puzzle',
			resolve: {
				requestStatus: function(sudokuBoardFactory, $route) {
					return sudokuBoardFactory.setBoard($route.current.params.puzzleId);
				}
			}
		}).otherwise({
			redirectTo: '/index'
		});
	}]);


	// controller for the sudoku board.  needs to handle clicks to the whole page
	app.controller('GlobalController', ['$scope',
										'$routeParams',
										'sudokuBoardFactory', 
	function($scope, $routeParams, sudokuBoardFactory) {

		this.board = sudokuBoardFactory;
	
	}]);

	// controller for Welcome Page
	app.controller('WelcomePageController', function() {
		
		var newPuzzleToday = false;

		if (newPuzzleToday) {
				this.puzzleMessage = "There's a new puzzle today!  Go checkout the featured puzzle page.";
			} 
		else {
				this.puzzleMessage = "No new puzzles today.  Check again tomorrow!";
			}
	});


	// controller for All Puzzles page
	app.controller('PuzzleListController',
		function(puzzleList) {

			this.puzzles = puzzleList.getPuzzleInfo();
			
		});

})();