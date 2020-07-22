terser $(echo ./packages/*.js) --output _min.js
terser $(echo ./plots/packages/*.js) --output ./plots/_min.js

cd annotations
folder="$(pwd)"
cd ../../../nodejs/files
bash run.sh $folder/../../../nodejs/files/minifyKalzitPackage.txt --input-file "$folder/platform-packages.json" --output-file "$folder/_min.js"