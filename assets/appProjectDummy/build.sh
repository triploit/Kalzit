appFolder="$(pwd)"
cd ../..
rootFolder="$(pwd)"
cd "$appFolder"

# First thing: maybe this is an older project. The location of some files has changed since the beginning of this build script, so we have to rename them
# The thing in square brackets is basically a short form to check if a file or folder exists. Whatever follows after "&&" is run only if the file or folder is actually there

## Rename "doNotTouch" to "./doNotTouch" - makes the project structure simpler
[[ -d "./doNotTouch" ]] && rm -rf ./.doNotTouch && mv ./doNotTouch ./.doNotTouch

## Renaming will continue below, but we can now get the app ID
appId=$(cat ./.doNotTouch/appId.txt)

## Rename "static" to "./.doNotTouch/static" - makes the project structure simpler
[[ -d "./static" ]] && mv ./static ./.doNotTouch/static
## Move the app icon from "icons/iOS.png" to "<appId>.png" - makes sense with the other files like <appId>.k or <appId>.
[[ -f "./icons/iOS.png" ]] && mv ./icons/iOS.png "./$appId.png"
# If it is empty, remove the old "static" folder
[[ ! -d "./static" ]] || [[ -z `ls -A "./static"` ]] || rm -rf "./static"
# If it is empty, remove the old "icons" folder
[[ ! -d "./icons" ]] || [[ -z `ls -A "./icons"` ]] || rm -rf "./icons"


[[ -d "./.doNotTouch" ]] || mkdir ./.doNotTouch
[[ -d "./.doNotTouch/static" ]] || mkdir ./.doNotTouch/static

#Generate static string assets and translationMap.json for quick access
hasPrevious=0
for jsonFile in $(find -L "$appFolder" -name default.json)
do
	parent="$(dirname $jsonFile)"
	key='"'$(basename $parent)'"'
	
	if [ $hasPrevious == 1 ]
	then
		echo ,$key:$(cat "$jsonFile") >> ./.doNotTouch/translationMap.json
	else
		echo {$key:$(cat "$jsonFile") > ./.doNotTouch/translationMap.json
		hasPrevious=1
	fi
done
if [ $hasPrevious == 1 ]
then
	echo "}" >> ./.doNotTouch/translationMap.json
else
	rm ./.doNotTouch/translationMap.json
	
	# This is here to remove files that older build scripts might have created
	rm ./.doNotTouch/manifest.appcache
	rm ./.doNotTouch/appcache-manifest.txt
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
if [ -f "./$appId.png" ]
then
	if [ $hasPrevious == 1 ]
	then
		echo "," >> "./$appId.json"
	fi
	#Build static version of <appId>.png
	sum=($(shasum "./$appId.png"))
	
	#Instead of simply copying the image, scale it using ffmpeg to make the static version - this should ensure better performance for higher resolution images
	#Default size is 128x128 pixels
	#Do that only if it was not done before - if the resulting file does not exist already
	if [ ! -f ./.doNotTouch/static/$sum.png ]; then
	    ffmpeg -i "./$appId.png" -vf scale=128x128 "./.doNotTouch/static/$sum.png"
	fi
	
	#Add the icon to the app config file <appId>.json
	echo "\"appleTouchIcon\":\"/apps/$appId/.doNotTouch/static/$sum.png\"" >> "./$appId.json"
fi

#End of app .json file generation
echo "}" >> ./$appId.json


#Build the actual HTML file
cd "$rootFolder"

if [ -f "$appFolder/platform-packages.json" ]
then
	./cli run nodeApp "$rootFolder/nodejs/files/minifyKalzitPackage.txt" --input-file "$appFolder/platform-packages.json" --output-file "$appFolder/.doNotTouch/_min.js"
else
	rm "$appFolder/.doNotTouch/_min.js"
fi

./cli build kalzitFile "$appFolder/$appId.k" "$rootFolder" "$@"

#Create a checksum (for automatic refreshes)
cd "$appFolder"
shasum ./index.html > checksum.shasum

#Create a listing of all project files which are not hidden (useful for downloading from the internet)
find . -not -path "*/.*" -not -path "./.doNotTouch/*" -not -path "./*.app/*" -type f > ./.doNotTouch/fileListing.txt