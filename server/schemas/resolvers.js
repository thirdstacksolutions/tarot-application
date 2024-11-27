const { AuthenticationError } = require('apollo-server-errors');
const { User, Deck, Card, Spread, Reading, Avatar, Theme, NewUserDefaults } = require('../config/connection');
console.log('Avatar model:', Avatar);
console.log('Deck model:', Deck);

const dateScalar = require('./DateScalar');
const { signToken } = require('../utils/auth');
const AWS = require('aws-sdk');
const path = require('path');
const { avatarClasses } = require('@mui/material');

require('dotenv').config({ path: path.join(__dirname, '../../.env') });

// Load environment variables
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const AWS_REGION = process.env.AWS_REGION;
const BUCKET_METADATA = process.env.AWS_BUCKET_METADATA;
const BUCKET_IMAGES = process.env.AWS_BUCKET_IMAGES;

AWS.config.update({
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    region: AWS_REGION
});

const s3 = new AWS.S3();

// fetch bucket info from AWS
const listS3Objects = async (bucketName) => {
    const params = {
        Bucket: bucketName
    };

    try {
        const data = await s3.listObjectsV2(params).promise();
        return data.Contents;
    } catch (error) {
        console.error('Error listing S3 objects:', error); // Log the detailed error
        throw new Error(`Error listing S3 objects: ${error.message}`);
    }
};

// COMMON LOGICS

// find object by id from S3
const fetchJsonFromS3 = async (bucket, key) => {
    const params = {
        Bucket: bucket,
        Key: key
    };

    try {
        const data = await s3.getObject(params).promise();
        return JSON.parse(data.Body.toString());
    } catch (error) {
        console.error(`Error fetching data from ${key} in bucket ${bucket}:`, error);
        throw new Error(`Error fetching data from ${key} in bucket ${bucket}`);
    }
};

const findByIdInS3 = async (bucket, key, id) => {
    const data = await fetchJsonFromS3(bucket, key);
    return data.find((item) => item.id === id);
};

// check logged in status

const checkAuthentication = (context, userId) => {
    console.log('User in context:', context.user);
    console.log('User ID to check:', userId);
    if (!context.user || context.user._id !== userId) {
        throw new AuthenticationError('You need to be logged in to perform this action!');
    }
};

// check object owned by user

const checkOwnership = (resource, resourceId, ownerId, resourceType) => {
    if (resource.user.toString() !== ownerId) {
        throw new Error(`Unauthorized access to ${resourceType} with ID ${resourceId}`);
    }
};

//error handling for unfound objects

const handleNotFound = (result, resourceType, resourceId) => {
    if (!result) {
        throw new Error(`${resourceType} with ID ${resourceId} not found`);
    }
    return result;
};

// update personal info

const updateUser = async (userId, input) => {
    if (input.birthday) {
        input.birthday = new Date(input.birthday);
    }

    return updateObject(User, userId, input);
};

// Sets new users default objects
const userDefaultObjects = async (userId) => {
    const defaultSettings = await NewUserDefaults.findOne();

    const activeAvatar = defaultSettings.activeAvatar;
    const defaultDeck = defaultSettings.defaultDeck;
    const defaultTheme = defaultSettings.defaultTheme;
    const defaultSpread = defaultSettings.defaultSpread;

    const avatars = defaultSettings.avatars;
    const decks = defaultSettings.decks;
    const theme = defaultSettings.themes;

    // Add data to new user
    await User.findByIdAndUpdate(userId, {
        $addToSet: {
            avatars: { $each: avatars },
            decks: { $each: decks },
            themes: { $each: theme }
        },
        activeAvatar: activeAvatar,
        defaultDeck: defaultDeck,
        defaultTheme: defaultTheme,
        defaultSpread: defaultSpread
    });
};

// depricated code? Static object updates should be done through s3 now
// TODO: does this update only static data?

const updateObject = async (Model, objectId, updateInput) => {
    try {
        const updatedObject = await Model.findByIdAndUpdate(objectId, updateInput, {
            new: true,
            runValidators: true
        });
        return updatedObject;
    } catch (error) {
        console.error('Error updating object:', error);
        throw new Error('Failed to update object.');
    }
};

const updateObjectArrays = async (objectId, input, updateFunction, populatePath) => {
    try {
        const updatedObject = await updateFunction({ _id: objectId }, { $addToSet: input }, { new: true }).populate(
            populatePath
        );

        if (!updatedObject) {
            throw new Error('Failed to update object relationships. Object not found.');
        }

        return updatedObject;
    } catch (error) {
        console.error('Error updating object relationships:', error);
        throw new Error('Failed to update object relationships.');
    }
};

