import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { autState, ResultState } from '../store/aut.reducer';
import { ErrorBox } from './ErrorBox';
import { LoadingProgress } from './LoadingProgress';

export const StyledBox = styled(Box)({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

export const ContentBox = styled(Box)({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'center',
});

export const AutPageBox = (props) => {
  const autData = useSelector(autState);

  return (
    <StyledBox>
      <StyledBox sx={{ display: autData.status === ResultState.Loading ? '' : 'none' }}>
        <LoadingProgress />
      </StyledBox>
      <ContentBox sx={{ display: autData.status === ResultState.Idle ? '' : 'none' }}>{props.children}</ContentBox>
      <StyledBox sx={{ display: autData.status === ResultState.Failed ? '' : 'none' }}>
        <ErrorBox />
      </StyledBox>
    </StyledBox>
  );
};
