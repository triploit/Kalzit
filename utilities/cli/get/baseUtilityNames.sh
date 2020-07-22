for filename in ./utilities/cli/*
do
	if [ -d "$filename" ] ; then
		basename "$filename"
	else
		basename "${filename%.*}"
	fi
done