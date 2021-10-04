# osm_search_places_async
## argumentList
callback
term
## comment

Produces a list of places found by the OpenStreetMap search API and passes it to a callback.
The returned object is the parsed version of the queried JSON data.

Usage example:
!osmSearchPlacesAsync "search term" -> {$places = x}.

To easily access information about the found places, consider using "osmPlaceCoordinates" or "osmPlaceName".
