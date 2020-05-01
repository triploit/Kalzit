cd ../..

#Full library, singlefile (IDE is built here)
bash "html5/files/buildForBrowser.sh" "browser_app_base.html" "./generated/_browser_app_singlefile.html" --singlefile true --library-file "generated/_max.js"

#Base library, singlefile
bash "html5/files/buildForBrowser.sh" "browser_app_base.html" "./generated/_browser_app_singlefile_baselib.html" --singlefile true --library-file "generated/_min.js"

#Generic skeleton
bash "html5/files/buildForBrowser.sh" "browser_app_base.html" "./generated/_browser_app_skeleton.html" --singlefile true --library-file "generated/_min.js" --for-skeleton true