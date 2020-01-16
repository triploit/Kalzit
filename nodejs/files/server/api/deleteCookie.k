$cookieName = $cookie urlGetParameter ("url" objFirstProperty _request).
$rawCookieString = ($cookie objFirstProperty _request).

print: "Deleting cookie " + cookieName + " from the server".
$userTokenExists = false eq (void eq $userToken = rawCookieString parseCookieValue $calcitUserToken).
userTokenExists ifElse {
	$fname = ("./nogit/users/data/" + userToken + "/cookie_" + urlEncodeParameter: cookieName + ".txt").
	(not: fileIsFile: fname) ifElse {
		resultRef = "1" + strNewline + "No cookie named " + cookieName + " was found on the server"
	};{
		fileDelete: fname.
		resultRef = "0".
	}
};{
	resultRef = "1" + strNewline + "No user GUID was provided"
}