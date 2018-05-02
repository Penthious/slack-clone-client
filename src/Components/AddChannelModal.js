import {
  Button,
  Checkbox,
  Form,
  Header,
  Input,
  Modal,
} from 'semantic-ui-react';
import { compose, graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { withFormik } from 'formik';
import React from 'react';
import gql from 'graphql-tag';
import { meQuery } from '../Graphql/team';
import MultiSelectUsers from './MultiSelectUsers';

const AddChannelModal = ({
  close,
  errors,
  handleBlur,
  handleChange,
  handleSubmit,
  isSubmitting,
  open,
  resetForm,
  touched,
  values,
  setFieldValue,
  teamId,
  currentUserId,
}) => (
  <Modal
    open={open}
    onClose={e => {
      resetForm();
      close(e);
    }}
  >
    <Modal.Header>Add Channel</Modal.Header>
    <Modal.Content>
      <Form>
        <Form.Field>
          <Input
            name="name"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            fluid
            placeholder="Channel Name"
          />
        </Form.Field>
        <Form.Field>
          <Checkbox
            toggle
            label="Private"
            value={!values.public}
            onChange={(e, { checked }) => setFieldValue('public', !checked)}
          />
        </Form.Field>
        <Form.Field>
          {!values.public ? (
            <MultiSelectUsers
              placeholder="Select members to invite"
              value={values.members}
              teamId={teamId}
              handleChange={(e, { value }) => setFieldValue('members', value)}
              currentUserId={currentUserId}
            />
          ) : null}
        </Form.Field>
        <Form.Group width="equal">
          <Button
            fluid
            onClick={e => {
              resetForm();
              close(e);
            }}
          >
            Cancel
          </Button>
          <Button fluid disabled={isSubmitting} onClick={handleSubmit}>
            Create Channel
          </Button>
        </Form.Group>
      </Form>
    </Modal.Content>
  </Modal>
);

const createChannelMutation = gql`
  mutation($teamId: Int!, $name: String!, $public: Boolean, $members: [Int!]) {
    createChannel(
      teamId: $teamId
      name: $name
      public: $public
      members: $members
    ) {
      ok
      channel {
        id
        name
        dm
      }
    }
  }
`;

export default compose(
  withRouter,
  graphql(createChannelMutation),
  withFormik({
    mapPropsToValues: () => ({ name: '', public: true, members: [] }),
    handleSubmit: async (
      values,
      { props: { teamId, mutate, close, history }, setSubmitting, setErrors },
    ) => {
      const response = await mutate({
        variables: {
          teamId,
          name: values.name,
          public: values.public,
          members: values.members,
        },
        optimisticResponse: {
          createChannel: {
            __typename: 'Mutation',
            ok: true,
            channel: {
              __typename: 'Channel',
              id: -1,
              name: values.name,
              dm: values.public,
            },
          },
        },
        update: async (store, { data: { createChannel } }) => {
          if (!createChannel.ok) {
            return;
          }
          console.log(createChannel.channel);

          const data = store.readQuery({ query: meQuery });
          data.me.teams
            .filter(team => team.id === teamId)[0]
            .channels.push(createChannel.channel);
          await store.writeQuery({ query: meQuery, data });
          history.push(`/view-team/${teamId}/${createChannel.channel.id}`);
        },
      });

      // setSubmitting(false);
      // close();
    },
  }),
)(AddChannelModal);
