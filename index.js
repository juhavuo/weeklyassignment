const express = require('express');
const app = express();

require('dotenv').config();

const fs = require('fs');
const json_obj = JSON.parse(fs.readFileSync('./jsons/cats.json', 'utf8'));
console.log(json_obj[0].time);

const multer = require('multer');

const sharp = require('sharp');

const path = require('path');

const ExifImage = require('exif').ExifImage;


//https://stackoverflow.com/questions/32184589/renaming-an-uploaded-file-using-multer-doesnt-work-express-js
let storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads')
  },
  filename: function(req, file, cb) {
    let extArray = file.mimetype.split("/");
    let extension = extArray[1];
    cb(null, file.originalname);
  }
});

const upload = multer({
  storage: storage
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



app.post('/upload_photo', upload.fields([{name:'category'},{name:'title'},{name:'details'},{name:'image'}]), (req, res, next) => {

  let latitude = "NAN";
  let longitude = "NAN";
  let date_taken = "NAN";

  let return_json = "";

  console.log(req.files.image[0].filename);

  const small_file_name = 'small' + req.files.image[0].filename;
  const medium_file_name = 'medium' + req.files.image[0].filename;
  const imagePath = path.join('.\\uploads\\', req.files.image[0].filename);
  const outputPath = path.join('.\\uploads\\', small_file_name);
  const outputPathMedium = path.join('.\\uploads\\', medium_file_name);
  console.log(imagePath);

  //small image
  sharp(imagePath)
    .resize(200)
    .toFile(outputPath)
    .then(data => {
      console.log(data);
    }).catch(err => {
      console.log(err);
    });

  //medium sized image
  sharp(imagePath)
    .resize(600)
    .toFile(outputPathMedium)
    .then(data => {
      console.log(data);
    }).catch(err => {
      console.log(err);
    });

  try {
    new ExifImage({
      image: imagePath
    }, function(error, exifData) {
      if (error) {
        console.log('Error' + error.message);
      } else {
        latitude = exifData.gps.GPSLatitudeRef + exifData.gps.GPSLatitude;
        longitude = exifData.gps.GPSLongitudeRef + exifData.gps.GPSLongitude;
        date_taken = exifData.exif.DateTimeOriginal;
        console.log(latitude + ' ' + longitude + ' at ' + date_taken);

        return_json = {
          "time": date_taken,
          "category": req.body.category,
          "title": req.body.title,
          "details": req.body.details,
          "coordinates": {
            "latitude": latitude,
            "longitude": longitude
          },
          "thumbnail": outputPath,
          "thumbnail-medium": outputPathMedium,
          "thumbnail-original": imagePath
        };
        console.log(return_json);
        res.send(return_json);
      }
    })
  } catch (error) {
    console.log('Error' + error.message);
    res.send('error');
  }

});




app.listen(process.env.APP_PORT);
