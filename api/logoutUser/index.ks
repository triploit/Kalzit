print: "Performing a user logout".
$session = $session urlGetParameter $url propOf _request.
print: session.

$sessionFile = "./nogit/users/sessions/" + session + ".txt".
!if (fileIsFile: sessionFile) {
	$userToken = fileContent: sessionFile.
	$userDataFolder =  "./nogit/users/data/v3/" + userToken.
	$userSessionFolder = userDataFolder + "/sessions".
	
	fileDelete: userDataFolder + "/keys.json".
	fileDelete: userDataFolder + "/files/audio-kmp.json".
	
	fileDelete: userSessionFolder + "/" + session + "/expiration.txt".
	fileDeleteFolder: userSessionFolder + "/" + session.
	fileDelete: sessionFile.
}