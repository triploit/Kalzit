$id = SafeFilePath: "id" urlGetParameter $url propOf _request.

$session ? Float = "session" urlGetParameter $url propOf _request.
$sessionExists = fileIsFolder: $userFolder = "./nogit/users/sessions/" + session.

!if sessionExists {
	$filesFolder = userFolder + "/files/v2/main".
	
	!if (fileIsFile: print: ($uploadName = filesFolder + "/" + id) + "/currentVersion.txt") {
		asyncRef = true.
		$latestVersion = strFirstLine: fileContent: uploadName + "/currentVersion.txt".
		
		`Check if the thumbnail file exists - if not, attempt to generate it`
		!ifNot (fileIsFile: uploadName + "/" + latestVersion + "/thumbnail.png") {
			runCommandFromArray: "ffmpeg"; "-i"; (uploadName + "/" + latestVersion + "/raw"); "-vf"; "scale=300:-2"; (uploadName + "/" + latestVersion + "/thumbnail.png").
		}.
		
		`Decide what to send`
		!ifElse (fileIsFile: uploadName + "/" + latestVersion + "/thumbnail.png") {
			"Cache-Control" ($setHeader propOf _request) "public, max-age=604800".
			"ETag" ($setHeader propOf _request) $etag = latestVersion.
			!ifElse (etag eq ($getHeader propOf _request): "if-none-match") {
				($respondCode propOf _request): 304.
			};{
				($startServing propOf _request): nativeFileMime: "png".
				($writeFile propOf _request): print: uploadName + "/" + latestVersion + "/thumbnail.png".
			}
		};{
			($respondCode propOf _request): 404.
		}.
		
		do:($endServing propOf _request).
	}
}