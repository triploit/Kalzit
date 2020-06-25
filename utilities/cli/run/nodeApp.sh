if [ "$#" -lt 1 ]; then
	echo "Please provide at least one argument, containing an absolute path to a file which you want to run"
else
	cd nodejs/files
	bash run.sh $@
fi