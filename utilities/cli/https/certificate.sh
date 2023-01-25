if [ "$#" -ne 1 ] ; then
	echo "The https certificate script needs exactly one parameter:"
	echo "1. The host name which the certificate is for"
else
	./cli https config "$1"
	if [ ! -d ~/.kalzit/https ]; then
		mkdir ~/.kalzit
		mkdir ~/.kalzit/https
	fi
	if [ ! -d ~/.kalzit/generated/logs ]; then
		mkdir ~/.kalzit/generated
		mkdir ~/.kalzit/generated/logs
	fi
	
	logFile="$HOME/.kalzit/generated/logs/https-certificate-log-$(date +'%Y-%m-%d_%H.%M.%S').txt"
	touch "$logFile"
	echo "$logFile"
	
	#The main work - idea from https://deliciousbrains.com/https-locally-without-browser-privacy-errors/
	yes "" | openssl req -config ~/.kalzit/generated/https-config.conf -new -sha256 -newkey rsa:2048 \
	-nodes -keyout ~/.kalzit/https/key.pem -x509 -days 365 \
	-out ~/.kalzit/https/cert.pem &> "$logFile"
fi