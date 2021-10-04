#!/usr/bin/env kalzit
`A http server that is specialized for the Kalzit web applications`

print "Starting the server ...".
print "Parsing internal library ...".

`Store md5 password + salt hashes in memory - used for encryption.`
$mdFivePasswordHashes = ModifiableObject: ().

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
		fileDelete: "./nogit/users/sessions/" + sessionId.
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
	$userFolder = "./nogit/users/sessions/" + userSession.
	$sessionFolder = userFolder + "/sessions/" + userSession.
	
	!if (fileIsFile: print: sessionFolder + "/expiration.txt") {
		!ifElse (fileIsFile: sessionFolder + "/securityLevel.txt") {
			!sessionValidate sessionFolder _request
		};{
			!sessionUpgrade sessionFolder _request
		}
	}
}.

$serveNotFound = !fun ($_request ; $fname) {
	`File not found`
	print: "Serving empty page for: " + fname.
    ($startServing propOf _request): "text/html".
	($respondCode propOf _request): 404.
	($writeFile propOf _request): "./nodejs/files/server/404.html"
}.

`Really fast way to figure out if a file needs to be treated as static or not`
`Can be used instead of httpWriteGlobalFile or httpWriteStaticFile; if a file path contains /static/, the file is assumed to be static`
$serveExistingFile = !fun ($_request ; $fname) {
	print: "Serving file " + fname.
	
	`This is implemented in a really unusual way to be as speedy as possible, but it is essentially the same as an ifElse condition`
	_request (("/static/" strContains fname) at httpWriteGlobalFile ; httpWriteStaticFile) fname.
	
	do: ($endServing propOf _request).
}.
$serveFile = !fun ($_request ; $fname) {
	`Figure out what to do with the file - if it does not exist, serve a "not found" message. If it does, call serveExistingFile`
	
	`This is implemented in a really unusual way to be as speedy as possible, but it is essentially the same as an ifElse condition`
	_request ((fileIsFile: fname) at serveNotFound ; serveExistingFile) fname
}.

$serverRootPath = "./serverRoot".
$onClientConnect = ($_request fun {
	`First thing we do is a quick session validation, as that is very important for security`
	`After that comes the normal server stuff`
	$userSession ? Float = ($getHeader objFirstProperty _request): "kalzit-session".
	!ifNot (userSession eq void) {
		!sessionValidateAndUpgrade userSession _request.
	}.

	$fname = ifFolderThenMaybeIndexFile: serverRootPath + first: "?" strSplit $url propOf _request.
	
	$result = void.
	$resultRef = reference: $result.
	$async = false.
	$asyncRef = reference: $async.

	`Figure out what to do with the requested file`
	
	$languageRunnerFile = "./nodejs/files/server/languages/" + (fileExtension: fname) + ".k".
	!if (fileIsFile: languageRunnerFile) {
		!if (fileIsFile: fname) {
			print: "Trying to run a custom language with " + languageRunnerFile.
			resultRef = "Custom language has not returned a result".
			do:() fun fileContent: languageRunnerFile
		}
	}.
	
	!if (not async) {
		!ifElse (result eq void) {
			_request serveFile fname
		};{
	    	($endServing propOf _request): result
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
