#!/usr/bin/env kalzit
`A http server that is specialized for the Kalzit web applications`

print "Starting the server ...".
print "Reading blacklist ...".
$blacklist = strNewline strSplit fileContent: "./nodejs/files/server/blacklist.txt".
print "Parsing internal library ...".

$blacklistAllows = $fname fun {not: 0 < sum: {x isMatch fname} each blacklist}.

$cachedUrlTitle = urlTitle cachedFun autoClearedCache: monthsToMillis: 2.

$ifFolderThenMaybeIndexFile = !fun ($path) {
	`Check for a folder, and if the requested file is a folder, search an index file`
	$file = path.
	print: !ifElse (fileIsFolder: file) {
		`If the file is a folder`
		$indexFile = {"index." strStartsWith fileName: x} firstConditionMatch folderContent: file.
		!ifElse (void eq indexFile){
			`No index file found`
			file
		};{
			`Return the index file`
			indexFile
		}
	};{file}.
}.

$onClientConnect = ($_request fun {
	$fname = ifFolderThenMaybeIndexFile: "." + first: "?" strSplit $url propOf _request.
	
	$result = void.
	$resultRef = reference: $result.
	$async = false.
	$asyncRef = reference: $async.
	
	`Check blacklist`
	!ifElse (not: void eq {x isMatch fname} firstConditionMatch blacklist){
		print: "The following file is on the blacklist and will produce a 404 error page: " + fname.
       	($startServing propOf _request): fileMime: "html".
		($respondCode propOf _request): 404.
		_request httpEndServingRaw fileContentRaw: "./nodejs/files/server/404.html"
	};{
		`Hey, the requested file is not on the blacklist!`
		
		$languageRunnerFile = "./nodejs/files/server/languages/" + (fileExtension: fname) + ".k".
		!if (fileIsFile: languageRunnerFile) {
			!if (fileIsFile: fname) {
				print: "Trying to run a custom language with " + languageRunnerFile.
				resultRef = "Custom language has not returned a result".
				do:() fun fileContent: languageRunnerFile
			}
		}.
		
		$serveFile = $fname fun {
			`Find a file by name`
			!ifElse (fileIsFile: fname) {
				print: "Serving file " + fname.
				!ifElse ("/static/" strContains fname) {
					_request httpWriteStaticFile fname
                };{
                	_request httpWriteGlobalFile fname
                }.
                do:($endServing propOf _request).
			};{
				`File not found`
				print: "Serving empty page for " + fname.
                ($startServing propOf _request): fileMime: "html".
				($respondCode propOf _request): 404.
				_request httpEndServingRaw fileContentRaw: "./nodejs/files/server/404.html"
			}
		}.
		
		!if (not async) {
			!if (result eq void) {
				serveFile: fname
			}.
		    else {
		    	_request httpEndServingRaw strRaw: result
		    }
	    }
	    
    }
	
}).

$methodHandlers =
	["GET"; onClientConnect];
	["POST"; $_request fun fileContent: "./nodejs/files/server/post.k"].

print "Start port listening ...".
!ifNot (fileExists: "./nogit/https/key.pem") {
	runCommand: "./cli https certificate " + strFirstLine: runCommand: "hostname".
}.
!if (fileExists "./nogit/https/key.pem") {
    methodHandlers methodBasedHttpsServer 5001
}.
methodHandlers methodBasedHttpServer 5000.
print "Server is running now!".
print "------".
