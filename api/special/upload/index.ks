!if ("POST" eq $method propOf _request) {
	asyncRef = true.
	
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
			$mime =  runCommand: "file --mime-type -b " + _postedFileName.
			$category = mime switchFirst
				[{"image/" strStartsWith x}; "images"];
				[{"video/" strStartsWith x}; "videos"];
				[{"audio/" strStartsWith x}; "audio"];
				[true; "default"].
			fileDelete: filesFolder + "/categories/" + category + "-kmp.json".
			
			`Make this file accessible under a specific name if wanted`
			$accessName ? SafeFilePath = $accessName urlGetParameter $url propOf _request.
			!ifNot (void eq accessName) {
				`Create the access file`
				$currentVersion = String: !getCurrentDate.
				fileCreateFolder: $accessFile = filesFolder + "/main/" + accessName + "/" + currentVersion.
				print: (!dateString) + "Upload destination is " + accessFile.
				
				(accessFile + "/../currentVersion.txt") fileWrite currentVersion.
				
				`Remove a potential generated file-listing of the parent folder, so it is updated on access`
				fileDelete: filesFolder + "/main/" + (fileParent: accessName) + "/listing.json".
				
				_postedFileName fileRenameFile print: filesFolder + "/main/" + accessName + "/" + currentVersion + "/raw".
				
				print: "Upload done".
				
				`Delete any deletion markers that might exist`
				fileDelete: filesFolder + "/main/" + accessName + "/.deleted.txt".
				
				!ifNot (void eq mime) {
					`Create a file which stores the mime type`
					(filesFolder + "/main/" + accessName + "/" + currentVersion + "/mime.txt") fileWrite mime
				}.
				
				`Attempt a quick thumbnail creation`
				runCommand: print: "ffmpeg -i '" + filesFolder + "/main/" + accessName + "/" + currentVersion + "/raw' -vf 'scale=300:-2' '" + filesFolder + "/main/" + accessName + "/" + currentVersion + "/thumbnail.jpg'".
				
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
					!if (fileIsFile: filesFolder + "/main/" + accessName + "/" + currentVersion + "/thumbnail.jpg"){
						["thumbnail";
							[
								["default";"/api/thumbnail?id=" + urlEncodeParameter: accessName]
							]
						]
					}.
				(filesFolder + "/main/" + accessName + "/" + currentVersion + "/kmp.json") fileWrite objToJson: kmpObject.
				
				_request httpEndServingRaw strRaw: '{"success": 1, "endpoint": ' + (objToJson: "/api/uploaded?id=" + urlEncodeParameter: accessName) + '}'.
				
				`Add the correct category`
				fileCreateFolder: filesFolder + "/main/" + accessName + "/" + currentVersion + "/categories".
				!fileWrite "" -> filesFolder + "/main/" + accessName + "/" + currentVersion + "/categories/" + category.
				
			}.
		}.
		
		`Check if there is enough space - we need to convert the post size estimate to megabytes, hence the division`
		!diskSpaceClean ((do: $getPostDataByteSizeEstimate propOf _request) % 1000000) {
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
