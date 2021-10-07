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
		{} loadLocalAsync "/api/deleteFile?session=" + session + "&id=" + urlEncodeParameter: $id urlGetParameter ($default propOf $file propOf file)
	}].
	
$folderActions =
	["Delete"; ($folder) fun {
		{} loadLocalAsync "/api/deleteFolder?session=" + session + "&folder=" + urlEncodeParameter: $title propOf folder
	}].
	
$fileActionButton = $file fun {
	file uiAdditionalActionsButton fileActions.
}.

!registerSubApp $preview popupSubApp: {
	$toolbar = ($title propOf openFile) uiTitleToolbar
		[@right @verticalCenter @dynamicWidth uiContainer:
			[fileActionButton: openFile];
			[uiHorizontalPxSpace: 7]
		].

	$url = ($default propOf $file propOf openFile) + "&session=" + session.


	toolbar;
	`The main file content view`
	@(percentWidth 100) @(height "100% - " + toolbarCmHeight + "cm")
		do: first: ($kind propOf openFile) switch
			[{"audio" eq x};{@(backgroundImageUrl: ($default propOf $thumbnail propOf openFile) + "&session=" + session) uiAudioPlayer: url}];
			[{"video" eq x};{uiVideoPlayer: url}];
			[{"image" eq x};{@fit uiShowImageUrl: url}];
			[true;{uiShowWebpageUrl: url}].
}.

$fileView = !fun ($file) {
	file uiKmpListItem
		[$onTap; () fun {
			openFileRef = file.
			openSubApp: "preview".
		}];
		[$additionalActions; [fileActions]].
}.
$folderView = !fun ($folder) {
	folder uiKmpListItem
		[$onTap; () fun {
			redirect: "/app/files?folder=" + urlEncodeParameter: $title propOf folder
		}];
		[$forcedThumbnail; "/apps/files/icons/iOS.png"];
		[$titleGenerator; {fileName: $title propOf folder}];
		[$additionalActions; [folderActions]].
}.
$makeUploadView = !fun ($_files) {
	$result = uiContainer: void.
	$print = uiPrint: result.

	$progress = 0. $progressRef = reference: $progress.
	$total = length: _files.
	$failures ? ModifiableList = ().
	$failCount = 0. $failCountRef = reference: $failCount.
	
	uploadMultipleFiles:
		[$files; [_files]];
		[$folderName; folderName];
		[$callback; ($status ; $_file) fun {
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
		}
	].
	
	print: uiShowFunction: {"Progress: " + progress + " of " + total + " files uploaded (" + failCount + " failed)"}.
	result.
}.

$foldersPresent = false. $foldersPresentRef = reference: $foldersPresent.
$filesPresent = false. $filesPresentRef = reference: $filesPresent.

$folderContent = void. $folderContentRef = reference: $folderContent.

($json fun {
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
		
}) loadLocalAsync "/api/folder?id=" + folderName + "&session=" + session.

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

toolAtRight: "Search..." popupTool searchWindowContent.

`Show the UI`
print: !uiGlobalToolbar.
!if (void eq session) {
	print: !uiLoginHint.
}.