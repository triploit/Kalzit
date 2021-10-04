appFolder="$(pwd)"
cd ../..
rootFolder="$(pwd)"
cd "$appFolder"

appId=$(cat ./doNotTouch/appId.txt)

mkdir ./static

#Generate static string assets and translationMap.json for quick access
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
	
	# This is here to remove files that older build scripts might have created
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

#Create a checksum (for automatic refreshes)
cd "$appFolder"
shasum ./index.html.gz > gz-checksum.shasum

#Create a listing of all project files which are not hidden (useful for downloading from the internet)
find . -not -path "*/.*" -not -path "./doNotTouch/*" -not -path "./*.app/*" -type f > ./doNotTouch/fileListing.txt