file=$1
rootFolder=$2
shift 2

scriptPath="$rootFolder/nodejs/files/buildAppHtml.txt"
./cli run nodeApp "$scriptPath" --kalzit-file "$file" --kalzit-root-folder "$rootFolder" "$@"