$structureVersion = "v3".
$userName = ($getHeader objFirstProperty _request): "kalzit-user-name".
$userPassword = ($getHeader objFirstProperty _request): "kalzit-user-password".

$sessionsFolder = serverUsersFolder + "/sessions".
fileCreateFolder: sessionsFolder.

$generateUnusedSessionId = () fun {
	$randomId ? String = !random.
	!ifElse (not: fileIsFile: sessionsFolder + "/" + randomId + ".txt") {
		`Session unused`
		randomId
	};{
		`Session used`
		!generateUnusedSessionId
	}
}.

$createUserSession = ($userToken ? String) fun {
	$sessionId ? String = !generateUnusedSessionId.
	$userDataFolder =serverUsersFolder + "/data/"  + structureVersion + "/" + userToken.
	
	`In the "global" sessions folder, create a symlink to the user home (name is the session id)`
	runCommandFromArray:
		"ln"; "-s"; (fileRealpath: userDataFolder); (sessionsFolder + "/" + sessionId).
	
	`Create a session folder in the user folder`
	fileCreateFolder: userDataFolder + "/sessions".
	fileCreateFolder: $sessionFolder = userDataFolder + "/sessions/" + sessionId.
	
	`Store expiration date (marks session as valid for 30 days)`
	(sessionFolder + "/expiration.txt") fileWrite String: (daysToMillis: 30) + !getCurrentDate.
	
    `This was in "httpServer - sessionUpgrade" before`
    $header = ($getHeader objFirstProperty _request).
	
	!fileWrite "standard" -> (sessionFolder + "/securityLevel.txt").
	!fileWrite header: "user-agent" -> (sessionFolder + "/userAgent.txt").
	!fileWrite header: "accept-language" -> (sessionFolder + "/language.txt").

	`Return session id`
	sessionId
}.

!if ((void eq userName) | (void eq userPassword)) {
	resultRef = "1" + strNewline + "The headers 'kalzit-user-name' and 'kalzit-user-password' need to be set. (Most likely an error with your native app)".
}. else {
	$fname = serverUsersFolder + "/plain/" + structureVersion + "/" + urlEncodeParameter: userName.
	!if ((fileIsFile: fname) & fileExists: fname) {
		$userToken = fileContent: fname.
		$passwordFolder = serverUsersFolder + "/data/"  + structureVersion + "/" + userToken + "/password".
		!if (fileIsFolder: passwordFolder) {
			$storedHash = fileContent: passwordFolder + "/hash.txt".
			$passwordSalt = fileContent: passwordFolder + "/salt.txt".
			$hashFromInput = userPassword shaFiveTwelveHashWithSalt passwordSalt.
			
			`Validate the password`
			(storedHash eq hashFromInput) ifElse {
				`Password is correct - open a session`
				resultRef = "0" + strNewline + createUserSession: userToken.
			};{
				resultRef = "3" + strNewline + "Passwords do not match"
			}
		}. !else {
			resultRef = "4" + strNewline + "No user with this token was found (please report this)"
		}
	}. else {
		resultRef = "2" + strNewline + "No user with this name was found"
	}
}
