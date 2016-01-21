var http = require("http");
var iconv = require('iconv-lite');

var getComments = function (goodID, callback,i,j,h,l) {
  http.get('http://club.jd.com/clubservice.aspx?method=GetCommentsCount&referenceIds=' + goodID + '&callback=getC', function(res) {
    var data = '';
    res.on('data', function(chunk) {
      data += iconv.decode(chunk, "gbk");
    });
    res.on("end", function() {
      callback(data,i,j,h,l);
    });
  }).on("error", function() {
      callback(null);
  });
}

exports.getComments = getComments;

