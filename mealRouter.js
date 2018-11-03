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
    Meal
        .find()
        .then(meals => {
            res.status(200).json(meals.map(meal => {
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
    Meal
        .create({
            restaurant: req.body.restaurant,
            dish: req.body.dish,
            content: req.body.content,
            username: req.body.username,
            imageURL: req.body.imageURL
        })
        .then(data => res.status(200).json(data))
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: 'post meals error' });
        });
});

router.put('/', (req, res) => {
    Meal
        .findByIdAndUpdate(req.body.id, {
            restaurant: req.body.restaurant,
            dish: req.body.dish,
            content: req.body.content
        }, { new: true })
        .then(data => res.status(200).json(data))
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: 'put meals error' });
        });
});

router.delete('/', (req, res) => {
    Meal
        .findByIdAndRemove(req.body.id)
        .then(data => res.status(200).json(data))
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: 'delete meals error' });
        });
});

module.exports = { router };