import {
  Button,
  Checkbox,
  Form,
  Header,
  Input,
  Modal,
} from 'semantic-ui-react';
import { compose, graphql } from 'react-apollo';
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
      }
    }
  }
`;

export default compose(
  graphql(createChannelMutation),
  withFormik({
    mapPropsToValues: () => ({ name: '', public: true, members: [] }),
    handleSubmit: async (
      values,
      { props: { teamId, mutate, close }, setSubmitting, setErrors },
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
            },
          },
        },
        update: (store, { data: { createChannel } }) => {
          if (!createChannel.ok) {
            return;
          }

          const data = store.readQuery({ query: meQuery });
          data.me.teams
            .filter(team => team.id === teamId)[0]
            .channels.push(createChannel.channel);
          store.writeQuery({ query: meQuery, data });
        },
      });

      setSubmitting(false);
      close();
    },
  }),
)(AddChannelModal);
