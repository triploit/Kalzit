testFiles=$(find "$(kalzit get rootFolder)" -type f -path "*/tests/*.k")

for test in $testFiles
do
	./cli run testFile "$test" "$@"
done