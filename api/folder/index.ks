$id ? SafeFilePath = "id" urlGetParameter $url propOf _request.
$session ? Float = "session" urlGetParameter $url propOf _request.

$userTokenExists = false eq void eq $userToken = fileContent: "./nogit/users/sessions/" + session + ".txt".

!if userTokenExists {
	
	$filesFolder = "./nogit/users/data/v3/" + userToken + "/files/v2/main".
	!if (fileIsFolder: filesFolder + "/" + id) {
		$listingFile = filesFolder + "/" + id + "/listing.json".
		$gzipFile = filesFolder + "/" + id + "/listing.json.gz".
		asyncRef = true.
		
		$serveListingFile = !fun () {
			"Content-Encoding" ($setHeader propOf _request) "gzip".
			($startServing propOf _request): nativeFileMime: "json".
			($writeFile propOf _request): gzipFile.
			do:($endServing propOf _request).
		}.
	
		`Check if a file listing has already been created - if yes, use that`
		!ifElse (fileIsFile: gzipFile) {
			`File listing exists - serve it to the user`
			!serveListingFile
		};{
			`No file listing is present - generate it`
			fileDelete: listingFile.
			print: $folderName = filesFolder + "/" + id.
			$getFileName = fileName.
			
			$kmp = objToJson: 
			
				kmpFromObjectCollection: ($fn fun {
					print: $fileName = "./" + fn.
					
					`Figure out if an access file represents a folder - if true, the currentVersion.txt file is not there`
					!ifElse (not: fileIsFile: fileName + "/currentVersion.txt") {
						`Add a folder entry to the result`
							["redirect";print: "/api/folder?session=" + session + "&id=" + urlEncodeParameter: id + "/" + getFileName: fileName];
							["protocolVersion";"2.1.0"];
							["title";id + "/" + getFileName: fileName];
							["kind";"folder"].
					};{
						`Add a file entry to the result - use the current version`
						$currentVersion = strFirstLine: fileContent: fileName + "/currentVersion.txt".
						(parseJson: fileContent: fileName + "/" + currentVersion + "/kmp.json");
						["title";getFileName: fileName]
					}
				}) each {not: fileIsFile: x + "/.deleted.txt"} filter {not: "." strStartsWith fileName: x} filter folderContent: folderName.
				
				fileCreateFolder: fileParent: listingFile.
				!fileWrite kmp -> listingFile.
				runCommandFromArray: "gzip"; listingFile.
				
				`Serve the file`
				!serveListingFile
		}
	}
}.

resultRef = "".