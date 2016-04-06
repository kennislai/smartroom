var wheretogoObjs = [
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
    }
];

function loadWhereToGo(){
	$('#wheretogoContent').empty();
	for(var i=0; i < wheretogoObjs.length; i++){
		$('#wheretogoContent').append('<table class="table"><tr><td colspan="3">' + wheretogoObjs[i].header + '</td></tr><tr>' + generateImage(wheretogoObjs[i]) + '</tr><tr><td colspan="3"><p>' + wheretogoObjs[i].content + '</p></td></tr></table><br>');
	}
}

function generateImage(infoObjs){
	return '<td><img width="194" height="164" src="' + infoObjs.image1 + '" /></td><td><img width="194" height="164" src="' + infoObjs.image2 + '" /></td><td><img width="194" height="164" src="' + infoObjs.image3 + '"/></td>';
}