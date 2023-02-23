/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/no-unstable-nested-components */
import { Avatar, Box } from '@mui/material';
import { styled } from '@mui/system';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { ReactComponent as UploadIcon } from '../assets/upload-icon.svg';
import { FormHelperText } from './Fields';
import { pxToRem } from '../utils/utils';

const UploadWrapper = styled('div')({
  height: '90px',
  width: '90px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  border: '1px solid #FFF',
  marginTop: '30px',
  cursor: 'pointer',
  position: 'relative',
});

const Action = styled('div')(({ theme }) => ({
  opacity: 0,
  '&.show': {
    opacity: 1,
  },
  width: '100%',
  height: '100%',
  position: 'absolute',
  display: 'flex',
  top: 0,
  left: 0,
  alignItems: 'center',
  justifyContent: 'center',
  transition: `${(theme.transitions as any).create(['opacity', 'transform'])}`,
  '.MuiAvatar-fallback': {
    fill: theme.palette.text.primary,
  },
  '.MuiSvgIcon-root': {
    width: '1.5em',
    height: '1.5em',
    '&.remove': {
      color: theme.palette.error.main,
    },
    '&.upload': {
      fill: theme.palette.primary.main,
    },
  },
}));

const errorTypes = {
  fileSize: (
    <>
      Image too large!
      <br /> Max size is 8Mb.
    </>
  ),
  required: 'Avatar is required!',
};

const AutFileUpload = ({ fileChange = (file: File) => null, initialPreviewUrl = null, name, errors }) => {
  const [preview, setPreview] = useState(initialPreviewUrl);
  const [showAction, setShowAction] = useState(false);
  const { getRootProps, getInputProps, open } = useDropzone({
    noClick: true,
    multiple: false,
    noKeyboard: true,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
    },
    onDrop: ([file]) => {
      const url = URL.createObjectURL(file);
      setPreview(url);
      fileChange(file);
    },
  });

  const handleActionClick = () => {
    if (preview) {
      setPreview(null);
      fileChange(null);
    } else {
      open();
    }
  };

  const toggleActions = (show: boolean) => {
    setShowAction(show);
  };

  return (
    <UploadWrapper
      onMouseEnter={() => toggleActions(true)}
      onMouseLeave={() => toggleActions(false)}
      onClick={handleActionClick}
      className="container"
    >
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
      </div>
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar
          alt="Avatar"
          variant="square"
          src={preview}
          sx={{
            display: `${errors.length > 0 ? 'none' : ''}`,
            cursor: 'pointer',
            background: 'transparent',
            height: '100%',
            width: '100%',
            '&.MuiAvatar-root': {
              justifyContent: 'center',
            },
          }}
          imgProps={{
            style: {
              maxHeight: '100%',
              maxWidth: '100%',
              objectFit: 'cover',
            },
          }}
        >
          <UploadIcon height="32px" />
        </Avatar>
        <Action className={`${showAction ? 'show' : ''}`}>{preview ? <HighlightOffIcon className="remove" /> : null}</Action>
        <FormHelperText errorTypes={errorTypes} name={name} errors={errors} positionAbsolute={false} />
      </div>
    </UploadWrapper>
  );
};

export default AutFileUpload;
