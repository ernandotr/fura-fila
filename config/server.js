"use strict";
let express = require('express');
let consign = require('consign');
let bodyParser = require('body-parser');
let expressValidator = require('express-validator');

let cors = require('cors');
let http = require('http');
let SocketIO = require('socket.io');
var app = express();

let server = http.createServer(app);
let io = SocketIO.listen(server);

let FuraFilaIO = require('../app/socket');
let furafila = new FuraFilaIO(io);

app.use('/static', express.static(__dirname + '/node_modules'));

app.set('view engine', 'ejs');
app.set('views', './app/views');

app.use(express.static('./app/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(cors());

app.use(function(req, res, next){
	req.io = io;
	next();
});

app.use(expressValidator());

consign({
      cwd: process.cwd(),
      locale: 'pt-br',
      logger: console,
      verbose: true,
      extensions: [ '.js', '.json', '.node' ],
      loggingType: 'info'
    })
.include('config/db_config.js')
// .then('app/controllers')
.then('app/models')
.then('app/domain')
.then('app/routes')
.into(app);
console.log(app);

module.exports = server;

