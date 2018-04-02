import React from 'react';
import { Button, Input, Header, Modal, Form } from 'semantic-ui-react';
import { withFormik } from 'formik';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import { meQuery } from '../Graphql/team';

const AddChannelModal = ({
  open,
  close,
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  handleSubmit,
  isSubmitting,
}) => (
  <Modal open={open} onClose={close}>
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
        <Form.Group width="equal">
          <Button fluid onClick={close}>
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
  mutation($teamId: Int!, $name: String!) {
    createChannel(teamId: $teamId, name: $name) {
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
    mapPropsToValues: () => ({ name: '' }),
    handleSubmit: async (
      values,
      { props: { teamId, mutate, close }, setSubmitting, setErrors },
    ) => {
      const response = await mutate({
        variables: { teamId, name: values.name },
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
