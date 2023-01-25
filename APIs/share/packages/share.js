this.shareSupported = function(){
	if(navigator.share) {
		return true;	
	}else{
		return false;
	}
}

GLang.defaultRuntimeEnvironment.setInnerVariable("share_url", {value:function(env, args) {
	var url = args[0].value;

	var jsShareObject = {url: url};
	
	//Trigger share sheet
	navigator.share(jsShareObject)
	
	return GLang.voidValue;
}});

GLang.defaultRuntimeEnvironment.setInnerVariable("share_text", {value:function(env, args) {
	var text = args[0].value;

	var jsShareObject = {text: text};
	
	//Trigger share sheet
	navigator.share(jsShareObject)
	
	return GLang.voidValue;
}});