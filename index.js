const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const app = express()
app.use(bodyParser.json())
app.use(cors())
const port = process.env.PORT || 5000;
const dbUser = process.env.DB_USER;
const password = process.env.DB_PASS;
const uri = `mongodb+srv://${dbUser}:${password}@cluster0-nrdl2.mongodb.net/test?retryWrites=true&w=majority `;
let client = new MongoClient(uri, { useNewUrlParser: true });

// Find Products
app.get('/products', (req, res) => {
    client = new MongoClient(uri, { useNewUrlParser: true })
    client.connect(err => {
        const collection = client.db("onlineStore").collection("products");
        collection.find().limit(10).toArray((err, documents) => {
            if(err) {
                console.log(err);
                res.status(500).send({massage:err});
            }
            else{
                console.log("Data find successfully.....");
                res.send(documents);
            }
           
        })
        client.close();
    });
})

// Find Single Product
app.get('/product/:key', (req, res) => {
    const key = req.params.key;
    client = new MongoClient(uri, { useNewUrlParser: true })
    client.connect(err => {
        const collection = client.db("onlineStore").collection("products");
        collection.find({key:key}).toArray((err, documents) => {
            if(err) {
                console.log(err);
                res.status(500).send({massage:err});
            }
            else{
                console.log("Data find successfully.....", documents);
                res.send(documents[0]);
            }
           
        })
        client.close();
    });
});

// Find Products by Multiple Keys
app.post('/getProductByKeys', (req, res) => {
    const productKeys = req.body;
    client = new MongoClient(uri, { useNewUrlParser: true })
    client.connect(err => {
        const collection = client.db("onlineStore").collection("products");
        collection.find({ key: { $in: productKeys } }).toArray((err, documents) => {
            if(err) {
                console.log(err);
                res.status(500).send({massage:err});
            }
            else{
                console.log("Data find successfully.....", documents);
                res.send(documents);
            }
           
        })
        client.close();
    });
});

// Post Request
app.post('/addProduct', (req, res) => {
    const product = req.body;
    client = new MongoClient(uri, { useNewUrlParser: true })
    client.connect(err => {
        const collection = client.db("onlineStore").collection("products");
        collection.insert(product, (err, result) => {
            if(err) {
                console.log(err);
                res.status(500).send({massage:err});
            }
            else{
                console.log("Data Inserted Successfully....", result);
                res.send(result.ops[0]);
            }
        })
        client.close();
    });
})

app.post('/orderPlaced', (req, res) => {
    const orderDetails = req.body;
    orderDetails.orderTime = new Date();
    client = new MongoClient(uri, { useNewUrlParser: true })
    client.connect(err => {
        const collection = client.db("onlineStore").collection("orders");
        collection.insertOne(orderDetails, (err, result) => {
            if(err) {
                console.log(err);
                res.status(500).send({massage:err});
            }
            else{
                console.log("Data Inserted Successfully....", result);
                res.send(result.ops[0]);
            }
        })
        client.close();
    });
})
function TimeFormatter(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}

app.listen(port, () => console.log(`listening on port ${port}! Execution Time: ${TimeFormatter(new Date)}`))