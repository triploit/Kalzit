print: $url = $url urlGetParameter ($url of _request).

$urlFile = "./nogit/sites/urls/" + (urlEncodeParameter: url) + ".txt".
!if (fileIsFile: urlFile) {
	resultRef = "0" + strNewline + fileContent: urlFile.
}. !else {
	$counterFile = "./nogit/sites/count.txt".
	$siteCount = (Int: fileContent: counterFile) + 1.
	$idFile = "./nogit/sites/ids/" + siteCount + ".txt".
	
	urlFile fileWrite siteCount.
	counterFile fileWrite siteCount.
	idFile fileWrite url.
	resultRef = "0" + strNewline + siteCount.
}