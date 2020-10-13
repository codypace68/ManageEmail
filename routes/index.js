var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('serving index', req.path)
  res.render('index', {page: req.path});
});

router.get('/dashboard', function(req, res, next) {
  console.log('serving index', req.path)
  res.render('dashboard', {page: req.path});
});

router.get('/manage-mailbox', function(req, res, next) {
  console.log('serving index', req.path)
  res.render('manage-mailbox', {page: req.path});
});

module.exports = router;
