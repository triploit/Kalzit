$session ? Float = "session" urlGetParameter $url propOf _request.
$sessionExists = fileIsFolder: $userFolder = serverUsersFolder + "/sessions/" + session.

!if sessionExists {
	$thumbnailsFolder = userFolder + "/files/v2/thumbnails".
	$index = "index" urlGetParameter $url propOf _request.
	
	!if (fileIsFile: $thumbnailFile = thumbnailsFolder + "/" + index + ".jpg") {
		asyncRef = true.
		
		($startServing propOf _request): nativeFileMime: "jpg".
		_request httpWriteStaticFile print: thumbnailFile.
		do: ($endServing propOf _request).
	}
}