const typeDefs = `
    scalar Date

    type S3Object {
        Key: String
        LastModified: String
        Size: Int
    }

    type User {
        _id: ID!
        username: String!
        email: String!
        password: String!
        avatars: [Avatar]
        activeAvatar: Avatar
        avatarIcon: AvatarIcon
        enableAvatarIcons: Boolean
        discordHandle: String
        displayDiscordHandle: Boolean
        phoneNumber: String
        firstName: String
        lastName: String
        birthday: Date
        displayBirthday: Boolean
        useReverseCards: Boolean
        readings: [Reading]
        decks: [Deck]
        defaultDeck: Deck
        themes: [Theme]
        defaultTheme: Theme
        defaultSpread: Spread
        favoriteDecks: [Deck]
        favoriteSpreads: [Spread]
        advancedSecurity: Boolean
        notifications: Boolean
        dateCreated: Date
        totalReadings: Int
    }

    type Avatar {
        _id: ID!
        avatarName: String
        circleImageUrl: String
        squareImageUrl: String
        objectCode: String
    }

    type AvatarIcon {
        _id: ID!
        iconName: String
        imageUrl: String
        objectCode: String
    }
      
    type Card {
        _id: ID!
        cardName: String!
        number: Int
        arcana: String!
        suit: String!
        cardDescription: String!
        meanings: [CardMeaning!]!
        prominentSymbols: [ProminentSymbol!]!
        prominentColors: [ProminentColor!]!
        deck: Deck!
        objectCode: String!
        imageUrl: String!
    }
      
    type CardMeaning {
        title: String!
        description: String!
        keywords: [String]
    }
      
      type ProminentSymbol {
        symbol: String!
        meaning: String!
    }
      
      type ProminentColor {
        color: String!
        meaning: String!
    }

    type Deck {
        _id: ID!
        deckName: String
        deckCreators: [String]
        deckDescription: String
        imageUrl: String
        objectCode: String
        deckId: String
        sampleCardImages: [String]
        cards: [Card]!
    }

    type Spread {
        _id: ID!
        spreadName: String
        spreadDescription: String
        numCards: Int
        layout: String
        positions:[SpreadPositions]
        spreadTips: [String]
        tags: [String]
        imageUrl: String
        objectCode: String
    }

    type SpreadPositions {
        positionNumber: Int
        positionDescription: String
        positionDetails: String
        gridArea: String
        gridColumn: String
        gridRow: String
    }

    type TemporaryReading {
      deck: Deck
      spread: Spread
      cards: [ReadingCards]
    }

    input CardInput {
      card: ID!
      position: Int!
      orientation: String!
    }

    type Reading {
      _id: ID!
      user: User
      deck: Deck
      spread: Spread
      cards: [ReadingCards]
      userNotes: UserNotes
      dateCreated: Date
    }

    type ReadingCards {
      card: Card
      position: Int
      orientation: String
    }

    type UserNotes {
      noteTitle: String
      textBody: String
    }

    type Theme {
        _id: ID!
        value: String
        label: String
    }

    type newUserDefaults {
        _id: ID!
        defaultDeck: Deck
        defaultSpread: Spread
        defaultTheme: Theme
        activeAvatar: Avatar
        decks: [Deck]
        themes: [Theme]
        avatars: [Avatar]
    }

    input UpdateUsersettingsInput {
        username: String
        activeAvatar: ID
        avatarIcon: [AvatarIconInput]
        discordHandle: String
        displayDiscordHandle: Boolean
        phoneNumber: String
        firstName: String
        lastName: String
        birthday: Date
        displayBirthday: Boolean
        useReverseCards: Boolean
        defaultTheme: ID
        advancedSecurity: Boolean
        notifications: Boolean
        defaultDeck: ID
        defaultSpread: ID
    }

    input AvatarInput {
        imageUrl: String!
        avatarName: String!
    }

    input AvatarIconInput {
        imageUrl: String
        ImageFileName: String
    }

    input UpdateUserEmailInput {
        currentPassword: String!
        email: String
    }
    input UpdateUserPasswordInput {
        currentPassword: String!
        newPassword: String!
    }

    input UpdateUserDecksInput {
        decks: [ID]
    }

    input UpdateUserFavoriteDecksInput {
        favoriteDecks: [ID]
    }

    input UpdateUserFavoriteSpreadsInput {
        favoriteSpreads: [ID]
    }

    input UpdateUserReadingsInput {
        readings: [ID]
    }

    input UpdateReadingNotesInput {
        noteTitle: String
        textBody: String
    }

    input AddUserAvatarInput {
        avatars: [ID]
    }

    input UpdateUserThemesInput {
        themes: [ID]
    }

    type UpdateReadingNotesMessage {
        message: String!
    }

    type Auth {
        token: ID!
        user: User
    }

    type Query {
        listS3Objects(bucketName: String!): [S3Object]
        allDecks: [Deck]
        deckDetails(deckId: ID!): Deck
        allCardsByDeck(deckId: ID!): [Card]
        cardDetails(cardId: ID!): Card
        allThemes: [Theme]
        themeDetails(themeId: ID!):Theme
        allSpreads: [Spread]
        spreadDetails(spreadId: ID!): Spread
        allAvatars: [Avatar]
        avatarDetails(avatarId: ID!): Avatar
        allDecksByUser(userId: ID!): [Deck]
        allFavoriteDecksByUser(userId: ID!): [Deck]
        allFavoriteSpreadsByUser(userId: ID!): [Spread]
        generateTemporaryReading(userId: ID!, deckId: ID!, spreadId: ID!): TemporaryReading
        allReadingsByUser(userId: ID!): [Reading]
        oneReadingByUser(userId: ID!, readingId: ID!): Reading
        user(userId: ID!): User
        users: [User]
        me: User
        usernameChecker(username: String!): User
        allNewUserDefaults: newUserDefaults
    }


    type DeleteUser {
        message: String!
    }

    type Mutation {
        signup(username: String!, email: String!, password: String!): Auth
        login(email: String!, password: String!): Auth
        updateUsersettings(userId: ID!, input: UpdateUsersettingsInput):User
        updateUserEmail(userId: ID!, input: UpdateUserEmailInput):User
        updateUserPassword(userId: ID!, input: UpdateUserPasswordInput): User
        updateUserDecks(userId: ID!, input: UpdateUserDecksInput): User
        updateUserFavoriteDecks(userId: ID!, input: UpdateUserFavoriteDecksInput): User
        updateUserFavoriteSpreads(userId: ID!, input: UpdateUserFavoriteSpreadsInput): User
        createTarotReading(userId: ID!, deckId: ID!, spreadId: ID!, cardObjects: [CardInput!]!): Reading
        updateUserReadings(userId: ID!, input: UpdateUserReadingsInput): User
        updateReadingNotes(userId: ID!, readingId: ID!, input: UpdateReadingNotesInput): UpdateReadingNotesMessage
        deleteReading(userId: ID!, readingId: ID!): Reading
        updateUserThemes(userId: ID!, input: UpdateUserThemesInput): User
        addUserAvatar(userId: ID!, input: AddUserAvatarInput): User
        deleteUser(userId: ID!): DeleteUser
    }

`;

module.exports = typeDefs;
