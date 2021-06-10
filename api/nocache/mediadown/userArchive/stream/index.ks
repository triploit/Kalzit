$session ? Float = "session" urlGetParameter $url propOf _request.

$userTokenExists = false eq void eq $userToken = fileContent: "./nogit/users/sessions/" + session + ".txt".

!if userTokenExists {

	$resultingFileName = "./generated/userArchive_" + userToken + ".zip".
	asyncRef = true.
	($startServing propOf _request): fileMime: resultingFileName.
	($writeFile propOf _request): resultingFileName.
	do:($endServing propOf _request).
	
}. !else {
	resultRef = "FAIL"
}.