$userTokenExists = false eq void eq $userToken = ($getHeader objFirstProperty _request): "kalzit-user-token".

!if (userTokenExists & fileIsFolder: "./nogit/users/data/v2/" + userToken + "/keys") {
	print: "Pulling data for user " + cookieName + " from the server".

	($startServing of _request): fileMime: "json".
	$jsonBody = "," strJoin ($cookieFile fun {
		(objToJson: urlDecodeParameter: fileName: cookieFile) + ":" + objToJson: fileContent: cookieFile.
	}) each folderContent: "./nogit/users/data/v2/" + userToken + "/keys".
	
	resultRef = "{" + jsonBody + "}".
}