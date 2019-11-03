(function(global){
	//Factory for ParseTree rules that generate blocks
	global.GLang.BlockRule = function(categoryName, startChar, endChar){
		//This is the actual rule
		return function(structures){
			//Blocks can not have a depth smaller than zero, so the depth has to be tracked
			var depth = 0;
			
			//Check if the first and last part are startChar and endChar
			if(GLang.structuresToString([structures[0]]) !== startChar) return false;
			if(GLang.structuresToString([structures[structures.length - 1]]) !== endChar) return false;
			
			//Loop through every structure, except first and last (they are already tested)
			for(var i = 1; i < structures.length - 1; i++){
				//Convert to string, in order to compare to startChar and endChar later
				var struct = structures[i];
				var string = GLang.structuresToString([struct]);
				
				//If there is a start character, increase depth
				if(string === startChar){
					depth++;
				}
				//If there is an end character, decrease depth
				if(string === endChar){
					depth--;
				}
				
				//Validate the depth - if it is negative, the structure is not a valid block
				if(depth < 0){
					return false;
				}
			}
			//The loop finished without a negative depth - this is an actual block!
			return [{category:categoryName, tree:structures}];
		}
	}
})(this);