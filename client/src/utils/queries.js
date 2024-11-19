import { gql } from '@apollo/client';

export const GET_USER = gql`
    query user($userId: ID!) {
        user(userId: $userId) {
            _id
            email
        }
    }
`;

export const GET_ME = gql`
    query me {
        me {
            _id
            email
            username
            firstName
            lastName
            birthday
            phoneNumber
            discordHandle
            enableAvatarIcons
            displayDiscordHandle
            displayBirthday
            dateCreated
            totalReadings
            defaultSpread {
                _id
                spreadName
            }
            defaultDeck {
                _id
                deckName
            }
        }
    }
`;

export const QUERY_DEFAULT_DATA = gql`
    query QUERY_DEFAULT_DATA {
        me {
            activeAvatar {
                _id
            }
            defaultTheme {
                _id
            }
            defaultDeck {
                _id
            }
            defaultSpread {
                _id
            }
            notifications
            advancedSecurity
            enableAvatarIcons
        }
    }
`;

export const QUERY_AVATAR_DATA = gql`
    query QUERY_AVATAR_DATA {
        me {
            _id
            avatars {
                _id
            }
        }
    }
`;

export const GET_AVATAR_DETAILS = gql`
    query GET_AVATAR_DETAILS($avatarId: ID!) {
        avatarDetails(avatarId: $avatarId) {
            _id
            avatarName
            circleImageUrl
            squareImageUrl
        }
    }
`;

export const GET_DEFAULT_THEME = gql`
    query GET_DEFAULT_THEME {
        me {
            defaultTheme {
                _id
            }
        }
    }
`;

export const QUERY_APPEARANCE_DATA = gql`
    query QUERY_APPEARANCE_DATA {
        me {
            _id

            decks {
                _id
            }
            themes {
                _id
            }
        }

        allSpreads {
            _id
            spreadName
        }
    }
`;

export const GET_THEME_DETAILS = gql`
    query GET_THEME_DETAILS($themeId: ID!) {
        themeDetails(themeId: $themeId) {
            _id
            label
            value
        }
    }
`;

export const GET_DECK_DETAILS = gql`
    query GET_DECK_DETAILS($deckId: ID!) {
        deckDetails(deckId: $deckId) {
            _id
            deckName
            deckId
        }
    }
`;

export const GET_SPREAD_DETAILS = gql`
    query GET_SPREAD_DETAILS($spreadId: ID!) {
        spreadDetails(spreadId: $spreadId) {
            _id
            spreadName
        }
    }
`;

export const CHECK_USERNAME = gql`
    query usernameChecker($username: String!) {
        usernameChecker(username: $username) {
            username
        }
    }
`;

export const QUERY_ALL_DECKS = gql`
    query AllDecks {
        allDecks {
            _id
            deckName
            deckDescription
            imageUrl
            deckId
        }
    }
`;

export const QUERY_ONE_DECK = gql`
    query deckDetails($deckId: ID!) {
        deckDetails(deckId: $deckId) {
            _id
            cards {
                _id
            }
            deckName
            deckDescription
        }
    }
`;

export const QUERY_CARDS_BY_DECK = gql`
    query allCardsByDeck($deckId: ID!) {
        allCardsByDeck(deckId: $deckId)
    }
    {
        cards {
            _id
        }
    }
`;

export const QUERY_ALL_DECKS_BY_USER = gql`
    query allDecksByUser($userId: ID!) {
        allDecksByUser(userId: $userId) {
            _id
            deckName
        }
    }
`;

export const QUERY_ALL_FAVORITE_DECKS_BY_USER = gql`
    query allFavoriteDecksByUser($userId: ID!) {
        allFavoriteDecksByUser(userId: $userId) {
            _id
            deckName
        }
    }
`;

export const QUERY_ONE_CARD = gql`
    query OneCard($cardId: ID!) {
        oneCard(cardId: $cardId) {
            _id
            arcana
            cardDescription
            cardName
            cardReverseImage
            cardReverseMeaning
            imageUrl
            cardUprightMeaning
            number
            prominentColors
            prominentSymbols
            suit
        }
    }
`;

export const QUERY_ALL_SPREADS = gql`
    query AllSpreads {
        allSpreads {
            _id
            spreadName
            spreadDescription
            numCards
            layout
            positions {
                positionNumber
                positionDescription
                positionDetails
                gridArea
                gridColumn
                gridRow
            }
            spreadTips
            tags
            imageUrl
        }
    }
`;

export const QUERY_ONE_SPREAD = gql`
    query SpreadDetails($spreadId: ID!) {
        spreadDetails(spreadId: $spreadId) {
            _id
            spreadName
            spreadDescription
            numCards
            layout
            positions {
                positionNumber
                positionDescription
                positionDetails
                gridArea
                gridColumn
                gridRow
            }
            spreadTips
            tags
            imageUrl
        }
    }
`;

export const QUERY_ALL_FAVORITE_SPREADS_BY_USER = gql`
    query allFavoriteSpreadsByUser($userId: ID!) {
        allFavoriteSpreadsByUser(userId: $userId) {
            _id
            spreadName
        }
    }
`;

export const CREATE_TEMPORARY_READING = gql`
    query generateTemporaryReading($userId: ID!, $deckId: ID!, $spreadId: ID!) {
        generateTemporaryReading(userId: $userId, deckId: $deckId, spreadId: $spreadId) {
            deck {
                _id
                deckName
            }
            spread {
                _id
                spreadName
            }
            cards {
                card {
                    _id
                    cardName
                    imageUrl
                }
                position
                orientation
            }
        }
    }
`;

export const QUERY_ONE_READING = gql`
    query OneReading($userId: ID!, $readingId: ID!) {
        oneReadingByUser(userId: $userId, spreadId: $spreadId) {
            _id
        }
    }
`;

export const QUERY_ALL_AVATARS = gql`
    query allAvatars {
        allAvatars {
            avatarName
            imageUrl
        }
    }
`;

export const GET_ALL_SHOP_DATA = gql`
    query GET_ALL_SHOP_DATA {
        allDecks {
            _id
            deckName
            deckDescription
            imageUrl
            deckId
        }
        allAvatars {
            avatarName
            imageUrl
        }
    }
`;
