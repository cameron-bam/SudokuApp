var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Sudoku App' });
});

router.get('/puzzles', function(req, res) {
	res.render('index', { title: 'All Puzzles'});
});

router.get('/puzzles/featured', function(req, res) {
	res.render('puzzle', { title: 'Featured Puzzle'});
});

router.get('/getpuzzle/featured', function(req, res) {
	var make =  function (dim, lvl, arr, coord) {
				  if (lvl === 0) {
				  	return '';
				  }
				  if (!lvl) {
				  	lvl = dim;
				  }
				  if (!arr) {
				  	arr = [];
				  }
				  if (!coord) {
				  	coord = [];
				  }
				  for (var i = 0, l = dim; i < l; i += 1) {
				  	coord[lvl] = i;
				    arr[i] = make(dim, lvl - 1, arr[i], coord);
				  }
				  return arr;
			};

	var board = make(9,2);

	for(var i = 8; i>=0; i--) {
		board[i][i] = 9-i;
	}

	res.json(board);

})

module.exports = router;
