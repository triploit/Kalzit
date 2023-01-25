$session = $session urlGetParameter $url propOf _request.
print: (!dateString) + "Loggint out " + session.
$sessionExists = fileIsFolder: $userFolder = serverUsersFolder + "/sessions/" + session.

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