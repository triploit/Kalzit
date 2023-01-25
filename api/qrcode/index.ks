$text = $text urlGetParameter $url propOf _request.

!ifElse (text eq void) {
	`Do nothing`
};{
	asyncRef = true.
	
	!qrCodeRawAsync text -> {
		print: "Hey, QR code ready!".
		($startServing propOf _request): "image/jpeg".
		_request httpEndServingRaw x
	}.
}