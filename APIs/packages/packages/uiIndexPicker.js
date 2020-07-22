/* @kalzit.for ui_index_picker
Creates a picker control (which lets the user pick a value) based on a list of options (second parameter).
The chosen option is represented as an index (0 for the first, 1 for the second and so on).
Whenever the choice changes, a callback (first parameter) is called with the selected index (a number) as its parameter.

Usage example (simply displaying the chosen index in a popup):

```kalzit
$callback = popupMessage. `Just show something`.
$options = "First";"Second";"Third".

print: callback uiIndexPicker options.

void
```
*/
GLang.defaultRuntimeEnvironment.setInnerVariable("uiIndexPicker", {value:function(env, args){
	var callback = args[0];

	var picker = document.createElement("select");
	picker.classList.add("calcitPicker");
	var options = args[1].value;
	for(var i = 0; i < options.length; i++){
		var option = document.createElement("option");
		option.innerHTML = options[i].value;
		option.value = i;
		picker.appendChild(option);
	}
	picker.onchange = function(){
		GLang.callObject(callback, env, [{value:parseInt(picker.value)}]);
	}
	
	return {value:picker, display:"dom"}
}});

/* @kalzit.for ui_index_reference_picker
Creates a picker control (which lets the user pick a value) based on a list of options (second parameter).
The chosen option is represented as an index (0 for the first, 1 for the second and so on).
Whenever the choice changes, a reference (first parameter) is automatically updated with the selected index (a number) as its new value.

The reference pointing to the active index can also be used to change the initial selection.
For example, if you want the second item to be selected when the UI element is first displayed, set your reference value to 1.
You should also populate the index variable (which the reference points to) with a valid index value.
If the value of your index variable is (or becomes) an invalid index number, a blank selection will be shown to the user.

Usage example (showing two ui elements - the second one displays the currently selected index):

```kalzit
$selection = 1. `Remove for blank initial selection`.
$selectionRef = reference: $selection.

$options = "First";"Second";"Third".

`The picker control`
print: selectionRef uiIndexReferencePicker options.
`Shows the currently selected index`
print: uiShowVariable: selectionRef.

void
```
*/
GLang.defaultRuntimeEnvironment.setInnerVariable("uiIndexReferencePicker", {value:function(env, args){
	var varRef = args[0];
	if(varRef.display !== "reference"){throw new Error("uiPicker needs a reference as the first parameter")}
	
	var varEnv = varRef.environment;
	var varName = varRef.value;

	var picker = document.createElement("select");
	picker.classList.add("calcitPicker");
	var options = args[1].value;
	for(var i = 0; i < options.length; i++){
		var option = document.createElement("option");
		option.innerHTML = options[i].value;
		option.value = i;
		picker.appendChild(option);
	}
	picker.onchange = function(){
		varEnv.setInnerVariable(varName, {value:parseInt(picker.value)}, true);
	}
	
	function onVariableChange(){
		picker.value = varEnv.resolveName(varName).value;
	}
	onVariableChange();
	
	varEnv.registerVariableListener(varName, onVariableChange);
	
	return {value:picker, display:"dom"}
}});