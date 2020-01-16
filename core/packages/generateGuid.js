GLang.defaultRuntimeEnvironment.setInnerVariable("generateGuid", {value:function(){
	var S4 = function() {
		return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
	};
	return GLang.stringValue(S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}});