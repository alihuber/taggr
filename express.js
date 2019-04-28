const express = require('express');
const port = 3000;

const app = express();
console.log(__dirname + '/images/');
app.use(express.static(__dirname + '/images/'));
// app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`internal server listening on port ${port}!`));
