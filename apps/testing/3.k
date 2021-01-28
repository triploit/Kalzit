print: "This test should only work if you accepted cookies.".
print: "Please write something in the text field below and click the button:".
$var = "". $varRef = reference: $var.
print: @(percentWidth: 100) {$test_three_input storageSaveString x} uiTextfieldOnchange (default: ""): storageLoadString: $test_three_input.
print: @verticalCenter {
	popupMessage: "You wrote this text: " + (default: ""): storageLoadString: $test_three_input
} uiButton "Click me".