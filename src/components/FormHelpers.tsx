import { Box, styled } from '@mui/material';

export const FormWrapper = styled('form')({
  padding: '0 20px',
  width: 'calc(100% - 40px)',
  flex: '1',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  alignItems: 'center',
});

export const FormContent = styled(Box)({
  maxWidth: '380px',
  display: 'flex',
  gridGap: '20px',
  justifyContent: 'center',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  flex: 1,
});

export const FormAction = styled(Box)({
  marginBottom: '30px',
});
