var eatObjs = [
    {
        type: "eat",
        header: "Seng Cheong Restaurant",
        image1: "img/information/SengCheongRestaurant1.jpg",
        image2: "img/information/SengCheongRestaurant2.jpg",
        image3: "img/information/SengCheongRestaurant3.jpg",
        content: "Seng Cheong Restaurant is a popular Chinese restaurant located at Rua do Cunha Street in Old Taipa Village. It is known for its signature dish: the Crab Congee. It also serves Frog Leg Congee. The fried squid balls were quite good but the fried frog legs were sinfully delicious. <br><br>28 – 30 Rua Do Cunha, Taipa, Macau<br>Tel: (853) 2882 5323<br>Opening Hours: 12pm to 12am (daily)"
    }
];

function loadEat(){
	$('#eatContent').empty();
	for(var i=0; i < eatObjs.length; i++){
		$('#eatContent').append('<table class="table"><tr><td colspan="3">' + eatObjs[i].header + '</td></tr><tr>' + generateImage(eatObjs[i]) + '</tr><tr><td colspan="3"><p>' + eatObjs[i].content + '</p></td></tr></table><br>');
	}
}

function generateImage(infoObjs){
	return '<td><img width="194" height="164" src="' + infoObjs.image1 + '" /></td><td><img width="194" height="164" src="' + infoObjs.image2 + '" /></td><td><img width="194" height="164" src="' + infoObjs.image3 + '"/></td>';
}