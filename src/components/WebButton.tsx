import { Box, Button, ButtonProps, Menu, MenuItem, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ReactComponent as Oval } from '../assets/oval.svg';
import { ReactComponent as DarkOval } from '../assets/darker-oval.svg';
import { ReactComponent as BlackOval } from '../assets/oval-black.svg';
import { ReactComponent as DisconnectIconGradient } from '../assets/disconnect/disconnect-vaporwave.svg';
import { ReactComponent as DisconnectIconBlack } from '../assets/disconnect/disconnect-black.svg';
import { ReactComponent as DisconnectIconWhite } from '../assets/disconnect/disconnect-white.svg';
import { pxToRem } from '../services/web3/utils';
import { ipfsCIDToHttpUrl } from '../services/storage/storage.hub';
import { useSelector } from 'react-redux';
import { user } from '../store/aut.reducer';
import { useState } from 'react';
import { AutButton } from './AutButton';
import { BorderColor } from '@mui/icons-material';

const menuButtonColors = {
  simple: {
    borderImage:
      'linear-gradient(45.57deg, #009fe3 0%, #0399de 8%, #0e8bd3 19%, #2072bf 30%, #3a50a4 41%, #5a2583 53%, #453f94 71%, #38519f 88%, #3458a4 100%) 1',
    backgroundColor: '#000',
    borderColor: 'none',
    backgroundHover: '#6FA1C3',
    textColor: '#FFF',
    disconnectIcon: <DisconnectIconWhite />,
  },
};

interface WebCompButtonProps extends ButtonProps {
  buttontype?: string;
  menuClick?: any;
  container?: any;
}

const buttonTypes = ['round-bright', 'square-bright', 'square-dark', 'round-dark', 'round-light', 'square-light', 'simple'];

export const RoundedWebButton = (props: WebCompButtonProps) => {
  const userData = useSelector(user);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMouseEnter = (event) => {
    if (anchorEl !== event.currentTarget && userData) {
      setAnchorEl(props.container);
    }
  };

  const handleHideMenu = () => {
    setAnchorEl(null);
  };

  const handleDisconnectClick = () => {
    props.menuClick();
    handleHideMenu();
  };

  return (
    <>
      <AutButton size="normal" variant="outlined" onClick={props.onClick} onMouseEnter={handleMouseEnter}>
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
            {userData ? (
              <Box
                sx={{
                  height: '100%',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Typography
                  sx={{
                    fontFamily: 'FractulAltLight',
                  }}
                  variant="body1"
                >
                  {userData.name}
                </Typography>
                <Box
                  component="img"
                  sx={{
                    width: pxToRem(50),
                    maxWidth: '100%',
                  }}
                  alt="User image."
                  // Make this not the badge
                  src={ipfsCIDToHttpUrl(userData.properties.avatar)}
                />
              </Box>
            ) : (
              <Typography
                sx={{
                  fontFamily: 'FractulAltLight',
                }}
                variant="body"
              >
                Connect with āut
              </Typography>
            )}
          </Box>
        </Box>
      </AutButton>
      <Menu
        sx={{
          '& .MuiPaper-root': {
            backgroundColor: 'transparent',
            ml: pxToRem(32),
            boxShadow: 'none',
          },
          '& .MuiMenu-list': {
            '&.MuiTouchRipple-child': {
              backgroundColor: 'red',
            },
            padding: '0px',
          },
          '.MuiBackdrop-root': {
            backdropFilter: 'none',
          },
          '& .buttonOption': {
            border: `${pxToRem(3)} solid`,
            borderTop: '0px',
            borderLeft: '0px',
            borderColor: menuButtonColors[props.buttontype].borderColor,
            borderImage: menuButtonColors[props.buttontype].borderImage,
            backgroundColor: menuButtonColors[props.buttontype].backgroundColor,
            '& .MuiButton-startIcon': {
              ml: pxToRem(7),
            },
            cursor: 'pointer',
            '& .buttonOptionText': {
              color: menuButtonColors[props.buttontype].textColor,
              mt: pxToRem(1),
              textTransform: 'none',
              fontSize: pxToRem(12),
            },
            height: pxToRem(35),
            width: pxToRem(140),
            '&:hover': {
              backgroundColor: menuButtonColors[props.buttontype].backgroundHover,
            },
          },
        }}
        container={props.container}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleHideMenu}
        MenuListProps={{ onMouseLeave: handleHideMenu }}
      >
        <MenuItem sx={{ p: '0px' }}>
          <Button startIcon={menuButtonColors[props.buttontype].disconnectIcon} className="buttonOption" onClick={handleDisconnectClick}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
              <Typography className="buttonOptionText" variant="h4" color="#FFFFFF">
                Disconnect
              </Typography>
            </Box>
          </Button>
        </MenuItem>
      </Menu>
    </>
  );
};

// export const SquareWebButton = (props: WebButtonProps) => {
//   return (
//     <SquareButton
//       {...props}
//       sx={{
//         ':hover': {
//           background: '#009ADE',
//         },
//         '&&.MuiTouchRipple-child': {
//           backgroundColor: '#5A2583',
//         },
//       }}
//     >
//       <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
//         <Box
//           sx={{
//             width: '100%',
//             height: '100%',
//             position: 'relative',
//             zIndex: '101',
//             display: 'flex',
//             justifyContent: 'flex-start',
//             alignItems: 'center',
//           }}
//         >
//           {props.userData ? (
//             <Box
//               sx={{
//                 height: '100%',
//                 width: '100%',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'space-between',
//               }}
//             >
//               <Typography sx={{ ml: '18px', color: '#FFF' }} variant="h4">
//                 {props.userData.name}
//               </Typography>
//               <Box
//                 component="img"
//                 sx={{
//                   width: '77px',
//                   maxWidth: '100%',
//                 }}
//                 alt="User image."
//                 // Make this not the badge
//                 src={ipfsCIDToHttpUrl(props.userData.properties.avatar)}
//               />
//             </Box>
//           ) : (
//             <Typography sx={{ ml: '18px', color: '#FFF' }} variant="h4">
//               Connect with āut
//             </Typography>
//           )}
//         </Box>
//         <Box sx={{ zIndex: '100', position: 'absolute' }}>
//           <Box sx={{ transform: 'translate(116px, -109px)' }}>
//             <Oval />
//           </Box>
//           <Box sx={{ transform: 'translate(157px, -230px)' }}>
//             <DarkOval />
//           </Box>
//         </Box>
//       </Box>
//     </SquareButton>
//   );
// };
