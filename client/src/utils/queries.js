import { gql } from '@apollo/client';

export const GET_USER = gql`
    query user($userId: ID!) {
      user(userId: $userId) {
        _id
        email
      }
    }    
`

export const GET_ME = gql`
    query me {
      me {
        _id
        email
      }
    }
`

export const QUERY_ALL_DECKS = gql`
  query AllDecks {
    allDecks {
      _id
      cards {
        _id
      }
      deckName
      description
    }
  }
`;

export const QUERY_ONE_DECK = gql`
  query OneDeck($deckId: ID!) {
    oneDeck(deckId: $deckId) {
      _id
      cards {
        _id
      }
      deckName
      description
    }
  }
`;
