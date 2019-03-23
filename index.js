const express = require('express');
const app = express();

require('dotenv').config();

const fs = require('fs');
const json_obj = JSON.parse(fs.readFileSync('./jsons/cats.json','utf8'));
console.log(json_obj[0].time);
app.get('/', (req, res) => {

    res.send("hello world");
});

app.listen(process.env.APP_PORT);
