# ig_user_parse_user_images
## argumentList
userName
## deprecated
This relies on synchronous loading, which is discouraged
## comment

This function is a slightly different version of "igUserParseImages".
Instead of needing an object as its parameter, this one requires just a simple user name.

As an example, here are two lines of code that produce the same result:
igUserParseImages: igUserParseUserBase: "anyUserName".
igUserParseUserImages: "anyUserName".

If you are interested in only getting image thumbnails, consider using "igUserParseUserImageThumbnails".
In case you are only interested in the full-resolution version of images, "igUserParseUserImageUrls" is the way to go.

Basically, this function should only be used if you need multiple different pieces of information about the images.
