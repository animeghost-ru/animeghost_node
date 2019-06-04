const expressHbs = require("express-handlebars");
const bodyParser = require("body-parser");
const express = require("express");
const hbs = require("hbs");
const fs = require("fs");
const mysql = require("mysql2")

const app = express();
app.engine("hbs", expressHbs({
    layoutsDir: "views/layouts",
    defaultLayout: "layout",
    extname: "hbs"
}));
app.set("view engine", "hbs");
hbs.registerPartials(__dirname + "/views/partials");

const urlencodedParser = bodyParser.urlencoded({extended: false});


app.use(function (request, response, next) {
    let now = new Date();
    let hour = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();
    let data = `TIME - ${hour}:${minutes}:${seconds} METHOD - ${request.method} URL - ${request.url} AGENT - ${request.get("user-agent")}`;
    console.log(data);
    fs.appendFile("server.log", data + "\n", function (){});
    next();
})

app.use('/static', express.static('public'));

app.get("/", function (request, response) {
    response.render("index.hbs", {
        title: "Animeghost",
        index: "active"
    });
});
app.get("/anime", function (request, response) {
    response.render("anime.hbs", {
        title: "Аниме",
        anime: "active"
    });
});
app.get("/manga", function (request, response) {
    response.render("manga.hbs", {
       title: "manga",
       manga: "active"
    });
})

app.get("/register", urlencodedParser, function (request, response) {
    response.sendFile(__dirname + "/public/register.html");
})
app.post("/register", urlencodedParser, function (request, response) {
    if(!request.body) return response.sendStatus(400);
    console.log(request.body);
    response.send(`${request.body.userName} - ${request.body.userAge}`);
})
app.get("/profile", function (request, response) {
    response.render("registration.hbs");
})
app.get("/profile/:user", function (request, response) {
    response.render("profile.hbs", {
       profile: request.params["user"]
    });
});

app.get("/404", function (request, response) {
    response.status(404).send(`Ресурс не найден`);
});
app.listen(3000);