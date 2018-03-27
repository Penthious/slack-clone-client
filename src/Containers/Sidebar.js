import React, { Fragment, Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import decode from 'jwt-decode';

import Channels from '../Components/Channels';
import Teams from '../Components/Teams';
import AddChannelModel from '../Components/AddChannelModal';

class Sidebar extends Component {
  constructor() {
    super();
    this.state = {
      openAddChannelModal: false,
    };
  }

  handleCloseAddChannelClick = () =>
    this.setState({ openAddChannelModal: false });
  handleAddChannelClick = () => this.setState({ openAddChannelModal: true });

  render() {
    const { data: { loading, allTeams }, currentTeamId } = this.props;

    if (loading) {
      return null;
    }
    const team = currentTeamId
      ? allTeams.filter(team => team.id === currentTeamId)[0]
      : allTeams[0];
    const token = localStorage.getItem('token');
    const { user } = decode(token);
    const { username } = user;
    return (
      <Fragment>
        <Teams
          teams={allTeams.map(t => ({
            id: t.id,
            letter: t.name[0].toUpperCase(),
          }))}
        />
        <Channels
          teamName={team.name}
          username={username}
          channels={team.channels}
          users={[{ id: 1, name: 'slackbot' }, { id: 2, name: 'user1' }]}
          onAddChannelClick={this.handleAddChannelClick}
        />
        <AddChannelModel
          open={this.state.openAddChannelModal}
          close={this.handleCloseAddChannelClick}
          teamId={currentTeamId}
        />
      </Fragment>
    );
  }
}

const allTeamsQuery = gql`
  {
    allTeams {
      id
      name
      channels {
        id
        name
      }
    }
  }
`;
export default graphql(allTeamsQuery)(Sidebar);
