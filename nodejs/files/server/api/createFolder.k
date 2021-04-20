$folder = SafeFilePath: "folder" urlGetParameter $url propOf _request.
$session ? Float = "session" urlGetParameter $url propOf _request.

$userTokenExists = false eq void eq $userToken = fileContent: "./nogit/users/sessions/" + session + ".txt".

!if userTokenExists {
	$accessFolder = "./nogit/users/data/v3/" + userToken + "/files/versionedAccess/v2".
	fileCreateFolders: accessFolder + "/" + folder.
	
	`Delete all accessListing files`
	{fileDelete each x} folderContentDeepChunksAsync  "./nogit/users/data/v3/" + userToken + "/files/accessListings".
}