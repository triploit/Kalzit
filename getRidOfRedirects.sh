#Search for .redirect files
found="$(find . -name '*.redirect' -type f)"

#Make the redirect files into symbolic links
for i in $found
do
	echo "Found redirect file $i"
	echo "Represents folder ${i%.redirect}"
	echo "Points to $(cat "$i"); linking"
	
	#Create link
	ln -s "$(cat "$i")" "${i%.redirect}"
	
	#Remove .redirect file
	rm "$i"
done