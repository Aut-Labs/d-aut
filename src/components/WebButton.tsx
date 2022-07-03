import { Avatar, Box, Button, ButtonProps, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ReactComponent as Oval } from '../assets/oval.svg';
import { ReactComponent as DarkOval } from '../assets/darker-oval.svg';
import { pxToRem } from '../services/web3/utils';
import { cidToHttpUrl } from '../services/web3/api';

export const RoundedButton = styled(Button)(({ theme }) => ({
  '&.MuiButton-root': {
    padding: '0px',
    height: '60px',
    width: '240px',
    background:
      '#009ADE linear-gradient(270deg, #009fe3 0%, #0399de 8%, #0e8bd3 19%, #2072bf 30%, #3a50a4 41%, #5a2583 53%, #453f94 71%, #38519f 88%, #3458a4 100%) 0% 0%',
    border: `${pxToRem(3)} solid #009FE3`,
    overflow: 'hidden',
    borderRadius: '50px',
    // textDecoration: 'uppercase',
    // color: 'white',
    // textTransform: 'none',
    // letterSpacing: '3px',
    // fontSize: pxToRem(14),
    // '&.Mui-disabled': {
    //   color: 'white',
    //   opacity: '.3',
    // },
    // '&:hover': {
    //   backgroundColor: '#009ADE',
    //   color: 'white',
    // },
  },
}));
export interface WebButtonProps extends ButtonProps {
  userData: any;
}

export const RoundedWebButton = (props: WebButtonProps) => {
  return (
    <RoundedButton
      {...props}
      sx={{
        ':hover': {
          background: '#009ADE',
        },
        '&&.MuiTouchRipple-child': {
          backgroundColor: '#5A2583',
        },
      }}
    >
      <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
        <Box
          sx={{
            width: '100%',
            height: '100%',
            position: 'relative',
            zIndex: '101',
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}
        >
          {props.userData ? (
            <Box
              sx={{
                height: '100%',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Typography sx={{ ml: '18px', color: '#FFF' }} variant="h4">
                {props.userData.name}
              </Typography>
              <Box
                component="img"
                sx={{
                  width: '77px',
                  maxWidth: '100%',
                }}
                alt="User image."
                src={cidToHttpUrl(props.userData.image)}
              />
            </Box>
          ) : (
            <Typography sx={{ ml: '18px', color: '#FFF' }} variant="h4">
              Connect with aut
            </Typography>
          )}
        </Box>
        <Box sx={{ zIndex: '100', position: 'absolute' }}>
          <Box sx={{ transform: 'translate(116px, -109px)' }}>
            <Oval />
          </Box>
          <Box sx={{ transform: 'translate(181px, -230px)' }}>
            <DarkOval />
          </Box>
        </Box>
      </Box>
    </RoundedButton>
  );
};
