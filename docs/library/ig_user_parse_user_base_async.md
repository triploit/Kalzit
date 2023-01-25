# ig_user_parse_user_base_async
## argumentList
callback
userName
## comment

This function is a slightly different version of "igUserParseBase".
Instead of needing an object as its parameter, this one requires just a simple user name.

As an example, here are two lines of code that produce the same result:
print: igUserParseBase: igUserParseUserComplete: "anyUserName".
!igUserParseUserBaseAsync "anyUserName" -> {print x}.

If you do not need all available user data, consider using a more specialized function instead of this one.
Possible options would be "instagramUserImages" or "kmpFromInstagramUser".
