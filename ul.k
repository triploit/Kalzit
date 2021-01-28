#{
	The callback is called for each file with one of the following codes:
		0 if the upload failed because the file size was too big.
		1 if the upload succeeded.
		2 if the upload failed because of an unknown reason.
}
$uploadMultipleFiles = !fun ($_files ; $callback) {
	{x uploadSingleFile callback} each _files.
}.

#{
	The callback is called with the following codes:
		0 if the upload failed because the file size was too big.
		1 if the upload succeeded.
		2 if the upload failed because of an unknown reason.
}
$uploadSingleFile = $attemptSingleFileUpload = !fun ($_file ; $callback) {
	($_status fun {
		$success = $success propOf parseJson: !if (200 eq $code propOf _status) {
			$text propOf _status
		}.
		
		!if (success) {
			1 callback _file
		}. !else {
			!if (void eq success) {
				2 callback _file
			}. !else {
				0 callback _file	
			}
		}
	}) ($uploadAsync of _file) $name propOf _file
}.

$makeUploadView = !fun ($_files) {
	$progress = 0. $progressRef = reference: $progress.
	$total = length: _files.
	$failures ? ModifiableList = ().
	$failCount = 0. $failCountRef = reference: $failCount.
	
	_files uploadMultipleFiles ($status ; $_file) fun {
		progressRef = progress + 1.
		!if (status eq 2) {
			print: "Upload of " + ($name propOf _file) + " failed for unknown reasons".
			($push propOf failures): [_file].
			failCountRef = failCount + 1.
		}.
		!if (progress eq total) {
			print: "Upload is done (" + failCount + " failed)".
			!if (failCount > 0) {
				$button = {
					print: makeUploadView: getArray: failures.
					uiHide: button.
					do: ($clear propOf failures).
				} uiButton "Retry failed attempts".
				print button.
			}
		}
	}.
	
	uiShowFunction: {"Progress: " + progress + " of " + total + " files uploaded (" + failCount + " failed)"}.
}.

$picker = uiMultiFilePicker: $_files fun {
	print: makeUploadView: _files.
}.

!if (void eq storageLoadString: "calcitSession") {
	print: "You are not logged in. Please do that."
}. !else {
	print: picker.
}