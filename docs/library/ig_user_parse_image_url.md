# ig_user_parse_image_url
## argumentList
_userImage
## comment

Returns the main image URL of an Instagram user image.
The parameter of this function needs to be an entry of the result of "igUserParseImages" or "igUserParseUserImages".

For example, you could get the image URL of the most recent picture like this:
$mostRecent = igUserParseImageUrl: first: igUserParseUserImages: "anyUserName".

Since that is rather much code for this task, there is also the function "instagramUserImages" to make it a lot easier.
However, if you already have an object containing Instagram image data, this function here might be useful.
