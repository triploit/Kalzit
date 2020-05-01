projectFolder=$1
appId=$2
kalzitRootFolder="$(pwd)"

cp -rfn ./assets/appProjectDummy/ "$projectFolder"
cd "$projectFolder"
mkdir ./doNotTouch
mkdir ./packages
echo $appId > ./doNotTouch/appId.txt
echo $kalzitRootFolder > ./doNotTouch/rootFolder.txt

#ID-specific files
if [ ! -f ./$appId.k ]
then
	touch $appId.k
fi
bash ./build.sh

#Make project available under URL /app/id
echo $projectFolder > "$kalzitRootFolder/apps/$appId.redirect"