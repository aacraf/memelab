// Model MEME
var db = require("../database.js")

// get all memes
exports.getAll = () => {
    return new Promise((resolve, reject) => {
    var sql = "select * from meme order by creation_date desc"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
            reject(new Error(`Ha ocurrido un error`));
        }
        else {
            resolve(JSON.parse(JSON.stringify(rows)));
        }
    });
  });
}

// create a new meme
exports.create = (meme) => {
    return new Promise((resolve, reject) => {
        var sql = "INSERT INTO meme (name, width, height, author, likes, image, creation_date) VALUES (?,?,?,?,?,?,?)"
        var params = [meme.name, meme.width, meme.height, meme.author, meme.likes, meme.image, meme.creation_date]
        db.run(sql, params, function(err, result) {
            if (err) {
                reject(new Error(`Ha ocurrido un error`));
            }
            else {
                resolve(true);
            }
        });
    });   
}


// check if a user liked a post 
exports.checkLike = (meme_id, user_id) => {
    return new Promise((resolve, reject) => {
        sql = "SELECT * FROM memelist WHERE name = ? AND author = ?";
        params = ['liked memes', user_id];
        db.get(sql, params, (err, row) => {
            console.log(meme_id, user_id)
            console.log("row", row)
            if (err) {
                reject(new Error(`Ha ocurrido un error ${err}`));
                return;
            }
            if (row) {
                memelist_id = row.id
                sql = "SELECT * FROM meme_memelist WHERE meme_id = ? AND memelist_id = ?"
                params = [meme_id, memelist_id];
                db.get(sql, params, (err, row) => {
                    if (err) {
                        reject(new Error(`Ha ocurrido un error ${err}`));
                        return;
                    }
                    if (!row)
                    {
                        return resolve(false);
                    }
                    else{
                        return resolve(true);
                    }
                 })
            }
        })
    });
}

// like a meme
exports.likeMeme = (meme_id, user_id) => {
    return new Promise((resolve, reject) => {
        let memelist_id;
        sql = "SELECT * FROM memelist WHERE name = ? AND author = ?"
        params = ['liked memes', user_id];
        db.get(sql, params, (err, row) => {
            if (err) {
                reject({"error":err.message});
                return;
            }
            if (row) {
                memelist_id = row.id
                sql = "SELECT * FROM meme_memelist WHERE meme_id = ? AND memelist_id = ?"
                params = [meme_id, memelist_id]
                db.get(sql, params, (err, row) => {
                    if (err) {
                        reject({"error":err.message});
                        return;
                    }
                    if (!row) {
                        sql = "INSERT INTO meme_memelist (meme_id, memelist_id) VALUES (?,?)"
                        params = [meme_id, memelist_id]
                        db.run(sql, params, function(err, result) {
                            if (err) {
                                reject({"error":err.message});
                                return;
                            }
                        })
                        sql = "UPDATE meme SET likes = likes + 1 WHERE id = ?"
                        params = [meme_id]
                        db.run(sql, params, function(err, result) {
                            if (err) {
                                reject({"error":err.message});
                                return;
                            }
                            resolve(true);
                        })
                    }
                    else {
                        sql = "DELETE FROM meme_memelist WHERE meme_id = ? AND memelist_id = ?"
                        params = [meme_id, memelist_id]
                        db.run(sql, params, function(err, result) {
                            if (err) {
                                reject({"error":err.message});
                                return;
                            }
                        })
                        sql = "UPDATE meme SET likes = likes - 1 WHERE id = ?"
                        params = [meme_id]
                        db.run(sql, params, function(err, result) {
                            if (err) {
                                reject({"error":err.message});
                                return;
                            }
                            resolve(false);
                        })
                    }
                })
            }
        })
    });
}


// delete a Meme 

exports.deleteMeme = (meme_id) => {
    return new Promise((resolve, reject) => {
        sql = "DELETE FROM meme WHERE id = ?"
        params = [meme_id]
        db.run(sql, params, function(err, result) {
            if (err) {
                reject({"error":err.message});
                return;
            }
            resolve(true);
        })
    });
}
