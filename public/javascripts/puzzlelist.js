angular.module('puzzlelist', ['ngResource'])
	.factory('puzzleListFactory', 
	['$resource', 
		function($resource) {
			return $resource('/puzzles/getpuzzlelist')
		}
	]
);