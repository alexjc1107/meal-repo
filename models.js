"use strict";

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const mealSchema = mongoose.Schema({
    restaurant: { type: String, required: true },
    dish: { type: String },
    content: { type: String },
    //username: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    username: { type: String },
    created: { type: Date, default: Date.now }
});

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

mealSchema.pre('find', function(next) {
    this.populate('username');
    next();
});

mealSchema.methods.serialize = function() {
    return {
        id: this._id,
        restaurant: this.restaurant,
        dish: this.dish,
        content: this.content,
        username: this.username,
        created: this.created
    };
}

userSchema.methods.serialize = function() {
    return {
        id: this._id,
        username: this.username
    };
}

const Meal = mongoose.model('Meal', mealSchema);
const User = mongoose.model("User", userSchema);

module.exports = { Meal, User };