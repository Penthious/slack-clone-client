import React from 'react';

import AppLayout from '../Components/AppLayout';
import Header from '../Components/Header';
import Messages from '../Components/Messages';
import SendMessage from '../Components/SendMessage';
import Sidebar from '../Containers/Sidebar';

export default ({ match: { params } }) =>
  console.log(params) || (
    <AppLayout>
      <Sidebar currentTeamId={parseInt(params.teamId, 10)} />
      <Header channelName="announcments" />
      <Messages>
        <ul>
          <li />
          <li />
        </ul>
      </Messages>
      <SendMessage channelName={'general'} />
    </AppLayout>
  );
