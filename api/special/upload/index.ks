!if ("POST" eq $method propOf _request) {
	asyncRef = true.

	print: "Got a data upload request".
	$session = ($getHeader objFirstProperty _request): "kalzit-session".
	$sessionExists = fileIsFolder: $userFolder = "./nogit/users/sessions/" + session.
	
	!if sessionExists {
		`TODO: this relies on a specific file name format, which could change in the future`
		$userToken = last: "/" strSplit fileRealpath: userFolder.
		
		$onPreparation = () fun {
			`Does nothing at the moment`
		}.
		$onError = () fun {
			_request httpEndServingRaw strRaw: '{"success": 2}'
		}.
		$onSuccess = ($_postedFileName) fun {
			$filesFolder = userFolder + "/files/v2".
			fileCreateFolder: filesFolder.
			
			`Figure out where to store the file (which category)`
			$mime =  print: runCommand: "file --mime-type -b " + print: _postedFileName.
			$categoryFolder = filesFolder + "/categories/" + $category = mime switchFirst
				[{"image/" strStartsWith x}; "images"];
				[{"video/" strStartsWith x}; "videos"];
				[{"audio/" strStartsWith x}; "audio"];
				[true; "default"].
			fileCreateFolder: categoryFolder.
			fileDelete: categoryFolder + "/kmp.json".
			fileDelete: filesFolder + "/" + category + "/kmp.json".
			
			`Make this file accessible under a specific name if wanted`
			$accessName ? SafeFilePath = print: $accessName urlGetParameter $url propOf _request.
			!ifNot (void eq accessName) {
				`Create the access file`
				$currentVersion = String: !getCurrentDate.
				fileCreateFolder: print: $accessFile = filesFolder + "/main/" + accessName + "/" + currentVersion.
				
				(accessFile + "/../currentVersion.txt") fileWrite currentVersion.
				
				`Remove a potential generated file-listing of the parent folder, so it is updated on access`
				fileDelete: filesFolder + "/main/" + (fileParent: accessName) + "/listing.json.gz".
				
				_postedFileName fileRenameFile print: filesFolder + "/main/" + accessName + "/" + currentVersion + "/raw".
				
				print: "Upload done".
				
				`Delete any deletion markers that might exist`
				fileDelete: filesFolder + "/main/" + accessName + "/.deleted.txt".
				
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
				
				_request httpEndServingRaw strRaw: '{"success": 1, "endpoint": ' + (objToJson: "/api/uploaded?id=" + urlEncodeParameter: accessName) + '}'.
				
				`Here we start the first asynchronous thing - everything above was synchronous`
				!fileMdFiveHashAsync (filesFolder + "/main/" + accessName + "/" + currentVersion + "/raw") -> {
					$checksum = x.
					
					`Link the thing to the category folder (category determined above)`
					runCommand: print: "ln -s '" + (fileRealpath: filesFolder + "/main/" + accessName + "/" + currentVersion) +  "' '" + categoryFolder + "/" + checksum + "'".
					
					`Once the hash work is done, start encrypting`
					`TODO: Encrypt the /raw file and delete it`
					`TODO: Check if the user token is actually in the key map - should be, but it is better to make sure`
					$initVector = encryptFileGetInitVector:
						["key"; ($getProperty propOf mdFivePasswordHashes): userToken];
						["input"; (filesFolder + "/main/" + accessName + "/" + currentVersion + "/raw")];
						["output"; (filesFolder + "/main/" + accessName + "/" + currentVersion + "/encrypted")];
						["deleteInput"; true].
					
					`Save the init vector so we can find it later`
					!fileWrite initVector -> (filesFolder + "/main/" + accessName + "/" + currentVersion + "/iv").
				}.
				
			}.
		}.
		
		print: "We have a data upload request".
		`Check if there is enough space - we need to convert the post size estimate to megabytes, hence the division`
		`We also need roughly two times that space, because the file will be encrypted later`
		!diskSpaceClean (2 * (do: $getPostDataByteSizeEstimate propOf _request) % 1000000) {
			$successful = x.
			!ifElse (successful) {
				`Actually accept the upload`
				($getPostDataFileAsync propOf _request):
					[$onSuccess; onSuccess];
					[$onError; onError];
					[$onPreparation; onPreparation]
			};{
				`Respond with a code for too little space`
				_request httpEndServingRaw strRaw: '{"success": 0}'.
			}
		}
	}. !else {
		_request httpEndServingRaw strRaw: '{"success": 0}'.
	}
}. !else {
	_request httpEndServingRaw strRaw: "Use this API with a POST request".	
}
