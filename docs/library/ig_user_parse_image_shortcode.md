# ig_user_parse_image_shortcode
## argumentList
_userImage
## comment

Returns the "shortcode" of an instagram user image.
The parameter of this function needs to be an entry of the result of "igUserParseImages" or "igUserParseUserImages".

Basically, the "shortcode" is what you put after "https://instagram.com/p/" to get to the image page.

So, if you want to create a link to an instagram image, you could do it like this:
$imageData = `Image data from somewhere`.
$link = "https://instagram.com/p/" + igUserParseImageShortcode: imageData.

In case you need to get shortcodes of multiple images, consider using "igUserParseImageShortcodes" (has an "s" at the end).
