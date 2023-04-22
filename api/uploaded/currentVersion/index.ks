$id = SafeFilePath: "id" urlGetParameter $url propOf _request.

!if ~sessionExistsRef {
	$filesFolder = ~userFolderRef + "/files/v2/main".
	$uploadName = filesFolder + "/" + id.
	resultRef = strFirstLine: fileContent: uploadName + "/currentVersion.txt".
}
