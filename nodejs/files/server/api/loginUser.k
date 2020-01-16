print: "Performing a user login".
$userName = ($getHeader objFirstProperty _request): "kalzit-user-name".
$userPassword = ($getHeader objFirstProperty _request): "kalzit-user-password".

!if ((void eq userName) | (void eq userPassword)) {
	resultRef = "1" + strNewline + "The cookies 'calcitUserName' and 'calcitUserPassword' need to be set.".
}. else {
	$fname = "./nogit/users/plain/" + urlEncodeParameter: userName.
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
