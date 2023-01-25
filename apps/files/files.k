uiTitle: "Files".

$folderName ? (default: "") = (appParameter: $folder) + "/".
$session = storageLoadString: "calcitSession".

$foldersView = uiContainer: ().
$filesView = uiContainer: ().

$openFile = void.
$openFileRef = reference: $openFile.

$fileActions =
	["Download"; ($file) fun {
		(($default propOf $file propOf file) + "&session=" + session) downloadUrl $title propOf file
	}];
	["Delete"; ($file) fun {
		!loadLocalAsync "/api/deleteFile?session=" + session + "&id=" + urlEncodeParameter: $id urlGetParameter ($default propOf $file propOf file) -> {
			uiHide: $view propOf file
		}
	}];
	["Show as QR code"; ($file) fun {
		`Create a QR code for this file and show it in a popup`
		showQrCode: (urlGetOrigin: appUrl) + "/app/fv?f=" + (urlEncodeParameter: $id urlGetParameter $default propOf $file propOf file).
	}].
	
$folderActions =
	["Delete"; ($folder) fun {
		!loadLocalAsync "/api/deleteFolder?session=" + session + "&folder=" + urlEncodeParameter: $title propOf folder -> {
			uiHide: $view propOf folder
		}
	}];
	["Show as QR code"; ($file) fun {
		`Create a QR code for this file and show it in a popup`
		$qrCodeContent = (urlGetOrigin: appUrl) + "/app/files?folder=" + urlEncodeParameter: $title propOf file.
		print: (uiShowImageUrl: "/api/qrcode/?text=" + urlEncodeParameter: qrCodeContent) uiSmallPopup {}
	}]..
	
$fileActionButton = $file fun {
	file uiAdditionalActionsButton fileActions.
}.

!registerSubApp $preview popupSubApp: {
	$toolbar = ($title propOf openFile) uiTitleToolbarWithAdditionalActionsButton fileActionButton: openFile.
	

	$url = ($default propOf $file propOf openFile) + "&session=" + session.


	toolbar;
	`The main file content view`
	@(percentWidth 100) @belowToolbar
		do: first: ($kind propOf openFile) switch
			[{"audio" eq x};{@(backgroundImageUrl: ($default propOf $thumbnail propOf openFile) + "&session=" + session) uiAudioPlayer: url}];
			[{"video" eq x};{uiVideoPlayer: url}];
			[{"image" eq x};{@fit uiShowImageUrl: url}];
			[true;{uiShowWebpageUrl: url}].
}.

$fileView = !fun ($file) {
	$view = uiContainer: void.

	(uiPrint: view): (file;["view";view]) uiKmpListItem
		[$onTap; () fun {
			openFileRef = file.
			openSubApp: "preview".
		}];
		[$additionalActions; [fileActions]].
	
	`Return` view
}.
$folderView = !fun ($folder) {
	$view = uiContainer: void.

	`We need to have the complicated first line in order to enable view removals (to reflect deletions)`
	(uiPrint: view): (folder;["view";view]) uiKmpListItem
		[$onTap; () fun {
			redirect: "/app/files?folder=" + urlEncodeParameter: $title propOf folder
		}];
		[$forcedThumbnail; "/apps/files/files.png"];
		[$titleGenerator; {fileName: $title propOf folder}];
		[$additionalActions; [folderActions]].
	
	`Return` view
}.
$makeUploadView = !fun ($_files) {
	$result = uiContainer: void.
	$print = uiPrint: result.
	
	!loopEach _files -> {
		$file = x.
		
		$status = uiContainer: "Uploading...".
		$statusRef = reference: $status.
		
		$triggerUpload = !fun () {
			statusRef = uiContainer: "Uploading...".
			uploadSingleFile:
				[$file; [file]];
				[$folderName; folderName];
				[$callback; ($status ; $_file) fun {
					!if (status eq 2) {
						statusRef = !uiButton "Retry" -> triggerUpload
					}. !else {
						statusRef = uiContainer: "Done!".
					}
				}
			].
		}.
		
		!ifElse (($name propOf file) listContains {$title propOf x} each $collection propOf folderContent) {
			`The file exists already`
			statusRef = !uiButton "Replace existing" -> triggerUpload
		};{
			`This is a new file`
			!triggerUpload.
		}.
		
		print: uiContainer:
			[@(percentWidth 70) uiContainer: $name propOf file];
			[@(percentWidth 30) uiShowVariable: statusRef].
	}.
	
	result
}.

