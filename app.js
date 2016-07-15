var express = require('express');

module.exports = function(app,io){

var users = [];
var rooms = [];

var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ejs = require('ejs');

var routes = require('./routes/index');
var socket_manager = require('./routes/socket_manager');
var room = require('./routes/room');



// var app = express();
var renderFile = ejs.renderFile;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html',renderFile);
app.set('view engine','html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/socket',socket_manager);
app.use('/room',room);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

//socket part comes here
// var nsp = io.of('/python');
// nsp.on('connection',function(socket){
//   console.log('connected to python');
// });


//middleware demos
// io.use(function(socket,next){
//   console.log('in the middleware');
//   // console.log(socket.request);
//   next();
// });

//authorization 
// io.set('authorization',function(handshake,callback){
//   console.log('in the authorization middleware');
//   callback(null,true);
// });

io.sockets.on('connection',function(socket){
  // console.log(socket.handshake);
  var room = socket.handshake['query']['roomName'];
  socket.join(room);
  socket.roomName = room;
  console.log('user joined room'+room);
  socket.on('disconnect',function(){
    console.log('socket discconnect');
  });

  socket.on('new message',function(messageText){
    io.sockets.in(socket.roomName).emit('new message',{'messageText':messageText});
  });

});

}
// module.exports = app;
