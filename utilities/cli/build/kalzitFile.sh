file=$1
rootFolder=$2
shift 2

cd "$rootFolder/nodejs/files"
scriptPath="$(pwd)/buildAppHtml.txt"
arguments=$@
bash ./run.sh "$scriptPath" --kalzit-file "$file" --kalzit-root-folder "$rootFolder" $arguments
baseName="${file%.k}"
shasum "$baseName.html" | awk '{ print $1 }' > "$baseName.shasum"