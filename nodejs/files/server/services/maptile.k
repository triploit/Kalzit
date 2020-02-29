$u = $url of _request.

$xc = $x urlGetParameter u.
$yc = $y urlGetParameter u.
$zc = $z urlGetParameter u.

print: "Loading tile " + xc + "_" + yc + "_" + zc.

$cacheLocation = "./nogit/cache/maptiles/"+ "_" + xc + "_" + yc + "_" + zc + ".jpg".
($startServing of _request): fileMime: cacheLocation.
asyncRef = true.

!ifElse (fileExists: cacheLocation) {
	_request httpEndServingRaw fileContentRaw: cacheLocation.
};{
	$tile = loadGlobalRaw: "https://a.tile.openstreetmap.org/" + zc + "/" + xc + "/" + yc + ".png".
	cacheLocation fileWrite tile.
	_request httpEndServingRaw tile.
}.