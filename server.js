const express = require('express');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const { PORT, DATABASE_URL } = require('./config');
const bodyParser = require('body-parser');
const app = express();
const { User, Meal } = require('./models.js');
const multer = require('multer')
const passport = require('passport');
require('dotenv').config();
const morgan = require('morgan');

const { router: usersRouter } = require('./userRouter.js');
const { router: authRouter, localStrategy, jwtStrategy } = require('./auth');

// CORS
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
    if (req.method === 'OPTIONS') {
        return res.send(204);
    }
    next();
});

app.use(morgan('common'));

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
let upload = multer({ storage: storage });

passport.use(localStrategy);
passport.use(jwtStrategy);

app.use('/api/users/', usersRouter);
app.use('/api/auth/', authRouter);
//app.use('mealRouter')

const jwtAuth = passport.authenticate('jwt', { session: false });

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

app.post('/upload', upload.single('photoUpload'), (req, res, next) => {
    res.json('uploads/' + req.file.filename);

});

app.get('/meal', jwtAuth, (req, res) => {
    console.log(req.body);
    Meal
        .find()
        .then(meals => {
            res.json(meals.map(meal => {
                return {
                    id: meal._id,
                    restaurant: meal.restaurant,
                    dish: meal.dish,
                    content: meal.content,
                    username: meal.username,
                    imageURL: meal.imageURL,
                    created: meal.created
                };
            }));
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: 'get meals error' });
        });
});

app.post('/meal', (req, res) => {
    console.log(req.body.restaurant);
    Meal
        .create({
            restaurant: req.body.restaurant,
            dish: req.body.dish,
            content: req.body.content,
            username: req.body.username,
            imageURL: req.body.imageURL
        })
        .then(data => res.json(data))
        .catch(error => res.json(error))
});

app.put('/meal', (req, res) => {
    console.log(req.body.restaurant);
    Meal
        .findByIdAndUpdate(req.body.id, {
            restaurant: req.body.restaurant,
            dish: req.body.dish,
            content: req.body.content
        }, { new: true })
        .then(data => res.json(data))
        .catch(error => res.json(error))
});

app.delete('/meal', (req, res) => {
    Meal
        .findByIdAndRemove(req.body.id)
        .then(data => res.json(data))
        .catch(error => res.json(error))
});

// this function connects to our database, then starts the server
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