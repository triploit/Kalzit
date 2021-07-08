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
	
	!if (fileIsFile: userSessionFolder + "/" + session + "/expiration.txt") {
		runCommandFromArray: "rm";"-rf";(userSessionFolder + "/" + session).
	}.
	fileDelete: sessionFile.
}