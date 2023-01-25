for packageIndex in $(find -L "$(pwd)" -name "platform-packages.json" -not -path "*/nogit/*" -not -path "*/assets/*")
do
	folder="$(dirname $packageIndex)"
	echo "Minifying API $folder"
	
	# We use multiple processes to do stuff in parallel. To make sure this does not fail, limit the amount of parallel processes to a tenth of the user maximum
	processLimit=$(ulimit -u)
	processLimit=$((processLimit / 10))
	while [ $(jobs -r | wc -l) -ge $processLimit ] ; do sleep 1 ; done
	./cli run nodeApp $(pwd)/nodejs/files/minifyKalzitPackage.txt --input-file $folder/platform-packages.json --output-file $folder/_min.js &
done

wait
echo $0 done!