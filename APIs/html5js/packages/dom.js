
/*
* @kalzit.for dom_parse
* Provides a simple way to parse data from XML.
* You can do something like this:
*
* $dom = domParse: xmlCode.
*
* To work with the data, please take a look at the other functions defined in this file, like "domAttribute", "domInner" and "domInnerText"
*/
GLang.defaultRuntimeEnvironment.setInnerVariable("dom_parse", {value:GLang.arrayFun(function(env, args){
	var dom = new DOMParser().parseFromString(args[0].value, "text/xml");
	return {value:dom};
})});

/*
* @kalzit.for dom_tags
* Returns all tags with a given name that are found in a given DOM object.
*
* Usage: $tagName domTags dom.
* This produces a list which contains zero or more DOM objects.
*/
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

/*
* @kalzit.for dom_attribute
* Returns the value of an attribute which was given to a Tag.
* For example, in the case of <a href="test"></a>, the attribute "href" has the value test.
* If no attribute with the given name can be found, an empty list (equivalent to "void"), is returned.
*
* Usage: $viewBox domAttribute dom.
* If the attribute was found, a string is returned - otherwise, it is an empty list.
*/
GLang.defaultRuntimeEnvironment.setInnerVariable("dom_attribute", {value:GLang.arrayFun(function(env, args){
	var element = args[1].value;
	var attrib = args[0].value;
	return {value:element.getAttribute(attrib) || []};
})});

/*
* @kalzit.for dom_inner_text
* Returns the text content of a DOM element.
* Usage: domInnerText: dom.
*/
GLang.defaultRuntimeEnvironment.setInnerVariable("dom_inner_text", {value:GLang.arrayFun(function(env, args){
	return {value:args[0].value.innerHTML};
})});

/*
* @kalzit.for dom_inner
* Returns a list of the DOM elements that are contained in another one.
* If there are nested elements inside, only the ons on the first layer are returned.
* Usage: domInner: dom.
*/
GLang.defaultRuntimeEnvironment.setInnerVariable("dom_inner", {value:GLang.arrayFun(function(env, args){
	var elements = args[0].value.childNodes;
	var newArray = [];
	for(var i = 0; i < elements.length; i++){
		newArray.push({value:elements[i]});
	}
	return {value:elements};
})});