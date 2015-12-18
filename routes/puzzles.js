var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
	res.render('index', { title: 'All Puzzles'});
});

router.get('/featured', function(req, res) {
	res.render('puzzle', { title: 'Featured Puzzle'});
});

module.exports = router;
