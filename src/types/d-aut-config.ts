/* eslint-disable @typescript-eslint/no-duplicate-enum-values */
import { IAutButtonConfig } from '../components/AutButtonMenu/AutMenuUtils';
import { CamelCase } from './camel-case';

export interface SwAuthConfig<CSSObject> {
  container?: HTMLElement;
  config: IAutButtonConfig;
  containerStyles?: CSSObject;
}

export enum FlowConfigMode {
  Dashboard = 'dashboard',
  TryAut = 'tryAut',
  FreeMode = 'freeMode',
}

export interface FlowConfig {
  mode?: FlowConfigMode;
  customCongratsMessage?: string;
}

export enum AttributesDefinitions {
  'use-dev' = 'boolean',
  'nova-address' = 'string',
  'hide-button' = 'boolean',
  'ipfs-gateway' = 'string',
  'menu-items' = 'object',
  'network' = 'object',
  'flow-config' = 'object',
  'allowed-role-id' = 'string',
}

type EnumKeys = keyof typeof AttributesDefinitions;
export type SwElementAttributes = { [key in EnumKeys]: unknown | boolean | string | number };
export type SwAttributes = {
  [K in keyof SwElementAttributes as CamelCase<K>]: SwElementAttributes[K];
};

export interface ShadowRootConfig<EmotionCache> {
  cache: EmotionCache;
  root: HTMLElement;
  shadowRoot: HTMLElement;
  mountPoint: HTMLElement;
}

export type AttributeCallbackFn = (name: string, value: string, newVal: string) => void;
export interface AutButtonProps {
  attributes: SwAttributes;
  container: HTMLElement;
  config: IAutButtonConfig;
  setAttrCallback: (fn: AttributeCallbackFn) => void;
}
