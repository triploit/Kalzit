# file_name
## comment

Returns the name of a given file, excluding the containing folder path.
For example, fileName: "test.txt" is just "test.txt".
If you pass "a/b/c.txt", the result is "c.txt".

Basically, the string is searched for slashes ("/"), and the text after the last slash is returned.