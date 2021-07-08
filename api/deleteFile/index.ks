$id = SafeFilePath: "id" urlGetParameter $url propOf _request.
$session ? Float = "session" urlGetParameter $url propOf _request.

$userTokenExists = false eq void eq $userToken = fileContent: "./nogit/users/sessions/" + session + ".txt".

!if userTokenExists {
	$accessFolder = "./nogit/users/data/v3/" + userToken + "/files/v2/main".
	
	`Starting at the specified folder, mark all version directories with a deleted.txt file`
	$markFolderAsDeleted = !fun ($folder) {
		!fileWrite (String: !getCurrentDate) -> (folder + "/.deleted.txt").
		fileDelete: folder + "/listing.json.gz".
		fileDelete: (fileParent: folder) + "/listing.json.gz".
	}.
	
	!if (fileIsFile: accessFolder + "/" + id + "/currentVersion.txt") {
		markFolderAsDeleted: accessFolder + "/" + id.
		!folderContentDeepAsyncNotLinkOrHidden (accessFolder + "/" + id) -> {
			print: $potentialFolder = x.
			!if (fileIsFolderNotLink: potentialFolder) {
				`We have a folder - create "deleted.txt" with the current date`
				print: potentialFolder.
				markFolderAsDeleted: potentialFolder.
			}
		}
	}
	
}