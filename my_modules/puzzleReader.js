var fs = require('fs');
var mkdirp = require('mkdirp');

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
			curPuzzleInfo = readPuzzleFromFile(curPuzzleId).puzzleInfo;
			curPuzzleInfo.puzzleId = curPuzzleId;
			listOfPuzzles.push(curPuzzleInfo);
		}
	}

	console.log(listOfPuzzles);

	return listOfPuzzles;
};

var createNewPuzzle = function(puzzleData) {

	var puzzleDirs = fs.readdirSync('./puzzles');
	var maxDir = 0;
	var currentDir = '';

	for (var dirName in puzzleDirs) {
		currentDir = parseInt(dirName);
		if ((currentDir !== 'NaN') && (currentDir >= maxDir)) {
			maxDir = currentDir;
		}
	}

	var newPuzzleId = maxDir + 1;
	var newPuzzleDir = './puzzles/' + newPuzzleId;

	mkdirp(newPuzzleDir, function(err) {
		if (err) throw err;
	});

	fs.writeFile(newPuzzleDir + '/puzzle.json', JSON.stringify(puzzleData), function(err) {
		if (err) throw err;
	})

	return {'newPuzzleId': newPuzzleId};
}

module.exports = {
					"readPuzzleFromFile": readPuzzleFromFile, 
					"getAllPuzzleInfo": getAllPuzzleInfo,
					"createNewPuzzle": createNewPuzzle
				};