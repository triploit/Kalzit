## comment

Takes a URL (partial or complete) and returns a parameter it has.
If the parameter is not present, void is returned.

The function takes the parameter name as the first parameter, and the URL as the second.

Usage example:
```
$test = $test urlGetParameter "https://www.example.com/?test=5".
`test is now "5"`
```