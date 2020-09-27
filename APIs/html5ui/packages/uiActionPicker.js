/* @kalzit.for ui_action_picker
Has basically the same effect as "uiIndexPicker".
TODO: At the moment this function is implemented natively, but it should be rewritten soon. Two redundant pieces of code should not exist in the same project.

Please use [uiIndexPicker](/services/documentation/uiIndexPicker) instead.
*/
GLang.defaultRuntimeEnvironment.setInnerVariable("uiActionPicker", {value:function(env, args){
	var action = args[0];

	var picker = document.createElement("select");
	picker.classList.add("calcitPicker");
	var options = args[1].value;
	for(var i = 0; i < options.length; i++){
		var option = document.createElement("option");
		option.innerHTML = GLang.at(0, options[i]).value;
		option.value = i;
		picker.appendChild(option);
	}
	picker.onchange = function(){
		GLang.callObject(action, env, [{value: picker.value}]);
	}
	
	return {value:picker, display:"dom"}
}});