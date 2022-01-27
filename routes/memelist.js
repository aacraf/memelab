

var express = require("express")
var router = express.Router();
var Memelist = require("../models/memelist")
var db = require("../database.js")

router.get("/", (req, res, next) => {
    let query_params = req.query;
    Memelist.getAll(query_params)
    .then(memelists => {
        res.status(201).send({
        success: true,
        data: memelists
        });
    })
    .catch(err => {
        res.status(400).json({
            "error": err.message
        })
    })
});


// get a specific memelist
router.get("/:id", (req, res, next) => {
    Memelist.get(req.params.id)
    .then(memelist => {
        res.status(201).send({
        success: true,
        data: memelist
        });
    })
    .catch(err => {
        res.status(400).json({
            "error": err.message
        })
    }
    )
});

// check if a meme is in a memelist
router.post("/:id/get_meme", (req, res, next) => {
    Memelist.checkMeme(req.params.id, req.body.meme_id)
    .then(memelist => {
        res.status(201).send({
            success: true,
            data: memelist
        });
    })
    .catch(err => {
        res.status(400).json({
            "error": err.message
        })
    })
})


// get memes from a memelist
router.get("/:id/memes", (req, res, next) => {
    Memelist.getMemes(req.params.id)
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


// post a memelist
router.post("/", (req,res,next) => {
    Memelist.create(req.body.name, req.body.author)
   .then(memelist => {
        res.status(201).send({
            success: true,
            data: "memelist inserted"
        });
    })
    .catch(err => {
        res.status(400).json({
            "error": err.message
        })
    })
})

// delete a memelist
router.delete("/:id", (req,res,next) => {
    Memelist.deleteMemelist(req.params.id)
    .then(memelist => {
        res.status(201).send({
            success: true,
            data: "memelist deleted"
        });
    })
    .catch(err => {
        res.status(400).json({
            "error": err.message
        })
    })
})


// add a meme to a memelist
router.post("/:id/add", (req, res, next) => {
    Memelist.addMeme(req.body.meme_id, req.params.id)
    .then(memelist => {
        res.status(201).send({
            success: true,
            data: "meme added to memelist"
        });
    })
    .catch(err => {
        res.status(400).json({
            "error": err.message
        })
    })
})

// delete a meme from a memelist
router.post("/:id/delete", (req, res, next) => {
    Memelist.deleteMeme(req.body.meme_id, req.params.id)
    .then(memelist => {
        res.status(201).send({
            success: true,
            data: "meme deleted from memelist"
        });
    })
    .catch(err => {
        res.status(400).json({
            "error": err.message
        })
    })
})

module.exports = router;
