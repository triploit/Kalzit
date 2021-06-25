for packageIndex in $(find -L "$(pwd)" -name "platform-packages.json" -not -path */nogit/* -not -path */assets/*)
do
	folder="$(dirname $packageIndex)"
	echo "Minifying API $folder"
	./cli run nodeApp $(pwd)/nodejs/files/minifyKalzitPackage.txt --input-file $folder/platform-packages.json --output-file $folder/_min.js
done