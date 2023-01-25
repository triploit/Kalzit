#Install packages locally for this project (not too bad if it does not work)
npm install follow-redirects diskspace qrcode

mkdir ./generated

bash ./utilities/installer/parts/nogit.sh
bash ./utilities/installer/parts/cli.sh

#Attempt do link the cli file to "kalzit"
if ! command -v kalzit &> /dev/null
then
	bash ./utilities/installer/parts/globalCli.sh
fi

kalzit https certificate "$(hostname)"
kalzit build everything