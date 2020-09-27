$id ? SafeFilePath = "id" urlGetParameter $url propOf _request.
$session ? Float = "session" urlGetParameter $url propOf _request.

$userTokenExists = false eq void eq $userToken = fileContent: "./nogit/users/sessions/" + session + ".txt".

!if userTokenExists {

	$filesFolder = "./nogit/users/data/v3/" + userToken + "/files".
	$folderName = filesFolder + "/access/" + id.
	$getFileName = fileName.
	
	!if (fileIsFolder: folderName) {
		asyncRef = true.
		
		($fileNames fun {
			$kmp = objToJson: 
			
				kmpFromObjectCollection: ($fn fun {
					print: $fileName = "./" + fn.
					
					!ifElse (fileIsFolder: fileName + "/access") {
						`Add a folder entry to the result`
							["redirect";print: "/api/folder?session=" + session + "&id=" + urlEncodeParameter: fn];
							["protocolVersion";"2.1.0"];
							["title";getFileName: fileName].
					};{
						`Add a file entry to the result`
						(parseJson: fileContent: filesFolder + "/" + (fileContent: fileName));
						["title";getFileName: fileName]
					}
				}) each folderContent: folderName.
				
				($startServing propOf _request): fileMime: "txt".
				($write propOf _request): kmp.
				do:($endServing propOf _request).
			}) folderContentAsync folderName.
	}
	
}