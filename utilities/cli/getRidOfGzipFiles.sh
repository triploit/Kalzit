find ./nogit/users -type f -iname \*.gz -delete

# Also remove all file listings, so wrongly added .gz files can not show up in the files app
find ./nogit/users -type f -iname listing.json -delete