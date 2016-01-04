var express = require('express');
var router = express.Router();
var puzzleReader = require('../my_modules/puzzleReader');

router.param('puzzleId', function(req,res,next,puzzleId) {
	req.puzzleId = puzzleId;
	next();
});

router.get('/:puzzleId', function(req, res) {
	res.json(puzzleReader(req.puzzleId));
});

module.exports = router;