const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const { url } = require("inspector");

const app = express();

app.use("/assets", express.static("assets"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/index.html");
})

app.post("/", function(req, res){

    var firstName = req.body.fname;
    var lastName = req.body.lname;
    var email = req.body.email;
    
    var data = {
        members:[
            {
                email_address: email,
                status: "subscribed",
                merge_fields:{
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    var dataJSON = JSON.stringify(data);
    
    var url = "https://us21.api.mailchimp.com/3.0/lists/9938c6314f";

    var options = {
        method: "POST",
        auth: "hello2:d481afcc989abe2f3e031ba4f3fe7378-us21",
    }

    var request = https.request(url, options, function(response){

        if (response.statusCode === 200){
            res.sendFile(__dirname + "/success.html");
        } else{
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    })

    request.write(dataJSON);
    request.end();

});

app.post("/failure", function(req, res){
    res.redirect("/");
})
// d481afcc989abe2f3e031ba4f3fe7378-us21

// 9938c6314f

app.listen(process.env.PORT || 1500);