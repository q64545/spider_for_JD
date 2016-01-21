var G = require('./geter.js').get;
var T = require('./turnunicode.js').decode;
var $ = require("cheerio");
var iconv = require('iconv-lite');
var f = require("fs");
var redis = require("redis");
var mysql = require("mysql");
var child_process = require('child_process');
var P = require('./getPrice.js').getPrice;
var C = require('./getComments.js').getComments;

//connect to the redis
//var client = redis.createClient(6379,'127.0.0.1');
//connect to Mysql
var Client = mysql.createConnection({
	user: 'root',
	password: 'q54645',
});
Client.connect();
Client.query("use genius");
//get the URL of the goods
var jsonGoodsURL = f.readFileSync('LAY_2_GOODSURL.txt').toString();
var goodsURL = JSON.parse(jsonGoodsURL);

//get the comments of each goods and store them into Mysql
var getC = function (comments) {
	comments = comments.CommentsCount[0];
	return comments;poorPicRate
}

var getter2 = function(content, i, j, h, l) {
	if(content == undefined || i == undefined || j == undefined || h == undefined) { console.log("no comments !!");return; }
	var data = content;
	var comments = eval(data);
	console.log(comments);
	var id = i*(2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2)+j*(2*2*2*2*2*2*2*2*2*2*2*2*2)+h*(2*2*2*2*2*2*2*2)+l;
	var commentsNum = comments.CommentCount;
	var Star_1 = comments.Score1Count;
	var Star_2 = comments.Score2Count;
	var Star_3 = comments.Score3Count;
	var Star_4 = comments.Score4Count;
	var Star_5 = comments.Score5Count;
	var goodRate = comments.GoodRate*100;
	var generalRate = comments.GeneralRate*100;
	var poorRate = comments.PoorRate*100;
	var commentsWithPic = comments.ShowCount;
	var goodPicRate = comments.GoodRateShow;
	var generalPicRate = comments.GeneralRateShow;
	var poorPicRate = comments.PoorRateShow;
	//Client.query("update JDGoods_Feature set commentsNum = 'CommentsNum', 1_Star = '1_star', 2_Star = '2_star', 3_Star = '3_star', 4_Star = '4_star', 5_Star = '5_star', goodRate = 'GoodRate', generalRate = 'GeneralRate', poorRate = 'PoorRate', commentsWithPic = 'CommentsWithPic', goodPicRate = 'GoodPicRate', generalPicRate = 'GeneralPicRate', poorPicRate = 'PoorPicRate' where ID = "+id+";");
	Client.query("update JDGoods_value set commentsNum = " +  commentsNum + ", 1_Star = " + Star_1 + ", 2_Star = " + Star_2 + ", 3_Star = " + Star_3 + ", 4_Star = " + Star_4 + ", 5_Star = " + Star_5 + ", goodRate = " + goodRate + ", generalRate = " + generalRate + ", poorRate = " + poorRate + ", commentsWithPic = " + commentsWithPic + ", goodPicRate = " + goodPicRate + ", generalPicRate = " + generalPicRate + ", poorPicRate = " + poorPicRate + " where ID = "+id+";");
}

//get the price of each goods and store them into Mysql
var cnp = function (list){
  list = list[0]
  return list;
}
var getter1 = function(content, i, j, h, l) {
	if(content == undefined || i == undefined || j == undefined || h == undefined) { console.log("no price!!");return; }
	var data = content;
	var price = eval(data);
	console.log(price.p);
	var id = i*(2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2)+j*(2*2*2*2*2*2*2*2*2*2*2*2*2)+h*(2*2*2*2*2*2*2*2)+l;
	//Client.query("update JDGoods_Feature set price = 'JD_price' where ID = " + id + ";");
	Client.query("update JDGoods_value set price = " + price.p + " where ID = " + id + ";");
}


var getter = function(content, i, j, h, l) {
	if(content == undefined || i == undefined || j == undefined || h == undefined) {
		console.log("error");
		return;
	}
	var html = content;
	var id = i*(2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2)+j*(2*2*2*2*2*2*2*2*2*2*2*2*2)+h*(2*2*2*2*2*2*2*2)+l;
	var level1 = {'attribute':'first_level', 'value':i};
	var level2 = {'attribute':'second_level', 'value':j};
	var level3 = {'attribute':'third_level', 'value':h};
	var goods = [];
	goods.push(level1);
	goods.push(level2);
	goods.push(level3);

	$(html).find('#parameter2 li').each(function() {
		var tmp = {};
		tmp.attribute = T($(this).html().replace("'", "").replace("'", "").replace("'", "").replace("'", "").replace('"', "").replace('"', "").replace('"', "").replace('"', "")).split("：")[0];
		tmp.value = $(this).attr('title');
		goods.push(tmp);
	});

	console.log(goods);
	console.log("The length of this good is: " + goods.length);
	console.log("the levels are: "+i+', '+j+', '+h+', '+l+', '+id);
	Client.query("INSERT INTO JDGoods_Feature values("+id+",null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null);", function selectCb(err, results, fields) {
		if(err) {
			console.log(err.stack);
		}
	});
	Client.query("INSERT INTO JDGoods_value values("+id+",0,0,0,0,0,0,0,0,0,0,0,0,0,0,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null);", function selectCb(err, results, fields) {
		if(err) {
			console.log(err.stack);
		}
	});
	for(var i = 0; i < goods.length; i++) {
		Client.query("update JDGoods_Feature set feature"+(i+1)+' = "'+goods[i].attribute+'" where ID = '+id+";", function selectCb(err, results, fields) {
			if(err) {
				console.log(err.stack);
			}
		});
		Client.query("update JDGoods_value set value"+(i+1)+' = "'+goods[i].value+'" where ID = '+id+";", function selectCb(err, results, fields) {
			if(err) {
				console.log(err.stack);
			}
		});
	}
	//client.sadd("JDGoods", JSON.stringify(goods), function() {});
	console.log("load one good!!!!");
}


//multi process
var getEachGoods2 = child_process.spawn('node', ['getEachGoods2.js']);
getEachGoods2.stdout.on('data', function (data) {
	console.log('stdout: ' + data);
});
getEachGoods2.stderr.on('data', function (data) {
	console.log('stderr: ' + data);
});
getEachGoods2.on('close', function (code) {
	console.log('ending!!!!!!!   ending code: ' + code);
});



//iterate to get each good data
for(var i = 0; i < Math.floor(goodsURL.length/2); i++) {
	for(var j = 0; j < goodsURL[i].length; j++) {
		var url = goodsURL[i][j].href;
		var first_level = goodsURL[i][j].first_level;
		var second_level = goodsURL[i][j].second_level;
		var third_level = goodsURL[i][j].third_level;
		var goodID = url.replace('http://item.jd.com/', '').replace('.html', '');
		console.log("%d %d", i, j);
		console.log("The present good url is: " + url);
		console.log(goodID);
		G(url, getter, first_level, second_level, third_level, j);
		P(goodID, getter1, first_level, second_level, third_level, j);
		C(goodID, getter2, first_level, second_level, third_level, j);
	}
}
