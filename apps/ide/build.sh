#TODO: make "html5/files/buildForBrowser.sh" better to make this stuff less hard
#(Relative paths should not be necessary to use the script)
appdir=$(pwd)
cd ../..

bash "html5/files/buildForBrowser.sh" "../../apps/ide/browser_ide_base.html" "apps/ide/index.html" --library-file "generated/_max.js" --singlefile true