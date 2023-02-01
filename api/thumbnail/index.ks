$id = SafeFilePath: "id" urlGetParameter $url propOf _request.

$session ? Float = "session" urlGetParameter $url propOf _request.
$sessionExists = fileIsFolder: $userFolder = serverUsersFolder + "/sessions/" + session.

!if sessionExists {
	
	!if (fileIsFile: $versionFile = ($uploadName = userFolder + "/files/v2/main/" + id) + "/currentVersion.txt") {
		asyncRef = true.
		$latestVersion = strFirstLine: fileContent: versionFile.
        $thumbnailFile = uploadName + "/" + latestVersion + "/thumbnail.jpg".
		
		`Decide what to send`
		!ifElse (fileIsFile: thumbnailFile) {
			"Cache-Control" ($setHeader propOf _request) "public, max-age=604800".
			"ETag" ($setHeader propOf _request) $etag = latestVersion.
			!ifElse (etag eq ($getHeader propOf _request): "if-none-match") {
				($respondCode propOf _request): 304.
			};{
				($startServing propOf _request): nativeFileMime: "jpg".
				($writeExistingFile propOf _request): print: thumbnailFile.
			}
		};{
			($respondCode propOf _request): 404.
		}.
		
		do:($endServing propOf _request).
	}
}
