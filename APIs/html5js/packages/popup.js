/* @kalzit.for popup_html
Opens the given HTML code in a new browser window or tab (whatever the user prefers).

Usage example:
	popupHtml: "<h1>BIG title!</h1>".

Please note that nothing else is added to the opened HTML. This means that you would have to add all needed stylesheets etc. yourself.
*/
this.popupHtml = function(html){
	window.open("", "", "").document.body.innerHTML = html;
}

/* @kalzit.for popup_values
Opens a list of values in a new browser window or tab (whatever the user prefers).

Usage example:
	popupValues: 1;2;3.

The values will be displayed as if you used the "print" function on each of them.
Please note that nothing else is added to the opened window, including stylesheets. This means that many default styles and any themes you set do not apply there.
*/
GLang.defaultRuntimeEnvironment.qdSet("popup_values", {value:function(env, args){
	var b = window.open("", "", "").document.body;
	var array = args[0].value;
	if(!(array instanceof Array)){
		array = [args[0]]
	}
	for(var i = 0; i < array.length; i++){
		b.appendChild(GLang.displayValue(array[i]));
	}
	return GLang.voidValue;
}});

/* @kalzit.for popup_message
Shows the given text in a dialog box with a close option.

Usage example:
	popupMessage: "Hello World".

The code execution will pause here until the user closed the dialog.
*/
this.popupMessage = function(textMessage){alert(textMessage)};

/* @kalzit.for popup_question
Shows the given text in a dialog box with an input field both a "confirm" and a "close" option.
If the user selects "confirm", the text that was written into the input field is returned. If "close" is selected, this function returns "void".

Usage example:
	print: "You typed this: " + popupQuestion: "You can type something".

The code execution will pause here until the user closed the dialog.
*/
this.popupQuestion = function(question){return prompt(question)};
