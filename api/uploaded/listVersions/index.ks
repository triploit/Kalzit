$id = SafeFilePath: "id" urlGetParameter $url propOf _request.
$session ? Float = "session" urlGetParameter $url propOf _request.

$userTokenExists = false eq void eq $userToken = fileContent: "./nogit/users/sessions/" + session + ".txt".

!if userTokenExists {
	$filesFolder = "./nogit/users/data/v3/" + userToken + "/files/v2/main".
	
	!if (fileIsFile: print: ($uploadName = filesFolder + "/" + id) + "/currentVersion.txt") {
		asyncRef = true.
		$versionFolders = fileIsFolder filter folderContent: uploadName.
		($startServing propOf _request): "text/plain".
		($endServing propOf _request): objToJson: {Int: fileName: x} each versionFolders.
	}
}