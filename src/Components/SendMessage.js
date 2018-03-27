import React from 'react';
import styled from 'styled-components';
import { Input } from 'semantic-ui-react';

export default ({ channelName }) => (
  <SendMessageWrapper>
    <Input type="text" placeholder={`Message #${channelName}`} fluid />
  </SendMessageWrapper>
);

const SendMessageWrapper = styled.div`
  grid-column: 3;
  grid-row: 3;
  margin: 20px;
`;
