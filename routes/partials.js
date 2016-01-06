var express = require('express');
var router = express.Router();

router.param('partialName', function(req,res,next,partialName) {
	req.partialName = partialName;
	next();
});

router.get('/:partialName', function(req, res) {
  res.render('partials/' + req.partialName);
});

module.exports = router;
