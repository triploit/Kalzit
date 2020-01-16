#This script needs to be run inside the /docs/_ folder
#It detects every Markdown file (by the file extension .md) and builds an html file for it that has the same name but a different extension.
#You need to install the markdown command to run this successfully.

list="$(find .. -name *.md)"
for item in $list
do
	file=${item%.md}.html
	echo '<html><head><link rel="stylesheet" href="/assets/stylesheets/html5/default/style.css"><link rel="stylesheet" href="/assets/stylesheets/html5/article.css"></link></head><body>' > $file
	markdown $item >> $file
	echo '</body></html>' >> $file
done