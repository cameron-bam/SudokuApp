var express = require('express');
var router = express.Router();
var puzzleReader = require('../my_modules/puzzleReader');

router.param('puzzleId', function(req,res,next,puzzleId) {
	req.puzzleId = puzzleId;
	next();
});

router.get('/getboard/:puzzleId', function(req, res) {
	res.json(puzzleReader.readPuzzleFromFile(req.puzzleId).board);
});

router.get('/getpuzzlelist', function(req, res) {
	res.json(puzzleReader.getAllPuzzleInfo());
});

module.exports = router;
