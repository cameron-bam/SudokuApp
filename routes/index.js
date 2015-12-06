var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Sudoku App' });
});

router.get('/puzzles', function(req, res) {
	res.send('stub for all puzzles');
});

router.get('/puzzles/featured', function(req, res) {
	res.render('puzzle', { title: 'Puzzle'});
});

module.exports = router;
