import gql from 'graphql-tag';

export const meQuery = gql`
  {
    me {
      id
      username
      teams {
        admin
        id
        name
        channels {
          id
          name
        }
      }
    }
  }
`;
