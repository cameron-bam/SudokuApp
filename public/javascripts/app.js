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
			templateUrl: 'partials/puzzle'
		}).otherwise({
			redirectTo: '/index'
		});
	}]);


	app.controller('GlobalController', ['$scope',
										'$routeParams',
										'sudokuBoardFactory', 
	function($scope, $routeParams, sudokuBoardFactory) {

		this.board = sudokuBoardFactory.board;

		$scope.clearBoard = this.board.clearBoard;
		$scope.getBoard = this.board.getBoard;

		$scope.$on('$routeChangeSuccess', function() {


			console.log('$routeParams.puzzleId: ' + $routeParams.puzzleId);

			
			$scope.clearBoard();
			
			if (typeof $routeParams.puzzleId !== 'undefined') {
				$scope.getBoard($routeParams.puzzleId);
			}
			
		});

	
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


	// controller for All Puzzles page
	app.controller('PuzzleListController',
		function(puzzleList) {
			
			this.puzzles = puzzleList.getPuzzleInfo();
			
		});

	// possibly unneccessary controller - all functionality is encompassed within global
	// controller
	app.controller('SudokuController', ['$scope', 
										'sudokuBoardFactory', 
	function($scope, sudokuBoardFactory) {
		this.board = sudokuBoardFactory.board;
	}]);

})();