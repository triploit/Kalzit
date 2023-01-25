for filename in ./utilities/cli/$1/*.sh
do
	if [ -f "$filename" ] ; then
		basename "${filename%.*}"
	fi
done