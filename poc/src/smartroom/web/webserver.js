var express = require("express");
var path = require("path");
var fs = require("fs");
var ip = require("ip");
var config = require('./config.json');
var app = express();

app.use('/', express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
  fs.readFile(path.join(__dirname, 'public', 'index.html'), 'utf8', function(
    err, text) {
    text = text.replace("SERVERIP", ip.address() + ":" + config.port.masterController);
    res.send(text);
  });
});

app.get('/tv', function(req, res) {
  fs.readFile(path.join(__dirname, 'public', 'tv.html'), 'utf8', function(
    err, text) {
    text = text.replace("SERVERIP", ip.address() + ":" + config.port.masterController);
    res.send(text);
  });
});

app.get('/light', function(req, res) {
  fs.readFile(path.join(__dirname, 'public', 'light.html'), 'utf8', function(
    err, text) {
    text = text.replace("SERVERIP", ip.address() + ":" + config.port.masterController);
    res.send(text);
  });
});

app.get('/hvac', function(req, res) {
  fs.readFile(path.join(__dirname, 'public', 'hvac.html'), 'utf8', function(
    err, text) {
    text = text.replace("SERVERIP", ip.address() + ":" + config.port.masterController);
    res.send(text);
  });
});

app.get('/curtain', function(req, res) {
  fs.readFile(path.join(__dirname, 'public', 'curtain2.html'), 'utf8', function(
    err, text) {
    text = text.replace("SERVERIP", ip.address() + ":" + config.port.masterController);
    res.send(text);
  });
});

app.get('/door', function(req, res) {
  fs.readFile(path.join(__dirname, 'public', 'door.html'), 'utf8', function(
    err, text) {
    text = text.replace("SERVERIP", ip.address() + ":" + config.port.masterController);
    res.send(text);
  });
});

app.listen(config.port.webserver);
console.log("Web server running at port " + config.port.webserver);
