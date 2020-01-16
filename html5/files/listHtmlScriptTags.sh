#!/bin/bash
platforms=$@

echo "<script type=\"text/javascript\">$(uglifyjs ./core/files/_min.js)</script>"
bash "core/files/listScripts.sh" $platforms | while read x
do
	echo "<script type=\"text/javascript\">$(uglifyjs ./$x)</script>"
done

echo "<script type=\"text/javascript\">GLang.packageManager.initialize(["
if [ -e "./_min.js" ]
then
	echo "\"/_min.js\""
else
	for platform in $platforms
	do
		if [ -e "./$platform/_min.js" ]
		then
			echo "	\"/$platform/_min.js\","
		else
			echo "	\"/$platform/platform-packages.json\","
		fi
	done
	echo "	\"/core/_min.js\""
fi
echo "]);</script>"