#Install packages locally for this project (not too bad if it does not work)
npm install follow-redirects xmldom diskspace

mkdir ./generated

bash ./utilities/installer/parts/nogit.sh
bash ./utilities/installer/parts/cli.sh

#Create the app.redirect file (to support the "old" /app handle, from previous server versions)
echo ./apps > ./app.redirect

./cli build everything

#Attempt do link the cli file to "kalzit"
if ! command -v kalzit &> /dev/null
then
	bash ./utilities/installer/parts/globalCli.sh
fi