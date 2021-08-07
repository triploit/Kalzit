#Get to the root folder
cd ../..
startFolder="$(pwd)"


#Minify the CSS stylesheets
cd ./assets/stylesheets/html5
bash ./minify.sh
cd $startFolder

#Generic skeleton
bash "html5/files/buildForBrowser.sh" "browser_app_base.html" "./generated/_browser_app_skeleton.html" --singlefile true --library-file "generated/_min.js" --for-skeleton true