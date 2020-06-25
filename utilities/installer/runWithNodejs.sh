npm install follow-redirects xmldom
npm install -g terser
npm install -g uglifycss
npm install -g markdown-to-html

#nogit
mkdir nogit
mkdir nogit/cache
mkdir nogit/cache/maptiles
mkdir nogit/cache/urldates
mkdir nogit/cache/yttitles
mkdir nogit/https
mkdir nogit/sites
echo "0$(cat ./nogit/sites/count.txt)" > ./nogit/sites/count.txt
mkdir nogit/sites/ids
mkdir nogit/sites/urls
mkdir nogit/users
mkdir nogit/users/data
mkdir nogit/users/plain

chmod +x ./cli

echo \#!/bin/bash > ./kalzit
echo cd \"$(pwd)\" >> ./kalzit
echo "./cli \$@" >> ./kalzit

mkdir ./generated
./cli build everything

chmod +x ./kalzit
chmod +x ./nodejs/files/httpServer

ln -sf "$(pwd)/kalzit" /usr/local/bin/kalzit