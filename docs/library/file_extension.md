# file_extension
## comment

Returns the file extension from a given file path.
That is done by simply returning whatever is behind the last dot.

The following would return "txt":
fileExtension: "path/test.txt".

If you write something else, however, the result could make less sense:
fileExtension: "https://www.github.com". `Result is the string "com"`

In case there is no dot, the entire string is returned:
fileExtension: "jpg". `Still jpg`