!if ("/api/special/upload" strStartsWith $url propOf _request) {
	print: "Got a data upload request".
	$session = ($getHeader objFirstProperty _request): "kalzit-session".
	$userTokenExists = false eq void eq $userToken = fileContent: "./nogit/users/sessions/" + session + ".txt".
	
	!if userTokenExists {
		($getPostDataFileAsync propOf _request) $_postedFileName fun {
			$filesFolder = "./nogit/users/data/v3/" + userToken + "/files/v2".
			fileCreateFolder: filesFolder.
			
			!if (void eq _postedFileName) {
				_request httpEndServingRaw strRaw: '{"success": 0}'.
			}. !else {
				`Figure out where to store the file (which category)`
				$mime =  print: runCommand: "file --mime-type -b " + _postedFileName.
				$categoryFolder = filesFolder + "/categories/" + $category = mime switchFirst
					[{"image/" strStartsWith x}; "images"];
					[{"video/" strStartsWith x}; "videos"];
					[{"audio/" strStartsWith x}; "audio"];
					[true; "default"].
				fileCreateFolder: categoryFolder.
				fileDelete: categoryFolder + "/kmp.json".
				fileDelete: filesFolder + "/" + category + "/kmp.json".
				
				$checksum = mdFiveHash: fileContentRaw: _postedFileName.
				
				`Make this file accessible under a specific name if wanted`
				$accessName ? SafeFilePath = print: $accessName urlGetParameter $url propOf _request.
				!ifNot (void eq accessName) {
					`Create the access file`
					$currentVersion = String: !getCurrentDate.
					fileCreateFolders: print: $accessFile = filesFolder + "/main/" + accessName + "/" + currentVersion.
					
					(accessFile + "/../currentVersion.txt") fileWrite currentVersion.
					
					`Remove a potential generated file-listing of the parent folder, so it is updated on access`
					fileDelete: filesFolder + "/main/" + (fileParent: accessName) + "/listing.json".
					
					_postedFileName fileRenameFile print: filesFolder + "/main/" + accessName + "/" + currentVersion + "/raw".
					
					print: "Upload done".
					!ifNot (void eq mime) {
						`Create a file which stores the mime type`
						(filesFolder + "/main/" + accessName + "/" + currentVersion + "/mime.txt") fileWrite mime
					}.
					
					`Attempt a quick thumbnail creation`
					runCommand: print: "ffmpeg -i '" + filesFolder + "/main/" + accessName + "/" + currentVersion + "/raw' -vf 'scale=300:-2' '" + filesFolder + "/main/" + accessName + "/" + currentVersion + "/thumbnail.png'".
					
					`Attempt a quick metadata listing`
					(filesFolder + "/main/" + accessName + "/" + currentVersion + "/metadata.json") fileWrite runCommand: print: "ffprobe  -v quiet -print_format json -show_format '" + filesFolder + "/main/" + accessName + "/" + currentVersion + "/raw'".
					
					$kmpKind = first: (category switchEq
						["images";"image"];
						["audio";"audio"];
						["videos";"video"]);
						`default` "file".
					$kmpObject =
						(kmpFromUrlWithoutKind: "/api/uploaded?id=" + urlEncodeParameter: accessName);
						["kind";kmpKind];
						["keptArguments";
							[["session"]]
						];
						!if (fileIsFile: filesFolder + "/main/" + accessName + "/" + currentVersion + "/thumbnail.png"){
							["thumbnail";
								[
									["default";"/api/thumbnail?id=" + urlEncodeParameter: accessName]
								]
							]
						}.
					(filesFolder + "/main/" + accessName + "/" + currentVersion + "/kmp.json") fileWrite objToJson: kmpObject.
					
					_request httpEndServingRaw strRaw: '{"success": 1, "endpoint": ' + (objToJson: "/api/uploaded?id=" + category + "/" + checksum) + '}'.
					
					`Link the thing to the category folder (category determined above)`
					runCommand: print: "ln -s '" + (fileRealpath: filesFolder + "/main/" + accessName + "/" + currentVersion) +  "' '" + categoryFolder + "/" + checksum + "'".
				}.
				
			}
		}.
	}. !else {
		_request httpEndServingRaw strRaw: '{"success": 0}'.
	}
}. !else {
	_request httpEndServingRaw strRaw: "Good".	
}