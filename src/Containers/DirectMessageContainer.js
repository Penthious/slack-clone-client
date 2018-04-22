import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Comment } from 'semantic-ui-react';
import Messages from '../Components/Messages';
import { directMessagesQuery } from '../Graphql/message';

class DirectMessageContainer extends Component {
  // componentWillMount() {
  //   this.unsubscribe = this.subscribe(this.props.channelId);
  // }
  //
  // componentWillReceiveProps({ channelId }) {
  //   console.log(channelId);
  //   if (this.props.channelId !== channelId) {
  //     if (this.unsubscribe) {
  //       this.unsubscribe();
  //     }
  //     this.unsubscribe = this.subscribe(channelId);
  //   }
  // }
  //
  // componentWillUnmount() {
  //   if (this.unsubscribe) {
  //     this.unsubscribe();
  //   }
  // }
  //
  // subscribe = channelId =>
  //   this.props.data.subscribeToMore({
  //     document: newChannelMessageSubscription,
  //     variables: {
  //       channelId,
  //     },
  //     updateQuery: (prev, { subscriptionData }) => {
  //       if (!subscriptionData) {
  //         return prev;
  //       }
  //
  //       return {
  //         ...prev,
  //         messages: [...prev.messages, subscriptionData.data.newChannelMessage],
  //       };
  //     },
  //   });

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
  variables: props => ({
    teamId: props.teamId,
    userId: props.userId,
  }),
  fetchPolicy: 'network-only',
})(DirectMessageContainer);
