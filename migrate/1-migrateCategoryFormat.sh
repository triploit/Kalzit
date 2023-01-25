# Go through the list of users
for userFiles in ./nogit/users/data/v3/*/files/v2/categories
do
    echo $userFiles

    # https://stackoverflow.com/questions/11366184/looping-through-find-output-in-bash-where-file-name-contains-white-spaces
    ls "$userFiles" | while IFS= read -r category; do
        categoryFolder="$userFiles/$category"
        echo $categoryFolder
        
        # For each file in the category, add a marker file so we know the file is in the category
        ls "$categoryFolder" | while IFS= read -r fileInCategory; do
            echo $categoryFolder/$fileInCategory
            mkdir "$categoryFolder/$fileInCategory/categories"
            touch "$categoryFolder/$fileInCategory/categories/$category"
        done
    done
done