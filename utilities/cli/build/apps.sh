#Before doing anything else, build the home screen data
./cli build homescreenData

rootFolder="$(pwd)"
appSkeleton="$rootFolder/_browser_app_singlefile.html"
appFolder="$rootFolder/apps"
arguments="$@"

#Look for build.sh files in /apps/*
for idFile in $(find -L "$appFolder" -type f -name "appId.txt")
do
	id="$(cat $idFile)"
	
	# We use multiple processes to do stuff in parallel. To make sure this does not fail, limit the amount of parallel processes to a tenth of the user maximum
	processLimit=$(ulimit -u)
	processLimit=$((processLimit / 10))
	while [ $(jobs -r | wc -l) -ge $processLimit ] ; do sleep 1 ; done
	./cli build app "$id" &
done

wait
echo $0 done!