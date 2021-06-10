# wikipedia_search_urls
## argumentList
term
language
## deprecated
This relies on synchronous loading, which is discouraged
## comment

Returns a list of URLs for a given search term. The URLs do not need to have something to do with the topic of the term, but they usually include it.

Usage example:
$urlsWithPineapple = wikipediaSearchUrls: "Pineapple".

As with "wikipediaSearch", you can specify an optional language (usually as a two-letter code):
"Pineapple" wikipediaSearchUrls "en"
