import React from 'react';
import Dropzone from 'react-dropzone';
import { Mutation } from 'react-apollo';
import { createFileMessageMutation } from '../Graphql/message';

const FileUpload = ({ children, channelId, ...props }) => (
  <Mutation mutation={createFileMessageMutation}>
    {mutate => (
      <Dropzone
        className="ignore"
        {...props}
        onDrop={([file]) => mutate({ variables: { file, channelId } })}
      >
        {children}
      </Dropzone>
    )}
  </Mutation>
);

export default FileUpload;
