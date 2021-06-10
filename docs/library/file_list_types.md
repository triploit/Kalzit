# file_list_types
## argumentList

## comment

Returns a list of all file mime types the runtime knows about.
The result is a list of string pairs, where the first item of each is the file extension, and the second is the mime type.

Because of that, the result can also be used as an object:
$jsonMimeTypeText = $json propOf !fileListTypes.

However, if you want to just get the file mime by file extension, "fileMime" is preferred.
