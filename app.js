
var fs = require("fs");

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json())

app.get('/getSanPham', function (req, res) {
    var data = fs.readFileSync("./du_lieu/san_pham.json");

    res.end(data);
});

app.post('/postUserName', function (req, res) {
    var data = fs.readFileSync("./du_lieu/nguoi_dung.json");

    if (req.body.token == "1234567890")
        res.end(data);
    else {
        res.end("please try another token");
    }
});

app.get('*', function (req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('content-type', 'application/json');
    res.end("Please try again with another source api");
});



app.listen(process.env.PORT || 5000);