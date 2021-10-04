$id = SafeFilePath: "id" urlGetParameter $url propOf _request.

$session ? Float = "session" urlGetParameter $url propOf _request.
$sessionExists = fileIsFolder: $userFolder = "./nogit/users/sessions/" + session.

!if sessionExists {
	$filesFolder = userFolder + "/files/v2/main".
	$uploadName = filesFolder + "/" + id.
	resultRef = strFirstLine: fileContent: uploadName + "/currentVersion.txt".
}