#TODO: make "html5/files/buildForBrowser.sh" better to make this stuff less hard
#(Relative paths should not be necessary to use the script)
appdir=$(pwd)

cd ../..
./cli build kalzitFile "$appdir/home.k" "$(pwd)"