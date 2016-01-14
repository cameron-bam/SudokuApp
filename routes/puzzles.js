var express = require('express');
var router = express.Router();
var puzzleReader = require('../my_modules/puzzleReader');

router.param('puzzleId', function(req,res,next,puzzleId) {
	req.puzzleId = puzzleId;
	next();
});

router.get('/getboard/:puzzleId', function(req, res) {
	res.json(puzzleReader.readPuzzleFromFile(req.puzzleId));
});

router.get('/getpuzzlelist', function(req, res) {
	res.json(puzzleReader.getAllPuzzleInfo());
});

router.post('/saveNewPuzzle', function(req, res) {

	try {
		res.json(puzzleReader.createNewPuzzle(req.body));
	} 
	catch (err) {
		res.send("Couldn''t save the puzzle!");
	}


	
});

module.exports = router;
