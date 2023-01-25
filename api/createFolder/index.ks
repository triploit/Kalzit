$folder = SafeFilePath: "folder" urlGetParameter $url propOf _request.

$session ? Float = "session" urlGetParameter $url propOf _request.
$sessionExists = fileIsFolder: $userFolder = serverUsersFolder + "/sessions/" + session.

!if sessionExists {
	$accessFolder = userFolder + "/files/v2/main".
	
	`TODO: add a check for nested folder creation (where multiple folders are created at once) - that will not be supported sooner or later`
	fileCreateFolder: accessFolder + "/" + folder.
	fileDelete: accessFolder + "/" + folder + "/.deleted.txt".
	
	`Delete the appropriate listing file - assuming that only one layer is new, so we can remove the listing.json file of the parent folder`
	fileDelete: (fileParent: accessFolder + "/" + folder) + "/listing.json".
}