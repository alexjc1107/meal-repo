const express = require('express');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const { PORT, DATABASE_URL } = require('./config');
const bodyParser = require('body-parser');
const app = express();
const multer = require('multer')
const passport = require('passport');
require('dotenv').config();
const morgan = require('morgan');
const fs = require('fs');
const { router: usersRouter } = require('./userRouter.js');
const { router: mealRouter } = require('./mealRouter.js');
const { router: authRouter, localStrategy, jwtStrategy } = require('./auth');
const jwtAuth = passport.authenticate('jwt', { session: false });

passport.use(localStrategy);
passport.use(jwtStrategy);
app.use(morgan('common'));
app.use('/api/users/', usersRouter);
app.use('/api/auth/', authRouter);
app.use('/meal', mealRouter)
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use(jwtAuth);

// handle storing uploads on server
let storage = multer.diskStorage({
    destination: (req, file, next) => {
        next(null, './public/uploads');
    },
    filename: (req, file, next) => {
        next(null, file.originalname);
    }
});

let upload = multer({ storage: storage });
//let upload = multer().single('photoUpload')

app.post('/upload', jwtAuth, upload.single('photoUpload'), (req, res, next) => {
    /*upload(req, res, function(err) {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
            console.log(err);
        } else if (err) {
            // An unknown error occurred when uploading.
            console.log(err);
        };
    });*/
    console.log(req.file);
    res.status(200).json('uploads/' + req.file.filename);
});

app.delete('/upload', jwtAuth, (req, res, next) => {
    console.log(req.body);
    fs.unlinkSync('./public/' + req.body.imageURL);
    res.status(200).json('file deleted');
});

// connects to database, then starts the server
function runServer(DATABASE_URL, port = PORT) {
    return new Promise((resolve, reject) => {
        mongoose.connect(
            DATABASE_URL,
            err => {
                if (err) {
                    return reject(err);
                }
                server = app
                    .listen(port, () => {
                        console.log(`Your app is listening on port ${port}`);
                        resolve();
                    })
                    .on("error", err => {
                        mongoose.disconnect();
                        reject(err);
                    });
            }
        );
    });
}

function closeServer() {
    return new Promise((resolve, reject) => {
        console.log("Closing server");
        server.close(err => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
}

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
    runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };