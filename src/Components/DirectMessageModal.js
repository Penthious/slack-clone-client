import { Button, Input, Modal, Form } from 'semantic-ui-react';
import { graphql, compose } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { withFormik } from 'formik';
import React from 'react';
import gql from 'graphql-tag';
import MultiSelectUsers from './MultiSelectUsers';

const DirectMessageModal = ({
  open,
  close,
  teamId,
  currentUserId,
  values,
  handleSubmit,
  isSubmitting,
  setFieldValue,
  resetForm,
}) => (
  <Modal open={open} onClose={close}>
    <Modal.Header>Add Channel</Modal.Header>
    <Modal.Content>
      <Form>
        <Form.Field>
          <MultiSelectUsers
            values={values.members}
            handleChange={(e, { value }) => setFieldValue('members', value)}
            teamId={teamId}
            placeholder="Select members to message"
            currentUserId={currentUserId}
          />
        </Form.Field>
        <Form.Group width="equal">
          <Button
            disabled={isSubmitting}
            fluid
            onClick={e => {
              resetForm();
              close();
            }}
          >
            Cancel
          </Button>
          <Button disabled={isSubmitting} fluid onClick={handleSubmit}>
            Start Messaging
          </Button>
        </Form.Group>
      </Form>
    </Modal.Content>
  </Modal>
);

const getOrCreateChannelMutation = gql`
  mutation($teamId: Int!, $members: [Int!]!) {
    getOrCreateChannel(teamId: $teamId, members: $members)
  }
`;
export default compose(
  withRouter,
  graphql(getOrCreateChannelMutation),
  withFormik({
    mapPropsToValues: () => ({ members: [] }),
    handleSubmit: async (
      { members },
      { props: { teamId, mutate, close }, setSubmitting, setErrors },
    ) => {
      const response = await mutate({ variables: { members, teamId } });
      setSubmitting(false);
      close();
    },
  }),
)(DirectMessageModal);
