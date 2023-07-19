this.ui_update_picker_value = function(pickerControl, selection){
	pickerControl.value = selection;
}

this.ui_set_picker_value = function(pickerControl, selection){
	this.updatePickerValue(pickerControl, selection);
	pickerControl.onchange(); //Seems to work without an event parameter
}
