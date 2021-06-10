# ig_user_parse_image_shortcodes
## argumentList
_userImages
## comment

Returns all image "shortcodes" from a list of Instagram image objects.
The parameter of this function needs to be the result of "igUserParseImages" or "igUserParseUserImages".

Basically, the "shortcode" is what you put after "https://instagram.com/p/" to get to the image page.

So, if you want to convert a list of Instagram images to a link, you can do this:
$imageData = `Image data from somewhere`.
$link = "https://instagram.com/p/" + igUserParseImageShortcodes: imageData.

Of course, you could also get a specific shortcode:
$code = first: igUserParseImageShortcodes: imageData.
