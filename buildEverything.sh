cd ./core/files
bash minify.sh
cd ..
bash minify.sh

cd ../html5
bash minify.sh

cd ../APIs/html5js
bash minify.sh

cd ../html5ui
bash minify.sh

cd ../packages
bash minify.sh

cd ../packagesJs
bash minify.sh

cd ../html5media
bash minify.sh

cd ../mediaPackages
bash minify.sh

cd ../../assets/stylesheets/html5
bash minify.sh

cd ../../..
#uglifyjs $(echo */_min.js) --output _min.js
pwd
uglifyjs ./core/_min.js ./html5/_min.js ./APIs/html5js/_min.js ./APIs/html5ui/_min.js ./APIs/packagesJs/_min.js ./APIs/packages/_min.js --output ./generated/_min.js
uglifyjs ./APIs/html5media/_min.js ./APIs/mediaPackages/_min.js --output ./generated/_extra.js
uglifyjs ./generated/_min.js ./generated/_extra.js --output ./generated/_max.js

cd ./html5/files
bash build.sh

cd ../../docs/_
bash makehtml.sh

cd ../..
bash buildApps.sh "$@"