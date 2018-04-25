import React from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { Redirect } from 'react-router-dom';

import AppLayout from '../Components/AppLayout';
import Header from '../Components/Header';
import SendMessage from '../Components/SendMessage';
import Sidebar from '../Containers/Sidebar';
import DirectMessageContainer from '../Containers/DirectMessageContainer';
import { meQuery, getUserQuery } from '../Graphql/team';

const DirectMessages = ({
  match: {
    params: { teamId, userId, channelId },
  },
  mutate,
  GetUserQuery,
  MeQuery,
}) => {
  if (GetUserQuery.loading || MeQuery.loading) {
    return null;
  }
  const { teams, username } = MeQuery.me;
  const { getUser } = GetUserQuery;

  if (!teams.length) {
    return <Redirect to="/create/team" />;
  }

  const team = teamId
    ? teams.filter(t => t.id === parseInt(teamId, 10))[0]
    : teams[0];
  if (!team) {
    return <Redirect to="/view-team" />;
  }

  const channel = parseInt(channelId, 10)
    ? team.channels.filter(c => c.id === parseInt(channelId, 10))[0]
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
      <Header channelName={getUser.username} />
      <DirectMessageContainer teamId={team.id} userId={userId} />
      <SendMessage
        onSubmit={async text => {
          await mutate({
            variables: {
              text,
              receiverId: userId,
              teamId,
            },
            optimisticResponse: { createDirectMessage: { ok: true } },
            update: store => {
              const data = store.readQuery({ query: meQuery });
              const team = data.me.teams.filter(team => team.id === +teamId)[0];
              const BinDMList = team.directMessageMembers.every(
                member => member.id !== +userId,
              );

              if (BinDMList) {
                team.directMessageMembers.push({
                  __typename: 'User',
                  id: userId,
                  username: getUser.username,
                });
                store.writeQuery({ query: meQuery, data });
              }
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
  graphql(getUserQuery, {
    name: 'GetUserQuery',
    options: props => ({
      variables: { userId: props.match.params.userId },
      fetchPolicy: 'network-only',
    }),
  }),
  graphql(meQuery, {
    name: 'MeQuery',
    options: { fetchPolicy: 'network-only' },
  }),
  graphql(createDirectMessageMutation),
)(DirectMessages);
