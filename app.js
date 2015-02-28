var express = require('express')
  , main = require('./routes/main.js')
  , http = require('http')
  , path = require('path')

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'hjs');
  //app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  //app.use(require('less-middleware')({ src: __dirname + '/public' }));
  app.use(require('less-middleware')(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, '../web')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', main.home);
app.get('/send', main.request_interview);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
