var http = require("http");
var iconv = require('iconv-lite');
var $ = require("cheerio");

// Utility function that downloads a URL and invokes
// callback with the data.
function download(url, callback, i, j, h, l) {
//connect to the url with http
    http.get(url, function(res) {
        var data = "";
        res.on('data', function(chunk) {
            data += iconv.decode(chunk, "gbk");
        });
        res.on("end", function() {
	    //invokes the callback function
            callback(data,i,j,h,l);
        });
    }).on("error", function() {
        callback(null);
    });
}
exports.get = download;
