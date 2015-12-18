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

		// private methods
		var boardContents = make(dim, level);

		var selectedBox = [];

		var setBoxValue = function (boxCol, boxRow, value) {
				boardContents[boxCol][boxRow].val = parseInt(value);
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


		// public methods
		this.setBoxValue = setBoxValue;

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

		this.getBoxValue = function (boxCol, boxRow) {
				return boardContents[boxCol][boxRow].val;
			};


		this.isBoxValueValid = function (boxCol, boxRow, boxVal) {
			boxVal = parseInt(boxVal);
			var regLen = 3;
			var rowLen = 9;
			var regionCol = Math.floor(boxCol/regLen) * regLen;
			var regionRow = Math.floor(boxRow/regLen) * regLen;
			var curCol = 0;
			var curRow = 0;

			for (var i = 0; i < regLen; i++) {
				curCol = regionCol + i;
				for (var j = 0; j < regLen; j++) {
					curRow = regionRow + j;
					if ((this.getBoxValue(curCol, curRow) === boxVal) && ((boxCol !== curCol) || (boxRow !== curRow))) {
							return false;
					}
				}
			}

			for (var i = 0; i < rowLen; i++) {
				if (((this.getBoxValue(boxCol, i) === boxVal) && (i !== boxRow)) || ((this.getBoxValue(i, boxRow) === boxVal) && (i !== boxCol))) {
					return false;
				}
			}

			return true;
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
					  				setPuzzlePrompt(col, row, parseInt(rows[row]));
					  			}
					  		}
					  	}
					  }

	  			}, function errorCallback(response) {
	  				alert("Could not retreive puzzle!")
	  			});


	}



	var board = new Board();
	
	return {
		board: board
	};
}]);