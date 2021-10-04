print: "Performing a user logout".

$session = $session urlGetParameter $url propOf _request.
print: session.
$sessionExists = fileIsFolder: $userFolder = "./nogit/users/sessions/" + session.

!if sessionExists {
	$userSessionFolder = userFolder + "/sessions".
	
	fileDelete: userSessionFolder + "/keys.json".
	fileDelete: userSessionFolder + "/files/audio-kmp.json".
	
	!if (fileIsFile: userSessionFolder + "/" + session + "/expiration.txt") {
		runCommandFromArray: "rm";"-rf";(userSessionFolder + "/" + session).
	}.
	
	`TODO: We only delete the symbolic link to the user folder, not the actual user folder itself. Make that clear in the code`
	fileDelete: userFolder.
}