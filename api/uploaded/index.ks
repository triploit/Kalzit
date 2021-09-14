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
			
			$unencryptedPath = uploadName + "/" + requestedVersion + "/raw".
			!ifElse (fileIsFile: unencryptedPath) {
				`Serve the unencrypted data`
				($startServing propOf _request): (default: "*"): strFirstLine: fileContent: uploadName + "/" + requestedVersion + "/mime.txt".
				($writeFile propOf _request): print: unencryptedPath.
			};{
				`Decrypt the data first, then serve them`
				($startServing propOf _request): (default: "*"): strFirstLine: fileContent: uploadName + "/" + requestedVersion + "/mime.txt".
				($writeEncryptedFile propOf _request):
					["input"; print: uploadName + "/" + requestedVersion + "/encrypted"];
					["initVector"; fileContentRaw: uploadName + "/" + requestedVersion + "/iv"];
					["key"; ($getProperty propOf mdFivePasswordHashes): userToken].
			}
			
		}.
		
		do:($endServing propOf _request).
	}
}