/* eslint-disable react/no-unstable-nested-components */
import { Avatar, Stack, Typography, Button, Menu, MenuItem, Theme, PaletteColor, darken, lighten, Collapse, Slide } from '@mui/material';
import { useMemo, useState, MouseEventHandler, memo, useCallback, useRef } from 'react';
import { dispatchEvent } from '../../utils/utils';
import { useTheme } from '@emotion/react';
import { AutButtonConfig, AutButtonUserProfile, AutMenuItemType, IAutButtonConfig, MenuItemActionType, lightOrDark } from './AutMenuUtils';

export interface AutButtonMenuProps {
  config?: IAutButtonConfig;
  user?: AutButtonUserProfile;
  menuItems: AutMenuItemType[];
  container: HTMLElement;
  onMainBtnClick: MouseEventHandler<HTMLElement>;
}

const AutButtonMenu = ({ onMainBtnClick, user: userData, container, config: configData, menuItems = [] }: AutButtonMenuProps) => {
  const theme: Theme = useTheme() as Theme;
  const [menuRef, setMenuRef] = useState<HTMLElement>();

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    if (!Object.keys(userData || {}).length) {
      onMainBtnClick(event);
    } else {
      setMenuRef(event.currentTarget);
    }
  };

  const handleClose = () => setMenuRef(null);

  const user = useMemo(() => userData || ({} as AutButtonUserProfile), [userData]);
  const config = useMemo(() => new AutButtonConfig(configData), [configData]);

  const baseColor: PaletteColor = useMemo(() => {
    let palette = theme.palette[config.theme.color];
    if (!palette) {
      // generate new palette
      palette = theme.palette.augmentColor({
        color: {
          main: config.theme.color,
        },
      });
    }
    return palette;
  }, [config, theme]);

  const lightOrDarkHover = useCallback(
    (opacity) => {
      if (lightOrDark(baseColor.main) === 'dark') {
        return lighten(baseColor.main, opacity);
      }
      return darken(baseColor.main, opacity);
    },
    [baseColor]
  );

  const buttonStyles = useMemo(() => {
    const marginOffset = 2;
    let borderRadius = 0;
    if (config?.shape?.bordered) {
      borderRadius = Math.floor((config.size.height + marginOffset) / 2);
      if (config?.shape?.bordered && config.shape?.borderSize) {
        borderRadius = config.shape?.borderSize;
      }
    }

    const mrStackOffset = 2;
    const pxBtnOffset = config.size.padding * 2;
    return {
      borderRadius,
      width: config.size.width + marginOffset, // margin,
      height: config.size.height + marginOffset, // margin,
      padding: config.size.padding,
      titleMaxWidth: `calc(${config.size.width - config.size.height - marginOffset}px - ${theme.spacing(pxBtnOffset)} - ${theme.spacing(
        mrStackOffset
      )})`,
    };
  }, [config]);

  const menuStyles = useMemo(() => {
    let borderRadius = 0;
    if (config?.menuShape?.bordered) {
      borderRadius = Math.floor(buttonStyles.height / 2);
      if (config?.menuShape?.bordered && config.menuShape?.borderSize) {
        borderRadius = config.menuShape?.borderSize;
      }
    }

    return {
      borderRadius,
      width: config?.menuSize?.width,
      padding: config?.size?.padding || config?.menuSize?.padding,
    };
  }, [config, buttonStyles]);

  const btnContent = useMemo(() => {
    if (!Object.keys(user).length) {
      return (
        <Typography
          sx={{
            color: baseColor.contrastText,
          }}
          lineHeight="1"
          variant="subtitle2"
        >
          {config?.defaultText}
        </Typography>
      );
    }
    return (
      <>
        <Stack mr={2} width="100%" textAlign="end" alignItems={config.textAlignment === 'left' ? 'flex-start' : 'flex-end'}>
          <Typography
            lineHeight="1"
            variant="subtitle2"
            fontWeight="bold"
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis"
            sx={{
              color: baseColor.contrastText,
            }}
            maxWidth={buttonStyles.titleMaxWidth}
          >
            {user.name}
          </Typography>
          {user.role && (
            <Typography
              sx={{
                mt: 0.5,
                lineHeight: 1,
                opacity: 0.6, // @TODO: find a better way to grey out the text
                color: baseColor.contrastText,
              }}
              variant="body"
            >
              {user.role}
            </Typography>
          )}
        </Stack>
        <Avatar
          sx={{
            height: `${buttonStyles.height - 6}px`,
            width: `${buttonStyles.height - 6}px`,
            oveflow: 'hidden',
          }}
          src={user.avatar}
        />
      </>
    );
  }, [user, config, baseColor, buttonStyles]);

  return (
    <>
      <Button
        disableRipple
        sx={{
          margin: '1px',
          boxShadow: 1,
          border: '1px solid',
          textTransform: 'capitalize',
          transition: theme.transitions.create(['background-color', 'box-shadow', 'border-color', 'border-radius', 'color'], {
            duration: theme.transitions.duration.standard,
          }),
          px: buttonStyles.padding,
          height: `${buttonStyles.height}px`,
          maxHeight: `${buttonStyles.height}px`,
          width: `${buttonStyles.width}px`,
          borderRadius: `${buttonStyles.borderRadius}px`,
          borderColor: lightOrDarkHover(theme.palette.action.activatedOpacity),
          backgroundColor: baseColor.main,
          ...(!!menuRef && {
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            backgroundColor: lightOrDarkHover(theme.palette.action.hoverOpacity),
          }),
          '&:hover': {
            backgroundColor: lightOrDarkHover(theme.palette.action.hoverOpacity),
          },
        }}
        onClick={handleOpen}
      >
        {btnContent}
      </Button>
      <Menu
        id="daut-btn-menu"
        container={container}
        anchorEl={menuRef}
        open={!!menuRef}
        transformOrigin={{
          horizontal: 'left',
          vertical: 'top',
        }}
        transitionDuration={theme.transitions.duration.standard}
        onClose={handleClose}
        elevation={1}
        sx={{
          '.MuiPaper-root': {
            width: `${menuStyles.width}px`,
            border: '1px solid',
            borderTop: 0,
            borderBottomLeftRadius: `${menuStyles.borderRadius}px`,
            borderBottomRightRadius: `${menuStyles.borderRadius}px`,
            borderColor: lightOrDarkHover(theme.palette.action.hoverOpacity),
            backgroundColor: lightOrDarkHover(theme.palette.action.hoverOpacity),
          },
        }}
      >
        {menuItems.map((menu: AutMenuItemType) => {
          let props = {};
          if (menu.actionType === MenuItemActionType.Default) {
            props = {
              onClick: (e: React.MouseEvent<HTMLElement>) => {
                handleClose();
                menu.onClick(e);
              },
            };
          } else if (menu.actionType === MenuItemActionType.EventEmit) {
            // emit event
            props = {
              onClick: () => {
                dispatchEvent(menu.eventName as any, menu);
                handleClose();
              },
            };
          } else if (menu.actionType === MenuItemActionType.ExternalLink) {
            // go to external link
            props = {
              onClick: () => {
                handleClose();
                window.open(menu.link, '_blank');
              },
            };
          }
          return (
            <MenuItem
              key={`aut_menu_key_${menu.name}_${menu.actionType}`}
              sx={{
                color: 'white',
                px: menuStyles.padding,
                height: `${buttonStyles.height / 1.5}px`,
                justifyContent: config.menuTextAlignment === 'left' ? 'flex-start' : 'flex-end',
                '&:hover': {
                  backgroundColor: lightOrDarkHover(theme.palette.action.selectedOpacity),
                },
              }}
              {...props}
            >
              <Typography
                sx={{
                  color: baseColor.contrastText,
                }}
                variant="subtitle2"
              >
                {menu.name}
              </Typography>
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
};

export default memo(AutButtonMenu);
