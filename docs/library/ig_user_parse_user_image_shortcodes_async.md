# ig_user_parse_user_image_shortcodes_async
## argumentList
callback
userName
## comment

Passes a list of image "shortcodes" by a given instagram user to the callback.
Basically, the "shortcode" is what you put after "https://instagram.com/p/" to get to the image page.

Here is an example that opens the most recent user image in the browser:
!igUserParseUserImageShortcodes "anyUserName" -> {redirect: "https://instagram.com/p/" + first: x}.
