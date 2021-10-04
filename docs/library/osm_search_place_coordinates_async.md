# osm_search_place_coordinates_async
## argumentList
callback
term
## comment

Produces a list of place coordinates that describe places matching a search term and passes it to a callback.

Usage example:
!osmSearchPlaceCoordinatesAsync "search term" {$coordinates = x}.

If you need to get coordinates from a place object, consider using "osmPlaceCoordinates".
