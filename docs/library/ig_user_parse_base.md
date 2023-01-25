# ig_user_parse_base
## argumentList
_igUserComplete
## comment

Parses out the main part of an Instagram user's publicly available data.
The argument of this function needs to be the result of "igUserParseUserComplete".

Example usage:
$mainPart = igUserParseBase: igUserParseUserComplete: "anyUserName".

If you do not need all available user data, consider using a more specialized function instead of this one.
Possible options would be "instagramUserImages" or "kmpFromInstagramUser".
