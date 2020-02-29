rootFolder="$(pwd)"
appSkeleton="$(pwd)/_browser_app_singlefile.html"
cd ./apps
appFolder="$(pwd)"
cd ../nodejs/files
scriptPath="$(pwd)/buildAppHtml.txt"

arguments="$@"

build_k_file () {
	file=$1
	bash run.sh "$scriptPath" --kalzit-file "$file" --kalzit-root-folder "$rootFolder" $arguments
	baseName="${file%.k}"
	shasum "$baseName.html" | awk '{ print $1 }' > "$baseName.shasum"
}

build_all_k_files_in_folder () {
	for file in $(find "$1" -type f -name "*.k")
	do
		build_k_file "$file"
	done
}

build_all_k_files_in_folder "$appFolder"

#Look for .redirect files in /apps
for redirect in $(find "$appFolder" -type f -name "*.redirect")
do
	redirectedFile=$(cat "$redirect")
	if [ -e "$redirectedFile" ]; then
	   build_all_k_files_in_folder "$redirectedFile"
	fi
done
