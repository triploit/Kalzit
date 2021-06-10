$id = SafeFilePath: "id" urlGetParameter $url propOf _request.
$session ? Float = "session" urlGetParameter $url propOf _request.

$userTokenExists = false eq void eq $userToken = fileContent: "./nogit/users/sessions/" + session + ".txt".

!if userTokenExists {
	$filesFolder = "./nogit/users/data/v3/" + userToken + "/files/v2/main".
	
	!if (fileIsFile: print: ($uploadName = filesFolder + "/" + id) + "/currentVersion.txt") {
		asyncRef = true.
		$latestVersion = strFirstLine: fileContent: uploadName + "/currentVersion.txt".
		
		"ETag" ($setHeader propOf _request) $etag = latestVersion.
		!ifElse (etag eq ($getHeader propOf _request): "if-none-match") {
			($respondCode propOf _request): 304.
		};{
			($startServing propOf _request): (default: "*"): strFirstLine: fileContent: uploadName + "/" + latestVersion + "/mime.txt".
			($writeFile propOf _request): print: uploadName + "/" + latestVersion + "/raw".
		}.
		
		do:($endServing propOf _request).
	}
}