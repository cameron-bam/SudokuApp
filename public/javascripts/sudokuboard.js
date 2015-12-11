angular.module('sudokuboard', []).factory('sudokuBoardFactory',['$http', function($http) {

	function Board() {
		var dim = 9;
		var level = 2;

		var make =  function (dim, lvl, arr, coord) {
				  if (lvl === 0) {
				  	return {val: ' ',
				  			partOfPuzzlePrompt: false};
				  }
				  if (!lvl) {
				  	lvl = dim;
				  }
				  if (!arr) {
				  	arr = [];
				  }
				  if (!coord) {
				  	coord = [];
				  }
				  for (var i = 0, l = dim; i < l; i += 1) {
				  	coord[lvl] = i;
				    arr[i] = make(dim, lvl - 1, arr[i], coord);
				  }
				  return arr;
			};

		var boardContents = make(dim, level);

		var selectedBox = [];

		var setBoxValue = function (boxCol, boxRow, value) {
				boardContents[boxCol][boxRow].val = value;
			};

		var setPuzzlePrompt = function (boxCol, boxRow, value) {
				setBoxValue(boxCol, boxRow, value);
				boardContents[boxCol][boxRow].partOfPuzzlePrompt = true;
			};

		var isValidNumber = function(value) {
			var number = Number(value);
			console.log('number:' + number + ' typeof:' + typeof number);
			if (isNaN(number)) {
				return false;
			} else if ((number > 0) && (number < 10)) {
				return true;
			} else {
				return false;
			}

		};

		$http({
				  method: 'GET',
				  url: '/getpuzzle/featured'
				}).then(function successCallback(response) {
					  
					  for (var col in response.data) {
					  	if (response.data.hasOwnProperty(col)) {
					  		var rows = response.data[col];
					  		for (var row in rows){
					  			if (rows.hasOwnProperty(row) && isValidNumber(rows[row])) {
					  				setPuzzlePrompt(col, row, rows[row]);
					  			}
					  		}
					  	}
					  }

	  			}, function errorCallback(response) {
	  				alert("Could not retreive puzzle!")
	  			});


		this.isPartOfPuzzle = function (boxCol, boxRow) {
				return boardContents[boxCol][boxRow].partOfPuzzlePrompt;
			};

		this.isSelectorActive = function (boxCol, boxRow) {
			//	console.log('checking if active: ' + regCol + ' ' + regRow + ' ' + boxCol + ' ' + boxRow);
				if ((selectedBox[0] === boxCol) 
				&& 	(selectedBox[1] === boxRow)
				&& 	(!this.isPartOfPuzzle(boxCol, boxRow))) {
					return true;
				} else {
					return false;
				}
			};

		this.toggleSelector = function (boxCol, boxRow) {
				if((selectedBox.length === 0) || (!this.isSelectorActive(boxCol, boxRow))) 
				{ 
					selectedBox = [boxCol, boxRow];
				} else {
					selectedBox = [];
				}
			};

		this.setBoxValue = setBoxValue;

		this.getBoxValue = function (boxCol, boxRow) {
				return boardContents[boxCol][boxRow].val;
			};
	}



	var board = new Board();
	
	return {
		board: board
	};
}]);