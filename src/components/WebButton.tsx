import { Box, Button, ButtonProps, Menu, MenuItem, MenuProps, Typography } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import { ReactComponent as Oval } from '../assets/oval.svg';
import { ReactComponent as DarkOval } from '../assets/darker-oval.svg';
import { ReactComponent as BlackOval } from '../assets/oval-black.svg';
import { ReactComponent as DisconnectIconGradient } from '../assets/disconnect/disconnect-vaporwave.svg';
import { ReactComponent as DisconnectIconBlack } from '../assets/disconnect/disconnect-black.svg';
import { ReactComponent as DisconnectIconWhite } from '../assets/disconnect/disconnect-white.svg';
import { ipfsCIDToHttpUrl } from '../services/storage/storage.hub';
import { useSelector } from 'react-redux';
import { user } from '../store/aut.reducer';
import { useState } from 'react';
import { AutButton } from './AutButton';
import { BorderColor } from '@mui/icons-material';
import { pxToRem } from '../utils/utils';
import { useAppDispatch } from '../store/store.model';
import { userData } from '../store/user-data.reducer';

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color: theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
      },
    },
  },
}));

interface WebCompButtonProps extends ButtonProps {
  disconnectClick?: any;
  profileClick?: any;
  container: HTMLElement;
}

export const WebButton = ({ container, disconnectClick, profileClick, onClick }: WebCompButtonProps) => {
  const userData = useSelector(user);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMouseEnter = (event) => {
    if (anchorEl !== event.currentTarget && userData) {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleHideMenu = () => {
    setAnchorEl(null);
  };

  const handleDisconnectClick = () => {
    disconnectClick();
    handleHideMenu();
  };

  const handleProfileClick = () => {
    profileClick();
    handleHideMenu();
  };

  return (
    <>
      <AutButton
        variant="web"
        sx={{
          height: '55px',
          width: '270px',
          background: userData ? '#EBEBF2' : 'transparent',
          overflow: 'hidden',
          zIndex: '100',
        }}
        size="web"
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
      >
        {userData && (
          <Box sx={{ width: '100%', height: '100%', position: 'relative', p: '0px 20px' }}>
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
              <Box
                sx={{
                  height: '100%',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Box
                  sx={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Typography color="black" variant="button">
                    {userData?.name}
                  </Typography>
                </Box>
                <Box
                  component="img"
                  sx={{
                    height: '100%',
                    objectFit: 'cover',
                    width: '60px',
                    maxWidth: '100%',
                  }}
                  alt="User image."
                  // Make this not the badge
                  src={ipfsCIDToHttpUrl(userData.properties.avatar)}
                />
              </Box>
            </Box>
          </Box>
        )}
        {!userData && 'Connect Wallet'}
      </AutButton>
      <Menu
        sx={{
          '& .MuiPaper-root': {
            borderTop: '0px',
            width: '200px',
            borderColor: '#EBEBF2',
            backgroundColor: 'transparent',
            paddingBottom: '10px',
            paddingTop: '8px',
            ml: '32px',
            boxShadow: 'none',
          },
          '& .MuiMenu-list': {
            '&.MuiTouchRipple-child': {
              backgroundColor: '#89898C',
            },
            padding: '0px',
          },
          '.MuiBackdrop-root': {
            backdropFilter: 'none',
          },
          '.buttonOption': {
            borderTop: '0px',
            borderLeft: '0px',
            borderRight: '0px',
            borderBottom: '0px',
            borderColor: '#EBEBF2',
            backgroundColor: 'transparent',
            height: '32px',
            width: '100%',
            ':hover': {
              backgroundColor: '#EBEBF2',
              '.buttonOptionText': {
                color: 'black',
              },
            },
          },
        }}
        container={container}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleHideMenu}
        MenuListProps={{ onMouseLeave: handleHideMenu }}
      >
        <MenuItem sx={{ p: '0px', width: '100%' }}>
          <Button className="buttonOption" onClick={handleProfileClick}>
            <Typography align="right" className="buttonOptionText" variant="button">
              Profile
            </Typography>
          </Button>
        </MenuItem>
        <MenuItem sx={{ p: '0px', width: '100%' }}>
          <Button className="buttonOption" onClick={handleDisconnectClick}>
            <Typography align="right" className="buttonOptionText" variant="button">
              Disconnect
            </Typography>
          </Button>
        </MenuItem>
      </Menu>
    </>
  );
};
