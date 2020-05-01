$session = ($getHeader objFirstProperty _request): "kalzit-session".
$userTokenExists = false eq void eq $userToken = fileContent: "./nogit/users/sessions/" + session + ".txt".

`Update a single cookie`
$pushCookie = ($cookieName ; $cookieValue) fun {
	print: "Pushing cookie " + cookieName + " to the server".
	(void eq cookieValue) ifElse {
		print "pushCookie FAILED! (no cookie value provided; probably a bug on the server)".
		`Return name` cookieName
	};{
		($calcitUserPassword eq cookieName) ifElse {
			print: "WARNING: The user " + userToken + " tried to push a password to the server.".
			`Return name anyway` cookieName
		};{
			("./nogit/users/data/v3/" + userToken + "/keys/" + urlEncodeParameter: cookieName) fileWrite cookieValue.
			print "pushCookie DONE!".
			`Worked - return nothing` void
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
		$failed ? (List:String) = ;/ {
			`TODO: validate input`
			(first: x) pushCookie (second: x)
		} each cookieJson.
		
		`Return code 0, plus failed updates as JSON`
		!ifNot (0 eq length: cookieJson) {fileDelete: "./nogit/users/data/v3/" + userToken + "/keys.json"}.
		resultRef = "0" + strNewline + "[" + ("," strJoin objToJson each failed) +  "]"
	}
};{
	`Failed - return code 1 to make this known`
	resultRef = "1" + strNewline + "No session provided".
	print "pushCookie FAILED! (no user token)".
}.