$nameField = $nameInput uiTextfieldVariableOnchange {}.
$passwordInput = "". $passwordInputRef = reference: $passwordInput.
$passwordField = {passwordInputRef = x} uiPasswordOnchange passwordInput.

print: "Name". print: nameField.
print: "Password". print: passwordField.
print: {
	$response = nameInput serviceRegisterUser passwordInput.
	!if ("0" eq first: response) {
		popupMessage: "Success! Your user was created. You can now open an app and log in"
	}. else {
		popupMessage: second: response
	}.
} uiButton "Register".