`A simple image gallery for instagram, reddit and youtube`
uiTitle: "Images".

$scrollers ? (List:Any) = void.
$scrollersRef = reference: $scrollers.
$sources ? (List:String) = "".
$sourcesRef = reference: $sources.

applyTheme: colorCombinationTheme: greenColorCombination.
$standardImageView = ($_action ; $url) fun {
	@(onTap _action) (200;200) uiShowScaledAndRoundedImageUrl url
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
		$popup = void. $popupRef = reference: $popup.
		
		$readyRef = reference: $ready.
		
		$title = (default: "Untitled collection"): $title propOf kmpData.
		
		runLater: {
			popupRef = ((@(setLength: length: imageUrls) {
					(second: x at urlPairs) uiLink @center @fit uiShowImageUrl: x at imageUrls
				}) uiLazySlidesWithNavigation indexRef) uiPopup {!closeSubApp}.
				
			("collection_" + urlEncodeParameter: url) registerSubApp {
					print popup
				};{uiHide popup}.
			
			readyRef = true.
		}.
		
		$showIndex = $index fun {
			!if (ready) {
				indexRef = index.
				openSubApp: "collection_" + urlEncodeParameter: url.
			}. !else {
				popupMessage: "Not ready yet"	
			}
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
	"kalzit.images.sources" storageSaveString ";" strJoin sourcesRef=sources;currentInput.
	scrollersRef = scrollers;scrollerForTerm:currentInput
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

$edit registerSubApp showEditPanel;{uiHide: editPanel}.

`Tool bar testing`
print: uiToolbar:
	[@verticalCenter @left ({openSubApp: $edit} uiButton "Edit")];[
		@verticalCenter @right @(percentHeight 50) @(percentWidth 10) uiContainer:
			[@(percentWidth 40) !uiUserButton];
			[uiHorizontalPercentSpace 10];
			[@(percentWidth 40) !uiAppsButton];
			[uiHorizontalPercentSpace 10]
	].

print: uiShowVariableAsList: scrollersRef.
void
