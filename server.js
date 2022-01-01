// Create express app
var express = require("express")
var app = express()
var db = require("./database.js")
var cors = require("cors")

// Server port
var HTTP_PORT = 8000 
// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});

app.use(cors())
// Root endpoint
app.get("/", (req, res, next) => {
    // res.json({"message":"Ok"})
    res.sendFile(__dirname + "/index.html")
});

app.get("/create", (req, res, next) => {
    // res.json({"message":"Ok"})
    res.sendFile(__dirname + "/create.html")
})

// Insert here other API endpoints



app.get("/api/users", (req, res, next) => {
    var sql = "select * from user"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
      });
});


app.get("/api/memelists", (req, res, next) => {
    var sql = "select * from memelist"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
      });
});

app.get("/api/memes", (req, res, next) => {
    var sql = "select * from meme"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
      });
});

// Default response for any other request
app.use(function(req, res){
    res.status(404);
});
