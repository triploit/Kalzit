print: "Please write something in the text field below and click the button:".
print: @(percentWidth: 100) $var uiTextfieldVariableOnchange "".
print: @verticalCenter {
	popupMessage: "You wrote this text: " + var
} uiButton "Click me".