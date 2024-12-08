const { Schema, model, Types } = require('mongoose');

//don't forget to add to typedefs!

const readingSchema = new Schema({
    user: {
        type: Types.ObjectId,
        ref: 'User'
    },
    deck: {
        type: Types.ObjectId,
        ref: 'Deck'
    },
    spread: {
        type: Types.ObjectId,
        ref: 'Spread'
    },
    cards: [
        {
            card: {
                type: Types.ObjectId,
                ref: 'Card'
            },
            position: {
                type: Number
            },
            orientation: {
                type: String,
                enum: ['Upright', 'Reversed', 'Eclipsed']
            }
        }
    ],
    userNotes: {
        noteTitle: {
            type: String
        },
        textBody: {
            type: String
        }
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
});

module.exports = (connection) => connection.model('Reading', readingSchema);
