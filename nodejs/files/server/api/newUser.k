$dataFolder = "./nogit/users/data/v2/".

$ensureUniqueGuid = !fun () {
	$try = do:generateGuid.
	!if (fileExists: dataFolder + try) {
		try = !ensureUniqueGuid
	}.
	try
}.

print: "Adding a new user".
$userName = ($getHeader objFirstProperty _request): "kalzit-user-name".
$userPassword = ($getHeader objFirstProperty _request): "kalzit-user-password".
((void eq userName) | (void eq userPassword)) ifElse {
	resultRef = "1" + strNewline + "The headers 'kalzit-user-name' and 'kalzit-user-password' need to be set.".
};{
	(fileExists: "./nogit/users/plain/v2/" + urlEncodeParameter: userName) ifElse {
		resultRef = "2" + strNewline + "A user with the given name exists already."
	};{
		fileCreateFolders: "./nogit/users/plain/v2".
		("./nogit/users/plain/v2/" + urlEncodeParameter: userName) fileWrite ($guid = (do:ensureUniqueGuid)) + strNewline + urlEncodeParameter: userPassword.
		fileCreateFolders: dataFolder.
		fileCreateFolders: dataFolder + guid.
		fileCreateFolders: dataFolder + guid + "/keys".
		resultRef = "0" + strNewline + guid.
	}
}