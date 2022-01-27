
// Model MEMELIST
var db = require("../database.js")


// get all memelists (dynamic)
exports.getAll = (query="") => {
    var sql;
    var params;
    return new Promise((resolve, reject) => {
        if (query.author !== undefined)
        {
            sql = "select * from memelist where author = ?"
            params = [query.author]
        }
        else{
            sql = "select * from memelist"
            params = []
        }
        db.all(sql, params, (err, rows) => {
            if (err) {
              reject({"error":err.message});
              return;
            }
            resolve(JSON.parse(JSON.stringify(rows)));
        });
    });
}

// get a specific memelist
exports.get = id => {
    return new Promise((resolve, reject) => {
        var sql = "select * from memelist WHERE id = ?"
        var params = [id]
        db.get(sql, params, (err, row) => {
            if (err) {
                reject({"error":err.message});
                return;
            }
            resolve(JSON.parse(JSON.stringify(row)));
        })
    });
}

// check if a meme is in a memelist
exports.checkMeme = (memelist_id, meme_id) => {
    return new Promise((resolve, reject) => {
        var sql = "SELECT * FROM meme_memelist WHERE meme_id = ? AND memelist_id = ?";
        var params = [meme_id, memelist_id]
        db.get(sql, params, (err, row) => {
            if (err){
                reject({"error":err.message});
                return;
            }
            if (row)
            {
                resolve(true);
            }
            else{
                resolve(false);
            }
        })
    })
}


// get Memes from a memelist
exports.getMemes = (memelist_id) => {
    return new Promise((resolve, reject) => {
        // get list and memes of the list
        var sql = "SELECT meme.id, meme.name, meme.width, meme.height, meme.author, meme.likes, meme.image FROM meme INNER JOIN meme_memelist ON meme.id = meme_memelist.meme_id WHERE meme_memelist.memelist_id = ?"
        var params = [parseInt(memelist_id)]
        db.all(sql, params, (err, rows) => {
            if (err) {
                reject({"error":err.message});
                return;
            }
            resolve(JSON.parse(JSON.stringify(rows)));
        });
    })
}


// create a Memelist

exports.create = (name, author) => {
    return new Promise((resolve, reject) => {
        var sql = "INSERT INTO memelist (name, count, author) VALUES (?,?,?)";
        var params = [name, 0, author];
        db.run(sql, params, function(err, result) {
            if (err) {
                reject({"error":err.message});
                return
            }
            resolve(true);
        })
    })
}


// delete a Memelist
exports.deleteMemelist = id => {
    return new Promise((resolve, reject) => {
        var sql = "DELETE FROM memelist WHERE id = ?"
        var params = [id]
        db.run(sql, params, function(err, result) {
            if (err) {
                reject({"error":err.message});
                return
            }
            resolve(true);
        })
    })
}

// add a meme to a memelist

exports.addMeme = (meme_id, memelist_id) => {
    return new Promise((resolve, reject) => {
        var sql = "INSERT INTO meme_memelist (memelist_id, meme_id) VALUES (?,?)";
        var params = [memelist_id, meme_id];
        db.run(sql, params, function(err, result) {
            if (err) {
                reject({"error":err.message});
                return
            }
            resolve(true);
        })
    })
}


exports.deleteMeme = (meme_id, memelist_id) => {
    return new Promise((resolve, reject) => {
        var sql = "DELETE FROM meme_memelist WHERE meme_id = ? AND memelist_id = ?"
        var params = [meme_id, memelist_id]
        db.run(sql, params, function(err, result) {
            if (err) {
                reject({"error":err.message});
                return
            }
            resolve(true);
        })
    })
}