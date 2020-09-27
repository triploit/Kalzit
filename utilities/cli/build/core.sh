startFolder="$(pwd)"

#Minify the base (core) language files
cd ./core/files
bash minify.sh

#Minify APIs by searching for platform-packages.json
cd $startFolder/nodejs/files
for packageIndex in $(find "$startFolder" -name "platform-packages.json" -not -path */nogit/* -not -path */assets/*)
do
	folder="$(dirname $packageIndex)"
	echo "Minifying API $folder"
	bash run.sh $startFolder/nodejs/files/minifyKalzitPackage.txt --input-file $folder/platform-packages.json --output-file $folder/_min.js
done
cd $startFolder

#Prepare minified libraries
terser ./core/_min.js ./APIs/html5core/_min.js ./APIs/html5js/_min.js ./APIs/html5ui/_min.js ./APIs/html5ui/annotations/_min.js ./APIs/packagesJs/_min.js ./APIs/packages/_min.js --output ./generated/_min.js --keep-fnames 

terser ./APIs/html5media/_min.js ./APIs/mediaPackages/_min.js ./APIs/html5ui/plots/_min.js ./APIs/twitch/html5/_min.js ./APIs/twitch/packages/_min.js ./APIs/instagram/_min.js ./APIs/youtube/_min.js ./APIs/youtube/html5/_min.js ./APIs/reddit/packages/_min.js ./APIs/reddit/html5/_min.js ./APIs/osm/_min.js ./APIs/wikipedia/_min.js ./APIs/pinterest/_min.js ./APIs/websearch/_min.js ./APIs/html5localize/_min.js ./APIs/kmp/_min.js ./APIs/betterHttpClient/_min.js --output ./generated/_extra.js --keep-fnames 

terser ./generated/_min.js ./generated/_extra.js --output ./generated/_max.js --keep-fnames 

cd ./html5/files
bash build.sh