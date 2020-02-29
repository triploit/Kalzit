uglifyjs $(echo ./packages/*.js) --output _min.js

folder="$(pwd)"
cd ../../nodejs/files
bash run.sh $folder/../../createNameListJson.txt --input-file $folder/platform-packages.json --output-file $folder/_nameList.json