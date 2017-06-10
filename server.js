"use strict";

const express = require("express");
const mongodb = require('mongodb');
const dotenv = require('dotenv');
const api = require('./api/url-shortener.js');

dotenv.config();

const app = express();

app.listen(process.env.PORT || 8080);

const MongoClient = mongodb.MongoClient;
const mongoDBurl = process.env.MONGOLAB_URI;


MongoClient.connect(mongoDBurl, (err, db) => {
            if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
            } else {
            console.log('Connection established to', mongoDBurl);

        api(app, db);
        
      }
});
