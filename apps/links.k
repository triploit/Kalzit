`Bug / Improvement: Warn when uiShowFunction causes infinite recursion`
applyTheme: $theme = colorCombinationTheme: $colorCombo = redColorCombination.
onDarkThemePreferenceChange: {
	applyTheme: theme.
}.

$siteId = !fun ($url) {
	second: serviceCallApi: "siteId?url=" + urlEncodeParameter: url.
} ? Int.

siteId: "/".
$siteUrl = !fun ($id ? Int) {
	second: serviceCallApi: "siteUrl?id=" + id.
} ? Url.

$sitesRef = reference: $sites.
$loadSites = () fun {
	sitesRef =
		( (List:String) (default: ["Sample link"]): ";" strSplit storageLoadString: "kalzit.app.links.names")
			mingle
		( (List:Int) (default: [siteId: appUrl]): ";" strSplit storageLoadString: "kalzit.app.links.ids").
}.
do:loadSites.

$linkViewsRef = reference: $linkViews.

$updateLinkViews = () fun {
	linkViewsRef = uiColumns: {
		(urlDecodeParameter: first: x) uiSimpleHomeScreenApp () fun {redirect: siteUrl: second: x}
	} each sites.
	
	$namesAndIds = unmingle: sites.
	"kalzit.app.links.names" storageSaveString ";" strJoin first: namesAndIds.
	"kalzit.app.links.ids" storageSaveString ";" strJoin second: namesAndIds.
}.
do:updateLinkViews.

$useInput = ($newLink) fun {
	$name = popupQuestion: "Please set a name for " + newLink.
	!if (not name eq void){
		!if ("" eq name) {
			sitesRef = sites;[(urlEncodeParameter: urlTitle: newLink);siteId: newLink].
		}. !else {
			sitesRef = sites;[(urlEncodeParameter: name);siteId: newLink].
		}.
		do:updateLinkViews.
	}
}.

$newLinkRef = reference: $newLink.

$edit registerSubApp popupSubApp: {
	"Edit";
	{
		`Addition`
		useInput: y.
	};{
		`Removal`
		do:updateLinkViews.
	} listEditTool sitesRef
}.

$showEditPanel = {openSubApp $edit}.

toolAtLeft:
	("Edit link list ...";
	{
		`Addition`
		useInput: y.
	};{
		`Removal`
		do:updateLinkViews.
	}) listEditTool sitesRef.

`Tool bar testing`
print: !uiGlobalToolbar.
print: uiShowVariable: linkViewsRef.