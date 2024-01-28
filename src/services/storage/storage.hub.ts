import { env } from '../web3/env';

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

function replaceAll(str, find, replace) {
  return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

export function ipfsCIDToHttpUrl(url: string, customGateway: string = null, isJson = false) {
  if (!url) {
    return url;
  }
  if (!url.includes('https://'))
    return isJson
      ? `${customGateway || env.REACT_APP_IPFS_GATEWAY_URL}/${replaceAll(url, 'ipfs://', '')}/metadata.json`
      : `${customGateway || env.REACT_APP_IPFS_GATEWAY_URL}/${replaceAll(url, 'ipfs://', '')}`;
  return url;
}
