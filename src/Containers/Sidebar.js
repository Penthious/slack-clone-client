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
    const { team, teams, username, currentUserId } = this.props;
    const regularChannels = team.channels
      .map(c => (!c.dm ? c : null))
      .filter(Boolean);
    const dmChannels = team.channels
      .map(c => (c.dm ? c : null))
      .filter(Boolean);

    console.log(4, team);
    return (
      <Fragment>
        <Teams teams={teams} />
        <Channels
          teamName={team.name}
          username={username}
          channels={regularChannels}
          teamId={team.id}
          dmChannels={dmChannels}
          onAddChannelClick={this.handleAddChannelClick}
          onInvitePeopleClick={this.handleInvitePeopleClick}
          onDirectMessageOnClick={this.handleDirectMessageClick}
          isOwner={team.admin}
        />
        <AddChannelModal
          open={this.state.openAddChannelModal}
          close={this.handleAddChannelClick}
          teamId={team.id}
          currentUserId={currentUserId}
        />
        <DirectMessageModal
          open={this.state.openDirectMessageModal}
          close={this.handleDirectMessageClick}
          teamId={team.id}
          currentUserId={currentUserId}
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
