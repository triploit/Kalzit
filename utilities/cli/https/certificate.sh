if [ "$#" -ne 1 ] ; then
	echo "The https certificate script needs exactly one parameter:"
	echo "1. The host name which the certificate is for"
else
	./cli https config "$1"
	if [ ! -d ./nogit/https ]; then
		mkdir ./nogit/https
	fi
	if [ ! -d ./generated/logs ]; then
		mkdir ./generated/logs
	fi
	#The main work - idea from https://deliciousbrains.com/https-locally-without-browser-privacy-errors/
	yes "" | openssl req -config ./generated/https-config.conf -new -sha256 -newkey rsa:2048 \
	-nodes -keyout ./nogit/https/key.pem -x509 -days 365 \
	-out ./nogit/https/cert.pem &> "./generated/logs/https-certificate-log-$(date +'%Y-%m-%d_%H.%M.%S').txt"
fi