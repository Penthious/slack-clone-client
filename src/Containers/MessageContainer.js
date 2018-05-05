import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Comment } from 'semantic-ui-react';
import FileUpload from '../Components/FileUpload';
import Messages from '../Components/Messages';
import { messagesQuery } from '../Graphql/message';
import RenderText from '../Components/RenderText';

const newChannelMessageSubscription = gql`
  subscription($channelId: Int!) {
    newChannelMessage(channelId: $channelId) {
      id
      text
      user {
        id
        username
      }
      url
      filetype
      created_at
    }
  }
`;
class MessageContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasMoreItems: true,
      fetching: false,
    };
  }
  componentWillMount() {
    this.unsubscribe = this.subscribe(this.props.channelId);
  }

  componentWillReceiveProps({ channelId }) {
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
        if (this.scroller) {
          this.scroller.scrollTop = this.scroller.scrollHeight;
          console.log(this.scroller.scrollHeight);
          console.log(this.scroller.scrollTop);
          console.log(this.scroller.height);
        }

        return {
          ...prev,
          messages: [subscriptionData.data.newChannelMessage, ...prev.messages],
        };
      },
    });

  handleScroll = () => {
    if (this.state.fetching) {
      return false;
    }
    const {
      data: { messages, fetchMore },
      channelId,
    } = this.props;

    if (
      this.scroller &&
      this.scroller.scrollTop < 200 &&
      this.state.hasMoreItems &&
      messages.length >= 35
    ) {
      this.setState({ fetching: true });
      fetchMore({
        variables: {
          channelId,
          cursor: messages[messages.length - 1].id,
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          this.setState({ fetching: false });
          if (!fetchMoreResult) {
            return previousResult;
          }
          if (fetchMoreResult.messages.length < 35) {
            this.setState({ hasMoreItems: false });
          }
          return {
            ...previousResult,
            messages: [...previousResult.messages, ...fetchMoreResult.messages],
          };
        },
      });
    }
  };

  renderMessageGroup = (messages, userId) => (
    <Comment.Group
      style={{
        display: 'flex',
        flexDirection: 'column-reverse',
      }}
    >
      {messages.map(
        m =>
          m.user.id === +userId
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
        {this.renderMessage(m)}
        <Comment.Actions>
          <Comment.Action>Reply</Comment.Action>
        </Comment.Actions>
      </Comment.Content>
    </Comment>
  );

  renderMessage = ({ url, text, filetype }) => {
    if (url) {
      if (filetype.startsWith('image/')) {
        return <img src={url} alt="filetype" />;
      } else if (filetype === 'text/plain') {
        return <RenderText url={url} />;
      } else if (filetype.startsWith('audio/')) {
        return (
          <div>
            <audio controls>
              <source src={url} type={filetype} />
            </audio>
          </div>
        );
      }
    }
    return <Comment.Text>{text}</Comment.Text>;
  };

  render() {
    const {
      data: { loading, messages },
      channelId,
      userId,
    } = this.props;
    if (loading) {
      return null;
    }
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column-reverse',
          maxHeight: '90vh',
          overflow: 'auto',
        }}
        onScroll={this.handleScroll}
        ref={scroller => (this.scroller = scroller)}
      >
        <FileUpload channelId={channelId} disableClick>
          <Messages>{this.renderMessageGroup(messages, userId)}</Messages>
        </FileUpload>
      </div>
    );
  }
}
export default graphql(messagesQuery, {
  options: props => ({
    fetchPolicy: 'network-only',
    variables: {
      channelId: props.channelId,
    },
  }),
})(MessageContainer);
