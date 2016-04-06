socket.on('checkout', function(message) {
	alert("Checkout process is completed");	
});


function checkout_initialize() {
	$("#submit").click(function() {

		var json = {
				luggageservice: $("input[name=luggage]:checked").val(),
				taxiservice: $("input[name=taxi]:checked").val()
			};

		sendSignal("SERVICE", "SELFSERVICE", "CHECKOUT", JSON.stringify(json));

	});
}