if [ "$#" -lt 2 ] ; then
	echo "The app setup script needs two parameters:"
	echo "1. An absolute path to the project folder (where the app files will be)"
	echo "2. An app id (used to run the app, for example with the 'run app' utility)"
else
	projectFolder=$1
	appId=$2
	kalzitRootFolder="$(pwd)"
	
	cp -rfn ./assets/appProjectDummy/ "$projectFolder"
	echo "bash \"\$(cat ./doNotTouch/rootFolder.txt)/assets/appProjectDummy/build.sh\"" > "$projectFolder/build.sh"
	cd "$projectFolder"
	mkdir ./doNotTouch
	mkdir ./packages
	echo $appId > ./doNotTouch/appId.txt
	echo $kalzitRootFolder > ./doNotTouch/rootFolder.txt
	
	#ID-specific files
	if [ ! -f ./$appId.k ]
	then
		touch $appId.k
	fi
	bash ./build.sh
	
	#Make project available under URL /app/id
	echo $projectFolder > "$kalzitRootFolder/apps/$appId.redirect"
fi