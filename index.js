'use strict';

const express = require('express');
const app = express();

require('dotenv').config();

const fs = require('fs');
const json_obj = JSON.parse(fs.readFileSync('./jsons/cats.json', 'utf8'));
console.log(json_obj[0].time);

const mongoose = require('mongoose');

mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PWD}@${process.env.DB_HOST}:${process.env.DB_PORT}/cats`, {
  useNewUrlParser: true
}).then(() => {
  console.log('Connected successfully.');
}, err => {
  console.log('Connection to db failed: ' + err);
});


/*
const test_middleware = function(req, res, next){
  console.log('ai ai ai');
  next();
}

app.use(test_middleware);*/

app.get('/', (req, res) => {

  res.send("hello world");
});

app.use('/images',require('./routes/images'));

app.listen(process.env.APP_PORT);
