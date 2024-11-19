const { Schema, model } = require('mongoose');

const avatarSchema = new Schema({
    avatarName: {
        type: String,
        required: true
    },

    circleImageUrl: {
        type: String,
        required: true
    },

    squareImageUrl: {
        type: String,
        required: true
    },

    objectCode: {
        type: String,
        required: true
    }
});

module.exports = (connection) => connection.model('Avatar', avatarSchema);
