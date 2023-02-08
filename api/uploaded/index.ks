$id = SafeFilePath: "id" urlGetParameter $url propOf _request.

!if sessionExists {
	$filesFolder = userFolder + "/files/v2/main".
	
	!if (fileIsFile: print: ($uploadName = filesFolder + "/" + id) + "/currentVersion.txt") {
		asyncRef = true.
		$requestedVersion = (default: strFirstLine: fileContent: uploadName + "/currentVersion.txt"): $version urlGetParameter $url propOf _request.
		
		$rawPath = uploadName + "/" + requestedVersion + "/raw".
		!if (fileIsFile: rawPath) {
			($startServing propOf _request): (default: "*"): strFirstLine: fileContent: uploadName + "/" + requestedVersion + "/mime.txt".
			($writeExistingFile propOf _request): print: rawPath.
		}.
		
		do:($endServing propOf _request).
	}
}
