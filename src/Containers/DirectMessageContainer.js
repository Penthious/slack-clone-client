import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Comment } from 'semantic-ui-react';
import Messages from '../Components/Messages';
import { directMessagesQuery } from '../Graphql/message';

const newDirectMessageSubscription = gql`
  subscription($teamId: Int!, $userId: Int!) {
    newDirectMessage(teamId: $teamId, userId: $userId) {
      id
      sender {
        id
        username
      }
      text
      url
      filetype
      created_at
    }
  }
`;

class DirectMessageContainer extends Component {
  componentWillMount() {
    this.unsubscribe = this.subscribe(this.props.teamId, this.props.userId);
  }

  componentWillReceiveProps({ teamId, userId }) {
    if (this.props.teamId !== teamId || this.props.userId !== userId) {
      if (this.unsubscribe) {
        this.unsubscribe();
      }
      this.unsubscribe = this.subscribe(teamId, userId);
    }
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  subscribe = (teamId, userId) =>
    this.props.data.subscribeToMore({
      document: newDirectMessageSubscription,
      variables: {
        teamId,
        userId,
      },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData) {
          return prev;
        }

        return {
          ...prev,
          directMessages: [
            ...prev.directMessages,
            subscriptionData.data.newDirectMessage,
          ],
        };
      },
    });

  render() {
    const {
      data: { loading, directMessages },
    } = this.props;
    if (loading) {
      return null;
    }
    return (
      <Messages>
        <Comment.Group>
          {directMessages.map(m => (
            <Comment key={`direct-message-${m.id}`}>
              <Comment.Content>
                <Comment.Author as="a">{m.sender.username}</Comment.Author>
                <Comment.Metadata>
                  <div>{m.created_at}</div>
                </Comment.Metadata>
                <Comment.Text>{m.text}</Comment.Text>
                <Comment.Actions>
                  <Comment.Action>Reply</Comment.Action>
                </Comment.Actions>
              </Comment.Content>
            </Comment>
          ))}
        </Comment.Group>
      </Messages>
    );
  }
}
export default graphql(directMessagesQuery, {
  options: props => ({
    variables: {
      teamId: props.teamId,
      userId: props.userId,
    },
    fetchPolicy: 'network-only',
  }),
})(DirectMessageContainer);
