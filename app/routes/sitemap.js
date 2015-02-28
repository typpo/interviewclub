var sm = require('sitemap')
  , compare = require('../../lib/calc.js')

var sitemap_urls = [];
for (var i=1700; i <= compare.max_year; i++) {
  var jstart = i;
  if (i < 1940) {
    jstart = 1990;
  }
  for (var j=jstart; j <= compare.max_year; j++) {
    if (i===j) continue;

    var priority;
    if (i > 1990 && j > 1990) {
      priority = .8;
    }
    else if (i > 1970 && j > 1970) {
      priority = .6;
    }
    else if (j === compare.max_year) {
      priority = .5;
    }
    else if (i > 1900 && j > 1900) {
      priority = .4;
    }
    else {
      priority = .2;
    }
    /*
    sitemap_urls.push({url: 'inflation-' + i + '-to-' + j, changefreq: 'yearly', priority: priority});
    sitemap_urls.push({url: 'in-' + i + '-dollars', changefreq: 'yearly', priority: priority});
    */
    /*
    if (j === (1900+new Date().getYear())) {
      // this year
      sitemap_urls.push({url: i + '-dollars-today', changefreq: 'yearly', priority: priority});
    }
    else {
    }
    */
    sitemap_urls.push({url: i + '-dollars-to-' + j + '-dollars', changefreq: 'monthly', priority: priority});
  }
}
console.log(sitemap_urls.length, 'in sitemap');
var sitemap = sm.createSitemap ({
  hostname: 'http://www.in2013dollars.com/',
  cacheTime: 600000,        // 600 sec - cache purge period
  urls: sitemap_urls,
});
exports.main = function(req, res) {
  sitemap.toXML( function (xml) {
      res.header('Content-Type', 'application/xml');
      res.send( xml );
  });
}
