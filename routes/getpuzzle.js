var express = require('express');
var router = express.Router();
var board = require('../my_modules/board');

router.param('puzzleId', function(req,res,next,puzzleId) {
	req.puzzleId = puzzleId;
	next();
});

router.get('/:puzzleId', function(req, res) {
	
	if (req.puzzleId === 'featured') {
		res.json(board);
	}

});

module.exports = router;