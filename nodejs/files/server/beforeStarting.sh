echo Removing failed uploads ...
rm ./generated/ul_*

echo Removing video downloads to save space...
rm ./generated/vdl_*.mp4

echo Removing partial downloads to allow starting them again...
rm ./generated/*.dlmarker.txt
rm ./generated/*.part
rm ./generated/*.ytdl

echo Removing calcitSession and keys.json files...
rm ./nogit/users/data/v3/*/keys/calcitSession
rm ./nogit/users/data/v3/*/deletedKeys/calcitSession
rm ./nogit/users/data/v3/*/keys.json

echo Removing remaining session folders... TODO: do that on logout
rm -d ./nogit/users/data/v3/*/sessions/*