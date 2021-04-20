$requestedDownload = $url urlGetParameter $url propOf _request.
$resultingFileName = "./generated/vdl_" + (("%";"_prct_") strReplace urlEncodeParameter: requestedDownload) + ".m4a".

!if (fileIsFile: resultingFileName) {
	resultRef = "DONE".
}. !else {
	!if (fileIsFile: resultingFileName + ".dlmarker.txt") {
		resultRef = "WIP".
	}. !else {
		resultRef = "FAIL"	
	}
}.