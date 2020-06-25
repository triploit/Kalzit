cd ..
mkdir ./KalzitReinstall
cd ./KalzitReinstall

#The main stuff
curl https://raw.githubusercontent.com/triploit/Kalzit/master/utilities/installer/main.sh | sh

cd ..
#Move to the original folder
rm -rf ./Kalzit
mv ./KalzitReinstall ./Kalzit
rm -rf ./KalzitReinstall