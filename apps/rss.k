`Rss feed reader (not atom and others) with images`

redColorCombination.
applyTheme: colorCombinationTheme: yellowColorCombination.

#{List of RSS feed urls}
$feedUrls ? (List:Any) = ";" strSplit storageLoadString: $feedUrls. $feedUrlsRef = reference: $feedUrls.
$entriesView ? (List:Any) = void. $entriesViewRef = reference: $entriesView.

#{A view that contains all registered RSS feeds}
$feedsView ? UiContainer. $feedsViewRef = reference: $feedsView.

#{Creates a new feeds view based on $feedUrls}
$updateFeedsView = () fun {
	$feedPicker = {
		$rssUrl = $rssUrl objFirstProperty calcitAnnotations: x.
		$rssDom = loadDom: rssUrl.
		$rssEntries = ($entry domTags rssDom);($item domTags rssDom).
		entriesViewRef = ($entryDom fun {
			($linkRef = reference: $link) = $href domAttribute $linkTag = first: $link domTags entryDom.
			!if ((link eq void) | link eq "") {
				linkRef = String: (default: "???"): domInnerText: linkTag.
			}.
			$imageUrl = first: '"[^"]+\.(jpg|png|jpeg|gif)"' match domInnerText: entryDom.
			$mediaUrl = (default: imageUrl): $url domAttribute first: $enclosure domTags entryDom.
			$mediaKind = first: "/" strSplit $type domAttribute first: $enclosure domTags entryDom.
			$image = !ifNot (imageUrl eq void) {
				@(onTap: () fun {
					$viewMaker = first: (mediaKind switchEq
						["audio";{@(backgroundImageUrl: {"} strRemove imageUrl) uiAudioPlayer: x}];
						["video";uiVideoPlayer]);
						uiShowImageUrl.
					print: uiPopup: @fit viewMaker: {"} strRemove mediaUrl.
				}) @(percentWidth: 10) uiShowImageUrl: {"} strRemove imageUrl.
			}.
			uiContainer: image;@centerText @(percentWidth: 90) uiContainer: link uiLink uiText: String: (default:"???"): domInnerText: first: $title domTags entryDom
		}) each rssEntries.
	} uiSingleViewPicker {
		`Get feed title for display without network access`
		$rssUrl = x.
		($titleRef = reference: $title) = storageLoadString: $titleKey = $rss_ + (urlEncodeParameter: rssUrl) + "_title".
		!if (title eq void) {
			titleRef = domInnerText: first: $title loadDomTags rssUrl.
			!ifNot (title eq void) {
				titleKey storageSaveString title.
			}
		}.
		@("rssUrl";x) uiContainer: String: (default:x): title
	} each feedUrls.
	
	feedsViewRef = @(fontFamily: "Arial, Helvetica") @left @(backgroundColor: white) @(percentWidth: 50) uiContainer: feedPicker.
}.

#{Update feeds automatically}.
do:updateFeedsView.
feedUrlsRef listenVariable {
	$feedUrls storageSaveString ";" strJoin feedUrls.
	do:updateFeedsView
}.

print: uiToolbar: [@(percentWidth 75) @center uiContainer:
		[@(percentWidth: 90) $userInput uiTextfieldVariableOnchange ""];
		[@(percentWidth: 10) {feedUrlsRef = feedUrls ; Url:userInput} uiButton "Add"]
	];[
		@verticalCenter @right @(percentHeight 50) @(percentWidth 10) uiContainer:
			[@(percentWidth 40) uiUserButton:{redirect:appUrl}];
			[uiHorizontalPercentSpace 10];
			[@(percentWidth 40) uiAppsButton:{launchApp: "/apps/rss.k"}];
			[uiHorizontalPercentSpace 10]
	].
print: uiContainer: (uiShowVariable: feedsViewRef);@(fontFamily: "Arial, Helvetica") @right @(percentWidth: 50) uiShowVariableAsList: entriesViewRef.

void.
