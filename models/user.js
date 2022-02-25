// Model User

var db = require("../database.js")
var express = require("express")
var bcrypt = require("bcrypt")

// get all Users


exports.getAll = () => {
    return new Promise((resolve, reject) => {
    var sql = "select * from user"
    var params = []
    db.all(sql, params, (err, rows) => {
        console.log("rows", rows)
        if (err) {
            reject(new Error(`Ha ocurrido un error`));
        }
        else {
            resolve(JSON.parse(JSON.stringify(rows)));
        }
    });
  });
}


exports.get = id => {
    return new Promise((resolve, reject) => {
    var sql = "select * from user where username = ?"
    var params = [id]
    db.get(sql, params, (err, row) => {
        if (err) {
            reject(new Error(`Ha ocurrido un error ${err}`));
          return;
        }
        if(row){
            resolve(JSON.parse(JSON.stringify(row)));
        }else{
            resolve("No existe el usuario");
        }
      });
  });
}

// create a new user
exports.create = (username, password, email) => {
    return new Promise( async (resolve, reject) => {
        var hashedPassword = password;
        try {
            hashedPassword = await bcrypt.hash(hashedPassword, 10);
        }
        catch (err) {
            reject(new Error(`Ha ocurrido un error`));
        }
        var sql = "INSERT INTO user (username, password, email) VALUES (?, ?, ?)"
        var params = [username, hashedPassword, email]
        db.run(sql, params, function(err, result) {
            if (err) {
                reject(new Error(`Ha ocurrido un error ${err}`));
                return;
            }
            else{
                
                resolve(JSON.parse(JSON.stringify(true)));
            
                // create liked memelist for user
                var sql = "INSERT INTO memelist (name, count, author) VALUES (?,?,?)";
                var params = ["liked memes", 0, username];
                db.run(sql, params, function(err, result) {
                })
            }
        });
  });
}


// authentificate a user

exports.auth = (username, password) => {
    return new Promise((resolve, reject) => {
    var sql = "select * from user where username = ?"
    var params = [username]
    db.get(sql, params, (err, row) => {
        if (err) {
            reject(new Error(`Ha ocurrido un error`));
            return;
        }
        if(row){
            bcrypt.compare(password, row.password, (err, result) => {
                if (err) {
                    reject(new Error(`Ha ocurrido un error`));
                    return;
                }
                if (!result) {
                    reject(new Error(`User not found`));
                    return;
                }
                resolve(JSON.parse(JSON.stringify(row)));
            })
        }else{
            reject(new Error(`Ha ocurrido un error`));
        }
    });
  });
}





