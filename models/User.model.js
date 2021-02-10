// User model here
const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const userSchema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            trim: true,
            required: [true, 'Username has to be filled']
        },
        password: {
            type: String,
            required: [true, 'Please, enter with a valid password']
        }
    },
    {
        timestamps: true
    }
);

module.exports = model('User', userSchema);