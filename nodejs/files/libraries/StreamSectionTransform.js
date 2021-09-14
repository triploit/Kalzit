var Transform = require('stream').Transform;

//Only allows a section of the original stream to come through
function StreamSectionTransform(start, end){
	console.log("StreamSectionTransform: waiting for section " + start + " to " + end);

	//Create a transform object
	var transform = new Transform();
 
 	var currentPosition = 0;
 	
	//The transform function
	transform._transform = function (chunk, encoding, done) {
		//We only want to "push" the bytes that are in the specified region (start to end)
		if ((currentPosition + chunk.length) < start) {
			//This buffer is irellevant - it is in front of the wanted region
			//console.log("StreamSectionTransform: returning nothing, the interesting section has not started")
			done();
		}else if (currentPosition > end){
			//The entire process is already done, so...
			//console.log("StreamSectionTransform: returning nothing, the interesting section is already over")
			done();	
		}else{
			//Okay, so now it gets interesting	 - we are in the relevant region
			//Figure out how much we need to cut off from the start (if anything)
			var startIndex = start - currentPosition;
			if (startIndex < 0) { startIndex = 0 }
			
			//Figure out how much we need to cut offat the end (if anything)
			//Calculation: chunk length without offset minus needed bytes
			var skipEnd = (chunk.length - startIndex) - (end - currentPosition);
			if (skipEnd < 0) { skipEnd = 0 }
			
			var endIndex = chunk.length - skipEnd;
			
			//Slice the original buffer and push it to the stream
			//console.log("StreamSectionTransform: Starting at " + currentPosition +", returning range " + startIndex + " to " + endIndex);
			this.push(chunk.slice(startIndex, endIndex));
			done();
		}
		
		//Add chunk length to the current position
		currentPosition += chunk.length;
		//console.log("StreamSectionTransform: Incrementing currentPosition to " + currentPosition);
	}
	
	//Return the transform object
	return transform
}

function _justWrite(chunk, encoding, done) {
	this.push(chunk);
	done();
}

//Only allows the data after an offset to come through
function StreamCutTransform(start){
	console.log("StreamCutTransform: waiting for data bit " + start + " to arrive");

	//Create a transform object
	var transform = new Transform();
 
 	var currentPosition = 0;
 	
	//The transform function
	transform._transform = function (chunk, encoding, done) {
		//We only want to "push" the bytes that are in the specified region (start to end)
		if (start < (currentPosition + chunk.length)) {
			console.log("StreamCutTransform: got relevant data!");
			//Okay, so now it gets interesting	 - we are in the relevant region
			//Figure out how much we need to cut off from the start (if anything)
			var startIndex = start - currentPosition;
			if (startIndex <= 0) {
				this.push(chunk);	
			} else {
				this.push(chunk.slice(startIndex));
			}
			
			//Replace transform._transform with faster option
			transform._transform = _justWrite;
		}
		done();
		
		//Add chunk length to the current position
		currentPosition += chunk.length;
		//console.log("StreamCutTransform: Incrementing currentPosition to " + currentPosition);
	}
	
	//Return the transform object
	return transform
}

module.exports.StreamSectionTransform = StreamSectionTransform;
module.exports.StreamCutTransform = StreamCutTransform;