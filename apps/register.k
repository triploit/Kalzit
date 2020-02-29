$nameField = $nameInput uiTextfieldVariableOnchange {}.
$passwordInput = "". $passwordInputRef = reference: $passwordInput.
$passwordField = {passwordInputRef = x} uiPasswordOnchange passwordInput.

print: "Name". print: nameField.
print: "Password". print: passwordField.
print: {
	$response = nameInput serviceRegisterUser passwordInput.
	!if ("0" eq first: response) {
		$calcitUserToken storageSaveString second: response.
		popupMessage: "Success! Your user was created and you are now logged in"
	}. else {
		popupMessage: second: response
	}.
} uiButton "Register".