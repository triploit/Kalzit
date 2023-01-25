this.uiUpdatePickerValue = function(pickerControl, selection){
	pickerControl.value = selection;
}

this.uiSetPickerValue = function(pickerControl, selection){
	this.updatePickerValue(pickerControl, selection);
	pickerControl.onchange(); //Seems to work without an event parameter
}