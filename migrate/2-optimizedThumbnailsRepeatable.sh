# Go through the list of users
for userFiles in ./nogit/users/data/v3/*/files/v2
do
    echo $userFiles
    mkdir -p "$userFiles/thumbnails"

    # https://stackoverflow.com/questions/11366184/looping-through-find-output-in-bash-where-file-name-contains-white-spaces
    find $userFiles/main -iname thumbnail.jpg -print0 | while IFS= read -d '' -r thumbnailFile; do
        
        # Go through all the already existing thumbnails and check if this one is there
        counter=0
        while [ -f "$userFiles/thumbnails/$counter.jpg" ]
        do
            # echo Checking index $counter against $thumbnailFile
            # Check if the thumbnails match
            if cmp --quiet "$userFiles/thumbnails/$counter.jpg" "$thumbnailFile"
            then
                # echo "Thumbnails match!"
                break
            fi
            # https://askubuntu.com/questions/385528/how-to-increment-a-variable-in-bash
            counter=$((counter+1))
        done
        
        echo Thumbnail for $thumbnailFile has index $counter
        # If the file is not there, copy it over
        [ ! -f "$thumbnailFile" ] || cp "$thumbnailFile" "$userFiles/thumbnails/$counter.jpg"
        
        # Actually make the new thumbnail active
        ./cli run nodeApp "$(dirname $0)/2-setThumbnail.k" --file-to-change "$(dirname "$thumbnailFile")" --new-thumbnail "/api/thumbnail/indexed?index=$counter"
    done
done

# TODO: Remove all the folder KMP files (listing.json)