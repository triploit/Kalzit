$session = ($getHeader objFirstProperty _request): "kalzit-session".
$userTokenExists = false eq void eq $userToken = fileContent: "./nogit/users/sessions/" + session + ".txt".

!if (fileIsFile: $filePath = "./nogit/users/data/v3/" + userToken + "/keys.json") {
	asyncRef = true.
	($writeFile of _request): filePath
}. !else {
	!if (userTokenExists & fileIsFolder: "./nogit/users/data/v3/" + userToken + "/keys") {
		print: "Pulling data for user " + cookieName + " from the server".
	
		($startServing of _request): fileMime: "json".
		$jsonBody = "," strJoin ($cookieFile fun {
			(objToJson: urlDecodeParameter: fileName: cookieFile) + ":" + objToJson: fileContent: cookieFile.
		}) each folderContent: "./nogit/users/data/v3/" + userToken + "/keys".
		
		filePath fileWrite resultRef = "{" + jsonBody + "}".
	}
}