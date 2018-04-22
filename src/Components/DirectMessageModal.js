import React from 'react';
import { Button, Input, Modal, Form } from 'semantic-ui-react';
import Downshift from 'downshift';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';

const DirectMessageModal = ({
  open,
  close,
  data: { loading, getTeamMembers },
  teamId,
  history,
}) =>
  console.log(getTeamMembers) || (
    <Modal open={open} onClose={close}>
      <Modal.Header>Add Channel</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Field>
            {!loading && (
              <Downshift
                onChange={selectedUser => {
                  history.push(`/view-team/user/${teamId}/${selectedUser.id}`);
                  close();
                }}
              >
                {({
                  getInputProps,
                  getItemProps,
                  isOpen,
                  inputValue,
                  selectedItem,
                  highlightedIndex,
                }) => (
                  <div>
                    <Input
                      {...getInputProps({ placeholder: 'Search users' })}
                    />
                    {isOpen ? (
                      <div style={{ border: '1px solid black' }}>
                        {getTeamMembers
                          .filter(
                            i =>
                              !inputValue ||
                              i.username
                                .toLowerCase()
                                .includes(inputValue.toLowerCase()),
                          )
                          .map((item, index) => (
                            <div
                              {...getItemProps({ item })}
                              key={item.id}
                              style={{
                                backgroundColor:
                                  highlightedIndex === index ? 'gray' : 'white',
                                fontWeight: selectedItem ? 'bold' : 'normal',
                              }}
                            >
                              {item.username}
                            </div>
                          ))}
                      </div>
                    ) : null}
                  </div>
                )}
              </Downshift>
            )}
          </Form.Field>
          <Form.Group width="equal">
            <Button fluid onClick={close}>
              Cancel
            </Button>
          </Form.Group>
        </Form>
      </Modal.Content>
    </Modal>
  );

const getTeamMembersQuery = gql`
  query($teamId: Int!) {
    getTeamMembers(teamId: $teamId) {
      id
      username
    }
  }
`;
export default withRouter(graphql(getTeamMembersQuery)(DirectMessageModal));
