const { Schema, model, Types } = require('mongoose');

const newUserDefaults = new Schema({
    defaultDeck: {
        type: Types.ObjectId,
        ref: 'Deck',
        required: true
    },

    defaultSpread: {
        type: Types.ObjectId,
        ref: 'Spread',
        required: true
    },

    defaultTheme: {
        type: Types.ObjectId,
        ref: 'Theme',
        required: true
    },

    activeAvatar: {
        type: Types.ObjectId,
        ref: 'Avatar',
        required: true
    },

    decks: [
        {
            type: Types.ObjectId,
            ref: 'Deck'
        }
    ],

    themes: [
        {
            type: Types.ObjectId,
            ref: 'Themes'
        }
    ],

    avatars: [
        {
            type: Types.ObjectId,
            ref: 'Avatar'
        }
    ]
});

module.exports = (connection) => connection.model('newUserDefaults', newUserDefaults);
