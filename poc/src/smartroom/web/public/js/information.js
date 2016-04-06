var infoCategory = [
	{
		type: "wheretogo",
		header: "Where To Go"
	},
	{
		type: "pointsofinterest",
		header: "Points of Interest"
	},
	{
		type: "eat",
		header: "Eat"
	},
	{
		type: "shop",
		header: "Shop"
	},
	{
		type: "specialevents",
		header: "Special Events"
	},
	{
		type: "specialnews",
		header: "Special News"
	},
	{
		type: "discount",
		header: "Discount"
	}
];

var infoObjs = [
    {
        type: "wheretogo",
        header: "A-Ma Temple",
        image1: "img/information/A-MaTemple1.jpg",
        image2: "img/information/A-MaTemple2.jpg",
        image3: "img/information/A-MaTemple3.jpg",
        content: "A-Ma Temple already existed before the city of Macao came into being. It consists of the Gate Pavilion, the Memorial Arch, the Prayer Hall, the Hall of Benevolence, the Hall of Guanyin, and Zhengjiao Chanlin (a Buddhist pavilion). The variety of pavilions dedicated to the worship of different deities in a single complex make A-Ma Temple an exemplary representation of Chinese culture inspired by Confucianism, Taoism, Buddhism and multiple folk beliefs.<br><br><b>Address:</b> Barra Square<br><b>Opening hours:</b> 7 a.m. - 6 p.m.<br><b>Bus routes nearby:</b>   1, 2, 5, 6B, 7, 10, 10A, 11, 18, 21A, 26, 28B, 55, MT4, N3<br>"
    },

    {
        type: "wheretogo",
        header: "Moorish Barracks",
        image1: "img/information/MoorishBarracks1.jpg",
        image2: "img/information/MoorishBarracks2.jpg",
        image3: "img/information/MoorishBarracks3.jpg",
        content: "Built in 1874, this building was constructed to accommodate an Indian regiment from Goa appointed to reinforce Macao's police force. Now it serves as the headquarters of the Marine and Water Bureau. The Moorish Barracks is a distinctly neo-classical building integrating architectural elements of Moghul influence.<br><br><b>Address:</b> Calçada da Barra<br><b>Opening hours:</b> Verandah: 9 a.m. - 6 p.m.<br><b>Bus routes nearby:</b>  18, 28B<br>"
    },

    {
        type: "wheretogo",
        header: "Lilau Square",
        image1: "img/information/LilauSquare1.jpg",
        image2: "img/information/LilauSquare2.jpg",
        image3: "img/information/LilauSquare3.jpg",
        content: "The ground water of Lilau used to be the main source of natural spring water in Macao. The Portuguese popular phrase: \"One who drinks from Lilau never forgets Macao\" expresses the locals' nostalgic attachment to Lilau Square. This area corresponds to one of the first Portuguese residential quarters in Macao.<br><br><b>Address:</b> Lilau Square<br><b>Bus routes nearby:</b>  18, 28B"
    },

    {
        type: "eat",
        header: "Seng Cheong Restaurant",
        image1: "img/information/SengCheongRestaurant1.jpg",
        image2: "img/information/SengCheongRestaurant2.jpg",
        image3: "img/information/SengCheongRestaurant3.jpg",
        content: "Seng Cheong Restaurant is a popular Chinese restaurant located at Rua do Cunha Street in Old Taipa Village. It is known for its signature dish: the Crab Congee. It also serves Frog Leg Congee. The fried squid balls were quite good but the fried frog legs were sinfully delicious. <br><br>28 – 30 Rua Do Cunha, Taipa, Macau<br>Tel: (853) 2882 5323<br>Opening Hours: 12pm to 12am (daily)"
    }
];

$("#informationCategory").empty();
for (var i=0; i < infoCategory.length; i++){
	$("#informationCategory").append("<button type='button' id='informationCategory" + i + "' onclick='loadInformationMenuByCategory(\"" + infoCategory[i].type + "\");'>" + infoCategory[i].header + "</button> ");
	if (i == 0){
		$("#informationCategory0").click();
	}
}

function loadInformationMenuByCategory(type){
	$('#carouselOl').empty();
	$('#carouselSlide').empty();
	var count = 0;

	for(var i=0; i < infoObjs.length; i++){
		if (infoObjs[i].type == type){
			$('#carouselOl').append('<li id="carouselOl' + count + '" data-target="#myCarousel" data-slide-to="' + count + '"></li>');
			$('#carouselSlide').append('<div id="carouselSlide' + count + '" class="item"><table><tr><td colspan="3">' + infoObjs[i].header + '</td></tr><tr>' + generateImage(infoObjs[i]) + '</tr><tr><td colspan="3"><p>' + infoObjs[i].content + '</p></td></tr></table></div>');

			if (count == 0){
				$("#carouselOl0").addClass("active");
				$("#carouselSlide0").addClass("active");
			}

			count++;
		}
	}
}

function generateImage(infoObjs){
	return '<td><img width="194" height="164" src="' + infoObjs.image1 + '" /></td><td><img width="194" height="164" src="' + infoObjs.image2 + '" /></td><td><img width="194" height="164" src="' + infoObjs.image3 + '"/></td>';
}