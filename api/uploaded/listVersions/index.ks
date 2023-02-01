$id = SafeFilePath: "id" urlGetParameter $url propOf _request.

!if sessionExists {
	$filesFolder = userFolder + "/files/v2/main".
	
	!if (fileIsFile: print: ($uploadName = filesFolder + "/" + id) + "/currentVersion.txt") {
		asyncRef = true.
		$versionFolders = fileIsFolder filter folderContent: uploadName.
		($startServing propOf _request): "text/plain".
		($endServing propOf _request): objToJson: {Int: fileName: x} each versionFolders.
	}
}
