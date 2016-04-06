var path = require('path'),
	fs = require("fs"),
	ip = require("ip"),
	formidable = require("formidable"),
	csv = require('csv-parser');

var mongoDbConnection = require('./connection.js');

module.exports = webserver;

function webserver(monitorPort, express, app, server) {

	//webserver config
	app.use('/public', express.static('public'));

	app.get('/', function(req,res){
		fs.readFile(path.join(__dirname, 'public', 'pages', 'index.html'), 'utf8', function(err, text){
	        text = text.replace("SERVERIP", ip.address() + ":" + monitorPort);
	        res.send(text);
	    });
	});

	app.get('/index', function(req,res){
		fs.readFile(path.join(__dirname, 'public', 'pages', 'index.html'), 'utf8', function(err, text){
	        text = text.replace("SERVERIP", ip.address() + ":" + monitorPort);
	        res.send(text);
	    });
	});

	//Room State
	app.get('/roomState', function(req,res){
		fs.readFile(path.join(__dirname, 'public', 'pages', 'roomState.html'), 'utf8', function(err, text){
	        text = text.replace("SERVERIP", ip.address() + ":" + monitorPort);
	        res.send(text);
	    });
	});

	app.get('/roomStateDetail', function(req,res){
		fs.readFile(path.join(__dirname, 'public', 'pages', 'roomStateDetail.html'), 'utf8', function(err, text){
	        text = text.replace("SERVERIP", ip.address() + ":" + monitorPort);
	        res.send(text);
	    });
	});

	app.get('/roomStateDefaultSetting', function(req,res){
		fs.readFile(path.join(__dirname, 'public', 'pages', 'roomStateDefaultSetting.html'), 'utf8', function(err, text){
	        text = text.replace("SERVERIP", ip.address() + ":" + monitorPort);
	        res.send(text);
	    });
	});

	app.get('/roomStateReset', function(req,res){
		fs.readFile(path.join(__dirname, 'public', 'pages', 'roomStateReset.html'), 'utf8', function(err, text){
	        text = text.replace("SERVERIP", ip.address() + ":" + monitorPort);
	        res.send(text);
	    });
	});

	app.get('/launchAndSuspendService', function(req,res){
		fs.readFile(path.join(__dirname, 'public', 'pages', 'launchAndSuspendService.html'), 'utf8', function(err, text){
	        text = text.replace("SERVERIP", ip.address() + ":" + monitorPort);
	        res.send(text);
	    });
	});

	app.get('/roomScene', function(req,res){
		fs.readFile(path.join(__dirname, 'public', 'pages', 'roomScene.html'), 'utf8', function(err, text){
	        text = text.replace("SERVERIP", ip.address() + ":" + monitorPort);
	        res.send(text);
	    });
	});

	app.get('/roomSceneDetail', function(req,res){
		fs.readFile(path.join(__dirname, 'public', 'pages', 'roomSceneDetail.html'), 'utf8', function(err, text){
	        text = text.replace("SERVERIP", ip.address() + ":" + monitorPort);
	        res.send(text);
	    });
	});

	app.get('/roomSceneAssigned', function(req,res){
		fs.readFile(path.join(__dirname, 'public', 'pages', 'roomSceneAssigned.html'), 'utf8', function(err, text){
	        text = text.replace("SERVERIP", ip.address() + ":" + monitorPort);
	        res.send(text);
	    });
	});

	app.get('/alarm', function(req,res){
		fs.readFile(path.join(__dirname, 'public', 'pages', 'alarm.html'), 'utf8', function(err, text){
	        text = text.replace("SERVERIP", ip.address() + ":" + monitorPort);
	        res.send(text);
	    });
	});

	//Courtesy Service
	app.get('/configureCourtesyService', function(req,res){
		fs.readFile(path.join(__dirname, 'public', 'pages', 'configureCourtesyService.html'), 'utf8', function(err, text){
	        text = text.replace("SERVERIP", ip.address() + ":" + monitorPort);
	        res.send(text);
	    });
	});


	app.get('/weatherInfo', function(req,res){
		fs.readFile(path.join(__dirname, 'public', 'pages', 'weatherInfo.html'), 'utf8', function(err, text){
	        text = text.replace("SERVERIP", ip.address() + ":" + monitorPort);
	        res.send(text);
	    });
	});
	app.get('/roomTemp', function(req,res){
		fs.readFile(path.join(__dirname, 'public', 'pages', 'roomTemp.html'), 'utf8', function(err, text){
	        text = text.replace("SERVERIP", ip.address() + ":" + monitorPort);
	        res.send(text);
	    });
	});

	app.get('/onlinecheckin', function(req,res){
		fs.readFile(path.join(__dirname, 'public', 'pages', 'onlinecheckin.html'), 'utf8', function(err, text){
	        text = text.replace("SERVERIP", ip.address() + ":" + monitorPort);
	        res.send(text);
	    });
	});
	app.get('/selfcheckin', function(req,res){
		fs.readFile(path.join(__dirname, 'public', 'pages', 'selfcheckin.html'), 'utf8', function(err, text){
	        text = text.replace("SERVERIP", ip.address() + ":" + monitorPort);
	        res.send(text);
	    });
	});

	app.post("/uploadRoomServiceMenu", function (req, res){
	    var form = new formidable.IncomingForm();

	    form.parse(req);

	    form.on("fileBegin", function (name, file){
	    	if (file.name != ''){
		        console.log('fileBegin');
		        file.path = __dirname + "/public/uploads/" + file.name;
		    }
	    });

	    form.on("file", function (name, file){
	    	if (file.name != ''){
		        console.log("Uploaded " + file.name);
		        mongoDbConnection(function(databaseConnection) {
					var csvReader = fs.createReadStream(file.path).pipe(csv());
					var menu = [];
					csvReader.on('data', function(data) {
			        	console.log('row', data);
			        	menu.push({"category" : data.category,
								"subcategory" : data.subcategory,
								"item" : data.item,
								"price" : data.price});
			        });
			        csvReader.on('end', function(data) {
			        	console.log('END Of FILE');
			        	databaseConnection.collection('roomServiceMenu', function(error, collection) {
							collection.insertOne({
								'filename': file.name,
								'menu': menu
							});
						});

			        });
				});
		    }
	    });

	    fs.readFile(path.join(__dirname, 'public', 'pages', 'roomServiceMenu.html'), 'utf8', function(err, text){
	        text = text.replace("SERVERIP", ip.address() + ":" + monitorPort);
	        res.send(text);
	    });
	});

	app.get('/roomServiceMenu', function(req,res){
		fs.readFile(path.join(__dirname, 'public', 'pages', 'roomServiceMenu.html'), 'utf8', function(err, text){
	        text = text.replace("SERVERIP", ip.address() + ":" + monitorPort);
	        res.send(text);
	    });
	});

	app.post("/uploadTeaTimeMenu", function (req, res){
	    var form = new formidable.IncomingForm();

	    form.parse(req);

	    form.on("fileBegin", function (name, file){
	    	if (file.name != ''){
		        console.log('fileBegin');
		        file.path = __dirname + "/public/uploads/" + file.name;
		    }
	    });

	    form.on("file", function (name, file){
	    	if (file.name != ''){
		        console.log("Uploaded " + file.name);
		        mongoDbConnection(function(databaseConnection) {
					var csvReader = fs.createReadStream(file.path).pipe(csv());
					var menu = [];
					csvReader.on('data', function(data) {
			        	console.log('row', data);
			        	menu.push({
								"teaset" : data.teaset,
								"item" : data.item,
								"price" : data.price
							});
			        });
			        csvReader.on('end', function(data) {
			        	console.log('END Of FILE');
			        	databaseConnection.collection('teaTimeMenu', function(error, collection) {
							collection.insertOne({
								'filename': file.name,
								'menu': menu
							});
						});

			        });
				});
		    }
	    });

	    fs.readFile(path.join(__dirname, 'public', 'pages', 'teaTimeMenu.html'), 'utf8', function(err, text){
	        text = text.replace("SERVERIP", ip.address() + ":" + monitorPort);
	        res.send(text);
	    });
	});

	app.get('/teaTimeMenu', function(req,res){
		fs.readFile(path.join(__dirname, 'public', 'pages', 'teaTimeMenu.html'), 'utf8', function(err, text){
	        text = text.replace("SERVERIP", ip.address() + ":" + monitorPort);
	        res.send(text);
	    });
	});

	app.get('/teaTimeOrder', function(req,res){
		fs.readFile(path.join(__dirname, 'public', 'pages', 'teaTimeOrder.html'), 'utf8', function(err, text){
	        text = text.replace("SERVERIP", ip.address() + ":" + monitorPort);
	        res.send(text);
	    });
	});

	app.get('/wakeupCall', function(req,res){
		fs.readFile(path.join(__dirname, 'public', 'pages', 'wakeupCall.html'), 'utf8', function(err, text){
	        text = text.replace("SERVERIP", ip.address() + ":" + monitorPort);
	        res.send(text);
	    });
	});

	app.get('/selfcheckout', function(req,res){
		fs.readFile(path.join(__dirname, 'public', 'pages', 'selfCheckout.html'), 'utf8', function(err, text){
	        text = text.replace("SERVERIP", ip.address() + ":" + monitorPort);
	        res.send(text);
	    });
	});
};
