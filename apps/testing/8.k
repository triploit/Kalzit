print: "This test should only work if you accepted cookies. Please reload the page after you did.".
print: "The following lines should contain the same text:".
print void.
print: "Hello World".
$test_eight_value storageSaveString "Hello World".
print: (default: "Placeholder"): storageLoadString: $test_eight_value.