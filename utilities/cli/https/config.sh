if [ "$#" -ne 1 ] ; then
	echo "The https config script needs exactly one parameter:"
	echo "1. The host name which the certificate configuration is for"
else
	cat ./utilities/cli/https/config-dummy.txt > ./generated/https-config.conf
	echo "DNS.1 = $1" >> ./generated/https-config.conf
	echo "[ subject ]" >> ./generated/https-config.conf
	echo "commonName_default = $1" >> ./generated/https-config.conf
fi