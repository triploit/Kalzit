# osm_search_place_names_async
## argumentList
callback
term
## comment

Produces a list of place names that describe places matching a search term and passes it to a callback.

Usage example:
!osmSearchPlaceNamesAsync "search term" -> {$names = x}.

If you need to get a name from a place object, consider using "osmPlaceName".
