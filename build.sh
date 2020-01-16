cd ./core/files
bash minify.sh
cd ..
bash minify.sh

cd ../html5js
bash minify.sh

cd ../html5ui
bash minify.sh

cd ../packages
bash minify.sh

cd ../packagesJs
bash minify.sh

cd ../html5
bash minify.sh

cd ../assets/stylesheets/html5
bash minify.sh

cd ../../..
#uglifyjs $(echo */_min.js) --output _min.js
pwd
uglifyjs ./core/_min.js ./html5/_min.js ./html5js/_min.js ./html5ui/_min.js ./packagesJs/_min.js ./packages/_min.js --output _min.js

cd ./html5/files
bash build.sh

cd ../../docs/_
bash makehtml.sh