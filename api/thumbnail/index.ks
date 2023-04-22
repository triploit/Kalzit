$id = SafeFilePath: "id" urlGetParameter $url propOf _request.

!if ~sessionExistsRef {
	
	!if (fileIsFile: $versionFile = ($uploadName = ~userFolderRef + "/files/v2/main/" + id) + "/currentVersion.txt") {
		asyncRef = true.
        !fileContentAsync versionFile -> $content fun {
            `Decide what to send`
		    !ifElse (fileIsFile: $thumbnailFile = uploadName + "/" + (strFirstLine: content) + "/thumbnail.jpg") {
                $setHeader = $setHeader propOf _request.
                
			    "Cache-Control" setHeader "public, max-age=604800".
				($startServing propOf _request): nativeFileMime: "jpg".
				($writeExistingFile propOf _request): print: thumbnailFile.
		    };{
			    ($respondCode propOf _request): 404.
		    }.
		    
		    do:($endServing propOf _request).
        }
	}
}
