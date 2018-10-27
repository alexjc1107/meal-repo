'use strict';
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const router = express.Router();
const { Meal } = require('./models.js');
const jwtAuth = passport.authenticate('jwt', { session: false });

router.use(jwtAuth);
router.use(bodyParser.json());

router.get('/', (req, res) => {
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

router.post('/', (req, res) => {
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

router.put('/', (req, res) => {
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

router.delete('/', (req, res) => {
    Meal
        .findByIdAndRemove(req.body.id)
        .then(data => res.json(data))
        .catch(error => res.json(error))
});

module.exports = { router };