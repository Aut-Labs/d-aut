import axios from 'axios';
import { env } from './env';
import { ethers } from 'ethers';

export const AUTH_TOKEN_KEY = 'user-access-token';

export const authoriseWithWeb3 = async (signer: ethers.providers.JsonRpcSigner): Promise<boolean> => {
  try {
    const account = await signer.getAddress();
    const responseNonce = await axios.get(`${env.REACT_APP_API_URL}/autID/user/nonce/${account}`);

    const { nonce } = responseNonce.data;

    const signature = await signer.signMessage(`${nonce}`);

    const jwtResponse = await axios.post(`${env.REACT_APP_API_URL}/autID/user/getToken`, {
      address: account,
      signature,
    });
    localStorage.setItem(AUTH_TOKEN_KEY, jwtResponse.data.token);
    const isAuthorised = !!jwtResponse.data.token;
    return isAuthorised;
  } catch (error) {
    return false;
  }
};
