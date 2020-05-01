folder="$(pwd)"
cd ../../../nodejs/files
bash run.sh "$(pwd)/minifyKalzitPackage.txt" --input-file $folder/platform-packages.json --output-file $folder/_min.js