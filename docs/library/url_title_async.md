# url_title_async
## argumentList
then
anyUrl
## comment

Obtains the title of a URL in an asynchronous way.
The title is obtained by reading the contents of the "title" HTML tag in the referenced website.

To handle the title information, you can specify a callback which is called with the title as its first parameter.
If no title can be found, the first parameter is the original URL itself.

Usage example:
{
popupMessage: "The found title is " + x.
} urlTitleAsync "https://www.duckduckgo.com".
