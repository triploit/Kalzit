# ig_user_parse_user_base
## argumentList
userName
## deprecated
This relies on synchronous loading, which is discouraged
## comment

This function is a slightly different version of "igUserParseBase".
Instead of needing an object as its parameter, this one requires just a simple user name.

As an example, here are two lines of code that produce the same result:
igUserParseBase: igUserParseUserComplete: "anyUserName".
igUserParseUserBase: "anyUserName".

If you do not need all available user data, consider using a more specialized function instead of this one.
Possible options would be "instagramUserImages" or "kmpFromInstagramUser".
