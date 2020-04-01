const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const app = express()
app.use(bodyParser.json())
app.use(cors())
const port = process.env.PORT;
const dbUser = process.env.DB_USER;
const password = process.env.DB_PASS;
const uri = `mongodb+srv://${dbUser}:${password}@cluster0-nrdl2.mongodb.net/test?retryWrites=true&w=majority `;
let client = new MongoClient(uri, { useNewUrlParser: true });

const users = [
    {id: '1', name: "Nazmul Hoque", age : 25, salary : 15000},
    {id: '2', name: "Anayet Ullah", age : 24, salary : 10000},
    {id: '3', name: "Towhid Ahmed", age : 27, salary : 20000}
]

const usernames = ["Towhid", "Khalik", "Jhankar", "Mukta", "Anayet", "Nazmul"]


app.get('/products', (req, res) => {
    client = new MongoClient(uri, { useNewUrlParser: true })
    client.connect(err => {
        const collection = client.db("onlineStore").collection("products");
        collection.find().toArray((err, documents) => {
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
})

app.get('/users', (req, res) => {
    res.send(users);
});

app.get('/users/:id', (req, res) => {
    let id = req.params.id;
    let name = usernames[id];
    res.send({id, name});
});

app.get('/user/:id', (req, res) => {
    let id = req.params.id;
    let user = users.find(user => user.id === id);
    const userID =user.id;
    const userName = user.name;
    res.send({userID, userName});
});

// Post Request
app.post('/addProduct', (req, res) => {
    const product = req.body;
    client = new MongoClient(uri, { useNewUrlParser: true })
    client.connect(err => {
        const collection = client.db("onlineStore").collection("products");
        collection.insertOne(product, (err, result) => {
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