const cron = require('node-cron');
const mysql = require('nodejs-mysql').default;
const PORT = process.env.port || 8080;
const http = require("http");
const express = require("express");
const app = express();
const server = http.createServer(app);
const io = require("socket.io").listen(server);
const fs = require("fs");
const _ = require("underscore");
const moment = require("moment");
const config = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'jadwal-salat'
}
const db = mysql.getInstance(config)

server.listen(PORT,function(){
	console.log("server start at port "+PORT);
});
app.use(express.static('public'));

app.get('/jadwal-salat/:kota/:tanggal', function (req, res) {
	db.exec('select * from jadwal where kota = ? and tanggal = ?', [req.params.kota, req.params.tanggal]).then(rows => {
        res.json(rows);
    })
    .catch(e => {
        res.json({
        	error:"query exception"
        });
    });
});

io.on('connection', function (socket) {
    console.log("Connected succesfully to the socket ...");

});

cron.schedule('* * * * *', function(){
	var date = new Date();
	var nowTime = date.getHours()+":"+date.getMinutes();
	
	db.exec('select * from jadwal where subuh = ?', [nowTime]).then(rows => {
		console.log("boradcast to all \n");
        io.emit('notifikasi', rows);
    })
    .catch(e => {
        console.log("Kesalahan mengambil data");
    });
});

// function broadcast (socket,options) {
//     socket.broadcast.emit("notifikasi",options);
//     socket.emit("notifikasi",options);
// }