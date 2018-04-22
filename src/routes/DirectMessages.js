import React from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { Redirect } from 'react-router-dom';

import AppLayout from '../Components/AppLayout';
import Header from '../Components/Header';
import SendMessage from '../Components/SendMessage';
import Sidebar from '../Containers/Sidebar';
import DirectMessageContainer from '../Containers/DirectMessageContainer';
import { meQuery } from '../Graphql/team';

const DirectMessages = ({
  match: {
    params: { teamId, userId, channelId },
  },
  data: { loading, me },
  mutate,
}) => {
  if (loading) {
    return null;
  }
  const { teams, username } = me;
  if (!teams.length) {
    return <Redirect to="/create/team" />;
  }
  const team = teamId
    ? teams.filter(team => team.id === parseInt(teamId, 10))[0]
    : teams[0];
  if (!team) {
    return <Redirect to="/view-team" />;
  }
  const channel = parseInt(channelId, 10)
    ? team.channels.filter(channel => channel.id === parseInt(channelId, 10))[0]
    : team.channels[0];
  if (!channel) {
    return <Redirect to="/view-team" />;
  }
  return (
    <AppLayout>
      <Sidebar
        teams={teams.map(t => ({
          id: t.id,
          letter: t.name[0].toUpperCase(),
        }))}
        team={team}
        username={username}
      />
      <Header channelName={'Some'} />
      <DirectMessageContainer teamId={teamId} userId={userId} />
      <SendMessage
        onSubmit={async text => {
          await mutate({
            variables: {
              text,
              receiverId: userId,
              teamId,
            },
          });
        }}
        placeholder={userId}
      />
    </AppLayout>
  );
};

const createDirectMessageMutation = gql`
  mutation($receiverId: Int!, $text: String!, $teamId: Int!) {
    createDirectMessage(receiverId: $receiverId, teamId: $teamId, text: $text)
  }
`;

export default compose(
  graphql(meQuery, { options: { fetchPolicy: 'network-only' } }),
  graphql(createDirectMessageMutation),
)(DirectMessages);
