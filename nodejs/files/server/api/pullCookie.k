$cookieName = ($getHeader objFirstProperty _request): "kalzit-cookie-name".

print: "Pulling cookie " + cookieName + " from the server".
$userTokenExists = false eq void eq $userToken = ($getHeader objFirstProperty _request): "kalzit-user-token".

($startServing of _request): fileMime: "txt".
userTokenExists ifElse {
	$fname = ("./nogit/users/data/v2/" + userToken + "/keys/" + urlEncodeParameter: cookieName).
	$cookieValue = ((fileIsFile: fname) & fileExists: fname) if {
		fileContent: fname.
	}.
	(void eq cookieValue) ifElse {
		resultRef = "1" + strNewline + "No cookie named " + cookieName + " was found on the server"
	};{
		resultRef = "0" + strNewline + urlEncodeParameter: cookieValue
	}
};{
	resultRef = "1" + strNewline + "No user GUID was provided"
}