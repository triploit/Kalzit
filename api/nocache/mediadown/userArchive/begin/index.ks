$id ? SafeFilePath = "id" urlGetParameter $url propOf _request.
$session ? Float = "session" urlGetParameter $url propOf _request.

$userTokenExists = false eq void eq $userToken = fileContent: "./nogit/users/sessions/" + session + ".txt".

!if userTokenExists {

	$resultingFileName = "./generated/userArchive_" + userToken + ".zip".
	$markerFile = resultingFileName + ".zipmarker.txt".
	
	fileDelete: resultingFileName.
	markerFile fileWrite "".
	{
		print: "User archive zip command is done! For " + userToken.
		fileDelete: markerFile.
	} runCommandAsync print: "zip -9 -r -q " + resultingFileName + " ./nogit/users/data/v3/" + userToken + "/*".
	
	resultRef = "User archive creation has started"
	
}. !else {
	resultRef = "No valid session"
}.