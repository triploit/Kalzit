# youtube_data_by_url_async
## argumentList
callback
anyUrl
## comment

Generates a list of YouTube links found at a given url (anyUrl) and passes that list to a specified function (callback).
The list contains objects with the following properties: $kind and $id.

$kind is the kind of search result which was found. It can be "video", "user", "channel" or "playlist".
$id is the id representing the found item. In order to work with the item, use $kind to figure out which functions to use.
