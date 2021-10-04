#Before doing anything else, build the home screen data
#./cli build homescreenData

#Get the app ID
appId=$1
echo Building app $appId

appBuildScript="$(pwd)/assets/appProjectDummy/build.sh"

#We can now ignore the first argument
shift 1

#Start building
cd ./apps/$appId
bash "$appBuildScript"