import React from 'react';
import styled from 'styled-components';
import { Header } from 'semantic-ui-react';

export default ({ channelName }) => (
  <HeaderWrapper>
    <Header textAlign="center">#{channelName}</Header>
  </HeaderWrapper>
);

const HeaderWrapper = styled.div`
  grid-column: 3;
  grid-row: 1;
`;
