`A http server that is specialized for the Kalzit web applications`

$serverUsersFolder ? (default: (!getUnixUserFolder) + "/.kalzit/userdata") = appParameter: "users-folder".

$dateString = !fun () {
	"[" + (!getCurrentDateUtc) + "] ".
}.
print (!dateString) + "Starting the server ... ".
print (!dateString) + "Parsing internal library ...".

$ifFolderThenMaybeIndexFile = !fun ($path) {
	`Check for a folder, and if the requested file is a folder, search an index file`
    $ksFile = path + "/index.ks".
    $htmlFile = path + "/index.html".
    
    !switchFirst void
        [{fileIsFile: path}; path];
        [{fileIsFile: ksFile}; ksFile];
        [{fileIsFile: htmlFile}; htmlFile];
        [true; path].
}.

$sessionRemove = !fun ($sessionFolder) {
	$sessionId = fileName: sessionFolder.
	!if (fileIsFile: sessionFolder + "/expiration.txt") {
		runCommandFromArray: "rm";"-rf";sessionFolder.
		fileDelete: serverUsersFolder + "/sessions/" + sessionId.
	}
}.
$sessionValidate = !fun ($userSession ; $_request) {
    print: "Validating session...".
    
	$sessionFolder = serverUsersFolder + "/sessions/" + userSession + "/sessions/" + userSession.
	
	!if (fileIsFile: sessionFolder + "/expiration.txt") {
        $header = ($getHeader objFirstProperty _request).
    
        $sessionInvalid = !switchFirst void
            [{not: (fileContent: sessionFolder + "/securityLevel.txt") eq "standard"}; true];
            [{not: (fileContent: sessionFolder + "/userAgent.txt") eq header: "user-agent"}; true];
            [{not: (fileContent: sessionFolder + "/language.txt") eq header: "accept-language"}; true];
            [true; false].
	    
	    !if sessionInvalid {
		    `We should remove the session`
		    print: (!dateString) + "Session is invalid! Should be deleted: " + sessionFolder.
		    sessionRemove: sessionFolder
	    }
	}
    
}.

$serveNotFound = !fun ($_request ; $fname) {
	`File not found`
	print: (!dateString) + "Serving empty page for: " + fname.
    ($startServing propOf _request): "text/html".
	($respondCode propOf _request): 404.
	($writeExistingFile propOf _request): "./nodejs/files/server/404.html"
}.

`Really fast way to figure out if a file needs to be treated as static or not`
`Can be used instead of httpWriteGlobalFile or httpWriteStaticFile; if a file path contains /static/, the file is assumed to be static`
$serveExistingFile = !fun ($_request ; $fname) {
	print: (!dateString) + fname.
	
	`This is implemented in a really unusual way to be as speedy as possible, but it is essentially the same as an ifElse condition`
	_request (("/static/" strContains fname) at httpWriteGlobalFile ; httpWriteStaticFile) fname.
	
	do: ($endServing propOf _request).
}.

$serverRootPath = (default: "./serverRoot"): appParameter: "server-root".
$onClientConnect = ($_request fun {
	`First thing we do is a quick session validation, as that is very important for security`
	`After that comes the normal server stuff`
	$session ? Float = (default: $session urlGetParameter $url propOf _request): ($getHeader objFirstProperty _request): "kalzit-session".

    $sessionExists = false. $sessionExistsRef = reference: $sessionExists.
    $userFolder = void. $userFolderRef = reference: $userFolder.
    !ifNot (session eq void) {
		!sessionValidate session _request.
        sessionExistsRef = fileIsFolder: userFolderRef = serverUsersFolder + "/sessions/" + session.
	}.

	$fname = ifFolderThenMaybeIndexFile: serverRootPath + first: "?" strSplit $url propOf _request.
	
	$result = void.
	$resultRef = reference: $result.
	$async = false.
	$asyncRef = reference: $async.

	`Figure out what to do with the requested file`
	!ifElse (fileIsFile: fname) {
        !if (".ks" strEndsWith fname) {
            `Run a server-side script`
            print: (!dateString) + "Running '" + fname + "'".
            do:() fun fileContent: fname.
        }.
	    
	    !if (not async) {
		    !ifElse (result eq void) {
			    _request serveExistingFile fname
		    };{
	        	($endServing propOf _request): result
	        }
        }
    };{
        _request serveNotFound fname
    }
	
}).

print (!dateString) + "Start port listening (assumes that ./nogit/https/key.pem exists) ...".
!ifNot (fileIsFile: (default: (!getUnixUserFolder) + "/.kalzit/https/key.pem"): appParameter: "https-key-file") {
	runCommandFromArray: "./cli";"https";"autoCert"
}.
!customHttpsServer onClientConnect
	[$port; Int: (default: 5001): appParameter: "https-port"];
	[$keyFile; (default: (!getUnixUserFolder) + "/.kalzit/https/key.pem"): appParameter: "https-key-file"];
	[$certificateFile; (default: (!getUnixUserFolder) + "/.kalzit/https/cert.pem"): appParameter: "https-certificate-file"].

!httpServer onClientConnect Int: (default: 5000): appParameter: "http-port".

`(Storage management is done in a different script)`
