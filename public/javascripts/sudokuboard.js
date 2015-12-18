angular.module('sudokuboard', []).factory('sudokuBoardFactory',['$http', function($http) {

	function Board() {
		// private methods and variables

		var dim = 9;
		var level = 2;
		var initialBoxVal = ' ';
		var recursiveDepth = 0;

		var make =  function (dim, lvl, arr, coord) {
				  if (lvl === 0) {
				  	return {val: initialBoxVal,
				  			partOfPuzzlePrompt: false,
				  			possibleValues: [1,2,3,4,5,6,7,8,9]};
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

		var removePossibleValue = function (boxCol, boxRow, value) {
			var valIndex = boardContents[boxCol][boxRow].possibleValues.indexOf(value);
			
			if (valIndex >= 0) {
				boardContents[boxCol][boxRow].possibleValues.splice(valIndex, 1);
			}

		};

		var addPossibleValue = function (boxCol, boxRow, value) {
			if (boardContents[boxCol][boxRow].possibleValues.indexOf(value) < 0) {
				boardContents[boxCol][boxRow].possibleValues.push(value);
			}
		};

		var inPossibleValues = function (boxCol, boxRow, value) {
			if (boardContents[boxCol][boxRow].possibleValues.indexOf(value)) {
				return true;
			} else {
				return false;
			}
		};

		var isPossibleRegionValue = function (boxCol, boxRow, value) {
			var regLen = 3;

			var regionCol = Math.floor(boxCol/regLen) * regLen;
			var regionRow = Math.floor(boxRow/regLen) * regLen;

			for (var i = 0; i < regLen; i++) {
					curCol = regionCol + i;
					for (var j = 0; j < regLen; j++) { 
						curRow = regionRow + j;
						if (boardContents[curCol][curRow].val === value) {
							return false;
						}
					}
				}

			return true;

		};

		var isPossibleRowValue = function (boxCol, boxRow, value) {

			var boardLen = dim;


			for (var i = 0; i < boardLen; i++) {
				if (boardContents[i][boxRow].val === value) {
					return false;
				}
			}

			return true;

		};

		var isPossibleColValue = function (boxCol, boxRow, value) {
			var boardLen = dim;

			for (var i = 0; i < boardLen; i++) {
				if (boardContents[boxCol][i].val === value) {
					return false;
				}
			}

			return true;
		};

		var isPossibleValue = function (boxCol, boxRow, value) {
			if (isPossibleRegionValue(boxCol, boxRow, value) && isPossibleRowValue(boxCol, boxRow, value) && isPossibleColValue(boxCol, boxRow, value)) {
				return true;
			} else {
				return false;
			}

		};


		var clearBoxValue = function (boxCol, boxRow) {
			if (boardContents[boxCol][boxRow].val !== initialBoxVal) {
				
				var oldValue = boardContents[boxCol][boxRow].val;
				boardContents[boxCol][boxRow].val = initialBoxVal;

				var regLen = 3;

				var regionCol = Math.floor(boxCol/regLen) * regLen;
				var regionRow = Math.floor(boxRow/regLen) * regLen;

				var curRegion = 0;
				var curBox = 0;

				var curRow = 0;
				var curCol = 0;
				
			//	console.log('(boxCol, boxRow): (' + boxCol + ',' + boxRow + ') oldValue: ' + oldValue);

				// console.log('isPossibleColValue(boxCol, boxRow, oldValue): ' + isPossibleColValue(boxCol, boxRow, oldValue));

				if (isPossibleColValue(boxCol, boxRow, oldValue)) {
					for (var i = 0; i < regLen; i++) {
						curRegion = i * regLen;
					//	console.log('(regionCol, curRegion): (' + regionCol + ',' + curRegion + ') isPossibleRegionValue(regionCol, curRegion, oldValue): ' + isPossibleRegionValue(regionCol, curRegion, oldValue));
						if (curRegion !== regionRow && isPossibleRegionValue(regionCol, curRegion, oldValue)) {
							for (var j = 0; j < regLen; j++) {
								curBox = curRegion + j;
							//	console.log('(boxCol, curBox): (' + boxCol + ',' + curBox + ') isPossibleRowValue(boxCol, curBox, oldValue): ' + isPossibleRowValue(boxCol, curBox, oldValue));
								if (isPossibleRowValue(boxCol, curBox, oldValue)) {
									addPossibleValue(boxCol, curBox, oldValue);
								}
							}
						}
					}
				}

				// console.log('isPossibleRowValue(boxCol, boxRow, oldValue): ' + isPossibleRowValue(boxCol, boxRow, oldValue));

				if (isPossibleRowValue(boxCol, boxRow, oldValue)) {
					for (var i = 0; i < regLen; i++) {
						curRegion = i * regLen;
						if (curRegion !== regionCol && isPossibleRegionValue(curRegion, regionRow, oldValue)) {
							for (var j = 0; j < regLen; j++) {
								curBox = curRegion + j;
								if (isPossibleColValue(curBox, boxRow, oldValue)) {
									addPossibleValue(curBox, boxRow, oldValue);
								}
							}
						}
					}
				}

				// console.log('isPossibleRegionValue(boxCol, boxRow, oldValue): ' + isPossibleRegionValue(boxCol, boxRow, oldValue));

				if (isPossibleRegionValue(boxCol, boxRow, oldValue)) {
					for (var x = 0; x < regLen; x++) {
						curCol = regionCol + x;
						for (var y = 0; y < regLen; y++) {
							curRow = regionRow + y;
							if (isPossibleRowValue(curCol, curRow, oldValue) && isPossibleColValue(curCol, curRow, oldValue)) {
								addPossibleValue(curCol, curRow, oldValue);
							}
						}
					}
				}
			}	

		};

		var setBoxValue = function (boxCol, boxRow, value) {

			if (boardContents[boxCol][boxRow].val !== initialBoxVal) {
				clearBoxValue(boxCol, boxRow);
			}

			var regLen = 3;
			var boardLen = dim;

			var regionCol = Math.floor(boxCol/regLen) * regLen;
			var regionRow = Math.floor(boxRow/regLen) * regLen;

			var curCol = 0;
			var curRow = 0;

			for (var i = 0; i < regLen; i++) {
				curCol = regionCol + i;
				for (var j = 0; j < regLen; j++) {
					curRow = regionRow + j;
					removePossibleValue(curCol, curRow, value);
				}
			}

			for (var i = 0; i < boardLen; i++) {
				removePossibleValue(boxCol, i, value);
				removePossibleValue(i, boxRow, value);
			}

			boardContents[boxCol][boxRow].val = value;

		};

		var setPuzzlePrompt = function (boxCol, boxRow, value) {
				setBoxValue(boxCol, boxRow, value);
				boardContents[boxCol][boxRow].partOfPuzzlePrompt = true;
			};

		var isValidNumber = function(value) {
			var number = Number(value);
			if (isNaN(number)) {
				return false;
			} else if ((number > 0) && (number < 10)) {
				return true;
			} else {
				return false;
			}

		};


		// public methods
		this.clearBoxValue = clearBoxValue;

		this.setBoxValue = setBoxValue;

		this.isPossibleValue = isPossibleValue;

		this.getBoxValue = function(boxCol, boxRow) {
			return boardContents[boxCol][boxRow].val;
		}

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
		};

		this.logBoxDetails = function (boxCol, boxRow) {
			var boxVal = this.getBoxValue(boxCol, boxRow);
			console.log('coordinates: (' + boxCol + ',' + boxRow + ')');
			console.log('boxVal: "' + this.getBoxValue(boxCol, boxRow) + '"');
			console.log('typeof boxVal: ' + typeof boxVal);
			console.log('isPartOfPuzzle: ' + this.isPartOfPuzzle(boxCol, boxRow));
			console.log('isPossibleValue: ' + isPossibleValue(boxCol, boxRow, boxVal));
			console.log('inPossibleValues: ' + inPossibleValues(boxCol, boxRow, boxVal));
			console.log('possibleValues: ' + boardContents[boxCol][boxRow].possibleValues);
			console.log('isBoxValueValid: ' + this.isBoxValueValid(boxCol, boxRow, boxVal));
		};


		this.solvePuzzle = function() {
			var solved = false;
			var boardLen = dim;

			if ((recursiveDepth % 20) === 0) {
				console.log('currently at depth: ' + recursiveDepth);
			}

			var possibleValues = [];

			for (var x = 0; x < boardLen; x++) {
				for (var y = 0; y < boardLen; y++) {
					if (boardContents[x][y].val === initialBoxVal) {
					//	console.log('coordinates: ' + '(' + x + ',' + y + ')' + ' possibleValues: ' + boardContents[x][y].possibleValues);
						for (var i in boardContents[x][y].possibleValues) {
							recursiveDepth++;
					//		console.log('possibleValue: ' + boardContents[x][y].possibleValues[i]);
							setBoxValue(x, y, boardContents[x][y].possibleValues[i]);
							solved = this.solvePuzzle();
							recursiveDepth--;
							if (solved) {
								return solved;
							}
						}

						if (!solved) {
							clearBoxValue(x, y);
							return solved;
						}
					}
				}
			}

			return true;

		};


		this.attemptToSolve = function() {
			var isSolved = this.solvePuzzle();

			if (isSolved) {
				alert('The puzzle was solved!');
			} else {
				alert('Could not solve the puzzle with the current board!');
			}

		};

		this.resetBoard = function() {
			var boardLen = dim;
			for (var x = 0; x < boardLen; x++){
				for (var y = 0; y < boardLen; y++) {
					if (!this.isPartOfPuzzle(x, y)) {
						clearBoxValue(x, y);
					}
				}
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