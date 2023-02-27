'use strict';
const express = require('express');
const bodyparser = require('body-parser');
const app = express();
const cors = require('cors');
const mysql = require('mysql2');
const multer = require('multer');

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

const upload =  multer({storage: multer.memoryStorage()}); 

app.post('/api/insert', upload.single("img"), (req, res) => {

    const reference = req.body;
    const skipDynObj = Object.values(reference)
    const name = skipDynObj[0].name; 
    const size = skipDynObj[0].size;  
    const blob = skipDynObj[0].blob;
    // console.log(blob);
    const medium = skipDynObj[0].medium;  
    const price = skipDynObj[0].price;  
    const prodkey = skipDynObj[0].prodkey;  

    // console.log(blob);
    const insert = 'INSERT INTO inventory (name, size, medium, price, imgsrc, prodkey) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(insert, [name, size, medium, price, blob, prodkey], (err, result) => {
        if (err) {console.log(err)}
        console.log(result);

    })
    
});


app.get('/getRows', (request, response) => {

    // const rows = req.body;


    const select = 'SELECT * FROM inventory';
    db.query(select, (err, resu) => {
        if (err) {console.log(err)}
        console.log(resu);
        response.json(resu);

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

