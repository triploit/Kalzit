$cookieName = ("getHeader" objFirstProperty _request): "kalzit-cookie-name".

print: "Pushing cookie " + cookieName + " to the server".
$cookieValue = urlDecodeParameter: ("getHeader" objFirstProperty _request): "kalzit-cookie-value".
$userTokenExists = false eq (void eq $userToken = ("getHeader" objFirstProperty _request): "kalzit-user-token").

($startServing of _request): fileMime: "txt".
userTokenExists ifElse {
	(void eq cookieValue) ifElse {
		resultRef = "2" + strNewline + "No cookie named " + cookieName + " was found".
	};{
		($calcitUserPassword eq cookieName) ifElse {
			print: "WARNING: The user " + userToken + " tried to push a password to the server. Response 2 will be given".
			resultRef = "2" + strNewline + "No cookie named " + cookieName + " was found".
		};{
			("./nogit/users/data/" + userToken + "/cookie_" + urlEncodeParameter: cookieName + ".txt") fileWrite cookieValue.
			resultRef = "0".
		}
	}
};{
	resultRef = "1" + strNewline + "No user GUID was provided"
}.
print "pushCookie DONE!".