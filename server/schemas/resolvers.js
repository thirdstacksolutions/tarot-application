const { AuthenticationError } = require("apollo-server-errors");
const { Deck, User, Card, Spread, Reading } = require("../models");
const dateScalar = require("./DateScalar");
const { signToken } = require("../utils/auth");
// const { default: context } = require( 'react-bootstrap/esm/AccordionContext' );
const AWS = require("aws-sdk");

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

const listS3Objects = async (bucketName) => {
  const params = {
    Bucket: bucketName,
  };

  try {
    const data = await s3.listObjectsV2(params).promise();
    return data.Contents; // Return the list of objects
  } catch (error) {
    console.error("Error listing S3 objects:", error); // Log the detailed error
    throw new Error(`Error listing S3 objects: ${error.message}`);
  }
};

// Common logic to fetch JSON data from S3 and find an object by ID
const fetchJsonFromS3 = async (bucket, key) => {
  const params = {
    Bucket: bucket,
    Key: key,
  };

  try {
    const data = await s3.getObject(params).promise();
    return JSON.parse(data.Body.toString());
  } catch (error) {
    console.error(
      `Error fetching data from ${key} in bucket ${bucket}:`,
      error
    );
    throw new Error(`Error fetching data from ${key} in bucket ${bucket}`);
  }
};

const findByIdInS3 = async (bucket, key, id) => {
  const data = await fetchJsonFromS3(bucket, key);
  return data.find((item) => item.id === id);
};

const checkAuthentication = (context, userId) => {
  console.log("User in context:", context.user);
  console.log("User ID to check:", userId);
  if (!context.user || context.user._id !== userId) {
    throw new AuthenticationError(
      "You need to be logged in to perform this action!"
    );
  }
};

const checkOwnership = (resource, resourceId, ownerId, resourceType) => {
  if (resource.user.toString() !== ownerId) {
    throw new Error(
      `Unauthorized access to ${resourceType} with ID ${resourceId}`
    );
  }
};

const handleNotFound = (result, resourceType, resourceId) => {
  if (!result) {
    throw new Error(`${resourceType} with ID ${resourceId} not found`);
  }
  return result;
};

const updateUser = async (userId, input) => {
  if (input.birthday) {
    input.birthday = new Date(input.birthday);
  }

  return updateObject(User, userId, input);
};

const updateObject = async (Model, objectId, updateInput) => {
  try {
    const updatedObject = await Model.findByIdAndUpdate(objectId, updateInput, {
      new: true,
      runValidators: true,
    });
    return updatedObject;
  } catch (error) {
    console.error("Error updating object:", error);
    throw new Error("Failed to update object.");
  }
};

