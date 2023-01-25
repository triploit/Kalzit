#!/bin/bash
platforms=$@

for platform in $platforms
do
	while IFS= read -r var
	do
		echo "$platform/files/$var"
	done < "$platform/bootstrap/packageManagerScripts.txt"
	
	while IFS= read -r var
	do
		echo "$platform/files/$var"
	done < "$platform/bootstrap/platformScripts.txt"
done