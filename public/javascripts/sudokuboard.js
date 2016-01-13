/*
	sudokuboard.js

	Author:  Cameron White

	Descprition:  	Responsible for managing the sudokuboard data (stored in boardContents)
					and for providing methods used to handle user interactions with the 
					game board.
*/


angular.module('sudokuboard', []).factory('sudokuBoardFactory',['$http', function($http) {

	function Board() {
		// private methods and variables

		var dim = 9;
		var level = 2;
		var initialBoxVal = ' ';
		var recursiveDepth = 0;
		var hintMode = false;
		var puzzleId;
		var displaySaveBox = false;

		/* create the board data and store it in boardContents */
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


		/* methods used to manage possible values for each square */
		
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


		/* clear an individual value on the board and update possible values of other boxes */
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
				
				if (isPossibleColValue(boxCol, boxRow, oldValue)) {
					for (var i = 0; i < regLen; i++) {
						curRegion = i * regLen;
						if (curRegion !== regionRow && isPossibleRegionValue(regionCol, curRegion, oldValue)) {
							for (var j = 0; j < regLen; j++) {
								curBox = curRegion + j;
								if (isPossibleRowValue(boxCol, curBox, oldValue)) {
									addPossibleValue(boxCol, curBox, oldValue);
								}
							}
						}
					}
				}

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

		/* set a single value of a box on the board and update the possible values of the other boxes */
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

		/* used to set a box value and make the value uneditable to the user during a puzzle attempt */
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

		/* used to get value of an individual box from the view */
		this.getBoxValue = function(boxCol, boxRow) {
			return boardContents[boxCol][boxRow].val;
		}

		/* used to determine if a user can edit a box from the view */
		this.isPartOfPuzzle = function (boxCol, boxRow) {
			return boardContents[boxCol][boxRow].partOfPuzzlePrompt;
		};

		/* used to determine if the number selector for an individual box is currently active */
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

		/* used to activate/deactivate the number selector on an individual box */
		this.toggleSelector = function (boxCol, boxRow, clickEvent) {

			if (((selectedBox.length === 0) || (!this.isSelectorActive(boxCol, boxRow))) && (typeof boxCol === 'number') && (typeof boxRow === 'number'))
			{ 
				selectedBox = [boxCol, boxRow];
			} else {
				selectedBox = [];
			}

			clickEvent.stopPropagation();
		};

		/* used to determine if there are invalid values on the board */
		this.isBoxValueValid = function (boxCol, boxRow) {
			boxVal = boardContents[boxCol][boxRow].val;
			var regLen = 3;
			var rowLen = 9;
			var regionCol = Math.floor(boxCol/regLen) * regLen;
			var regionRow = Math.floor(boxRow/regLen) * regLen;
			var curCol = 0;
			var curRow = 0; 

			// check for empty box
			if ((boxVal === initialBoxVal) || boardContents[boxCol][boxRow].partOfPuzzlePrompt){
				return true;
			}

			// check region for identical values to current cell
			for (var i = 0; i < regLen; i++) {
				curCol = regionCol + i;
				for (var j = 0; j < regLen; j++) {
					curRow = regionRow + j;
					if ((boardContents[curCol][curRow].val === boxVal) && !((boxCol === curCol) && (boxRow === curRow))) {
						return false;
					}
				}
			}

			// check row and column of box for identical box values
			for (var i = 0; i < rowLen; i++) {
				if (((boardContents[boxCol][i].val === boxVal) && (i !== boxRow)) || ((boardContents[i][boxRow].val === boxVal) && (i !== boxCol))){
					return false;
				}
			}

			// box must be valid
			return true;
		};

		/* used to print details to console during development */
		this.logBoxDetails = function (boxCol, boxRow) {
			var boxVal = this.getBoxValue(boxCol, boxRow);
			console.log('coordinates: (' + boxCol + ',' + boxRow + ')');
			console.log('boxVal: "' + this.getBoxValue(boxCol, boxRow) + '"');
			console.log('typeof boxVal: ' + typeof boxVal);
			console.log('isPartOfPuzzle: ' + this.isPartOfPuzzle(boxCol, boxRow));
			console.log('isPossibleValue: ' + isPossibleValue(boxCol, boxRow, boxVal));
			console.log('inPossibleValues: ' + inPossibleValues(boxCol, boxRow, boxVal));
			console.log('possibleValues: ' + boardContents[boxCol][boxRow].possibleValues);
			console.log('isBoxValueValid: ' + this.isBoxValueValid(boxCol, boxRow));
		};

		/* dfs algorithm used to find a solution to the puzzle */
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
						for (var i in boardContents[x][y].possibleValues) {
							recursiveDepth++;
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

		/* uses previously defined dfs algorithm to solve the puzzle, alerts users if there is no solution */
		this.attemptToSolve = function() {

			// validate that the puzzle is solvable
			var isPuzzleValid = true;


			for (var i = 0; i < dim; i++) {
				for (var j = 0; j < dim; j++){
					if (((boardContents[i][j] !== initialBoxVal) && !this.isPartOfPuzzle(i,j) && !this.isBoxValueValid(i, j)) ||  ((boardContents[i][j].possibleValues.length === 0) && (boardContents[i][j].val === initialBoxVal))) {
							isPuzzleValid = false;
					}
				}
			}

			if (!isPuzzleValid) {
				alert('This puzzle cannot be solved!  Hint mode has been activated');
				hintMode = true;
			} else {
				var isSolved = this.solvePuzzle();

				if (isSolved) {
					alert('The puzzle was solved!');
				} else {
					alert('Could not solve the puzzle with the current board!');
				}		
			}

			
		};

		/* erases all user changes to a puzzle, while preserving the original prompt */
		this.resetBoard = function() {
			var boardLen = dim;

			hintMode = false;

			for (var x = 0; x < boardLen; x++){
				for (var y = 0; y < boardLen; y++) {
					if (!this.isPartOfPuzzle(x, y)) {
						clearBoxValue(x, y);
					}
				}
			}
		};

		/* used to control user aids on the board */
		this.toggleHintMode = function ($event) {
			hintMode = !hintMode;
			if (typeof $event !== "undefined") {
				$event.stopPropagation();
			}
		};

		/* used to access hint mode from the view */
		this.getHintMode = function() {
			return hintMode;
		};

		/* controls the text of the hint mode button */
		this.getHintButtonText = function () {
			if (hintMode) {
				return 'Hide Hints';
			} else {
				return 'Show Hints';
			}
		};

		/* used to provide a css class involved in rendering hints to the user */
		this.getBoxCssClass = function(boxCol, boxRow) {
			var cssClass = '';

			if (this.getHintMode()) {
						if (!this.isBoxValueValid(boxCol, boxRow) || ((boardContents[boxCol][boxRow].possibleValues.length === 0) && (boardContents[boxCol][boxRow].val === initialBoxVal))) {
							cssClass = 'invalid-box-value';
						} else if ((boardContents[boxCol][boxRow].possibleValues.length === 1) && (boardContents[boxCol][boxRow].val === initialBoxVal)){
							cssClass = 'one-possible-box-value'
						}
			
				}

			return cssClass;
		};

		this.getCurrentBoard = function(){
			var board = make(dim, level);

			for (var i = 0; i < dim; i++) {
				for (var j = 0; j < dim; j++) {
					board[i][j] = this.getBoxValue(i,j);
				}
			}

			return board;
		}

		this.isSaveBoxActive = function() {
			return displaySaveBox;
		}

		this.closeSaveBox = function() {
			displaySaveBox = false;
		}

		this.openSaveBox = function() {
			displaySaveBox = true;
		}

		this.inEditMode = function() {
			if (puzzleId === 'createPuzzle') {
				return true;
			} else {
				return false;
			}
		}

		/* returns a promise used to load a new puzzle from a json object stored on the server */
		this.setBoard = function(newPuzzleId) {

			if(newPuzzleId === 'createPuzzle') {

				boardContents = make(dim, level);
				puzzleId =  newPuzzleId;
				hintMode = false;

			} else {

				return $http({
				  method: 'GET',
				  url: '/puzzles/getboard/' + newPuzzleId,
				}).then(function successCallback(response) {

					  hintMode = false;
					  
					  boardContents = make(dim, level);

					  puzzleId = newPuzzleId;

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

			
		};
		


	}



	var board = new Board();
	
	return board;
}]);