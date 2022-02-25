var express = require("express")
var router = express.Router();
var User = require("../models/user")

// Get all users 
router.get("/", (req, res, next) => {
   try {
       User.getAll()
       .then(users => {
            res.status(201).send({
            success: 'true',
            message: users
            });
         })
   }
   catch(err) {
       res.status(400).json({
           "error": err.message
       })
   }
});

// get a specific user with username (which is unique)
router.get("/:id", (req, res, next) => {
    try {
        User.get(req.params.id)
        .then(user => {
            res.status(201).send({
            success: 'true',
            message: user
            });
        })
    }
    catch(err) {
        res.status(400).json({
            "error": err.message
        })
    }
});





router.post("/", async (req, res, next) => {
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

    User.create(req.body.username, req.body.password, req.body.email)
    .then(user => {
        console.log("User", user)
        res.status(201).send({
            success: true,
            message: user
        });
    })
    .catch(err => {
        res.status(400).json({
            "error": err.message
        })
    })
});



router.post("/login", async (req, res, next) => {
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
    User.auth(req.body.username, req.body.password)
    .then(user => {
        res.status(201).send({
            success: true,
            message: user
        });
    }
    )
    .catch(err => {
        res.status(400).json({
            "error": err.message
        })
        }
    )
});





module.exports = router;