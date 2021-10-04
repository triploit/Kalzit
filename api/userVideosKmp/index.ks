$session ? Float = "session" urlGetParameter $url propOf _request.

$sessionExists = fileIsFolder: $userFolder = "./nogit/users/sessions/" + session.

!if sessionExists {
	asyncRef = true.
	$file = userFolder + "/files/v2/categories/videos/kmp.json".
	fileCreateFolder: fileParent: file.

	!ifNot (fileIsFile: file) {
		file fileWrite objToJson: 
		(kmpFromObjectCollection:
			{not: void eq x} filter ($path fun {
				print: path.
				
				(parseJson: fileContent: path + "/kmp.json");
				["title"; fileName: fileParent: fileRealpath: path];
				!if (fileIsFile: path + "/thumbnail.png") {
					!if (fileIsFile: print: $metadataFile =  path + "/metadata.json") {
						["k-metadata";[
							parseJson: fileContent: metadataFile
						]]
					}
				}
			}) each {not: "." strStartsWith fileName: x} filter folderContent: userFolder + "/files/v2/categories/videos");
			["title"; "My videos"];
			["keptArguments";[["session"]]].
	}.
			
	($startServing propOf _request): fileMime: file.
	($writeFile propOf _request): file.
	do:($endServing propOf _request).
	
}