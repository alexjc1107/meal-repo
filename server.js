const express = require('express');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const { PORT, DATABASE_URL } = require('./config');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const app = express();
const { User, Meal } = require('./models.js');

//app.use(express.static('public'));
//app.listen(process.env.PORT || 8080);

app.use(express.static(__dirname + '/public'));
//app.get("/", (req, res) => {
//   res.sendFile(__dirname + "/public/");
//});

/*function runServer() {
    const port = process.env.PORT || 8080;
    return new Promise((resolve, reject) => {
        server = app
            .listen(port, () => {
                console.log(`Your app is listening on port ${port}`);
                resolve(server);
            })
            .on("error", err => {
                reject(err);
            });
    });
}*/

app.post('/user', (req, res) => {
    const testUser = {
        username: 'alex',
        password: '1'
    };

    const testRestaurant = {
        restaurant: 'Five Guys',
        dish: 'Burger',
        content: 'create your own',
        username: 'alex'
    };

    User.create(testUser)
        .then(response => console.log(response))
        .catch(error => console.log(error));

    Meal.create(testRestaurant)
        .then(response => console.log(response))
        .catch(error => console.log(error));
});

// this function connects to our database, then starts the server
function runServer(DATABASE_URL, port = PORT) {
    return new Promise((resolve, reject) => {
        mongoose.connect(
            //DATABASE_URL, **removed variable and placed string
            "mongodb://localhost:27017/meal-repo",
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

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
    //runServer(DATABASE_URL).catch(err => console.error(err)); **removed variable and placed string
    runServer("mongodb://localhost:27017/meal-repo").catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };