import React, { Fragment, Component } from 'react';

import Channels from '../Components/Channels';
import Teams from '../Components/Teams';
import AddChannelModal from '../Components/AddChannelModal';
import InvitePeopleModal from '../Components/InvitePeopleModal';
import DirectMessageModal from '../Components/DirectMessageModal';

class Sidebar extends Component {
  constructor() {
    super();
    this.state = {
      openAddChannelModal: false,
      openInvitePeopleModal: false,
      openDirectMessageModal: false,
    };
  }

  handleAddChannelClick = e => {
    if (e) {
      e.preventDefault();
    }
    this.setState({ openAddChannelModal: !this.state.openAddChannelModal });
  };

  handleDirectMessageClick = e => {
    if (e) {
      e.preventDefault();
    }
    this.setState({
      openDirectMessageModal: !this.state.openDirectMessageModal,
    });
  };

  handleInvitePeopleClick = e => {
    if (e) {
      e.preventDefault();
    }
    this.setState({ openInvitePeopleModal: !this.state.openInvitePeopleModal });
  };

  render() {
    const { team, teams, username } = this.props;

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
          onDirectMessageOnClick={this.handleDirectMessageClick}
          isOwner={team.admin}
        />
        <AddChannelModal
          open={this.state.openAddChannelModal}
          close={this.handleAddChannelClick}
          teamId={team.id}
        />
        <DirectMessageModal
          open={this.state.openDirectMessageModal}
          close={this.handleDirectMessageClick}
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
