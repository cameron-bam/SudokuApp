angular.module('puzzlelist', [])
	.service('puzzleList', 
	[ function() {

				var puzzles = {};

				var requestStatus = '';

				this.setPuzzleInfo = function($http) {
					
					return $http({method: 'GET', url:'/puzzles/getpuzzlelist'})
							.then(
							function successCallBack(response) {
								puzzles = response.data;
								requestStatus = 'Success';
								return requestStatus;
							},
							function errorCallBack(response) {
								window.alert("Couldn't retrieve the list of puzzles!")
								requestStatus = 'Failure'
								return requestStatus;
							});
				};

				this.getPuzzleInfo = function() {
					return puzzles;
				}
			}
		]
	);