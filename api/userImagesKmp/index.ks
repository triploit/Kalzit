$session ? Float = "session" urlGetParameter $url propOf _request.
$sessionExists = fileIsFolder: $userFolder = "./nogit/users/sessions/" + session.

!if sessionExists {
	asyncRef = true.
	$file = userFolder + "/files/v2/categories/images/kmp.json".
	fileCreateFolder: fileParent: file.

	!ifNot (fileIsFile: file) {
		file fileWrite objToJson: 
		(kmpFromObjectCollection:
			{not: void eq x} filter ($path fun {
				print: path.
				
				!if (fileIsFile: path + "/thumbnail.png") {
					(parseJson: fileContent: path + "/kmp.json");
					!if (fileIsFile: print: $metadataFile =  path + "/metadata.json") {
						["k-metadata";[
							parseJson: fileContent: metadataFile
						]]
					}
				}
			}) each folderContent: userFolder + "/files/v2/categories/images");
			["title"; "My images"];
			["keptArguments";[["session"]]].
	}.
			
	($startServing propOf _request): fileMime: file.
	($writeFile propOf _request): file.
	do:($endServing propOf _request).
	
}