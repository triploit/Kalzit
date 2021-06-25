$id = SafeFilePath: "id" urlGetParameter $url propOf _request.
$session ? Float = "session" urlGetParameter $url propOf _request.

$userTokenExists = false eq void eq $userToken = fileContent: "./nogit/users/sessions/" + session + ".txt".

!if userTokenExists {
	$filesFolder = "./nogit/users/data/v3/" + userToken + "/files/v2/main".
	
	!if (fileIsFile: print: ($uploadName = filesFolder + "/" + id) + "/currentVersion.txt") {
		asyncRef = true.
		$requestedVersion = (default: strFirstLine: fileContent: uploadName + "/currentVersion.txt"): $version urlGetParameter $url propOf _request.
		
		"ETag" ($setHeader propOf _request) $etag = requestedVersion.
		!ifElse (etag eq ($getHeader propOf _request): "if-none-match") {
			($respondCode propOf _request): 304.
		};{
			($startServing propOf _request): (default: "*"): strFirstLine: fileContent: uploadName + "/" + requestedVersion + "/mime.txt".
			($writeFile propOf _request): print: uploadName + "/" + requestedVersion + "/raw".
		}.
		
		do:($endServing propOf _request).
	}
}