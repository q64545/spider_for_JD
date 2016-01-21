var G = require('./geter.js').get;
var $ = require("cheerio");
var f = require("fs");
var mysql = require("mysql");
var redis = require("redis");
//connect to redis
var client = redis.createClient(6379, '127.0.0.1');

//connect to Mysql
var Client = mysql.createConnection({
	user: 'root',
	password: 'q54645',
});
Client.connect();
Client.query("use genius");

//get all the urls of the layer_2_catlog from localfile 'LAY_1_CATLOG_json.txt'
var jsonLay1 = f.readFileSync('LAY_1_CATLOG_json.txt').toString();
var LAY_1_CATLOG = JSON.parse(jsonLay1).LAY_1_CATLOG;

//realize the function getter as a callback
var getter = function(content,i,j,h) {
	var html = content;
	//get the features of each type of goods
	console.log("loading...");
	//list1 is to store the feature of each type
	var list1 = [];
	$(html).find('.sl-key span').each(function() {
		var tmp = {};
		tmp.name = $(this).html();
		list1.push(tmp);
	});
	console.log(list1.length);
	client.sadd("feature", JSON.stringify(list1), function() {});
	console.log("adding one feature!!");
	
	//get the range of features of each type of goods
	//list2 is to store the range of feature of each type
	var list2 = [];
	$(html).find('.sl-value a').each(function() {
		var tmp = {};
		//tmp.href = $(this).attr('href');
		tmp.name = $(this).html();
		list2.push(tmp);
	});
	console.log(list2.length);
	client.sadd("featureRange", JSON.stringify(list2),function() {});
	console.log("adding one range");

	//get the url of every goods from each type
	//list3 is to store the URLs for each goods in each type
	var list3 = [];
	$(html).find('.gl-item').each(function() {
		var tmp = {};
		tmp.first_level = i;
		tmp.second_level = j;
		tmp.third_level = h;
		tmp.href = $(this).find('.p-name a').attr('href');
		tmp.name = $(this).find('.p-name em').html();
		//tmp.commit = $(this).find('.p-commit a').html();
		list3.push(tmp);
	});
	console.log(list3.length);
	client.sadd("goodsURL", JSON.stringify(list3), function() {});
	console.log("adding one URL");
}

//circulate the LAY_1_CATLOG to get each layer_2_catlog for layer_1_catlog
for(var i = 0; i < LAY_1_CATLOG.length; i++) {
//for(var i = 0; i < 3; i++) {
	for(var j = 0; j < LAY_1_CATLOG[i].s.length; j++) {
	//for(var j = 0; j < 5; j++) {
		var client = redis.createClient(6379, '127.0.0.1');
		for(var h = 0; h < LAY_1_CATLOG[i].s[j].s.length; h++) {
			var url = "";
			url = "http://list.jd.com/list.html?cat=" + LAY_1_CATLOG[i].s[j].s[h].name[0].split('-')[0]+','+LAY_1_CATLOG[i].s[j].s[h].name[0].split('-')[1]+','+LAY_1_CATLOG[i].s[j].s[h].name[0].split('-')[2]

			console.log("The present url is: " + url);
			console.log("the levels are: "+i+', '+j+', '+h);
			G(url, getter, i, j, h);
		}
	}
}
