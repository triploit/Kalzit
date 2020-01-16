print: "Adding a new user".
$userName = ($getHeader objFirstProperty _request): "kalzit-user-name".
$userPassword = ($getHeader objFirstProperty _request): "kalzit-user-password".
((void eq userName) | (void eq userPassword)) ifElse {
	resultRef = "1" + strNewline + "The cookies 'calcitUserName' and 'calcitUserPassword' need to be set.".
};{
	(fileExists: "./nogit/users/plain/" + urlEncodeParameter: userName) ifElse {
		resultRef = "2" + strNewline + "A user with the given name exists already."
	};{
		fileCreateFolders: "./nogit/users/plain".
		("./nogit/users/plain/" + urlEncodeParameter: userName) fileWrite ($guid = (do:generateGuid)) + strNewline + urlEncodeParameter: userPassword.
		fileCreateFolders: "./nogit/users/data/" + guid.
		resultRef = "0" + strNewline + guid.
	}
}