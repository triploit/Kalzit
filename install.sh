npm install follow-redirects xmldom
npm install -g terser

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

echo \#!/bin/bash > ./kalzit
echo cd \"$(pwd)/nodejs/files\" >> ./kalzit
echo "bash ./run.sh \"\$@\"" >> ./kalzit

chmod +x ./kalzit
chmod +x ./nodejs/files/httpServer
ln -sf "$(pwd)/kalzit" /usr/local/bin/kalzit