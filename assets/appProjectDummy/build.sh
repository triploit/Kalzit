rootFolder="$(kalzit get rootFolder)"
appFolder="$(pwd)"
appId=$(cat ./doNotTouch/appId.txt)

mkdir ./static

#Make the home widget work
echo CACHE MANIFEST > ./doNotTouch/manifest.appcache

#Generate static string assets and translationMap.json for quick access, as well as manifest.appcache
hasPrevious=0
for jsonFile in $(find -L "$appFolder" -name default.json)
do
	parent="$(dirname $jsonFile)"
	key='"'$(basename $parent)'"'
	
	if [ $hasPrevious == 1 ]
	then
		echo ,$key:$(cat "$jsonFile") >> ./doNotTouch/translationMap.json
	else
		echo {$key:$(cat "$jsonFile") > ./doNotTouch/translationMap.json
		hasPrevious=1
	fi
done
if [ $hasPrevious == 1 ]
then
	echo "}" >> ./doNotTouch/translationMap.json
else
	rm ./doNotTouch/translationMap.json
	rm ./doNotTouch/manifest.appcache
	rm ./doNotTouch/appcache-manifest.txt
fi


#Generate app .json file (read by HTML building); continues for many lines
echo "{" > ./$appId.json
hasPrevious=0

#excludedLibraries
if [ -f "./config/excluded-libraries.json" ]
then
	echo "\"excludedLibraries\":$(cat ./config/excluded-libraries.json)" >> ./$appId.json
	hasPrevious=1
fi
#iOS icon
if [ -f "./icons/iOS.png" ]
then
	if [ $hasPrevious == 1 ]
	then
		echo "," >> ./$appId.json
	fi
	#Build static version of iOS.png
	sum=($(shasum "./icons/iOS.png"))
	
	#Instead of simply copying the image, scale it using ffmpeg to make the static version - this should ensure better performance for higher resolution images
	#Default size is 128x128 pixels
	#Do that only if it was not done before - if the resulting file does not exist already
	if [ ! -f ./static/$sum.png ]; then
	    ffmpeg -i ./icons/iOS.png -vf scale=128x128 ./static/$sum.png
	fi
	
	#Add the icon to the app config file <appId>.json
	echo "\"appleTouchIcon\":\"/apps/$appId/static/$sum.png\"" >> ./$appId.json
	echo "../static/$sum.png" >> ./doNotTouch/manifest.appcache
fi
#Make all standard string files available for offline access
for stringFile in $(find "$rootFolder/assets/strings" -name default.json)
do
	echo "${stringFile#"$rootFolder"}" >> ./doNotTouch/manifest.appcache
done
#Application Cache (should be the last item)
echo NETWORK: >> ./doNotTouch/manifest.appcache
echo "*" >> ./doNotTouch/manifest.appcache

##Build static version of manifest.appcache
sum=($(shasum "./doNotTouch/manifest.appcache"))
appBaseSum=($(shasum "$rootFolder/generated/_browser_app_singlefile.html"))
appCodeSum=($(shasum "$appFolder/$appId.k"))
##Actually include it in app .json
if [ -f "./doNotTouch/appcache-manifest.txt" ]
then
	if [ $hasPrevious == 1 ]
	then
		echo "," >> ./$appId.json
	fi
	echo "\"appcacheManifest\":\"$(cat ./doNotTouch/appcache-manifest.txt)\"" >> ./$appId.json
fi

#End of app .json file generation
echo "}" >> ./$appId.json


#Build the actual HTML file
cd "$rootFolder"

if [ -f "$appFolder/platform-packages.json" ]
	then
		./cli run nodeApp "$rootFolder/nodejs/files/minifyKalzitPackage.txt" --input-file "$appFolder/platform-packages.json" --output-file "$appFolder/doNotTouch/_min.js"
	else
		rm "$appFolder/doNotTouch/_min.js"
	fi

./cli build kalzitFile "$appFolder/$appId.k" "$rootFolder" $@

#Create a listing of all project files which are not hidden (useful for downloading from the internet)
cd "$appFolder"
find . -not -path "*/.*" -not -path "./doNotTouch/*" -not -path "./*.app/*" -type f > ./doNotTouch/fileListing.txt