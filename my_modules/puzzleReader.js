var fs = require('fs');

var readPuzzleFromFile = function(puzzleId) {

  var puzzleFilePath = './puzzles/' + puzzleId + '/puzzle.json';

  var puzzleString = fs.readFileSync(puzzleFilePath, 'utf8');

  return JSON.parse(puzzleString);
};

var getAllPuzzleInfo = function() {
	var puzzleIds = fs.readdirSync('./puzzles');

	var listOfPuzzles = []
	var curPuzzleInfo = {};
	var curPuzzleId = '';

	for (var puzzleId in puzzleIds) {
		if (puzzleIds.hasOwnProperty(puzzleId)) {
			curPuzzleId = puzzleIds[puzzleId];
			console.log('puzzleId: ' + puzzleId + ', puzzleIds[puzzleId]: ' + puzzleIds[puzzleId] + ', curPuzzleId: ' + curPuzzleId);
			curPuzzleInfo = readPuzzleFromFile(curPuzzleId).puzzleInfo;
			curPuzzleInfo.puzzleId = curPuzzleId;
			listOfPuzzles.push(curPuzzleInfo);
		}
	}

	console.log(listOfPuzzles);

	return listOfPuzzles;
};

module.exports = {"readPuzzleFromFile": readPuzzleFromFile, "getAllPuzzleInfo": getAllPuzzleInfo};