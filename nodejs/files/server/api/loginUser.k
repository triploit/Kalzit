$structureVersion = "v3".
print: "Performing a user login".
$userName = ($getHeader objFirstProperty _request): "kalzit-user-name".
$userPassword = ($getHeader objFirstProperty _request): "kalzit-user-password".

$sessionsFolder = "./nogit/users/sessions".
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
	print: $sessionId ? String = !generateUnusedSessionId.
	
	`Store user id in session file`
	(sessionsFolder + "/" + sessionId + ".txt") fileWrite userToken.
	
	`Store session id in user folder`
	$userDataFolder = "./nogit/users/data/"  + structureVersion + "/" + userToken.
	fileCreateFolder: userDataFolder + "/sessions".
	fileCreateFolder: userDataFolder + "/sessions/" + sessionId.
	
	`Store expiration date (session is valid for three days)`
	(userDataFolder + "/sessions/" + sessionId + "/expiration.txt") fileWrite String: (daysToMillis: 30) + !getCurrentDate.
	
	`Return session id`
	sessionId
}.

$getUserSession = ($userToken ? String) fun {
	$idFile = "./nogit/users/data/" + structureVersion + "/" + userToken + "/session/id.txt".
	!ifElse (fileIsFile: sessionFile) {
		`Check if session is expired`
		$expirationFile = "./nogit/users/data/" + structureVersion + "/" + userToken + "/session/expiration.txt".
		!ifElse (fileIsFile: expirationFile) {
			`Compare dates`
			!ifElse ((Int: fileContent: expirationFile) < !getCurrentDate) {
				`Session expired - remove and create a new one`
				fileDelete: idFile.
				fileDelete: expirationFile.
				createUserSession: userToken
			};{
				`Session valid - return`
				fileContent: idFile
			}
		};{
			`Invalid session - remove and create a new one`
			fileDelete: idFile.
			createUserSession: userToken
		}
	};{
		`No active session - create a new one`
		createUserSession: userToken
	}
}.

!if ((void eq userName) | (void eq userPassword)) {
	resultRef = "1" + strNewline + "The headers 'kalzit-user-name' and 'kalzit-user-password' need to be set. (Most likely an error with your native app)".
}. else {
	$fname = "./nogit/users/plain/" + structureVersion + "/" + urlEncodeParameter: userName.
	!if ((fileIsFile: fname) & fileExists: fname) {
		$userToken = fileContent: fname.
		$passwordFolder = "./nogit/users/data/"  + structureVersion + "/" + userToken + "/password".
		!if (fileIsFolder: passwordFolder) {
			$storedHash = fileContent: passwordFolder + "/hash.txt".
			$passwordSalt = fileContent: passwordFolder + "/salt.txt".
			$hashFromInput = userPassword shaFiveTwelveHashWithSalt passwordSalt.
			
			(storedHash eq hashFromInput) ifElse {
				resultRef = "0" + strNewline + getUserSession: userToken
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
