import { Box, Button, ButtonProps, debounce, Menu, MenuItem, MenuProps, Typography } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import { ipfsCIDToHttpUrl } from '../services/storage/storage.hub';
import { useSelector } from 'react-redux';
import { user } from '../store/aut.reducer';
import { useEffect, useRef, useState } from 'react';
import { AutButton } from './AutButton';
import { IPFSCusomtGateway } from '../store/wallet-provider';

const checkIfElementIntersects = (event: MouseEvent, element: HTMLElement) => {
  if (!element) return false;
  const rect = element.getBoundingClientRect();
  return event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
};

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
  const customIpfsGateway = useSelector(IPFSCusomtGateway);
  const [anchorEl, setAnchorEl] = useState(null);
  const buttonRef = useRef<HTMLButtonElement>();
  const menuRef = useRef<any>();

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!menuRef.current) {
        return;
      }
      const isOverBtn = checkIfElementIntersects(event, buttonRef.current);
      const isOverMenu = checkIfElementIntersects(event, menuRef.current);
      if (!isOverBtn && !isOverMenu) {
        setAnchorEl(null);
      }
    };
    const debounceFn = debounce(handleMouseMove, 100);
    window.addEventListener('mousemove', debounceFn);
    return () => {
      window.removeEventListener('mousemove', debounceFn);
    };
  }, []);

  const handleMouseEnter = (event) => {
    if (anchorEl !== buttonRef.current && userData) {
      setAnchorEl(buttonRef.current);
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
        ref={buttonRef}
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
                  src={ipfsCIDToHttpUrl(userData.properties.thumbnailAvatar, customIpfsGateway)}
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
            ml: '32px',
            boxShadow: 'none',
          },
          '& .MuiMenu-list': {
            '&.MuiTouchRipple-child': {
              backgroundColor: '#89898C',
            },
            padding: '8px 0px',
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
        ref={menuRef}
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
