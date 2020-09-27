!if ("/api/special/upload" strStartsWith $url propOf _request) {
	print: "Got a data upload request".
	$session = ($getHeader objFirstProperty _request): "kalzit-session".
	$userTokenExists = false eq void eq $userToken = fileContent: "./nogit/users/sessions/" + session + ".txt".
	
	!if userTokenExists {
		($getPostDataFileAsync propOf _request) $_postedFileName fun {
			$filesFolder = "./nogit/users/data/v3/" + userToken + "/files".
			fileCreateFolder: filesFolder.
			
			!if (void eq _postedFileName) {
				_request httpEndServingRaw strRaw: '{"success": 0}'.
			}. !else {
				`Figure out where to store the file (which category)`
				$mime =  ($getHeader propOf _request): "content-type".
				$destinationFolder = filesFolder + "/" + $category = first: mime switch
					[{x eq first: "image/[a-z0-9]+" match x}; "standard-images"];
					[{"image/" strStartsWith x}; "images"];
					[{x eq first: "video/[a-z0-9]+" match x}; "standard-videos"];
					[{"video/" strStartsWith x}; "videos"];
					[{x eq first: "audio/[a-z0-9]+" match x}; "standard-audio"];
					[{"audio/" strStartsWith x}; "audio"];
					[true; "default"].
				fileCreateFolder: destinationFolder.
				fileDelete: destinationFolder + "/kmp.json".
				fileCreateFolder: destinationFolder + "/raw".
				
				$checksum = mdFiveHash: fileContentRaw: _postedFileName.
				_postedFileName fileRenameFile destinationFolder + "/raw/" + checksum.
				
				print: "Upload done".
				!ifNot (void eq mime) {
					`Create a file which stores the mime type`
					fileCreateFolder: destinationFolder + "/mime".
					(destinationFolder + "/mime/" + checksum + ".mime.txt") fileWrite mime
				}.
				
				`Make this file accessible under a specific name if wanted`
				$accessName ? SafeFilePath = print: $accessName urlGetParameter $url propOf _request.
				!ifNot (void eq accessName) {
					fileCreateFolders: fileParent: print: $accessFile = filesFolder + "/access/" + accessName.
					accessFile fileWrite (fileName: destinationFolder) + "/kmp/" + checksum + ".json".
				}.
				
				fileCreateFolder: destinationFolder + "/thumbnails".
				`Attempt a quick thumbnail creation`
				runCommand: print: "./utilities/ffmpeg -i '" + destinationFolder + "/raw/" + checksum + "' -vf 'scale=300:-2' '" + destinationFolder + "/thumbnails/" + checksum + ".thumbnail.png'".
				
				fileCreateFolder: destinationFolder + "/metadata".
				`Attempt a quick metadata listing`
				(destinationFolder + "/metadata/" + checksum + ".json") fileWrite runCommand: "./utilities/ffprobe  -v quiet -print_format json -show_format '" + destinationFolder + "/raw/" + checksum + "'".
				
				fileCreateFolder: destinationFolder + "/kmp".
				$kmpKind = first: (category switchEq
					["standard-images";"image"];
					["standard-audio";"audio"];
					["standard-videos";"video"]);
					`default` "file".
				$kmpObject =
					(kmpFromUrlWithoutKind: "/api/uploaded?id=" + category + "/raw/" + checksum);
					["kind";kmpKind];
					["keptArguments";
						[["session"]]
					];
					["thumbnail";
						[
							["default";"/api/thumbnail?id=" + category + "/thumbnails/" + checksum + ".png"]
						]
					].
				(destinationFolder + "/kmp/" + checksum + ".json") fileWrite objToJson: kmpObject.
				
				
				_request httpEndServingRaw strRaw: '{"success": 1, "endpoint": ' + (objToJson: "/api/uploaded?id=" + category + "/" + checksum) + '}'.
			}
		}.
	}. !else {
		_request httpEndServingRaw strRaw: '{"success": 0}'.
	}
}. !else {
	_request httpEndServingRaw strRaw: "Good".	
}