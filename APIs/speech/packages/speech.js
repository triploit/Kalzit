/*
This function is used to retrieve a voice object (needed for speech synthesis) by a given name.
That is done using speechSynthesis.getVoices() - if this library is not found, there will be an error.

If there is no voice with the requested name, "undefined" is returned.

Essentially, this function is only really there because it allows voices to be represented as strings, which makes it possible to serialize them very easily.
However, that might become a problem if different platforms use different voice names. Another way of representing voices would be preferred.
*/
function getVoiceObject(voiceName){
    const voices = speechSynthesis.getVoices();
	for(var i = 0; i < voices.length; i++){
		if(voices[i].name === voiceName){
			return voices[i];
		}
	}
}

/* @kalzit.for speech_say
Causes text to be spoken using a given voice.
Both the text parameter and the voice parameter are required.

Usually, the voice is obtained using "speechGetVoicesByLanguage", like this:
	
	```kalzit
	$voice = first: speechGetVoicesByLanguage: "en".
	"This will be said" speechSay voice.
	```
	
If you want to speak text that the user wrote, consider these two options:
	1. Ask for the preferred language. This could be done using something like "uiPicker".
	2. Assume that the user writes something in the system language and obtain that using "getSimpleUserLanguage".
*/
this.speech_say = function(text, voice){
	var ssu = new SpeechSynthesisUtterance(text);
	ssu.voice = getVoiceObject(voice) || ssu.voice;
	speechSynthesis.speak(ssu);
	return text;
}

/* @kalzit.for speech_get_voices_by_language
Returns a list of voices (represented by their name as a string) that are able to talk in a given language.
The language can be a string such as "en" or "en-US".

Usage example:
	
	```kalzit
	$voice = first: speechGetVoicesByLanguage: "en".
	```
*/
this.speech_get_voices_by_language = function(language){
    //console.log(language);
    const voices = speechSynthesis.getVoices();
	var list = [];
	for(var i = 0; i < voices.length; i++){
		if(voices[i].lang.startsWith(language)){
			list.push(voices[i].name);
		}
	}
	return list;
}

/* @kalzit.for speech_get_voices
Returns a list of all available voices (represented by their name as a string).
This is probably not useful because there is no way to get any information about a voice (yet?).
So this function might be removed in later versions.

Usage example:
	
	```kalzit
	$allVoices = !speechGetVoices.
	```
*/
this.speech_get_voices = function(){
	var list = [];
	for(var i = 0; i < speechSynthesis.getVoices().length; i++){
		list.push(speechSynthesis.getVoices()[i].name);
	}
	return list;
}

this.speech_cancel = function(){
    speechSynthesis.cancel();
}
