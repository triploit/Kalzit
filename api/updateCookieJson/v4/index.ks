$undelete = "true" eq ($getHeader objFirstProperty _request): "kalzit-undelete".

$timestamp ? (0 default Int) = $time urlGetParameter $url propOf _request.

`Update a single cookie`
$pushCookie = ($cookieName ; $cookieValue) fun {
	(void eq cookieValue) ifElse {
		print (!dateString) + "WARNING: updateCookieJson - pushCookie failed (no cookie value provided; probably a bug on the server)".
		`Return name` "failed";cookieName
	};{
		(($calcitSession eq cookieName) | $calcitUserPassword eq cookieName) ifElse {
			print: "WARNING: The session " + session + " tried to push a password or session to the server.".
			`Return name anyway` "failed";cookieName
		};{
			$deletionMarker = ~userFolderRef + "/deletedkeys/" + urlEncodeParameter: cookieName.
			fileDelete: ~userFolderRef + "/keys-v2.json".
			
			!if undelete {
				`Remove a potential deletion marker`
				fileDelete: deletionMarker.
			}.
			
			!ifElse (not: fileIsFile: deletionMarker) {
				`Compare timestamps`
				$storedTime ? (0 default Int) = fileContent: ~userFolderRef + "/keytimes/" + urlEncodeParameter: cookieName.
				!ifElse (storedTime < timestamp) {
					`Pushed cookie is newer than the stored one`
					`Save the cookie`
					(~userFolderRef + "/keys/" + urlEncodeParameter: cookieName) fileWrite cookieValue.
					
					`Save the modification date`
					fileCreateFolder: (~userFolderRef + "/keytimes").
					(~userFolderRef + "/keytimes/" + urlEncodeParameter: cookieName) fileWrite "" + timestamp.
					`Worked - return a success value`
					"succeeded";cookieName
				};{
					`Pushed cookie is not newer than the stored one`
					print (!dateString) + "Pushed cookie " + cookieName + " not newer than server cookie".
					"outdated";cookieName
				}.
			};{
				`Return a value that indicates a deleted key` "deleted";cookieName
			}.
			
		}
	}
}.

($startServing propOf _request): fileMime: "txt".
~sessionExistsRef ifElse {
	$cookieJson = parseJson: "push" urlGetParameter $url propOf _request.
	!if (void eq cookieJson) {
		`Failed - no data present (code 2)`
		resultRef = "2" + 	strNewline + "No cookie JSON was provided"
	}. !else {
		$results = {
			`TODO: validate input`
			(first: x) pushCookie (second: x)
		} each cookieJson.
		
		$failed = '[' + ("," strJoin objToJson each $failed objPropertyValues results) + ']'.
		$succeeded = '[' + ("," strJoin objToJson each $succeeded objPropertyValues results) + ']'.
		$deleted = '[' + ("," strJoin objToJson each $deleted objPropertyValues results) + ']'.
		
		`Build and return a JSON response`
		print: (!dateString) + resultRef = '{"failed":' + failed + ',"deleted":' + deleted + ',"succeeded":' + succeeded + '}'
	}
};{
	`Failed - return a proper JSON respons`
	resultRef = '{"error":"No session provided", "logout":true}'.
	print (!dateString) + "updateCookieJson failed! (no user token)".
}.
