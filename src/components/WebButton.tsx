import { Box, Button, ButtonProps, Menu, MenuItem, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ReactComponent as Oval } from '../assets/oval.svg';
import { ReactComponent as DarkOval } from '../assets/darker-oval.svg';
import { ReactComponent as BlackOval } from '../assets/oval-black.svg';
import { ReactComponent as WhiteOval } from '../assets/oval-white.svg';
import { ReactComponent as DisconnectIconGradient } from '../assets/disconnect/disconnect-vaporwave.svg';
import { ReactComponent as DisconnectIconBlack } from '../assets/disconnect/disconnect-black.svg';
import { ReactComponent as DisconnectIconWhite } from '../assets/disconnect/disconnect-white.svg';
import { pxToRem } from '../services/web3/utils';
import { ipfsCIDToHttpUrl } from '../services/storage/storage.hub';
import { useSelector } from 'react-redux';
import { user } from '../store/aut.reducer';
import { useState } from 'react';
import { borderColor } from '@mui/system';

export const RoundedButton = styled(Button)(({ theme }) => ({
  '&.MuiButton-root': {
    padding: '0px',
    height: '50px',
    width: '220px',
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

export const RoundedButtonBlackBorder = styled(Button)(({ theme }) => ({
  '&.MuiButton-root': {
    padding: '0px',
    height: '50px',
    width: '220px',
    border: `${pxToRem(3)} solid #000`,
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

export const RoundedButtonWhiteBorder = styled(Button)(({ theme }) => ({
  '&.MuiButton-root': {
    padding: '0px',
    height: '50px',
    width: '220px',
    border: `${pxToRem(3)} solid #FFF`,
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

export const SquareButtonGradienBorder = styled(Button)(({ theme }) => ({
  '&.MuiButton-root': {
    padding: '0px',
    height: '50px',
    width: '220px',
    overflow: 'hidden',
    border: `${pxToRem(3)} solid`,
    borderImage:
      'linear-gradient(45.57deg, #009fe3 0%, #0399de 8%, #0e8bd3 19%, #2072bf 30%, #3a50a4 41%, #5a2583 53%, #453f94 71%, #38519f 88%, #3458a4 100%) 1',
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

export const SquareButtonBlackBorder = styled(Button)(({ theme }) => ({
  '&.MuiButton-root': {
    padding: '0px',
    height: '50px',
    width: '220px',
    overflow: 'hidden',
    border: `${pxToRem(3)} solid #000`,
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

export const SquareButtonWhiteBorder = styled(Button)(({ theme }) => ({
  '&.MuiButton-root': {
    padding: '0px',
    height: '50px',
    width: '220px',
    overflow: 'hidden',
    border: `${pxToRem(3)} solid #FFF`,
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

export const SquareButton = styled(Button)(({ theme }) => ({
  '&.MuiButton-root': {
    padding: '0px',
    height: '50px',
    width: '220px',
    overflow: 'hidden',
    border: `${pxToRem(3)} solid #009FE3`,
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

const menuButtonColors = {
  'round-bright': {
    backgroundColor: 'transparent',
    borderColor: '#009FE3',
    textColor: '#000',
    backgroundHover: '#009FE309',
    disconnectIcon: <DisconnectIconGradient />,
  },
  'square-bright': {
    backgroundColor: 'transparent',
    borderColor: '#009FE3',
    backgroundHover: '#009FE309',
    textColor: '#000',
    disconnectIcon: <DisconnectIconGradient />,
  },
  'square-dark': {
    backgroundColor: 'transparent',
    borderColor: '#000',
    backgroundHover: '#6A6A6A09',
    textColor: '#000',
    disconnectIcon: <DisconnectIconBlack />,
  },
  'round-dark': {
    backgroundColor: 'transparent',
    borderColor: '#000',
    backgroundHover: '#6A6A6A09',
    textColor: '#000',
    disconnectIcon: <DisconnectIconBlack />,
  },
  'round-light': {
    backgroundColor: 'transparent',
    borderColor: '#FFF',
    backgroundHover: '#6A6A6A',
    textColor: '#FFF',
    disconnectIcon: <DisconnectIconWhite />,
  },
  'square-light': {
    backgroundColor: 'transparent',
    borderColor: '#FFF',
    backgroundHover: '#6A6A6A',
    textColor: '#FFF',
    disconnectIcon: <DisconnectIconWhite />,
  },
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
      {props.buttontype === 'round-bright' && (
        <RoundedButton
          onMouseEnter={handleMouseEnter}
          onClick={props.onClick}
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
                  <Typography sx={{ color: '#FFF', width: '100%' }} variant="body1">
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
                <Typography sx={{ ml: '18px', color: '#FFF' }} variant="h4">
                  Connect with āut
                </Typography>
              )}
            </Box>
            <Box sx={{ zIndex: '100', position: 'absolute' }}>
              <Box sx={{ transform: 'translate(116px, -109px)' }}>
                <Oval />
              </Box>
              <Box sx={{ transform: 'translate(157px, -230px)' }}>
                <DarkOval />
              </Box>
            </Box>
          </Box>
        </RoundedButton>
      )}
      {props.buttontype === 'square-bright' && (
        <SquareButton
          onMouseEnter={handleMouseEnter}
          onClick={props.onClick}
          sx={{
            background:
              '#009ADE linear-gradient(270deg, #009fe3 0%, #0399de 8%, #0e8bd3 19%, #2072bf 30%, #3a50a4 41%, #5a2583 53%, #453f94 71%, #38519f 88%, #3458a4 100%) 0% 0%',
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
                  <Typography sx={{ color: '#FFF', width: '100%' }} variant="body1">
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
                <Typography textAlign="center" sx={{ width: '100%', color: '#FFF' }} variant="body1">
                  Connect with āut
                </Typography>
              )}
            </Box>
            <Box sx={{ zIndex: '100', position: 'absolute' }}>
              <Box sx={{ transform: 'translate(100px, -109px)' }}>
                <Oval />
              </Box>
              <Box sx={{ transform: 'translate(147px, -230px)' }}>
                <DarkOval />
              </Box>
            </Box>
          </Box>
        </SquareButton>
      )}
      {props.buttontype === 'square-dark' && (
        <SquareButtonBlackBorder
          onClick={props.onClick}
          onMouseEnter={handleMouseEnter}
          sx={{
            background: '#000',
            ':hover': {
              background: `${userData ? '#000' : '#6A6A6A'}`,
            },
            '&&.MuiTouchRipple-child': {
              backgroundColor: '#333333',
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
                  <Typography sx={{ color: '#FFF', width: '100%' }} variant="body1">
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
                <Typography textAlign="center" sx={{ width: '100%', color: '#FFF' }} variant="body1">
                  Connect with āut
                </Typography>
              )}
            </Box>
            {!userData && (
              <Box sx={{ zIndex: '100', position: 'absolute' }}>
                <Box sx={{ transform: 'translate(100px, -109px)' }}>
                  <Oval />
                </Box>
                <Box sx={{ transform: 'translate(147px, -230px)' }}>
                  <DarkOval />
                </Box>
              </Box>
            )}
          </Box>
        </SquareButtonBlackBorder>
      )}
      {props.buttontype === 'round-dark' && (
        <RoundedButtonBlackBorder
          onClick={props.onClick}
          onMouseEnter={handleMouseEnter}
          sx={{
            background: '#000',
            ':hover': {
              background: `${userData ? '#000' : '#6A6A6A'}`,
            },
            '&&.MuiTouchRipple-child': {
              backgroundColor: '#333333',
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
                  <Typography sx={{ color: '#FFF', width: '100%' }} variant="body1">
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
                <Typography textAlign="center" sx={{ width: '100%', color: '#FFF' }} variant="body1">
                  Connect with āut
                </Typography>
              )}
            </Box>
            <Box sx={{ zIndex: '100', position: 'absolute' }}>
              <Box sx={{ transform: 'translate(100px, -109px)' }}>
                <Oval />
              </Box>
              <Box sx={{ transform: 'translate(147px, -230px)' }}>
                <DarkOval />
              </Box>
            </Box>
          </Box>
        </RoundedButtonBlackBorder>
      )}
      {props.buttontype === 'round-light' && (
        <RoundedButtonWhiteBorder
          onClick={props.onClick}
          onMouseEnter={handleMouseEnter}
          sx={{
            background: '#FFF',
            ':hover': {
              background: '#BABABA',
            },
            '&&.MuiTouchRipple-child': {
              backgroundColor: '#6A6A6A',
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
                  <Typography sx={{ color: '#000', width: '100%' }} variant="body1">
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
                <Typography textAlign="center" sx={{ width: '100%', color: '#000' }} variant="body1">
                  Connect with āut
                </Typography>
              )}
            </Box>
            <Box sx={{ zIndex: '100', position: 'absolute' }}>
              <Box sx={{ transform: 'translate(100px, -109px)' }}>
                <Oval />
              </Box>
              <Box sx={{ transform: 'translate(147px, -230px)' }}>
                <BlackOval />
              </Box>
            </Box>
          </Box>
        </RoundedButtonWhiteBorder>
      )}
      {props.buttontype === 'square-light' && (
        <SquareButtonWhiteBorder
          onClick={props.onClick}
          onMouseEnter={handleMouseEnter}
          sx={{
            background: '#FFF',
            ':hover': {
              background: '#BABABA',
            },
            '&&.MuiTouchRipple-child': {
              backgroundColor: '#6A6A6A',
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
                  <Typography sx={{ color: '#000', width: '100%' }} variant="body1">
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
                <Typography textAlign="center" sx={{ width: '100%', color: '#000' }} variant="body1">
                  Connect with āut
                </Typography>
              )}
            </Box>
            <Box sx={{ zIndex: '100', position: 'absolute' }}>
              <Box sx={{ transform: 'translate(100px, -109px)' }}>
                <Oval />
              </Box>
              <Box sx={{ transform: 'translate(147px, -230px)' }}>
                <BlackOval />
              </Box>
            </Box>
          </Box>
        </SquareButtonWhiteBorder>
      )}
      {(props.buttontype === 'simple' || !buttonTypes.includes(props.buttontype)) && (
        <SquareButtonGradienBorder
          onClick={props.onClick}
          onMouseEnter={handleMouseEnter}
          sx={{
            background: '#000',
            ':hover': {
              background: '#000',
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
                  <Typography sx={{ color: '#FFF', width: '100%' }} variant="body1">
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
                <Typography textAlign="center" sx={{ width: '100%', color: '#FFF' }} variant="body1">
                  Connect with āut
                </Typography>
              )}
            </Box>
          </Box>
        </SquareButtonGradienBorder>
      )}
      <Menu
        sx={{
          '& .MuiPaper-root': {
            backgroundColor: 'transparent',
            ml: pxToRem(32),
            boxShadow: 'none',
            // borderBottom: `${pxToRem(3)} solid ${menuButtonColors[props.buttontype].borderColor}`,
            // borderRight: `${pxToRem(3)} solid ${menuButtonColors[props.buttontype].borderColor}`,
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
            // borderWidth: `0px ${pxToRem(3)} ${pxToRem(3)} 0px`,
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
            // '&:hover': {
            //   opacity: '0.09',
            //   backgroundColor: menuButtonColors[props.buttontype].backgroundHover,
            //   '& .buttonOptionText': {},
            // },

            height: pxToRem(35),
            width: pxToRem(140),
            '&:hover': {
              backgroundColor: menuButtonColors[props.buttontype].backgroundHover,
            },
          },
          // boxShadow: 'rgba(0, 0, 0, 0.2) 0px 3px 1px -2px, rgba(0, 0, 0, 0.14) 0px 2px 2px 0px, rgba(0, 0, 0, 0.12) 0px 1px 5px 0px',
          // ...dropdownStyles,
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
