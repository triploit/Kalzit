$id = SafeFilePath: "id" urlGetParameter $url propOf _request.

!if sessionExists {
	`TODO: this relies on a specific file name format, which could change in the future`
	$userToken = last: "/" strSplit fileRealpath: userFolder.
	
	$filesFolder = userFolder + "/files/v2/main".
	
	!if (fileIsFile: print: ($uploadName = filesFolder + "/" + id) + "/currentVersion.txt") {
		asyncRef = true.
		$requestedVersion = (default: strFirstLine: fileContent: uploadName + "/currentVersion.txt"): $version urlGetParameter $url propOf _request.
		
		"ETag" ($setHeader propOf _request) $etag = requestedVersion.
		!ifElse (etag eq ($getHeader propOf _request): "if-none-match") {
			($respondCode propOf _request): 304.
		};{
			
			$rawPath = uploadName + "/" + requestedVersion + "/raw".
			!if (fileIsFile: rawPath) {
				($startServing propOf _request): (default: "*"): strFirstLine: fileContent: uploadName + "/" + requestedVersion + "/mime.txt".
				($writeExistingFile propOf _request): print: rawPath.
			}
			
		}.
		
		do:($endServing propOf _request).
	}
}
