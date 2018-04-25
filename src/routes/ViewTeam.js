import React from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { Redirect } from 'react-router-dom';

import AppLayout from '../Components/AppLayout';
import Header from '../Components/Header';
import SendMessage from '../Components/SendMessage';
import Sidebar from '../Containers/Sidebar';
import MessageContainer from '../Containers/MessageContainer';
import { meQuery } from '../Graphql/team';

const ViewTeam = ({
  match: {
    params: { teamId, channelId },
  },
  data: { loading, me },
  mutate,
}) => {
  console.log(2, loading);
  if (loading) {
    return null;
  }

  const { teams, username } = me;
  if (!teams.length) {
    return <Redirect to="/create/team" />;
  }

  const team = teamId ? teams.filter(t => t.id === +teamId)[0] : teams[0];
  if (!team) {
    return <Redirect to="/view-team" />;
  }

  const channel = +channelId
    ? team.channels.filter(c => c.id === +channelId)[0]
    : team.channels[0];
  if (!channel) {
    return <Redirect to="/view-team" />;
  }
  console.log(3, me);

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
      <Header channelName={channel.name} />
      <MessageContainer channelId={channel.id} />
      <SendMessage
        placeholder={channel.name}
        onSubmit={async text => {
          await mutate({ variables: { text, channelId: channel.id } });
        }}
      />
    </AppLayout>
  );
};

const createMessageMutation = gql`
  mutation($channelId: Int!, $text: String!) {
    createMessage(channelId: $channelId, text: $text)
  }
`;

export default compose(
  graphql(meQuery, { options: { fetchPolicy: 'network-only' } }),
  graphql(createMessageMutation),
)(ViewTeam);
