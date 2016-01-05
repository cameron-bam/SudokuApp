var express = require('express');
var router = express.Router();
var puzzleReader = require('../my_modules/puzzleReader');

router.get('/', function(req, res) {
	res.render('allpuzzles', { title: 'All Puzzles'});
});

router.param('puzzleId', function(req,res,next,puzzleId) {
	req.puzzleId = puzzleId;
	next();
});

router.get('/getboard/:puzzleId', function(req, res) {
	res.json(puzzleReader.readPuzzleFromFile(req.puzzleId).board);
});

router.get('/:puzzleId', function(req, res) {
	var puzzleInfo = puzzleReader.readPuzzleFromFile(req.puzzleId).puzzleInfo;
	res.render('puzzle', { title: puzzleInfo.name});
});

module.exports = router;
