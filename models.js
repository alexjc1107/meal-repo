"use strict";

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const mealSchema = mongoose.Schema({
    restaurant: { type: String, required: true },
    content: { type: String },
    created: { type: Date, default: Date.now },
    username: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
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

userSchema.methods.serialize = function() {
    return {
        id: this._id,
        username: this.username
    };
}

const Meal = mongoose.model('Meal', mealSchema);
const User = mongoose.model("User", userSchema);

module.exports = { Meal, User };