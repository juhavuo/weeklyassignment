const Imageinformation = require('../models/imageinformation');

const path = require('path');

const sharp = require('sharp');

const ExifImage = require('exif').ExifImage;

const mongoose = require('mongoose');

exports.images_get_all = (req,res) =>{
  Imageinformation.find()
  .exec()
  .then(docs => {
    console.log(docs);
    res.status(200).json(docs);
  }).catch(err =>{
    console.log(err);
    res.status(500).json({error,err});
  });
};

exports.images_post = (req, res, next) => {

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

        const imageinformation = new Imageinformation({
          _id: new mongoose.Types.ObjectId(),
          time: date_taken,
          category: req.body.category,
          title: req.body.title,
          details: req.body.details,
          coordinates: {
            lat: latitude,
            lng: longitude
          },
          thumbnail: outputPath,
          image: outputPathMedium,
          original: imagePath
        });

        imageinformation.save().then(result => {
          console.log(result);
        }).catch(err =>{
          console.log(err);
        });

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

};
