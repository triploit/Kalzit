asyncRef = true.
$url = "url" urlGetParameter $url of _request.
!if(url eq void){
	($endServing of _request): "".
	($respondCode of _request): 404.
}.
!else {
	{
		($startServing of _request): "text/xml".
		($endServing of _request): (default: ""): x
	} youtubeUrlRssContentStringAsync "url" urlGetParameter $url of _request.
}