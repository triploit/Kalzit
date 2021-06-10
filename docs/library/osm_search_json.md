# osm_search_json
## argumentList
term
## deprecated
This relies on synchronous loading, which is discouraged
## comment

Returns the JSON string returned by the OpenStreetMap search API.

Usage example:
$jsonText = osmSearchJson: "search term".

If you just want to access the search data, consider using "osmSearchPlaces" instead.
