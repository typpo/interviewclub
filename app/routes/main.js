exports.home = function(req, res) {
  handle(req, res);
}

exports.main = function(req, res) {
  handle(req, res);
};

function handle(req, res) {
  res.render('index', {});
}
