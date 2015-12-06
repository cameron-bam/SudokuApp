(function() {
	
	var app = angular.module('SudokuApp', [ ]);

	app.controller('WelcomePageController', function() {
		
		var newPuzzleToday = false;

		if (newPuzzleToday) {
				this.puzzleMessage = "There's a new puzzle today!  Go checkout the featured puzzle page.";
			} 
		else {
				this.puzzleMessage = "No new puzzles today.  Check again tomorrow!";
			}
	});

	app.controller('SudokuBoardController', function() {

		var solutions = [[[[]]]];

		// solutions[0][0][0][0] = 1;

		this.getBoxSolution = function(regionCol, regionRow, boxCol, boxRow) {
			var sol = null;

			try {
				sol = solutions[regionCol][regionRow][boxCol][boxRow];
			}
			catch(ReferenceError) {
				sol = '';
			}

			return sol;
		};

		this.getBoxClass = function (boxCol, boxRow) {
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
					boxClass += 'right';
					break;
				}

			}

			return boxClass;

		};
	});

})();