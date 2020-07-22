$session = ($getHeader objFirstProperty _request): "kalzit-session".
$userTokenExists = false eq void eq $userToken = fileContent: "./nogit/users/sessions/" + session + ".txt".

$cookieName = ($getHeader objFirstProperty _request): "kalzit-cookie-name".
$rawCookieString = ($cookie objFirstProperty _request).

print: "Deleting cookie " + cookieName + " from the server".
userTokenExists ifElse {
	print: $fname = ("./nogit/users/data/v3/" + userToken + "/keys/" + urlEncodeParameter: cookieName).
	(not: fileIsFile: fname) ifElse {
		resultRef = "1" + strNewline + "No cookie named " + cookieName + " was found on the server"
	};{
		fileDelete: fname.
		resultRef = "0".
	}
};{
	resultRef = "1" + strNewline + "No user GUID was provided"
}