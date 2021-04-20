#Generate static string assets and translationMap.json for quick access, as well as manifest.appcache
hasPrevious=0
for jsonFile in $(find "./assets/strings" -name default.json)
do
	parent="$(dirname $jsonFile)"
	key='"'$(basename $parent)'"'
	
	if [ $hasPrevious == 1 ]
	then
		echo ,$key:$(cat "$jsonFile") >> ./generated/translationMap.json
	else
		echo {$key:$(cat "$jsonFile") > ./generated/translationMap.json
		hasPrevious=1
	fi
done
if [ $hasPrevious == 1 ]
then
	echo "}" >> ./generated/translationMap.json
else
	rm ./generated/translationMap.json
fi