var http = require("http");
var fs = require("fs");

var server = http.createServer();

// server.on("request", (req, res) => {

// });


server.get('/getSanPham', function (req,res) {
    var data = fs.readFileSync("./du_lieu/san_pham.json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('content-type', 'application/json');
	console.log(data);
    res.end(data);
 });


 

server.listen(process.env.PORT || 5000) ;