# url
## argumentList
u
## comment

A type that describes an URL with a protocol.
Basically, any URL is assumed to be a string.
If the given string does not contain "://" - meaning it has no protocol - the text "https://" is added to the start.
Otherwise, the original string is returned.
