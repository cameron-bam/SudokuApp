angular.module('sudokuboard', []).factory('sudokuBoardFactory', function() {

	var dim = 3;
	var level = 4;

	var assignBoxClass = function (boxCol, boxRow) {
			var boxClass = 'sudoku-box ';

			switch(boxCol) {
				case 0: {
					boxClass += 'left';
					break;
				}
				case 1: {
					boxClass += 'center';
					break;
				}
				case 2: {
					boxClass += 'right';
					break;
				}
			}

			boxClass += ' ';

			switch(boxRow) {
				case 0: {
					boxClass += 'top';
					break;
				}
				case 1: {
					boxClass += 'center';
					break;
				}
				case 2: {
					boxClass += 'bottom';
					break;
				}

			}

			return boxClass;

	};

	var make =  function make(dim, lvl, arr, coord) {
				  if (lvl === 0) {
				  	var htmlClass = assignBoxClass(coord[2], coord[1]);
				  	return {htmlClass: htmlClass,
				  			val: ''};
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

	board[0][0][0][0].val = 1;
	board[0][0][1][1].val = 2;
	board[0][0][2][2].val = 3;
	board[1][1][0][0].val = 4;
	board[1][1][1][1].val = 5;
	board[1][1][2][2].val = 6;
	board[2][2][0][0].val = 7;
	board[2][2][1][1].val = 8;
	board[2][2][2][2].val = 9;

	return {
		board: board
	};
});