$session ? Float = "session" urlGetParameter $url propOf _request.
$accessName ? SafeFilePath = urlDecodeParameter: "accessName" urlGetParameter $url propOf _request.

$userTokenExists = false eq void eq $userToken = fileContent: "./nogit/users/sessions/" + session + ".txt".

!if userTokenExists {
	$filesFolder = "./nogit/users/data/v3/" + userToken + "/files".
	$uploadName = filesFolder + "/access/" + accessName.
	
	!if (fileIsFile: uploadName) {
		resultRef = fileContent: uploadName
	}
}