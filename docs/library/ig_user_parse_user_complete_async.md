# ig_user_parse_user_complete_async
## argumentList
callback
userName
## comment

Passes a (most complete) representation of the given Instagram user to the callback.

This is done by loading "https://www.instagram.com/userName" and scanning the source code for the "window._sharedData" variable.
The content of this variable (expected to be JSON) is then parsed, and the result is returned.
Because of this approach, the function could break whenever Instagram updates their site.

Example usage:
$userData = igUserParseUserComplete: "anyUserName".

If you do not need all available user data, consider using a more specialized function instead of this one.
Possible options would be "instagramUserImages" or "kmpFromInstagramUser".
