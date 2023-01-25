$id = SafeFilePath: "id" urlGetParameter $url propOf _request.

$session ? Float = "session" urlGetParameter $url propOf _request.
$sessionExists = fileIsFolder: $userFolder = serverUsersFolder + "/sessions/" + session.

!if sessionExists {
	$filesFolder = userFolder + "/files/v2/main".
	
	!if (fileIsFile: ($uploadName = filesFolder + "/" + id) + "/currentVersion.txt") {
		asyncRef = true.
		$latestVersion = strFirstLine: fileContent: uploadName + "/currentVersion.txt".
		
		`Check if the thumbnail file exists - if not, attempt to generate it`
		!ifNot (fileIsFile: uploadName + "/" + latestVersion + "/thumbnail.jpg") {
			runCommandFromArray: "ffmpeg"; "-i"; (uploadName + "/" + latestVersion + "/raw"); "-vf"; "scale=300:-2"; (uploadName + "/" + latestVersion + "/thumbnail.jpg").
		}.
		
		`Decide what to send`
		!ifElse (fileIsFile: uploadName + "/" + latestVersion + "/thumbnail.jpg") {
			"Cache-Control" ($setHeader propOf _request) "public, max-age=604800".
			"ETag" ($setHeader propOf _request) $etag = latestVersion.
			!ifElse (etag eq ($getHeader propOf _request): "if-none-match") {
				($respondCode propOf _request): 304.
			};{
				($startServing propOf _request): nativeFileMime: "jpg".
				($writeFile propOf _request): print: uploadName + "/" + latestVersion + "/thumbnail.jpg".
			}
		};{
			($respondCode propOf _request): 404.
		}.
		
		do:($endServing propOf _request).
	}
}