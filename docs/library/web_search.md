# web_search
## argumentList
term_cached
## comment

Performs a web search for a given search term and returns the resulting URLs to matching websites.
The method used for getting URLs is not fixed and can change between versions.
The found URLs are coming from another search engine (DuckDuckGo at the moment), and so there is no guarantee that the results are appropriate, matching the search term or anything else - they are not controlled or filter these results.

Usage example for a basic search:
$results = webSearch: "Elephant".

If you need better control about the search engine used, please do not use this function.
There are search-engine-specific functions available for this, like "duckSearchUrls".
