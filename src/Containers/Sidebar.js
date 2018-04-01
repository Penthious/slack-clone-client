import React, { Fragment, Component } from 'react';
import decode from 'jwt-decode';

import Channels from '../Components/Channels';
import Teams from '../Components/Teams';
import AddChannelModal from '../Components/AddChannelModal';
import InvitePeopleModal from '../Components/InvitePeopleModal';

class Sidebar extends Component {
  constructor() {
    super();
    this.state = {
      openAddChannelModal: false,
      openInvitePeopleModal: false,
    };
  }

  handleAddChannelClick = e => {
    if (e) {
      e.preventDefault();
    }
    this.setState({ openAddChannelModal: !this.state.openAddChannelModal });
  };
  handleInvitePeopleClick = e => {
    if (e) {
      e.preventDefault();
    }
    this.setState({ openInvitePeopleModal: !this.state.openInvitePeopleModal });
  };

  render() {
    const { team, teams } = this.props;

    const token = localStorage.getItem('token');
    const { user } = decode(token);
    const { username, id } = user;
    const isOwner = id === team.owner;

    return (
      <Fragment>
        <Teams teams={teams} />
        <Channels
          teamName={team.name}
          username={username}
          channels={team.channels}
          teamId={team.id}
          users={[{ id: 1, name: 'slackbot' }, { id: 2, name: 'user1' }]}
          onAddChannelClick={this.handleAddChannelClick}
          onInvitePeopleClick={this.handleInvitePeopleClick}
          isOwner={isOwner}
        />
        <AddChannelModal
          open={this.state.openAddChannelModal}
          close={this.handleAddChannelClick}
          teamId={team.id}
        />
        <InvitePeopleModal
          open={this.state.openInvitePeopleModal}
          close={this.handleInvitePeopleClick}
          teamId={team.id}
        />
      </Fragment>
    );
  }
}

export default Sidebar;
