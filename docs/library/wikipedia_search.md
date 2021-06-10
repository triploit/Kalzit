# wikipedia_search
## argumentList
term
language
## deprecated
This relies on synchronous loading, which is discouraged
## comment

Performs an easily accessible search for basic Wikipedia data.
You can specify a search term and an optional language identifier (usually a two letter code, the default is "en") and the function returns a list of result objects.

Every result object has a URL, a title and a (usually empty) description.
So, to print all results (the title, followed by the URL) you could do this:

{
print: ($title propOf x) + ": " + ($url propOf x)
} each wikipediaSearch: "Pineapple".

To specify the language, you could do something like "Search term" wikipediaSearch "de"
