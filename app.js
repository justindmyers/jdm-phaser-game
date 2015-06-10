/// <reference path="typings/node/node.d.ts"/>
var express = require('express');
var path = require('path');
var app = express();

//app.use(express.static(path.join(__dirname, 'game')));
app.use('/game', express.static(path.join(__dirname + '/game')));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));

app.use('/', function(req, res, next) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

module.exports = app;