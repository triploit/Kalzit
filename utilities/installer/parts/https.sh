if [ ! -f /path/to/file ]
then
	echo Creating an HTTPS certificate...
	./cli https certificate "$(hostname)"
fi