"use strict";
const bcrypt = require('bcryptjs');
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const mealSchema = mongoose.Schema({
    restaurant: { type: String, required: true },
    dish: { type: String },
    content: { type: String },
    username: { type: String },
    imageURL: { type: String },
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

userSchema.methods.validatePassword = function(password) {
    return bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = function(password) {
    return bcrypt.hash(password, 10);
};

mealSchema.methods.serialize = function() {
    return {
        id: this._id,
        restaurant: this.restaurant,
        dish: this.dish,
        content: this.content,
        username: this.username,
        username: this.imageURL,
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