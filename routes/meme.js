var express = require("express")
var router = express.Router();
var Meme = require("../models/meme")
var db = require("../database.js")


//get all memes
router.get("/", (req, res, next) => {
    Meme.getAll()
    .then(memes => {
        res.status(201).send({
        success: true,
        data: memes
        });
    })
    .catch(err => {
        res.status(400).json({
            "error": err.message
        })
    })
});
   

// save a meme
router.post("/", (req,res,next) => {
    Meme.create(req.body)
    .then(meme => {
        res.status(201).send({
        success: true,
        data: "meme inserted"
        });
    })
    .catch(err => {
        res.status(400).json({
            "error": err.message
        })
    })
})


// check if a user liked a post
router.post("/:id/liked", (req,res,next) => {
    Meme.checkLike(req.params.id, req.body.user)
    .then(meme => {
        res.status(201).send({
        success: true,
        data: meme
        });
    }
    )
    .catch(err => {
        res.status(400).json({
            "error": err.message
        })
    })
})



// route for like / dislike a post
router.post("/:id/like", (req,res,next) => {
   Meme.likeMeme(req.params.id, req.body.user)
    .then(meme => {
        console.log("Meme", meme)
        if(meme)
        {
            res.status(201).send({
            success: true,
            message: 'meme liked'
            });
        }
        else{
            res.status(201).send({
            success: true,
            message: 'meme disliked'
            });
        }
    })
    .catch(err => {
        res.status(400).json({
            "error": err.message
        })
    }
    )
})


// route for delete a meme

router.delete("/:id", (req,res,next) => {
    Meme.deleteMeme(req.params.id)
    .then(meme => {
        res.status(201).send({
        success: true,
        data: meme
        });
    })
    .catch(err => {
        res.status(400).json({
            "error": err.message
        })
    })
})

module.exports = router;