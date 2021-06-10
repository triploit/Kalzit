# osm_search_places
## argumentList
term
## deprecated
This relies on synchronous loading, which is discouraged
## comment

Returns a list of places found by the OpenStreetMap search API.
The returned object is the parsed version of the queried JSON data.

Usage example:
$places = osmSearchPlaces: "search term".

To easily access information about the found places, consider using "osmPlaceCoordinates" or "osmPlaceName".
