var G = require('./geter.js').get;
var $ = require("cheerio");
var f = require("fs");
var redis = require("redis");
//connect to redis
var client = redis.createClient(6379, '127.0.0.1');
client.on('end', function(err) {
	console.log('end');
});
//get the data from redis
client.on('connect', function() {
	client.multi()
		.smembers('feature')
		.smembers('featureRange')
		.smembers('goodsURL')
		.exec(function(err, replies) {
			console.log("MULTI got " + replies.length + " replies");
			reply1=replies[0];
			console.log(reply1.length);
			for(var i = 0; i < reply1.length; i++) {
				reply1[i] = JSON.parse(reply1[i]);
			}
			featureJSON = JSON.stringify(reply1);
			f.writeFileSync('LAY_2_FEATURES.txt', featureJSON);		
			reply2=replies[1];
			console.log(reply2.length);
			for(var i = 0; i < reply2.length; i++) {
				reply2[i] = JSON.parse(reply2[i]);
			}
			featureRangeJSON = JSON.stringify(reply2);
			f.writeFileSync('LAY_2_FEATURERANGE.txt', featureRangeJSON);
			reply3=replies[2];
			console.log(reply3.length);
			for(var i = 0; i < reply3.length; i++) {
				reply3[i] = JSON.parse(reply3[i]);
			}
			goodsURLJSON = JSON.stringify(reply3);
			f.writeFileSync('LAY_2_GOODSURL.txt', goodsURLJSON);			

			client.quit();
		});
});