const updateObjectArrays = async (
  objectId,
  input,
  updateFunction,
  populatePath
) => {
  try {
    const updatedObject = await updateFunction(
      { _id: objectId },
      { $addToSet: input },
      { new: true }
    ).populate(populatePath);

    return updatedObject;
  } catch (error) {
    console.error("Error updating object relationships:", error);
    throw new Error("Failed to update object relationships.");
  }
};

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const drawCards = (deck, numberOfCards) => {
  const shuffledDeck = shuffleArray([...deck]);
  return shuffledDeck.slice(0, numberOfCards);
};

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

    getDeck: async (_, { deckId }) => {
      const deck = await findByIdInS3(
        "tarotdeck-metadata",
        "DECKObjects.json",
        deckId
      );
      return handleNotFound(deck, "Deck", deckId);
    },

    me: async (_, __, context) => {
      checkAuthentication(context, context.user?._id);
      const me = await User.findOne({ _id: context.user._id });
      return handleNotFound(me, "User", context.user._id);
    },

    // who is this query for and how do we secure it better?
    users: async () => {
      return User.find();
    },

    // who is this query for and how do we secure it better?
    user: async (_, { userId }) => {
      const user = User.findOne({ _id: userId });
      return handleNotFound(user, "User", userId);
    },

    allReadingsByUser: async (_, { userId }, context) => {
      checkAuthentication(context, userId);

      const user = await User.findById(userId).populate("readings");
      handleNotFound(user, "User", userId);

      const readingIds = user.readings.map((reading) => reading._id);

      const readings = await Reading.find({ _id: { $in: readingIds } })
        .populate({
          path: "deck",
          select: "deckName",
        })
        .populate({
          path: "spread",
          select: "spreadName",
        })
        .populate({
          path: "cards.card",
          select: "cardName",
        })
        .populate({
          path: "userNotes",
          select: "noteTitle",
        });

      return readings;
    },

    oneReadingByUser: async (_, { userId, readingId }, context) => {
      checkAuthentication(context, userId);

      const reading = await Reading.findById(readingId);
      handleNotFound(reading, "Reading", readingId);

      checkOwnership(reading, readingId, userId, "reading");

      return reading;
    },

    allDecksByUser: async (_, { userId }, context) => {
      checkAuthentication(context, userId);

      const user = await User.findById(userId).populate("decks");
      handleNotFound(user, "User", userId);

      const deckIds = user.decks.map((deck) => deck._id);

      const decks = await Deck.find({ _id: { $in: deckIds } });

      return decks;
    },

    allFavoriteDecksByUser: async (_, { userId }, context) => {
      checkAuthentication(context, userId);

      const user = await User.findById(userId);
      handleNotFound(user, "User", userId);

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
      handleNotFound(user, "User", userId);

      const favoriteSpreads = user.favoriteSpreads;

      const favoriteSpreadsIds = favoriteSpreads.map((spread) => spread._id);

      const spreads = await Spread.find({
        _id: { $in: favoriteSpreadsIds },
      });

      return spreads;
    },

    allDecks: async () => Deck.find(),

    oneCard: async (_, { cardId }) => {
      const card = await Card.findOne({ _id: cardId });
      return handleNotFound(card, "Card", cardId);
    },

    oneDeck: async (_, { deckId }) => {
      const deck = await Deck.findOne({ _id: deckId }).populate("cards");
      return handleNotFound(deck, "Deck", deckId);
    },

    allCardsByDeck: async (_, { deckId }) => {
      const deck = await Deck.findOne({ _id: deckId }).populate("cards");
      handleNotFound(deck, "Deck", deckId);
      return deck.cards.map((card) => card._id);
    },

    allSpreads: async () => Spread.find(),

    oneSpread: async (_, { spreadId }) => {
      const spread = await Spread.findOne({ _id: spreadId });
      return handleNotFound(spread, "Spread", spreadId);
    },
  },

  Mutation: {
    signup: async (_, { username, email, password }) => {
      // Where we get the email and password from the args object
      const user = await User.create({ username, email, password });
      const token = signToken(user);

      return { token, user };
    },

    // User login
    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });

      const correctPw = await user.isCorrectPassword(password);

      if (!user || !correctPw) {
        throw new AuthenticationError("Incorrect Password or Email");
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
        throw new Error("User not found");
      }

      const isMatch = await user.isCorrectPassword(input.currentPassword);
      if (!isMatch) {
        throw new Error("Current password is incorrect");
      }

      const updateInput = { email: input.email };

      return updateObject(User, userId, updateInput);
    },

    // Mutation to update user password info
    updateUserPassword: async (_, { userId, input }, context) => {
      checkAuthentication(context, userId);

      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      const isMatch = await user.isCorrectPassword(input.currentPassword);
      if (!isMatch) {
        throw new Error("Current password is incorrect");
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
      return updateObjectArrays(
        userId,
        input,
        User.findOneAndUpdate.bind(User),
        "decks"
      );
    },

    updateUserFavoriteDecks: async (_, { userId, input }, context) => {
      checkAuthentication(context, userId);

      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      if (user.favoriteDecks.length >= 5) {
        throw new Error("Maximum number of favorite decks reached");
      }

      const { favoriteDeckId } = input;

      if (user.favoriteDecks.includes(favoriteDeckId)) {
        throw new Error("Deck is already a favorite");
      }

      return updateObjectArrays(
        userId,
        input,
        User.findOneAndUpdate.bind(User),
        "favoriteDecks"
      );
    },

    updateUserFavoriteSpreads: async (_, { userId, input }, context) => {
      checkAuthentication(context, userId);

      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      if (user.favoriteSpreads.length >= 5) {
        throw new Error("Maximum number of favorite spreads reached");
      }

      const { favoriteSpreadId } = input;

      if (user.favoriteSpreads.includes(favoriteSpreadId)) {
        throw new Error("Spread is already a favorite");
      }

      return updateObjectArrays(
        userId,
        input,
        User.findOneAndUpdate.bind(User),
        "favoriteSpreads"
      );
    },

    updateUserReadings: (_, { userId, input }) => {
      checkAuthentication(context, userId);
      return updateObjectArrays(
        userId,
        input,
        User.findOneAndUpdate.bind(User),
        "readings"
      );
    },

    createTarotReading: async (_, { userId, deckId, spreadId }, context) => {
      checkAuthentication(context, userId);

      const spread = await Spread.findOne({ _id: spreadId });
      const deck = await Deck.findOne({ _id: deckId }).populate("cards");
      const selectedCards = drawCards(deck.cards, spread.numCards);

      const cardObjects = selectedCards.map((card, index) => ({
        card: card._id,
        position: index + 1,
        orientation: Math.random() < 0.5 ? "Upright" : "Reversed",
      }));

      const reading = new Reading({
        user: context.user._id,
        deck: deck._id,
        spread: spread._id,
        cards: cardObjects,
      });

      await reading.save();

      await reading.populate("user deck spread cards.card");
      console.log("READING ID: ", reading._id);

      updateObjectArrays(
        userId,
        { readings: reading._id },
        User.findOneAndUpdate.bind(User),
        "readings"
      );
      return reading;
    },

    updateReadingNotes: async (_, { userId, readingId, input }, context) => {
      checkAuthentication(context, userId);
      const reading = await Reading.findOne({ _id: readingId });

      if (!reading) {
        throw new Error("Reading not found");
      }

      reading.userNotes = input;
      await reading.save();

      return {
        message: "Notes added successfully to reading.",
      };
    },

    deleteReading: async (_, { userId, readingId }, context) => {
      checkAuthentication(context, userId);

      try {
        const reading = await Reading.findById(readingId);

        if (!reading) {
          throw new Error("Reading not found");
        }
        if (reading.user.toString() !== userId) {
          throw new Error("Unauthorized access to reading");
        }

        await Reading.deleteOne({ _id: readingId });
        const user = await User.findByIdAndUpdate(
          userId,
          { $pull: { readings: readingId } },
          { new: true }
        ).populate("readings");
        console.log(user.readings);
        return {
          user: {
            _id: user._id,
            readings: user.readings.map((reading) => ({
              _id: reading._id,
            })),
          },
        };
      } catch (error) {
        console.error("Error deleting reading:", error);
        throw new Error("Failed to delete reading.");
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
          throw new Error("User not found");
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
          message: "User deleted successfully",
        };
      } catch (error) {
        console.error("Error deleting user:", error);
        throw new Error("Failed to delete user.");
      }
    },
  },
};

module.exports = resolvers;
