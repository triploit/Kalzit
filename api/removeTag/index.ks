$id = SafeFilePath: "id" urlGetParameter $url propOf _request.
$category = SafeFilePath: "tag" urlGetParameter $url propOf _request.

!if ~sessionExistsRef {
	$accessFolder = ~userFolderRef + "/files/v2/main".
	$fileFolder = accessFolder + "/" + id.
	$currentVersion = fileContent: fileFolder + "/currentVersion.txt".
	print: $fileToDelete = accessFolder + "/" + id + "/" + currentVersion + "/categories/" + category.
	
	!if (fileIsFile: fileToDelete) {
		fileDelete: fileToDelete.
		fileDelete: ~userFolderRef + "/files/v2/categories/" + category + "-kmp.json".
	}
	
}
