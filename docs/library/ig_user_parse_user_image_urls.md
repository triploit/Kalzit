# ig_user_parse_user_image_urls
## argumentList
userName
## deprecated
This relies on synchronous loading, which is discouraged
## comment

This function is a slightly different version of "igUserParseImageUrls".
Instead of needing an object as its parameter, this one requires just a simple user name.

As an example, here are two lines of code that produce the same result:
igUserParseImageUrls: igUserParseUserImages: "anyUserName".
igUserParseUserImageUrls: "anyUserName".

A function with the same effect as this one is also available as "instagramUserImages" to make it easier to use.
