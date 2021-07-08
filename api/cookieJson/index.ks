$session = ($getHeader objFirstProperty _request): "kalzit-session".
$userTokenExists = false eq void eq $userToken = fileContent: "./nogit/users/sessions/" + session + ".txt".

$jsonPath = "./nogit/users/data/v3/" + userToken + "/keys.json".
$gzipPath = "./nogit/users/data/v3/" + userToken + "/keys.json.gz".
$hashPath = "./nogit/users/data/v3/" + userToken + "/keys-hash.txt".

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
		($writeFile propOf _request): jsonPath.
	}.
	do:($endServing propOf _request).
};{
	!if (userTokenExists & fileIsFolder: "./nogit/users/data/v3/" + userToken + "/keys") {
		print: "Pulling data for user " + userToken + " from the server".
	
		$jsonBody = "," strJoin ($cookieFile fun {
			(objToJson: urlDecodeParameter: fileName: cookieFile) + ":" + objToJson: fileContent: cookieFile.
		}) each folderContent: "./nogit/users/data/v3/" + userToken + "/keys".
		
		$hash = String: !getCurrentDate.
		
		"ETag" ($setHeader propOf _request) hash.
		($startServing propOf _request): fileMime: "json".
		
		hashPath fileWrite hash.
		jsonPath fileWrite resultRef = "{" + jsonBody + "}".
	}
}