require('dotenv').config();
const express = require('express');
const bodyparser = require('body-parser');
const app = express();
const cors = require('cors');
const mysql = require('mysql2');
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const host = process.env.DB_HOST;
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const database = process.env.DB_NAME;

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

// const users = [];

// app.get('/login', (req, res) => {
//     res.json(users)
// })

///auth with table
app.post('/login', async (req, res) => {
    const email = req.body.email;
    // console.log(email)
    const password = req.body.password;
    // console.log(password)

    // const hashedPassword = await bcrypt.hash(req.body.password, 10)
    // console.log(hashedPassword)

    db.query('SELECT * FROM admin WHERE email = ?', [email], async (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).send('Internal server error');
        }
        
        // Check if the user exists
        if (results.length === 0) {
            //   alert('Invalid email or password');
            return res.status(401).send('Invalid email or password');
          }
      
          // Check if the password matches
          const user = results[0];
            const isMatch = await bcrypt.compare(password, user.password);
          if (password !== user.password) {
                console.log('Invalid email or password')
              return res.status(401).send('Invalid email or password'); 
            }
            else {
                // Generate a JWT token and sign it with a secret key
                const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET);
                
                // Return the token in the response
                res.send({ token });      

            }
    })

});



// Login route
// app.post('/users', async (request, response) => {
//     try {
//         // const salt = await bcrypt.genSalt()
//         const hashedPassword = await bcrypt.hash(request.body.password, 10)
//         // console.log(salt)
//         // console.log(hashedPassword)
        
//         const user = {email: request.body.email, password: hashedPassword}
//         users.push(user);
//         response.status(201).send()
//     } catch (error) {
//         response.status(500).send();
//     }
    
    
//     // const email = request.body.email;
//     // const psw = request.body.password;    

//     // console.log(email, psw);
// //////

//     // // Generate a JWT
//     // const token = jwt.sign({ email: email }, 'secret_key');

//     // // Verify a JWT
//     // try {
//     // const decoded = jwt.verify(token, 'secret_key');
//     // console.log(decoded.email);

//     // res.json({message: 'Welcome', token: token})
//     // } catch (err) {
//     // console.error(err);
//     // }

// })

// app.post('/users/login', async (request, response) => {
//     const user = users.find(user => user.email === request.body.name);

// });



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
    const author = skipDynObj[0].author.name;  

    const stripeInvData = skipDynObj[0].stripeInvData;  

    const stripeInvDataForMysql = stripeInvData.type;

    async function createProductAndPrice() {
    const newProduct = await stripe.products.create({
            name: name,
            description: 'Your selected artwork is: ' + name + ', by ' + author,
            type: 'good',
            images: [image],
            metadata: {
                prodkey: prodkey
            },
        })


        const newPrice = await stripe.prices.create({
            product: newProduct.id,
            unit_amount: price * 100,
            currency: 'usd',
        })

        const stripeProducts = await stripe.products.list();
        console.log(stripeProducts)

    }
    
    const insert = 'INSERT INTO inventory (name, size, medium, price, imgsrc, prodkey, invtype, author) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(insert, [name, size, medium, price, image, prodkey, stripeInvDataForMysql, author], (err, result) => {
        if (err) {
            console.log(err)
            return false
        } else {
            console.log(result);
            createProductAndPrice();
        }
    })
});

app.get('/getRows', (request, response) => {
    const select = 'SELECT * FROM inventory';
    db.query(select, (err, resu) => {
        if (err) {console.log(err)}
        // console.log(resu);
        response.json(resu);

    })
})


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
    const author = reference.author;

    console.log(stripeInvData)

    async function updateProdAndPrice() {
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
    }
       
    const edit = `UPDATE inventory SET name = ?, size = ?, medium = ?, price = ?, prodkey = ?, invtype = ?, author = ?  WHERE prodkey = ?`
    db.query(edit, [name, size, medium, price, prodkey, stripeInvData, author, prodkey], (err, resu) => {
        if (err) {
            console.log(err)
        } else {
            console.log(resu);
            updateProdAndPrice();
        }
    })

})

///NEED TO ADD DELETE QUERY FOR STRIPE API
app.post('/deleteRow', (requ, respo) => {

    const prodkey = Object.keys(requ.body)[0]
    console.log(prodkey)

    const deleteRow = `DELETE FROM inventory WHERE prodkey = ?`;
    db.query(deleteRow, [prodkey], (err, respo) => {
        if (err) {
            console.log(err)
        } else {
            console.log(respo);
            deleteProdAndPrice();
        }    
    })

    async function deleteProdAndPrice() {
        let productId = '';
    
        await stripe.products.list()
        .then(item => {
            const productToDelete = item.data.find(prod => prod.metadata.prodkey === prodkey)
            console.log(productToDelete);
            productId = productToDelete.id;
            console.log(productId);
        
        })
        .catch(error => console.log(error))


        stripe.prices.list()
        .then(curIt => {
            const priceToDeactivate = curIt.data.find(price => price.product === productId)
            console.log(priceToDeactivate)

            stripe.prices.update(
                priceToDeactivate.id,
                // console.log(priceToDeactivate.id),
                {
                    active: false
                }
            )
        })
        .then(stripe.products.update(productId, {active: false}))
        .catch(error => console.log(error))
    }

})

app.get('/getBalance', async (request, response) => {

    const charges = await stripe.charges.list({
        // limit: 20,
      })
    // .then(console.log(response.data))

    response.json(charges)
})


const port = 3003;

app.listen(port, () => {
    console.log('running on port ' + port)
    db.connect( function (err){
        if(err) throw err;
        console.log('database connected')
    })
})