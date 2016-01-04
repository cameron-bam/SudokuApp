var readPuzzleFromFile = function(puzzleId) {

  var fs = require('fs');

  var puzzleFilePath = './puzzles/' + puzzleId + '/puzzle.json';

  var puzzleString = fs.readFileSync(puzzleFilePath, 'utf8');

  return JSON.parse(puzzleString);
};

module.exports = readPuzzleFromFile;