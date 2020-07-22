# Creates the "nogit" folder in the Kalzit root folder
# That folder contains all files that are user-specific and which should not be tracked by GIT (hence the name)

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