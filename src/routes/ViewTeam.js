import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import AppLayout from '../Components/AppLayout';
import Header from '../Components/Header';
import Messages from '../Components/Messages';
import SendMessage from '../Components/SendMessage';
import Sidebar from '../Containers/Sidebar';
import { allTeamsQuery } from '../Graphql/team';

const ViewTeam = ({
  match: { params: { teamId, channelId } },
  data: { loading, allTeams },
}) => {
  if (loading) {
    return null;
  }
  const team = teamId
    ? allTeams.filter(team => team.id === parseInt(teamId, 10))[0]
    : allTeams[0];
  const channel = channelId
    ? team.channels.filter(channel => channel.id === parseInt(channelId, 10))[0]
    : team.channels[0];

  return (
    <AppLayout>
      <Sidebar
        teams={allTeams.map(t => ({
          id: t.id,
          letter: t.name[0].toUpperCase(),
        }))}
        team={team}
      />
      <Header channelName={channel.name} />
      <Messages channelId={channel.id}>
        <ul>
          <li />
          <li />
        </ul>
      </Messages>
      <SendMessage channelName={channel.name} />
    </AppLayout>
  );
};

export default graphql(allTeamsQuery)(ViewTeam);
