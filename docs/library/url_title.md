# url_title
## argumentList
anyUrl
## deprecated
This relies on synchronous loading, which is discouraged
## comment

Returns the title of a URL by reading the contents of the "title" HTML tag in the referenced website.

If that fails, the URL itself is returned.

Usage example:
$title = urlTitle: "https://www.duckduckgo.com".
