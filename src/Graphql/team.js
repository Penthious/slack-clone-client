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
        directMessageMembers {
          id
          username
        }
        channels {
          id
          name
          dm
        }
      }
    }
  }
`;

export const getUserQuery = gql`
  query($userId: Int!) {
    getUser(userId: $userId) {
      username
    }
  }
`;

export const getTeamMembersQuery = gql`
  query($teamId: Int!) {
    getTeamMembers(teamId: $teamId) {
      id
      username
    }
  }
`;
