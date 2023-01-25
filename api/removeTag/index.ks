$id = SafeFilePath: "id" urlGetParameter $url propOf _request.
$category = SafeFilePath: "tag" urlGetParameter $url propOf _request.

$session ? Float = "session" urlGetParameter $url propOf _request.
$sessionExists = fileIsFolder: $userFolder = serverUsersFolder + "/sessions/" + session.

!if sessionExists {
	$accessFolder = userFolder + "/files/v2/main".
	$fileFolder = accessFolder + "/" + id.
	$currentVersion = fileContent: fileFolder + "/currentVersion.txt".
	print: $fileToDelete = accessFolder + "/" + id + "/" + currentVersion + "/categories/" + category.
	
	!if (fileIsFile: fileToDelete) {
		fileDelete: fileToDelete.
		fileDelete: userFolder + "/files/v2/categories/" + category + "-kmp.json".
	}
	
}