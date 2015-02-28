var express = require('express')
  , convert = require('./routes/convert.js')
  , sitemap = require('./routes/sitemap.js')
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
  app.use(require('less-middleware')({ src: __dirname + '/public' }));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', convert.home);
app.get('/inflation-:year-to-:year2', convert.main);
app.get('/in-:year-dollars', convert.main);
app.get('/:year-dollars-in-:year2-dollars', convert.main);
app.get('/:year-dollars-to-:year2-dollars', convert.main);
app.get('/:year-dollars-in-:year2', convert.main);
app.get('/:year-dollars-to-:year2', convert.main);
app.get('/year-:year', convert.main);
app.get('/:year/:year2', convert.main);
app.get('/sitemap.xml', sitemap.main);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
