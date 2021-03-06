(function() {
	
	var app = angular.module('SudokuApp', ['sudokuboard', 'puzzlelist', 'ngRoute', 'ngAnimate']);

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
		}).when('/about', {
			templateUrl: '/partials/about'
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
		
		this.puzzleMessage="Welcome to the sudoku app!  Go check out the all puzzles page!"
	});


	// controller for All Puzzles page
	app.controller('PuzzleListController',
		function(puzzleList) {

			this.puzzles = puzzleList.getPuzzleInfo();
			
		});

	app.controller('SavePuzzleController', 
		function($http, $scope, $location, sudokuBoardFactory) {

			this.saveBoard = function(currentBoard) {
				$http({
				  method: 'post',
				  data: {
					  	'puzzleInfo': $scope.saveBox.puzzleInfo,
					  	'board': currentBoard
				  		},
				  url: '/puzzles/saveNewPuzzle'
				}).then(function successCallBack(response) {
					alert($scope.saveBox.puzzleInfo.name + ' was saved successfully.');
					console.log('newPuzzleId: ' + response.data.newPuzzleId);
					$location.path('/puzzles/' + response.data.newPuzzleId);
				}, function errorCallBack(response) {
					alert($scope.saveBox.puzzleInfo.name + ' could not be saved!');
				} );
			};

		});

})();