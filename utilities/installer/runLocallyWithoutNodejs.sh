#Install dependencies
echo Checking dependencies ...
mkdir ./generated

#Call the dependency installer with the "source" command instead of "bash" - this is to allow the dependency installer to quit the entire installation if something can not be found
#Otherwise, only the dependency check would quit, and the rest would continue, which is not at all intended.
source ./utilities/installer/parts/dependencies.sh

#Stuff that uses 'node' and 'npm'
bash ./utilities/installer/runWithNodejs.sh $@

echo
echo The Kalzit installation should be done now.
echo Have fun!
echo