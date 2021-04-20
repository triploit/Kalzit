$id = first: "[a-z\-/]+[a-z0-9]+" match "id" urlGetParameter $url propOf _request.
$session ? Float = "session" urlGetParameter $url propOf _request.

$userTokenExists = false eq void eq $userToken = fileContent: "./nogit/users/sessions/" + session + ".txt".

!if userTokenExists {
	$filesFolder = "./nogit/users/data/v3/" + userToken + "/files".
	
	!if (fileIsFile: $uploadName = filesFolder + "/" + id) {
		asyncRef = true.
		
		"Cache-Control" ($setHeader propOf _request) "public, max-age=31536000, immutable".
		"ETag" ($setHeader propOf _request) $etag = String: id.
		
		!ifElse (etag eq ($getHeader propOf _request): "if-none-match") {
			($respondCode propOf _request): 304.
		};{
			$fileName = fileName: id.
			$fileKind = first: "[a-z\-]+" match id.
			($startServing propOf _request): (default: "*"): strFirstLine: fileContent: filesFolder + "/" + fileKind + "/mime/" + fileName + ".mime.txt".
			($writeFile propOf _request): filesFolder + "/" + id.
		}.
		
		do:($endServing propOf _request).
	}
}