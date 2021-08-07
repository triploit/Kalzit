#!/usr/bin/env kalzit
`A http server that is specialized for the Kalzit web applications`

print "Starting the server ...".
print "Reading blacklist ...".
$blacklist = strNewline strSplit fileContent: "./nodejs/files/server/blacklist.txt".
print "Parsing internal library ...".

`TODO: Test if the variant with "firstConditionMatch" works`
$blacklistAllows = $fname fun {void eq {x isMatch fname} firstConditionMatch blacklist}.

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

$sessionRemove = !fun ($sessionFolder) {
	$sessionId = fileName: sessionFolder.
	!if (fileIsFile: sessionFolder + "/expiration.txt") {
		runCommandFromArray: "rm";"-rf";sessionFolder.
		fileDelete: "./nogit/users/sessions/" + sessionId + ".txt".
	}
}.
$sessionValidate = !fun ($sessionFolder ; $_request) {
	print: "Validating session " + sessionFolder.

	$securityLevelMatches = (fileContent: sessionFolder + "/securityLevel.txt") eq "standard".
	$userAgentMatches = (fileContent: sessionFolder + "/userAgent.txt") eq ($getHeader objFirstProperty _request): "user-agent".
	$languageMatches = (fileContent: sessionFolder + "/language.txt") eq ($getHeader objFirstProperty _request): "accept-language".
	
	!ifNot (securityLevelMatches & userAgentMatches & languageMatches) {
		`We should remove the session`
		print: "Session is invalid! Should be deleted: " + sessionFolder.
		sessionRemove: sessionFolder
	}
}.
$sessionUpgrade = !fun ($sessionFolder ; $_request) {
	print: "We will upgrade session " + sessionFolder.
	
	$wantedSecurityLevel = "standard".
	$wantedUserAgent = print: ($getHeader objFirstProperty _request): "user-agent".
	$wantedLanguage = print: ($getHeader objFirstProperty _request): "accept-language".
	
	!fileWrite wantedSecurityLevel -> (sessionFolder + "/securityLevel.txt").
	!fileWrite wantedUserAgent -> (sessionFolder + "/userAgent.txt").
	!fileWrite wantedLanguage -> (sessionFolder + "/language.txt").
}.

$sessionValidateAndUpgrade = !fun ($userSession ; $_request) {
	$userId = strFirstLine: fileContent: "./nogit/users/sessions/" + userSession + ".txt".
	$sessionFolder = "./nogit/users/data/v3/" + userId + "/sessions/" + userSession.
	
	!if (fileIsFile: print: sessionFolder + "/expiration.txt") {
		!ifElse (fileIsFile: sessionFolder + "/securityLevel.txt") {
			!sessionValidate sessionFolder _request
		};{
			!sessionUpgrade sessionFolder _request
		}
	}
}.

$onClientConnect = ($_request fun {
	`First thing we do is a quick session validation, as that is very important for security`
	`After that comes the normal server stuff`
	$userSession ? Float = ($getHeader objFirstProperty _request): "kalzit-session".
	!ifNot (userSession eq void) {
		!sessionValidateAndUpgrade userSession _request.
	}.

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

print "Checking HTTPS configuration ...".
!ifNot (fileExists: "./nogit/https/key.pem") {
	runCommand: "./cli https certificate " + strFirstLine: runCommand: "hostname".
}.

print "Start port listening ...".
!if (fileExists "./nogit/https/key.pem") {
    !httpsServer onClientConnect 5001.
}.

!httpServer onClientConnect 5000.
print "Server is running now!".
print "------".

`Try to always have at least 500MB of disk space`
(hoursToMillis: 0,5) repeatAsync {print: "Checking disk space...". diskSpaceClean: 500}.
