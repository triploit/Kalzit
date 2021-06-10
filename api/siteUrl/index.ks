print: $id ? Int = $id urlGetParameter ($url of _request).

$idFile = "./nogit/sites/ids/" + id + ".txt".
!if (fileIsFile: idFile) {
	resultRef = "0" + strNewline + fileContent: idFile.
}. !else {
	`No URL with this ID was found`
	resultRef = "1" + strNewline + "/404".
}