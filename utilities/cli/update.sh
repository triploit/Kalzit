cd ..
mkdir ./KalzitUpdate
cd ./KalzitUpdate

#The main update stuff
curl https://raw.githubusercontent.com/triploit/Kalzit/master/utilities/installer/main.sh | sh

cd ..
#Move apps and nogit files to the temporary folder
mv ./Kalzit/apps ./KalzitUpdate/apps
mv ./Kalzit/nogit ./KalzitUpdate/nogit

#Move reinstall to the original folder
rm -rf ./Kalzit
mv ./KalzitUpdate/Kalzit ./Kalzit

#Replace the standard "apps" and "nogit" folders
rm -rf ./Kalzit/apps
mv ./KalzitUpdate/apps ./Kalzit/apps
rm -rf ./Kalzit/nogit
mv ./KalzitUpdate/nogit ./Kalzit/nogit

#Rebuild everything
cd ./Kalzit
./cli build everything