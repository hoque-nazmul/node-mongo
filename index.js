const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => res.send('App is Opening....'))

app.listen(port, () => console.log(`listening on port ${port}!`))