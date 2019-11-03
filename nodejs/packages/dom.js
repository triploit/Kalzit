(function(){
	
	var DOMParser = require('xmldom').DOMParser;
	
	function DummyDOM(){
		this.getElementsByTagName = function(){return []};
		this.domInnerText = function(){return ""};
		this.childNodes = [];
		this.innerHTML = [];
	}
	
	GLang.defaultRuntimeEnvironment.setInnerVariable("dom_parse", {value:GLang.arrayFun(function(env, args){
			if(!(args[0].value)){
			return {value:new DummyDOM()};
		}
		var dom = new DOMParser().parseFromString(args[0].value, "text/xml").documentElement;
		return {value:dom};
	})});
	GLang.defaultRuntimeEnvironment.setInnerVariable("dom_tags", {value:GLang.arrayFun(function(env, args){
		var dom = args[1].value;
		var tag = args[0].value;
		var array = [];
		
		var elements = dom.getElementsByTagName(tag);
		for(var i = 0; i < elements.length; i++){
			array.push({value:elements[i]});
		}
		return {value:array};
	})});
	GLang.defaultRuntimeEnvironment.setInnerVariable("dom_attribute", {value:GLang.arrayFun(function(env, args){
		var element = args[1].value;
		var attrib = args[0].value;
		return {value:element.getAttribute(attrib) || ""};
	})});
	GLang.defaultRuntimeEnvironment.setInnerVariable("dom_inner_text", {value:GLang.arrayFun(function(env, args){
		return {value:args[0].value.innerHTML};
	})});
	GLang.defaultRuntimeEnvironment.setInnerVariable("dom_inner", {value:GLang.arrayFun(function(env, args){
		var elements = args[0].value.childNodes;
		var newArray = [];
		for(var i = 0; i < elements.length; i++){
			newArray.push({value:elements[i]});
		}
		return {value:elements};
	})});
	
})();