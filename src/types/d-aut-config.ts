import { CamelCase } from './camel-case';

export interface SwAuthConfig<CSSObject> {
  container?: HTMLElement;
  buttonStyles?: CSSObject;
  dropdownStyles?: CSSObject;
  containerStyles?: CSSObject;
}

export enum AttributesDefinitions {
  'use-button-options' = 'boolean',
  'disable-create-new-user' = 'boolean',
  'partner-key' = 'string',
  'dao-expander' = 'string',
  'network' = 'string',
  'hide-button' = 'boolean',
  'button-type' = 'string',
  'rpc' = 'string',
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
export interface AutButtonProps<CSSObject> {
  attributes: SwAttributes;
  container: HTMLElement;
  buttonStyles?: CSSObject;
  dropdownStyles?: CSSObject;
  setAttrCallback: (fn: AttributeCallbackFn) => void;
}
