## comment

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