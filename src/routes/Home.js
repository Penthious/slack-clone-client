import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const Home = ({ data: { loading, allUsers } }) =>
  loading
    ? null
    : allUsers.map(u => (
        <h1 key={u.id}>
          name: {u.username}, Email: {u.email}
        </h1>
      ));

const allUsersQuery = gql`
  {
    allUsers {
      id
      username
      email
    }
  }
`;
export default graphql(allUsersQuery)(Home);
