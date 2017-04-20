const PORT = process.env.port || 8080;
const http = require("http");
const express = require("express");
const app = express();
const server = http.createServer(app);
const io = require("socket.io").listen(server);
const fs = require("fs");
const _ = require("underscore");
const moment = require("moment");

server.listen(PORT,function(){
	console.log("server start at port "+PORT);
});
app.use(express.static('public'));

app.get('/jadwal-salat/:kota/:tanggal', function (req, res) {
    console.log("Homepage");
    res.json(req.params);
});