// TAROT READINGS

// shuffle and draw cards for readings

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};
const drawCards = (deck, numberOfCards) => {
    const shuffledDeck = shuffleArray([...deck]);
    const drawnCards = new Set();

    while (drawnCards.size < numberOfCards && shuffledDeck.length > 0) {
        const card = shuffledDeck.pop();
        drawnCards.add(card);
    }

    return Array.from(drawnCards);
};

// END COMMON LOGICS

const resolvers = {
    Date: dateScalar,

    Query: {
        // on change check for username availability
        usernameChecker: async (_, { username }) => {
            return User.findOne({ username });
        },

        listS3Objects: async (_, { bucketName }) => {
            return await listS3Objects(bucketName);
        },

        allDecks: async () => {
            const decks = await Deck.find();
            return decks;
        },

        deckDetails: async (_, { deckId }) => {
            const deck = Deck.findOne({ _id: deckId });
            return handleNotFound(deck, 'Deck', deckId);
        },

        allCardsByDeck: async (_, { deckId }) => {
            console.log('Deck ID:', deckId);

            const deck = await Deck.findOne({ _id: deckId }).populate('cards');
            return deck.cards;
        },

        cardDetails: async (_, { cardId }) => {
            const card = await Card.findOne({ _id: cardId });
            return handleNotFound(card, 'Card', cardId);
        },

        allThemes: async () => {
            const themes = await Theme.find();
            return themes;
        },

        themeDetails: async (_, { themeId }) => {
            const theme = await Theme.findOne({ _id: themeId });
            return handleNotFound(theme, 'Theme', themeId);
        },

        allSpreads: async () => {
            const spreads = await Spread.find();
            return spreads;
        },

        spreadDetails: async (_, { spreadId }) => {
            const spread = await Spread.findOne({ _id: spreadId });
            return handleNotFound(spread, 'Spread', spreadId);
        },

        allAvatars: async () => {
            const avatars = await Avatar.find();
            return avatars;
        },

        avatarDetails: async (_, { avatarId }) => {
            const avatar = await Avatar.findOne({ _id: avatarId });
            return handleNotFound(avatar, 'Avatar', avatarId);
        },

        allNewUserDefaults: async () => {
            const defaultSettings = await NewUserDefaults.findOne();
            return defaultSettings;
        },

        me: async (_, __, context) => {
            checkAuthentication(context, context.user?._id);

            const me = await User.findOne({ _id: context.user._id }).populate('defaultSpread').populate('defaultDeck');

            return handleNotFound(me, 'User', context.user._id);
        },

        // who is this query for and how do we secure it better?
        users: async () => {
            return User.find();
        },

        // who is this query for and how do we secure it better?
        user: async (_, { userId }) => {
            const user = User.findOne({ _id: userId });
            return handleNotFound(user, 'User', userId);
        },

        generateTemporaryReading: async (_, { userId, deckId, spreadId }, context) => {
            try {
                checkAuthentication(context, userId);

                const spread = await Spread.findOne({ _id: spreadId });
                const deck = await Deck.findOne({ _id: deckId });

                console.log('Deck:', deck);

                if (!spread) {
                    throw new Error('Spread not found');
                }
                if (!deck) {
                    throw new Error('Deck not found');
                }

                const isEclipseDeck = deck.deckName === 'Eclipse of the Soul Tarot';

                const selectedCardIds = drawCards(deck.cards, spread.numCards).map((card) => card._id);
                const selectedCards = await Card.find({ _id: { $in: selectedCardIds } });

                const cardObjects = selectedCards.map((card, index) => ({
                    card: {
                        _id: card._id,
                        cardName: card.cardName,
                        imageUrl: card.imageUrl
                    },
                    position: index + 1,
                    orientation: isEclipseDeck
                        ? Math.random() < 0.5
                            ? 'Upright'
                            : 'Eclipsed' // Use "Eclipsed" for reversed cards in the Eclipse deck
                        : Math.random() < 0.5
                          ? 'Upright'
                          : 'Reversed'
                }));

                return {
                    deck: {
                        _id: deck._id,
                        deckName: deck.deckName
                    },
                    spread: {
                        _id: spread._id,
                        spreadName: spread.spreadName
                    },
                    cards: cardObjects
                };
            } catch (error) {
                console.error('Error generating temporary reading:', error);
                throw new Error('Failed to generate the temporary reading');
            }
        },

        allReadingsByUser: async (_, { userId }, context) => {
            checkAuthentication(context, userId);

            const user = await User.findById(userId).populate('readings');
            handleNotFound(user, 'User', userId);

            const readings = await Reading.find({ _id: { $in: user.readings } })
                .populate('deck', 'deckName')
                .populate('spread', 'spreadName')
                .populate('cards.card', 'cardName')
                .populate('userNotes', 'noteTitle');

            return readings;
        },

        oneReadingByUser: async (_, { userId, readingId }, context) => {
            checkAuthentication(context, userId);

            const reading = await Reading.findById(readingId);
            handleNotFound(reading, 'Reading', readingId);

            checkOwnership(reading, readingId, userId, 'reading');

            return reading;
        },

        allDecksByUser: async (_, { userId }, context) => {
            checkAuthentication(context, userId);

            const user = await User.findById(userId).populate('decks');
            handleNotFound(user, 'User', userId);

            const deckIds = user.decks.map((deck) => deck._id);

            const decks = await Deck.find({ _id: { $in: deckIds } });

            return decks;
        },

        allFavoriteDecksByUser: async (_, { userId }, context) => {
            checkAuthentication(context, userId);

            const user = await User.findById(userId);
            handleNotFound(user, 'User', userId);

            const favoriteDecks = user.favoriteDecks;

            // Map favoriteDecks to only retrieve the _id field
            const favoriteDeckIds = favoriteDecks.map((deck) => deck._id);

            // Query the Deck collection using the favoriteDeckIds
            const decks = await Deck.find({ _id: { $in: favoriteDeckIds } });

            return decks;
        },

        allFavoriteSpreadsByUser: async (_, { userId }, context) => {
            checkAuthentication(context, userId);

            const user = await User.findById(userId);
            handleNotFound(user, 'User', userId);

            const favoriteSpreads = user.favoriteSpreads;

            const favoriteSpreadsIds = favoriteSpreads.map((spread) => spread._id);

            const spreads = await Spread.find({
                _id: { $in: favoriteSpreadsIds }
            });

            return spreads;
        }
    },

    Mutation: {
        signup: async (_, { username, email, password }) => {
            // Where we get the email and password from the args object
            const user = await User.create({ username, email, password });

            // Add defaults objects to new user
            await userDefaultObjects(user._id);

            const token = signToken(user);

            return { token, user };
        },

        // User login
        login: async (_, { email, password }) => {
            const user = await User.findOne({ email });

            const correctPw = await user.isCorrectPassword(password);

            if (!user || !correctPw) {
                throw new AuthenticationError('Incorrect Password or Email');
            }

            const token = signToken(user);
            return { token, user };
        },

        // Mutation to update user settings info
        updateUsersettings: async (_, { userId, input }, context) => {
            checkAuthentication(context, userId);
            return updateUser(userId, input);
        },

        updateUserEmail: async (_, { userId, input }, context) => {
            checkAuthentication(context, userId);
            const user = await User.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }

            const isMatch = await user.isCorrectPassword(input.currentPassword);
            if (!isMatch) {
                throw new Error('Current password is incorrect');
            }

            const updateInput = { email: input.email };

            return updateObject(User, userId, updateInput);
        },

        // Mutation to update user password info
        updateUserPassword: async (_, { userId, input }, context) => {
            checkAuthentication(context, userId);

            const user = await User.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }

            const isMatch = await user.isCorrectPassword(input.currentPassword);
            if (!isMatch) {
                throw new Error('Current password is incorrect');
            }

            // Set and validate the new password against the user schema
            user.password = input.newPassword;
            try {
                await user.validate();
            } catch (validationError) {
                throw new Error(validationError.message);
            }

            // Save the updated user object
            await user.save();

            return user;
        },

        // mutation to add decks to user deck field array
        updateUserDecks: (_, { userId, input }, context) => {
            checkAuthentication(context, userId);
            return updateObjectArrays(userId, input, User.findOneAndUpdate.bind(User), 'decks');
        },

        updateUserFavoriteDecks: async (_, { userId, input }, context) => {
            checkAuthentication(context, userId);

            const user = await User.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }

            if (user.favoriteDecks.length >= 5) {
                throw new Error('Maximum number of favorite decks reached');
            }

            const { favoriteDeckId } = input;

            if (user.favoriteDecks.includes(favoriteDeckId)) {
                throw new Error('Deck is already a favorite');
            }

            return updateObjectArrays(userId, input, User.findOneAndUpdate.bind(User), 'favoriteDecks');
        },

        updateUserFavoriteSpreads: async (_, { userId, input }, context) => {
            checkAuthentication(context, userId);

            const user = await User.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }

            if (user.favoriteSpreads.length >= 5) {
                throw new Error('Maximum number of favorite spreads reached');
            }

            const { favoriteSpreadId } = input;

            if (user.favoriteSpreads.includes(favoriteSpreadId)) {
                throw new Error('Spread is already a favorite');
            }

            return updateObjectArrays(userId, input, User.findOneAndUpdate.bind(User), 'favoriteSpreads');
        },

        addUserAvatar: async (_, { userId, input }, context) => {
            checkAuthentication(context, userId);

            const user = await User.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }

            const { avatarId } = input;

            if (user.avatars.includes(avatarId)) {
                throw new Error('User already owns this avatar');
            }

            return updateObjectArrays(userId, input, User.findOneAndUpdate.bind(User), 'avatars');
        },

        updateUserThemes: async (_, { userId, input }, context) => {
            checkAuthentication(context, userId);

            const user = await User.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }

            return updateObjectArrays(userId, input, User.findOneAndUpdate.bind(User), 'themes');
        },

        updateUserReadings: (_, { userId, input }) => {
            checkAuthentication(context, userId);
            return updateObjectArrays(userId, input, User.findOneAndUpdate.bind(User), 'readings');
        },

        createTarotReading: async (_, { userId, deckId, spreadId, cardObjects }, context) => {
            checkAuthentication(context, userId);

            const spread = await Spread.findOne({ _id: spreadId });
            const deck = await Deck.findOne({ _id: deckId });

            if (!spread) {
                throw new Error('Spread not found');
            }
            if (!deck) {
                throw new Error('Deck not found');
            }

            const cardIds = cardObjects.map((cardObj) => cardObj.card);
            const fullCards = await Card.find({ _id: { $in: cardIds } });

            const savedCardObjects = cardObjects.map((cardObj) => {
                const fullCard = fullCards.find((card) => card._id.toString() === cardObj.card);
                return {
                    card: fullCard._id,
                    position: cardObj.position,
                    orientation: cardObj.orientation
                };
            });

            const reading = new Reading({
                user: userId,
                deck: deck._id,
                spread: spread._id,
                cards: savedCardObjects
            });

            await reading.save();

            // Update the user's readings array
            await User.findByIdAndUpdate(userId, { $addToSet: { readings: reading._id } }, { new: true });

            await reading.populate([
                { path: 'deck', select: 'deckName' },
                { path: 'spread', select: 'spreadName' },
                { path: 'cards.card', select: 'cardName imageUrl' }
            ]);

            return reading;
        },

        deleteReading: async (_, { userId, readingId }, context) => {
            checkAuthentication(context, userId);

            try {
                const reading = await Reading.findById(readingId);

                if (!reading) {
                    throw new Error('Reading not found');
                }
                if (reading.user.toString() !== userId) {
                    throw new Error('Unauthorized access to reading');
                }

                await Reading.deleteOne({ _id: readingId });
                const user = await User.findByIdAndUpdate(
                    userId,
                    { $pull: { readings: readingId } },
                    { new: true }
                ).populate('readings');
                console.log(user.readings);
                return {
                    user: {
                        _id: user._id,
                        readings: user.readings.map((reading) => ({
                            _id: reading._id
                        }))
                    }
                };
            } catch (error) {
                console.error('Error deleting reading:', error);
                throw new Error('Failed to delete reading.');
            }
        },

        // Mutation to delete their account when logged in
        deleteUser: async (_, { userId }, context) => {
            // Check authentication
            checkAuthentication(context, userId);

            try {
                // Find the user by ID
                const user = await User.findById(userId);

                if (!user) {
                    throw new Error('User not found');
                }
                // Delete all readings associated with the user
                await Promise.all(
                    user.readings.map(async (readingId) => {
                        await Reading.deleteOne({ _id: readingId });
                    })
                );
                // Delete the user by ID
                await User.deleteOne({ _id: userId });
                return {
                    message: 'User deleted successfully'
                };
            } catch (error) {
                console.error('Error deleting user:', error);
                throw new Error('Failed to delete user.');
            }
        }
    }
};

module.exports = { resolvers, drawCards };
