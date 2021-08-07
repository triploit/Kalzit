startFolder="$(pwd)"

#Minify the base (core) language files
cd ./core/files
bash minify.sh

cd ../../html5/files
bash build.sh