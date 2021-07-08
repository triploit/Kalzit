$folder = SafeFilePath: "folder" urlGetParameter $url propOf _request.
$session ? Float = "session" urlGetParameter $url propOf _request.

$userTokenExists = false eq void eq $userToken = fileContent: "./nogit/users/sessions/" + session + ".txt".

!if userTokenExists {
	$accessFolder = "./nogit/users/data/v3/" + userToken + "/files/v2/main".
	
	`Starting at the specified folder, mark all directories with a deleted.txt file`
	$markFolderAsDeleted = !fun ($folder) {
		!fileWrite (String: !getCurrentDate) -> (folder + "/.deleted.txt").
		fileDelete: folder + "/listing.json.gz".
		fileDelete: (fileParent: folder) + "/listing.json.gz".
	}.
	
	markFolderAsDeleted: accessFolder + "/" + folder.
	!folderContentDeepAsyncNotLinkOrHidden (accessFolder + "/" + folder) -> {
		print: $potentialFolder = x.
		!if (fileIsFolderNotLink: potentialFolder) {
			`We have a folder - create "deleted.txt" with the current date`
			print: potentialFolder.
			markFolderAsDeleted: potentialFolder.
		}
	}
	
}