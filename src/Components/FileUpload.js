import React from 'react';
import Dropzone from 'react-dropzone';

const FileUpload = ({ children, ...props }) => (
  <Dropzone
    className="ignore"
    {...props}
    onDrop={() => console.log('file drop')}
  >
    {children}
  </Dropzone>
);

export default FileUpload;
