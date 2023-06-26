function makeCheckbox(text, withCheckbox) {
	var container = document.createDocumentFragment();

	container.appendChild(document.createTextNode(text));
	if(text == "") container.classList.add("k-checkbox_empty");
	
	var checkbox = document.createElement("input");
	checkbox.type = "checkbox";
	container.appendChild(checkbox);
	checkbox.setAttribute("tabindex", -1);
	
	var checkmark = document.createElement("span");
	checkmark.classList.add("k-checkbox_mark");
	container.appendChild(checkmark);
	checkmark.setAttribute("tabindex", 0);
	
	//Call the same function that is triggered when the user clicks when "enter" is pressed
	checkmark.addEventListener("keypress", function(event) {
		//13 is the ASCII code for "carriage return" - the enter key
		if(event.keyCode === 13) {
			//Do the same thing that happens when the user clicks the checkbox
			checkbox.click()
		}
	})
	
    var visibleThing = document.createElement("label");
    visibleThing.classList.add("k-checkbox_container");
    visibleThing.appendChild(container);
	withCheckbox(checkbox);
	return visibleThing;
}

GLang.defaultRuntimeEnvironment.setInnerVariable("uiCheckbox", {value:GLang.arrayFun(function(env, args){
	return {value:makeCheckbox(args[1].value, checkbox => {
		
		checkbox.onchange=function(e){
			GLang.callObject(args[0], env, [{value:checkbox.checked ? 1 : 0}]);
		}
		
	}), display:DISPLAY_DOM};
})})

GLang.defaultRuntimeEnvironment.setInnerVariable("uiCheckboxVariable", {value:GLang.arrayFun(function(env, args){
	return {value:makeCheckbox(args[1].value, checkbox => {
		
		checkbox.onchange=function(e){
			env.setInnerVariable(args[0].value, {value:checkbox.checked ? 1 : 0}, true);
		}
		
		env.registerVariableListener(args[0].value, function(){
			checkbox.checked = env.resolveName(args[0].value).value !== 0;
		})
		
	}), display:DISPLAY_DOM};
})})
