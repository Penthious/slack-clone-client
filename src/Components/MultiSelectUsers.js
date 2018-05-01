import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';
import { graphql, Query } from 'react-apollo';
import { getTeamMembersQuery } from '../Graphql/team';

const MultiSelectUsers = ({
  handleChange,
  teamId,
  value,
  currentUserId,
  ...props
}) => (
  <Query query={getTeamMembersQuery} variables={{ teamId }}>
    {({ loading, data: { getTeamMembers } }) => {
      if (loading) return null;
      return (
        <Dropdown
          onChange={handleChange}
          fluid
          value={value}
          multiple
          search
          selection
          options={getTeamMembers
            .filter(tm => tm.id !== currentUserId)
            .map(tm => ({
              key: tm.id,
              value: tm.id,
              text: tm.username,
            }))}
          {...props}
        />
      );
    }}
  </Query>
);

MultiSelectUsers.propTypes = {};

export default MultiSelectUsers;
