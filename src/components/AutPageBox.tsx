import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { autState, ResultState } from '../store/aut.reducer';
import AutLogo from './AutLogo';
import { ErrorBox } from './ErrorBox';
import { LoadingProgress } from './LoadingProgress';

export const StyledBox = styled(Box)({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

export const AutPageBox = (props) => {
  const autData = useSelector(autState);

  return (
    <StyledBox>
      <StyledBox sx={{ display: autData.status === ResultState.Loading ? '' : 'none' }}>
        <LoadingProgress />
      </StyledBox>
      <StyledBox sx={{ display: autData.status === ResultState.Idle ? '' : 'none' }}>{props.children}</StyledBox>
      <StyledBox sx={{ display: autData.status === ResultState.Failed ? '' : 'none' }}>
        <ErrorBox />
      </StyledBox>
    </StyledBox>
  );
};
