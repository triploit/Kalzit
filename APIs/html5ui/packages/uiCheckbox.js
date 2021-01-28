function makeCheckbox(text, withCheckbox) {
	var container = document.createElement("label");
	container.appendChild(document.createTextNode(text));
	container.classList.add("k-checkbox_container");
	if(text == "") container.classList.add("k-checkbox_empty");
	
	var checkbox = document.createElement("input");
	checkbox.type = "checkbox";
	container.appendChild(checkbox);
	checkbox.setAttribute("tabindex", -1);
	
	var checkmark = document.createElement("span");
	checkmark.classList.add("k-checkbox_mark");
	container.appendChild(checkmark);
	checkmark.setAttribute("tabindex", 0);
	
	//Idea from https://www.w3schools.com/howto/howto_js_trigger_button_enter.asp
	checkmark.addEventListener("keyup", function(event) {
		// Number 13 is the "Enter" key on the keyboard
		if (event.keyCode === 13) {
			// Cancel the default action, if needed
			event.preventDefault();
			// Trigger the main action
			setTimeout(function(){
				container.click();
			}, 100);
		}
	});
	
	withCheckbox(checkbox);
	return container;
}

GLang.defaultRuntimeEnvironment.setInnerVariable("uiCheckbox", {value:GLang.arrayFun(function(env, args){
	return {value:makeCheckbox(args[1].value, checkbox => {
		
		checkbox.onchange=function(e){
			GLang.callObject(args[0], env, [{value:checkbox.checked ? 1 : 0}]);
		}
		
	}), display:"dom"};
})})

GLang.defaultRuntimeEnvironment.setInnerVariable("uiCheckboxVariable", {value:GLang.arrayFun(function(env, args){
	return {value:makeCheckbox(args[1].value, checkbox => {
		
		checkbox.onchange=function(e){
			env.setInnerVariable(args[0].value, {value:checkbox.checked ? 1 : 0}, true);
		}
		
		env.registerVariableListener(args[0].value, function(){
			checkbox.checked = env.resolveName(args[0].value).value !== 0;
		})
		
	}), display:"dom"};
})})