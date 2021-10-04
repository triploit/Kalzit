for i in {0..1000}
do
	curl http://localhost:5000
	echo Run $i of 1000 finished
done