import React from 'react';
import { extendObservable } from 'mobx';
import { observer } from 'mobx-react';
import {
  Message,
  Form,
  Button,
  Input,
  Container,
  Header,
} from 'semantic-ui-react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

class CreateTeam extends React.Component {
  constructor(props) {
    super(props);

    extendObservable(this, {
      name: '',
      errors: {},
    });
  }

  onSubmit = async () => {
    const { name } = this;
    const response = await this.props.mutate({
      variables: { name },
    });

    const { ok, errors, team } = response.data.createTeam;

    if (ok) {
      this.props.history.push(`/view-team/${team.id}`);
    } else {
      const err = {};
      errors.forEach(({ path, message }) => {
        err[`${path}Error`] = message;
      });

      this.errors = err;
    }
  };

  onChange = e => {
    const { name, value } = e.target;
    this[name] = value;
  };

  render() {
    const { name, errors: { nameError } } = this;

    return (
      <Container text>
        <Header as="h2">Create a Team</Header>
        <Form>
          <Form.Field error={!!nameError}>
            <Input
              name="name"
              onChange={this.onChange}
              value={name}
              placeholder="Team Name"
              fluid
            />
          </Form.Field>
          <Button onClick={this.onSubmit}>Submit</Button>
        </Form>
        {Object.keys(this.errors).length ? (
          <Message
            error
            header="There was some errors with your submission"
            list={[nameError].filter(x => x)}
          />
        ) : null}
      </Container>
    );
  }
}

const createTeamMutation = gql`
  mutation($name: String!) {
    createTeam(name: $name) {
      ok
      team {
        id
      }
      errors {
        path
        message
      }
    }
  }
`;

export default graphql(createTeamMutation)(observer(CreateTeam));
