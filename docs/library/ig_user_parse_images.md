# ig_user_parse_images
## argumentList
_igUserBase
## comment

Parses out the image data from a given instagram user.
The parameter of this function needs to be the result of "igUserParseBase" or "igUserParseUserBase".

Example usage:
$userImages = igUserParseImages: igUserParseUserBase: "anyUserName".

If you are interested in only getting image thumbnails, consider using "igUserParseImageThumbnails".
In case you are only interested in the full-resolution version of images, "igUserParseImageUrls" is the way to go.

Basically, this function should only be used if you need multiple different pieces of information about the images.
