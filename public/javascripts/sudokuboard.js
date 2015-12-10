angular.module('sudokuboard', []).factory('sudokuBoardFactory', function() {

	var dim = 9;
	var level = 2;

	var make =  function make(dim, lvl, arr, coord) {
				  if (lvl === 0) {
				  	return {val: ''};
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


	var board = make(dim, level);

	board.selectedBox = [];

	board.isSelectorActive = function(boxCol, boxRow) {
	//	console.log('checking if active: ' + regCol + ' ' + regRow + ' ' + boxCol + ' ' + boxRow);
		if ((this.selectedBox[0] === boxCol) 
		&& 	(this.selectedBox[1] === boxRow)) {
			return true;
		} else {
			return false;
		}
	};

	board.toggleSelector = function(boxCol, boxRow) {
		if((this.selectedBox.length === 0) || (!this.isSelectorActive(boxCol, boxRow))) 
		{ 
			this.selectedBox = [boxCol, boxRow];
		} else {
			this.selectedBox = [];
		}
	};

	for (var i = 0; i<dim; i++) {
		board[i][i].val = i+1;
	}
	
	return {
		board: board
	};
});