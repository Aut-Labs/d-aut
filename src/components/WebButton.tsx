import { Box, Button, ButtonProps, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ReactComponent as Oval } from '../assets/oval.svg';
import { ReactComponent as DarkOval } from '../assets/darker-oval.svg';
import { ReactComponent as BlackOval } from '../assets/oval-black.svg';
import { pxToRem } from '../services/web3/utils';
import { ipfsCIDToHttpUrl } from '../services/storage/storage.hub';
import { useSelector } from 'react-redux';
import { user } from '../store/aut.reducer';

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

interface WebCompButtonProps extends ButtonProps {
  buttontype?: string;
}

export const RoundedWebButton = (props: WebCompButtonProps) => {
  const userData = useSelector(user);
  return (
    <>
      {props.buttontype === 'simple' && (
        <SquareButtonGradienBorder
          {...props}
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
                  <Typography sx={{ ml: '18px', color: '#FFF' }} variant="h4">
                    {userData.name}
                  </Typography>
                  <Box
                    component="img"
                    sx={{
                      width: '77px',
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
      {props.buttontype === 'square-bright' && (
        <SquareButton
          {...props}
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
                  <Typography sx={{ ml: '18px', color: '#FFF' }} variant="body1">
                    {userData.name}
                  </Typography>
                  <Box
                    component="img"
                    sx={{
                      width: '77px',
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
          {...props}
          sx={{
            background: '#000',
            ':hover': {
              background: '#6A6A6A',
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
                  <Typography sx={{ ml: '18px', color: '#FFF' }} variant="body1">
                    {userData.name}
                  </Typography>
                  <Box
                    component="img"
                    sx={{
                      width: '77px',
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
        </SquareButtonBlackBorder>
      )}
      {props.buttontype === 'round-dark' && (
        <RoundedButtonBlackBorder
          {...props}
          sx={{
            background: '#000',
            ':hover': {
              background: '#6A6A6A',
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
                  <Typography sx={{ ml: '18px', color: '#FFF' }} variant="body1">
                    {userData.name}
                  </Typography>
                  <Box
                    component="img"
                    sx={{
                      width: '77px',
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
      {props.buttontype === 'round-white' && (
        <RoundedButtonWhiteBorder
          {...props}
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
                  <Typography sx={{ ml: '18px', color: '#FFF' }} variant="body1">
                    {userData.name}
                  </Typography>
                  <Box
                    component="img"
                    sx={{
                      width: '77px',
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
                <BlackOval />
              </Box>
            </Box>
          </Box>
        </RoundedButtonWhiteBorder>
      )}
      {props.buttontype === 'square-white' && (
        <SquareButtonWhiteBorder
          {...props}
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
                  <Typography sx={{ ml: '18px', color: '#FFF' }} variant="body1">
                    {userData.name}
                  </Typography>
                  <Box
                    component="img"
                    sx={{
                      width: '77px',
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
                <BlackOval />
              </Box>
            </Box>
          </Box>
        </SquareButtonWhiteBorder>
      )}
      {props.buttontype === null && (
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
                  <Typography sx={{ ml: '18px', color: '#FFF' }} variant="h4">
                    {userData.name}
                  </Typography>
                  <Box
                    component="img"
                    sx={{
                      width: '77px',
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
