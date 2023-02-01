$undelete = "true" eq ($getHeader objFirstProperty _request): "kalzit-undelete".

`Update a single cookie`
$pushCookie = ($cookieName ; $cookieValue) fun {
	print: "Pushing cookie " + cookieName + " to the server".
	(void eq cookieValue) ifElse {
		print "pushCookie FAILED! (no cookie value provided; probably a bug on the server)".
		`Return name` "failed";cookieName
	};{
		(($calcitSession eq cookieName) | $calcitUserPassword eq cookieName) ifElse {
			print: "WARNING: The session " + session + " tried to push a password or session to the server.".
			`Return name anyway` "failed";cookieName
		};{
			$deletionMarker = userFolder + "/deletedkeys/" + urlEncodeParameter: cookieName.
			fileDelete: userFolder + "/keys.json".
			
			!if undelete {
				`Remove a potential deletion marker`
				fileDelete: deletionMarker.
			}.
			
			!ifElse (not: fileIsFile: deletionMarker) {
				`Save the cookie (it is not marked as deleted)`
				(userFolder + "/keys/" + urlEncodeParameter: cookieName) fileWrite cookieValue.
				`Return a value that indicates a deleted key`
				"succeeded";cookieName
			};{
				print "pushCookie DONE!".
				`Worked - return a success value` "deleted";cookieName
			}.
			
		}
	}
}.

($startServing of _request): fileMime: "txt".
sessionExists ifElse {
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
		resultRef = print: '{"failed":' + failed + ',"deleted":' + deleted + ',"succeeded":' + succeeded + '}'
	}
};{
	`Failed - return a proper JSON respons`
	resultRef = '{"error":"No session provided", "logout":true}'.
	print "pushCookie FAILED! (no user token)".
}.
