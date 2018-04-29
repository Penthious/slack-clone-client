import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Comment } from 'semantic-ui-react';
import FileUpload from '../Components/FileUpload';
import Messages from '../Components/Messages';
import { messagesQuery } from '../Graphql/message';

const newChannelMessageSubscription = gql`
  subscription($channelId: Int!) {
    newChannelMessage(channelId: $channelId) {
      id
      text
      user {
        id
        username
      }
      created_at
    }
  }
`;
class MessageContainer extends Component {
  componentWillMount() {
    this.unsubscribe = this.subscribe(this.props.channelId);
  }

  componentWillReceiveProps({ channelId }) {
    console.log(channelId);
    if (this.props.channelId !== channelId) {
      if (this.unsubscribe) {
        this.unsubscribe();
      }
      this.unsubscribe = this.subscribe(channelId);
    }
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  subscribe = channelId =>
    this.props.data.subscribeToMore({
      document: newChannelMessageSubscription,
      variables: {
        channelId,
      },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData) {
          return prev;
        }
        console.log(subscriptionData);

        return {
          ...prev,
          messages: [...prev.messages, subscriptionData.data.newChannelMessage],
        };
      },
    });

  renderMessageGroup = (messages = [], userId) => (
    <Comment.Group>
      {messages.map(
        m =>
          console.log(m) || m.user.id === +userId
            ? this.renderComment(m)
            : this.renderComment(m, {
                display: 'flex',
                flexDirection: 'row-reverse',
              }),
      )}
    </Comment.Group>
  );

  renderComment = (m, styles) => (
    <Comment key={`message-${m.id}`} style={styles}>
      <Comment.Content>
        <Comment.Author as="a">{m.user.username}</Comment.Author>
        <Comment.Metadata>
          <div>{m.created_at}</div>
        </Comment.Metadata>
        <Comment.Text>{m.text}</Comment.Text>
        <Comment.Actions>
          <Comment.Action>Reply</Comment.Action>
        </Comment.Actions>
      </Comment.Content>
    </Comment>
  );

  render() {
    const {
      data: { loading, messages },
      channelId,
      userId,
    } = this.props;
    if (loading) {
      return null;
    }
    console.log(messages, 'messages are here');
    return (
      <FileUpload
        channelId={channelId}
        disableClick
        style={{
          display: 'flex',
          flexDirection: 'column-reverse',
        }}
      >
        <Messages>{this.renderMessageGroup(messages, userId)}</Messages>
      </FileUpload>
    );
  }
}
export default graphql(messagesQuery, {
  variables: props => ({
    channelId: props.channelId,
  }),
  fetchPolicy: 'network-only',
})(MessageContainer);
