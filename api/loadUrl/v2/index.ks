print: "Trying to access external resource " + $url = "query" urlGetParameter $url of _request.
asyncRef = true.

$mime = $mime urlGetParameter $url propOf _request.
$neverExpire = $neverExpire urlGetParameter $url propOf _request.

!ifNot (void eq neverExpire) {
	`Send a hint to never expire`
	"Cache-Control" ($setHeader propOf _request) "public, max-age=31536000, immutable".
}.

!ifElse (void eq mime) {
	`Serve JSON representation`
	($startServing propOf _request): "text/plain".
	_request httpEndServingRaw strRaw: objToJson: (default: ["error";"You need to specify the API parameter 'query'"];["ok";false]): loadGlobalWithStatus: url.
};{
	`Serve raw data`
	($startServing propOf _request): mime.
	_request httpEndServingRaw loadGlobalRaw: url
}