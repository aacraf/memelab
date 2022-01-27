var sqlite3 = require('sqlite3').verbose()
var md5 = require('md5')

const DBSOURCE = "db.sqlite"

// file that connects / creates the database 
let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
        console.log('Connected to the SQLite database.')
        db.run(`
        --
            -- File generated with SQLiteStudio v3.2.1 on ju. ene. 27 07:21:26 2022
            --
            -- Text encoding used: System
            --
            PRAGMA foreign_keys = off;
            BEGIN TRANSACTION;

            --
            -- File generated with SQLiteStudio v3.2.1 on ju. ene. 27 07:21:26 2022
            --
            -- Text encoding used: System
            --

            -- Table: user
            CREATE TABLE user (
                id       INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT    UNIQUE,
                email    TEXT    UNIQUE,
                password TEXT,
                CONSTRAINT email_unique UNIQUE (
                    email
                )
            );
                      
            )`,
        (err) => {
            if (err) {
                // Table already created
            }else{
            }
        });  

        db.run(`
            -- Table: meme
            CREATE TABLE meme (
                id            INTEGER       PRIMARY KEY AUTOINCREMENT,
                name          VARCHAR (120),
                width         NUMERIC,
                height        NUMERIC,
                author        VARCHAR (50)  REFERENCES user (email),
                likes         NUMERIC,
                image         BLOB,
                creation_date DATETIME
            );
        `, 
        (err) => {
            if (err) {
                // Table already created
            } 
        });

        db.run(`        
        -- Table: memelist
        CREATE TABLE memelist (
            id     INTEGER       PRIMARY KEY AUTOINCREMENT,
            name   VARCHAR (100),
            count  NUMERIC,
            author VARCHAR (50)  REFERENCES user (username),
            UNIQUE (
                name,
                author
            )
        );
    `, 
        (err) => {
            if (err) {
                // Table already created
            } 
        });
    }

      db.run(`        
      --
      -- File generated with SQLiteStudio v3.2.1 on ju. ene. 27 07:20:14 2022
      --
      -- Text encoding used: System
      
      -- Table: meme_memelist
      CREATE TABLE meme_memelist (
          id          INTEGER PRIMARY KEY AUTOINCREMENT,
          meme_id     NUMERIC REFERENCES meme (id),
          memelist_id NUMERIC REFERENCES memelist (id),
          UNIQUE (
              meme_id,
              memelist_id
          )
      ); 
    `, 
        (err) => {
            if (err) {
                // Table already created
            } 
        });
});

module.exports = db