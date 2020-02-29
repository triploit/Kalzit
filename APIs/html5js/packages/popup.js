this.popupHtml = function(html){
	window.open("", "", "").document.body.innerHTML = html;
}
GLang.defaultRuntimeEnvironment.setInnerVariable("popup_values", {value:function(env, args){
	var b = window.open("", "", "").document.body;
	var array = args[0].value;
	if(!(array instanceof Array)){
		array = [args[0]]
	}
	for(var i = 0; i < array.length; i++){
		b.appendChild(GLang.displayValue(array[i]));
	}
	return {value:0, display:"none"};
}});
this.popupMessage = function(textMessage){alert(textMessage)};
this.popupQuestion = function(question){return prompt(question)};