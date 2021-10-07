echo Removing calcitSession and keys.json files...
rm ./nogit/users/data/v3/*/keys/calcitSession
rm ./nogit/users/data/v3/*/deletedKeys/calcitSession
rm ./nogit/users/data/v3/*/keys.json

echo Removing remaining sessions...
rm -rf ./nogit/users/data/v3/*/sessions
rm -rf ./nogit/users/sessions