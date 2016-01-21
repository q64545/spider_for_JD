var http = require("http");
var iconv = require('iconv-lite');

var getPrice = function (goodID, callback,i,j,h,l) {
  http.get('http://p.3.cn/prices/get?callback=cnp&type=1&area=1_72_4137&pdtk=&pduid=1521779302&pdpin=&pdbp=0&skuid=J_' + goodID, function(res) {
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
exports.getPrice = getPrice;
