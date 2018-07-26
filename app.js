
var fs = require("fs");

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json())
const port = process.env.PORT || 5000;

app.get('/getSanPham', function (req, res) {
    var data = fs.readFileSync("./du_lieu/san_pham.json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.json(data);
});

app.post('/postUserName', function (req, res) {
    var data = fs.readFileSync("./du_lieu/nguoi_dung.json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    if (req.body.token == "1234567890")
        res.json(data);
    else {
        res.end("please try another token");
    }
});

app.post('/postSaveQuoteNotification', (req, res) => {

    var datajson = {
        "id": req.body.id ? req.body.id : guid(),
        "user": req.body.user,
        "status": req.body.status,
        "createdon": req.body.createdon ? req.body.createdon : new Date(),
        "lastUpdate": new Date()

    };
    try {

        fs.readFile('./du_lieu/Quote.json', 'utf8', function readFileCallback(err, data) {
            console.log(data);
            if (err) {
                console.log(err);
            } else {
                if (!data) {
                    var array = [];
                    array.push(datajson);
                    fs.writeFile('./du_lieu/Quote.json', JSON.stringify(array),// obj to string
                        'utf8', callback);
                }
                else {
                    let dataArray = JSON.parse(data);//string to object json
                    var findIndex;
                    var found = dataArray.some((item, index) => { findIndex = index; return item.id == datajson.id; });
                    if (found) {
                        dataArray[findIndex].user = datajson.user;
                        dataArray[findIndex].status = datajson.status;
                    }
                    else {
                        dataArray.push(datajson);
                    }
                    fs.writeFile('./du_lieu/Quote.json', JSON.stringify(dataArray), 'utf8', callback);
                }
            }
        });
        res.json({ success: "true" });
    } catch (error) {
        res.json({ success: "false" });

    }

});

function callback() {
    console.log("go to callback");
}


app.post('/getQuoteNotification', function (req, res) {
    try {
        var userFind = req.body.user;
        console.log("found")

        fs.readFile('./du_lieu/Quote.json', 'utf8', function readFileCallback(err, data) {
            if (err) {
                console.log(err);
            } else {
                if (data) {
                    let dataArray = JSON.parse(data);//string to object json                   
                    var found = dataArray.filter(item => item.user == userFind);
                    if (found) {
                        found.sort(comparefunction);
                        console.log("found")
                        console.log(found)
                        res.json({ success: "true", data: found.slice(0, 4) });
                    }
                }

            }
        });
        // res.json({ success: "true",data:"" });
    } catch (error) {
        res.json({ success: "true", data: "" });
    }
});

//app.get('/getQuoteNotificationPaging/:pagenum', function (req, res) {
// =>> /getQuoteNotificationPaging/1 

// cai nay dung cho truong hop ?pagenum= 
// =>> /getQuoteNotificationPaging?pagenum=1
//dac biet trong asp.net get hay co kieu request nay
app.get('/getQuoteNotificationPaging/:pagenum?', function (req, res) {
    try {
        var pageIndex = req.query.pagenum;

        console.log("co ket noi: " + pageIndex)
       
        fs.readFile('./du_lieu/Quote.json', 'utf8', function readFileCallback(err, data) {
            if (err) {  
                console.log(err);
            } else {
                if (data) {
                    let found = JSON.parse(data);//string to object json  
                    if (found) {
                        console.log(found)
                        found.sort(comparefunction);
                        res.json({ success: "true", data: paginate(found, 10, pageIndex),totalCount:found.length });
                    }
                }

            }
        });
        // res.json({ success: "true",data:"" });
    } catch (error) {
        res.json({ success: "true", data: "" ,totalCount:0});
    }
});



app.get('*', function (req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('content-type', 'application/json');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.end("Please try again with another source api");
});

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

function getCurrentDay() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!

    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    var todayFM = dd + '/' + mm + '/' + yyyy;
    return todayFM;
}

function comparefunction(a, b) {
    if (a.lastUpdate < b.lastUpdate)
        return 1;
    if (a.lastUpdate > b.lastUpdate)
        return -1;
    return 0;
}

function paginate(array, page_size, page_number) {
    --page_number; // because pages logically start with 1, but technically with 0
    return array.slice(page_number * page_size, (page_number + 1) * page_size);
}



app.listen(port);
console.log("app start at port: " + port);