import React from 'react';
import styled from 'styled-components';
import { Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const paddingLeft = 'padding-left: 10px';

export default ({
  teamName,
  username,
  channels,
  users,
  onAddChannelClick,
  onInvitePeopleClick,
  teamId,
  isOwner,
}) => (
  <ChannelWrapper>
    <PushLeft>
      <TeamNameHeader>{teamName}</TeamNameHeader>
      {username}
    </PushLeft>
    <div>
      <SideBarList>
        <SideBarListHeader>
          Channels{' '}
          {isOwner && <Icon onClick={onAddChannelClick} name="add circle" />}
        </SideBarListHeader>
        {channels.map((c, i) => Channel(c, teamId))}
      </SideBarList>
    </div>
    <div>
      <SideBarList>
        <SideBarListHeader>Direct Messages</SideBarListHeader>
        {users.map(User)}
      </SideBarList>
    </div>
    <div>{isOwner && <a onClick={onInvitePeopleClick}>+ Invite People</a>}</div>
  </ChannelWrapper>
);

const Channel = ({ id, name }, teamId) => (
  <Link key={`channel-${id}-${teamId}`} to={`/view-team/${teamId}/${id}`}>
    <SideBarListItem># {name}</SideBarListItem>
  </Link>
);

const User = ({ id, name }) => (
  <SideBarListItem key={`user-${id}`}>
    <Bubble /> {name}
  </SideBarListItem>
);

const Bubble = ({ on = true }) => (on ? <Green>●</Green> : '○');

const ChannelWrapper = styled.div`
  grid-column: 2;
  grid-row: 1 / 4;
  background-color: #4e3a4c;
  color: #958993;
`;

const PushLeft = styled.div`
  ${paddingLeft};
`;

const TeamNameHeader = styled.h1`
  color: #fff;
  font-size: 20px;
`;

const SideBarListHeader = styled.li`
  ${paddingLeft};
`;

const SideBarList = styled.ul`
  width: 100%;
  list-style: none;
  padding-left: 0px;
`;

const SideBarListItem = styled.li`
  padding: 2px;
  ${paddingLeft};
  &:hover {
    background: #3e313c;
  }
`;
const Green = styled.span`
  color: #38978d;
`;
