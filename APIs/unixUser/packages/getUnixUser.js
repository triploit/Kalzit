this.get_unix_user_name = function(){
	return require("os").userInfo().username;
}

this.get_unix_user_folder = function(){
	return require("os").userInfo().homedir;
}
