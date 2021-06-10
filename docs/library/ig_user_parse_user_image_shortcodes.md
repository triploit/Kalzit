# ig_user_parse_user_image_shortcodes
## argumentList
userName
## deprecated
This relies on synchronous loading, which is discouraged
## comment

Returns a list of image "shortcodes" by a given instagram user.
Basically, the "shortcode" is what you put after "https://instagram.com/p/" to get to the image page.

Here is an example that opens the most recent user image in the browser:
redirect: "https://instagram.com/p/" + first: igUserParseUserImageShortcodes: "anyUserName".
