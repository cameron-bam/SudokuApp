/*
	puzzlelist.js

	Author:  Cameron White

	Descprition:  	Responsible for retrieving and storing puzzle info used 
					by the All Puzzles page.


*/

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
								return true;
							},
							function errorCallBack(response) {
								window.alert("Couldn't retrieve the list of puzzles!");
								return false;
							});
				};

				this.getPuzzleInfo = function() {
					return puzzles;
				}
			}
		]
	);