/*
This function categorizes a list (items) into categories.
"items" is a list containing any sort of item (or nothing).

"categories" is a list with items of the form [category, match_test_function].
"category" is the category name.
"match_test_function" is a function that tests if a value fits into the category (return value is usually treated as a boolean).

Returns a list with items of the form [category, matching_items].
"category" is the category of each element in "matching_items".
*/
GLang.categorize = function (items, categories){
	//Handle an empty array, so the code below can assume an array with at least one item
	if(items.length === 0) return [];	

	var unique = true;
	
	function uniqueCategory(){
		unique = !unique;
		return unique ? "_" : "";
	}
	
	//Returns an appropriate category name
	function findCategory(item){
		for(var i = 0; i < categories.length; i++){
			var category = categories[i];
			
			//Check if the category condition matches
			if(category[1](item)){
				return category[0];
			}
		}
		return uniqueCategory();
	}
	
	var currentCategory = findCategory(items[0]);
	var currentGroup = [items[0]];
	var result = [];
	for(var i = 1; i < items.length; i++){
		var item = items[i];
		var newCategory = findCategory(item);
		
		if(newCategory === currentCategory){
			currentGroup.push(item);
		}else{
			result.push([currentCategory, currentGroup]);
			currentGroup = [item];
			currentCategory = newCategory;
		}
	}
	
	//if(currentGroup.length > 0){
		result.push([currentCategory, currentGroup]);
	//}
	
	//return result.slice(1);
	return result;

}
