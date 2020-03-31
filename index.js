const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.json())
app.use(cors())
const port = 3000

const users = [
    {id: '1', name: "Nazmul Hoque", age : 25, salary : 15000},
    {id: '2', name: "Anayet Ullah", age : 24, salary : 10000},
    {id: '3', name: "Towhid Ahmed", age : 27, salary : 20000}
]

const usernames = ["Towhid", "Khalik", "Jhankar", "Mukta", "Anayet", "Nazmul"]

app.get('/', (req, res) => {
    res.send('App is editing....')
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
app.post('/addUser', (req, res) => {
    const user = req.body;
    res.send(user);
    // console.log(req.body);
    // res.send('POST request to the homepage')
})

app.listen(port, () => console.log(`listening on port ${port}!`))