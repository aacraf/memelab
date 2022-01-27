// Create express app
var express = require("express")
var app = express()
var db = require("./database.js")
var cors = require("cors")
var bcrypt = require("bcrypt")
const { query } = require("express")


var HTTP_PORT = 8000 

app.use(cors())
app.use(express.json({ limit: '10MB' }));


// Users 
var users = require("./routes/user.js")
app.use("/api/users", users)

// Memes
var memes = require("./routes/meme.js")
app.use("/api/memes", memes)

// Memelists
var memelists = require("./routes/memelist.js")
app.use("/api/memelists", memelists)

// Server port
// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});


// Root endpoint
app.get("/", (req, res, next) => {
    // res.json({"message":"Ok"})
    res.sendFile(__dirname + "/index.html")
});

app.get("/create", (req, res, next) => {
    // res.json({"message":"Ok"})
    res.sendFile(__dirname + "/create.html")
})

// Default response for any other request
app.use(function(req, res){
    res.status(404);
});
