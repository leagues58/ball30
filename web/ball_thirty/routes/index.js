var express = require('express');
var router = express.Router();
var http = require('http').Server(router);
var io = require('socket.io')(http);

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'ball:30 System' });
  res.io.emit("socketToMe", "index");
  res.send('respond with a resource.');
});


module.exports = router;
