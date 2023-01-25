# array_joined_chunks
## comment

Returns all possible chunks of a given length that can be created from an array.
The values inside these chunks are in the same order as they are in the original array.
For example, the list (1;2;3;4) contains these "joined" chunks of size 2: [1;2];[2;3];[3;4]
Lists that have fewer elements than the required chunk size are extended and returned as their only chunk

Example with a list that is too short:
5 arrayJoinedChunks (1;2;3).
`Result: [[1];[2];[3];[1];[2]]`

Example with a list that is too short:
2 arrayJoinedChunks (7;9).
`Result: [[7];[9]]`

Example with two chunks
3 arrayJoinedChunks (0;1;2;3).
`Result: [[0];[1];[2]]; [[1];[2];[3]]`