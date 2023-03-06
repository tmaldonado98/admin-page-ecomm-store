// 'use strict';
// import Stripe from 'stripe';
require('dotenv').config();
const express = require('express');
const bodyparser = require('body-parser');
const app = express();
const cors = require('cors');
const mysql = require('mysql2');
const multer = require('multer');
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);

// console.log(process.env.STRIPE_PRIVATE_KEY);
const host = process.env.DB_HOST;
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const database = process.env.DB_NAME;
// console.log(process.env.DB_HOST);
// console.log(process.env.DB_USER);
// console.log(database);

const db = mysql.createConnection({
    host: host,
    user: user,
    password: password,
    database: database,
    port: '3306'
})
// console.log(process.env)
app.use(cors());
app.use(express.json());
app.use(bodyparser.urlencoded({extended: true}))

// const upload =  multer({storage: multer.memoryStorage()});   upload.single("img"),

let productsWPrices = {}

// async
app.post('/api/insert', async (req, res) => {

    const reference = req.body;
    const skipDynObj = Object.values(reference)
    // console.log(reference);
    // console.log(skipDynObj)
    const name = skipDynObj[0].name; 
    const size = skipDynObj[0].size;  
    const image = skipDynObj[0].image;

    const medium = skipDynObj[0].medium;  
    const price = skipDynObj[0].price;  
    const prodkey = skipDynObj[0].prodkey;  

    const stripeInvData = skipDynObj[0].stripeInvData;  

    const stripeInvDataForMysql = stripeInvData.type;

    async function createProductAndPrice() {
    const newProduct = await stripe.products.create({
            name: name,
            description: 'The product key you provided is: ' + prodkey,
            type: 'good',
            images: [image],
            metadata: {
                prodkey: prodkey
            },
            // default_price_data: {
            //     currency: 'usd',
            //     unit_amount: price * 100
            // },
        })

        // let dynamicObj = newProduct.metadata.prodkey;
        // productsWPrices[newProduct.id]
        
        // const nProdName = newProduct.name;
        // const nProdId = newProduct.id;
        // console.log(newProduct.name)

        const newPrice = await stripe.prices.create({
            product: newProduct.id,
            unit_amount: price * 100,
            currency: 'usd',
        })

        const stripeProducts = await stripe.products.list();
        console.log(stripeProducts)
        // .then(productsWPrices[dynamicObj][nProdName, nProdId])
        // then(products)
        // .then(console.log(productsWPrices))
        // .then(productsWPrices.nProdName.nPr`odId)
        // .then(console.log(productsWPrices))`
    }

    const insert = 'INSERT INTO inventory (name, size, medium, price, imgsrc, prodkey, invtype) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(insert, [name, size, medium, price, image, prodkey, stripeInvDataForMysql], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            console.log(result);
            createProductAndPrice();
        }
    })


 


    // .then(
    //     stripe.skus.create({
    //         // name: name,
    //         product: newProduct.id,
    //         price: price * 100,
    //         currency: 'usd',    
    //         inventory: stripeInvData,
    //         attributes: {
    //             size: size,
    //             medium: medium,
    //             Database_key: prodkey,
    //         }
    //     }), newSku.id
    // )
    // .then(console.log(newProduct.id))
    // .catch (error => console.error(error + ' stripe error')) 

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
        // console.log(resu);
        response.json(resu);

    })
})


////NEED TO ADD UPDATE QUERY FOR STRIPE API
app.post('/edit', async (req, response) => {
    
    const reference = req.body;

    const name = reference.name; 
    const size = reference.size;  
    const image = reference.image;

    const medium = reference.medium;  
    const price = Number(reference.price); 
    // console.log(price) 
    const prodkey = reference.prodkey.toString();  

    const stripeInvData = reference.invtype;  

    console.log(stripeInvData)
       
    const edit = `UPDATE inventory SET name = ?, size = ?, medium = ?, price = ?, prodkey = ?, invtype = ?  WHERE prodkey = ?`
    db.query(edit, [name, size, medium, price, prodkey, stripeInvData, prodkey], (err, resu) => {
        if (err) {console.log(err)}
        console.log(resu);
    })

    ///UPDATE PRODUCT + PRICE TO REFLECT ADMIN TABLE EDIT

    let productId = '';

    await stripe.products.list()
    .then(item => {
        const productToUpd = item.data.find(prod => prod.metadata.prodkey === prodkey)
        productId = productToUpd.id;
        console.log(productId);

        if (productToUpd) {
                const updateProd = stripe.products.update(
                productToUpd.id,
                    {
                        name: name,
                        description: 'The product key you provided is: ' + prodkey,
                        // default_price_data: {currency: 'usd', unit_amount: price * 100},
                        metadata: {prodkey: prodkey},
                    }
                )
            console.log(updateProd)
        }
    
    })
    .catch(error => console.log(error))


    stripe.prices.create({
        unit_amount: price * 100,
        currency: 'usd',
        product: productId,
        active: true
    })

    stripe.prices.list()
    .then(curIt => {
        // console.log(curIt);
        const priceToUpd = curIt.data.find(price => price.product === productId)
        console.log(priceToUpd);
    
        // const price = stripe.prices.retrieve(
        //     priceToUpd.id
           
        //   )
        

        // if (priceToUpd) {
                const updatePrice = stripe.prices.update(
                    priceToUpd.id,
                    {
                        active: false
                    }
                )
            // console.log(updatePrice)
        // }
    
    })

    .catch(error => console.log(error))



    // const priceToUpd = stripe.prices.find(item => item.metadata.prodkey === prodkey)
    // console.log(priceToUpd);
    // const updatePrice = await stripe.prices.update(
    //     priceToUpd.id,
    //     {unit_amount: price * 100}
    //   );
    // console.log(updatePrice)

})
// stripe.products.list()
// stripe.prices.list()

// stripe.prices.list().then(result => console.log(resul    t));

///NEED TO ADD DELETE QUERY FOR STRIPE API
app.post('/deleteRow', (requ, respo) => {

    const prodkey = Object.keys(requ.body)
    // console.log(prodkey)

    const deleteRow = `DELETE FROM inventory WHERE prodkey = ?`;
    db.query(deleteRow, [prodkey], (err, respo) => {
        if (err) {console.log(err)}
        console.log(respo);
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



