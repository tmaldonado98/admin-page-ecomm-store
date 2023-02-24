'use strict';
const express = require('express');
const bodyparser = require('body-parser');
const app = express();
const cors = require('cors');
const mysql = require('mysql');
// const multer = require('multer');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'singapore123',
    database: 'veacollections',
    port: '3306'
})

app.use(cors());
app.use(express.json());
app.use(bodyparser.urlencoded({extended: true}))

// const upload =  multer({storage: multer.memoryStorage()}); upload.single("img"),

app.post('/api/insert', (req, res) => {
    const reference = req.body;
    const skipDynObj = Object.values(reference)

    const name = skipDynObj[0].name; 
    // console.log(name);
    const size = skipDynObj[0].size;  
    const medium = skipDynObj[0].medium;  
    const price = skipDynObj[0].price;  
    const blob = skipDynObj[0].blob;  
    const prodkey = skipDynObj[0].prodkey;  

    const insert = 'INSERT INTO inventory (name, size, medium, price, imgsrc, prodkey) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(insert, [name, size, medium, price, blob, prodkey], (err, result) => {
        if (err) {console.log(err)}
        console.log(result);
        // res.send(insert);
    })
})
 
const port = 3003;

app.listen(port, () => {
    console.log('running on port ' + port)
    db.connect( function (err){
        if(err) throw err;
        console.log('database connected')
    })
})

    // "devStart": "nodemon index.js", 
    // "start": "CHOKIDAR_USEPOLLING=true react-scripts start",   <--for react on package.json

