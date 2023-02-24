'use strict';
const express = require('express');
const bodyparser = require('body-parser');
const app = express();
const cors = require('cors');
const mysql = require('mysql');

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


app.post('/api/insert', (req, res) => {

    const test = req.body.test;  
    // const test = 'test';
    const insert = 'INSERT INTO inventory (name, size, medium, prodkey, imgsrc, price) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(insert, [test, test, test, test, test, 5400], (err, result) => {
        if (err) {console.log(err)}
        console.log(result);
        // res.send(insert);
    })
})
 

app.listen(3001, () => {
    console.log('running on port 3001')
    db.connect( function (err){
        if(err) throw err;
        console.log('database connected')
    })
})

    // "devStart": "nodemon index.js", 
    // "start": "CHOKIDAR_USEPOLLING=true react-scripts start",   <--for react on package.json

