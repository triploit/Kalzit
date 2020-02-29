/*
This function categorizes a list (items) into categories.
"items" is a list containing any sort of item (or nothing).

"categories" is a list with items of the form [category, match_test_function].
"category" is the category name.
"match_test_function" is a function that tests if a value fits into the category (return value is usually treated as a boolean).

Returns a list with items of the form [category, matching_items, optional_condition].
"category" is the category of "matching_items".
"optional_condition" is whatever "match_test_function" returned for the first item in "matching_items".
*/
GLang.categorize = function (items, categories){
	
	var unique = true;
	
	function uniqueCategory(){
		unique = !unique;
		return unique ? "_" : "__";
	}
	
	//Returns an array [categoryName, condition]
	function findCategory(item){
		for(var i = 0; i < categories.length; i++){
			var category = categories[i];
			var condition = category[1](item);
			if(condition){
				return [category[0], condition];
			}
		}
		return [uniqueCategory(), null];
	}
	
	var currentCategory = [null, null];
	var currentGroup = [];
	var result = [];
	for(var i = 0; i < items.length; i++){
		var item = items[i];
		var newCategory = findCategory(item);
		
		if(newCategory[0] === currentCategory[0]){
			currentGroup.push(item);
		}else{
			result.push([currentCategory[0], currentGroup, currentCategory[1]]);
			currentGroup = [item];
			currentCategory = newCategory;
		}
	}
	
	if(currentGroup.length > 0){
		result.push([currentCategory[0], currentGroup, currentCategory[1]]);
	}
	
	return result.slice(1);

}