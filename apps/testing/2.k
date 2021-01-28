print: "Please write something in the text field below and click the button:".
$var = "". $varRef = reference: $var.
print: @(percentWidth: 100) {varRef = x} uiTextfieldOnchange "".
print: @verticalCenter {
	popupMessage: "You wrote this text: " + var
} uiButton "Click me".