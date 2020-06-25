startFolder="$(pwd)"
for minifyScript in $(find "$(pwd)" -name minify.sh -not -path */nogit/*)
do
	cd $(dirname $minifyScript)
	bash ./minify.sh
done
cd "$startFolder"

#Prepare minified libraries
terser ./core/_min.js ./html5/_min.js ./APIs/html5js/_min.js ./APIs/html5ui/_min.js ./APIs/packagesJs/_min.js ./APIs/packages/_min.js --output ./generated/_min.js
terser ./APIs/html5media/_min.js ./APIs/mediaPackages/_min.js ./APIs/html5ui/plots/_min.js ./APIs/twitch/html5/_min.js ./APIs/twitch/packages/_min.js ./APIs/instagram/_min.js ./APIs/youtube/html5/_min.js ./APIs/reddit/packages/_min.js ./APIs/reddit/html5/_min.js --output ./generated/_extra.js
terser ./generated/_min.js ./generated/_extra.js --output ./generated/_max.js

cd ./html5/files
bash build.sh