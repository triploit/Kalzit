$undelete = "true" eq ($getHeader objFirstProperty _request): "kalzit-undelete".

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
				`Save the cookie (it is not marked as deleted)`
				(~userFolderRef + "/keys/" + urlEncodeParameter: cookieName) fileWrite cookieValue.
				`Return a value that indicates a deleted key`
				"succeeded";cookieName
			};{
				`Worked - return a success value` "deleted";cookieName
			}.
			
		}
	}
}.

($startServing of _request): fileMime: "txt".
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
