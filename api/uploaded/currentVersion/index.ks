$id = SafeFilePath: "id" urlGetParameter $url propOf _request.
$session ? Float = "session" urlGetParameter $url propOf _request.

$userTokenExists = false eq void eq $userToken = fileContent: "./nogit/users/sessions/" + session + ".txt".

!if userTokenExists {
	$filesFolder = "./nogit/users/data/v3/" + userToken + "/files/v2/main".
	$uploadName = filesFolder + "/" + id.
	resultRef = strFirstLine: fileContent: uploadName + "/currentVersion.txt".
}