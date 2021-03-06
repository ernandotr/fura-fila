"use strict";
let express = require('express');
// let consign = require('consign');
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

app.use(function(req, res, next){
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT,DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'content-type, Authorization');
	next();
});

app.use(function(req, res, next){
	req.io = io;
	next();
});

app.use(expressValidator());

//isso substitui o consign por enquanto
app.app ={
   db:require("./db_config"),
   domain:{
     comanda:require("../app/domain/comanda"),
     estabelecimentos:require("../app/domain/estabelecimentos"),
     home:require("../app/domain/home"),
     mesas:require("../app/domain/mesas"),
     produtos:require("../app/domain/produtos"),
     usuarios:require("../app/domain/usuarios"),
   }
};

let comanda = require("../app/routes/comanda")(app);
let pedido = require("../app/routes/pedido")(app);
let estabelecimentos = require("../app/routes/estabelecimetos")(app);
let home = require("../app/routes/home")(app);
let mesas = require("../app/routes/mesa")(app);
let produtos = require("../app/routes/produtos")(app);
let usuarios = require("../app/routes/usuarios")(app);

app.use(comanda);
app.use(pedido);
app.use(estabelecimentos);
app.use(home);
app.use(mesas);
app.use(produtos);
app.use(usuarios);

// consign()
// //.include('config/db_config.js')
// // .then('app/controllers')
// // .then('app/models')
// // .then('app/domain')
// .then('app/routes')
// .into(app);

module.exports = server;

