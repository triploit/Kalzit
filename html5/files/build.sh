cd ../..

#Full library, multifile (IDE is built here)
bash "html5/files/buildForBrowser.sh" "browser_app_base.html" "./generated/_browser_app.html"
bash "html5/files/buildForBrowser.sh" "browser_ide_base.html" "apps/ide.html"

#Base library, multifile
bash "html5/files/buildForBrowser.sh" "browser_app_base.html" "./generated/_browser_app_baselib.html" --library-file "generated/_min.js"

#Full library, singlefile
bash "html5/files/buildForBrowser.sh" "browser_app_base.html" "./generated/_browser_app_singlefile.html" --singlefile true

#Base library, singlefile
bash "html5/files/buildForBrowser.sh" "browser_app_base.html" "./generated/_browser_app_singlefile_baselib.html" --singlefile true --library-file "generated/_min.js"