$foldersPresent = false. $foldersPresentRef = reference: $foldersPresent.
$filesPresent = false. $filesPresentRef = reference: $filesPresent.

$folderContent = void. $folderContentRef = reference: $folderContent.

`Load the user file infos from the server`
!loadLocalAsync ("/api/folder?id=" + folderName + "&session=" + session) -> ($json fun {
	folderContentRef = parseJson: json.
	
	($file fun {
		!if ("folder" eq $kind propOf file) {
			(uiPrint: foldersView): folderView: file.
			foldersPresentRef = true.
		}. !else {
			(uiPrint: filesView): fileView: file.
			filesPresentRef = true.
		}
	}) each $collection propOf folderContent.
	
	
	$foldersArrow = !uiArrowIcon.
	
	@(onTap: () fun {uiToggleExpansion: foldersView})
	print: uiContainer:
		[foldersArrow];
		[uiHorizontalPxSpace: 4];
		[@(width: "100% - 24px") uiContainer: "Folders"].
	print:
		@(onCollapse () fun {@(rotation 270) foldersArrow})
		@(onExpand () fun {@(rotation 0) foldersArrow})
		foldersView.
	
	
	$filesArrow = !uiArrowIcon.
	
	@(onTap: () fun {uiToggleExpansion: filesView})
	print: uiContainer:
		[filesArrow];
		[uiHorizontalPxSpace: 4];
		[@(width: "100% - 24px") uiContainer: "Files"].
	print:
		@(onCollapse () fun {@(rotation 270) filesArrow})
		@(onExpand () fun {@(rotation 0) filesArrow})
		filesView.
		
}).

`Prepare the search functionality`
$searchWindowContent = uiSearchPanel: $currentSearchTerm fun {
	$searchContainer = @(percentHeight 100) uiContainer: void.
	$print = uiPrint: searchContainer.
	
	$workWithFolder = $folder fun {
		($content fun {
			$json = $collection propOf parseJson: content.
			`Print matching files`
			($file fun {
				!if ((strToLowerCase currentSearchTerm) strContains strToLowerCase: $title propOf file) {
					`It is a match - make the correct view and show it`
					!ifElse ($folder eq $kind propOf file) {
						print: folderView: file
					};{
						print: fileView: file
					}
				}
			}) each json.
			
			`Go deeper into the found folders`
			workWithFolder each {$title propOf x} each {"folder" eq $kind propOf x} filter json.
		}) loadLocalAsync "/api/folder?id=" + (urlEncodeParameter: folder) + "&session=" + session.
	}.
	workWithFolder: folderName.
	
	searchContainer.
}.

`Populate the toolbar with controls`
toolsAtLeft: 
	["Upload..." popupTool do:{
		$print = uiPrint: $uploadView = uiContainer: ().
		print: @(cmHeight 0,3) uiContainer: void.
	
		$picker = uiMultiFilePicker: $_files fun {
			print: makeUploadView: _files.
		}.
		
		!if (void eq storageLoadString: "calcitSession") {
			print: !uiLoginHint
		}. !else {
			print: picker.
		}.
		
		[uiTitleToolbar: "Upload..."];
		@(height: "100% - " + toolbarCmHeight + "cm") @verticalScroller uploadView
	}];
	[!buttonTool "Create folder..." -> {
		$newFolder = popupQuestion: "Please enter a name for the new folder:".
		!ifNot (newFolder eq void) {
			relaunchApp loadLocalAsync "/api/createFolder?folder=" + folderName + "/" + (urlEncodeParameter: newFolder) + "&session=" + session
		}
	}].

toolsAtRight:
	[!popupTool "Search..." searchWindowContent];
	[void additionalActionsTool
		feedbackActions: "oplpublishergerman@gmail.com"
	].


`Show the UI`
print: !uiGlobalToolbar.
!if (void eq session) {
	print: !uiLoginHint.
}.