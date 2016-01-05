var fs = require('fs');

var readPuzzleFromFile = function(puzzleId) {

  var puzzleFilePath = './puzzles/' + puzzleId + '/puzzle.json';

  var puzzleString = fs.readFileSync(puzzleFilePath, 'utf8');

  return JSON.parse(puzzleString);
};

var getListOfPuzzles = function() {
	var listOfPuzzles = fs.readdirSync('./puzzles');

	console.log(listOfPuzzles);

	return listOfPuzzles;
};

module.exports = {"readPuzzleFromFile": readPuzzleFromFile, "getListOfPuzzles": getListOfPuzzles};