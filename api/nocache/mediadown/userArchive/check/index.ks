$id ? SafeFilePath = "id" urlGetParameter $url propOf _request.
$session ? Float = "session" urlGetParameter $url propOf _request.

$userTokenExists = false eq void eq $userToken = fileContent: "./nogit/users/sessions/" + session + ".txt".

!if userTokenExists {

	$resultingFileName = "./generated/userArchive_" + userToken + ".zip".
	
	!if (fileIsFile: resultingFileName) {
		resultRef = "DONE".
	}. !else {
		!if (fileIsFile: resultingFileName + ".zipmarker.txt") {
			resultRef = "WIP".
		}. !else {
			resultRef = "FAIL"	
		}
	}.
	
}. !else {
	resultRef = "FAIL"
}.