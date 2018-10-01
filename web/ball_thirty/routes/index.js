var express = require('express');
var router = express.Router();
var http = require('http').Server(router);
var io = require('socket.io')(http);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'ball:30 System' });
});

io.on('connection', function(socket){
  console.log('a user connected');
});



module.exports = router;
