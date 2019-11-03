#!/bin/bash
platforms=$@

bash "core/files/listScripts.sh" core $platforms | while read x
do
	echo "<script type=\"text/javascript\" src=\"/$x\"></script>"
done

echo "<script type=\"text/javascript\">GLang.packageManager.initialize(["
for platform in $platforms
do
	echo "	\"/$platform/platform-packages.json\","
done
echo "	\"/core/platform-packages.json\""
echo "]);</script>"