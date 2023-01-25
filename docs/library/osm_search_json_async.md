# osm_search_json_async
## argumentList
callback
term
## comment

Produces the JSON string returned by the OpenStreetMap search API.

Usage example:
!osmSearchJsonAsync "searchTerm" -> {$jsonText = x}.

If you just want to access the search data, consider using "osmSearchPlaces" instead.
