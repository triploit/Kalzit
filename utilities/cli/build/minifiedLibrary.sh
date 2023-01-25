folder="$1"
echo "Minifying API $folder"
./cli run nodeApp $(pwd)/nodejs/files/minifyKalzitPackage.txt --input-file $folder/platform-packages.json --output-file $folder/_min.js