import { Button, Input, Modal, Form } from 'semantic-ui-react';
import { graphql, compose } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { withFormik } from 'formik';
import React from 'react';
import gql from 'graphql-tag';
import MultiSelectUsers from './MultiSelectUsers';
import { meQuery } from '../Graphql/team';

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
    <Modal.Header>Direct Messaging</Modal.Header>
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
    getOrCreateChannel(teamId: $teamId, members: $members) {
      id
      name
      ok
    }
  }
`;
export default compose(
  withRouter,
  graphql(getOrCreateChannelMutation),
  withFormik({
    mapPropsToValues: () => ({ members: [] }),
    handleSubmit: async (
      { members },
      { props: { history, teamId, mutate, close }, resetForm, setErrors },
    ) => {
      const response = await mutate({
        variables: { members, teamId },
        update: async (store, { data: { getOrCreateChannel } }) => {
          const { id, name, ok } = getOrCreateChannel;
          console.log(id, name, ok, 'updated');

          if (!ok && id) {
            close();
            return history.push(`/view-team/${teamId}/${id}`);
          } else if (!ok) {
            return;
          }

          const data = store.readQuery({ query: meQuery });
          const team = data.me.teams.filter(t => t.id === teamId)[0];
          const notInChannelList = team.channels.every(c => c.id !== id);
          console.log(notInChannelList, 'not in channel');

          if (notInChannelList) {
            team.channels.push({
              __typename: 'Channel',
              id,
              name,
              dm: true,
            });
            await store.writeQuery({ query: meQuery, data });
            close();
            return history.push(`/view-team/${teamId}/${id}`);
          }
        },
      });
    },
  }),
)(DirectMessageModal);
