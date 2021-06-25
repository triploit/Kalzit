#Install dependencies
echo Checking dependencies ...
mkdir ./generated
bash ./utilities/installer/parts/dependencies.sh

#Stuff that uses 'node' and 'npm'
bash ./utilities/installer/runWithNodejs.sh $@

echo
echo The Kalzit installation should be done now.
echo Have fun!
echo