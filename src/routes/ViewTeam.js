import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Redirect } from 'react-router-dom';

import AppLayout from '../Components/AppLayout';
import Header from '../Components/Header';
import SendMessage from '../Components/SendMessage';
import Sidebar from '../Containers/Sidebar';
import MessageContainer from '../Containers/MessageContainer';
import { allTeamsQuery } from '../Graphql/team';

const ViewTeam = ({
  match: { params: { teamId, channelId } },
  data: { loading, allTeams, inviteTeams },
}) => {
  console.log(allTeams, inviteTeams);

  if (loading) {
    return null;
  }
  const teams = [...allTeams, ...inviteTeams];
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
      />
      <Header channelName={channel.name} />
      <MessageContainer channelId={channel.id} />
      <SendMessage channelName={channel.name} channelId={channel.id} />
    </AppLayout>
  );
};

export default graphql(allTeamsQuery)(ViewTeam);
