const express = require('express');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const { PORT, DATABASE_URL } = require('./config');
const bodyParser = require('body-parser');
const app = express();
const { User, Meal } = require('./models.js');

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));


app.get('/meal', (req, res) => {
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
                    created: meal.created
                };
            }));
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: 'get meals error' });
        });
});

app.post('/user', (req, res) => {
    User
        .create({
            username: req.body.username,
            password: req.body.password
        })
        .then(data => res.json(data))
        .catch(error => res.json(error))
});

app.post('/meal', (req, res) => {
    console.log(req.body.restaurant);
    Meal
        .create({
            restaurant: req.body.restaurant,
            dish: req.body.dish,
            content: req.body.content,
            username: req.body.username
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
            //"mongodb://localhost:27017/meal-repo",
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

// like `runServer`, this function also needs to return a promise.
// `server.close` does not return a promise on its own, so we manually
// create one.
function closeServer() {
    return new Promise((resolve, reject) => {
        console.log("Closing server");
        server.close(err => {
            if (err) {
                reject(err);
                // so we don't also call `resolve()`
                return;
            }
            resolve();
        });
    });
}

/*


function closeServer() {
    return new Promise((resolve, reject) => {
        console.log("Closing server");
        server.close(err => {
            if (err) {
                reject(err);
                // so we don't also call `resolve()`
                return;
            }
            resolve();
        });
    });
}
*/

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
    runServer(DATABASE_URL).catch(err => console.error(err)); // **removed variable and placed string
    //runServer("mongodb://localhost:27017/meal-repo").catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };