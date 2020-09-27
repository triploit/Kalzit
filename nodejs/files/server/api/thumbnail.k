$id = first: "[a-z\-/]+[a-z0-9]+" match "id" urlGetParameter $url propOf _request.
$session ? Float = "session" urlGetParameter $url propOf _request.

$userTokenExists = false eq void eq $userToken = fileContent: "./nogit/users/sessions/" + session + ".txt".

!if userTokenExists {
	$filesFolder = "./nogit/users/data/v3/" + userToken + "/files".
	
	!if (fileIsFile: $uploadName = filesFolder + "/" + id + ".thumbnail.png") {
		asyncRef = true.
		_request httpWriteStaticFile uploadName.
		do:($endServing propOf _request).
	}
}