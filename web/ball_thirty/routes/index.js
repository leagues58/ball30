var express = require('express');
var router = express.Router();
var http = require('http').Server(router);
var io = require('socket.io')(http);

/* GET home page. */
router.get('/', function(req, res, next) {
  renderPage(res).then(emitSocketMessage(res, 'message in a socket'));
});


function renderPage(res, data) {
  return new Promise(function(resolve, reject){
    res.render('index', { title: 'ball:30 System' });
    resolve(true);
  });
}

function emitSocketMessage(res, message) {
  return new Promise(function(resolve, reject){
    if(res.io.emit("socketToMe", message)) resolve(true)
    else reject(false)

  });
}

module.exports = router;
