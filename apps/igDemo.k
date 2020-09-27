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
	$ui = uiContainer: ().
	$forUi = uiPrint: ui.

	$withKmpData = !fun ($kmpData) {
		
		!ifElse (void eq $collection propOf kmpData) {
			`Display a simple error message`
			forUi: uiText: "No images were found at " + url.
		};{
			$urlPairs = {
				(
					(default: $default propOf kmpGetThumbnailObject: x)
						$default propOf kmpGetFileObject: x
				);
				($link propOf x);
				($default propOf kmpGetThumbnailObject: x)
			} all {x;["source";url];["keptArguments";[$keptArguments propOf kmpData]] `Copy the source and keptArguments fields`} each $collection propOf kmpData.
				
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
			
			forUi: uiContainer: (@(fontFamily "Arial, Helvetica") uiContainer: title);uiHorizontalScroller: 15 uiAddHorizontalPxSpaces {
					(() fun {showIndex x}) standardImageView third: x at urlPairs
				} each arrayIndexes: urlPairs

		}.
	}.
	{withKmpData: 
		(parseJson: x);
		["source";url]
	} loadLocalAsync !ifElse ("/api/userImagesKmp?" strStartsWith url) {
		url.
	};{
		"/api/s/urlkmp?url=" + urlEncodeParameter: url.
	}.
	
	ui

}.

$update = () fun {
	scrollersRef = scrollerForTerm each sources
}.

$useInput = !fun ($currentInput) {
	!ifNot (currentInput listContains sources) {
		"kalzit.images.sources" storageSaveString ";" strJoin sourcesRef=sources;currentInput.
		scrollersRef = scrollers;scrollerForTerm:currentInput
	}
}.

$uploadedFilesUrl = "/api/userImagesKmp?session=" + storageLoadString: "calcitSession".
$uploadsPresent = not: void eq $collection propOf parseJson: loadLocal: uploadedFilesUrl.
sourcesRef = 
	(!if uploadsPresent {uploadedFilesUrl});
	{not: "" eq x} filter ";" strSplit storageLoadString: "kalzit.images.sources".
do:update.

`Potentially add a source from the parameter`
$added = appParameter: $add.
!ifNot (added eq void) {
	useInput: added
}.

`Tool bar`
toolAtLeft: 
	("Edit";
	{
		useInput: y
	};{
		"kalzit.images.sources" storageSaveString ";" strJoin resolveReference: x.
		runLater update
	}) listEditTool sourcesRef.
	
print: !uiGlobalToolbar.

print: uiShowVariableAsList: scrollersRef.
void
