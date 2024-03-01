const typeDefs = `

    type User {
        _id: ID!
        userName: String!
        email: String!
        phoneNumber: String
        birthday: String
        password: String
        useReverseCards: Boolean
        readings: [Reading]
        decks: [Deck]
        theme: String
    }

    type Card {
        _id: ID!
        cardName: String
        number: Int
        arcana: String
        suit: String
        cardDescription: String
        cardMeaning: String
        cardReverseMeaning: String
        prominentSymbols: [String]
        prominentColors: [String]     
        deck: Deck
    }

    type Deck {
        _id: ID!
        deckName: String
        description: String
        cards: [Card]
    }

    type Spread {
        _id: ID!
        spreadName: String
        spreadMeaning: String
        numCards: Int
        positions:[String]
    }

    type Reading {
        _id: ID!
        user: User
        deck: Deck
        spread: Spread
        cards: [Card]
        userNotes: UserNotes
    }

    type UserNotes {
        noteTitle: String
        textBody: String
    }

    type Auth {
        token: ID!
        user: User
    }

    type Query {
        allDecks: [Deck]
        oneDeck(deckId: ID!): Deck
        user(email: String!): User
        users: [User]
        me: User
    }

    type Logout {
        token: String
        message: String!
    }

    type Mutation {
        signup(userName: String!, email: String!, password: String!): Auth
        login(email: String!, password: String!): Auth
        
        logout: Logout!
        deleteUser: User
    }

`;

module.exports = typeDefs;
