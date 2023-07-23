/* @kalzit.for ui_action_picker
Has basically the same effect as "uiIndexPicker".
TODO: At the moment this function is implemented natively, but it should be rewritten soon. Two redundant pieces of code should not exist in the same project.

Please use [uiIndexPicker](/services/documentation/uiIndexPicker) instead.
*/
GLang.dr.qdSet("ui_action_picker", {value:function(env, args){
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
	
	return {value:picker, display:DISPLAY_DOM}
}});

GLang.dr.qdSet("ui_action_picker_with_icon", {value:function(env, args){
	var action = args[0];

	var picker = document.createElement("select");
	picker.classList.add("calcitPickerIcon");
	var options = args[1].value;
	for(var i = 0; i < options.length; i++){
		var option = document.createElement("option");
		option.innerHTML = GLang.at(0, options[i]).value;
		option.value = i;
		picker.appendChild(option);
	}
	
	function reset(){
		picker.selectedIndex = -1;
	}
	
	picker.onchange = function(){
		GLang.callObject(action, env, [{value: picker.value}]);
		reset();
	}
	setTimeout(reset, 0);
	
	return {value:picker, display:DISPLAY_DOM}
}});

//This is needed as a workaround at the moment. If the action picker icon is added, then removed, and then re-added to the dom, its value gets set by the browser.
//To make sure that the functionality is still as intended, reset the value regularly to -1.
//Because JS does one thing at a time, this should not interfere with the logic of select.onchange - select.value works as expected there. The only problematic thing could be asynchronous callbacks using that value.
setInterval(() => {
	var pickers = document.getElementsByClassName("calcitPickerIcon");
	for(var i = 0; i < pickers.length; i++){
		pickers[i].selectedIndex = -1
	}
}, 500);
