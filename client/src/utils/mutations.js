import { gql } from '@apollo/client';

export const SIGNUP_USER = gql`
    mutation signup($username: String!, $email: String!, $password: String!) {
        signup(username: $username, email: $email, password: $password) {
            token
            user {
                _id
                email
                username
            }
        }
    }
`;

export const LOGIN_USER = gql`
    mutation login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            token
            user {
                _id
                email
                username
            }
        }
    }
`;

export const EDIT_USER_SETTINGS = gql`
    mutation updateUsersettings($userId: ID!, $input: UpdateUsersettingsInput) {
        updateUsersettings(userId: $userId, input: $input) {
            _id
            firstName
            lastName
            username
            email
            phoneNumber
            birthday
            useReverseCards
            discordHandle
            advancedSecurity
            notifications
            activeAvatar {
                _id
            }
            defaultSpread {
                _id
            }
            defaultDeck {
                _id
            }
            defaultTheme {
                _id
            }
        }
    }
`;

export const EDIT_USER_PASSWORD = gql`
    mutation updateUserPassword($userId: ID!, $input: UpdateUserPasswordInput!) {
        updateUserPassword(userId: $userId, input: $input) {
            _id
            email
        }
    }
`;

export const EDIT_USER_EMAIL = gql`
    mutation updateUserEmail($userId: ID!, $input: UpdateUserEmailInput!) {
        updateUserEmail(userId: $userId, input: $input) {
            _id
            email
        }
    }
`;

export const EDIT_USER_DECKS = gql`
    mutation updateUserDecks($userId: ID!, $input: UpdateUserDecksInput) {
        updateUserDecks(userId: $userId, input: $input) {
            _id
            decks {
                _id
            }
        }
    }
`;

export const EDIT_USER_READINGS = gql`
    mutation updateUserReadings($userId: ID!, $input: UpdateUserReadingsInput) {
        updateUserReadings(userId: $userId, input: $input) {
            _id
            readings {
                _id
            }
        }
    }
`;

export const CREATE_TAROT_READING = gql`
    mutation createTarotReading($userId: ID!, $deckId: ID!, $spreadId: ID!, $cardObjects: [CardInput!]!) {
        createTarotReading(userId: $userId, deckId: $deckId, spreadId: $spreadId, cardObjects: $cardObjects) {
            _id
            cards {
                card {
                    _id
                    cardName
                }
                position
                orientation
            }
        }
    }
`;

export const UPDATE_READING_NOTES = gql`
    mutation UpdateReadingNotes($userId: ID!, $readingId: ID!, $input: UpdateReadingNotesInput) {
        updateReadingNotes(userId: $userId, readingId: $readingId, input: $input) {
            _id
            userNotes {
                noteTitle
                textBody
            }
        }
    }
`;

export const DELETE_READING = gql`
    mutation DeleteReading($userId: ID!, $readingId: ID!) {
        deleteReading(userId: $userId, readingId: $readingId) {
            _id
            readings {
                _id
            }
        }
    }
`;
