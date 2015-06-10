/// <reference path="typings/node/node.d.ts"/>
var express = require('express');
var path = require('path');
var app = express();

app.use('/public', express.static(path.join(__dirname + '/public')));
app.use('/src', express.static(path.join(__dirname + '/src')));
app.use('/assets', express.static(path.join(__dirname + '/public/assets')));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));

app.use('/', function(req, res, next) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

module.exports = app;