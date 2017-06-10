"use strict";

module.exports = function(app, db) {

    app.get('/:shortUrlNumber', handleGetURL);
    app.get('/getShortUrl/:url(*)', handlePostURL);
    
    
    function handlePostURL(req, res) {
           return (Promise.all([ validateUrl(req), validateUrl(req).then(generateShortUrl) ])
                .then(putUrlInDb, fail => {console.log(fail); throw new Error("Error url not valid")})
                .then(resultedObj => res.send(resultedObj))
                .then(() => db.close())
                    .catch(err => {console.log("reason for fail \n" + err); res.send(JSON.stringify(err));}));
    }

    function handleGetURL(req, res) {
        const shortUrlNumber = req.params.shortUrlNumber;
        getOriginalUrlFromDb(shortUrlNumber, db)
            .then(obj => res.redirect(obj.originalUrl))
            .then(() => db.close());
    }
    
    function getOriginalUrlFromDb(shortUrlNumber, db) {
    
        const shorturls = db.collection("shorturls");
        const shortUrl = "https://ralex-url-shortener.herokuapp.com/" + shortUrlNumber;
        
        return new Promise((resolve, reject) => {
            shorturls.find({
                "shortUrl": shortUrl
            }).toArray((err, result) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(result[0]);   
                }
            });
        });
    }

    function validateUrl(req) {
        const url = req.params.url
        const isURLValid = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/.test(url);
        const promise = new Promise((resolve, reject) => {
            if (isURLValid) {
                resolve(url);
            }
            else {
                reject("url not valid")
            }
        })
        return promise;
    }
    
    function generateShortUrl(url) {
        
        const promise = new Promise((resolve, reject) => {
            db.collection("shorturls").find().toArray((err, data) => {
            
            if (err) {
                reject(err);
            }
            
            const shortUrlsList = data.map(obj => obj.shortUrl);
            
            let newUrl;
            do {        // make sure to generate a new random url that is not in the database already
                let num = Math.floor(100 + (Math.random() * 900));
                newUrl = "https://ralex-url-shortener.herokuapp.com/" + num.toString();
            } while (shortUrlsList.indexOf(newUrl) !== -1);
            
            
            resolve(newUrl);
            
            });
        });
        return promise;
    }
    
    function putUrlInDb( [originalurl, shorturl] ) {
        
        const promise = new Promise((resolve, reject) => {
            const urlObj = {
                "originalUrl" : originalurl,
                "shortUrl": shorturl
            };
            
            const originalObj = JSON.parse(JSON.stringify(urlObj));
            
            const shortUrls = db.collection('shorturls');
             
            shortUrls.save(urlObj, (err, result) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(originalObj);    
                }
         
            });
        
        });
        return promise;
    }
    
};