$session = ($getHeader objFirstProperty _request): "kalzit-session".
$undelete = "true" eq ($getHeader objFirstProperty _request): "kalzit-undelete".
$userTokenExists = false eq void eq $userToken = fileContent: "./nogit/users/sessions/" + session + ".txt".

`Update a single cookie`
$pushCookie = ($cookieName ; $cookieValue) fun {
	print: "Pushing cookie " + cookieName + " to the server".
	(void eq cookieValue) ifElse {
		print "pushCookie FAILED! (no cookie value provided; probably a bug on the server)".
		`Return name` "failed";cookieName
	};{
		(($calcitSession eq cookieName) | $calcitUserPassword eq cookieName) ifElse {
			print: "WARNING: The user " + userToken + " tried to push a password or session to the server.".
			`Return name anyway` "failed";cookieName
		};{
			$deletionMarker = "./nogit/users/data/v3/" + userToken + "/deletedkeys/" + urlEncodeParameter: cookieName.
			fileDelete: "./nogit/users/data/v3/" + userToken + "/keys.json".
			
			!if undelete {
				`Remove a potential deletion marker`
				fileDelete: deletionMarker.
			}.
			
			!ifElse (not: fileIsFile: deletionMarker) {
				`Save the cookie (it is not marked as deleted)`
				("./nogit/users/data/v3/" + userToken + "/keys/" + urlEncodeParameter: cookieName) fileWrite cookieValue.
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
userTokenExists ifElse {
	$cookieJson = parseJson: ("getHeader" objFirstProperty _request): "kalzit-cookie-json".
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