function decode(str) {
	if(str == undefined)
		return null;
	//first turn str to unicode
	var count = 0;
	for(var i = 0; i < str.length; i++) {
		if(str[i] == '&')
			count++;
	}
	for(var i = 0; i < count; i++) {
		str = str.replace('&#x', '');
		str = str.replace(' ', '');
	}
	str = str.split(';');
	for(var i = 0; i < str.length; i++) {
		str[i] = 'u'+str[i];
	}
	for(var i = 0; i < str.length; i++) {
		str[i] = unescape(str[i].replace(/\u/g, "%u"));
	}
	var words = "";
	for(var i = 0; i < str.length; i++) {
		words = words + str[i];
	}
	words = words.replace('%u', '');
	console.log(words);
	return words;
}

exports.decode = decode;
