print: "Performing a user login".
$userName = ($getHeader objFirstProperty _request): "kalzit-user-name".
$userPassword = ($getHeader objFirstProperty _request): "kalzit-user-password".

!if ((void eq userName) | (void eq userPassword)) {
	resultRef = "1" + strNewline + "The headers 'kalzit-user-name' and 'kalzit-user-password' need to be set. (Most likely an error with your native app)".
}. else {
	$fname = "./nogit/users/plain/v2/" + urlEncodeParameter: userName.
	!if ((fileIsFile: fname) & fileExists: fname) {
		$content = strNewline strSplit fileContent: fname.
		(userPassword eq second: content) ifElse {
			resultRef = "0" + strNewline + first: content
		};{
			resultRef = "3" + strNewline + "Passwords do not match"
		}
	}. else {
		resultRef = "2" + strNewline + "No user with this name was found"
	}
}
