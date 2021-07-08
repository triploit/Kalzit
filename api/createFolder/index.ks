$folder = SafeFilePath: "folder" urlGetParameter $url propOf _request.
$session ? Float = "session" urlGetParameter $url propOf _request.

$userTokenExists = false eq void eq $userToken = fileContent: "./nogit/users/sessions/" + session + ".txt".

!if userTokenExists {
	$accessFolder = "./nogit/users/data/v3/" + userToken + "/files/v2/main".
	
	`TODO: add a check for nested folder creation (where multiple folders are created at once) - that will not be supported sooner or later`
	fileCreateFolder: accessFolder + "/" + folder.
	fileDelete: accessFolder + "/" + folder + "/.deleted.txt".
	
	`Delete the appropriate listing file - assuming that only one layer is new, so we can remove the listing.json.gz file of the parent folder`
	fileDelete: (fileParent: accessFolder + "/" + folder) + "/listing.json.gz".
}