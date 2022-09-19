import createCache, { EmotionCache } from '@emotion/cache';
import { OutputEventTypes } from '../types/event-types';
import { AttributesDefinitions, ShadowRootConfig, SwAttributes } from '../types/sw-auth-config';

export const createShadowElement = ({ container, className }): ShadowRootConfig<EmotionCache> => {
  const shadowRoot = container.attachShadow({ mode: 'closed' });
  const emotionRoot = document.createElement('style');

  const fontLink = document.createElement('link');
  fontLink.href = 'https://fonts.googleapis.com/css?family=Manrope';
  fontLink.rel = 'stylesheet';
  fontLink.type = 'text/css';

  const mountPoint = document.createElement('div');
  mountPoint.classList.add(className);

  const root = shadowRoot.appendChild(mountPoint);
  shadowRoot.insertBefore(fontLink, mountPoint);
  shadowRoot.insertBefore(emotionRoot, mountPoint);

  const cache = createCache({
    key: 'css',
    prepend: true,
    container: emotionRoot,
  });

  return {
    cache,
    root,
    shadowRoot,
    mountPoint,
  };
};

export const dispatchEvent = <T = any>(name: OutputEventTypes, payload: T = null): void => {
  const event = new CustomEvent(name, {
    composed: true,
    cancelable: true,
    bubbles: true,
    detail: payload,
  });
  window.dispatchEvent(event);
  console.info(`%c Event ${name} was dispatched with paylod ${payload}`, 'color: #000;font-weight:bold;background:#eee');
};

export const checkIfAttributeHasChanged = (prevValue: string, currValue: string) => {
  const hasPreviousValue = prevValue !== null && prevValue !== undefined && prevValue !== '';
  if (hasPreviousValue && prevValue === currValue) {
    return false;
  }
  return true;
};

export const toCammelCase = (name: string) => name.replace(/-([a-z])/g, (g) => g[1].toUpperCase());

export const parseAttributeValue = (name: string, value: any) => {
  const type = AttributesDefinitions[name];
  switch (type) {
    case 'boolean':
      return value === 'true';
    case 'number':
      return Number(value);
    default:
      return value;
  }
};

export const AttributeNames = Object.keys(AttributesDefinitions).reduce((prev, curr) => {
  prev[toCammelCase(curr)] = curr;
  return prev;
}, {} as SwAttributes);

export const extractAttributes = (nodeMap: HTMLElement): SwAttributes => {
  if (!nodeMap.attributes) {
    return {} as SwAttributes;
  }
  const htmlAttributes = [...(nodeMap.attributes as unknown as Attr[])];
  const attributes = htmlAttributes.reduce((prev, curr) => {
    const { name, value } = curr;
    const key = toCammelCase(name);
    const isKeySupported = AttributeNames[key];
    if (isKeySupported) {
      prev = {
        ...prev,
        [key]: parseAttributeValue(name, value),
      };
    }
    return prev;
  }, {});

  // console.log('Attributes: ', attributes);
  return attributes as SwAttributes;
};

export const isElement = (obj: HTMLElement) => {
  try {
    return obj instanceof HTMLElement;
  } catch (e) {
    return typeof obj === 'object' && obj.nodeType === 1 && typeof obj.style === 'object' && typeof obj.ownerDocument === 'object';
  }
};

export const toBase64 = (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

export const isBase64 = (str: string) => {
  if (str === '' || str.trim() === '') {
    return false;
  }
  try {
    return btoa(atob(str)) === str;
  } catch (err) {
    return false;
  }
};

export const base64toFile = (dataurl: string, filename: string) => {
  if (!dataurl) {
    throw new Error('No content was provided');
  }
  const [metadata, base64] = dataurl.split(',');
  const mime = metadata.match(/:(.*?);/)[1];

  if (!isBase64(base64)) {
    throw new Error('Content provided is not of base64');
  }
  const bstr = atob(base64);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  // eslint-disable-next-line no-plusplus
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
};
