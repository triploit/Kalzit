$session = ($getHeader objFirstProperty _request): "kalzit-session".
$userTokenExists = false eq void eq $userToken = fileContent: "./nogit/users/sessions/" + session + ".txt".

$jsonPath = "./nogit/users/data/v3/" + userToken + "/keys.json".
$hashPath = "./nogit/users/data/v3/" + userToken + "/keys-hash.txt".

!if (fileIsFile: jsonPath) {
	asyncRef = true.
	$hash = !ifElse (fileIsFile: hashPath) {
		fileContent: hashPath	
	};{
		mdFiveHash: fileContent: jsonPath
	}.
	
	"ETag" ($setHeader propOf _request) hash.
	!ifElse (hash eq ($getHeader objFirstProperty _request): "if-none-match") {
		($respondCode propOf _request): 304.
	};{
		($startServing propOf _request): fileMime: "json".
		($writeFile propOf _request): jsonPath.
	}.
	do:($endServing propOf _request).
}. !else {
	!if (userTokenExists & fileIsFolder: "./nogit/users/data/v3/" + userToken + "/keys") {
		print: "Pulling data for user " + userToken + " from the server".
	
		$jsonBody = "," strJoin ($cookieFile fun {
			(objToJson: urlDecodeParameter: fileName: cookieFile) + ":" + objToJson: fileContent: cookieFile.
		}) each folderContent: "./nogit/users/data/v3/" + userToken + "/keys".
		
		$hash = mdFiveHash: jsonBody.
		
		"ETag" ($setHeader propOf _request) hash.
		($startServing propOf _request): fileMime: "json".
		
		hashPath fileWrite hash.
		jsonPath fileWrite resultRef = "{" + jsonBody + "}".
	}
}