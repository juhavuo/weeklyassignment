const express = require('express');
const router = express.Router();

const Imageinformation = require('../models/imageinformation');

const ImagesController = require('../controllers/images');

const multer = require('multer');


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

router.get('/all', ImagesController.images_get_all);



router.post('/', upload.fields([{name: 'category'}, {name: 'title'}, {name: 'details'}, {name: 'image'}]), ImagesController.images_post);
module.exports = router;
