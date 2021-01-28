runLater: {
	print: "This test should only work if you accepted cookies.".
	print: "Please write something in the text field below and click the button:".
	print: @(percentWidth: 100) {$test_four_input storageSaveString x} uiTextfieldOnchange (default: "Some text in the text field"): storageLoadString: $test_four_input.
	print: @verticalCenter {
		popupMessage: "You wrote this text: " + (default: "this is where your input should be displayed"): storageLoadString: $test_four_input
	} uiButton "Click me".
	print: defaultCookieBanner.
}