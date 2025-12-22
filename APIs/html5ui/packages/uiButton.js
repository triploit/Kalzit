GLang.dr.qdSet("ui_button", {value:GLang.arrayFunction(2, function(args){
	var button = document.createElement("input");
	button.type = "button";
	button.classList.add("calcitButton");
	button.onclick = function(){
		GLang.call(args[0], []);
	};
	button.value = args[1].value;
	return {value:button, display:DISPLAY_DOM};
})});

GLang.dr.qdSet("ui_button_with_three_dot_icon", {value:GLang.arrayFunction(1, function(args){
	var button = document.createElement("input");
	button.type = "button";
	button.classList.add("calcitPickerIcon");
	button.onclick = function(){
		GLang.call(args[0], []);
	};
	return {value:button, display:DISPLAY_DOM};
})});
