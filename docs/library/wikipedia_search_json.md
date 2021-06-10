# wikipedia_search_json
## argumentList
term
language
## deprecated
This relies on synchronous loading, which is discouraged
## comment

Loads data from the Wikipedia search API and returns the resulting string.
The search API does need a search term (first parameter) and the language of the Wikipedia to search in (second parameter).

The language is usually a two-letter code, as it can be obtained by "!getSimpleUserLanguage".

Usage example:
$jsonString = "Pineapple" wikipediaSearchJson "en".

If you want to access the found results in a more direct way, consider using "wikipediaSearch" instead of this function.
