$cookieName = ($getHeader objFirstProperty _request): "kalzit-cookie-name".
$rawCookieString = ($cookie objFirstProperty _request).

print: "Deleting cookie " + cookieName + " from the server".
!ifElse ~sessionExistsRef {
	`Prepare the tracking of deleted entries (prevents other devices from uploading them again)`
	$deletionsFolder = ~userFolderRef + "/deletedkeys/".
	fileCreateFolder: deletionsFolder.
	
	print: $fname = (~userFolderRef + "/keys/" + urlEncodeParameter: cookieName).
	(not: fileIsFile: fname) ifElse {
		resultRef = "1" + strNewline + "No cookie named " + cookieName + " was found on the server"
	};{
		fname fileRenameFile (deletionsFolder + "/" + urlEncodeParameter: cookieName).
		
		`Remove the cached version of the user data .json file`
		fileDelete: ~userFolderRef + "/keys.json".
        fileDelete: ~userFolderRef + "/keys-v2.json".
		
		resultRef = "0".
	}
};{
	resultRef = "1" + strNewline + "No user was found for the given session"
}
