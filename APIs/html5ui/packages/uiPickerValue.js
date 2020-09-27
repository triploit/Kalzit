this.uiUpdatePickerValue = function(pickerControl, selection){
	pickerControl.value = selection;
}

this.uiSetPickerValue = function(pickerControl, selection){
	this.updatePickerValue(pickerControl, selection);
	pickerControl.onchange(); //TODO: I do not know if an event argument is needed
}