// Create express app
var express = require("express")
var app = express()
var db = require("./database.js")
var cors = require("cors")
var bcrypt = require("bcrypt")

// Server port
var HTTP_PORT = 8000 
// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});

app.use(cors())
app.use(express.json({ limit: '10MB' }));

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

// Get a user based on username (which is unique)
app.get("/api/users/:id", (req, res, next) => {
    var sql = "select * from user where username = ?"
    var params = [req.params.id]
    db.get(sql, params, (err, row) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":row
        })
      });
});




app.post("/api/users", async (req, res, next) => {
    var errors = []

    if (req.body){
        if (!req.body.username){
            errors.push("Username missing !")
        }
        if (!req.body.password){
            errors.push("Password missing !")
        }
    }
    else {
        errors.push("Body is missing !")
    }
    if (errors.length) {
        console.log(req)
        res.status(400).json({
            "message": "Invalid request",
            "error": errors.join(",")
        })
        return
    }
    // hashing password

    var hashedPassword = req.body.password
    try {
        hashedPassword = await bcrypt.hash(hashedPassword, 10)
    }
    catch (err) {
        res.status(500).json({
            "message": "Internal server error",
            "error": err.message
        })
    }

    // insert into database
    var sql = "INSERT INTO user (email, username, password) VALUES (?,?,?)"
    var params = [req.body.email, req.body.username, hashedPassword]
    db.run(sql, params, function(err, result) {
        if (err) {
            res.status(400).json({
                "message": "Error in insert",
                "error": err.message
            })
            return
        }
        res.json({
            "message": "User inserted",
            "data": req.body,
            "id": this.lastID
        })
    })
});


app.post("/api/users/login", async (req, res, next) => {
    var errors = []

    if (req.body){
        if (!req.body.username){
            errors.push("Username missing !")
        }
        if (!req.body.password){
            errors.push("Password missing !")
        }
    }
    else {
        errors.push("Body is missing !")
    }
    if (errors.length) {
        console.log(req)
        res.status(400).json({
            "message": "Invalid request",
            "error": errors.join(",")
        })
        return
    }
    // hashing password

    var sql = "select * from user where username = ?"
    var params = [req.body.username]
    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({
                "message": "Invalid request",
                "error": err.message
            })
            return
        }
        if (!row) {
            res.status(400).json({
                "message": "Invalid request",
                "error": "User not found"
            })
            return
        }
        // compare password
        bcrypt.compare(req.body.password, row.password, (err, result) => {
            if (err) {
                res.status(400).json({
                    "message": "Invalid request",
                    "error": err.message
                })
                return
            }
            if (!result) {
                res.status(400).json({
                    "message": "Invalid request",
                    "error": "Invalid password"
                })
                return

            }
            res.json({
                "message": "Login success",
                "data": row
            })
        })
    })
});




// get a specific user
app.get("/api/users/:id", (req, res, next) => {
    var sql = "select * from user where id = ?"
    var params = [req.params.id]
    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json({
            "message":"success",
            "data":row
        })
    })
});

//get all memes
app.get("/api/memes", (req, res, next) => {
    var sql = "select * from meme order by creation_date desc"
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

// save a meme
app.post("/api/memes", (req,res,next) => {
    sql = "INSERT INTO meme (name, width, height, author, likes, image, creation_date) VALUES (?,?,?,?,?,?,?)"
    params = [req.body.name, req.body.width, req.body.height, req.body.author, req.body.likes, req.body.image, req.body.creation_date]
    db.run(sql, params, function(err, result) {
        if (err) {
            res.status(400).json({
                "message": "Error in insert",
                "error": err.message
            })
            return
        }
        res.json({
            "message": "Meme inserted",
            "data": req.body,
            "id": this.lastID
        })
    })
})


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
