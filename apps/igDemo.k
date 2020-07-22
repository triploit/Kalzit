`A simple image gallery for instagram, reddit and youtube`
uiTitle: "Images".

$scrollers ? (List:Any) = void.
$scrollersRef = reference: $scrollers.
$sources ? (List:String) = "".
$sourcesRef = reference: $sources.

applyTheme: colorCombinationTheme: greenColorCombination.
$standardImageView = ($_action ; $url) fun {
	@(backgroundColor black) @fit
	@(onTap _action) (200;200)
		uiShowScaledAndRoundedImageUrl url
}.

$scrollerForTerm = ($url ? String) fun {
	$kmpData = parseJson: loadLocal: "/api/s/urlkmp?url=" + urlEncodeParameter: url.
	
	!ifElse (void eq $collection propOf kmpData) {
		`Display a simple error message`
		uiText: "No images were found at " + url.
	};{
		
		$urlPairs = {
			(
				(default: $default propOf $thumbnail propOf x)
					$default propOf $file propOf x
			);
			($link propOf x);
			($default propOf $thumbnail propOf x)
		} all $collection propOf kmpData.
			
		$imageUrls = first each urlPairs.
			
		$index = 0. $indexRef = reference: $index.
		
		$title = (default: "Untitled collection"): $title propOf kmpData.
		
		$slides = (@(setLength: length: imageUrls) {
				(second: x at urlPairs) uiLink @center @fit uiShowImageUrl: x at imageUrls
			}) uiLazySlidesWithNavigation indexRef.
			
		("collection_" + urlEncodeParameter: url) registerSubApp popupSubApp: {
			slides
		}.
		
		$showIndex = $index fun {
			indexRef = index.
			openSubApp: "collection_" + urlEncodeParameter: url.
		}.
		
		uiContainer: (@(fontFamily "Arial, Helvetica") uiContainer: title);uiHorizontalScroller: 15 uiAddHorizontalPxSpaces {
				(() fun {showIndex x}) standardImageView third: x at urlPairs
			} each arrayIndexes: urlPairs
			
	}

}.

$update = () fun {
	scrollersRef = scrollerForTerm: sources
}.

$useInput = !fun ($currentInput) {
	!ifNot (currentInput listContains sources) {
		"kalzit.images.sources" storageSaveString ";" strJoin sourcesRef=sources;currentInput.
		scrollersRef = scrollers;scrollerForTerm:currentInput
	}
}.

$editPanelRef = reference: $editPanel.
$showEditPanel = () fun {
	print: editPanelRef = sourcesRef uiStringListEditPopup {
		useInput: y
	};{
		"kalzit.images.sources" storageSaveString ";" strJoin resolveReference: x.
		runLater update
	}.
}.

sourcesRef = {not: "" eq x} filter ";" strSplit storageLoadString: "kalzit.images.sources".
do:update.

`Potentially add a source from the parameter`
$added = appParameter: $add.
!ifNot (added eq void) {
	useInput: added
}.

$edit registerSubApp showEditPanel;{uiHide: editPanel}.

`Tool bar`
toolAtLeft: "Edit" buttonTool {openSubApp: "edit"}.
print: !uiGlobalToolbar.

print: uiShowVariableAsList: scrollersRef.
void
