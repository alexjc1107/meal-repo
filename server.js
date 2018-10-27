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
const { router: usersRouter } = require('./userRouter.js');
const { router: mealRouter } = require('./mealRouter.js');
const { router: authRouter, localStrategy, jwtStrategy } = require('./auth');

passport.use(localStrategy);
passport.use(jwtStrategy);
app.use(morgan('common'));
app.use('/api/users/', usersRouter);
app.use('/api/auth/', authRouter);
app.use('/meal', mealRouter)
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

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

app.post('/upload', upload.single('photoUpload'), (req, res, next) => {
    res.json('uploads/' + req.file.filename);

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