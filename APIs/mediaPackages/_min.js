GLang.packageManager.registerPrecompiledPackage(["animation"],[{"string":"animation","kind":"string"},{"special":"=","kind":"special"},{"kind":"parentheses","parentheses":[{"name":"Float","kind":"name"},{"name":"calcitSetType","kind":"name"},{"string":"duration","kind":"string"}]},{"name":"fun","kind":"name"},{"kind":"parentheses","parentheses":[{"name":"MediaController","kind":"name"},{"name":"calcitSetType","kind":"name"},{"string":"\n\t$progress = 0. $progressRef = reference: $progress.\n\t$onEnd = void. $onEndRef = reference: $onEnd.\n\t$onProgress = void. $onProgressRef = reference: $onProgress.\n\t$ended = false. $endedRef = reference: $ended.\n\t\n\t$lastInterrupt = \\1. $lastInterruptRef = reference: $lastInterrupt.\n\t$looper = void. $looperRef = reference: $looper.\n\t\n\t$looped = () fun {\n\t\t$time = do:getCurrentDate.\n\t\tonProgress:progressRef = progress + time - lastInterrupt.\n\t\tlastInterruptRef = time.\n\t\t!ifElse (progress > duration) {\n\t\t\tpause object.\n\t\t\tendedRef = true.\n\t\t\tonProgress:duration.\n\t\t\tdo:onEnd.\n\t\t};{}\n\t}.\n\t\n\t$object = [$getDuration;duration];\n\t[$getProgress;() fun {progress}];\n\t[$setTime;($time) fun {onProgress: progressRef = time}];\n\t[$setOnEnd;($callback) fun {onEndRef = callback}];\n\t[$setOnProgress;($callback) fun {onProgressRef = callback}];\n\t[$play;() fun {\n\t\t`Play the animation`\n\t\t!if ended {\n\t\t\tendedRef = false.\n\t\t\tprogressRef = 0.\n\t\t\tonProgress:0.\n\t\t}.\n\t\t!if (looper eq void) {\n\t\t\tlastInterruptRef = do:getCurrentDate.\n\t\t\tlooperRef = 32 repeatAsync looped\n\t\t}.\n\t}];\n\t[$pause;() fun {\n\t\t`Pause the animation`\n\t\tdo:$exit propOf looper.\n\t\tlooperRef = void.\n\t}]\n","kind":"string"}]}]);GLang.packageManager.registerPrecompiledPackage(["image_get_channel","image_get_red_channel","image_get_green_channel","image_get_blue_channel"],[{"kind":"parentheses","parentheses":[{"name":"deprecated","kind":"name"},{"special":":","kind":"special"},{"string":"The APIs for more complex image handling (more than just displaying) appear to be slow or broken, so they will be removed soon.","kind":"string"}]},{"kind":"name","name":"calcitSetAnnotation"},{"string":"imageGetChannel","kind":"string"},{"special":"=","kind":"special"},{"kind":"parentheses","parentheses":[{"string":"index","kind":"string"},{"special":";","kind":"special"},{"string":"_imageData","kind":"string"}]},{"name":"fun","kind":"name"},{"string":"{{index at x} each x} each _imageData","kind":"string"},{"kind":"dot","dot":1},{"kind":"parentheses","parentheses":[{"name":"deprecated","kind":"name"},{"special":":","kind":"special"},{"string":"The APIs for more complex image handling (more than just displaying) appear to be slow or broken, so they will be removed soon.","kind":"string"}]},{"kind":"name","name":"calcitSetAnnotation"},{"string":"imageGetRedChannel","kind":"string"},{"special":"=","kind":"special"},{"string":"_x","kind":"string"},{"name":"fun","kind":"name"},{"string":"0 imageGetChannel _x","kind":"string"},{"kind":"dot","dot":1},{"kind":"parentheses","parentheses":[{"name":"deprecated","kind":"name"},{"special":":","kind":"special"},{"string":"The APIs for more complex image handling (more than just displaying) appear to be slow or broken, so they will be removed soon.","kind":"string"}]},{"kind":"name","name":"calcitSetAnnotation"},{"string":"imageGetGreenChannel","kind":"string"},{"special":"=","kind":"special"},{"string":"_x","kind":"string"},{"name":"fun","kind":"name"},{"string":"1 imageGetChannel _x","kind":"string"},{"kind":"dot","dot":1},{"kind":"parentheses","parentheses":[{"name":"deprecated","kind":"name"},{"special":":","kind":"special"},{"string":"The APIs for more complex image handling (more than just displaying) appear to be slow or broken, so they will be removed soon.","kind":"string"}]},{"kind":"name","name":"calcitSetAnnotation"},{"string":"imageGetBlueChannel","kind":"string"},{"special":"=","kind":"special"},{"string":"_x","kind":"string"},{"name":"fun","kind":"name"},{"string":"2 imageGetChannel _x","kind":"string"}]);GLang.packageManager.registerPrecompiledPackage(["color_remove_alpha","color_set_alpha","image_remove_alpha","image_set_alpha"],[{"string":"colorRemoveAlpha","kind":"string"},{"special":"=","kind":"special"},{"name":"RgbColor","kind":"name"},{"kind":"dot","dot":1},{"string":"colorSetAlpha","kind":"string"},{"special":"=","kind":"special"},{"kind":"parentheses","parentheses":[{"kind":"parentheses","parentheses":[{"name":"Int","kind":"name"},{"name":"calcitSetType","kind":"name"},{"string":"alpha","kind":"string"}]},{"special":";","kind":"special"},{"kind":"parentheses","parentheses":[{"name":"RgbColor","kind":"name"},{"name":"calcitSetType","kind":"name"},{"string":"_rgbValues","kind":"string"}]}]},{"name":"fun","kind":"name"},{"string":"\n\t_rgbValues;alpha\n","kind":"string"},{"kind":"dot","dot":1},{"kind":"parentheses","parentheses":[{"name":"deprecated","kind":"name"},{"special":":","kind":"special"},{"string":"The APIs for more complex image handling (more than just displaying) appear to be slow or broken, so they will be removed soon.","kind":"string"}]},{"kind":"name","name":"calcitSetAnnotation"},{"string":"imageRemoveAlpha","kind":"string"},{"special":"=","kind":"special"},{"string":"_x","kind":"string"},{"name":"fun","kind":"name"},{"string":"\n\t{{colorRemoveAlpha: x} each x} each x\n","kind":"string"},{"kind":"dot","dot":1},{"kind":"parentheses","parentheses":[{"name":"deprecated","kind":"name"},{"special":":","kind":"special"},{"string":"The APIs for more complex image handling (more than just displaying) appear to be slow or broken, so they will be removed soon.","kind":"string"}]},{"kind":"name","name":"calcitSetAnnotation"},{"string":"imageSetAlpha","kind":"string"},{"special":"=","kind":"special"},{"kind":"parentheses","parentheses":[{"string":"alphaFunction","kind":"string"},{"special":";","kind":"special"},{"string":"_imageData","kind":"string"}]},{"name":"fun","kind":"name"},{"string":"\n\t{{alphaFunction colorSetAlpha x} each  x} each _imageData\n","kind":"string"}]);GLang.packageManager.registerPrecompiledPackage(["kalzit_media_protocol_from_text"],[{"string":"kalzitMediaProtocolFromText","kind":"string"},{"special":"=","kind":"special"},{"kind":"parentheses","parentheses":[{"name":"String","kind":"name"},{"name":"calcitSetType","kind":"name"},{"string":"text","kind":"string"}]},{"name":"fun","kind":"name"},{"string":"\n\t'{\"protocolVersion\":\"1.0.0\", \"kind\":\"text\", \"text\":{\"raw\":' + (objToJson: text) + '}}'\n","kind":"string"}]);GLang.packageManager.registerPrecompiledPackage(["play","pause","mute","increase_volume","decrease_volume","volume","volume_step_size","volume_step_size_ref"],[{"string":"pause","kind":"string"},{"special":"=","kind":"special"},{"string":"_mediaController","kind":"string"},{"name":"fun","kind":"name"},{"string":"do $pause propOf _mediaController","kind":"string"},{"kind":"dot","dot":1},{"string":"play","kind":"string"},{"special":"=","kind":"special"},{"string":"_mediaController","kind":"string"},{"name":"fun","kind":"name"},{"string":"do $play propOf _mediaController","kind":"string"},{"kind":"dot","dot":1},{"name":"nofreeze","kind":"name"},{"kind":"name","name":"calcitSetAnnotation"},{"string":"volumeStepSize","kind":"string"},{"special":"=","kind":"special"},{"num":0.1,"kind":"num"},{"kind":"dot","dot":1},{"string":"volumeStepSizeRef","kind":"string"},{"special":"=","kind":"special"},{"name":"reference","kind":"name"},{"special":":","kind":"special"},{"string":"volumeStepSize","kind":"string"},{"kind":"dot","dot":1},{"string":"volume","kind":"string"},{"special":"=","kind":"special"},{"string":"_volumeController","kind":"string"},{"name":"fun","kind":"name"},{"string":"do $getVolume propOf _volumeController","kind":"string"},{"kind":"dot","dot":1},{"string":"increaseVolume","kind":"string"},{"special":"=","kind":"special"},{"string":"_volumeController","kind":"string"},{"name":"fun","kind":"name"},{"string":"($setVolume of _volumeController): min of 1;(volume of _volumeController) + volumeStepSize","kind":"string"},{"kind":"dot","dot":1},{"string":"decreaseVolume","kind":"string"},{"special":"=","kind":"special"},{"string":"_volumeController","kind":"string"},{"name":"fun","kind":"name"},{"string":"($setVolume of _volumeController): max of 0;(volume of _volumeController) - volumeStepSize","kind":"string"},{"kind":"dot","dot":1},{"string":"mute","kind":"string"},{"special":"=","kind":"special"},{"string":"_volumeController","kind":"string"},{"name":"fun","kind":"name"},{"string":"($setVolume of _volumeController): 0","kind":"string"}]);GLang.packageManager.registerPrecompiledPackage(["replay","replay_from","media_section"],[{"string":"replayFrom","kind":"string"},{"special":"=","kind":"special"},{"kind":"parentheses","parentheses":[{"string":"_mediaController","kind":"string"},{"special":";","kind":"special"},{"string":"timestamp","kind":"string"}]},{"name":"fun","kind":"name"},{"string":"\n\t($setTime of _mediaController): timestamp. play _mediaController\n","kind":"string"},{"kind":"dot","dot":1},{"string":"replay","kind":"string"},{"special":"=","kind":"special"},{"string":"_mediaController","kind":"string"},{"name":"fun","kind":"name"},{"string":"_mediaController replayFrom 0","kind":"string"},{"kind":"dot","dot":1},{"string":"mediaSection","kind":"string"},{"special":"=","kind":"special"},{"kind":"parentheses","parentheses":[{"string":"_mediaController","kind":"string"},{"special":";","kind":"special"},{"string":"_startAndEnd","kind":"string"}]},{"name":"fun","kind":"name"},{"string":"\n\t$onProgress = $onEnd = void.\n\t$onProgressRef = reference: $onProgress.\n\t$onEndRef = reference: $onEnd.\n\t$start = first of _startAndEnd.\n\t$end = second of _startAndEnd.\n\t\n\t$controller =\n\t\t[[$play];[{\n\t\t\t!if(start > do: $getProgress of _mediaController) {\n\t\t\t\t($setTime of _mediaController): start\n\t\t\t}.\n\t\t\tplay _mediaController.\n\t\t}]];\n\t\t[[$pause];[$pause of _mediaController]];\n\t\t[[$getDuration];[end - start]];\n\t\t[[$setTime];[{\n\t\t\t($setTime of _mediaController): x + start.\n\t\t}]];\n\t\t[[$setVolume];[$setVolume of _mediaController]];\n\t\t[[$getVolume];[$getVolume of _mediaController]];\n\t\t[[$setOnEnd];[$callback fun {\n\t\t\tonEndRef = callback\n\t\t}]];\n\t\t[[$setOnProgress];[$callback fun {\n\t\t\tonProgressRef = callback\n\t\t}]];\n\t\t[[$getProgress];[() fun {\n\t\t\t(do: $getProgress of _mediaController) - start\n\t\t}]].\n\t\t\n\t($setOnProgress of _mediaController): ($timestamp ; $_controller) fun {\n\t\t!if (end < timestamp) {\n\t\t\tpause _mediaController.\n\t\t\tonEnd: controller\n\t\t}.\n\t\t(timestamp - start) onProgress controller\n\t}.\n\t\n\tcontroller\n","kind":"string"}])