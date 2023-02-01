$session = ($getHeader objFirstProperty _request): "kalzit-session".
$sessionExists = fileIsFolder: $userFolder = serverUsersFolder + "/sessions/" + session.

!ifElse (sessionExists) {
	$jsonPath = userFolder + "/keys-v2.json".
	$hashPath = userFolder + "/keys-hash-v2.txt".
	
	!ifElse (fileIsFile: jsonPath) {
		asyncRef = true.
		$hash = !ifElse (fileIsFile: hashPath) {
			fileContent: hashPath	
		};{
			String: !getCurrentDate
		}.
		
		"ETag" ($setHeader propOf _request) hash.
		!ifElse (hash eq ($getHeader objFirstProperty _request): "if-none-match") {
			($respondCode propOf _request): 304.
		};{
			($startServing propOf _request): fileMime: "json".
			($writeExistingFile propOf _request): jsonPath.
		}.
		do:($endServing propOf _request).
	};{
		`Try to generate the JSON file`
		!if (fileIsFolder: userFolder + "/keys") {
			print: "Pulling data for session " + session + " from the server".
		
			$jsonBody = "," strJoin ($cookieFile fun {
				(objToJson: urlDecodeParameter: fileName: cookieFile) + ":" + objToJson: fileContent: cookieFile.
			}) each folderContent: userFolder + "/keys".
			
			$hash = String: !getCurrentDate.
			
			"ETag" ($setHeader propOf _request) hash.
			($startServing propOf _request): fileMime: "json".
			
			hashPath fileWrite hash.
			jsonPath fileWrite resultRef = '{"sessionValid":true, "keys": {' + jsonBody + '}}'.
		}
	}
};{
	`The session is not valid - send an appropriate response`
	resultRef = '{"sessionValid":false, "keys":{}}'.
}
