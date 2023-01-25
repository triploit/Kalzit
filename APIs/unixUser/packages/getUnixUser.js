this.getUnixUserName = function(){
	return require("os").userInfo().username;
}

this.getUnixUserFolder = function(){
	return require("os").userInfo().homedir;
}