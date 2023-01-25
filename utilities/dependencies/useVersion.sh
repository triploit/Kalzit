version=$1
cd $(dirname $0)

rm ./uglifycss
rm ./node
rm ./terser

ln -s ./$version/uglifycss ./uglifycss
ln -s ./$version/terser ./terser
ln -s ./$version/node ./node