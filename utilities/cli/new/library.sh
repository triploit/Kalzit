if [ "$#" -lt 2 ] ; then
	echo "The library / API setup script needs two parameters:"
	echo "1. An absolute path to the project folder (where the API's files will be)"
	echo "2. An API id (used to link the API to the global APIs folder so it can be used in every app). This should be unique to your API"
else
	projectFolder=$1
	appId=$2
	kalzitRootFolder="$(pwd)"
	
	cp -rfn ./assets/libraryDummy/ "$projectFolder"
	cd "$projectFolder"
	mkdir ./doNotTouch
	echo $appId > ./doNotTouch/libraryId.txt
	mkdir ./packages
	
	#Make API available globally
	cd "$kalzitRootFolder"
	echo $projectFolder > "./APIs/$appId.redirect"
	./cli getRidOfRedirects
fi