import React from 'react';
import styled from 'styled-components';
import { Input, Button, Icon } from 'semantic-ui-react';
import { withFormik } from 'formik';

import FileUpload from './FileUpload';

const ENTER_KEY = 13;
const SendMessage = ({
  placeholder,
  isSubmitting,
  handleBlur,
  handleSubmit,
  handleChange,
  values,
  channelId,
}) => (
  <SendMessageWrapper>
    <FileUpload channelId={channelId}>
      <Button icon>
        <Icon name="plus" />
      </Button>
    </FileUpload>
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
      placeholder={`Message #${placeholder}`}
    />
  </SendMessageWrapper>
);

const SendMessageWrapper = styled.div`
  grid-column: 3;
  grid-row: 3;
  margin: 20px;
  display: grid;
  grid-template-columns: 50px 97% 1fr;
`;

export default withFormik({
  mapPropsToValues: () => ({ message: '' }),
  handleSubmit: async (
    values,
    { props: { onSubmit }, resetForm, setSubmitting, setErrors },
  ) => {
    if (!values.message || !values.message.trim()) {
      setSubmitting(false);
      return;
    }
    await onSubmit(values.message);
    resetForm();
  },
})(SendMessage);
