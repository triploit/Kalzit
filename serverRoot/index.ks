asyncRef = true.
($startServing propOf _request): "text/html".
($writeExistingFile propOf _request): serverRootPath + "/apps/home/index.html".
