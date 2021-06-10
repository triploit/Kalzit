# ig_user_parse_image_urls
## argumentList
_userImages
## comment

Returns all full-resolution URLs from a list of Instagram image objects.
The parameter of this function needs to be the result of "igUserParseImages" or "igUserParseUserImages".

Usage example:
$imageUrls = igUserParseImageUrls: igUserParseUserImages: "anyUserName".

Since that is rather much code for this task, there is also the function "instagramUserImages" to make it a lot easier.
