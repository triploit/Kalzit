startFolder="$(pwd)"

#Minify the base (core) language files
cd ./core/files
bash minify.sh

cd "$startFolder"
bash ./utilities/cli/build/libraries.sh

cd ./html5/files
bash build.sh