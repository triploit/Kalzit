$id = SafeFilePath: "id" urlGetParameter $url propOf _request.

!if sessionExists {
	$filesFolder = userFolder + "/files/v2/main".
	$uploadName = filesFolder + "/" + id.
	resultRef = strFirstLine: fileContent: uploadName + "/currentVersion.txt".
}
