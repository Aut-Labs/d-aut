/* eslint-disable no-bitwise */
/* eslint-disable prefer-destructuring */
import { MouseEventHandler } from 'react';

type AutButtonSizes = 'default' | 'large' | 'extraLarge';

interface AutButtonTheme {
  color: string;
  type: 'light' | 'dark' | 'main';
}

interface AutButtonSize {
  width: number;
  padding: number;
  height: number;
}

interface AutButtonShape {
  bordered?: boolean;
  borderSize?: number;
}

interface AutMenuSize {
  width: number;
  padding: number;
}

interface AutMenuShape {
  bordered?: boolean;
  borderSize?: number;
}

interface DefaultMenuItemType {
  name: string;
  actionType: MenuItemActionType.Default;
  onClick: MouseEventHandler<any> | undefined;
}

interface ExternalLinkMenuItemType {
  name: string;
  actionType: MenuItemActionType.ExternalLink;
  link: string;
}

interface EventMenuItemType {
  name: string;
  actionType: MenuItemActionType.EventEmit;
  eventName: string;
}

export interface AutButtonUserProfile {
  name: string;
  role: string;
  avatar: string;
}

export interface IAutButtonConfig {
  defaultText?: string;
  theme: AutButtonTheme;
  size?: AutButtonSizes | AutButtonSize;
  textAlignment?: 'left' | 'right';
  shape?: AutButtonShape;
  menuSize?: AutMenuSize;
  menuShape?: AutMenuShape;
  menuTextAlignment?: 'left' | 'right';
}

export class AutButtonConfig {
  defaultText: string;

  theme: AutButtonTheme;

  size: AutButtonSize;

  shape: AutButtonShape;

  textAlignment: 'left' | 'right';

  menuSize: AutMenuSize;

  menuShape: AutMenuShape;

  menuTextAlignment: 'left' | 'right';

  private _defaultTheme: AutButtonTheme = {
    color: 'info',
    type: 'light',
  };

  private _defaultShape: AutButtonShape = {
    bordered: true,
  };

  private _defaultMenuShape: AutButtonShape = {
    bordered: true,
  };

  private _defaultSizes: { [key in AutButtonSizes]: AutButtonSize } = {
    default: {
      width: 200,
      padding: 3,
      height: 55,
    },
    large: {
      width: 255,
      padding: 4,
      height: 72,
    },
    extraLarge: {
      width: 280,
      padding: 5,
      height: 80,
    },
  };

  constructor(config: IAutButtonConfig) {
    if (!config) config = {} as IAutButtonConfig;
    this.defaultText = config?.defaultText || 'Connect Wallet';
    this.textAlignment = config.textAlignment || 'right';
    this.menuTextAlignment = config.menuTextAlignment || 'left';
    this.theme = {
      ...this._defaultTheme,
      ...(config.theme || {}),
    };

    this.shape = {
      ...this._defaultShape,
      ...(config.shape || {}),
    };

    this.menuShape = {
      ...this._defaultMenuShape,
      borderSize: this.shape.borderSize / 2,
      ...(config.menuShape || {}),
    };

    if (config.size) {
      if (typeof config.size === 'string' && this._defaultSizes[config.size]) {
        this.size = this._defaultSizes[config.size];
      } else {
        this.size = config.size as AutButtonSize;
      }
    } else {
      this.size = this._defaultSizes.large;
    }

    if (config.menuSize) {
      if (typeof config.menuSize === 'string' && config.menuSize === 'inherit') {
        this.menuSize = this.size;
      } else {
        this.menuSize = config.menuSize as AutMenuSize;
      }
    } else {
      this.menuSize = this.size;
    }
  }
}
export enum MenuItemActionType {
  Default = 'default',
  ExternalLink = 'external_link',
  EventEmit = 'event_emit',
}

export type AutMenuItemType = DefaultMenuItemType | ExternalLinkMenuItemType | EventMenuItemType;

export const getValueInRange = (value: number, defaultValue: number, min = 0, max = 1) => {
  if (value < min || value > max) {
    return defaultValue;
  }
  return value;
};

export const lightOrDark = (color: any) => {
  let r = null;
  let g = null;
  let b = null;
  let hsp = null;
  // Check the format of the color, HEX or RGB?
  if (color.match(/^rgb/)) {
    // If HEX --> store the red, green, blue values in separate variables
    color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
    r = color[1];
    g = color[2];
    b = color[3];
  } else {
    // If RGB --> Convert it to HEX: http://gist.github.com/983661
    color = +`0x${color.slice(1).replace(color.length < 5 && /./g, '$&$&')}`;

    r = color >> 16;
    g = (color >> 8) & 255;
    b = color & 255;
  }

  // HSP equation from http://alienryderflex.com/hsp.html
  hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));

  // Using the HSP value, determine whether the color is light or dark
  if (hsp > 127.5) {
    return 'light';
  }
  return 'dark';
};
