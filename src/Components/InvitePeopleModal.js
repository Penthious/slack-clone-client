import React from 'react';
import { Button, Input, Header, Modal, Form } from 'semantic-ui-react';
import { withFormik } from 'formik';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import normalizeErrors from '../normalizeErrors';

const InvitePeopleModal = ({
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
    <Modal.Header>Add People to your team</Modal.Header>
    <Modal.Content>
      <Form>
        <Form.Field>
          <Input
            name="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            fluid
            placeholder="User's email"
          />
        </Form.Field>
        {touched.email && errors.email ? errors.email[0] : null}
        <Form.Group width="equal">
          <Button fluid onClick={close}>
            Cancel
          </Button>
          <Button fluid disabled={isSubmitting} onClick={handleSubmit}>
            Add User
          </Button>
        </Form.Group>
      </Form>
    </Modal.Content>
  </Modal>
);

const addTeamMemberMutation = gql`
  mutation($email: String!, $teamId: Int!) {
    addTeamMember(email: $email, teamId: $teamId) {
      ok
      errors {
        path
        message
      }
    }
  }
`;

export default compose(
  graphql(addTeamMemberMutation),
  withFormik({
    mapPropsToValues: () => ({ email: '' }),
    handleSubmit: async (
      values,
      { props: { teamId, mutate, close }, setSubmitting, setErrors },
    ) => {
      const response = await mutate({
        variables: { teamId, email: values.email },
      });
      const { ok, errors } = response.data.addTeamMember;
      setSubmitting(false);
      if (ok) {
        close();
      } else {
        setErrors(
          normalizeErrors(
            errors.map(
              e =>
                e.message === 'user_id must be unique'
                  ? {
                      path: 'email',
                      message: 'This user is already part of the team',
                    }
                  : e,
            ),
          ),
        );
      }
      console.log(response);
    },
  }),
)(InvitePeopleModal);
