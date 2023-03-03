'use strict';
require('dotenv').config();
const express = require('express');
const bodyparser = require('body-parser');
const app = express();
const cors = require('cors');
const mysql = require('mysql2');
const multer = require('multer');
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);


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

// const upload =  multer({storage: multer.memoryStorage()});   upload.single("img"),

// async
app.post('/api/insert', async (req, res) => {

    const reference = req.body;
    const skipDynObj = Object.values(reference)
    console.log(reference);
    console.log(skipDynObj)
    const name = skipDynObj[0].name; 
    const size = skipDynObj[0].size;  
    const image = skipDynObj[0].image;

    const medium = skipDynObj[0].medium;  
    const price = skipDynObj[0].price;  
    const prodkey = skipDynObj[0].prodkey;  

    const stripeInvData = skipDynObj[0].stripeInvData;  

    const stripeInvDataForMysql = stripeInvData.type;


    const insert = 'INSERT INTO inventory (name, size, medium, price, imgsrc, prodkey, invtype) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(insert, [name, size, medium, price, image, prodkey, stripeInvDataForMysql], (err, result) => {
        if (err) {console.log(err)}
        console.log(result);
    })

    // stripe.skus.create({
    //     // name: name,
    //     size: size,
    //     price: price,
    //     medium: medium,
    //     key: prodkey,
    //     product: name + ', key: ' + prodkey,
    //     currency: 'usd',    
    //     stripeInvData: stripeInvData,

    //     // .then(console.log(res.json()))
    //     // .then(console.log(product))
    //     // .catch (error => console.error(error + ' stripe error')) 
    //     // res.status(500).json({ success: false, error });  
    // })
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



