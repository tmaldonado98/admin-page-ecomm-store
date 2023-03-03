'use strict';
// import Stripe from 'stripe';
require('dotenv').config();
const express = require('express');
const bodyparser = require('body-parser');
const app = express();
const cors = require('cors');
const mysql = require('mysql2');
const multer = require('multer');
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);
// const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY);

// console.log(stripe);

// const host = process.env.DB_HOST;
// const user = process.env.DB_USER;
// const password = process.env.DB_PASSWORD;
// const database = process.env.DB_NAME;
// console.log(process.env.DB_HOST);
// console.log(process.env.DB_USER);
// console.log(database);

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'singapore123',
    database: 'veacollections',
    port: '3306'
})
// console.log(process.env)
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


    // const newProduct = await 
    stripe.products.create({
        name: name,
        description: 'The product key you provided is: ' + prodkey,
        type: 'good',
        // images: image,
    })
    .then(
        await stripe.skus.create({
            // name: name,
            product: newProduct.id,
            price: price * 100,
            currency: 'usd',    
            inventory: stripeInvData,
            attributes: {
                size: size,
                medium: medium,
                Database_key: prodkey,
            }
        })
    )
    .then(console.log(newProduct.id, newSku.id))
    .catch (error => console.error(error + ' stripe error')) 

    // const newSku = await 
    // stripe.skus.create({
    //     // name: name,
    //     product: newProduct.id,
    //     price: price * 100,
    //     currency: 'usd',    
    //     inventory: stripeInvData,
    //     attributes: {
    //         size: size,
    //         medium: medium,
    //         Database_key: prodkey,
    //     }

    //     .then(console.log(res.json()))
    //     .then(console.log(newProduct.id, newSku.id))
    //     .catch (error => console.error(error + ' stripe error')) 
    //     // res.status(500).json({ success: false, error });  
    // });
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

app.post('/edit', (req, response) => {

    const reference = req.body;
    // const skipDynObj = Object.values(reference)
    console.log(reference);
    // console.log(skipDynObj)
    const name = reference.name; 
    // const size = skipDynObj[0].size;  
    // const image = skipDynObj[0].image;

    // const medium = skipDynObj[0].medium;  
    // const price = skipDynObj[0].price;  
    const prodkey = reference.prodkey.toString();  

    // const stripeInvData = skipDynObj[0].stripeInvData;  
    // const stripeInvDataForMysql = stripeInvData.type;

    // name, size, medium, price, prodkey, invtype

    // const edit = `UPDATE inventory SET name = ?, size = ?, medium = ?, price = ?, prodkey = ?, invtype = ?  WHERE prodkey = ${prodkey}`
    // db.query(edit, [name, size, medium, price, prodkey, stripeInvDataForMysql], (err, resu) => {
    //     if (err) {console.log(err)}
    //     console.log(resu);
    // })
    const edit = 'UPDATE inventory SET name = ? WHERE prodkey = ?'
    db.query(edit, [name, prodkey], (err, resu) => {
        if (err) {console.log(err)}
        console.log(resu);
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



