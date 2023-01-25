$structureVersion = "v3".
$dataFolder = serverUsersFolder + "/data/" + structureVersion + "/".

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
	(fileExists: serverUsersFolder + "/plain/" + structureVersion + "/" + urlEncodeParameter: userName) ifElse {
		resultRef = "2" + strNewline + "A user with the given name exists already."
	};{
		fileCreateFolder: serverUsersFolder + "/plain/" + structureVersion.
		(serverUsersFolder + "/plain/" + structureVersion + "/" + urlEncodeParameter: userName) fileWrite ($guid = (do:ensureUniqueGuid)).
		fileCreateFolder: dataFolder.
		fileCreateFolder: dataFolder + guid.
		fileCreateFolder: dataFolder + guid + "/keys".
		fileCreateFolder: dataFolder + guid + "/password".
		(dataFolder + guid + "/password/salt.txt") fileWrite $salt = generateSalt: 512.
		(dataFolder + guid + "/password/hash.txt") fileWrite userPassword shaFiveTwelveHashWithSalt salt.
		resultRef = "0" + strNewline + guid.
	}
}