$requestedDownload = $url urlGetParameter $url propOf _request.
$resultingFileName = "./generated/vdl_" + (("%";"_prct_") strReplace urlEncodeParameter: requestedDownload) + ".mp4".

asyncRef = true.
($startServing propOf _request): fileMime: resultingFileName.
($writeFile propOf _request): resultingFileName.
do:($endServing propOf _request).