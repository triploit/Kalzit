print: (!dateString) + "Logging out " + session.

!if ~sessionExistsRef {
	$userSessionFolder = ~userFolderRef + "/sessions".
	
	fileDelete: userSessionFolder + "/keys.json".
	fileDelete: userSessionFolder + "/files/audio-kmp.json".
	
	!if (fileIsFile: userSessionFolder + "/" + session + "/expiration.txt") {
		runCommandFromArray: "rm";"-rf";(userSessionFolder + "/" + session).
	}.
	
	`TODO: We only delete the symbolic link to the user folder, not the actual user folder itself. Make that clear in the code`
	fileDelete: ~userFolderRef.
}
