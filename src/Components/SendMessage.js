import React from 'react';
import styled from 'styled-components';
import { Input } from 'semantic-ui-react';
import { withFormik } from 'formik';
import gql from 'graphql-tag';
import { compose, graphql } from 'react-apollo';

const ENTER_KEY = 13;
const SendMessage = ({
  channelName,
  isSubmitting,
  handleBlur,
  handleSubmit,
  handleChange,
  values,
}) => (
  <SendMessageWrapper>
    <Input
      name="message"
      value={values.message}
      onKeyDown={e => {
        if (e.keyCode === ENTER_KEY && !isSubmitting) {
          handleSubmit(e);
        }
      }}
      onBlur={handleBlur}
      onChange={handleChange}
      type="text"
      placeholder={`Message #${channelName}`}
      fluid
    />
  </SendMessageWrapper>
);

const SendMessageWrapper = styled.div`
  grid-column: 3;
  grid-row: 3;
  margin: 20px;
`;

const createMessageMutation = gql`
  mutation($channelId: Int!, $text: String!) {
    createMessage(channelId: $channelId, text: $text)
  }
`;

export default compose(
  graphql(createMessageMutation),
  withFormik({
    mapPropsToValues: () => ({ message: '' }),
    handleSubmit: async (
      values,
      { props: { channelId, mutate }, resetForm, setSubmitting, setErrors },
    ) => {
      if (!values.message || !values.message.trim()) {
        setSubmitting(false);
        return;
      }
      const response = await mutate({
        variables: { channelId, text: values.message },
      });

      resetForm();
    },
  }),
)(SendMessage);
