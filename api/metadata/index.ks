$id = SafeFilePath: "id" urlGetParameter $url propOf _request.
$session ? Float = "session" urlGetParameter $url propOf _request.

$sessionExists = fileIsFolder: $userFolder = "./nogit/users/sessions/" + session.

!if sessionExists {
	$filesFolder = userFolder + "/files/v2/main".
	
	!if (fileIsFile: print: ($uploadName = filesFolder + "/" + id) + "/currentVersion.txt") {
		asyncRef = true.
		$latestVersion = strFirstLine: fileContent: uploadName + "/currentVersion.txt".
		
		"ETag" ($setHeader propOf _request) $etag = latestVersion.
		!ifElse (etag eq ($getHeader propOf _request): "if-none-match") {
			($respondCode propOf _request): 304.
		};{
			($startServing propOf _request): fileMime: "json".
			($writeFile propOf _request): print: uploadName + "/" + latestVersion + "/metadata.json".
		}.
		
		do:($endServing propOf _request).
	}
}