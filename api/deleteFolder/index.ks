$folder = SafeFilePath: "folder" urlGetParameter $url propOf _request.

!if sessionExists {
	$accessFolder = userFolder + "/files/v2/main".
	
	`Starting at the specified folder, mark all directories with a deleted.txt file`
	$markFolderAsDeleted = !fun ($folder) {
		!fileWrite (String: !getCurrentDate) -> (folder + "/.deleted.txt").
		fileDelete: folder + "/listing.json".
		fileDelete: (fileParent: folder) + "/listing.json".
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
